import { toLonLat } from "ol/proj";

import { getJson } from "@/services/http/apiClient";
import { GeoJsonPolygon } from "@/shared/types/domain";
import { Geofence } from "@/services/geofences/geofenceStore";

const DEFAULT_NAME_PREFIX = "UAS Area";

type UasGeoJsonPolygon = {
  type: "Polygon";
  coordinates: GeoJsonPolygon["coordinates"];
};

type UasGeoJsonMultiPolygon = {
  type: "MultiPolygon";
  coordinates: GeoJsonPolygon["coordinates"][];
};

type UasGeoJsonGeometry = UasGeoJsonPolygon | UasGeoJsonMultiPolygon;

type UasGeoJsonFeature = {
  type: "Feature";
  id?: string | number;
  properties?: Record<string, unknown> | null;
  geometry?: UasGeoJsonGeometry | null;
};

type UasGeoJsonCollection = {
  type: "FeatureCollection";
  features: UasGeoJsonFeature[];
};

const NAME_KEYS = ["name", "title", "label", "designation", "identifier", "id"];
const DESCRIPTION_KEYS = ["description", "remarks", "note", "info"];

const ESTONIA_LAT_RANGE: [number, number] = [54, 61];
const ESTONIA_LON_RANGE: [number, number] = [20, 32];
const WEB_MERCATOR_LIMIT = 20_037_508;

function normalizeRing(ring: GeoJsonPolygon["coordinates"][number]): GeoJsonPolygon["coordinates"][number] {
  if (ring.length === 0) {
    return ring;
  }

  const [firstLon, firstLat] = ring[0];
  const [lastLon, lastLat] = ring[ring.length - 1];

  if (firstLon === lastLon && firstLat === lastLat) {
    return ring;
  }

  return [...ring, [firstLon, firstLat]];
}

function isWithinRange(value: number, [min, max]: [number, number]): boolean {
  return value >= min && value <= max;
}

function toLonLatPoint(point: [number, number]): [number, number] {
  const [lon, lat] = toLonLat(point);
  return [lon, lat];
}

function normalizePoint(point: number[]): [number, number] {
  const [x = 0, y = 0] = point;
  return [x, y];
}

function isLikelyWebMercator(point: [number, number]): boolean {
  const [x, y] = point;
  if (Math.abs(x) <= 180 && Math.abs(y) <= 90) {
    return false;
  }

  return Math.abs(x) <= WEB_MERCATOR_LIMIT && Math.abs(y) <= WEB_MERCATOR_LIMIT && Math.abs(x) >= 1_000_000;
}

function shouldSwapLonLat(points: [number, number][]): boolean {
  if (points.length === 0) {
    return false;
  }

  const swapCandidates = points.filter(([x, y]) =>
    isWithinRange(x, ESTONIA_LAT_RANGE) && isWithinRange(y, ESTONIA_LON_RANGE),
  );
  const normalCandidates = points.filter(([x, y]) =>
    isWithinRange(x, ESTONIA_LON_RANGE) && isWithinRange(y, ESTONIA_LAT_RANGE),
  );

  return swapCandidates.length > normalCandidates.length && swapCandidates.length > 0;
}

function normalizePolygonCoordinates(coordinates: GeoJsonPolygon["coordinates"]): GeoJsonPolygon["coordinates"] {
  const flattenedPoints = coordinates.flat().map((point) => normalizePoint(point));
  const webMercatorCandidates = flattenedPoints.filter((point) => isLikelyWebMercator(point));
  const shouldConvertFromWebMercator = webMercatorCandidates.length > flattenedPoints.length / 2;

  const normalizedPoints = shouldConvertFromWebMercator
    ? flattenedPoints.map((point) => toLonLatPoint(point))
    : flattenedPoints;

  const swap = shouldSwapLonLat(normalizedPoints);
  let index = 0;

  return coordinates.map((ring) => {
    const normalizedRing: [number, number][] = ring.map((point) => {
      const normalized = normalizedPoints[index];
      index += 1;

      if (!normalized) {
        return normalizePoint(point);
      }

      return swap ? [normalized[1], normalized[0]] : normalized;
    });
    return normalizeRing(normalizedRing);
  });
}

