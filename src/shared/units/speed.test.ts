import { describe, expect, it } from "vitest";

import { formatAircraftSpeedKmh, formatDroneSpeedMps, formatSpeed } from "./speed";

describe("formatSpeed", () => {
  it("formats drone speeds in m/s by default", () => {
    expect(formatSpeed(12.3)).toBe("12.3 m/s");
  });

  it("formats aircraft speeds in km/h when requested", () => {
    expect(formatSpeed(720, "kmh")).toBe("720 km/h");
  });

  it("handles missing speed values", () => {
    expect(formatSpeed(null, "mps")).toBe("—");
  });

  it("formats boundary and invalid speed values", () => {
    expect(formatSpeed(0)).toBe("0 m/s");
    expect(formatSpeed(-5)).toBe("-5 m/s");
    expect(formatSpeed(1_000_000, "kmh")).toBe("1000000 km/h");
    expect(formatSpeed(Number.NaN)).toBe("NaN m/s");
  });
});

describe("specific speed helpers", () => {
  it("formats drone speed helper", () => {
    expect(formatDroneSpeedMps(5)).toBe("5 m/s");
    expect(formatDroneSpeedMps(null)).toBe("—");
  });

  it("formats aircraft speed helper", () => {
    expect(formatAircraftSpeedKmh(710.4)).toBe("710.4 km/h");
    expect(formatAircraftSpeedKmh(null)).toBe("—");
  });
});
