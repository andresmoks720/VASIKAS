import { describe, it, expect, beforeEach, vi } from "vitest";
import { GeofenceStore } from "./geofenceStore";
import { PersistenceAdapter, PersistenceState } from "@/services/persistence/localPersistence";
import { LonLat } from "@/shared/types/domain";

describe("GeofenceStore", () => {
    let mockAdapter: PersistenceAdapter;
    let store: GeofenceStore;
    let storedState: PersistenceState;

    beforeEach(() => {
        storedState = {
            version: 1,
            geofences: [],
            sensors: [],
        };

        mockAdapter = {
            load: vi.fn(() => ({ ...storedState })), // Return copy to simulate reload
            save: vi.fn((newState) => {
                storedState = { ...storedState, ...newState, version: 1 };
                return storedState;
            }),
            clear: vi.fn(() => {
                storedState = { version: 1, geofences: [], sensors: [] };
            }),
        };

        store = new GeofenceStore(mockAdapter);
    });

    describe("createCircle", () => {
        it("should create a circle geofence and persist it", () => {
            const center: LonLat = { lon: 24.0, lat: 59.0 };
            const geofence = store.createCircle({
                name: "Test Zone",
                center,
                radiusMeters: 500,
                description: "A test zone",
            });

            expect(geofence.id).toBeDefined();
            expect(geofence.name).toBe("Test Zone");
            expect(geofence.geometry.kind).toBe("circle");
            if (geofence.geometry.kind === "circle") {
                expect(geofence.geometry.center).toEqual(center);
                expect(geofence.geometry.radiusMeters).toBe(500);
            }
            expect(geofence.createdAtUtc).toBeDefined();

            // Verify persistence interaction
            expect(mockAdapter.save).toHaveBeenCalled();
            expect(storedState.geofences).toHaveLength(1);
            expect(storedState.geofences[0].id).toBe(geofence.id);
        });
    });

    describe("getAll and getById", () => {
        it("should retrieve created geofences", () => {
            const g1 = store.createCircle({ name: "G1", center: { lon: 0, lat: 0 }, radiusMeters: 100 });
            const g2 = store.createCircle({ name: "G2", center: { lon: 1, lat: 1 }, radiusMeters: 200 });

            const all = store.getAll();
            expect(all).toHaveLength(2);
            expect(all.map((g) => g.id)).toEqual(expect.arrayContaining([g1.id, g2.id]));

            const found = store.getById(g1.id);
            expect(found).toEqual(g1);
        });

        it("should return undefined for non-existent id", () => {
            expect(store.getById("missing")).toBeUndefined();
        });
    });

    describe("rename", () => {
        it("should rename an existing geofence and update persistence", async () => {
            // Force an older timestamp to ensure change is detected
            // We need to access the internal state via getAll/getById to modify it "behind the scenes" 
            // or just wait. But since we mock the adapter, we can just assume the next call changes it.
            // However, createCircle uses new Date(). rename uses new Date(). safely, we can sleep or just mock timer.
            // Easiest: Use vi.setSystemTime

            vi.useFakeTimers();
            const date1 = new Date("2024-01-01T12:00:00Z");
            vi.setSystemTime(date1);

            const g1_fixed = store.createCircle({ name: "Old Name 2", center: { lon: 0, lat: 0 }, radiusMeters: 100 });

            const date2 = new Date("2024-01-01T13:00:00Z");
            vi.setSystemTime(date2);

            const oldUpdatedAt = g1_fixed.updatedAtUtc;
            const updated = store.rename(g1_fixed.id, "New Name");

            expect(updated).toBeDefined();
            expect(updated?.name).toBe("New Name");
            expect(updated?.updatedAtUtc).not.toBe(oldUpdatedAt); // timestamps differ
            expect(updated?.updatedAtUtc).toBe(date2.toISOString());

            const fromStore = store.getById(g1_fixed.id);
            expect(fromStore?.name).toBe("New Name");

            vi.useRealTimers();
        });
        it("should return undefined if geofence does not exist", () => {
            expect(store.rename("missing", "New Name")).toBeUndefined();
        });
    });

    describe("remove", () => {
        it("should remove an existing geofence and persist change", () => {
            const g1 = store.createCircle({ name: "Delete Me", center: { lon: 0, lat: 0 }, radiusMeters: 100 });
            expect(store.getAll()).toHaveLength(1);

            const success = store.remove(g1.id);
            expect(success).toBe(true);
            expect(store.getAll()).toHaveLength(0);
            expect(mockAdapter.save).toHaveBeenCalled();
        });

        it("should return false if geofence does not exist", () => {
            expect(store.remove("missing")).toBe(false);
        });
    });

    describe("asPolygon", () => {
        it("should convert circle geofence to polygon", () => {
            const g1 = store.createCircle({ name: "Circle", center: { lon: 0, lat: 0 }, radiusMeters: 100 });
            const poly = store.asPolygon(g1);

            expect(poly.type).toBe("Polygon");
            expect(poly.coordinates).toHaveLength(1); // One ring
            expect(poly.coordinates[0].length).toBeGreaterThan(3); // Multiple points
        });
    });
});
