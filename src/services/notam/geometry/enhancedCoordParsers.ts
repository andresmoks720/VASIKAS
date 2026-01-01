// ─────────────────────────────────────────────────────────────────────────────
// Enhanced Coordinate Parsing Functions
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Enhanced coordinate parser that supports multiple formats commonly found in NOTAMs
 * Supports:
 * - DMS format: "591633N 0261500E" (current format)
 * - Decimal degrees: "N59.1234 E024.5678" or "59.1234N 024.5678E"
 * - Degrees Decimal Minutes: "N5945.123 E02430.456"
 * - Space-separated DMS: "N 59 12 34 E 024 56 78"
 * - Various separators and formats
 */
export function parseEnhancedCoordinate(text: string): [number, number] | null {
  if (!text || typeof text !== 'string') {
    return null;
  }

  // Clean up the text
  const cleanText = text.trim().replace(/\s+/g, ' ');

  // Try different parsing strategies in order of likelihood
  return (
    parseDecimalDegrees(cleanText) ||
    parseDmsWithSpaces(cleanText) ||
    parseDegreesDecimalMinutes(cleanText) ||
    parseDmsLatLonPair(cleanText) || // Original format
    parseEansCoordinate(cleanText) || // Original format
    null
  );
}

/**
 * Parse decimal degrees format like "N59.1234 E024.5678" or "59.1234N 024.5678E"
 */
function parseDecimalDegrees(text: string): [number, number] | null {
  // Pattern for decimal degrees: N59.1234 E024.5678 or 59.1234N 024.5678E
  const decimalPattern = /([NS])?(\d{2,3}\.\d+)\s*([EW])?\s*([NS])?(\d{2,3}\.\d+)([EW])?/i;
  const match = text.match(decimalPattern);

  if (match) {
    // The pattern can match in different ways, so we need to determine which groups are lat/lon
    const [, dir1, latStr, dir2OrLonDir, dir3OrLat2, lonStr, lonDirMatch] = match;

    let latDir: string | undefined;
    let lonDir: string | undefined = lonDirMatch;
    let latStrFinal: string;
    let lonStrFinal: string;

    // Determine which is latitude and which is longitude based on the format
    if (dir1 && !dir3OrLat2) {
      // Format: N59.1234 E024.5678
      latDir = dir1;
      latStrFinal = latStr;
      lonDir = dir2OrLonDir;
      lonStrFinal = lonStr;
    } else if (dir3OrLat2 && !dir1) {
      // Format: 59.1234N 024.5678E
      latStrFinal = latStr;
      latDir = dir3OrLat2;
      lonStrFinal = lonStr;
    } else {
      // Try to determine based on value ranges
      const latVal = parseFloat(latStr);
      const lonVal = parseFloat(lonStr);
      
      if (latVal <= 90 && lonVal <= 180) {
        latStrFinal = latStr;
        lonStrFinal = lonStr;
        // Try to extract directions from other parts
        const directionMatch = text.match(/([NS])|([EW])/gi);
        if (directionMatch && directionMatch.length >= 2) {
          latDir = directionMatch[0];
          lonDir = directionMatch[1];
        }
      } else {
        return null;
      }
    }

    const lat = parseFloat(latStrFinal);
    const lon = parseFloat(lonStrFinal);

    if (isNaN(lat) || isNaN(lon)) {
      return null;
    }

    // Apply direction signs
    let finalLat = lat;
    let finalLon = lon;

    if (latDir) {
      if (latDir.toUpperCase() === 'S') {
        finalLat = -lat;
      }
    }

    if (lonDir) {
      if (lonDir.toUpperCase() === 'W') {
        finalLon = -lon;
      }
    }

    // Validate ranges
    if (Math.abs(finalLat) > 90 || Math.abs(finalLon) > 180) {
      return null;
    }

    return [finalLon, finalLat];
  }

  return null;
}

/**
 * Parse DMS with spaces format like "N 59 12 34 E 024 56 78"
 */
