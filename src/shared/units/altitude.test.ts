import { describe, expect, it } from "vitest";

import { Altitude, feetToMeters, formatAltitude, metersToFeet } from "./altitude";

describe("altitude conversions", () => {
  it("converts feet to meters", () => {
    expect(feetToMeters(0)).toBe(0);
    expect(feetToMeters(3280.84)).toBeCloseTo(1000, 2);
  });

  it("converts meters to feet", () => {
    expect(metersToFeet(0)).toBe(0);
    expect(metersToFeet(1000)).toBeCloseTo(3280.84, 2);
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

    expect(formatAltitude(altitude, { showFeet: true })).toBe("86 m (282 ft) — AGL (detected) — RF + vision fused");
  });

  it("shows meters and feet when showFeet is enabled", () => {
    const altitude: Altitude = {
      meters: 300,
      ref: "MSL",
      source: "reported",
      comment: "from NOTAM text",
    };

    const formatted = formatAltitude(altitude, { showFeet: true });

    expect(formatted).toContain("300 m");
    expect(formatted).toContain("ft");
    expect(formatted).toContain("— MSL (reported) — from NOTAM text");
  });

  it("formats altitude with decimal meters", () => {
    const altitude: Altitude = {
      meters: 120.5,
      ref: "MSL",
      source: "reported",
    };

    expect(formatAltitude(altitude, { showFeet: true })).toBe("120.5 m (395 ft) — MSL (reported) — from upstream");
  });

  it("handles missing altitude meters and retains comment", () => {
    const altitude: Altitude = {
      meters: null,
      ref: "MSL",
      source: "unknown",
      comment: "Telemetry missing",
    };

    expect(formatAltitude(altitude)).toBe("— — MSL (unknown) — Telemetry missing");
  });

  it("falls back to comment and preserves raw text when meters are missing", () => {
    const altitude: Altitude = {
      meters: null,
      ref: "AGL",
      source: "reported",
      rawText: "ALT ???",
    };

    expect(formatAltitude(altitude)).toBe("— — AGL (reported) — from upstream — raw: ALT ???");
  });

  it("ensures the comment appears after the altitude and ref", () => {
    const altitude: Altitude = {
      meters: 42,
      ref: "AGL",
      source: "reported",
      comment: "from sensor",
    };

    expect(formatAltitude(altitude)).toBe("42 m — AGL (reported) — from sensor");
  });
});
