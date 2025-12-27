import type { Altitude } from "@/shared/types/domain";
import { formatNotamSummary, GeometryParseResult, NormalizedNotam, NotamGeometry, NotamRaw } from "./notamTypes";
import { parseAltitudesFromText } from "./altitude/altitudeParser";
import { parseGeometryHint, parseNotamGeometryWithReason } from "./geometry/geometryParsers";
import { parseEansCoordinate, parseCoordinateChain } from "./geometry/coordParsers";

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

// ─────────────────────────────────────────────────────────────────────────────
// Geometry parsing
// ─────────────────────────────────────────────────────────────────────────────

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

// ─────────────────────────────────────────────────────────────────────────────
// Coordinate chain parsing
// ─────────────────────────────────────────────────────────────────────────────

export function parseNotamGeometry(candidate: unknown): GeometryParseResult {
    return parseNotamGeometryWithReason(candidate);
}

/**
 * Parse coordinate chain from eAIP format like "591633N 0261500E - 591639N 0255647E - 591614N 0254748E"
 * Returns an array of [lon, lat] coordinates or null if parsing fails
 */
export function parseEaipCoordinateChain(text: string): [number, number][] | null {
    // Use the shared function from coordParsers
    return parseCoordinateChain(text);
}
