import { describe, expect, it } from "vitest";
import { normalizeNotamPayload } from "./normalize_notam";

describe("normalizeNotamPayload relevance gating", () => {
  it("filters by subject, scope, and geometry quality", () => {
    const payload = {
      generatedAtUtc: "2025-12-01T00:00:00Z",
      items: [
        {
          id: "A0001/25",
          text: "FUEL AVGAS 100LL NOT AVAILABLE",
          validFromUtc: "2025-12-01T00:00:00Z",
          validToUtc: "2025-12-02T00:00:00Z",
          qualifiers: {
            subject: "FU",
            scope: "A",
            coordinate: "5925N02450E",
            radius: 5,
          },
        },
        {
          id: "A0002/25",
          text: "TEMPORARY RESTRICTED AREA",
          validFromUtc: "2025-12-01T00:00:00Z",
          validToUtc: "2025-12-02T00:00:00Z",
          qualifiers: {
            subject: "RT",
            scope: "W",
            coordinate: "5925N02450E",
            radius: 5,
          },
        },
        {
          id: "A0003/25",
          text: "OBSTACLE CRANE",
          validFromUtc: "2025-12-01T00:00:00Z",
          validToUtc: "2025-12-02T00:00:00Z",
          qualifiers: {
            subject: "OB",
            scope: "A",
            coordinate: "5925N02450E",
            radius: 5,
          },
        },
        {
          id: "A0004/25",
          text: "TEMPORARY RESTRICTED AREA",
          validFromUtc: "2025-12-01T00:00:00Z",
          validToUtc: "2025-12-02T00:00:00Z",
          geometryHint: {
            type: "Polygon",
            coordinates: [
              [
                [24.74, 59.43],
                [24.76, 59.43],
                [24.76, 59.44],
                [24.74, 59.44],
                [24.74, 59.43],
              ],
            ],
          },
          qualifiers: {
            subject: "RA",
            scope: "E",
          },
        },
        {
          id: "A0005/25",
          text: "AIRSPACE RESTRICTED",
          validFromUtc: "2025-12-01T00:00:00Z",
          validToUtc: "2025-12-02T00:00:00Z",
          qualifiers: {
            subject: "RT",
            scope: "W",
            coordinate: "5925N02450E",
            radius: 300,
          },
        },
        {
          id: "A0006/25",
          text: "APRON CLOSED",
          validFromUtc: "2025-12-01T00:00:00Z",
          validToUtc: "2025-12-02T00:00:00Z",
          qualifiers: {
            subject: "XX",
            scope: "E",
            coordinate: "5925N02450E",
            radius: 5,
          },
        },
      ],
    };

    const result = normalizeNotamPayload(payload, {
      generatedAt: "2025-12-01T00:00:00Z",
      lookaheadDays: 7,
      rounding: { altitude_m: 1 },
    });

    expect(result.features).toHaveLength(4);
    expect(result.droppedNotRelevant.total).toBe(2);
    expect(result.droppedNotRelevant.reasons.AERODROME_SCOPE).toBe(1);
    expect(result.droppedNotRelevant.reasons.KEYWORD_FORCE_DROP).toBe(1);

    const strategic = result.features.find((feature) => feature.sourceId === "A0005/25");
    expect(strategic?.feature.properties.shape).toBeUndefined();
    expect(strategic?.feature.properties.tags).toContain("STRATEGIC_NOTICE");
  });
});
