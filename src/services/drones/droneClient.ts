import { useCallback, useRef } from "react";

import { usePolling } from "@/services/polling/usePolling";
import { Drone, DroneDto, LonLat, mapDroneDtos } from "./droneTypes";

const DEFAULT_POLL_MS = 1000;
const DEMO_PATH: LonLat[] = [
  { lon: 24.7536, lat: 59.4369 },
  { lon: 24.7565, lat: 59.439 },
  { lon: 24.7605, lat: 59.4372 },
  { lon: 24.7568, lat: 59.4348 },
  { lon: 24.7525, lat: 59.4355 },
];

function parsePollInterval(rawInterval?: string): number {
  const parsed = Number(rawInterval);

  return Number.isFinite(parsed) && parsed > 0 ? parsed : DEFAULT_POLL_MS;
}

function bearingDegrees(from: LonLat, to: LonLat): number {
  const dLon = to.lon - from.lon;
  const dLat = to.lat - from.lat;
  const heading = (Math.atan2(dLon, dLat) * 180) / Math.PI;

  return (heading + 360) % 360;
}

export function applyDemoMotion(drones: Drone[], tick: number): Drone[] {
  if (!drones.length) {
    return drones;
  }

  const stepIndex = tick % DEMO_PATH.length;
  const target = DEMO_PATH[stepIndex];
  const previous = DEMO_PATH[(stepIndex + DEMO_PATH.length - 1) % DEMO_PATH.length];
  const nextHeading = bearingDegrees(previous, target);

  const [first, ...rest] = drones;
  const updatedFirst: Drone = {
    ...first,
    position: target,
    headingDeg: Number.isFinite(nextHeading) ? nextHeading : first.headingDeg,
  };

  return [updatedFirst, ...rest];
}

function parseDroneResponse(raw: unknown, ingestTimeUtc: string): Drone[] {
  if (!Array.isArray(raw)) {
    throw new Error("Drone response must be an array");
  }

  return mapDroneDtos(raw as DroneDto[], ingestTimeUtc);
}

export function useDronesStream() {
  const url = import.meta.env.VITE_DRONE_URL ?? "/mock/drones.json";
  const pollMs = parsePollInterval(import.meta.env.VITE_POLL_DRONES_MS);
  const enableDemoMotion = (import.meta.env.VITE_USE_MOCKS ?? "1") !== "0";
  const tickRef = useRef(0);

  const mapper = useCallback(
    (raw: unknown) => {
      const ingestTimeUtc = new Date().toISOString();
      const mapped = parseDroneResponse(raw, ingestTimeUtc);
      tickRef.current += 1;

      return enableDemoMotion ? applyDemoMotion(mapped, tickRef.current) : mapped;
    },
    [enableDemoMotion],
  );

  return usePolling<Drone[]>(`drones:${url}`, url, pollMs, mapper);
}