function parseDmsWithSpaces(text: string): [number, number] | null {
  // Pattern for DMS with spaces: N 59 12 34 E 024 56 78
  const pattern = /([NS])\s+(\d{1,3})\s+(\d{1,2})\s+(\d{1,2})\s+([EW])\s+(\d{1,3})\s+(\d{1,2})\s+(\d{1,2})/i;
  const match = text.match(pattern);

  if (match) {
    const [, latDir, latDeg, latMin, latSec, lonDir, lonDeg, lonMin, lonSec] = match;

    const lat = parseInt(latDeg) + parseInt(latMin) / 60 + parseInt(latSec) / 3600;
    const lon = parseInt(lonDeg) + parseInt(lonMin) / 60 + parseInt(lonSec) / 3600;

    let finalLat = lat;
    let finalLon = lon;

    if (latDir.toUpperCase() === 'S') {
      finalLat = -lat;
    }

    if (lonDir.toUpperCase() === 'W') {
      finalLon = -lon;
    }

    if (Math.abs(finalLat) > 90 || Math.abs(finalLon) > 180) {
      return null;
    }

    return [finalLon, finalLat];
  }

  return null;
}

/**
 * Parse Degrees Decimal Minutes format like "N5945.123 E02430.456"
 * This format has degrees as first digits and decimal minutes following
 */
function parseDegreesDecimalMinutes(text: string): [number, number] | null {
  // Pattern for degrees decimal minutes: N5945.123 E02430.456
  // Where 59 is degrees, 45.123 is decimal minutes
  const pattern = /([NS])(\d{2,3})(\d{2}\.\d+)\s*([EW])(\d{2,3})(\d{2}\.\d+)/i;
  const match = text.match(pattern);

  if (match) {
    const [, latDir, latDeg, latMin, lonDir, lonDeg, lonMin] = match;

    const lat = parseInt(latDeg) + parseFloat(latMin) / 60;
    const lon = parseInt(lonDeg) + parseFloat(lonMin) / 60;

    let finalLat = lat;
    let finalLon = lon;

    if (latDir.toUpperCase() === 'S') {
      finalLat = -lat;
    }

    if (lonDir.toUpperCase() === 'W') {
      finalLon = -lon;
    }

    if (Math.abs(finalLat) > 90 || Math.abs(finalLon) > 180) {
      return null;
    }

    return [finalLon, finalLat];
  }

  return null;
}

/**
 * Parse coordinate in DMS (Degrees, Minutes, Seconds) format like "591633N 0261500E"
 * 591633N -> 59 deg 16 min 33 sec N
 * 0261500E -> 26 deg 15 min 00 sec E
 * This is the original function with some enhancements
 */
export function parseDmsLatLonPair(text: string): [number, number] | null {
  // Remove any extra whitespace
  const cleanText = text.trim();

  // Match pattern for a complete coordinate pair like "591633N 0261500E" (with or without space)
  // Account for non-breaking spaces (\u00a0) and regular spaces
  const coordPairPattern = /(\d{6})\s*([NS])\s*(\d{6,7})\s*([EW])/;
  const match = cleanText.match(coordPairPattern);

  if (match) {
    // Parse latitude: DD MM SS
    const latDMS = match[1];
    const latDir = match[2];
    const latDegrees = parseInt(latDMS.substring(0, 2), 10);  // First 2 digits are degrees
    const latMinutes = parseInt(latDMS.substring(2, 4), 10);  // Next 2 digits are minutes
    const latSeconds = parseInt(latDMS.substring(4, 6), 10);  // Last 2 digits are seconds
    let lat = latDegrees + latMinutes / 60 + latSeconds / 3600;

    // Apply negative sign for South
    if (latDir === 'S') {
      lat = -lat;
    }

    // Parse longitude: DDD MM SS (Estonian coordinates are always 3 digits for degrees)
    // Even if the degree value starts with 0 (like 026), it's still 3 digits for degrees
    const lonDMS = match[3];
    const lonDir = match[4];
    let lonDegrees: number;
    let lonMinutes: number;
    let lonSeconds: number;

    if (lonDMS.length === 6) {
      // Format: DDD MM SS (3 digits for degrees, 2 for minutes, 2 for seconds)
      lonDegrees = parseInt(lonDMS.substring(0, 3), 10);  // First 3 digits are degrees
      lonMinutes = parseInt(lonDMS.substring(3, 5), 10);  // Next 2 digits are minutes
      lonSeconds = parseInt(lonDMS.substring(5, 7), 10);  // Last 2 digits are seconds
    } else if (lonDMS.length === 7) {
      // Format: DDD MM SS with leading zero (0DDD MM SS - 3 digits for degrees with leading zero)
      // For Estonian coordinates, longitude is always 22-28°E, so it's always 3 digits for degrees
      lonDegrees = parseInt(lonDMS.substring(0, 3), 10);  // First 3 digits are degrees (e.g., "026")
      lonMinutes = parseInt(lonDMS.substring(3, 5), 10);  // Next 2 digits are minutes
      lonSeconds = parseInt(lonDMS.substring(5, 7), 10);  // Last 2 digits are seconds
    } else {
      // Invalid longitude format
      return null;
    }

    let lon = lonDegrees + lonMinutes / 60 + lonSeconds / 3600;

    // Apply negative sign for West
    if (lonDir === 'W') {
      lon = -lon;
    }

    return [lon, lat];
  }

  // If we couldn't match the pair pattern, try to match individual components
  // This handles cases where coordinates might be split across lines
  const latPattern = /(\d{6})\s*([NS])/;
  const lonPattern = /(\d{6,7})\s*([EW])/;
  const latMatch = cleanText.match(latPattern);
  const lonMatch = cleanText.match(lonPattern);

  if (latMatch && lonMatch) {
    // Parse latitude
    const latDMS = latMatch[1];
    const latDir = latMatch[2];
    const latDegrees = parseInt(latDMS.substring(0, 2), 10);
    const latMinutes = parseInt(latDMS.substring(2, 4), 10);
    const latSeconds = parseInt(latDMS.substring(4, 6), 10);
    let lat = latDegrees + latMinutes / 60 + latSeconds / 3600;

    if (latDir === 'S') {
      lat = -lat;
    }

    // Parse longitude
    const lonDMS = lonMatch[1];
    const lonDir = lonMatch[2];
    let lonDegrees: number;

    if (lonDMS.length === 6) {
      lonDegrees = parseInt(lonDMS.substring(0, 3), 10);
    } else if (lonDMS.length === 7) {
      // For Estonian coordinates, longitude is always 22-28°E, so it's always 3 digits for degrees
      lonDegrees = parseInt(lonDMS.substring(0, 3), 10);
    } else {
      return null;
    }

    const lonMinutes = parseInt(lonDMS.substring(3, 5), 10);
    const lonSeconds = parseInt(lonDMS.substring(5, 7), 10);
    let lon = lonDegrees + lonMinutes / 60 + lonSeconds / 3600;

    if (lonDir === 'W') {
      lon = -lon;
    }

    return [lon, lat];
  }

  // If we can't parse the coordinate, return null
  return null;
}

