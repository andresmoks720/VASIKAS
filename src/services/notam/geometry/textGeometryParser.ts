import type { NotamGeometry, GeometryParseResult } from "../notamTypes";
import { parseCoordinateChain, parseDmsLatLonPair, parseEansCoordinate, parseEnhancedCoordinate, parseEnhancedCoordinateChain } from "./coordParsers";

/**
 * Parse geometry directly from NOTAM text content
 * This function attempts to extract geometric information from the raw NOTAM text
 */
export function parseGeometryFromNotamText(text: string): GeometryParseResult {
  if (!text || typeof text !== 'string') {
    return { geometry: null, reason: "NO_TEXT" };
  }

  // Clean up the text to remove extra whitespace and normalize
  const cleanText = normalizeNotamText(text);

  // Try to parse coordinate chains first (most common pattern)
  const coordinateChainResult = parseCoordinateChainFromText(cleanText);
  if (coordinateChainResult) {
    return { geometry: coordinateChainResult };
  }

  // Try to parse circle patterns (like "radius 5NM from point X")
  const circleResult = parseCircleFromText(cleanText);
  if (circleResult) {
    return { geometry: circleResult };
  }

  // Try to parse individual coordinate pairs
  const coordinatePairResult = parseCoordinatePairsFromText(cleanText);
  if (coordinatePairResult) {
    return { geometry: coordinatePairResult };
  }

  // Try to parse polygon patterns
  const polygonResult = parsePolygonFromText(cleanText);
  if (polygonResult) {
    return { geometry: polygonResult };
  }

  // If no geometry found, return null with reason
  return { geometry: null, reason: "NO_GEOMETRY_IN_TEXT" };
}

/**
 * Normalize NOTAM text by cleaning up whitespace and standardizing format
 */
function normalizeNotamText(text: string): string {
  // Remove extra whitespace, normalize line breaks, and clean up common formatting issues
  return text
    .replace(/\s+/g, ' ') // Replace multiple whitespace with single space
    .replace(/\u00a0/g, ' ') // Replace non-breaking spaces with regular spaces
    .trim();
}

/**
 * Parse coordinate chains from NOTAM text
 * Looks for patterns like "591633N 0261500E - 591639N 0255647E - 591614N 0254748E"
 */
function parseCoordinateChainFromText(text: string): NotamGeometry | null {
  // Try enhanced coordinate chain parsing first
  const enhancedCoords = parseEnhancedCoordinateChain(text);
  if (enhancedCoords && enhancedCoords.length >= 3) { // Need at least 3 points for a polygon
    // Close the ring by adding the first point to the end if not already closed
    const firstPoint = enhancedCoords[0];
    const lastPoint = enhancedCoords[enhancedCoords.length - 1];

    // Check if ring is closed (first and last points are the same)
    const tolerance = 0.000001;
    const isClosed = Math.abs(firstPoint[0] - lastPoint[0]) < tolerance &&
        Math.abs(firstPoint[1] - lastPoint[1]) < tolerance;

    const ring = isClosed ? enhancedCoords : [...enhancedCoords, firstPoint];

    return {
      kind: "polygon",
      rings: [ring]
    };
  }

  // Look for coordinate chains in the text
  // Pattern: sequences of coordinates separated by " - " or similar separators
  const coordChainPattern = /(\d{6}[NS]\s*\d{6,7}[EW](?:\s*-\s*\d{6}[NS]\s*\d{6,7}[EW])*)+/gi;
  const matches = text.match(coordChainPattern);

  if (matches) {
    for (const match of matches) {
      const coords = parseCoordinateChain(match);
      if (coords && coords.length >= 3) { // Need at least 3 points for a polygon
        // Close the ring by adding the first point to the end if not already closed
        const firstPoint = coords[0];
        const lastPoint = coords[coords.length - 1];

        // Check if ring is closed (first and last points are the same)
        const tolerance = 0.000001;
        const isClosed = Math.abs(firstPoint[0] - lastPoint[0]) < tolerance &&
            Math.abs(firstPoint[1] - lastPoint[1]) < tolerance;

        const ring = isClosed ? coords : [...coords, firstPoint];

        return {
          kind: "polygon",
          rings: [ring]
        };
      }
    }
  }

  // Try alternative patterns for coordinate chains
  // Look for coordinates separated by various delimiters
  const altCoordChainPattern = /(\d{6}[NS][\s,]*\d{6,7}[EW](?:\s*(?:-|,|to)\s*\d{6}[NS][\s,]*\d{6,7}[EW])*)+/gi;
  const altMatches = text.match(altCoordChainPattern);

  if (altMatches) {
    for (const match of altMatches) {
      // Replace delimiters with standard format for parsing
      const normalized = match.replace(/(?:-|,|to)/g, ' - ');
      const coords = parseCoordinateChain(normalized);
      if (coords && coords.length >= 3) {
        const firstPoint = coords[0];
        const lastPoint = coords[coords.length - 1];

        const tolerance = 0.000001;
        const isClosed = Math.abs(firstPoint[0] - lastPoint[0]) < tolerance &&
            Math.abs(firstPoint[1] - lastPoint[1]) < tolerance;

        const ring = isClosed ? coords : [...coords, firstPoint];

        return {
          kind: "polygon",
          rings: [ring]
        };
      }
    }
  }

  return null;
}

