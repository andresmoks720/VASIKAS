import { Geofence } from "@/services/geofences/geofenceStore";
import { NormalizedNotam } from "@/services/notam/notamTypes";

type MapApiEvent = {
    "set-geofences": Geofence[];
    "set-notams": NormalizedNotam[];
    "set-layer-visibility": { id: string; visible: boolean };
    "center-on-entity": { kind: EntityRef["kind"]; id: string };
    "set-focus": { kind: EntityRef["kind"]; id: string | null };
    "set-track-visibility": { kind: EntityRef["kind"]; id: string; visible: boolean };
};

import { EntityRef } from "@/layout/MapShell/urlState";

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

    centerOnEntity(kind: EntityRef["kind"], id: string) {
        this.emit("center-on-entity", { kind, id });
    }

    setFocus(kind: EntityRef["kind"], id: string | null) {
        this.emit("set-focus", { kind, id });
    }

    setTrackVisibility(kind: EntityRef["kind"], id: string, visible: boolean) {
        this.emit("set-track-visibility", { kind, id, visible });
    }

    private emit<K extends keyof MapApiEvent>(event: K, data: MapApiEvent[K]) {
        this.listeners[event]?.forEach((cb) => cb(data));
    }
}

export const mapApi = new MapApi();