function extractString(properties: Record<string, unknown> | null | undefined, keys: string[]): string | undefined {
  if (!properties) {
    return undefined;
  }

  for (const key of keys) {
    const value = properties[key];
    if (typeof value === "string" && value.trim().length > 0) {
      return value.trim();
    }
    if (typeof value === "number") {
      return String(value);
    }
  }

  return undefined;
}

function slugify(value: string): string {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)+/g, "");
}

function buildGeofence({
  coordinates,
  name,
  description,
  id,
  timestamp,
}: {
  coordinates: GeoJsonPolygon["coordinates"];
  name: string;
  description?: string;
  id: string;
  timestamp: string;
}): Geofence {
  return {
    id,
    name,
    description,
    geometry: {
      kind: "polygon",
      coordinates,
    },
    createdAtUtc: timestamp,
    updatedAtUtc: timestamp,
  };
}

export function parseUasGeofences(payload: unknown, timestamp = new Date().toISOString()): Geofence[] {
  if (!payload || typeof payload !== "object") {
    throw new Error("Invalid UAS GeoJSON payload");
  }

  const collection = payload as UasGeoJsonCollection;
  if (collection.type !== "FeatureCollection" || !Array.isArray(collection.features)) {
    throw new Error("Invalid UAS GeoJSON payload");
  }

  const geofences: Geofence[] = [];

  collection.features.forEach((feature, featureIndex) => {
    if (!feature || feature.type !== "Feature") {
      return;
    }

    const geometry = feature.geometry ?? null;
    if (!geometry) {
      return;
    }

    const baseName =
      extractString(feature.properties, NAME_KEYS) ?? `${DEFAULT_NAME_PREFIX} ${featureIndex + 1}`;
    const description = extractString(feature.properties, DESCRIPTION_KEYS);

    const idSeed =
      (typeof feature.id === "string" || typeof feature.id === "number" ? String(feature.id) : undefined) ??
      extractString(feature.properties, ["id", "identifier"]) ??
      baseName ??
      `${featureIndex + 1}`;
    const slug = slugify(idSeed) || `feature-${featureIndex + 1}`;

    if (geometry.type === "Polygon") {
      geofences.push(
        buildGeofence({
          coordinates: normalizePolygonCoordinates(geometry.coordinates),
          name: baseName,
          description,
          id: `uas-${slug}`,
          timestamp,
        }),
      );
      return;
    }

    if (geometry.type === "MultiPolygon") {
      geometry.coordinates.forEach((coords, polygonIndex) => {
        const suffix = geometry.coordinates.length > 1 ? ` (${polygonIndex + 1})` : "";
        geofences.push(
          buildGeofence({
            coordinates: normalizePolygonCoordinates(coords),
            name: `${baseName}${suffix}`,
            description,
            id: `uas-${slug}-${polygonIndex + 1}`,
            timestamp,
          }),
        );
      });
    }
  });

  return geofences;
}

export async function fetchUasGeofences(url: string, signal?: AbortSignal): Promise<Geofence[]> {
  if (!url) {
    return [];
  }

  const payload = await getJson<UasGeoJsonCollection>(url, { signal });
  return parseUasGeofences(payload);
}

export async function fetchUasGeofencesWithFallback({
  primaryUrl,
  fallbackUrl,
  signal,
}: {
  primaryUrl: string;
  fallbackUrl?: string;
  signal?: AbortSignal;
}): Promise<Geofence[]> {
  if (!primaryUrl) {
    return [];
  }

  try {
    return await fetchUasGeofences(primaryUrl, signal);
  } catch (error) {
    if (!fallbackUrl || fallbackUrl === primaryUrl) {
      throw error;
    }

    return fetchUasGeofences(fallbackUrl, signal);
  }
}
