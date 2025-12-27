import React from "react";
import { render, waitFor } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { useEnhancedNotamStream } from "./useEnhancedNotamStream";
import { NormalizedNotam } from "./notamTypes";

// Mock dependencies
const useNotamStreamMock = vi.fn();
const mockEnhanceNotams = vi.fn();
const mockLoadAirspaceFromHtml = vi.fn();
const mockLoadAirspaceData = vi.fn();
const mockIsLoadedForDate = vi.fn();

vi.mock("./notamStream", () => ({
  useNotamStream: () => useNotamStreamMock(),
}));

// Mock the AirspaceIntegrationService class
vi.mock("../airspace/AirspaceIntegrationService", () => {
    return {
        AirspaceIntegrationService: vi.fn().mockImplementation(() => ({
            leadAirspaceFromHtml: mockLoadAirspaceFromHtml,
            loadAirspaceFromHtml: mockLoadAirspaceFromHtml,
            loadAirspaceData: mockLoadAirspaceData,
            isLoadedForDate: mockIsLoadedForDate,
            enhanceNotams: mockEnhanceNotams,
        })),
    };
});

function TestHarness({ callback }: { callback: (result: any) => void }) {
  const result = useEnhancedNotamStream();
  callback(result);
  return null;
}

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
    useNotamStreamMock.mockReset();
    mockEnhanceNotams.mockReset();
    mockLoadAirspaceFromHtml.mockReset();
    mockLoadAirspaceData.mockReset();
    mockIsLoadedForDate.mockReset();

    useNotamStreamMock.mockReturnValue({
      data: mockNotams,
      isLoading: false,
      error: null,
    });
  });

  it("should handle error in enhancement by falling back to original geometry source without invalid values", async () => {
    // Simulate an error during enhancement
    mockLoadAirspaceFromHtml.mockRejectedValue(new Error("HTML load failed"));
    mockLoadAirspaceData.mockRejectedValue(new Error("GeoJSON load failed"));
    
    // Using real timers for the async effect
    
    let lastResult: any;
    render(<TestHarness callback={(res) => { lastResult = res; }} />);

    await waitFor(() => {
        expect(lastResult.isLoading).toBe(false);
    });

    // Check that we got data back
    expect(lastResult.data).toHaveLength(2);
    
    // Check key properties
    const notamWithGeom = lastResult.data[0];
    const notamNoGeom = lastResult.data[1];

    // This is the critical check: geometrySource should NOT be 'parsed'
    expect(notamWithGeom.geometrySource).not.toBe('parsed');
    expect(notamWithGeom.geometrySource).toBe('notamText');
    
    expect(notamNoGeom.geometrySource).toBe('none');
  });
});
