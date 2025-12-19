import { describe, expect, it } from "vitest";

import { mapAdsbDto } from "./adsbTypes";

const DTO = {
  id: "4ca123",
  callsign: "FIN123",
  position: { lon: 24.8, lat: 59.41 },
  trackDeg: 275,
  groundSpeedKmh: 720,
  altitude: {
    meters: 3500,
    ref: "MSL" as const,
    source: "reported" as const,
    comment: "ADS-B reported",
  },
  eventTimeUtc: "2025-12-18T10:15:20Z",
};

describe("mapAdsbDto", () => {
  it("adds ingestTimeUtc to ADS-B dto", () => {
    const ingestTimeUtc = "2025-12-18T10:15:21Z";
    const mapped = mapAdsbDto(DTO, ingestTimeUtc);

    expect(mapped.id).toBe(DTO.id);
    expect(mapped.callsign).toBe(DTO.callsign);
    expect(mapped.ingestTimeUtc).toBe(ingestTimeUtc);
  });
});
