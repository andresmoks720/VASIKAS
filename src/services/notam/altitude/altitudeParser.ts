import type { Altitude } from "@/shared/types/domain";

// ─────────────────────────────────────────────────────────────────────────────
// Constants
// ─────────────────────────────────────────────────────────────────────────────

const FT_TO_METERS = 0.3048;

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
