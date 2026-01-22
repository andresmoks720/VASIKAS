import { describe, expect, it } from "vitest";
import { unrollTime } from "./time_unroll";

const lookaheadDays = 7;

function withinLookahead(iso: string, generatedAt: string): boolean {
  const start = new Date(generatedAt).getTime();
  const end = start + lookaheadDays * 24 * 60 * 60 * 1000;
  const value = new Date(iso).getTime();
  return value >= start && value <= end;
}

describe("unrollTime", () => {
  it("creates SR/SS placeholder activations within lookahead window", () => {
    const generatedAt = "2025-12-01T00:00:00Z";
    const result = unrollTime({
      validFrom: "2025-12-01T00:00:00Z",
      validUntil: "2025-12-10T23:59:59Z",
      scheduleText: "SR-SS",
      generatedAt,
      lookaheadDays,
    });

    expect(result.quality).toBe("PLACEHOLDER");
    expect(result.activations.length).toBeGreaterThan(0);

    for (const window of result.activations) {
      expect(withinLookahead(window.start, generatedAt)).toBe(true);
      expect(withinLookahead(window.end, generatedAt)).toBe(true);
      expect(window.comment).toBe("SR/SS placeholder applied");
    }
  });
});
