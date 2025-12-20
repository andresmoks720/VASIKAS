import { Geofence } from "@/services/geofences/geofenceStore";

type MapApiEvent = {
    "set-geofences": Geofence[];
    "set-layer-visibility": { id: string; visible: boolean };
};

type MapApiListener<K extends keyof MapApiEvent> = (data: MapApiEvent[K]) => void;

class MapApi {
    private listeners: { [K in keyof MapApiEvent]?: MapApiListener<K>[] } = {};

    on<K extends keyof MapApiEvent>(event: K, callback: MapApiListener<K>) {
        if (!this.listeners[event]) {
            this.listeners[event] = [];
        }
        this.listeners[event]?.push(callback as any);
    }

    off<K extends keyof MapApiEvent>(event: K, callback: MapApiListener<K>) {
        const list = this.listeners[event];
        if (list) {
            this.listeners[event] = list.filter((cb) => cb !== callback) as any;
        }
    }

    setGeofences(geofences: Geofence[]) {
        this.emit("set-geofences", geofences);
    }

    setLayerVisibility(id: string, visible: boolean) {
        this.emit("set-layer-visibility", { id, visible });
    }

    private emit<K extends keyof MapApiEvent>(event: K, data: MapApiEvent[K]) {
        this.listeners[event]?.forEach((cb) => cb(data));
    }
}

export const mapApi = new MapApi();
