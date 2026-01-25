import { TrackPoint } from "@/services/adsb/trackStore";

import { to3857 } from "./transforms";

type TrackPointLike = TrackPoint | null | undefined;

function isFiniteNumber(value: unknown): value is number {
  return typeof value === "number" && Number.isFinite(value);
}

export function toTrackCoordinates(points: TrackPointLike[]): [number, number][] {
  const coords: [number, number][] = [];

  points.forEach((point) => {
    const position = point?.position;
    if (!position) {
      return;
    }

    if (!isFiniteNumber(position.lon) || !isFiniteNumber(position.lat)) {
      return;
    }

    coords.push(to3857([position.lon, position.lat]));
  });

  return coords;
}
