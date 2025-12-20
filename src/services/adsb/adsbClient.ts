import { useCallback, useEffect, useMemo, useState } from "react";

import { usePolling } from "@/services/polling/usePolling";
import { ENV } from "@/shared/env";
import { computeAircraftAtTime } from "./adsbMotion";
import { AdsbTrack, AdsbTrackDto, mapAdsbTrackDtos } from "./adsbTypes";

const DEFAULT_POLL_MS = 10000;
const MOTION_TICK_MS = 1000;

function parsePollInterval(raw?: string | number): number {
  const parsed = Number(raw);

  return Number.isFinite(parsed) && parsed > 0 ? parsed : DEFAULT_POLL_MS;
}

function parseAdsbResponse(raw: unknown): AdsbTrack[] {
  if (!Array.isArray(raw)) {
    throw new Error("ADS-B response must be an array");
  }

  return mapAdsbTrackDtos(raw as AdsbTrackDto[]);
}

export function useAdsbStream() {
  const useMocks = ENV.useMocks();
  const url = useMocks ? "/mock/adsb.json" : ENV.adsbUrl();
  const pollMs = parsePollInterval(ENV.poll.adsbMs());
  const [motionTick, setMotionTick] = useState(0);

  const mapper = useCallback((raw: unknown) => parseAdsbResponse(raw), []);

  const polled = usePolling<AdsbTrack[]>(`adsb:${url}`, url, pollMs, mapper);

  useEffect(() => {
    const timer = window.setInterval(() => {
      setMotionTick((tick) => tick + 1);
    }, MOTION_TICK_MS);

    return () => {
      window.clearInterval(timer);
    };
  }, []);

  const aircraft = useMemo(() => {
    if (!polled.data) {
      return null;
    }

    void motionTick;
    const nowUtc = new Date().toISOString();

    return polled.data.map((track) => computeAircraftAtTime(track, nowUtc, nowUtc));
  }, [polled.data, motionTick]);

  return { ...polled, data: aircraft };
}
