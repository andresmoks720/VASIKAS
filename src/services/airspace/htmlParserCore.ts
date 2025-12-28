import type { AirspaceFeature } from "./airspaceTypes";

/**
 * Interface for DOM-like elements to allow engine-agnostic parsing
 */
export interface ParserElement {
    querySelector(selector: string): ParserElement | null;
    querySelectorAll(selector: string): ParserElement[];
    getAttribute(name: string): string | null;
    textContent: string | null;
    innerHTML: string | null;
}

/**
 * Interface for the parser engine (e.g., Cheerio or native DOMParser)
 */
export interface ParserEngine {
    load(html: string): ParserElement;
}

export interface ParseCoreResult {
    features: AirspaceFeature[];
    issues: string[];
    effectiveDate?: string;
}

/**
 * Core parsing logic for eAIP ENR 5.1 HTML
 * Engine-agnostic implementation that works with both Cheerio and native DOMParser
 */
export function parseEaipEnr51Core(root: ParserElement, sourceUrl: string): ParseCoreResult {
    const issues: string[] = [];
    const features: AirspaceFeature[] = [];

    // Extract effective date
    let effectiveDate: string | undefined;
    const effectiveDateMeta = root.querySelector('meta[name="EM.effectiveDateStart"]');
    if (effectiveDateMeta) {
        effectiveDate = effectiveDateMeta.getAttribute('content') || undefined;
    }

    // Find all table rows
    const rows = root.querySelectorAll('tbody tr');

    for (let i = 0; i < rows.length; i++) {
        const row = rows[i];
        const cells = row.querySelectorAll('td');
        if (cells.length === 0) continue;

        const firstCell = cells[0];
        const cellText = (firstCell.textContent || '').trim();

        // Look for designator in strong tag
        let designator = '';
        const strongTag = row.querySelector('p strong');
        if (strongTag) {
            designator = (strongTag.textContent || '').trim();
        } else {
            const designatorMatch = cellText.match(/([A-Z]{2,3}\d+[A-Z]?\s*[A-Z]*)/);
            if (designatorMatch) {
                designator = designatorMatch[1].trim();
            }
        }

        if (!designator) {
            if (cellText.length > 5) {
                issues.push(`Could not extract designator from row ${i}: ${cellText.substring(0, 50)}...`);
            }
            continue;
        }

        // Extract coordinates
        const cleanCellText = cellText.replace(/\u00a0/g, ' ').replace(/\s+/g, ' ').trim();
        const coordPattern = /(\d{6}[NS]\s+\d{6,7}[EW](?:\s*-\s*\d{6}[NS]\s+\d{6,7}[EW])*)/g;
        const allCoordMatches = cleanCellText.match(coordPattern);

        if (!allCoordMatches || allCoordMatches.length === 0) {
            if (cellText.includes('further along') || cellText.includes('along the state border')) {
                issues.push(`AIP_PARSE_UNSUPPORTED: Area ${designator} has complex geometry`);
            } else if (cellText.length > 0) {
                issues.push(`AIP_PARSE_UNSUPPORTED: No coordinates for ${designator}`);
            }
            continue;
        }

        const rings: [number, number][][] = [];
        for (const coordText of allCoordMatches) {
            const coordinates = parseCoordinateChain(coordText);
            if (coordinates) {
                // Ensure closure
                const first = coordinates[0];
                const last = coordinates[coordinates.length - 1];
                if (first && last && (Math.abs(first[0] - last[0]) > 0.000001 || Math.abs(first[1] - last[1]) > 0.000001)) {
                    coordinates.push(first);
                }
                rings.push(coordinates);
            } else {
                issues.push(`AIP_PARSE_ERROR: Failed to parse coordinates for ${designator}`);
            }
        }

        if (rings.length === 0) continue;

        // Limits and remarks
        const upperLimit = (cells[1]?.textContent || '').trim().split('\n')[0] || 'Unknown';
        const lowerLimit = (cells[1]?.textContent || '').trim().split('\n')[1] || 'SFC';
        const remarks = (cells[2]?.textContent || '').trim();

        const geometryType = rings.length > 1 ? 'MultiPolygon' : 'Polygon';
        const geometryCoords = rings.length > 1 ? [rings] : rings;

        features.push({
            type: 'Feature',
            geometry: {
                type: geometryType as any,
                coordinates: geometryCoords as any
            },
            properties: {
                designator: designator.trim(),
                upperLimit: upperLimit.trim(),
                lowerLimit: lowerLimit.trim(),
                remarks: remarks,
                sourceUrl: sourceUrl
            }
        });
    }

    return { features, issues, effectiveDate };
}

function parseCoordinateChain(coordText: string): [number, number][] | null {
    const coordPairs = coordText.split(' - ');
    const coordinates: [number, number][] = [];

    for (const pair of coordPairs) {
        const trimmed = pair.trim();
        const match = trimmed.match(/(\d{6})([NS])\s+(\d{6,7})([EW])/) ||
            trimmed.match(/(\d{6})([NS])(\d{6,7})([EW])/);

        if (!match) return null;

        const [, latDMS, latDir, lonDMS, lonDir] = match;

        const lat = parseDms(latDMS, latDir === 'S', false);
        const lon = parseDms(lonDMS, lonDir === 'W', true);

        if (lat === null || lon === null) return null;
        coordinates.push([lon, lat]);
    }

    return coordinates;
}

function parseDms(dms: string, isNegative: boolean, isLongitude: boolean): number | null {
    if (dms.length < 6) return null;

    const degLen = isLongitude ? 3 : 2;
    // Lon in Estonia is roughly 21-29. Lat is 57-60.
    // If dms length is 6 for longitude, the first digit of degrees might be missing (implied 0)
    // but the spec for eAIP usually uses 3 digits for longitude degrees.
    if (isLongitude && dms.length === 6) {
        // Handle potential case where leading zero is omitted (e.g. 240000E instead of 0240000E)
        // Actually, let's be strict for Estonian regions if we see 6 digits for longitude
        // it likely means DDD MM S (missing one second digit) OR DD MM SS (missing leading 0 deg)
        // The core parser currently assumes degLen=3 for dms.length=7 and degLen=2 for dms.length=6.
        // Let's adjust:
    }

    const deg = parseInt(dms.substring(0, degLen), 10);
    const min = parseInt(dms.substring(degLen, degLen + 2), 10);
    let secStr = dms.substring(degLen + 2);
    if (secStr.length === 1) secStr += '0';
    const sec = parseInt(secStr, 10);

    // Sanity checks for Estonia
    if (isLongitude) {
        if (deg < 0 || deg > 180) return null;
        if (deg < 20 || deg > 30) {
            // Warn if outside Estonia? For now just be strict if it's clearly wrong
        }
    } else {
        if (deg < 0 || deg > 90) return null;
    }

    if (min < 0 || min >= 60 || sec < 0 || sec >= 60) return null;

    let val = deg + min / 60 + sec / 3600;
    return isNegative ? -val : val;
}
