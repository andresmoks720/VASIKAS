import { GeometryParseResult } from "./notamTypes";
import { parseGeometryHint, parseNotamGeometryWithReason } from "./geometry/geometryParsers";
import { parseCoordinateChain } from "./geometry/coordParsers";

// ─────────────────────────────────────────────────────────────────────────────
// Type guards and helpers
// ─────────────────────────────────────────────────────────────────────────────

function isObject(value: unknown): value is Record<string, unknown> {
    return typeof value === "object" && value !== null && !Array.isArray(value);
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
