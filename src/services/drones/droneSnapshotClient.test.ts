import { renderHook } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";

import { useDronesSnapshotStream } from "./droneSnapshotClient";

// Mock dependencies
const mockPolling = vi.fn();
vi.mock("@/services/polling/usePolling", () => ({
    usePolling: (...args: unknown[]) => mockPolling(...args),
}));

vi.mock("@/shared/env", () => ({
    ENV: {
        useMocks: () => false,
        poll: { dronesMs: () => 1000 },
        drones: {
            snapshotUrl: () => "http://test-server/v1/drones",
            centerLat: () => 58.0,
            centerLon: () => 25.0,
            radiusM: () => 500,
            n: () => 3,
            periodS: () => 30,
        },
    },
}));

describe("useDronesSnapshotStream", () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it("constructs correct URL with query params", () => {
        mockPolling.mockReturnValue({ data: [] });
        renderHook(() => useDronesSnapshotStream());

        const calledUrl = mockPolling.mock.calls[0][1];
        expect(calledUrl).toContain("http://test-server/v1/drones");
        expect(calledUrl).toContain("center=58%2C25"); // or %2C depending on helper
        expect(calledUrl).toContain("n=3");
    });

    it("maps valid snapshot response correctly", () => {
        mockPolling.mockReturnValue({ data: [] });
        renderHook(() => useDronesSnapshotStream());

        const mapper = mockPolling.mock.calls[0][3];
        const rawResponse = {
            server_time_utc: "2024-01-01T00:00:00Z",
            t_sec_used: 12345,
            center: { lat: 58, lon: 25 },
            drones: [
                {
                    id: "d1",
                    position: { lat: 58.1, lon: 25.1 },
                    headingDeg: 120,
                    altitude: { ref: "AGL", source: "reported", comment: "test" } // minimal
                }
            ]
        };

        const result = mapper(rawResponse);
        expect(result).toHaveLength(1);
        expect(result[0].id).toBe("d1");
        expect(result[0].position.lat).toBe(58.1);
        expect(result[0].ingestTimeUtc).toBeDefined();
    });

    it("throws error on invalid response shape", () => {
        mockPolling.mockReturnValue({ data: [] });
        renderHook(() => useDronesSnapshotStream());
        const mapper = mockPolling.mock.calls[0][3];

        expect(() => mapper({ wrong: "shape" })).toThrow("must contain 'drones' array");
        expect(() => mapper(null)).toThrow();
    });
});
