import { describe, expect, it } from "vitest";

import { mapSensorDto } from "./sensorsTypes";

const DTO = {
  id: "sensor-1",
  name: "Demo Sensor",
  kind: "aeroscope",
  position: { lon: 24.7, lat: 59.4 },
  status: "online" as const,
  lastSeenUtc: "2025-12-18T10:00:00Z",
  coverage: { radiusMeters: 1000, minAltM: 0, maxAltM: 200 },
};

describe("mapSensorDto", () => {
  it("adds ingestTimeUtc to the dto", () => {
    const ingestTimeUtc = "2025-12-18T10:01:00Z";
    const mapped = mapSensorDto(DTO, ingestTimeUtc);

    expect(mapped.id).toBe(DTO.id);
    expect(mapped.ingestTimeUtc).toBe(ingestTimeUtc);
    expect(mapped.position).toEqual(DTO.position);
  });
});
