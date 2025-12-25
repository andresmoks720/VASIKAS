import type { Altitude } from "@/shared/types/domain";

import {
    formatNotamSummary,
    GeometryParseReason,
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
        getNumber(value, "radiusMeters") ??
        getNumber(value, "radius_m") ??
        getNumber(value, "radiusM") ??
        getNumber(value, "radius");
    if (meters !== undefined) {
        return meters;
    }

    const km = getNumber(value, "radiusKm") ?? getNumber(value, "radiusKM");
    if (km !== undefined) {
        return km * KM_TO_METERS;
    }

    const nm = getNumber(value, "radiusNm") ?? getNumber(value, "radiusNM");
    if (nm !== undefined) {
        return nm * NM_TO_METERS;
    }

    return null;
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
export function parseGeometryHint(hint: unknown): NotamGeometry {
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

    if (ring.length < 3) {
        return null;
    }

    const first = ring[0];
    const last = ring[ring.length - 1];
    if (first[0] !== last[0] || first[1] !== last[1]) {
        ring.push([first[0], first[1]]);
    }

    return ring;
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

function parseGeometryCandidateStrict(value: unknown): NotamGeometry {
    return parseGeometryCandidate(value);
}

function parseGeometryCandidate(value: unknown): NotamGeometry {
    if (!value) {
        return null;
    }

    if (isObject(value)) {
        const type = getString(value, "type");

        if (type === "Polygon") {
            const polygon = parsePolygonCoordinates(value.coordinates);
            return polygon ? { kind: "polygon", coordinates: polygon } : null;
        }

        if (type === "MultiPolygon") {
            if (!isArray(value.coordinates) || value.coordinates.length === 0) {
                return null;
            }

            const polygons: [number, number][][][] = [];
            for (const polygonCandidate of value.coordinates) {
                const polygon = parsePolygonCoordinates(polygonCandidate);
                if (polygon) {
                    polygons.push(polygon);
                }
            }

            return polygons.length > 0 ? { kind: "multiPolygon", coordinates: polygons } : null;
        }

        if (type === "Point") {
            return parseCircleFrom(value);
        }

        const circle = parseCircleFrom(value);
        if (circle) {
            return circle;
        }

        if (value.coordinates) {
            const polygon = parsePolygonCoordinates(value.coordinates);
            return polygon ? { kind: "polygon", coordinates: polygon } : null;
        }
    }

    if (isArray(value)) {
        const polygon = parsePolygonCoordinates(value);
        return polygon ? { kind: "polygon", coordinates: polygon } : null;
    }

    return null;
}


export function parseAnyGeometry(item: unknown): NotamGeometry {
    if (!isObject(item)) {
        return null;
    }

    const hintGeometry = parseGeometryHint(item.geometryHint);
    if (hintGeometry) {
        return hintGeometry;
    }

    return parseNotamGeometry(item);
}

function extractGeometryCandidate(item: Record<string, unknown>): unknown {
    const candidates = [
        item.geometryHint,
        item.geometry,
        item.geojson,
        item.polygon,
        item.circle,
        item.shape,
        item.area,
    ];

    for (const candidate of candidates) {
        if (candidate !== null && candidate !== undefined) {
            return candidate;
        }
    }

    return null;
}

function normalizeCoord(value: unknown): [number, number] | null {
    if (isArray(value) && value.length >= 2) {
        const first = normalizeCoordValue(value[0]);
        const second = normalizeCoordValue(value[1]);
        if (first === null || second === null) {
            return null;
        }

        if (Math.abs(first) <= 90 && Math.abs(second) <= 180) {
            return [second, first];
        }

        return [first, second];
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

    return [lon, lat];
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

    if (ring.length < 3) {
        return null;
    }

    const first = ring[0];
    const last = ring[ring.length - 1];
    if (first[0] !== last[0] || first[1] !== last[1]) {
        ring.push([first[0], first[1]]);
    }

    return ring;
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

export type GeometryParseResult = { geometry: NotamGeometry | null; reason?: GeometryParseReason };

export function parseNotamGeometry(candidate: unknown): NotamGeometry {
    return parseNotamGeometryWithReason(candidate).geometry;
}

export function parseNotamGeometryWithReason(candidate: unknown): GeometryParseResult {
    if (!candidate) {
        return { geometry: null, reason: "NO_CANDIDATE" };
    }

    if (!isArray(candidate)) {
        const strictGeometry = parseGeometryHint(candidate);
        if (strictGeometry) {
            return { geometry: strictGeometry };
        }
    }

    if (isObject(candidate)) {
        const nestedCandidate = extractGeometryCandidate(candidate);
        if (nestedCandidate && nestedCandidate !== candidate) {
            return parseNotamGeometryWithReason(nestedCandidate);
        }

        const circle = normalizeCircleFrom(candidate);
        if (circle) {
            return { geometry: circle };
        }

        const type = getString(candidate, "type");
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
            return rings
                ? { geometry: { kind: "polygon", coordinates: rings } }
                : { geometry: null, reason: "INVALID_COORDS" };
        }

        if (type === "MultiPolygon") {
            const polygons = normalizeMultiPolygon(candidate.coordinates);
            return polygons
                ? { geometry: { kind: "multiPolygon", coordinates: polygons } }
                : { geometry: null, reason: "INVALID_COORDS" };
        }

        if (type) {
            return { geometry: null, reason: "UNSUPPORTED_TYPE" };
        }
    }

    if (isArray(candidate)) {
        const rings = normalizePolygonRings(candidate);
        return rings
            ? { geometry: { kind: "polygon", coordinates: rings } }
            : { geometry: null, reason: "INVALID_COORDS" };
    }

    return { geometry: null, reason: "UNSUPPORTED_TYPE" };
}

// ─────────────────────────────────────────────────────────────────────────────
// Item normalization
// ─────────────────────────────────────────────────────────────────────────────

function normalizeNotamItem(item: unknown, eventTimeUtc: string): NormalizedNotam | null {
    if (!isObject(item)) {
        return null;
    }

    const id = getString(item, "id");
    const text = getString(item, "text");

    // id and text are required
    if (!id || !text) {
        return null;
    }

    const validFromUtc = getString(item, "validFromUtc");
    const validToUtc = getString(item, "validToUtc");
    const summary = formatNotamSummary(text, 60);
    const altitudes = parseAltitudesFromText(text);
    const geometryCandidate = extractGeometryCandidate(item);
    const geometryResult = parseNotamGeometryWithReason(geometryCandidate);
    const geometry = geometryResult.geometry;

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
