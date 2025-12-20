import { useCallback, useEffect, useMemo, useState } from "react";

import { usePolling } from "@/services/polling/usePolling";
import { computeAircraftAtTime } from "./adsbMotion";
import { Aircraft, AdsbTrack, AdsbTrackDto, mapAdsbTrackDtos } from "./adsbTypes";

const DEFAULT_POLL_MS = 10000;
const MOTION_TICK_MS = 1000;

function parsePollInterval(raw?: string): number {
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
  const url = import.meta.env.VITE_ADSB_URL ?? "/mock/adsb.json";
  const pollMs = parsePollInterval(import.meta.env.VITE_POLL_ADSB_MS);
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

    const nowUtc = new Date().toISOString();

    return polled.data.map((track) => computeAircraftAtTime(track, nowUtc, nowUtc));
  }, [polled.data, motionTick]);

  return { ...polled, data: aircraft };
}
