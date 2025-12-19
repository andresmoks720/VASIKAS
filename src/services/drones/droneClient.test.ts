import { describe, expect, it } from "vitest";

import { applyDemoMotion } from "./droneClient";
import { DroneDto, mapDroneDto } from "./droneTypes";

const BASE_DTO: DroneDto = {
  id: "demo-drone",
  label: "Demo",
  position: { lon: 24.75, lat: 59.43 },
  headingDeg: 0,
  speedMps: 5,
  altitude: {
    meters: 50,
    ref: "AGL",
    source: "reported",
    comment: "test",
  },
  eventTimeUtc: "2025-12-18T10:00:00Z",
};

describe("mapDroneDto", () => {
  it("adds ingestTimeUtc while preserving DTO fields", () => {
    const ingestTimeUtc = "2025-12-18T10:01:00Z";
    const domain = mapDroneDto(BASE_DTO, ingestTimeUtc);

    expect(domain.id).toBe(BASE_DTO.id);
    expect(domain.position).toEqual(BASE_DTO.position);
    expect(domain.ingestTimeUtc).toBe(ingestTimeUtc);
  });
});

describe("applyDemoMotion", () => {
  it("moves the first drone along the demo path using the tick counter", () => {
    const ingestTimeUtc = "2025-12-18T10:01:00Z";
    const domain = mapDroneDto(BASE_DTO, ingestTimeUtc);
    const [moved] = applyDemoMotion([domain], 1);

    expect(moved.position).toEqual({ lon: 24.7565, lat: 59.439 });
    expect(moved.eventTimeUtc).toBe(BASE_DTO.eventTimeUtc);
    expect(moved.headingDeg).toBeGreaterThanOrEqual(0);
    expect(moved.headingDeg).toBeLessThan(360);
  });
});
