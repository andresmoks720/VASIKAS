import { describe, expect, it } from "vitest";

import { computeAircraftAtTime } from "./adsbMotion";
import { AdsbTrack } from "./adsbTypes";

const TRACK: AdsbTrack = {
  id: "4ca123",
  callsign: "FIN123",
  t0Utc: "2025-12-18T10:15:20Z",
  durationSec: 60,
  track: [
    {
      offsetSec: 0,
      position: { lon: 24.832, lat: 59.413 },
      trackDeg: 270,
      groundSpeedKmh: 720,
      altitude: { meters: 3500, ref: "MSL", source: "reported", comment: "ADS-B reported" },
    },
    {
      offsetSec: 30,
      position: { lon: 24.752, lat: 59.428 },
      trackDeg: 280,
      groundSpeedKmh: 710,
      altitude: { meters: 3450, ref: "MSL", source: "reported", comment: "ADS-B reported" },
    },
  ],
};

describe("computeAircraftAtTime", () => {
  it("interpolates position within the track window", () => {
    const nowUtc = "2025-12-18T10:15:35Z"; // 15s after start
    const ingestTimeUtc = "2025-12-18T10:15:35Z";

    const aircraft = computeAircraftAtTime(TRACK, nowUtc, ingestTimeUtc);

    expect(aircraft.position.lon).toBeCloseTo(24.792, 6);
    expect(aircraft.position.lat).toBeCloseTo(59.4205, 6);
    expect(aircraft.altitude.meters).toBeCloseTo(3475);
    expect(aircraft.eventTimeUtc).toBe(new Date(nowUtc).toISOString());
    expect(aircraft.ingestTimeUtc).toBe(ingestTimeUtc);
  });

  it("wraps elapsed time across duration", () => {
    const nowUtc = "2025-12-18T10:16:10Z"; // 50s after start, wraps across duration (60s)
    const ingestTimeUtc = "2025-12-18T10:16:10Z";

    const aircraft = computeAircraftAtTime(TRACK, nowUtc, ingestTimeUtc);

    expect(aircraft.position.lon).toBeCloseTo(24.805333, 6);
    expect(aircraft.position.lat).toBeCloseTo(59.418, 6);
  });
});
