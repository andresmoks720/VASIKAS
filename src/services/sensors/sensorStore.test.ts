import { describe, it, expect, vi } from "vitest";
import { SensorStore } from "./sensorStore";
import { createMemoryStorage, createPersistenceAdapter } from "@/services/persistence/localPersistence";

describe("SensorStore", () => {
    it("should start empty when using default adapter", () => {
        const store = new SensorStore(createPersistenceAdapter({ geofences: [], sensors: [] }, createMemoryStorage()));
        expect(store.getAll()).toEqual([]);
    });

    it("should create a sensor", () => {
        const storage = createMemoryStorage();
        const adapter = createPersistenceAdapter({ geofences: [], sensors: [] }, storage);
        const store = new SensorStore(adapter);

        const newSensor = store.create({
            name: "Test Sensor",
            kind: "radar",
            position: { lat: 59, lon: 24 },
        });

        expect(newSensor.name).toBe("Test Sensor");
        expect(store.getAll()).toHaveLength(1);
        expect(store.getAll()[0]).toEqual(newSensor);
    });

    it("should persist data", () => {
        const storage = createMemoryStorage();
        const adapter = createPersistenceAdapter({ geofences: [], sensors: [] }, storage);
        const store1 = new SensorStore(adapter);

        store1.create({ name: "Persisted", kind: "radar", position: { lat: 0, lon: 0 } });

        const store2 = new SensorStore(adapter);
        expect(store2.getAll()).toHaveLength(1);
        expect(store2.getAll()[0].name).toBe("Persisted");
    });

    it("should remove a sensor", () => {
        const adapter = createPersistenceAdapter({ geofences: [], sensors: [] }, createMemoryStorage());
        const store = new SensorStore(adapter);

        const s = store.create({ name: "To Remove", kind: "radar", position: { lat: 0, lon: 0 } });
        expect(store.getAll()).toHaveLength(1);

        const removed = store.remove(s.id);
        expect(removed).toBe(true);
        expect(store.getAll()).toHaveLength(0);
    });

    it("should notify listeners on change", () => {
        const store = new SensorStore(createPersistenceAdapter({ geofences: [], sensors: [] }, createMemoryStorage()));
        const listener = vi.fn();

        const unsub = store.subscribe(listener);

        store.create({ name: "Test", kind: "radar", position: { lat: 0, lon: 0 } });
        expect(listener).toHaveBeenCalledTimes(1);

        unsub();
        store.create({ name: "Test 2", kind: "radar", position: { lat: 0, lon: 0 } });
        expect(listener).toHaveBeenCalledTimes(1);
    });
});

// Helper for memory persistence in tests, slightly modified from real one to expose storage
import { PersistenceDefaults, StorageLike, createMemoryStorage as makeMem } from "@/services/persistence/localPersistence";
