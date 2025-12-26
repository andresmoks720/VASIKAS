// This test verifies that the snapshot client works with the MSW mock,
// proving that we can test the snapshot flow without a running backend.

import { renderHook, waitFor } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";

import { useDronesSnapshotStream } from "./droneSnapshotClient";

// We want to use the REAL usePolling (which uses fetch), 
// but we mocked it in other tests. So we need to ensure we use the real implementation here
// or at least a fetch-based one. 
// However, standard vitest mocking mocks modules for the whole file.
// We can use vi.unmock to ensure we get the real thing if we were mocking it globally,
// but usually we mock explicitly in tests.

vi.doMock("@/services/polling/usePolling", async () => {
    return await vi.importActual("@/services/polling/usePolling");
});

vi.doMock("@/services/http/apiClient", async () => {
    return await vi.importActual("@/services/http/apiClient");
});

let snapshotCount = 1;

vi.mock("@/shared/env", () => ({
    ENV: {
        useMocks: () => false, // Ensure we don't force bad mock logic (though client logic is explicit)
        poll: { dronesMs: () => 10, defaultMs: () => 500 }, // fast poll for test
        drones: {
            snapshotUrl: () => "http://localhost/v1/drones",
            centerLat: () => 59.0,
            centerLon: () => 25.0,
            radiusM: () => 1000,
            n: () => snapshotCount,
            periodS: () => 60,
        },
    },
}));

describe("useDronesSnapshotStream with MSW", () => {
    beforeEach(() => {
        snapshotCount = 1;
    });

    it("fetches drone from MSW", async () => {
        const { result } = renderHook(() => useDronesSnapshotStream());

        // Wait for data to populate
        await waitFor(() => {
            if (result.current.status === "error") {
                console.error("Polling error:", result.current.error);
            }
            expect(result.current.data).not.toBeNull();
            expect(result.current.status).toBe("live");
        });

        const drones = result.current.data!;
        expect(drones).toHaveLength(1);
        expect(drones[0].id).toBe("msw-drone-1");
        // Check that lat/lon logic in MSW handler worked
        // Handler adds 0.01 to the center (59.0, 25.0) -> 59.01, 25.01
        expect(drones[0].position.lat).toBeCloseTo(59.01);
        expect(drones[0].position.lon).toBeCloseTo(25.01);
    });

    it("returns multiple drones when n is provided", async () => {
        snapshotCount = 2;
        const { result } = renderHook(() => useDronesSnapshotStream());

        await waitFor(() => {
            expect(result.current.status).toBe("live");
            expect(result.current.data).not.toBeNull();
        });

        const drones = result.current.data!;
        expect(drones).toHaveLength(2);
        expect(drones[0].id).toBe("msw-drone-1");
        expect(drones[1].id).toBe("msw-drone-2");
    });
});
