import { renderHook, waitFor } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";

import { useDronesStream } from "./droneClient";

// Mock polling hook to control data injection
const mockPolling = vi.fn();
vi.mock("@/services/polling/usePolling", () => ({
  usePolling: (...args: unknown[]) => mockPolling(...args),
}));

// Mock env
vi.mock("@/shared/env", () => ({
  ENV: {
    useMocks: () => true,
    droneUrl: () => "/mock/drones.json",
    poll: {
      dronesMs: () => 1000,
    },
  },
}));

describe("useDronesStream", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("handles legacy array response (static mocks)", () => {
    const legacyData = [{
      id: "d1",
      track: [{ timeUtc: "2024-01-01T00:00:00Z", position: { lat: 0, lon: 0 }, headingDeg: 0, speedMps: 0, altitude: { meters: 0, ref: "AGL", source: "mock", comment: "c" } }]
    }];
    mockPolling.mockReturnValue({ data: legacyData });

    const { result } = renderHook(() => useDronesStream());

    expect(result.current.data).toHaveLength(1);
    expect(result.current.data![0].id).toBe("d1");
  });

  it("handles new envelope response (Mock API)", () => {
    // We need to verify that the mapper extracted 'drones' correctly.
    // However, usePolling returns the *result* of the mapper. 
    // So we need to test the logic that *calls* the mapper, or test the mapper directly if exported.
    // Since parseDroneResponse is internal, we can test behavior via what usePolling receives.
    // Wait, usePolling receives the raw fetch result? No, usually usePolling handles the fetch/map.
    // Let's look at droneClient.ts again.
    // "const polled = usePolling<DroneTrack[]>(..., mapper);"
    // So mockPolling should simulate what usePolling *returns*, which is the mapped data.
    // BUT the refactor is about changeing the *mapper*.

    // To test the mapper, we should export it or test the unit that contains it.
    // If I mock usePolling, I am mocking the *result* of the mapper, which bypasses the logic I want to test.
    // I should test `parseDroneResponse` if possible, or avoid mocking usePolling's internals this way if I want to test the mapping logic.

    // Actually, looking at `droneClient.ts`, the mapper is passed to `usePolling`.
    // So if I spy on `usePolling`, I can capture the `mapper` function passed to it and call it with different inputs.

    mockPolling.mockReturnValue({ data: [] }); // Default return
    renderHook(() => useDronesStream());

    const passedMapper = mockPolling.mock.calls[0][3];

    // Test Legacy
    const legacyResult = passedMapper([{
      id: "legacy",
      track: [{ timeUtc: "2024-01-01T00:00:00Z", position: { lat: 0, lon: 0 }, headingDeg: 0, speedMps: 0, altitude: { meters: 0, ref: "AGL", source: "mock", comment: "c" } }]
    }]);
    expect(legacyResult).toHaveLength(1);
    expect(legacyResult[0].id).toBe("legacy");

    // Test Envelope
    const envelopeResult = passedMapper({
      drones: [{
        id: "envelope",
        track: [{ timeUtc: "2024-01-01T00:00:00Z", position: { lat: 0, lon: 0 }, headingDeg: 0, speedMps: 0, altitude: { meters: 0, ref: "AGL", source: "mock", comment: "c" } }]
      }]
    });
    expect(envelopeResult).toHaveLength(1);
    expect(envelopeResult[0].id).toBe("envelope");
  });
});