/**
 * Parse EANS coordinate string like "5925N02450E"
 * 5925N -> 59deg 25min N
 * 02450E -> 24deg 50min E
 * This is the original function
 */
export function parseEansCoordinate(raw: string): [number, number] | null {
  const clean = raw.replace(/\s+/g, "");
  // Regex: 4 digits + N/S, then 5 digits + E/W
  const match = clean.match(/^(\d{4})([NS])(\d{5})([EW])$/);
  if (!match) return null;

  const latStr = match[1];
  const latDir = match[2];
  const lonStr = match[3];
  const lonDir = match[4];

  const latDeg = parseInt(latStr.slice(0, 2), 10);
  const latMin = parseInt(latStr.slice(2), 10);
  let lat = latDeg + latMin / 60.0;
  if (latDir === "S") lat = -lat;

  const lonDeg = parseInt(lonStr.slice(0, 3), 10);
  const lonMin = parseInt(lonStr.slice(3), 10);
  let lon = lonDeg + lonMin / 60.0;
  if (lonDir === "W") lon = -lon;

  if (!isValidLonLat(lon, lat)) return null;

  return [lon, lat];
}

/**
 * Parse coordinate chain supporting multiple formats
 */
export function parseEnhancedCoordinateChain(text: string): [number, number][] | null {
  if (!text || typeof text !== 'string') {
    return null;
  }

  // Split by common separators: " - ", comma, semicolon, or " to "
  const separators = [' - ', ',', ';', ' to ', ' and '];
  let coordSegments: string[] = [text];

  // Try each separator to split the text
  for (const sep of separators) {
    if (text.includes(sep)) {
      coordSegments = text.split(sep);
      break;
    }
  }

  const coordinates: [number, number][] = [];

  for (const segment of coordSegments) {
    const coord = parseEnhancedCoordinate(segment.trim());
    if (coord) {
      coordinates.push(coord);
    } else {
      // If we can't parse a segment, it might be descriptive text, so we continue
      // rather than failing the entire chain
      continue;
    }
  }

  return coordinates.length > 0 ? coordinates : null;
}

function isValidLonLat(lon: number, lat: number): boolean {
  return Number.isFinite(lon) && Number.isFinite(lat) && Math.abs(lon) <= 180 && Math.abs(lat) <= 90;
}
