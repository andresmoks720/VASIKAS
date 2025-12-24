import { describe, expect, it } from "vitest";

import { formatEntity, parseEntity, parseTool, TOOLS } from "./urlState";

describe("parseTool", () => {
  it("returns the tool when it matches the allowed list", () => {
    TOOLS.forEach((tool) => {
      expect(parseTool(tool)).toBe(tool);
    });
  });

  it("returns null for missing or unknown values", () => {
    expect(parseTool(undefined)).toBeNull();
    expect(parseTool(null)).toBeNull();
    expect(parseTool("")).toBeNull();
    expect(parseTool("unknown" as typeof TOOLS[number])).toBeNull();
  });
});

describe("parseEntity", () => {
  it("parses valid entity strings", () => {
    expect(parseEntity("sensor:425006")).toEqual({
      kind: "sensor",
      id: "425006",
    });
    expect(parseEntity("flight:ABCD123")).toEqual({
      kind: "flight",
      id: "ABCD123",
    });
  });

  it("returns null when the format is invalid", () => {
    expect(parseEntity(undefined)).toBeNull();
    expect(parseEntity("sensor"))
      .toBeNull();
    expect(parseEntity("sensor:"))
      .toBeNull();
    expect(parseEntity(":missing-kind"))
      .toBeNull();
  });

  it("returns null for unknown entity kinds", () => {
    expect(parseEntity("unknown:123"))
      .toBeNull();
  });
});

describe("formatEntity", () => {
  it("formats an entity ref into the expected string", () => {
    expect(
      formatEntity({
        kind: "geofence",
        id: "test-1",
      }),
    ).toBe("geofence:test-1");
  });

  it("roundtrips through parseEntity", () => {
    const entity = { kind: "sensor" as const, id: "sensor-9" };
    expect(parseEntity(formatEntity(entity))).toEqual(entity);
  });
});
