import { Drone } from "@/services/drones/droneTypes";

export type DroneTrackPoint = { position: { lon: number; lat: number } };

export function buildPlaceholderDroneTracks(
  drones: Drone[],
  visibleTrackIds: Set<string>,
): Map<string, DroneTrackPoint[]> {
  const tracks = new Map<string, DroneTrackPoint[]>();

  drones.forEach((drone) => {
    if (!visibleTrackIds.has(drone.id)) {
      return;
    }

    tracks.set(drone.id, [
      { position: { lon: drone.position.lon - 0.001, lat: drone.position.lat - 0.001 } },
      { position: { lon: drone.position.lon, lat: drone.position.lat } },
    ]);
  });

  return tracks;
}
