import { describe, expect, it } from "vitest";

import {
  PERSISTENCE_VERSION,
  STORAGE_KEY,
  createMemoryStorage,
  createPersistenceAdapter,
} from "./localPersistence";
import { PersistenceDefaults } from "./localPersistence";

const DEFAULTS: PersistenceDefaults = {
  geofences: [
    {
      id: "geofence-1",
      name: "Demo circle",
      description: "Prototype geofence",
      geometry: { kind: "circle", center: { lon: 24.7536, lat: 59.4369 }, radiusMeters: 250 },
      createdAtUtc: "2025-12-18T10:00:00Z",
    },
  ],
  sensors: [
    {
      id: "sensor-1",
      name: "User sensor",
      kind: "rf",
      position: { lon: 24.7568, lat: 59.4392 },
      status: "online",
      lastSeenUtc: "2025-12-18T10:00:00Z",
      coverage: { radiusMeters: 750, minAltM: 0, maxAltM: 200 },
      createdAtUtc: "2025-12-18T10:00:00Z",
    },
  ],
};

describe("localPersistence", () => {
  it("returns defaults when storage is empty", () => {
    const storage = createMemoryStorage();
    const adapter = createPersistenceAdapter(DEFAULTS, storage);

    const loaded = adapter.load();

    expect(loaded).toEqual({ version: PERSISTENCE_VERSION, ...DEFAULTS });
  });

  it("falls back to defaults when stored JSON is corrupt", () => {
    const storage = createMemoryStorage({ [STORAGE_KEY]: "not-json" });
    const adapter = createPersistenceAdapter(DEFAULTS, storage);

    const loaded = adapter.load();

    expect(loaded.geofences).toEqual(DEFAULTS.geofences);
    expect(loaded.sensors).toEqual(DEFAULTS.sensors);
  });

  it("saves and reloads state round-trip", () => {
    const storage = createMemoryStorage();
    const adapter = createPersistenceAdapter(DEFAULTS, storage);
    const nextState: PersistenceDefaults = {
      geofences: [
        {
          id: "geofence-2",
          name: "Updated circle",
          geometry: { kind: "circle", center: { lon: 24.7612, lat: 59.4421 }, radiusMeters: 500 },
          createdAtUtc: "2025-12-19T12:00:00Z",
          updatedAtUtc: "2025-12-19T12:00:00Z",
        },
      ],
      sensors: [
        {
          id: "sensor-2",
          name: "Temporary sensor",
          kind: "visual",
          position: { lon: 24.7625, lat: 59.4401 },
          status: "offline",
          lastSeenUtc: "2025-12-19T12:00:00Z",
          coverage: { radiusMeters: 250, minAltM: 0, maxAltM: 100 },
          createdAtUtc: "2025-12-19T12:00:00Z",
          updatedAtUtc: "2025-12-19T12:10:00Z",
        },
      ],
    };

    adapter.save(nextState);
    const loaded = adapter.load();

    expect(loaded).toEqual({ version: PERSISTENCE_VERSION, ...nextState });
    expect(storage.getItem(STORAGE_KEY)).toContain("geofence-2");
  });
});
