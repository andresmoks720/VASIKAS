import type { Altitude } from "@/shared/types/domain";
import {
    GeometryParseResult,
    NormalizedNotam,
    NotamGeometry,
    NotamRaw,
} from "../notamTypes";
import { parseCoordinateChain, parseEansCoordinate, normalizeCoordinate } from "./coordParsers";

// ─────────────────────────────────────────────────────────────────────────────
// Constants
// ─────────────────────────────────────────────────────────────────────────────

const FT_TO_METERS = 0.3048;
const KM_TO_METERS = 1000;
const NM_TO_METERS = 1852;

// ─────────────────────────────────────────────────────────────────────────────
// Type guards and helpers
// ─────────────────────────────────────────────────────────────────────────────

function isObject(value: unknown): value is Record<string, unknown> {
    return typeof value === "object" && value !== null && !Array.isArray(value);
}

function isString(value: unknown): value is string {
    return typeof value === "string";
}

function isNumber(value: unknown): value is number {
    return typeof value === "number" && Number.isFinite(value);
}

function isArray(value: unknown): value is unknown[] {
    return Array.isArray(value);
}

function getString(obj: unknown, key: string): string | undefined {
    if (!isObject(obj)) {
        return undefined;
    }
    const value = obj[key];
    return isString(value) ? value : undefined;
}

function getNumber(obj: Record<string, unknown>, key: string): number | undefined {
    const value = obj[key];
    return isNumber(value) ? value : undefined;
}

function parseRadiusMeters(value: Record<string, unknown>): number | null {
    const meters =
        parseRadiusValue(value.radiusMeters, "m") ??
        parseRadiusValue(value.radius_m, "m") ??
        parseRadiusValue(value.radiusM, "m") ??
        parseRadiusValue(value.radius, "m");
    if (meters !== undefined) {
        return meters;
    }

    const km = parseRadiusValue(value.radiusKm, "km") ?? parseRadiusValue(value.radiusKM, "km");
    if (km !== undefined) {
        return km;
    }

    const nm = parseRadiusValue(value.radiusNm, "nm") ?? parseRadiusValue(value.radiusNM, "nm");
    if (nm !== undefined) {
        return nm;
    }

    // EANS qualifiers radius is in NM?
    if (isNumber(value.radius)) {
        // According to common Q-line usage, radius is usually NM.
        return value.radius * NM_TO_METERS;
    }

    return null;
}

function parseRadiusValue(value: unknown, unitHint: "m" | "km" | "nm"): number | undefined {
    if (isNumber(value)) {
        if (unitHint === "km") {
            return value * KM_TO_METERS;
        }
        if (unitHint === "nm") {
            return value * NM_TO_METERS;
        }
        return value;
    }

    if (!isString(value)) {
        return undefined;
    }

    const match = value.trim().match(/^(\d+(?:\.\d+)?)\s*(m|km|nm)?$/i);
    if (!match) {
        return undefined;
    }

    const parsed = Number.parseFloat(match[1]);
    if (!Number.isFinite(parsed)) {
        return undefined;
    }

    const unit = (match[2]?.toLowerCase() ?? unitHint) as "m" | "km" | "nm";
    if (unit === "km") {
        return parsed * KM_TO_METERS;
    }
    if (unit === "nm") {
        return parsed * NM_TO_METERS;
    }
    return parsed;
}

// ─────────────────────────────────────────────────────────────────────────────
// Geometry parsing
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Parse geometry from geometryHint field.
 * Supports circle and polygon types from mock data.
 */
export function parseGeometryHint(hint: unknown): GeometryParseResult {
    return parseGeometryCandidateStrict(hint);
}

function parsePoint(value: unknown): [number, number] | null {
    if (isArray(value) && value.length >= 2 && isNumber(value[0]) && isNumber(value[1])) {
        return [value[0], value[1]];
    }

    if (!isObject(value)) {
        return null;
    }

    const lat = getNumber(value, "lat") ?? getNumber(value, "latitude") ?? getNumber(value, "y");
    const lon = getNumber(value, "lon") ?? getNumber(value, "longitude") ?? getNumber(value, "x");

    if (lat === undefined || lon === undefined) {
        return null;
    }

    if (!isValidLonLat(lon, lat)) {
        return null;
    }

    return [lon, lat];
}

function looksLikePoint(value: unknown): boolean {
    if (isArray(value)) {
        return value.length >= 2 && isNumber(value[0]) && isNumber(value[1]);
    }

    if (!isObject(value)) {
        return false;
    }

    return (
        (isNumber(value.lat) && isNumber(value.lon)) ||
        (isNumber(value.latitude) && isNumber(value.longitude)) ||
        (isNumber(value.x) && isNumber(value.y))
    );
}

