import { describe, expect, it } from "vitest";

import { mapAdsbTrackDto, mapAdsbTrackDtos } from "./adsbTypes";
import type { AdsbTrackDto } from "./adsbTypes";
import type { Altitude } from "@/shared/types/domain";

const makeTrack = (offsetSec: number) => ({
  offsetSec,
  position: { lon: 24.7, lat: 59.4 },
  trackDeg: 90,
  groundSpeedKmh: 120,
  altitude: { meters: 1000, ref: "MSL", source: "reported", comment: "mock" } satisfies Altitude,
});

describe("mapAdsbTrackDto", () => {
  it("sorts track points by offset", () => {
    const dto: AdsbTrackDto = {
      id: "FLIGHT-1",
      callsign: "TEST1",
      t0Utc: "2025-01-01T00:00:00Z",
      durationSec: 60,
      track: [makeTrack(30), makeTrack(10), makeTrack(20)],
    };

    const result = mapAdsbTrackDto(dto);
    expect(result.track.map((point) => point.offsetSec)).toEqual([10, 20, 30]);
  });

  it("throws on missing or empty track", () => {
    const dto = {
      id: "FLIGHT-2",
      callsign: "TEST2",
      t0Utc: "2025-01-01T00:00:00Z",
      durationSec: 60,
      track: [],
    } as AdsbTrackDto;

    expect(() => mapAdsbTrackDto(dto)).toThrowError(/track/);
  });
});

describe("mapAdsbTrackDtos", () => {
  it("maps multiple track DTOs", () => {
    const dtos: AdsbTrackDto[] = [
      {
        id: "FLIGHT-3",
        callsign: "TEST3",
        t0Utc: "2025-01-01T00:00:00Z",
        durationSec: 60,
        track: [makeTrack(0)],
      },
    ];

    expect(mapAdsbTrackDtos(dtos)).toHaveLength(1);
  });
});
