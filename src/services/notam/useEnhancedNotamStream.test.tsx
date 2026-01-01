import { renderHook, waitFor } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { useEnhancedNotamStream } from "./useEnhancedNotamStream";
import { airspaceIntegrationService } from "../airspace/AirspaceIntegrationService";
import * as notamStream from "./notamStream";
import type { EnhancedNotam } from "../airspace/airspaceTypes";
import type { NormalizedNotam } from "./notamTypes";

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
  const mockNotams: NormalizedNotam[] = [
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
    const mockedUseNotamStream = vi.mocked(notamStream.useNotamStream);
    mockedUseNotamStream.mockReturnValue({
      data: mockNotams,
      status: "live",
      lastOkUtc: null,
      lastErrorUtc: null,
      ageSeconds: null,
      error: null,
      tick: 0,
      rawCount: 2,
      displayedCount: 2,
      dataSource: "mock",
      liveError: null,
    });
  });

  it("should handle error in enhancement by falling back to original geometry source without invalid values", async () => {
    // Simulate an error during enhancement
    vi.mocked(airspaceIntegrationService.loadAirspaceFromHtml).mockRejectedValue(new Error("HTML load failed"));
    vi.mocked(airspaceIntegrationService.loadAirspaceData).mockRejectedValue(new Error("GeoJSON load failed"));

    // We need enhanceNotams to return something so it doesn't stay null
    vi.mocked(airspaceIntegrationService.enhanceNotams).mockImplementation((notams: NormalizedNotam[]) =>
      notams.map((notam) => ({
        ...notam,
        enhancedGeometry: null,
        sourceGeometry: notam.geometry,
        geometrySource: notam.geometrySource,
        geometrySourceDetails: notam.geometrySourceDetails,
        issues: [],
      })) as EnhancedNotam[],
    );

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
