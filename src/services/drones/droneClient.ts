import { useCallback, useEffect, useMemo, useState } from "react";

import { usePolling } from "@/services/polling/usePolling";
import { ENV } from "@/shared/env";
import { computeDroneAtTime } from "./droneMotion";
import { Drone, DroneTrack, DroneTrackDto, mapDroneTrackDtos } from "./droneTypes";

const DEFAULT_POLL_MS = 1000;
const MOTION_TICK_MS = 1000;

function parsePollInterval(rawInterval?: string | number): number {
  const parsed = Number(rawInterval);

  return Number.isFinite(parsed) && parsed > 0 ? parsed : DEFAULT_POLL_MS;
}

function parseDroneResponse(raw: unknown): DroneTrack[] {
  if (Array.isArray(raw)) {
    return mapDroneTrackDtos(raw as DroneTrackDto[]);
  }

  if (typeof raw === "object" && raw !== null && "drones" in raw && Array.isArray((raw as { drones: unknown }).drones)) {
    return mapDroneTrackDtos((raw as { drones: DroneTrackDto[] }).drones);
  }

  throw new Error("Drone response must be an array or { drones: [] } envelope");
}

export function useDronesStream() {
  const useMocks = ENV.useMocks();
  const url = useMocks ? "/mock/drones.json" : ENV.droneUrl();
  const pollMs = parsePollInterval(ENV.poll.dronesMs());
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
