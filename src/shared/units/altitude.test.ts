import { describe, expect, it } from "vitest";

import { Altitude, formatAltitude, ftToM, mToFt } from "./altitude";

describe("altitude conversions", () => {
  it("converts feet to meters", () => {
    expect(ftToM(0)).toBe(0);
    expect(ftToM(3280.84)).toBeCloseTo(1000, 2);
  });

  it("converts meters to feet", () => {
    expect(mToFt(0)).toBe(0);
    expect(mToFt(1000)).toBeCloseTo(3280.84, 2);
  });
});

describe("formatAltitude", () => {
  it("formats altitude with meters, feet, and comment", () => {
    const altitude: Altitude = {
      meters: 86,
      ref: "AGL",
      source: "detected",
      comment: "RF + vision fused",
    };

    expect(formatAltitude(altitude)).toBe(
      "86 m (282 ft) — AGL (detected) — RF + vision fused",
    );
  });

  it("formats altitude with decimal meters", () => {
    const altitude: Altitude = {
      meters: 120.5,
      ref: "MSL",
      source: "reported",
    };

    expect(formatAltitude(altitude)).toBe(
      "120.5 m (395 ft) — MSL (reported)",
    );
  });

  it("handles missing altitude meters and retains comment", () => {
    const altitude: Altitude = {
      meters: null,
      ref: "MSL",
      source: "unknown",
      comment: "Telemetry missing",
    };

    expect(formatAltitude(altitude)).toBe(
      "Unknown altitude — MSL (unknown) — Telemetry missing",
    );
  });
});
