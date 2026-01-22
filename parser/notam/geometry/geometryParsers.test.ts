import { describe, expect, it } from "vitest";
import { parseNotamGeometryWithReason } from "./geometryParsers";

describe("geometryParsers", () => {
  describe("parseNotamGeometryWithReason", () => {
    it("parses GeoJSON Polygon geometry", () => {
      const geoJsonPolygon = {
        type: "Polygon",
        coordinates: [
          [
            [24.74, 59.43],
            [24.76, 59.43],
            [24.76, 59.44],
            [24.74, 59.44],
            [24.74, 59.43] // Closed ring
          ]
        ]
      };

      const result = parseNotamGeometryWithReason(geoJsonPolygon);
      expect(result.geometry).not.toBeNull();
      expect(result.geometry?.kind).toBe("polygon");
      if (!result.geometry || result.geometry.kind !== "polygon") {
        throw new Error("Expected polygon geometry");
      }
      expect(Array.isArray(result.geometry.rings)).toBe(true);
      expect(result.geometry.rings[0]).toHaveLength(5); // Should have 5 points (closed ring)
    });

    it("parses GeoJSON MultiPolygon geometry", () => {
      const geoJsonMultiPolygon = {
        type: "MultiPolygon",
        coordinates: [
          [ // First polygon
            [
              [25.0, 60.0],
              [25.1, 60.0],
              [25.1, 60.1],
              [25.0, 60.1],
              [25.0, 60.0] // Closed ring
            ]
          ],
          [ // Second polygon
            [
              [26.0, 61.0],
              [26.1, 61.0],
              [26.1, 61.1],
              [26.0, 61.1],
              [26.0, 61.0] // Closed ring
            ]
          ]
        ]
      };

      const result = parseNotamGeometryWithReason(geoJsonMultiPolygon);
      expect(result.geometry).not.toBeNull();
      expect(result.geometry?.kind).toBe("multiPolygon");
      if (!result.geometry || result.geometry.kind !== "multiPolygon") {
        throw new Error("Expected multiPolygon geometry");
      }
      expect(Array.isArray(result.geometry.polygons)).toBe(true);
      expect(result.geometry.polygons).toHaveLength(2); // Two polygons
    });

    it("parses GeoJSON Point geometry as circle", () => {
      const geoJsonPoint = {
        type: "Point",
        coordinates: [24.7536, 59.4369],
        radiusMeters: 1000
      };

      const result = parseNotamGeometryWithReason(geoJsonPoint);
      expect(result.geometry).not.toBeNull();
      expect(result.geometry?.kind).toBe("circle");
      if (!result.geometry || result.geometry.kind !== "circle") {
        throw new Error("Expected circle geometry");
      }
      expect(result.geometry.center).toEqual([24.7536, 59.4369]);
      expect(result.geometry.radiusMeters).toBe(1000);
    });

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
            [24.78, 59.45],
            [24.80, 59.45]
          ]
        ]
      };

      const result = parseNotamGeometryWithReason(geoJsonMultiLineString);
      expect(result.geometry).toBeNull();
      expect(result.reason).toBe("UNSUPPORTED_GEOJSON_TYPE");
      expect(result.details?.type).toBe("MultiLineString");
    });

    it("handles empty coordinates for Polygon", () => {
      const geoJsonEmptyPolygon = {
        type: "Polygon",
        coordinates: []
      };

      const result = parseNotamGeometryWithReason(geoJsonEmptyPolygon);
      expect(result.geometry).toBeNull();
      expect(result.reason).toBe("INVALID_COORDS");
    });

    it("handles invalid coordinates for Polygon", () => {
      const geoJsonInvalidPolygon = {
        type: "Polygon",
        coordinates: [
          [
            [24.74, 59.43] // Only one point, not enough for a polygon
          ]
        ]
      };

      const result = parseNotamGeometryWithReason(geoJsonInvalidPolygon);
      expect(result.geometry).toBeNull();
      expect(result.reason).toBe("INVALID_COORDS");
    });

    it("handles coordinates with insufficient points for Polygon", () => {
      const geoJsonInsufficientPoints = {
        type: "Polygon",
        coordinates: [
          [
            [24.74, 59.43],
            [24.76, 59.43] // Only two points, not enough for a polygon
          ]
        ]
      };

      const result = parseNotamGeometryWithReason(geoJsonInsufficientPoints);
      expect(result.geometry).toBeNull();
      expect(result.reason).toBe("INVALID_COORDS");
    });

    it("handles invalid coordinate format", () => {
      const geoJsonInvalidFormat = {
        type: "Polygon",
        coordinates: [
          [
            ["invalid", "format"] // Invalid coordinate format
          ]
        ]
      };

      const result = parseNotamGeometryWithReason(geoJsonInvalidFormat);
      expect(result.geometry).toBeNull();
      expect(result.reason).toBe("INVALID_COORDS");
    });

    // Skipping this test as it's difficult to create truly invalid coordinates that fail validation
    // Most invalid coordinate formats are handled by the coordinate parsing functions
  });
});
