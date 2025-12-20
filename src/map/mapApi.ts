import { Geofence } from "@/services/geofences/geofenceStore";
import { NormalizedNotam } from "@/services/notam/notamTypes";

type MapApiEvent = {
    "set-geofences": Geofence[];
    "set-notams": NormalizedNotam[];
    "set-layer-visibility": { id: string; visible: boolean };
};

type MapApiListener<K extends keyof MapApiEvent> = (data: MapApiEvent[K]) => void;

class MapApi {
    private listeners: { [K in keyof MapApiEvent]?: MapApiListener<K>[] } = {};

    on<K extends keyof MapApiEvent>(event: K, callback: MapApiListener<K>) {
        if (!this.listeners[event]) {
            this.listeners[event] = [];
        }
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (this.listeners[event] as any[])?.push(callback);
    }

    off<K extends keyof MapApiEvent>(event: K, callback: MapApiListener<K>) {
        const list = this.listeners[event];
        if (list) {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            this.listeners[event] = list.filter((cb) => cb !== callback) as any;
        }
    }

    setGeofences(geofences: Geofence[]) {
        this.emit("set-geofences", geofences);
    }

    setNotams(notams: NormalizedNotam[]) {
        this.emit("set-notams", notams);
    }

    setLayerVisibility(id: string, visible: boolean) {
        this.emit("set-layer-visibility", { id, visible });
    }

    private emit<K extends keyof MapApiEvent>(event: K, data: MapApiEvent[K]) {
        this.listeners[event]?.forEach((cb) => cb(data));
    }
}

export const mapApi = new MapApi();

