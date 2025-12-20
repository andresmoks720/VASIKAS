import { describe, expect, it } from "vitest";

import { mapAdsbTrackDto } from "./adsbTypes";

const DTO = {
  id: "4ca123",
  callsign: "FIN123",
  t0Utc: "2025-12-18T10:15:20Z",
  durationSec: 60,
  track: [
    {
      offsetSec: 30,
      position: { lon: 24.75, lat: 59.426 },
      trackDeg: 285,
      groundSpeedKmh: 710,
      altitude: {
        meters: 3420,
        ref: "MSL" as const,
        source: "reported" as const,
        comment: "ADS-B reported",
      },
    },
    {
      offsetSec: 0,
      position: { lon: 24.832, lat: 59.413 },
      trackDeg: 275,
      groundSpeedKmh: 720,
      altitude: {
        meters: 3500,
        ref: "MSL" as const,
        source: "reported" as const,
        comment: "ADS-B reported",
      },
    },
  ],
};

describe("mapAdsbTrackDto", () => {
  it("sorts track points by offset", () => {
    const mapped = mapAdsbTrackDto(DTO);

    expect(mapped.track[0].offsetSec).toBe(0);
    expect(mapped.track[1].offsetSec).toBe(30);
  });
});
