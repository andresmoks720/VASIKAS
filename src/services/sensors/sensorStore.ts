import {
    createPersistenceAdapter,
    PersistedSensor,
    PersistenceAdapter,
    PersistenceDefaults,
} from "@/services/persistence/localPersistence";
import { LonLat } from "@/shared/types/domain";

export type UserSensor = PersistedSensor;

export type CreateSensorParams = {
    name: string;
    kind: string;
    position: LonLat;
    description?: string;
};

export class SensorStore {
    private adapter: PersistenceAdapter;

    constructor(adapter?: PersistenceAdapter) {
        const defaults: PersistenceDefaults = { geofences: [], sensors: [] };
        this.adapter = adapter ?? createPersistenceAdapter(defaults);
    }

    getAll(): UserSensor[] {
        const state = this.adapter.load();
        return state.sensors;
    }

    getById(id: string): UserSensor | undefined {
        const state = this.adapter.load();
        return state.sensors.find((s) => s.id === id);
    }

    private listeners = new Set<() => void>();

    subscribe(listener: () => void): () => void {
        this.listeners.add(listener);
        return () => this.listeners.delete(listener);
    }

    private notify() {
        this.listeners.forEach((l) => l());
    }

    create(params: CreateSensorParams): UserSensor {
        const state = this.adapter.load();

        const newSensor: UserSensor = {
            id: crypto.randomUUID(),
            name: params.name,
            kind: params.kind,
            position: params.position,
            status: "online", // Default status for manual sensors
            lastSeenUtc: new Date().toISOString(),
            createdAtUtc: new Date().toISOString(),
            updatedAtUtc: new Date().toISOString(),
            coverage: {
                radiusMeters: 5000, // Default coverage
                minAltM: 0,
                maxAltM: 1000,
            },
        };

        state.sensors.push(newSensor);
        this.adapter.save(state);
        this.notify();

        return newSensor;
    }

    remove(id: string): boolean {
        const state = this.adapter.load();
        const initialLength = state.sensors.length;
        const filtered = state.sensors.filter((s) => s.id !== id);

        if (filtered.length !== initialLength) {
            state.sensors = filtered;
            this.adapter.save(state);
            this.notify();
            return true;
        }

        return false;
    }
}

export const sensorStore = new SensorStore();
