import { describe, expect, it } from "vitest";

import {
  buildAdsbPointUrl,
  parseAdsbMode,
  parseBooleanFlag,
  parseNumberInRange,
  parseOptionalNumberInRange,
  parsePositiveInt,
  resolveDataUrl,
} from "./env";

describe("parseBooleanFlag", () => {
  it("returns default when value is undefined", () => {
    expect(parseBooleanFlag("FLAG", undefined, true)).toBe(true);
  });

  it("parses truthy and falsey strings", () => {
    expect(parseBooleanFlag("FLAG", "1", false)).toBe(true);
    expect(parseBooleanFlag("FLAG", "true", false)).toBe(true);
    expect(parseBooleanFlag("FLAG", "0", true)).toBe(false);
    expect(parseBooleanFlag("FLAG", "off", true)).toBe(false);
  });

  it("throws on invalid boolean-like values", () => {
    expect(() => parseBooleanFlag("FLAG", "maybe", true)).toThrowError(/FLAG/);
  });
});

describe("parsePositiveInt", () => {
  it("parses numeric values", () => {
    expect(parsePositiveInt("COUNT", 5, 1)).toBe(5);
  });

  it("uses default when undefined", () => {
    expect(parsePositiveInt("COUNT", undefined, 10)).toBe(10);
  });

  it("rejects zero, negatives, and NaN", () => {
    expect(() => parsePositiveInt("COUNT", 0, 1)).toThrowError(/COUNT/);
    expect(() => parsePositiveInt("COUNT", -1, 1)).toThrowError(/COUNT/);
    expect(() => parsePositiveInt("COUNT", "not-a-number", 1)).toThrowError(/COUNT/);
  });
});

describe("parseNumberInRange", () => {
  it("accepts boundary values", () => {
    expect(parseNumberInRange("RANGE", 0, 5, 0, 10)).toBe(0);
    expect(parseNumberInRange("RANGE", 10, 5, 0, 10)).toBe(10);
  });

  it("uses default when undefined", () => {
    expect(parseNumberInRange("RANGE", undefined, 3, 0, 10)).toBe(3);
  });

  it("throws when out of range or invalid", () => {
    expect(() => parseNumberInRange("RANGE", -1, 3, 0, 10)).toThrowError(/RANGE/);
    expect(() => parseNumberInRange("RANGE", 11, 3, 0, 10)).toThrowError(/RANGE/);
    expect(() => parseNumberInRange("RANGE", "NaN", 3, 0, 10)).toThrowError(/RANGE/);
  });
});

describe("parseOptionalNumberInRange", () => {
  it("returns undefined when value is missing", () => {
    expect(parseOptionalNumberInRange("OPTIONAL", undefined, -90, 90)).toBeUndefined();
    expect(parseOptionalNumberInRange("OPTIONAL", "", -90, 90)).toBeUndefined();
  });

  it("parses numeric values within range", () => {
    expect(parseOptionalNumberInRange("OPTIONAL", "12.5", -90, 90)).toBe(12.5);
  });

  it("rejects invalid or out-of-range values", () => {
    expect(() => parseOptionalNumberInRange("OPTIONAL", "abc", -90, 90)).toThrowError(/OPTIONAL/);
    expect(() => parseOptionalNumberInRange("OPTIONAL", "999", -90, 90)).toThrowError(/OPTIONAL/);
  });
});

describe("resolveDataUrl", () => {
  it("returns mock URL when mocks enabled", () => {
    expect(
      resolveDataUrl({
        name: "URL",
        mockUrl: "/mock/data.json",
        useMocks: true,
        rawValue: undefined,
      }),
    ).toBe("/mock/data.json");
  });

  it("returns provided URL when mocks disabled", () => {
    expect(
      resolveDataUrl({
        name: "URL",
        mockUrl: "/mock/data.json",
        useMocks: false,
        rawValue: "https://example.com/data.json",
      }),
    ).toBe("https://example.com/data.json");
  });

  it("throws when mocks disabled and URL missing", () => {
    expect(() =>
      resolveDataUrl({
        name: "URL",
        mockUrl: "/mock/data.json",
        useMocks: false,
        rawValue: "",
      }),
    ).toThrowError(/URL/);
  });
});

describe("parseAdsbMode", () => {
  it("defaults to live and accepts mock", () => {
    expect(parseAdsbMode(undefined)).toBe("live");
    expect(parseAdsbMode("mock")).toBe("mock");
    expect(parseAdsbMode("live")).toBe("live");
  });
});

describe("buildAdsbPointUrl", () => {
  it("builds URL and trims trailing slashes", () => {
    expect(buildAdsbPointUrl("https://api.test/v2/", 1, 2, 3)).toBe("https://api.test/v2/point/1/2/3");
  });
});