/**
 * Parse individual coordinate pairs from NOTAM text
 * Looks for patterns like "591633N 0261500E" or "N059.1234 E024.5678"
 */
function parseCoordinatePairsFromText(text: string): NotamGeometry | null {
  // Split text into segments and try to parse each as coordinates
  const segments = text.split(/[,\n\r;]+/);

  const coordinates: [number, number][] = [];

  for (const segment of segments) {
    const trimmed = segment.trim();

    // Try enhanced coordinate parsing first
    const enhancedResult = parseEnhancedCoordinate(trimmed);
    if (enhancedResult) {
      coordinates.push(enhancedResult);
      continue;
    }

    // Try DMS format (591633N 0261500E)
    const dmsResult = parseDmsLatLonPair(trimmed);
    if (dmsResult) {
      coordinates.push(dmsResult);
      continue;
    }

    // Try EANS format (5925N02450E)
    const eansResult = parseEansCoordinate(trimmed);
    if (eansResult) {
      coordinates.push(eansResult);
      continue;
    }

    // Try decimal format (N059.1234 E024.5678)
    const decimalResult = parseDecimalCoordinate(trimmed);
    if (decimalResult) {
      coordinates.push(decimalResult);
      continue;
    }
  }

  if (coordinates.length >= 3) {
    // Create a polygon from the coordinates
    const firstPoint = coordinates[0];
    const lastPoint = coordinates[coordinates.length - 1];

    // Check if ring is closed
    const tolerance = 0.000001;
    const isClosed = Math.abs(firstPoint[0] - lastPoint[0]) < tolerance &&
        Math.abs(firstPoint[1] - lastPoint[1]) < tolerance;

    const ring = isClosed ? coordinates : [...coordinates, firstPoint];

    return {
      kind: "polygon",
      rings: [ring]
    };
  } else if (coordinates.length === 1) {
    // If only one coordinate found, return it as a circle with default radius
    return {
      kind: "circle",
      center: coordinates[0],
      radiusMeters: 1000 // Default 1km radius
    };
  }

  return null;
}

/**
 * Parse decimal coordinate format like "N059.1234 E024.5678"
 */
function parseDecimalCoordinate(text: string): [number, number] | null {
  // Pattern for decimal coordinates: N059.1234 E024.5678
  const decimalPattern = /([NS])(\d{2,3}\.\d+)\s*([EW])(\d{2,3}\.\d+)/i;
  const match = text.match(decimalPattern);
  
  if (match) {
    const [, latDir, latDeg, lonDir, lonDeg] = match;
    let lat = parseFloat(latDeg);
    let lon = parseFloat(lonDeg);
    
    if (latDir.toUpperCase() === 'S') {
      lat = -lat;
    }
    
    if (lonDir.toUpperCase() === 'W') {
      lon = -lon;
    }
    
    if (isValidLonLat(lon, lat)) {
      return [lon, lat];
    }
  }
  
  // Alternative pattern: 59.1234N 24.5678E
  const altDecimalPattern = /(\d{2,3}\.\d+)([NS])\s*(\d{2,3}\.\d+)([EW])/i;
  const altMatch = text.match(altDecimalPattern);
  
  if (altMatch) {
    const [, latDeg, latDir, lonDeg, lonDir] = altMatch;
    let lat = parseFloat(latDeg);
    let lon = parseFloat(lonDeg);
    
    if (latDir.toUpperCase() === 'S') {
      lat = -lat;
    }
    
    if (lonDir.toUpperCase() === 'W') {
      lon = -lon;
    }
    
    if (isValidLonLat(lon, lat)) {
      return [lon, lat];
    }
  }
  
  return null;
}

/**
 * Parse circle patterns from NOTAM text
 * Looks for patterns like "radius 5NM from point X" or "circle of 2km radius"
 */
