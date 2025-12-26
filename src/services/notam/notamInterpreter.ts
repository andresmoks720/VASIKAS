import type { Altitude } from "@/shared/types/domain";

import {
    formatNotamSummary,
    GeometryParseResult,
    NormalizedNotam,
    NotamGeometry,
    NotamRaw,
} from "./notamTypes";

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

function getString(obj: Record<string, unknown>, key: string): string | undefined {
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
// Altitude parsing
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Pattern to match altitude expressions like:
 * - SFC
 * - GND
 * - 3000FT AMSL
 * - 3000 FT MSL
 * - 500FT AGL
 * - FL350
 */
const ALTITUDE_PATTERNS = {
    sfc: /\bSFC\b/gi,
    gnd: /\bGND\b/gi,
    ftAmsl: /\b(\d+)\s*FT\s*(AMSL|MSL)\b/gi,
    ftAgl: /\b(\d+)\s*FT\s*AGL\b/gi,
    fl: /\bFL\s*(\d+)\b/gi,
};

function createAltitude(
    meters: number | null,
    ref: Altitude["ref"],
    source: Altitude["source"],
    comment: string,
    rawText?: string,
): Altitude {
    return {
        meters,
        ref,
        source,
        comment,
        ...(rawText && { rawText }),
    };
}

/**
 * Parse altitudes from NOTAM text.
 * Returns an array of Altitude objects with comment always present.
 */
export function parseAltitudesFromText(text: string): Altitude[] {
    const altitudes: Altitude[] = [];
    const seen = new Set<string>();

    // SFC (Surface)
    if (ALTITUDE_PATTERNS.sfc.test(text)) {
        const key = "SFC-AGL";
        if (!seen.has(key)) {
            seen.add(key);
            altitudes.push(createAltitude(0, "AGL", "reported", "SFC from NOTAM", "SFC"));
        }
    }
    ALTITUDE_PATTERNS.sfc.lastIndex = 0;

    // GND (Ground)
    if (ALTITUDE_PATTERNS.gnd.test(text)) {
        const key = "GND-AGL";
        if (!seen.has(key)) {
            seen.add(key);
            altitudes.push(createAltitude(0, "AGL", "reported", "GND from NOTAM", "GND"));
        }
    }
    ALTITUDE_PATTERNS.gnd.lastIndex = 0;

    // FT AMSL/MSL
    let match: RegExpExecArray | null;
    ALTITUDE_PATTERNS.ftAmsl.lastIndex = 0;
    while ((match = ALTITUDE_PATTERNS.ftAmsl.exec(text)) !== null) {
        const ft = parseInt(match[1], 10);
        const rawText = match[0];
        const key = `${ft}FT-MSL`;
        if (!seen.has(key)) {
            seen.add(key);
            const meters = Math.round(ft * FT_TO_METERS);
            altitudes.push(createAltitude(meters, "MSL", "reported", `${rawText} from NOTAM`, rawText));
        }
    }

    // FT AGL
    ALTITUDE_PATTERNS.ftAgl.lastIndex = 0;
    while ((match = ALTITUDE_PATTERNS.ftAgl.exec(text)) !== null) {
        const ft = parseInt(match[1], 10);
        const rawText = match[0];
        const key = `${ft}FT-AGL`;
        if (!seen.has(key)) {
            seen.add(key);
            const meters = Math.round(ft * FT_TO_METERS);
            altitudes.push(createAltitude(meters, "AGL", "reported", `${rawText} from NOTAM`, rawText));
        }
    }

    // FL (Flight Level) - approximate conversion (FL = hundreds of feet, pressure altitude)
    ALTITUDE_PATTERNS.fl.lastIndex = 0;
    while ((match = ALTITUDE_PATTERNS.fl.exec(text)) !== null) {
        const fl = parseInt(match[1], 10);
        const ft = fl * 100;
        const rawText = match[0];
        const key = `FL${fl}-MSL`;
        if (!seen.has(key)) {
            seen.add(key);
            const meters = Math.round(ft * FT_TO_METERS);
            altitudes.push(createAltitude(meters, "MSL", "reported", `${rawText} from NOTAM (approx)`, rawText));
        }
    }

    return altitudes;
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

        // For GeoJSON objects, handle supported types first
        if (isGeoJsonType) {
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

            // For GeoJSON types that are not supported, return error
            if (type !== "Point") {  // Point is handled above
                return { geometry: null, reason: "UNSUPPORTED_GEOJSON_TYPE", details: { type } };
            }
            // If it's Point, continue to fallback parsing below
        }

        // For objects without GeoJSON type field or with Point type, use fallback parsing
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

/**
 * Parse EANS coordinate string like "5925N02450E"
 * 5925N -> 59deg 25min N
 * 02450E -> 24deg 50min E
 */
function parseEansCoordinate(raw: string): [number, number] | null {
    const clean = raw.replace(/\s+/g, "");
    // Regex: 4 digits + N/S, then 5 digits + E/W
    const match = clean.match(/^(\d{4})([NS])(\d{5})([EW])$/);
    if (!match) return null;

    const latStr = match[1];
    const latDir = match[2];
    const lonStr = match[3];
    const lonDir = match[4];

    const latDeg = parseInt(latStr.slice(0, 2), 10);
    const latMin = parseInt(latStr.slice(2), 10);
    let lat = latDeg + latMin / 60.0;
    if (latDir === "S") lat = -lat;

    const lonDeg = parseInt(lonStr.slice(0, 3), 10);
    const lonMin = parseInt(lonStr.slice(3), 10);
    let lon = lonDeg + lonMin / 60.0;
    if (lonDir === "W") lon = -lon;

    if (!isValidLonLat(lon, lat)) return null;

    return [lon, lat];
}

export function parseAnyGeometry(item: unknown): GeometryParseResult {
    if (!isObject(item)) {
        return { geometry: null, reason: "UNSUPPORTED_FORMAT", details: { type: typeof item } };
    }

    const hintGeometry = parseGeometryHint(item.geometryHint);
    if (hintGeometry.geometry) {
        return hintGeometry;
    }

    return parseNotamGeometry(item);
}

function extractGeometryCandidate(item: Record<string, unknown>): unknown {
    return extractGeometryCandidates(item)[0] ?? null;
}

function extractGeometryCandidates(item: Record<string, unknown>): unknown[] {
    const candidates = [
        item.geometryHint,
        item.geometry,
        item.geojson,
        item.polygon,
        item.circle,
        item.shape,
        item.area,
    ];

    return candidates.filter((candidate) => candidate !== null && candidate !== undefined);
}

function normalizeCoord(value: unknown): [number, number] | null {
    if (isArray(value) && value.length >= 2) {
        const first = normalizeCoordValue(value[0]);
        const second = normalizeCoordValue(value[1]);
        if (first === null || second === null) {
            return null;
        }

        if (Math.abs(first) <= 90 && Math.abs(second) > 90 && Math.abs(second) <= 180) {
            return isValidLonLat(second, first) ? [second, first] : null;
        }

        return isValidLonLat(first, second) ? [first, second] : null;
    }

    if (!isObject(value)) {
        return null;
    }

    const lat =
        normalizeCoordValue(value.lat) ??
        normalizeCoordValue(value.latitude) ??
        normalizeCoordValue(value.y);
    const lon =
        normalizeCoordValue(value.lon) ??
        normalizeCoordValue(value.lng) ??
        normalizeCoordValue(value.longitude) ??
        normalizeCoordValue(value.x);

    if (lat === null || lon === null) {
        return null;
    }

    return isValidLonLat(lon, lat) ? [lon, lat] : null;
}

function normalizeCoordValue(value: unknown): number | null {
    if (isNumber(value)) {
        return value;
    }

    if (isString(value)) {
        const parsed = Number.parseFloat(value);
        return Number.isFinite(parsed) ? parsed : null;
    }

    return null;
}

function normalizeRing(value: unknown): [number, number][] | null {
    if (!isArray(value)) {
        return null;
    }

    const ring: [number, number][] = [];
    for (const coord of value) {
        const point = normalizeCoord(coord);
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

    if (normalizeCoord(value[0])) {
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
    const center = normalizeCoord(centerCandidate);
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

function getGeometryFieldSnapshot(raw: Record<string, unknown>): Record<string, boolean> {
    const fields = ["geometryHint", "geometry", "geojson", "geoJson", "shape", "area", "polygon", "circle"] as const;
    return Object.fromEntries(fields.map((field) => [field, raw[field] !== undefined && raw[field] !== null]));
}

// ─────────────────────────────────────────────────────────────────────────────
// Item normalization
// ─────────────────────────────────────────────────────────────────────────────

export function normalizeNotamItem(item: unknown, eventTimeUtc: string): NormalizedNotam | null {
    if (!isObject(item)) {
        return null;
    }

    // Try to construct standard ID from EANS parts
    let id = getString(item, "id");
    const notamId = item["notamId"] as Record<string, unknown> | undefined;
    if (isObject(notamId)) {
        const series = getString(notamId, "series");
        const number = getNumber(notamId, "number");
        const year = getNumber(notamId, "year");
        if (series && number && year) {
            const yy = String(year).slice(-2);
            const num = String(number).padStart(4, "0");
            id = `${series}${num}/${yy}`;
        }
    }

    const text = getString(item, "text");

    // id and text are required
    if (!id || !text) {
        return null;
    }

    const validFromUtc = getString(item, "validFromUtc") ?? getString(item.validity as any, "start");
    const validToUtc = getString(item, "validToUtc") ?? getString(item.validity as any, "end");
    const summary = formatNotamSummary(text, 60);
    const altitudes = parseAltitudesFromText(text);

    // EANS qualifiers geometry fallback
    let geometryCandidate = extractGeometryCandidate(item);
    if (!geometryCandidate && isObject(item.qualifiers)) {
        const q = item.qualifiers as Record<string, unknown>;
        const coord = getString(q, "coordinate"); // e.g. "5925N02450E"
        const rad = getNumber(q, "radius");
        if (coord && rad !== undefined) {
            geometryCandidate = {
                // Synthesize a shape that parseNotamGeometry can understand or parse directly here.
                // We'll parse it manually below to be cleaner.
                eansCoord: coord,
                radiusNm: rad,
            };
        }
    }

    let geometryResult = parseNotamGeometryWithReason(item);

    // If standard parsing failed, try EANS qualifiers
    if (!geometryResult.geometry && geometryCandidate && (geometryCandidate as any).eansCoord) {
        const gc = geometryCandidate as any;

        // Filter out massive areas (e.g. entire FIR > 900NM) which clutter the map
        if (typeof gc.radiusNm === "number" && gc.radiusNm < 900) {
            const center = parseEansCoordinate(gc.eansCoord);
            if (center) {
                geometryResult = {
                    geometry: {
                        kind: "circle",
                        center,
                        radiusMeters: gc.radiusNm * NM_TO_METERS,
                    },
                };
            }
        }
    }

    const geometry = geometryResult.geometry;
    const presentFields = getGeometryFieldSnapshot(item);

    if (!geometry && typeof process !== "undefined" && process.env.NODE_ENV !== "production") {
        // eslint-disable-next-line no-console
        console.debug("[notam] missing geometry", { id, geometryCandidate });
    }

    return {
        id,
        summary,
        text,
        validFromUtc,
        validToUtc,
        altitudes,
        geometry,
        geometryParseReason: geometryResult.reason,
        geometryParseDetails: geometry
            ? undefined
            : {
                ...geometryResult.details,
                presentFields,
            },
        eventTimeUtc,
        raw: item,
    };
}

// ─────────────────────────────────────────────────────────────────────────────
// Main entry point
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Normalize raw NOTAM JSON into NormalizedNotam[].
 *
 * Defensively handles unknown input shapes:
 * - Mock format: { generatedAtUtc, items: [...] }
 * - EANS live: tries to locate an array of items
 *
 * @param raw - Raw NOTAM payload (unknown shape)
 * @param nowUtcIso - Current UTC time as ISO string (fallback for eventTimeUtc)
 * @returns Array of normalized NOTAMs
 */
export function countNotamItems(raw: NotamRaw): number {
    if (!isObject(raw)) {
        return isArray(raw) ? raw.length : 0;
    }

    if (isArray(raw.items)) {
        return raw.items.length;
    }
    if (isArray(raw.notams)) {
        return raw.notams.length;
    }
    if (isArray(raw.data)) {
        return raw.data.length;
    }
    if (isArray(raw)) {
        return raw.length;
    }

    return 0;
}

export function normalizeNotams(raw: NotamRaw, nowUtcIso: string): NormalizedNotam[] {
    const results: NormalizedNotam[] = [];

    if (!isObject(raw)) {
        return results;
    }

    // Try to determine eventTimeUtc from response
    const generatedAtUtc = getString(raw, "generatedAtUtc") ?? nowUtcIso;

    // Try to find items array
    let items: unknown[] | null = null;

    // Mock format: { items: [...] }
    if (isArray(raw.items)) {
        items = raw.items;
    }
    // EANS might have different key - try common alternatives
    else if (isArray(raw.notams)) {
        items = raw.notams as unknown[];
    } else if (isArray(raw.data)) {
        items = raw.data as unknown[];
    }
    // If raw itself is an array, use it directly
    else if (isArray(raw)) {
        items = raw;
    }
    // EANS live format
    else if (isObject(raw.dynamicData) && isArray((raw.dynamicData as any).notams)) {
        items = (raw.dynamicData as any).notams as unknown[];
    }

    if (!items) {
        return results;
    }

    for (const item of items) {
        const normalized = normalizeNotamItem(item, generatedAtUtc);
        if (normalized) {
            results.push(normalized);
        }
    }

    return results;
}
