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
    loadLatestAirspaceData: vi.fn(),
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

  const mockedUseNotamStream = vi.mocked(notamStream.useNotamStream);
  const mockedAirspaceService = airspaceIntegrationService as unknown as {
    loadAirspaceFromHtml: ReturnType<typeof vi.fn>;
    loadLatestAirspaceData: ReturnType<typeof vi.fn>;
    loadAirspaceData: ReturnType<typeof vi.fn>;
    isLoadedForDate: ReturnType<typeof vi.fn>;
    isLoadedFromHtml: ReturnType<typeof vi.fn>;
    enhanceNotams: ReturnType<typeof vi.fn>;
    getLoadedSourceUrl: ReturnType<typeof vi.fn>;
    getLoadedSourceType: ReturnType<typeof vi.fn>;
    getEffectiveDate: ReturnType<typeof vi.fn>;
  };

  const toEnhancedNotam = (notam: NormalizedNotam): EnhancedNotam => ({
    ...notam,
    enhancedGeometry: null,
    sourceGeometry: notam.geometry,
    issues: [],
  });

  beforeEach(() => {
    vi.clearAllMocks();
    mockedUseNotamStream.mockReturnValue({
      data: mockNotams,
      status: "live",
      lastOkUtc: null,
      lastErrorUtc: null,
      tick: 0,
      ageSeconds: null,
      error: null,
      rawCount: 0,
      displayedCount: 0,
      dataSource: "mock",
      liveError: null,
    });
  });

  it("should handle error in enhancement by falling back to original geometry source without invalid values", async () => {
    // Simulate an error during enhancement
    mockedAirspaceService.loadAirspaceFromHtml.mockRejectedValue(new Error("HTML load failed"));
    mockedAirspaceService.loadLatestAirspaceData.mockRejectedValue(new Error("GeoJSON latest load failed"));
    mockedAirspaceService.loadAirspaceData.mockRejectedValue(new Error("GeoJSON load failed"));

    // We need enhanceNotams to return something so it doesn't stay null
    mockedAirspaceService.enhanceNotams.mockImplementation((notams: NormalizedNotam[]) =>
      notams.map((notam) => toEnhancedNotam(notam))
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

  it("does not refetch airspace data when already loaded", async () => {
    mockedAirspaceService.getLoadedSourceType.mockReturnValue("geojson");
    mockedAirspaceService.enhanceNotams.mockImplementation((notams: NormalizedNotam[]) =>
      notams.map((notam) => toEnhancedNotam(notam))
    );

    const { result } = renderHook(() => useEnhancedNotamStream());

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    }, { timeout: 3000 });

    expect(airspaceIntegrationService.loadAirspaceFromHtml).not.toHaveBeenCalled();
    expect(airspaceIntegrationService.loadLatestAirspaceData).not.toHaveBeenCalled();
    expect(airspaceIntegrationService.loadAirspaceData).not.toHaveBeenCalled();
  });
});