function parseRing(value: unknown): [number, number][] | null {
    if (!isArray(value)) {
        return null;
    }

    const ring: [number, number][] = [];
    for (const coord of value) {
        const point = parsePoint(coord);
        if (point) {
            ring.push(point);
        }
    }

    const normalized = normalizeRingPoints(ring);
    if (normalized.length < 3) {
        return null;
    }

    return closeRing(normalized);
}

function parsePolygonCoordinates(coords: unknown): [number, number][][] | null {
    if (!isArray(coords) || coords.length === 0) {
        return null;
    }

    if (looksLikePoint(coords[0])) {
        const ring = parseRing(coords);
        return ring ? [ring] : null;
    }

    if (isArray(coords[0]) && coords[0].length > 0 && looksLikePoint(coords[0][0])) {
        const rings: [number, number][][] = [];
        for (const ringCandidate of coords) {
            const ring = parseRing(ringCandidate);
            if (ring) {
                rings.push(ring);
            }
        }

        return rings.length > 0 ? rings : null;
    }

    if (isArray(coords[0]) && coords[0].length > 0) {
        return parsePolygonCoordinates(coords[0]);
    }

    return null;
}

function parseCircleFrom(value: unknown): NotamGeometry {
    if (!isObject(value)) {
        return null;
    }

    const radiusMeters = parseRadiusMeters(value);
    if (radiusMeters === null) {
        return null;
    }

    const center = parsePoint(value.center ?? value.coordinates ?? value);
    if (!center) {
        return null;
    }

    return {
        kind: "circle",
        center,
        radiusMeters,
    };
}

function parseGeometryCandidateStrict(value: unknown): GeometryParseResult {
    return parseGeometryCandidate(value);
}

function parseGeometryCandidate(value: unknown): GeometryParseResult {
    if (!value) {
        return { geometry: null, reason: "NO_CANDIDATE" };
    }

    if (isObject(value)) {
        const type = getString(value, "type");

        if (type === "Polygon") {
            const polygon = parsePolygonCoordinates(value.coordinates);
            return polygon
                ? { geometry: { kind: "polygon", rings: polygon } }
                : { geometry: null, reason: "INVALID_COORDS" };
        }

        if (type === "MultiPolygon") {
            if (!isArray(value.coordinates) || value.coordinates.length === 0) {
                return { geometry: null, reason: "INVALID_COORDS" };
            }

            const polygons: [number, number][][][] = [];
            for (const polygonCandidate of value.coordinates) {
                const polygon = parsePolygonCoordinates(polygonCandidate);
                if (polygon) {
                    polygons.push(polygon);
                }
            }

            return polygons.length > 0
                ? { geometry: { kind: "multiPolygon", polygons } }
                : { geometry: null, reason: "INVALID_COORDS" };
        }

        if (type === "Point") {
            const circle = parseCircleFrom(value);
            return circle ? { geometry: circle } : { geometry: null, reason: "INVALID_COORDS" };
        }

        // Check if this is a GeoJSON object (has a GeoJSON type field)
        const isGeoJsonType = ["Point", "LineString", "Polygon", "MultiPoint", "MultiLineString", "MultiPolygon", "GeometryCollection", "Feature", "FeatureCollection"].includes(type);

        if (isGeoJsonType) {
            // For GeoJSON objects, handle supported types
            if (type === "Polygon") {
                const polygon = parsePolygonCoordinates(value.coordinates);
                return polygon
                    ? { geometry: { kind: "polygon", rings: polygon } }
                    : { geometry: null, reason: "INVALID_COORDS" };
            }

            if (type === "MultiPolygon") {
                if (!isArray(value.coordinates) || value.coordinates.length === 0) {
                    return { geometry: null, reason: "INVALID_COORDS" };
                }

                const polygons: [number, number][][][] = [];
                for (const polygonCandidate of value.coordinates) {
                    const polygon = parsePolygonCoordinates(polygonCandidate);
                    if (polygon) {
                        polygons.push(polygon);
                    }
                }

                return polygons.length > 0
                    ? { geometry: { kind: "multiPolygon", polygons } }
                    : { geometry: null, reason: "INVALID_COORDS" };
            }

            if (type === "Point") {
                const circle = parseCircleFrom(value);
                return circle ? { geometry: circle } : { geometry: null, reason: "INVALID_COORDS" };
            }

            // For unsupported GeoJSON types, return error (don't continue to fallback parsing)
            return { geometry: null, reason: "UNSUPPORTED_GEOJSON_TYPE", details: { type } };
        } else {
            // For non-GeoJSON objects, use fallback parsing
            const circle = parseCircleFrom(value);
            if (circle) {
                return { geometry: circle };
            }

            if (value.coordinates) {
                const polygon = parsePolygonCoordinates(value.coordinates);
                return polygon
                    ? { geometry: { kind: "polygon", rings: polygon } }
                    : { geometry: null, reason: "INVALID_COORDS" };
            }
        }
    }

    if (isArray(value)) {
        const polygon = parsePolygonCoordinates(value);
        return polygon
            ? { geometry: { kind: "polygon", rings: polygon } }
            : { geometry: null, reason: "INVALID_COORDS" };
    }

    return { geometry: null, reason: "UNSUPPORTED_FORMAT", details: { type: typeof value } };
}

