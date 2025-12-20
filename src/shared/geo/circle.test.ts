import { describe, expect, it } from "vitest";

import { circleToPolygonWgs84 } from "./circle";

const CENTER = { lon: 24.7536, lat: 59.4369 };

describe("circleToPolygonWgs84", () => {
  it("returns a closed ring", () => {
    const polygon = circleToPolygonWgs84(CENTER, 500);

    const ring = polygon.coordinates[0];
    expect(ring[0]).toEqual(ring[ring.length - 1]);
  });

  it("returns the expected number of points", () => {
    const segments = 16;
    const polygon = circleToPolygonWgs84(CENTER, 500, segments);

    const ring = polygon.coordinates[0];
    expect(ring).toHaveLength(segments + 1);
  });

  it("preserves the center approximately", () => {
    const polygon = circleToPolygonWgs84(CENTER, 500, 32);
    const ring = polygon.coordinates[0].slice(0, -1); // exclude closing point

    const meanLon = ring.reduce((sum, point) => sum + point[0], 0) / ring.length;
    const meanLat = ring.reduce((sum, point) => sum + point[1], 0) / ring.length;

    expect(meanLon).toBeCloseTo(CENTER.lon, 3);
    expect(meanLat).toBeCloseTo(CENTER.lat, 3);
  });
});
