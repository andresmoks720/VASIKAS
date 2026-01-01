import { useCallback, useEffect, useMemo, useState } from "react";

import { usePolling } from "@/services/polling/usePolling";
import { ENV } from "@/shared/env";
import { mapSensorDto, mapSensorDtos, Sensor, SensorDto } from "./sensorsTypes";
import { sensorStore } from "./sensorStore";

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

  // We use a ref or just read from store directly in the mapper if we want to catch updates?
  // Ideally, we want the stream to update when EITHER the poll brings new data OR the store changes.
  // The current usePolling hook only updates on poll.
  // To handle local updates instantly, we might need a composite hook or just merge in the UI.
  // But the plan says "merge baseSensors + userSensors... in sensor client layer".
  // `usePolling` returns state.

  // Let's rely on the fact that `usePolling` re-runs the mapper on fetch.
  // But if we add a user sensor, we want it to show up immediately, not wait for the next poll.
  // AND `sensorStore` updates are not reactive by themselves here unless we subscribe.

  // NOTE: For Phase 2, strictly following "merge in client layer" with `usePolling` might be tricky for *instant* UI feedback
  // unless we force a re-render.
  // However, simpler approach:
  // 1. Let `usePolling` handle the REMOTE/BASE stuff.
  // 2. Wrap it here to merge with local store state.

  const mapper = useCallback((raw: unknown) => {
    const ingestTimeUtc = new Date().toISOString();
    return parseSensorResponse(raw, ingestTimeUtc);
  }, []);

  const { data: baseSensors, ...rest } = usePolling<Sensor[]>(`sensors:${url}`, url, pollMs, mapper);

  // Subscribe to store updates to force re-render when user sensors change.
  // We use a simple counter to force update because we construct the merged array in useMemo.
  const [storeVersion, setStoreVersion] = useState(0);

  useEffect(() => {
    return sensorStore.subscribe(() => {
      setStoreVersion((v) => v + 1);
    });
  }, []);

  const merged = useMemo(() => {
    void storeVersion;
    const userSensorsDtos = sensorStore.getAll();
    const userSensors: Sensor[] = userSensorsDtos.map(({ createdAtUtc, updatedAtUtc, ...dto }) =>
      mapSensorDto(dto, updatedAtUtc ?? createdAtUtc ?? new Date().toISOString(), "user"),
    );
    return [...(baseSensors ?? []), ...userSensors];
  }, [baseSensors, storeVersion]); // Re-calculate when base polling updates OR store updates

  return { data: merged, ...rest };
}
