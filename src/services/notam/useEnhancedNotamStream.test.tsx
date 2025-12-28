import { renderHook, waitFor } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { useEnhancedNotamStream } from "./useEnhancedNotamStream";
import { airspaceIntegrationService } from "../airspace/AirspaceIntegrationService";
import * as notamStream from "./notamStream";

// Mock dependencies
vi.mock("./notamStream", () => ({
  useNotamStream: vi.fn(),
}));

// Mock the AirspaceIntegrationService class and singleton
vi.mock("../airspace/AirspaceIntegrationService", () => {
  const mockService = {
    loadAirspaceFromHtml: vi.fn(),
    loadAirspaceData: vi.fn(),
    isLoadedForDate: vi.fn(),
    isLoadedFromHtml: vi.fn().mockReturnValue(false),
    enhanceNotams: vi.fn(),
    getLoadedSourceUrl: vi.fn().mockReturnValue(null),
    getLoadedSourceType: vi.fn().mockReturnValue(null),
    getEffectiveDate: vi.fn().mockReturnValue(null),
  };

  return {
    AirspaceIntegrationService: vi.fn().mockImplementation(() => mockService),
    airspaceIntegrationService: mockService,
  };
});

describe("useEnhancedNotamStream", () => {
  const mockNotams = [
    {
      id: "A1234/25",
      summary: "Test Notam",
      text: "Test Notam Text",
      altitudes: [],
      geometry: { kind: "circle", center: [0, 0], radiusMeters: 1000 },
      geometrySource: "notamText",
      eventTimeUtc: "2025-01-01T00:00:00Z",
      raw: {},
    },
    {
      id: "B1234/25",
      summary: "Test Notam No Geom",
      text: "Test Notam Text No Geom",
      altitudes: [],
      geometry: null,
      geometrySource: "none",
      eventTimeUtc: "2025-01-01T00:00:00Z",
      raw: {},
    },
  ];

  beforeEach(() => {
    vi.clearAllMocks();
    (notamStream.useNotamStream as any).mockReturnValue({
      data: mockNotams,
      isLoading: false,
      error: null,
    });
  });

  it("should handle error in enhancement by falling back to original geometry source without invalid values", async () => {
    // Simulate an error during enhancement
    (airspaceIntegrationService.loadAirspaceFromHtml as any).mockRejectedValue(new Error("HTML load failed"));
    (airspaceIntegrationService.loadAirspaceData as any).mockRejectedValue(new Error("GeoJSON load failed"));

    // We need enhanceNotams to return something so it doesn't stay null
    (airspaceIntegrationService.enhanceNotams as any).mockImplementation((notams: any[]) => notams.map(n => ({
      ...n,
      enhancedGeometry: null,
      sourceGeometry: n.geometry,
      geometrySource: n.geometrySource,
      geometrySourceDetails: n.geometrySourceDetails,
    })));

    const { result } = renderHook(() => useEnhancedNotamStream());

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    }, { timeout: 3000 });

    // Check that we got data back
    expect(result.current.data).not.toBeNull();
    expect(result.current.data).toHaveLength(2);

    // Check key properties
    const data = result.current.data!;
    const notamWithGeom = data[0];
    const notamNoGeom = data[1];

    // This is the critical check: geometrySource should NOT be 'parsed'
    expect(notamWithGeom.geometrySource).not.toBe('parsed');
    expect(notamWithGeom.geometrySource).toBe('notamText');

    expect(notamNoGeom.geometrySource).toBe('none');
  });
});
