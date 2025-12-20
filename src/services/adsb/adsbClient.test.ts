import { describe, expect, it } from "vitest";

import { mapAircraftDto, parseLiveAdsbResponse } from "./adsbClient";
import { mapAdsbTrackDto } from "./adsbTypes";

describe("mapAircraftDto (live ADS-B)", () => {
  const baseContext = { nowEpochSec: 1_700_000_000, ingestTimeUtc: "2024-01-01T00:00:00.000Z" };

  it("prefers current lat/lon over lastPosition and rough", () => {
    const mapped = mapAircraftDto(
      {
        hex: "abcd12",
        flight: " TEST123 ",
        lat: 59.1,
        lon: 24.5,
        lastPosition: { lat: 1, lon: 2 },
        rr_lat: 3,
        rr_lon: 4,
        seen_pos: 5,
      },
      baseContext,
    );

    expect(mapped).not.toBeNull();
    expect(mapped?.position).toEqual({ lon: 24.5, lat: 59.1 });
    expect(mapped?.positionSource).toBe("current");
    expect(mapped?.eventTimeUtc).toBe(new Date((baseContext.nowEpochSec - 5) * 1000).toISOString());
    expect(mapped?.callsign).toBe("TEST123");
  });

  it("falls back to lastPosition when live coords are missing", () => {
    const mapped = mapAircraftDto(
      {
        hex: "abcd12",
        flight: "TEST123",
        lastPosition: { lat: 1.23, lon: 4.56, seen_pos: 8 },
      },
      baseContext,
    );

    expect(mapped).not.toBeNull();
    expect(mapped?.position).toEqual({ lon: 4.56, lat: 1.23 });
    expect(mapped?.positionSource).toBe("lastPosition");
  });

  it("falls back to rough receiver coordinates when no other position exists", () => {
    const mapped = mapAircraftDto(
      {
        hex: "abcd12",
        rr_lat: 3.21,
        rr_lon: 6.54,
      },
      baseContext,
    );

    expect(mapped).not.toBeNull();
    expect(mapped?.position).toEqual({ lon: 6.54, lat: 3.21 });
    expect(mapped?.positionSource).toBe("rough");
  });

  it("maps altitude in feet and the 'ground' string", () => {
    const withAltitude = mapAircraftDto(
      {
        hex: "abcd12",
        lat: 1,
        lon: 2,
        alt_baro: 10000,
      },
      baseContext,
    );

    const onGround = mapAircraftDto(
      {
        hex: "abcd34",
        lat: 1,
        lon: 2,
        alt_baro: "ground",
      },
      baseContext,
    );

    expect(withAltitude?.altitude.meters).toBeCloseTo(3048);
    expect(withAltitude?.altitude.comment).toContain("ADS-B baro");
    expect(onGround?.altitude.meters).toBe(0);
    expect(onGround?.altitude.comment).toContain("ground");
  });

  it("trims callsign and falls back to registration and hex", () => {
    const callsign = mapAircraftDto(
      {
        hex: "abcd12",
        flight: "  ABC123 ",
        lat: 1,
        lon: 2,
      },
      baseContext,
    );

    const registration = mapAircraftDto(
      {
        hex: "abcd34",
        flight: "   ",
        r: " ES-TST ",
        lat: 1,
        lon: 2,
      },
      baseContext,
    );

    expect(callsign?.callsign).toBe("ABC123");
    expect(registration?.callsign).toBe("ES-TST");
  });
});

describe("parseLiveAdsbResponse", () => {
  it("maps aircraft array and skips entries without IDs or positions", () => {
    const ingestTimeUtc = "2024-01-01T00:00:00.000Z";
    const mapped = parseLiveAdsbResponse(
      {
        now: 1_700_000_000,
        aircraft: [
          { hex: "abcd12", lat: 1, lon: 2, gs: 100 },
          { hex: "", lat: 1, lon: 2 },
          { hex: "missing-pos" },
        ],
      },
      ingestTimeUtc,
    );

    expect(mapped).toHaveLength(1);
    expect(mapped[0].id).toBe("abcd12");
    expect(mapped[0].groundSpeedKmh).toBeCloseTo(185.2);
  });
});

describe("mapAdsbTrackDto (mock track support)", () => {
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

  it("sorts track points by offset", () => {
    const mapped = mapAdsbTrackDto(DTO);

    expect(mapped.track[0].offsetSec).toBe(0);
    expect(mapped.track[1].offsetSec).toBe(30);
  });
});
