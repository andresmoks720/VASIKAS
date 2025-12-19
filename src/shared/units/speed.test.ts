import { describe, expect, it } from "vitest";

import { formatSpeed } from "./speed";

describe("formatSpeed", () => {
  it("formats drone speeds in m/s by default", () => {
    expect(formatSpeed(12.3)).toBe("12.3 m/s");
  });

  it("formats aircraft speeds in km/h when requested", () => {
    expect(formatSpeed(720, "kmh")).toBe("720 km/h");
  });

  it("handles missing speed values", () => {
    expect(formatSpeed(null, "mps")).toBe("Unknown speed");
  });
});
