import { useCallback } from "react";

import { usePolling } from "@/services/polling/usePolling";
import { mapSensorDtos, Sensor, SensorDto } from "./sensorsTypes";

const DEFAULT_POLL_MS = 1000;

function parsePollInterval(raw?: string): number {
  const parsed = Number(raw);

  return Number.isFinite(parsed) && parsed > 0 ? parsed : DEFAULT_POLL_MS;
}

function parseSensorResponse(raw: unknown, ingestTimeUtc: string): Sensor[] {
  if (!Array.isArray(raw)) {
    throw new Error("Sensor response must be an array");
  }

  return mapSensorDtos(raw as SensorDto[], ingestTimeUtc);
}

export function useSensorsStream() {
  const url = import.meta.env.VITE_SENSORS_URL ?? "/mock/sensors.json";
  const pollMs = parsePollInterval(import.meta.env.VITE_POLL_SENSORS_MS);

  const mapper = useCallback((raw: unknown) => {
    const ingestTimeUtc = new Date().toISOString();
    return parseSensorResponse(raw, ingestTimeUtc);
  }, []);

  return usePolling<Sensor[]>(`sensors:${url}`, url, pollMs, mapper);
}