function isValidLonLat(lon: number, lat: number): boolean {
    return Number.isFinite(lon) && Number.isFinite(lat) && Math.abs(lon) <= 180 && Math.abs(lat) <= 90;
}

function normalizeRingPoints(points: [number, number][]): [number, number][] {
    const normalized: [number, number][] = [];
    for (const point of points) {
        const last = normalized[normalized.length - 1];
        if (last && last[0] === point[0] && last[1] === point[1]) {
            continue;
        }
        normalized.push(point);
    }
    return normalized;
}

function closeRing(points: [number, number][]): [number, number][] {
    if (points.length === 0) {
        return points;
    }
    const first = points[0];
    const last = points[points.length - 1];
    if (first[0] !== last[0] || first[1] !== last[1]) {
        return [...points, [first[0], first[1]]];
    }
    return points;
}

type SplitRingResult = { west: [number, number][]; east: [number, number][] };

function splitRingAtAntimeridian(ring: [number, number][]): SplitRingResult | null {
    if (ring.length < 4) {
        return null;
    }

    const longitudes = ring.map((coord) => coord[0]);
    const minLon = Math.min(...longitudes);
    const maxLon = Math.max(...longitudes);
    if (maxLon - minLon <= 180) {
        return null;
    }

    const hasEast = longitudes.some((lon) => lon > 150);
    const hasWest = longitudes.some((lon) => lon < -150);
    if (!hasEast || !hasWest) {
        return null;
    }

    const east: [number, number][] = [];
    const west: [number, number][] = [];

    for (let index = 0; index < ring.length - 1; index += 1) {
        const current = ring[index];
        const next = ring[index + 1];
        const currentIsEast = current[0] >= 0;

        if (currentIsEast) {
            east.push(current);
        } else {
            west.push(current);
        }

        const crossesEastToWest = current[0] > 150 && next[0] < -150;
        const crossesWestToEast = current[0] < -150 && next[0] > 150;

        if (crossesEastToWest || crossesWestToEast) {
            const lon1 = current[0];
            const lon2 = crossesEastToWest ? next[0] + 360 : next[0];
            const adjustedLon1 = crossesWestToEast ? lon1 + 360 : lon1;
            const startLon = crossesWestToEast ? adjustedLon1 : lon1;
            const endLon = lon2;
            const t = (180 - startLon) / (endLon - startLon);
            const intersectionLat = current[1] + t * (next[1] - current[1]);

            east.push([180, intersectionLat]);
            west.push([-180, intersectionLat]);

            if (crossesEastToWest) {
                west.push(next);
            } else {
                east.push(next);
            }
        }
    }

    const eastRing = closeRing(normalizeRingPoints(east));
    const westRing = closeRing(normalizeRingPoints(west));
    if (eastRing.length < 4 || westRing.length < 4) {
        return null;
    }

    return { west: westRing, east: eastRing };
}

function splitPolygonIfDatelineCrossing(rings: [number, number][][]): [number, number][][][] | null {
    if (rings.length === 0) {
        return null;
    }

    const split = splitRingAtAntimeridian(rings[0]);
    if (!split) {
        return null;
    }

    const westRings: [number, number][][] = [split.west];
    const eastRings: [number, number][][] = [split.east];

    for (const hole of rings.slice(1)) {
        const longitudes = hole.map((coord) => coord[0]);
        const minLon = Math.min(...longitudes);
        const maxLon = Math.max(...longitudes);
        if (maxLon - minLon > 180 && longitudes.some((lon) => lon > 150) && longitudes.some((lon) => lon < -150)) {
            continue;
        }

        const avgLon = longitudes.reduce((sum, value) => sum + value, 0) / longitudes.length;
        if (avgLon >= 0) {
            eastRings.push(hole);
        } else {
            westRings.push(hole);
        }
    }

    return [westRings, eastRings];
}

