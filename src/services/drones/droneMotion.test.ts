import { describe, expect, it } from "vitest";

import { computeDroneAtTime } from "./droneMotion";
import { DroneTrack } from "./droneTypes";

const TRACK: DroneTrack = {
  id: "drone-001",
  label: "Demo",
  track: [
    {
      timeUtc: "2025-12-18T10:15:30Z",
      position: { lon: 24.75, lat: 59.43 },
      headingDeg: 90,
      speedMps: 10,
      altitude: { meters: 80, ref: "AGL", source: "reported", comment: "track sample" },
    },
    {
      timeUtc: "2025-12-18T10:15:40Z",
      position: { lon: 24.755, lat: 59.432 },
      headingDeg: 120,
      speedMps: 12,
      altitude: { meters: 90, ref: "AGL", source: "reported", comment: "track sample" },
    },
    {
      timeUtc: "2025-12-18T10:15:50Z",
      position: { lon: 24.76, lat: 59.431 },
      headingDeg: 180,
      speedMps: 11,
      altitude: { meters: 95, ref: "AGL", source: "reported", comment: "track sample" },
    },
  ],
};

describe("computeDroneAtTime", () => {
  it("interpolates position and motion between samples", () => {
    const nowUtc = "2025-12-18T10:15:35Z";
    const ingestTimeUtc = "2025-12-18T10:15:35Z";

    const drone = computeDroneAtTime(TRACK, nowUtc, ingestTimeUtc);

    expect(drone.position.lon).toBeCloseTo(24.7525, 6);
    expect(drone.position.lat).toBeCloseTo(59.431, 6);
    expect(drone.headingDeg).toBeGreaterThan(90);
    expect(drone.headingDeg).toBeLessThanOrEqual(120);
    expect(drone.speedMps).toBeCloseTo(11, 6);
    expect(drone.altitude.meters).toBeCloseTo(85);
    expect(drone.eventTimeUtc).toBe(new Date(nowUtc).toISOString());
    expect(drone.ingestTimeUtc).toBe(ingestTimeUtc);
  });

  it("wraps across the track duration", () => {
    const nowUtc = "2025-12-18T10:16:05Z"; // 35s after start -> wraps to 5s into track
    const ingestTimeUtc = "2025-12-18T10:16:05Z";

    const drone = computeDroneAtTime(TRACK, nowUtc, ingestTimeUtc);

    expect(drone.position.lon).toBeCloseTo(24.7575, 6);
    expect(drone.position.lat).toBeCloseTo(59.4315, 6);
  });

  it("returns the first sample when only one point is present", () => {
    const nowUtc = "2025-12-18T10:15:35Z";
    const ingestTimeUtc = "2025-12-18T10:15:35Z";
    const singlePoint: DroneTrack = {
      id: "drone-002",
      label: "Solo",
      track: [
        {
          timeUtc: "2025-12-18T10:15:30Z",
          position: { lon: 24.7, lat: 59.4 },
          headingDeg: 45,
          speedMps: 0,
          altitude: { meters: null, ref: "AGL", source: "reported", comment: "track sample" },
        },
      ],
    };

    const drone = computeDroneAtTime(singlePoint, nowUtc, ingestTimeUtc);

    expect(drone.position.lon).toBeCloseTo(24.7, 6);
    expect(drone.altitude.meters).toBeNull();
    expect(drone.eventTimeUtc).toBe(singlePoint.track[0].timeUtc);
  });

  it("throws on invalid timestamp input", () => {
    const ingestTimeUtc = "2025-12-18T10:15:35Z";

    expect(() => computeDroneAtTime(TRACK, "invalid", ingestTimeUtc)).toThrowError(/invalid/i);
  });

  it("throws on empty track data", () => {
    const ingestTimeUtc = "2025-12-18T10:15:35Z";

    expect(() => computeDroneAtTime({ ...TRACK, track: [] }, "2025-12-18T10:15:35Z", ingestTimeUtc)).toThrowError();
  });
});
