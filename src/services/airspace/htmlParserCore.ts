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
        if (cells.length < 3) {
            if (cells.length > 0) {
                issues.push(`Row ${i} skipped: unexpected number of cells (${cells.length})`);
            }
            continue;
        }

        const firstCell = cells[0];
        const cellText = (firstCell.textContent || '').trim();

        // Look for designator in strong tag
        let designator = '';
        const strongTag = row.querySelector('p strong');
        if (strongTag) {
            designator = (strongTag.textContent || '').trim();
        } else {
            // Fallback: look for typical designator pattern in cell text
            const designatorMatch = cellText.match(/([A-Z]{2,3}\d+[A-Z]?\s*[A-Z]*)/);
            if (designatorMatch) {
                designator = designatorMatch[1].trim();
            }
        }

        if (!designator) {
            if (cellText.length > 5) {
                // If the cell has substantial text but no designator, it might be a header or remark row
                // only log if it looks like it SHOULD have been a data row
                if (cellText.includes('Coord') || cellText.includes('Center')) {
                    // likely header
                } else {
                    issues.push(`Could not extract designator from row ${i}: ${cellText.substring(0, 50)}...`);
                }
            }
            continue;
        }

        // Extract coordinates
        const cleanCellText = cellText.replace(/\u00a0/g, ' ').replace(/\s+/g, ' ').trim();
        // Look for any string that seems to contain coordinate patterns
        const coordPattern = /(\d{4,6}[NS]\s+\d{5,7}[EW](?:\s*[-–—|]?\s*\d{4,6}[NS]\s+\d{5,7}[EW])*)/g;
        const allCoordMatches = cleanCellText.match(coordPattern);

        if (!allCoordMatches || allCoordMatches.length === 0) {
            if (cellText.includes('further along') || cellText.includes('along the state border')) {
                issues.push(`AIP_PARSE_UNSUPPORTED: Area ${designator} has complex geometry`);
            } else if (cellText.length > 0 && !cellText.includes(designator)) {
                // If it's not just the designator itself
                issues.push(`AIP_PARSE_UNSUPPORTED: No coordinates found for ${designator}`);
            }
            continue;
        }

        // Collect ALL rings from all matches
        const allRings: [number, number][][] = [];
        for (const coordText of allCoordMatches) {
            const rings = parseCoordinateChain(coordText); // Now returns Ring[]
            if (rings && rings.length > 0) {
                // For each ring, ensure it is CCW (positive area)
                // We treat ALL rings as separate polygons (overlaping stacks), NEVER as holes.
                for (const ring of rings) {
                    normalizeWindingOrder(ring, true);
                }
                allRings.push(...rings);
            }
        }

        if (allRings.length === 0) {
            issues.push(`AIP_PARSE_ERROR: Failed to parse coordinates for ${designator}`);
            continue;
        }

        // Limits and remarks
        const upperLimit = (cells[1]?.textContent || '').trim().split('\n')[0] || 'Unknown';
        const lowerLimit = (cells[1]?.textContent || '').trim().split('\n')[1] || 'SFC';
        const remarks = (cells[2]?.textContent || '').trim();

        features.push({
            type: 'Feature',
            geometry: allRings.length > 1
                // Each ring becomes its own Polygon in the MultiPolygon
                // [[Ring1], [Ring2]] -> MultiPolygon with 2 Polygons
                ? { type: 'MultiPolygon', coordinates: allRings.map(ring => [ring]) }
                : { type: 'Polygon', coordinates: [allRings[0]] },
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

/**
 * Parses a coordinate string.
 * Returns an array of Rings (because one string might contain multiple closed loops)
 */
export function parseCoordinateChain(coordText: string): [number, number][][] | null {
    // Allow optional separators (spaces, hyphens, etc) between Lat and Lon parts
    const pattern = /(\d{4,6})\s*([NS])\s*(?:[-–—|]\s*)?(\d{5,7})\s*([EW])/gi;
    const matches = Array.from(coordText.matchAll(pattern));

    if (matches.length < 3) return null;

    const allPoints: [number, number][] = [];
    for (const match of matches) {
        const [, latDMS, latDir, lonDMS, lonDir] = match;
        const lat = parseDms(latDMS, latDir.toUpperCase() === 'S', false);
        const lon = parseDms(lonDMS, lonDir.toUpperCase() === 'W', true);
        if (lat !== null && lon !== null) {
            allPoints.push([lon, lat]);
        }
    }

    // Split into closed rings
    const rings: [number, number][][] = [];
    let currentRing: [number, number][] = [];

    for (const p of allPoints) {
        currentRing.push(p);
        // Check if this point closes the loop
        if (currentRing.length >= 3) {
            const first = currentRing[0];
            const last = p;
            if (Math.abs(first[0] - last[0]) < 0.000001 && Math.abs(first[1] - last[1]) < 0.000001) {
                // Ring closed
                rings.push([...currentRing]);
                currentRing = [];
            }
        }
    }

    // If we have leftovers that didn't close explicitly, behave leniently if it's the ONLY sequence
    // If we already found rings, then leftover points are probably junk or malformed.
    // If we found NO rings, and we have points, try to auto-close it.
    if (rings.length === 0 && currentRing.length >= 3) {
        // Auto-close
        currentRing.push(currentRing[0]);
        rings.push(currentRing);
    }

    return rings.length > 0 ? rings : null;
}

export function parseDms(dms: string, isNegative: boolean, isLongitude: boolean): number | null {
    if (dms.length < 4) return null;

    // Handle variable length DMS (could be DDMM, DDMMSS, or DDDMMSS)
    // Degrees: 2 digits for Lat, 2 or 3 for Lon
    let degStr: string;
    let minStr: string;
    let secStr: string = '00';

    if (isLongitude) {
        if (dms.length >= 7) {
            degStr = dms.substring(0, 3);
            minStr = dms.substring(3, 5);
            secStr = dms.substring(5);
        } else if (dms.length === 6) {
            // Assume 3-digit degrees with leading zero omitted, or DDMMSS
            // If the first digit is 0, 1, or it's > 20, it's ambiguous.
            // For Estonia (lon 21-29), if it starts with 2, it's DDMMSS.
            // But 241030 could be 24 deg 10 min 30 sec.
            // If it was DDDMM, it would be 02410.
            // We'll prioritize the current 6-digit assumption: leading zero omitted for 3-deg lon
            degStr = '0' + dms.substring(0, 2);
            minStr = dms.substring(2, 4);
            secStr = dms.substring(4);
        } else if (dms.length === 5) {
            // DDDMM (5 chars)
            degStr = dms.substring(0, 3);
            minStr = dms.substring(3, 5);
            secStr = '00';
        } else {
            // Probably DDMM (4 chars), treat as 0DDMM for longitude
            degStr = '0' + dms.substring(0, 2);
            minStr = dms.substring(2, 4);
            secStr = '00';
        }
    } else {
        degStr = dms.substring(0, 2);
        minStr = dms.substring(2, 4);
        if (dms.length >= 6) {
            secStr = dms.substring(4);
        }
    }

    const deg = parseInt(degStr, 10);
    const min = parseInt(minStr, 10);
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

/**
 * Ensures the points are in CCW (exterior) or CW (hole) order
 * Uses the Shoelace formula (signed area)
 */
export function normalizeWindingOrder(coords: [number, number][], shouldBeCcw: boolean = true) {
    if (coords.length < 3) return;

    let area = 0;
    for (let i = 0; i < coords.length; i++) {
        const j = (i + 1) % coords.length;
        area += coords[i][0] * coords[j][1];
        area -= coords[j][0] * coords[i][1];
    }

    const isCcw = area > 0;
    if (isCcw !== shouldBeCcw) {
        coords.reverse();
    }
}
