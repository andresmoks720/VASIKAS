import { useCallback } from "react";

import { usePolling } from "@/services/polling/usePolling";
import { ENV } from "@/shared/env";
import { mapSensorDtos, Sensor, SensorDto } from "./sensorsTypes";

const DEFAULT_POLL_MS = 1000;

function parsePollInterval(raw?: string | number): number {
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
  const useMocks = ENV.useMocks();
  const url = useMocks ? "/mock/sensors.json" : ENV.sensorsUrl();
  const pollMs = parsePollInterval(ENV.poll.sensorsMs());

  const mapper = useCallback((raw: unknown) => {
    const ingestTimeUtc = new Date().toISOString();
    return parseSensorResponse(raw, ingestTimeUtc);
  }, []);

  return usePolling<Sensor[]>(`sensors:${url}`, url, pollMs, mapper);
}
