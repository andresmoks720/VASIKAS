import type { Altitude } from "@/shared/types/domain";

/**
 * Raw NOTAM payload as received from upstream.
 * Treated as unknown since upstream schema may vary.
 */
export type NotamRaw = unknown;

/**
 * NOTAM geometry using WGS-84 coordinates (lon, lat).
 */
export type NotamGeometry =
    | { kind: "circle"; center: [number, number]; radiusMeters: number }
    | { kind: "polygon"; coordinates: [number, number][][] } // GeoJSON polygon rings [lon, lat]
    | null;

/**
 * Normalized NOTAM for UI and map layers, independent of upstream schema.
 */
export type NormalizedNotam = {
    /** NOTAM identifier (e.g., "A1234/25") */
    id: string;
    /** Short UI-safe summary (truncated/sanitized) */
    summary: string;
    /** Full NOTAM text */
    text: string;
    /** ISO 8601 UTC validity start (may be absent) */
    validFromUtc?: string;
    /** ISO 8601 UTC validity end (may be absent) */
    validToUtc?: string;
    /** Altitude constraints (always in meters, comment always present) */
    altitudes: Altitude[];
    /** Spatial extent if parseable (WGS-84) */
    geometry: NotamGeometry;
    /** When the NOTAM was generated/published (ISO 8601 UTC) */
    eventTimeUtc: string;
    /** Original upstream payload preserved for debugging */
    raw: NotamRaw;
};

// ─────────────────────────────────────────────────────────────────────────────
// Summary helpers
// ─────────────────────────────────────────────────────────────────────────────

const MAX_SUMMARY_LENGTH = 80;

/**
 * Sanitize text by collapsing whitespace and removing control characters.
 */
export function sanitizeText(text: string): string {
    const cleaned = Array.from(text, (char) => {
        const code = char.charCodeAt(0);
        if (code <= 0x1f || code === 0x7f) {
            return " ";
        }
        return char;
    }).join("");

    return cleaned.replace(/\s+/g, " ").trim();
}

/**
 * Truncate text to a maximum length, adding ellipsis if needed.
 */
export function truncateText(text: string, maxLength: number = MAX_SUMMARY_LENGTH): string {
    if (text.length <= maxLength) {
        return text;
    }

    // Cut at word boundary if possible
    const truncated = text.slice(0, maxLength);
    const lastSpace = truncated.lastIndexOf(" ");

    if (lastSpace > maxLength * 0.6) {
        return truncated.slice(0, lastSpace) + "…";
    }

    return truncated.slice(0, maxLength - 1) + "…";
}

/**
 * Create a UI-safe summary from NOTAM text.
 * Sanitizes control characters, collapses whitespace, and truncates.
 */
export function formatNotamSummary(text: string, maxLength: number = MAX_SUMMARY_LENGTH): string {
    return truncateText(sanitizeText(text), maxLength);
}
