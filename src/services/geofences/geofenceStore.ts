import {
    createPersistenceAdapter,
    PersistedGeofence,
    PersistenceAdapter,
    PersistenceDefaults,
} from "@/services/persistence/localPersistence";
import { circleToPolygonWgs84 } from "@/shared/geo/circle";
import { GeoJsonPolygon, LonLat } from "@/shared/types/domain";

export type Geofence = PersistedGeofence;

export type CreateCircleParams = {
    name: string;
    center: LonLat;
    radiusMeters: number;
    description?: string;
};

export class GeofenceStore {
    private adapter: PersistenceAdapter;

    constructor(adapter?: PersistenceAdapter) {
        // If no adapter injected, use default local persistence with empty defaults
        const defaults: PersistenceDefaults = { geofences: [], sensors: [] };
        this.adapter = adapter ?? createPersistenceAdapter(defaults);
    }

    getAll(): Geofence[] {
        const state = this.adapter.load();
        return state.geofences;
    }

    getById(id: string): Geofence | undefined {
        const state = this.adapter.load();
        return state.geofences.find((g) => g.id === id);
    }

    createCircle(params: CreateCircleParams): Geofence {
        const state = this.adapter.load();

        const newGeofence: Geofence = {
            id: crypto.randomUUID(),
            name: params.name,
            description: params.description,
            geometry: {
                kind: "circle",
                center: params.center,
                radiusMeters: params.radiusMeters,
            },
            createdAtUtc: new Date().toISOString(),
            updatedAtUtc: new Date().toISOString(),
        };

        state.geofences.push(newGeofence);
        this.adapter.save(state);

        return newGeofence;
    }

    rename(id: string, newName: string): Geofence | undefined {
        const state = this.adapter.load();
        const geofence = state.geofences.find((g) => g.id === id);

        if (geofence) {
            geofence.name = newName;
            geofence.updatedAtUtc = new Date().toISOString();
            this.adapter.save(state);
            return geofence;
        }

        return undefined;
    }

    remove(id: string): boolean {
        const state = this.adapter.load();
        const initialLength = state.geofences.length;
        const filtered = state.geofences.filter((g) => g.id !== id);

        if (filtered.length !== initialLength) {
            state.geofences = filtered;
            this.adapter.save(state);
            return true;
        }

        return false;
    }

    // Returns the polygon representation for rendering, computed on demand
    asPolygon(geofence: Geofence): GeoJsonPolygon {
        if (geofence.geometry.kind === "circle") {
            return circleToPolygonWgs84(geofence.geometry.center, geofence.geometry.radiusMeters);
        }
        return geofence.geometry.coordinates as unknown as GeoJsonPolygon; // Should be handled if we support raw polygons later
    }
}

export const geofenceStore = new GeofenceStore();
