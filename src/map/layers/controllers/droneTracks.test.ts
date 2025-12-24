import { describe, expect, it } from "vitest";

import { buildPlaceholderDroneTracks } from "./droneTracks";

describe("buildPlaceholderDroneTracks", () => {
  it("creates placeholder tracks only for visible drones", () => {
    const drones = [
      {
        id: "drone-1",
        label: "Alpha",
        position: { lon: 24.1, lat: 59.2 },
        headingDeg: 0,
        speedMps: 5,
        altitude: { meters: 10, ref: "AGL" as const, source: "reported" as const, comment: "mock" },
        eventTimeUtc: "2024-01-01T00:00:00Z",
        ingestTimeUtc: "2024-01-01T00:00:00Z",
      },
      {
        id: "drone-2",
        label: "Beta",
        position: { lon: 24.3, lat: 59.4 },
        headingDeg: 0,
        speedMps: 5,
        altitude: { meters: 20, ref: "AGL" as const, source: "reported" as const, comment: "mock" },
        eventTimeUtc: "2024-01-01T00:00:00Z",
        ingestTimeUtc: "2024-01-01T00:00:00Z",
      },
    ];

    const visible = new Set<string>(["drone-2"]);
    const tracks = buildPlaceholderDroneTracks(drones, visible);

    expect(tracks.has("drone-1")).toBe(false);
    expect(tracks.has("drone-2")).toBe(true);

    const points = tracks.get("drone-2");
    expect(points).toHaveLength(2);
    expect(points?.[0]).toEqual({ position: { lon: 24.299, lat: 59.399 } });
    expect(points?.[1]).toEqual({ position: { lon: 24.3, lat: 59.4 } });
  });
});
