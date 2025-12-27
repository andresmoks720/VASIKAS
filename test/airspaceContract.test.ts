import { describe, expect, it } from "vitest";
import { validateAirspaceFeatureContract, validateAirspaceFeaturesContract } from "../src/services/airspace/airspaceContract";
import type { AirspaceFeature } from "../src/services/airspace/airspaceTypes";

describe("airspaceContract", () => {
  describe("validateAirspaceFeatureContract", () => {
    it("accepts valid polygon features", () => {
      const validFeature: AirspaceFeature = {
        type: "Feature",
        geometry: {
          type: "Polygon",
          coordinates: [
            [
              [24.74, 59.43], // [lon, lat]
              [24.76, 59.43],
              [24.76, 59.44],
              [24.74, 59.44],
              [24.74, 59.43] // Closed ring
            ]
          ]
        },
        properties: {
          designator: "EER15D",
          upperLimit: "FL100",
          lowerLimit: "SFC",
          remarks: "Restricted area",
          sourceUrl: "https://example.com"
        }
      };

      const result = validateAirspaceFeatureContract(validFeature);
      expect(result.valid).toBe(true);
      expect(result.issues).toHaveLength(0);
    });

    it("rejects polygon with insufficient points", () => {
      const invalidFeature: AirspaceFeature = {
        type: "Feature",
        geometry: {
          type: "Polygon",
          coordinates: [
            [
              [24.74, 59.43], // Only 2 points - not enough for a polygon
              [24.76, 59.43]
            ]
          ]
        },
        properties: {
          designator: "EER15D",
          upperLimit: "FL100",
          lowerLimit: "SFC",
          remarks: "Restricted area",
          sourceUrl: "https://example.com"
        }
      };

      const result = validateAirspaceFeatureContract(invalidFeature);
      expect(result.valid).toBe(false);
      expect(result.issues).toContainEqual(expect.stringContaining("fewer than 3 points"));
    });

    it("rejects polygon with coordinates out of range", () => {
      const invalidFeature: AirspaceFeature = {
        type: "Feature",
        geometry: {
          type: "Polygon",
          coordinates: [
            [
              [200, 59.43], // Longitude out of range
              [24.76, 59.43],
              [24.76, 59.44],
              [200, 59.43] // Same invalid longitude, but ring is closed
            ]
          ]
        },
        properties: {
          designator: "EER15D",
          upperLimit: "FL100",
          lowerLimit: "SFC",
          remarks: "Restricted area",
          sourceUrl: "https://example.com"
        }
      };

      const result = validateAirspaceFeatureContract(invalidFeature);
      expect(result.valid).toBe(false);
      expect(result.issues).toContainEqual(expect.stringContaining("longitude out of range"));
    });

    it("rejects polygon with unclosed ring", () => {
      const invalidFeature: AirspaceFeature = {
        type: "Feature",
        geometry: {
          type: "Polygon",
          coordinates: [
            [
              [24.74, 59.43],
              [24.76, 59.43],
              [24.76, 59.44],
              [24.75, 59.44] // Ring not closed - first and last points are different
            ]
          ]
        },
        properties: {
          designator: "EER15D",
          upperLimit: "FL100",
          lowerLimit: "SFC",
          remarks: "Restricted area",
          sourceUrl: "https://example.com"
        }
      };

      const result = validateAirspaceFeatureContract(invalidFeature);
      expect(result.valid).toBe(false);
      expect(result.issues).toContainEqual(expect.stringContaining("is not closed"));
    });

    it("accepts valid multipolygon features", () => {
      const validFeature: AirspaceFeature = {
        type: "Feature",
        geometry: {
          type: "MultiPolygon",
          coordinates: [
            [ // First polygon
              [
                [24.74, 59.43],
                [24.76, 59.43],
                [24.76, 59.44],
                [24.74, 59.44],
                [24.74, 59.43] // Closed ring
              ]
            ],
            [ // Second polygon
              [
                [25.0, 60.0],
                [25.1, 60.0],
                [25.1, 60.1],
                [25.0, 60.1],
                [25.0, 60.0] // Closed ring
              ]
            ]
          ]
        },
        properties: {
          designator: "EER15D",
          upperLimit: "FL100",
          lowerLimit: "SFC",
          remarks: "Complex restricted area",
          sourceUrl: "https://example.com"
        }
      };

      const result = validateAirspaceFeatureContract(validFeature);
      expect(result.valid).toBe(true);
      expect(result.issues).toHaveLength(0);
    });

    it("rejects multipolygon with invalid polygons", () => {
      const invalidFeature: AirspaceFeature = {
        type: "Feature",
        geometry: {
          type: "MultiPolygon",
          coordinates: [
            [ // Valid polygon
              [
                [24.74, 59.43],
                [24.76, 59.43],
                [24.76, 59.44],
                [24.74, 59.44],
                [24.74, 59.43] // Closed ring
              ]
            ],
            [ // Invalid polygon with only 2 points
              [
                [25.0, 60.0],
                [25.1, 60.0]
              ]
            ]
          ]
        },
        properties: {
          designator: "EER15D",
          upperLimit: "FL100",
          lowerLimit: "SFC",
          remarks: "Complex restricted area",
          sourceUrl: "https://example.com"
        }
      };

      const result = validateAirspaceFeatureContract(invalidFeature);
      expect(result.valid).toBe(false);
      expect(result.issues).toContainEqual(expect.stringContaining("fewer than 3 points"));
    });

    it("accepts valid point features", () => {
      const validFeature: AirspaceFeature = {
        type: "Feature",
        geometry: {
          type: "Point",
          coordinates: [24.75, 59.43] // [lon, lat]
        },
        properties: {
          designator: "EER15D",
          upperLimit: "FL100",
          lowerLimit: "SFC",
          remarks: "Point location",
          sourceUrl: "https://example.com"
        }
      };

      const result = validateAirspaceFeatureContract(validFeature);
      expect(result.valid).toBe(true);
      expect(result.issues).toHaveLength(0);
    });

    it("rejects point with coordinates out of range", () => {
      const invalidFeature: AirspaceFeature = {
        type: "Feature",
        geometry: {
          type: "Point",
          coordinates: [200, 59.43] // Longitude out of range
        },
        properties: {
          designator: "EER15D",
          upperLimit: "FL100",
          lowerLimit: "SFC",
          remarks: "Point location",
          sourceUrl: "https://example.com"
        }
      };

      const result = validateAirspaceFeatureContract(invalidFeature);
      expect(result.valid).toBe(false);
      expect(result.issues).toContainEqual(expect.stringContaining("longitude out of range"));
    });

    it("rejects feature with missing designator", () => {
      const invalidFeature: AirspaceFeature = {
        type: "Feature",
        geometry: {
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
        },
        properties: {
          // Missing designator
          upperLimit: "FL100",
          lowerLimit: "SFC",
          remarks: "Restricted area",
          sourceUrl: "https://example.com"
        }
      };

      const result = validateAirspaceFeatureContract(invalidFeature);
      expect(result.valid).toBe(false);
      expect(result.issues).toContainEqual(expect.stringContaining("Missing or invalid designator"));
    });
  });

  describe("validateAirspaceFeaturesContract", () => {
    it("accepts array of valid features", () => {
      const validFeatures: AirspaceFeature[] = [
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
                [24.74, 59.43] // Closed ring
              ]
            ]
          },
          properties: {
            designator: "EER15D",
            upperLimit: "FL100",
            lowerLimit: "SFC",
            remarks: "Restricted area",
            sourceUrl: "https://example.com"
          }
        },
        {
          type: "Feature",
          geometry: {
            type: "Point",
            coordinates: [24.75, 59.43]
          },
          properties: {
            designator: "EER16D",
            upperLimit: "FL200",
            lowerLimit: "GND",
            remarks: "Point location",
            sourceUrl: "https://example.com"
          }
        }
      ];

      const result = validateAirspaceFeaturesContract(validFeatures);
      expect(result.valid).toBe(true);
      expect(result.issues).toHaveLength(0);
    });

    it("rejects array with invalid features", () => {
      const mixedFeatures: AirspaceFeature[] = [
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
                [24.74, 59.43] // Closed ring
              ]
            ]
          },
          properties: {
            designator: "EER15D",
            upperLimit: "FL100",
            lowerLimit: "SFC",
            remarks: "Restricted area",
            sourceUrl: "https://example.com"
          }
        },
        {
          type: "Feature",
          geometry: {
            type: "Polygon",
            coordinates: [
              [
                [200, 59.43], // Invalid longitude
                [24.76, 59.43],
                [24.76, 59.44],
                [200, 59.43] // Closed ring but with invalid coordinate
              ]
            ]
          },
          properties: {
            designator: "EER16D",
            upperLimit: "FL100",
            lowerLimit: "SFC",
            remarks: "Restricted area",
            sourceUrl: "https://example.com"
          }
        }
      ];

      const result = validateAirspaceFeaturesContract(mixedFeatures);
      expect(result.valid).toBe(false);
      expect(result.issues).toContainEqual(expect.stringContaining("longitude out of range"));
    });
  });
});