function normalizeCircleFrom(value: Record<string, unknown>): NotamGeometry {
    const radiusMeters = parseRadiusMeters(value);
    if (radiusMeters === null) {
        return null;
    }

    const centerCandidate =
        value.center ?? value.coordinates ?? value.position ?? value.location ?? value.centerPoint ?? value;
    const center = normalizeCoordinate(centerCandidate);
    if (!center) {
        return null;
    }

    return {
        kind: "circle",
        center,
        radiusMeters,
    };
}

export function parseNotamGeometry(candidate: unknown): GeometryParseResult {
    return parseNotamGeometryWithReason(candidate);
}

export function parseNotamGeometryWithReason(candidate: unknown): GeometryParseResult {
    try {
        // If candidate is a string that looks like a coordinate chain, try to parse it
        if (isString(candidate)) {
            const coordChain = parseCoordinateChain(candidate);
            if (coordChain && coordChain.length >= 3) { // Need at least 3 points for a polygon
                // Close the ring by adding the first point to the end if not already closed
                const firstPoint = coordChain[0];
                const lastPoint = coordChain[coordChain.length - 1];

                // Check if ring is closed (first and last points are the same)
                const tolerance = 0.000001;
                const isClosed = Math.abs(firstPoint[0] - lastPoint[0]) < tolerance &&
                                Math.abs(firstPoint[1] - lastPoint[1]) < tolerance;

                const ring = isClosed ? coordChain : [...coordChain, firstPoint];

                return {
                    geometry: {
                        kind: "polygon",
                        rings: [ring]
                    }
                };
            }
        }
        if (!candidate) {
            return { geometry: null, reason: "NO_CANDIDATE" };
        }

        if (!isArray(candidate)) {
            const strictGeometry = parseGeometryHint(candidate);
            if (strictGeometry.geometry) {
                return { geometry: applyDatelineSplit(strictGeometry.geometry) };
            }
        }

        if (isObject(candidate)) {
            const nestedCandidates = extractGeometryCandidates(candidate);
            let lastFailure: GeometryParseResult | undefined;
            if (nestedCandidates.length > 0) {
                for (const nestedCandidate of nestedCandidates) {
                    if (nestedCandidate === candidate) {
                        continue;
                    }
                    const result = parseNotamGeometryWithReason(nestedCandidate);
                    if (result.geometry) {
                        return result;
                    }
                    lastFailure = result;
                }
            }

            const circle = normalizeCircleFrom(candidate);
            if (circle) {
                return { geometry: circle };
            }

            const type = getString(candidate, "type");
            if (!type && nestedCandidates.length === 0) {
                const hasNotamIdentity = Boolean(getString(candidate, "id") || getString(candidate, "text"));
                return hasNotamIdentity
                    ? { geometry: null, reason: "NO_CANDIDATE" }
                    : { geometry: null, reason: "UNSUPPORTED_FORMAT", details: { type: typeof candidate } };
            }
            if (type === "Feature") {
                return parseNotamGeometryWithReason(candidate.geometry);
            }

            if (type === "FeatureCollection" && isArray(candidate.features)) {
                for (const feature of candidate.features) {
                    const geometry = parseNotamGeometryWithReason(feature);
                    if (geometry.geometry) {
                        return geometry;
                    }
                }
                return { geometry: null, reason: "EMPTY" };
            }

            if (type === "Polygon") {
                const rings = normalizePolygonRings(candidate.coordinates);
                if (!rings) {
                    return { geometry: null, reason: "INVALID_COORDS" };
                }
                const splitPolygons = splitPolygonIfDatelineCrossing(rings);
                if (splitPolygons) {
                    return { geometry: { kind: "multiPolygon", polygons: splitPolygons } };
                }
                return { geometry: { kind: "polygon", rings } };
            }

            if (type === "MultiPolygon") {
                const polygons = normalizeMultiPolygon(candidate.coordinates);
                if (!polygons) {
                    return { geometry: null, reason: "INVALID_COORDS" };
                }
                const splitPolygons: [number, number][][][] = [];
                for (const polygon of polygons) {
                    const split = splitPolygonIfDatelineCrossing(polygon);
                    if (split) {
                        splitPolygons.push(...split);
                    } else {
                        splitPolygons.push(polygon);
                    }
                }
                return { geometry: { kind: "multiPolygon", polygons: splitPolygons } };
            }

            if (type) {
                return { geometry: null, reason: "UNSUPPORTED_GEOJSON_TYPE", details: { type } };
            }

            if (nestedCandidates.length > 0) {
                return lastFailure ?? { geometry: null, reason: "EMPTY" };
            }

            return { geometry: null, reason: "UNSUPPORTED_FORMAT", details: { type: typeof candidate } };
        }

        if (isArray(candidate)) {
            const polygons = normalizeMultiPolygon(candidate);
            if (polygons && polygons.length > 0) {
                if (polygons.length === 1) {
                    return { geometry: { kind: "polygon", rings: polygons[0] } };
                }
                return { geometry: { kind: "multiPolygon", polygons } };
            }

            const rings = normalizePolygonRings(candidate);
            if (!rings) {
                return { geometry: null, reason: "INVALID_COORDS" };
            }
            const splitPolygons = splitPolygonIfDatelineCrossing(rings);
            if (splitPolygons) {
                return { geometry: { kind: "multiPolygon", polygons: splitPolygons } };
            }
            return { geometry: { kind: "polygon", rings } };
        }

        return { geometry: null, reason: "UNSUPPORTED_FORMAT", details: { type: typeof candidate } };
    } catch (error) {
        return {
            geometry: null,
            reason: "EXCEPTION",
            details: { message: error instanceof Error ? error.message : String(error) },
        };
    }
}

