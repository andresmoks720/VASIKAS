import { describe, expect, it } from "vitest";
import { mergeFeatures } from "./merge";
import type { InternalFeature, RestrictionFeature } from "./types";

function buildFeature(id: string): RestrictionFeature {
  return {
    type: "Feature",
    id,
    geometry: { type: "Point", coordinates: [0, 0] },
    properties: {
      category: "INFO",
      restriction: "INFORMATION",
      priority: "LOW",
      tags: [],
      vertical: {
        lower_m: 0,
        upper_m: null,
        lower_ref: "SFC",
        upper_ref: "UNKNOWN",
      },
      time: {
        validFrom: "2025-12-01T00:00:00Z",
        validUntil: "2025-12-02T00:00:00Z",
        activations: [{ start: "2025-12-01T00:00:00Z", end: "2025-12-02T00:00:00Z" }],
        quality: "EXACT",
      },
      link: {
        relationType: "NEW",
        relatedTo: null,
        supersedes: [],
      },
      provenance: {
        inputs: [{ source: "NOTAM", id }],
      },
    },
  };
}

describe("mergeFeatures", () => {
  it("drops superseded NOTAM features", () => {
    const superseded: InternalFeature = {
      feature: buildFeature("eff:NOTAM:A0001/25:2025-12-01T00:00:00Z"),
      sourceId: "A0001/25",
      supersedes: [],
    };
    const replacement: InternalFeature = {
      feature: buildFeature("eff:NOTAM:A0002/25:2025-12-01T00:00:00Z"),
      sourceId: "A0002/25",
      supersedes: ["A0001/25"],
    };

    const result = mergeFeatures([], [superseded, replacement]);

    expect(result.features).toHaveLength(1);
    expect(result.features[0]?.id).toBe(replacement.feature.id);
    expect(result.droppedSuperseded).toBe(1);
  });
});
