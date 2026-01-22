import { describe, expect, it } from "vitest";
import { parseVerticalLimitsFromSeparate } from "./units";

describe("parseVerticalLimitsFromSeparate", () => {
  it("keeps lower <= upper after rounding", () => {
    const result = parseVerticalLimitsFromSeparate(
      "5000FT AMSL",
      "1000FT AMSL",
      { altitude_m: 10 },
    );

    expect(result.lower_m).toBeGreaterThanOrEqual(0);
    expect(result.upper_m).toBeGreaterThanOrEqual(result.lower_m);
  });
});
