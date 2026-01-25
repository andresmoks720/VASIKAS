import { describe, expect, it } from "vitest";

import { toTrackCoordinates } from "./adsbTrackUtils";
import { to3857 } from "./transforms";

describe("toTrackCoordinates", () => {
  it("skips undefined or invalid track points", () => {
    const coords = toTrackCoordinates([
      undefined,
      { position: { lon: 24.8, lat: 59.4 }, eventTimeUtc: "2025-01-01T00:00:00Z" },
      { position: { lon: Number.NaN, lat: 59.4 }, eventTimeUtc: "2025-01-01T00:00:01Z" },
      null,
    ]);

    expect(coords).toEqual([to3857([24.8, 59.4])]);
  });
});
