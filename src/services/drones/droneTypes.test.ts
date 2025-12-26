import { describe, expect, it } from "vitest";

import { mapDroneTrackDto, mapDroneTrackDtos } from "./droneTypes";
import type { DroneTrackDto } from "./droneTypes";
import type { Altitude } from "@/shared/types/domain";

const makePoint = (timeUtc: string, comment?: string) => ({
  timeUtc,
  position: { lon: 24.7, lat: 59.4 },
  headingDeg: 180,
  speedMps: 10,
  altitude: { meters: 50, ref: "AGL", source: "reported", comment: comment ?? "" } satisfies Altitude,
});

describe("mapDroneTrackDto", () => {
  it("sorts track points and ensures altitude comment", () => {
    const dto: DroneTrackDto = {
      id: "DRONE-1",
      label: "Test Drone",
      track: [makePoint("2025-01-01T00:00:10Z"), makePoint("2025-01-01T00:00:00Z")],
    };

    const result = mapDroneTrackDto(dto);
    expect(result.track.map((point) => point.timeUtc)).toEqual([
      "2025-01-01T00:00:00Z",
      "2025-01-01T00:00:10Z",
    ]);
    expect(result.track[0].altitude.comment).toBe("mock track");
  });

  it("preserves existing altitude comments", () => {
    const dto: DroneTrackDto = {
      id: "DRONE-2",
      label: "Test Drone",
      track: [makePoint("2025-01-01T00:00:00Z", "reported")],
    };

    const result = mapDroneTrackDto(dto);
    expect(result.track[0].altitude.comment).toBe("reported");
  });

  it("throws on empty track", () => {
    const dto: DroneTrackDto = {
      id: "DRONE-3",
      label: "Test Drone",
      track: [],
    };

    expect(() => mapDroneTrackDto(dto)).toThrowError(/track/);
  });
});

describe("mapDroneTrackDtos", () => {
  it("maps multiple track DTOs", () => {
    const dtos: DroneTrackDto[] = [
      {
        id: "DRONE-4",
        label: "Drone",
        track: [makePoint("2025-01-01T00:00:00Z")],
      },
    ];

    expect(mapDroneTrackDtos(dtos)).toHaveLength(1);
  });
});