function parseCircleFromText(text: string): NotamGeometry | null {
  // Pattern for circles: radius followed by distance unit and center point
  const circlePatterns = [
    /radius\s+(\d+(?:\.\d+)?)\s*(nm|nmi|km|m|ft)\s+from\s+point\s+([NSEW\d\s.-]+)/i,
    /circle\s+of\s+(\d+(?:\.\d+)?)\s*(nm|nmi|km|m|ft)\s+radius/i,
    /within\s+(\d+(?:\.\d+)?)\s*(nm|nmi|km|m|ft)\s+of\s+point\s+([NSEW\d\s.-]+)/i,
    /radius\s+(\d+(?:\.\d+)?)\s*(nm|nmi|km|m|ft)/i, // Simple radius pattern
    /(\d+(?:\.\d+)?)\s*nmi?\s+circular\s+area/i, // "5NM circular area"
    /circular\s+area\s+of\s+(\d+(?:\.\d+)?)\s*(nm|nmi|km|m|ft)/i, // "circular area of 5NM"
  ];

  for (const pattern of circlePatterns) {
    const match = text.match(pattern);
    if (match) {
      const [, radiusStr, unit, centerText] = match;
      const radius = parseFloat(radiusStr);

      if (isNaN(radius)) {
        continue;
      }

      let radiusMeters: number;
      switch (unit ? unit.toLowerCase() : 'nm') { // Default to nautical miles if no unit specified
        case 'nm':
        case 'nmi':
          radiusMeters = radius * 1852; // nautical miles to meters
          break;
        case 'km':
          radiusMeters = radius * 1000; // kilometers to meters
          break;
        case 'ft':
          radiusMeters = radius * 0.3048; // feet to meters
          break;
        default: // meters or undefined
          radiusMeters = unit ? radius : radius * 1852; // Default to nautical miles if no unit
      }

      // Try to find the center point from the text
      let center: [number, number] | null = null;

      if (centerText) {
        center = parseDmsLatLonPair(centerText) || parseEansCoordinate(centerText) || parseDecimalCoordinate(centerText);
      }

      // If no center point found in the text, look for coordinates nearby in the text
      if (!center) {
        const nearbyCoords = findNearbyCoordinates(text, match.index || 0);
        if (nearbyCoords) {
          center = nearbyCoords;
        }
      }

      // If still no center, try to find any coordinates in the text
      if (!center) {
        const anyCoords = findAnyCoordinatesInText(text);
        if (anyCoords) {
          center = anyCoords;
        }
      }

      // If still no center, use a default center (this is a fallback)
      if (!center) {
        center = [25.0136, 58.5953]; // Default Estonian center
      }

      return {
        kind: "circle",
        center,
        radiusMeters
      };
    }
  }

  return null;
}

/**
 * Find any coordinates in the text
 */
function findAnyCoordinatesInText(text: string): [number, number] | null {
  // First try enhanced coordinate parsing on the whole text
  const enhancedResult = parseEnhancedCoordinate(text);
  if (enhancedResult) {
    return enhancedResult;
  }

  // Look for any coordinate patterns in the text
  const coordPatterns = [
    /\b(\d{6}[NS]\s*\d{6,7}[EW])\b/gi,  // DMS format
    /\b(\d{4}[NS]\d{5}[EW])\b/gi,      // EANS format
    /\b([NS]\d{2,3}\.\d+\s*[EW]\d{2,3}\.\d+)\b/gi,  // Decimal format
  ];

  for (const pattern of coordPatterns) {
    const matches = text.match(pattern);
    if (matches) {
      for (const match of matches) {
        const enhancedResult = parseEnhancedCoordinate(match);
        if (enhancedResult) return enhancedResult;

        const dmsResult = parseDmsLatLonPair(match);
        if (dmsResult) return dmsResult;

        const eansResult = parseEansCoordinate(match);
        if (eansResult) return eansResult;

        const decimalResult = parseDecimalCoordinate(match);
        if (decimalResult) return decimalResult;
      }
    }
  }

  return null;
}

/**
 * Parse polygon patterns from NOTAM text
 * Looks for polygonal areas defined by multiple coordinate points
 */
function parsePolygonFromText(text: string): NotamGeometry | null {
  // Look for polygon patterns - multiple coordinates that form a closed shape
  const coordMatches = text.match(/\b\d{6}[NS]\s*\d{6,7}[EW]\b/gi);
  
  if (coordMatches && coordMatches.length >= 3) {
    const coordinates: [number, number][] = [];
    
    for (const coordMatch of coordMatches) {
      const coord = parseDmsLatLonPair(coordMatch);
      if (coord) {
        coordinates.push(coord);
      }
    }
    
    if (coordinates.length >= 3) {
      // Close the polygon by adding the first point to the end
      const firstPoint = coordinates[0];
      const lastPoint = coordinates[coordinates.length - 1];
      
      // Check if ring is closed
      const tolerance = 0.000001;
      const isClosed = Math.abs(firstPoint[0] - lastPoint[0]) < tolerance &&
          Math.abs(firstPoint[1] - lastPoint[1]) < tolerance;

      const ring = isClosed ? coordinates : [...coordinates, firstPoint];
      
      return {
        kind: "polygon",
        rings: [ring]
      };
    }
  }
  
  return null;
}

/**
 * Find coordinates near a specific position in the text
 */
function findNearbyCoordinates(text: string, position: number): [number, number] | null {
  // Look for coordinates within a reasonable distance (e.g., 100 characters) from the position
  const start = Math.max(0, position - 100);
  const end = Math.min(text.length, position + 100);
  const nearbyText = text.substring(start, end);
  
  // Try to parse coordinates from the nearby text
  const coordMatch = nearbyText.match(/\b\d{6}[NS]\s*\d{6,7}[EW]\b/i);
  if (coordMatch) {
    return parseDmsLatLonPair(coordMatch[0]);
  }
  
  return null;
}

/**
 * Validate longitude and latitude values
 */
function isValidLonLat(lon: number, lat: number): boolean {
  return Number.isFinite(lon) && Number.isFinite(lat) && 
         Math.abs(lon) <= 180 && Math.abs(lat) <= 90;
}
