import { LonLat, GeoJsonPolygon } from "@/shared/types/domain";

const EARTH_RADIUS_METERS = 6_371_008.8; // WGS-84 mean Earth radius (m)
const DEG_PER_RAD = 180 / Math.PI;

export function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max);
}

export function normalizeLon(lon: number): number {
  const wrapped = ((lon + 180) % 360 + 360) % 360 - 180;
  return wrapped === -180 ? 180 : wrapped;
}

export function validateLonLat(point: LonLat): boolean {
  return Number.isFinite(point.lon) && Number.isFinite(point.lat) && point.lon >= -180 && point.lon <= 180 && point.lat >= -90 && point.lat <= 90;
}

function metersToDegreesLatitude(distanceMeters: number): number {
  return (distanceMeters / EARTH_RADIUS_METERS) * DEG_PER_RAD;
}

function metersToDegreesLongitude(distanceMeters: number, latitudeDeg: number): number {
  const latitudeRad = (latitudeDeg * Math.PI) / 180;
  const cosLat = Math.cos(latitudeRad) || Number.EPSILON;
  return (distanceMeters / EARTH_RADIUS_METERS) * (DEG_PER_RAD / cosLat);
}

/**
 * Convert a circle (center + radiusMeters) into a GeoJSON Polygon in WGS-84.
 * Pure math, no OpenLayers dependency. Suitable for prototype rendering.
 */
export function circleToPolygonWgs84(
  center: LonLat,
  radiusMeters: number,
  segments = 64,
): GeoJsonPolygon {
  if (!validateLonLat(center)) {
    throw new Error("Invalid center coordinates");
  }
  if (!Number.isFinite(radiusMeters) || radiusMeters <= 0) {
    throw new Error("radiusMeters must be a positive number");
  }
  const clampedSegments = Math.max(3, Math.floor(segments));
  const ring: [number, number][] = [];

  const deltaLatBase = metersToDegreesLatitude(radiusMeters);
  const deltaLonBase = metersToDegreesLongitude(radiusMeters, center.lat);

  for (let i = 0; i < clampedSegments; i += 1) {
    const angle = (2 * Math.PI * i) / clampedSegments;
    const offsetLon = Math.cos(angle) * deltaLonBase;
    const offsetLat = Math.sin(angle) * deltaLatBase;

    const lon = normalizeLon(center.lon + offsetLon);
    const lat = clamp(center.lat + offsetLat, -90, 90);
    ring.push([lon, lat]);
  }

  ring.push(ring[0]);

  return {
    type: "Polygon",
    coordinates: [ring],
  };
}
