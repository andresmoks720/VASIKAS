import { describe, expect, it } from "vitest";

import { DroneTrackDto, mapDroneTrackDto } from "./droneTypes";

const BASE_DTO: DroneTrackDto = {
  id: "demo-drone",
  label: "Demo",
  track: [
    {
      timeUtc: "2025-12-18T10:00:00Z",
      position: { lon: 24.75, lat: 59.43 },
      headingDeg: 0,
      speedMps: 5,
      altitude: {
        meters: 50,
        ref: "AGL",
        source: "reported",
        comment: "test",
      },
    },
    {
      timeUtc: "2025-12-18T10:00:10Z",
      position: { lon: 24.751, lat: 59.431 },
      headingDeg: 30,
      speedMps: 6,
      altitude: {
        meters: 55,
        ref: "AGL",
        source: "reported",
        comment: "test",
      },
    },
  ],
};

describe("mapDroneTrackDto", () => {
  it("sorts track by time and preserves fields", () => {
    const mapped = mapDroneTrackDto(BASE_DTO);

    expect(mapped.id).toBe(BASE_DTO.id);
    expect(mapped.track[0].timeUtc).toBe("2025-12-18T10:00:00Z");
    expect(mapped.track[1].timeUtc).toBe("2025-12-18T10:00:10Z");
    expect(mapped.track[0].altitude.comment).toBeTruthy();
  });
});
