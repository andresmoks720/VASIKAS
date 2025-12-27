import { describe, expect, it } from "vitest";

import { normalizeNotams } from "@/services/notam/notamNormalizer";
import { notamGeometryToOl } from "./createNotamsLayerController";

describe("polygon NOTAM rendering", () => {
  it("renders polygon NOTAMs from mock data format correctly", () => {
    const mockNotamData = {
      generatedAtUtc: "2025-12-18T10:00:00Z",
      items: [
        {
          id: "B5678/25",
          text: "DRONE EXERCISE ... GND TO 500FT AGL ...",
          validFromUtc: "2025-12-18T08:00:00Z",
          validToUtc: "2025-12-18T16:00:00Z",
          geometryHint: {
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

    const normalized = normalizeNotams(mockNotamData, "2025-12-18T10:00:00Z");
    expect(normalized).toHaveLength(1);
    
    const notam = normalized[0];
    expect(notam.geometry?.kind).toBe("polygon");
    
    const olGeometry = notamGeometryToOl(notam.geometry);
    expect(olGeometry).not.toBeNull();
    expect(olGeometry?.getType()).toBe("Polygon");
    
    const coords = olGeometry?.getCoordinates() ?? [];
    expect(coords.length).toBeGreaterThan(0);
    expect(coords[0].length).toBeGreaterThan(0); // Should have at least one ring
  });

  it("renders multi-polygon NOTAMs from mock data format correctly", () => {
    const mockNotamData = {
      generatedAtUtc: "2025-12-18T10:00:00Z",
      items: [
        {
          id: "C9012/25",
          text: "MULTIPLE DRONE OPERATIONS ... SFC TO 1000FT AMSL ...",
          validFromUtc: "2025-12-18T10:00:00Z",
          validToUtc: "2025-12-18T18:00:00Z",
          geometryHint: {
            type: "MultiPolygon",
            coordinates: [
              [
                [
                  [25.0, 60.0],
                  [25.1, 60.0],
                  [25.1, 60.1],
                  [25.0, 60.1],
                  [25.0, 60.0]
                ]
              ],
              [
                [
                  [25.2, 60.2],
                  [25.3, 60.2],
                  [25.3, 60.3],
                  [25.2, 60.3],
                  [25.2, 60.2]
                ]
              ]
            ]
          }
        }
      ]
    };

    const normalized = normalizeNotams(mockNotamData, "2025-12-18T10:00:00Z");
    expect(normalized).toHaveLength(1);
    
    const notam = normalized[0];
    expect(notam.geometry?.kind).toBe("multiPolygon");
    
    const olGeometry = notamGeometryToOl(notam.geometry);
    expect(olGeometry).not.toBeNull();
    expect(olGeometry?.getType()).toBe("MultiPolygon");
    
    const coords = olGeometry?.getCoordinates() ?? [];
    expect(coords.length).toBe(2); // Should have 2 polygons
  });

  it("handles mixed geometry types in NOTAM data", () => {
    const mockNotamData = {
      generatedAtUtc: "2025-12-18T10:00:00Z",
      items: [
        {
          id: "A1234/25",
          text: "TEMP RESTRICTED AREA ... SFC TO 3000FT AMSL ...",
          validFromUtc: "2025-12-18T00:00:00Z",
          validToUtc: "2025-12-19T23:59:59Z",
          geometryHint: {
            type: "circle",
            center: { lon: 24.7536, lat: 59.4369 },
            radiusMeters: 1000
          }
        },
        {
          id: "B5678/25",
          text: "DRONE EXERCISE ... GND TO 500FT AGL ...",
          validFromUtc: "2025-12-18T08:00:00Z",
          validToUtc: "2025-12-18T16:00:00Z",
          geometryHint: {
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

    const normalized = normalizeNotams(mockNotamData, "2025-12-18T10:00:00Z");
    expect(normalized).toHaveLength(2);
    
    // Check circle NOTAM
    const circleNotam = normalized.find(n => n.id === "A1234/25");
    expect(circleNotam?.geometry?.kind).toBe("circle");
    const circleOlGeometry = notamGeometryToOl(circleNotam?.geometry);
    expect(circleOlGeometry).not.toBeNull();
    expect(circleOlGeometry?.getType()).toBe("Polygon"); // Circles are converted to polygons
    
    // Check polygon NOTAM
    const polygonNotam = normalized.find(n => n.id === "B5678/25");
    expect(polygonNotam?.geometry?.kind).toBe("polygon");
    const polygonOlGeometry = notamGeometryToOl(polygonNotam?.geometry);
    expect(polygonOlGeometry).not.toBeNull();
    expect(polygonOlGeometry?.getType()).toBe("Polygon");
  });
});