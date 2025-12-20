import { SensorDto } from "@/services/sensors/sensorsTypes";
import { LonLat } from "@/shared/types/domain";

export type GeofenceGeometry =
  | { kind: "circle"; center: LonLat; radiusMeters: number }
  | { kind: "polygon"; coordinates: LonLat[] };

export type PersistedGeofence = {
  id: string;
  name: string;
  description?: string;
  geometry: GeofenceGeometry;
  createdAtUtc: string;
  updatedAtUtc?: string;
};

export type PersistedSensor = SensorDto & {
  createdAtUtc: string;
  updatedAtUtc?: string;
};

export type PersistenceState = {
  version: number;
  geofences: PersistedGeofence[];
  sensors: PersistedSensor[];
};

export type PersistenceDefaults = Omit<PersistenceState, "version">;

export type StorageLike = {
  getItem(key: string): string | null;
  setItem(key: string, value: string): void;
  removeItem(key: string): void;
};

export type PersistenceAdapter = {
  load: () => PersistenceState;
  save: (state: PersistenceDefaults) => PersistenceState;
  clear: () => void;
};

export const PERSISTENCE_VERSION = 1;
export const STORAGE_KEY = "cuas.state.v1";

export function createMemoryStorage(initial?: Record<string, string>): StorageLike {
  const data = { ...(initial ?? {}) };

  return {
    getItem(key) {
      return key in data ? data[key] : null;
    },
    setItem(key, value) {
      data[key] = value;
    },
    removeItem(key) {
      delete data[key];
    },
  };
}

function getDefaultStorage(): StorageLike {
  if (typeof globalThis !== "undefined" && "localStorage" in globalThis) {
    const storage = (globalThis as { localStorage?: StorageLike }).localStorage;
    if (storage) {
      return storage;
    }
  }

  return createMemoryStorage();
}

function withVersion(state: PersistenceDefaults): PersistenceState {
  return {
    version: PERSISTENCE_VERSION,
    geofences: state.geofences ?? [],
    sensors: state.sensors ?? [],
  };
}

function cloneState(state: PersistenceState): PersistenceState {
  return JSON.parse(JSON.stringify(state)) as PersistenceState;
}

function isValidState(candidate: unknown): candidate is PersistenceState {
  if (!candidate || typeof candidate !== "object") {
    return false;
  }

  const value = candidate as PersistenceState;
  return typeof value.version === "number" && Array.isArray(value.geofences) && Array.isArray(value.sensors);
}

function loadState(storage: StorageLike, key: string, fallback: PersistenceState): PersistenceState {
  try {
    const raw = storage.getItem(key);
    if (!raw) {
      return cloneState(fallback);
    }

    const parsed = JSON.parse(raw);
    if (!isValidState(parsed)) {
      return cloneState(fallback);
    }

    if (parsed.version !== PERSISTENCE_VERSION) {
      return cloneState(fallback);
    }

    return withVersion({
      geofences: parsed.geofences ?? [],
      sensors: parsed.sensors ?? [],
    });
  } catch (error) {
    console.warn("Failed to load persisted state; falling back to defaults", error);
    return cloneState(fallback);
  }
}

function saveState(storage: StorageLike, key: string, state: PersistenceDefaults): PersistenceState {
  const payload = withVersion(state);

  try {
    storage.setItem(key, JSON.stringify(payload));
  } catch (error) {
    console.warn("Failed to save persisted state", error);
  }

  return payload;
}

export function createPersistenceAdapter(
  defaults: PersistenceDefaults,
  storage: StorageLike = getDefaultStorage(),
  storageKey = STORAGE_KEY,
): PersistenceAdapter {
  const fallback = withVersion(defaults);

  return {
    load: () => loadState(storage, storageKey, fallback),
    save: (state) => saveState(storage, storageKey, state),
    clear: () => storage.removeItem(storageKey),
  };
}