function applyDatelineSplit(geometry: NotamGeometry): NotamGeometry {
    if (!geometry) {
        return geometry;
    }
    if (geometry.kind === "polygon") {
        const splitPolygons = splitPolygonIfDatelineCrossing(geometry.rings);
        if (splitPolygons) {
            return { kind: "multiPolygon", polygons: splitPolygons };
        }
    }
    if (geometry.kind === "multiPolygon") {
        const splitPolygons: [number, number][][][] = [];
        for (const polygon of geometry.polygons) {
            const split = splitPolygonIfDatelineCrossing(polygon);
            if (split) {
                splitPolygons.push(...split);
            } else {
                splitPolygons.push(polygon);
            }
        }
        return { kind: "multiPolygon", polygons: splitPolygons };
    }
    return geometry;
}

function normalizeRing(value: unknown): [number, number][] | null {
    if (!isArray(value)) {
        return null;
    }

    const ring: [number, number][] = [];
    for (const coord of value) {
        const point = normalizeCoordinate(coord);
        if (point) {
            ring.push(point);
        }
    }

    const normalized = normalizeRingPoints(ring);
    if (normalized.length < 3) {
        return null;
    }

    return closeRing(normalized);
}

function normalizePolygonRings(value: unknown): [number, number][][] | null {
    if (!isArray(value) || value.length === 0) {
        return null;
    }

    if (normalizeCoordinate(value[0])) {
        const ring = normalizeRing(value);
        return ring ? [ring] : null;
    }

    const rings: [number, number][][] = [];
    for (const ringCandidate of value) {
        const ring = normalizeRing(ringCandidate);
        if (ring) {
            rings.push(ring);
        }
    }

    return rings.length > 0 ? rings : null;
}

function normalizeMultiPolygon(value: unknown): [number, number][][][] | null {
    if (!isArray(value) || value.length === 0) {
        return null;
    }

    const polygons: [number, number][][][] = [];
    for (const polygonCandidate of value) {
        const polygon = normalizePolygonRings(polygonCandidate);
        if (polygon) {
            polygons.push(polygon);
        }
    }

    return polygons.length > 0 ? polygons : null;
}

function extractGeometryCandidates(item: Record<string, unknown>): unknown[] {
    // Check if this is a GeoJSON object (has a type field)
    const type = getString(item, "type");
    const isGeoJsonType = type && ["Point", "LineString", "Polygon", "MultiPoint", "MultiLineString", "MultiPolygon", "GeometryCollection", "Feature", "FeatureCollection"].includes(type);

    // For GeoJSON objects, don't extract individual fields like coordinates
    // as they should be processed as complete GeoJSON objects
    if (isGeoJsonType) {
        return [];
    }

    const candidates = [
        item.geometryHint,
        item.geometry,
        item.geojson,
        item.geoJson,
        item.GeoJSON,
        item.polygon,
        item.polygons,
        item.circle,
        item.circles,
        item.shape,
        item.area,
        item.outline,
        item.boundary,
        item.outer_boundary,
        item.inner_boundary,
        item.positions,
        item.path,
        item.coordinates,
    ];

    return candidates.filter((candidate) => candidate !== null && candidate !== undefined);
}