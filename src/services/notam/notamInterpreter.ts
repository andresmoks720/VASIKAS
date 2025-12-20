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
    if (!isObject(hint)) {
        return null;
    }

    const type = getString(hint, "type");

    if (type === "circle") {
        const center = hint.center;
        if (!isObject(center)) return null;

        const lon = getNumber(center, "lon");
        const lat = getNumber(center, "lat");
        const radiusMeters = getNumber(hint, "radiusMeters");

        if (lon === undefined || lat === undefined || radiusMeters === undefined) {
            return null;
        }

        return {
            kind: "circle",
            center: [lon, lat],
            radiusMeters,
        };
    }

    if (type === "polygon") {
        const coordinates = hint.coordinates;
        if (!isArray(coordinates)) return null;

        // Convert [lon, lat] pairs to the expected format
        const ring: [number, number][] = [];
        for (const coord of coordinates) {
            if (isArray(coord) && coord.length >= 2 && isNumber(coord[0]) && isNumber(coord[1])) {
                ring.push([coord[0], coord[1]]);
            }
        }

        if (ring.length < 3) {
            return null;
        }

        // Ensure ring is closed
        const first = ring[0];
        const last = ring[ring.length - 1];
        if (first[0] !== last[0] || first[1] !== last[1]) {
            ring.push([first[0], first[1]]);
        }

        return {
            kind: "polygon",
            coordinates: [ring], // Single outer ring, GeoJSON format
        };
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
    const geometry = parseGeometryHint(item.geometryHint);

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
