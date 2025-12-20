import { useCallback, useEffect, useMemo, useState } from "react";

import { usePolling } from "@/services/polling/usePolling";
import { chooseDataUrl, shouldUseMocks } from "@/shared/env";
import { computeDroneAtTime } from "./droneMotion";
import { Drone, DroneTrack, DroneTrackDto, mapDroneTrackDtos } from "./droneTypes";

const DEFAULT_POLL_MS = 1000;
const MOTION_TICK_MS = 1000;

function parsePollInterval(rawInterval?: string): number {
  const parsed = Number(rawInterval);

  return Number.isFinite(parsed) && parsed > 0 ? parsed : DEFAULT_POLL_MS;
}

function parseDroneResponse(raw: unknown): DroneTrack[] {
  if (!Array.isArray(raw)) {
    throw new Error("Drone response must be an array");
  }

  return mapDroneTrackDtos(raw as DroneTrackDto[]);
}

export function useDronesStream() {
  const useMocks = shouldUseMocks();
  const url = chooseDataUrl(useMocks, import.meta.env.VITE_DRONE_URL, "/mock/drones.json");
  const pollMs = parsePollInterval(import.meta.env.VITE_POLL_DRONES_MS);
  const [motionTick, setMotionTick] = useState(0);

  const mapper = useCallback((raw: unknown) => parseDroneResponse(raw), []);

  const polled = usePolling<DroneTrack[]>(`drones:${url}`, url, pollMs, mapper);

  useEffect(() => {
    const timer = window.setInterval(() => {
      setMotionTick((tick) => tick + 1);
    }, MOTION_TICK_MS);

    return () => {
      window.clearInterval(timer);
    };
  }, []);

  const drones = useMemo(() => {
    if (!polled.data) {
      return null;
    }

    void motionTick;
    const nowUtc = new Date().toISOString();
    return polled.data.map((track) => computeDroneAtTime(track, nowUtc, nowUtc));
  }, [polled.data, motionTick]);

  return { ...polled, data: drones as Drone[] | null };
}
