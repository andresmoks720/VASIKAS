import { useCallback } from "react";

import { usePolling } from "@/services/polling/usePolling";
import { ENV } from "@/shared/env";
import { Drone } from "./droneTypes";
import { buildSnapshotDronesUrl } from "./droneUrlHelper";
import { mapSnapshotDroneDtoToDomain, SnapshotDronesResponseDto } from "./droneSnapshotTypes";

function parseSnapshotResponse(raw: unknown): Drone[] {
    if (typeof raw !== "object" || raw === null || !("drones" in raw) || !Array.isArray((raw as any).drones)) {
        throw new Error("Invalid snapshot response: must contain 'drones' array");
    }

    const dto = raw as SnapshotDronesResponseDto;
    const ingestTimeUtc = new Date().toISOString();

    return dto.drones.map((d) => mapSnapshotDroneDtoToDomain(d, ingestTimeUtc));
}

export function useDronesSnapshotStream() {
    const useMocks = ENV.useMocks();

    // Base URL determination:
    // If mocks enabled (and we are here, presuming snapshot mode is active or user explicitly wants snapshot client),
    // we check if we should map to static file or live mock server.
    // The requirement says:
    // "If VITE_USE_MOCKS=1, default to existing /mock/drones.json ONLY in track mode."
    // "In snapshot mode, default should be http://localhost:8787/v1/drones"
    // So if useMocks is true, we still use the live mock server for snapshots, NOT the static json (which is track-based).
    // Unless user overrides VITE_DRONE_SNAPSHOT_URL.

    const baseUrl = ENV.drones.snapshotUrl();

    const url = buildSnapshotDronesUrl(baseUrl, {
        centerLat: ENV.drones.centerLat(),
        centerLon: ENV.drones.centerLon(),
        radiusM: ENV.drones.radiusM(),
        n: ENV.drones.n(),
        periodS: ENV.drones.periodS(),
    });

    const pollMs = ENV.poll.dronesMs();

    const mapper = useCallback((raw: unknown) => parseSnapshotResponse(raw), []);

    console.log(`[droneSnapshotClient] Using URL: ${url}`);
    const polled = usePolling<Drone[]>(`drones-snapshot:${url}`, url, pollMs, mapper);

    return { ...polled };
}
