import { describe, expect, it } from "vitest";

import { mapSensorDto, mapSensorDtos, SensorDto } from "./sensorsTypes";

describe("mapSensorDto", () => {
  const baseDto: SensorDto = {
    id: "sensor-1",
    name: "Test Sensor",
    kind: "radar",
    position: { lon: 24.1, lat: 59.2 },
    status: "online",
    lastSeenUtc: "2025-01-01T00:00:00Z",
    coverage: { radiusMeters: 3000, minAltM: 0, maxAltM: 500 },
  };

  it("adds ingestTimeUtc and default source", () => {
    const mapped = mapSensorDto(baseDto, "2025-01-01T00:00:05Z");

    expect(mapped.ingestTimeUtc).toBe("2025-01-01T00:00:05Z");
    expect(mapped.source).toBe("base");
    expect(mapped.id).toBe(baseDto.id);
  });

  it("respects explicit source", () => {
    const mapped = mapSensorDto(baseDto, "2025-01-01T00:00:05Z", "user");

    expect(mapped.source).toBe("user");
  });
});

describe("mapSensorDtos", () => {
  it("maps array with ingest time", () => {
    const dtos: SensorDto[] = [
      {
        id: "sensor-1",
        name: "Test Sensor",
        kind: "radar",
        position: { lon: 24.1, lat: 59.2 },
        status: "online",
        lastSeenUtc: "2025-01-01T00:00:00Z",
        coverage: { radiusMeters: 3000, minAltM: 0, maxAltM: 500 },
      },
    ];

    const mapped = mapSensorDtos(dtos, "2025-01-01T00:00:05Z");

    expect(mapped).toHaveLength(1);
    expect(mapped[0].ingestTimeUtc).toBe("2025-01-01T00:00:05Z");
  });
});
