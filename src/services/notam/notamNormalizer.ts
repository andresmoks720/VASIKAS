import {
    formatNotamSummary,
    NormalizedNotam,
    NotamRaw,
    type NotamGeometry,
    type GeometryParseReason,
} from "./notamTypes";
import { parseAltitudesFromText } from "./altitude/altitudeParser";
import { parseNotamGeometryWithReason, validateAndCorrectGeometry } from "./geometry/geometryParsers";
import { parseEansCoordinate } from "./geometry/coordParsers";
import { parseGeometryFromNotamText } from "./geometry/textGeometryParser";

// ─────────────────────────────────────────────────────────────────────────────
// Constants
// ─────────────────────────────────────────────────────────────────────────────

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

function resolveValidationReason(issues: string[]): GeometryParseReason | undefined {
    return issues.length > 0 ? "GEOMETRY_VALIDATION_ISSUES" : undefined;
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

    const validity = isObject(item.validity) ? (item.validity as Record<string, unknown>) : undefined;
    const validFromUtc = getString(item, "validFromUtc") ?? getString(validity, "start");
    const validToUtc = getString(item, "validToUtc") ?? getString(validity, "end");
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

    let isSynthetic = false;
    let geometryResult = parseNotamGeometryWithReason(item);

    // If standard parsing failed, try EANS qualifiers
    if (!geometryResult.geometry && geometryCandidate && isObject(geometryCandidate)) {
        const eansCoord = getString(geometryCandidate, "eansCoord");
        const radiusNm = getNumber(geometryCandidate, "radiusNm");

        // Filter out massive areas (e.g. entire FIR > 900NM) which clutter the map
        if (typeof radiusNm === "number" && radiusNm < 900 && eansCoord) {
            const center = parseEansCoordinate(eansCoord);
            if (center) {
                isSynthetic = true;
                const rawGeometry: NotamGeometry = {
                    kind: "circle",
                    center,
                    radiusMeters: radiusNm * NM_TO_METERS,
                };

                // Validate and correct the geometry
                const validated = validateAndCorrectGeometry(rawGeometry);
                geometryResult = {
                    geometry: validated.geometry,
                    reason: resolveValidationReason(validated.issues),
                    details: validated.issues.length > 0 ? { issues: validated.issues } : undefined
                };
            }
        }
    }

    // If still no geometry and we have text, try parsing geometry directly from NOTAM text
    if (!geometryResult.geometry && text) {
        const textGeometryResult = parseGeometryFromNotamText(text);
        if (textGeometryResult.geometry) {
            // Validate and correct the geometry
            const validated = validateAndCorrectGeometry(textGeometryResult.geometry);
            geometryResult = {
                geometry: validated.geometry,
                reason: resolveValidationReason(validated.issues),
                details: validated.issues.length > 0 ? { issues: validated.issues } : undefined
            };
            isSynthetic = true; // Mark as synthetic since it was derived from text
        }
    }

    const geometry = geometryResult.geometry;
    const presentFields = getGeometryFieldSnapshot(item);

    if (!geometry && typeof process !== "undefined" && process.env.NODE_ENV !== "production") {
        // eslint-disable-next-line no-console
        console.debug("[notam] missing geometry", { id, geometryCandidate });
    }

    const issues = geometryResult.reason ? [geometryResult.reason] : [];
    if (isSynthetic) {
        issues.push("SYNTHETIC_GEOMETRY");
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
        geometrySource: geometry ? 'notamText' : 'none',
        geometrySourceDetails: geometry ? {
            source: 'notamText',
            parserVersion: '1.0.0',
            issues: issues,
        } : undefined,
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
    else if (isObject(raw.dynamicData) && isArray(raw.dynamicData.notams)) {
        items = raw.dynamicData.notams;
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

// ─────────────────────────────────────────────────────────────────────────────
// Helper functions
// ─────────────────────────────────────────────────────────────────────────────

function extractGeometryCandidate(item: Record<string, unknown>): unknown {
    return extractGeometryCandidates(item)[0] ?? null;
}

function extractGeometryCandidates(item: Record<string, unknown>): unknown[] {
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

function getGeometryFieldSnapshot(raw: Record<string, unknown>): Record<string, boolean> {
    const fields = ["geometryHint", "geometry", "geojson", "geoJson", "shape", "area", "polygon", "circle"] as const;
    return Object.fromEntries(fields.map((field) => [field, raw[field] !== undefined && raw[field] !== null]));
}
