import { describe, expect, it } from "vitest";

import { parseNotamGeometryWithReason } from "@/services/notam/notamInterpreter";
import type { NotamGeometry } from "@/services/notam/notamTypes";

describe("GeoJSON support in NOTAM parsing", () => {
  describe("supported geometry types", () => {
    it("parses Point geometry with radius as circle", () => {
      const geoJsonPointWithRadius = {
        type: "Point",
        coordinates: [24.7536, 59.4369],
        radiusMeters: 1000
      };

      const result = parseNotamGeometryWithReason(geoJsonPointWithRadius);
      expect(result.geometry).not.toBeNull();
      expect(result.geometry?.kind).toBe("circle");
      expect((result.geometry as any).center).toEqual([24.7536, 59.4369]);
      expect((result.geometry as any).radiusMeters).toBe(1000);
    });

    it("parses Polygon geometry correctly", () => {
      const geoJsonPolygon = {
        type: "Polygon",
        coordinates: [
          [
            [24.74, 59.43],
            [24.76, 59.43],
            [24.76, 59.44],
            [24.74, 59.44],
            [24.74, 59.43]
          ]
        ]
      };

      const result = parseNotamGeometryWithReason(geoJsonPolygon);
      expect(result.geometry).not.toBeNull();
      expect(result.geometry?.kind).toBe("polygon");
      expect(Array.isArray((result.geometry as any).rings)).toBe(true);
      expect((result.geometry as any).rings[0]).toHaveLength(5); // Should have 5 points (closed ring)
    });

    it("parses MultiPolygon geometry correctly", () => {
      const geoJsonMultiPolygon = {
        type: "MultiPolygon",
        coordinates: [
          [ // First polygon
            [
              [25.0, 60.0],
              [25.1, 60.0],
              [25.1, 60.1],
              [25.0, 60.1],
              [25.0, 60.0]
            ]
          ],
          [ // Second polygon
            [
              [25.2, 60.2],
              [25.3, 60.2],
              [25.3, 60.3],
              [25.2, 60.3],
              [25.2, 60.2]
            ]
          ]
        ]
      };

      const result = parseNotamGeometryWithReason(geoJsonMultiPolygon);
      expect(result.geometry).not.toBeNull();
      expect(result.geometry?.kind).toBe("multiPolygon");
      expect(Array.isArray((result.geometry as any).polygons)).toBe(true);
      expect((result.geometry as any).polygons).toHaveLength(2); // Should have 2 polygons
    });

    it("parses Feature with Polygon geometry", () => {
      const geoJsonFeature = {
        type: "Feature",
        geometry: {
          type: "Polygon",
          coordinates: [
            [
              [24.74, 59.43],
              [24.76, 59.43],
              [24.76, 59.44],
              [24.74, 59.44],
              [24.74, 59.43]
            ]
          ]
        },
        properties: {
          id: "test-feature"
        }
      };

      const result = parseNotamGeometryWithReason(geoJsonFeature);
      expect(result.geometry).not.toBeNull();
      expect(result.geometry?.kind).toBe("polygon");
    });

    it("parses FeatureCollection with Polygon geometry", () => {
      const geoJsonFeatureCollection = {
        type: "FeatureCollection",
        features: [
          {
            type: "Feature",
            geometry: {
              type: "Polygon",
              coordinates: [
                [
                  [24.74, 59.43],
                  [24.76, 59.43],
                  [24.76, 59.44],
                  [24.74, 59.44],
                  [24.74, 59.43]
                ]
              ]
            }
          }
        ]
      };

      const result = parseNotamGeometryWithReason(geoJsonFeatureCollection);
      expect(result.geometry).not.toBeNull();
      expect(result.geometry?.kind).toBe("polygon");
    });
  });

  describe("unsupported geometry types", () => {
    it("returns unsupported type for LineString", () => {
      const geoJsonLineString = {
        type: "LineString",
        coordinates: [
          [24.74, 59.43],
          [24.76, 59.43],
          [24.76, 59.44]
        ]
      };

      const result = parseNotamGeometryWithReason(geoJsonLineString);
      expect(result.geometry).toBeNull();
      expect(result.reason).toBe("UNSUPPORTED_GEOJSON_TYPE");
      expect(result.details?.type).toBe("LineString");
    });

    it("returns unsupported type for MultiPoint", () => {
      const geoJsonMultiPoint = {
        type: "MultiPoint",
        coordinates: [
          [24.74, 59.43],
          [24.76, 59.43]
        ]
      };

      const result = parseNotamGeometryWithReason(geoJsonMultiPoint);
      expect(result.geometry).toBeNull();
      expect(result.reason).toBe("UNSUPPORTED_GEOJSON_TYPE");
      expect(result.details?.type).toBe("MultiPoint");
    });

    it("returns unsupported type for MultiLineString", () => {
      const geoJsonMultiLineString = {
        type: "MultiLineString",
        coordinates: [
          [
            [24.74, 59.43],
            [24.76, 59.43]
          ],
          [
            [24.76, 59.44],
            [24.74, 59.44]
          ]
        ]
      };

      const result = parseNotamGeometryWithReason(geoJsonMultiLineString);
      expect(result.geometry).toBeNull();
      expect(result.reason).toBe("UNSUPPORTED_GEOJSON_TYPE");
      expect(result.details?.type).toBe("MultiLineString");
    });
  });

  describe("edge cases and validation", () => {
    it("handles empty coordinates for Polygon", () => {
      const geoJsonPolygon = {
        type: "Polygon",
        coordinates: []
      };

      const result = parseNotamGeometryWithReason(geoJsonPolygon);
      expect(result.geometry).toBeNull();
      expect(result.reason).toBe("INVALID_COORDS");
    });

    it("handles invalid coordinates for Polygon", () => {
      const geoJsonPolygon = {
        type: "Polygon",
        coordinates: [
          [] // Empty ring
        ]
      };

      const result = parseNotamGeometryWithReason(geoJsonPolygon);
      expect(result.geometry).toBeNull();
      expect(result.reason).toBe("INVALID_COORDS");
    });

    it("handles coordinates with insufficient points for Polygon", () => {
      const geoJsonPolygon = {
        type: "Polygon",
        coordinates: [
          [
            [24.74, 59.43] // Only one point
          ]
        ]
      };

      const result = parseNotamGeometryWithReason(geoJsonPolygon);
      expect(result.geometry).toBeNull();
      expect(result.reason).toBe("INVALID_COORDS");
    });

    it("handles invalid coordinate format", () => {
      const geoJsonPolygon = {
        type: "Polygon",
        coordinates: [
          [
            [24.74] // Missing latitude
          ]
        ]
      };

      const result = parseNotamGeometryWithReason(geoJsonPolygon);
      expect(result.geometry).toBeNull();
      expect(result.reason).toBe("INVALID_COORDS");
    });

    it("handles coordinates with invalid values", () => {
      const geoJsonPolygon = {
        type: "Polygon",
        coordinates: [
          [
            [200, 59.43] // Invalid longitude (> 180)
          ]
        ]
      };

      const result = parseNotamGeometryWithReason(geoJsonPolygon);
      expect(result.geometry).toBeNull();
      expect(result.reason).toBe("INVALID_COORDS");
    });
  });
});