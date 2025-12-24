import type { Altitude } from "@/shared/types/domain";

import { formatNotamSummary, NormalizedNotam, NotamGeometry, NotamRaw } from "./notamTypes";

// ─────────────────────────────────────────────────────────────────────────────
// Constants
// ─────────────────────────────────────────────────────────────────────────────

const FT_TO_METERS = 0.3048;

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
    return parseGeometryCandidate(hint);
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

function parseGeoJsonOuterRingCoordinates(coords: unknown): [number, number][][] | null {
    if (!isArray(coords) || coords.length === 0) {
        return null;
    }

    const outerRingCandidate = coords[0];
    const outerRing = parseRing(outerRingCandidate);
    return outerRing ? [outerRing] : null;
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

    const radiusMeters = getNumber(value, "radiusMeters") ?? getNumber(value, "radius");
    if (radiusMeters === undefined) {
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

function parseGeometryCandidate(value: unknown): NotamGeometry {
    if (!value) {
        return null;
    }

    if (isObject(value)) {
        const type = getString(value, "type");

        if (type === "Polygon") {
            const polygon = parseGeoJsonOuterRingCoordinates(value.coordinates);
            return polygon ? { kind: "polygon", coordinates: polygon } : null;
        }

        if (type === "MultiPolygon") {
            if (isArray(value.coordinates) && value.coordinates.length > 0) {
                const polygon = parseGeoJsonOuterRingCoordinates(value.coordinates[0]);
                return polygon ? { kind: "polygon", coordinates: polygon } : null;
            }
            return null;
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

export function parseNotamGeometry(raw: unknown): NotamGeometry {
    if (!isObject(raw)) {
        return null;
    }

    const hintGeometry = parseGeometryHint(raw.geometryHint);
    if (hintGeometry) {
        return hintGeometry;
    }

    const candidateKeys = ["geometry", "geom", "shape", "area", "areaGeometry", "geoJson", "geojson"] as const;
    const candidates: unknown[] = candidateKeys.map((key) => raw[key]).filter((value) => value !== undefined);

    if (raw.coordinates !== undefined) {
        candidates.push(raw.coordinates);
    }

    if (raw.polygon !== undefined) {
        candidates.push(raw.polygon);
    }

    if (raw.polygons !== undefined) {
        candidates.push(raw.polygons);
    }

    if (raw.circle !== undefined) {
        candidates.push(raw.circle);
    }

    if (raw.center !== undefined || raw.radius !== undefined || raw.radiusMeters !== undefined) {
        candidates.push({
            center: raw.center,
            radius: raw.radius,
            radiusMeters: raw.radiusMeters,
        });
    }

    const rootCenter = parsePoint(raw);
    if (rootCenter && (raw.radius !== undefined || raw.radiusMeters !== undefined)) {
        candidates.push({
            center: rootCenter,
            radius: raw.radius,
            radiusMeters: raw.radiusMeters,
        });
    }

    for (const candidate of candidates) {
        const geometry = parseGeometryCandidate(candidate);
        if (geometry) {
            return geometry;
        }
    }

    return null;
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
    const geometry = parseAnyGeometry(item);

    return {
        id,
        summary,
        text,
        validFromUtc,
        validToUtc,
        altitudes,
        geometry,
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
