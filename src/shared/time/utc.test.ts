import { describe, expect, it } from "vitest";

import { formatUtcTimestamp } from "./utc";

describe("formatUtcTimestamp", () => {
  it("returns Unknown time for empty input", () => {
    expect(formatUtcTimestamp(undefined)).toBe("Unknown time");
    expect(formatUtcTimestamp(null)).toBe("Unknown time");
    expect(formatUtcTimestamp("")).toBe("Unknown time");
  });

  it("returns Invalid time for bad input", () => {
    expect(formatUtcTimestamp("not-a-date")).toBe("Invalid time");
  });

  it("rejects timestamps without timezone information", () => {
    expect(formatUtcTimestamp("2025-01-01T00:00:00")).toBe("Invalid time");
  });

  it("rejects date-only strings (regression)", () => {
    expect(formatUtcTimestamp("2025-01-01")).toBe("Invalid time");
  });

  it("normalizes offset timestamps to UTC", () => {
    expect(formatUtcTimestamp("2025-01-01T00:00:00+02:00")).toBe("2024-12-31T22:00:00Z");
  });

  it("normalizes ISO timestamps to UTC", () => {
    expect(formatUtcTimestamp("2025-01-01T00:00:00.000Z")).toBe("2025-01-01T00:00:00Z");
  });
});
