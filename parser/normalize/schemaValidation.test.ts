import { describe, expect, it } from "vitest";
import example from "./schema/example.json";
import { validateUnifiedRestriction } from "./validate";
import type { RestrictionFeatureCollection } from "./types";

describe("schema validation", () => {
  it("validates the example output", () => {
    const data = example as unknown as RestrictionFeatureCollection;
    const result = validateUnifiedRestriction(data);
    expect(result.valid).toBe(true);
  });
});
