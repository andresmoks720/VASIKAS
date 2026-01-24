import { Geofence } from "@/services/geofences/geofenceStore";

let uasGeofences: Geofence[] = [];

export function setUasGeofences(list: Geofence[]): void {
  uasGeofences = [...list];
}

export function getUasGeofences(): Geofence[] {
  return [...uasGeofences];
}

export function getUasGeofenceById(id: string): Geofence | undefined {
  return uasGeofences.find((geofence) => geofence.id === id);
}
