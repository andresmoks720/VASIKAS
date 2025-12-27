import * as cheerio from 'cheerio';
import * as crypto from 'crypto-js';

// Define types for our data
interface AirspaceCoordinate {
  lat: number;
  lon: number;
}

interface AirspaceFeature {
  type: string;
  geometry: {
    type: string;
    coordinates: number[][]; // [lon, lat] pairs
  };
  properties: {
    designator: string;
    name?: string;
    upperLimit: string;
    lowerLimit: string;
    remarks?: string;
    sourceUrl: string;
  };
}

interface ParseResult {
  features: AirspaceFeature[];
  issues: string[];
  effectiveDate: string;
  sourceUrl: string;
  sha256: string;
  generatedAt: string;
}

/**
 * Converts DDMMSS format coordinates to decimal degrees
 * Format: 573311N 0271110E (DDMMSS direction)
 */
export function parseCoordinate(coordStr: string): { lat: number; lon: number } | null {
  // Remove any extra whitespace
  const cleanCoord = coordStr.trim();

  // Match pattern for a complete coordinate pair like "573311N 0271110E"
  // Account for non-breaking spaces (\u00a0) and regular spaces
  const coordPairPattern = /(\d{6})\s*([NS])\s+(\d{6,7})\s*([EW])/;
  const match = cleanCoord.match(coordPairPattern);

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

    return { lat, lon };
  }

  // If we couldn't match the pair pattern, try to match individual components
  // This handles cases where coordinates might be split across lines
  const latPattern = /(\d{6})\s*([NS])/;
  const lonPattern = /(\d{6,7})\s*([EW])/;
  const latMatch = cleanCoord.match(latPattern);
  const lonMatch = cleanCoord.match(lonPattern);

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

    return { lat, lon };
  }

  // If we can't parse the coordinate, return null
  return null;
}

/**
 * Parse coordinate chain from text like "573311N 0271110E - 573104N 0272102E - ..."
 */
export function parseCoordinateChain(coordText: string): AirspaceCoordinate[] | null {
  // Split by " - " to get individual coordinates
  const coordParts = coordText.split(' - ');

  const coordinates: AirspaceCoordinate[] = [];

  for (const part of coordParts) {
    // Each part should be like "573311N 0271110E" (lat and lon together)
    const coord = parseCoordinate(part.trim());
    if (coord) {
      coordinates.push(coord);
    } else {
      // If we can't parse a coordinate, return null to indicate failure
      return null;
    }
  }

  return coordinates;
}

/**
 * Main parser function to extract airspace data from eAIP HTML
 */
export async function parseEaipEnr51(html: string, sourceUrl: string): Promise<ParseResult> {
  const $ = cheerio.load(html);

  // Calculate SHA256 of the HTML
  const sha256 = crypto.SHA256(html).toString();

  // Extract effective date from meta tag
  let effectiveDate = '';
  const effectiveDateMeta = $('meta[name="EM.effectiveDateStart"]').attr('content');
  if (effectiveDateMeta) {
    // Convert YYYY-MM-DD format if it's in that format, or handle other formats
    effectiveDate = effectiveDateMeta;
  } else {
    // Fallback: try to find date in the title or other meta tags
    const dateMeta = $('meta[name="DC.date"]').attr('content');
    if (dateMeta) {
      effectiveDate = dateMeta;
    }
  }

  const features: AirspaceFeature[] = [];
  const issues: string[] = [];

  // Find all table rows in the restricted and danger areas sections
  const rows = $('tbody tr');

  rows.each((index, row) => {
    const $row = $(row);
    const cell = $row.find('td').first();

    if (cell.length === 0) return;

    const cellHtml = cell.html() || '';
    const cellText = cell.text().trim();

    // Look for designator in strong tag (e.g., <strong>EER15D</strong>)
    let designator = '';
    const strongTag = $row.find('p strong');
    if (strongTag.length > 0) {
      designator = strongTag.text().trim();
    } else {
      // Fallback: look for designator pattern in the text
      const designatorMatch = cellText.match(/([A-Z]{2,3}\d+[A-Z]?\s*[A-Z]*)/);
      if (designatorMatch) {
        designator = designatorMatch[1].trim();
      }
    }

    if (!designator) {
      issues.push(`Could not extract designator from row ${index}: ${cellText.substring(0, 100)}...`);
      return;
    }

    // Extract coordinate chain from the cell text
    // Look for patterns like "DDMMSSN DDDMMSSE - DDMMSSN DDDMMSSE - ..."
    // We need to extract coordinates that are in the format like: 573311N 0271110E - 573104N 0272102E
    // First, let's get the full text content and look for coordinate patterns
    // Note: The HTML uses non-breaking spaces (&nbsp; represented as \u00a0) instead of regular spaces
    const cleanCellText = cellText.replace(/\u00a0/g, ' ').replace(/\s+/g, ' ').trim();
    const coordPattern = /(\d{6}[NS]\s+\d{6,7}[EW](?:\s*-\s*\d{6}[NS]\s+\d{6,7}[EW])*)/g;
    const allCoordMatches = cleanCellText.match(coordPattern);

    if (!allCoordMatches || allCoordMatches.length === 0) {
      // Check if the text contains "further along the state border" or similar phrases
      if (cellText.includes('further along') || cellText.includes('along the state border') ||
          cellText.includes('along the territory dividing line')) {
        issues.push(`AIP_PARSE_UNSUPPORTED: Area ${designator} has complex geometry that cannot be parsed: ${cellText.substring(0, 100)}...`);
      } else {
        issues.push(`AIP_PARSE_UNSUPPORTED: Could not extract coordinates from area ${designator}: ${cellText.substring(0, 100)}...`);
      }
      return;
    }

    // Use the first match for now (in case there are multiple coordinate chains)
    const coordText = allCoordMatches[0];
    const coordinates = parseCoordinateChain(coordText);

    if (!coordinates) {
      issues.push(`AIP_PARSE_ERROR: Failed to parse coordinates for area ${designator}: ${coordText}`);
      return;
    }

    // Ensure polygon ring closure (first point repeated at end)
    if (coordinates.length > 0) {
      const firstPoint = coordinates[0];
      const lastPoint = coordinates[coordinates.length - 1];

      // Check if first and last points are the same (within a small tolerance)
      const tolerance = 0.000001;
      if (Math.abs(firstPoint.lat - lastPoint.lat) > tolerance ||
          Math.abs(firstPoint.lon - lastPoint.lon) > tolerance) {
        // Add the first point to the end to close the ring
        coordinates.push(firstPoint);
      }
    }

    // Convert to [lon, lat] format for GeoJSON (OpenLayers expects lon-first for EPSG:4326)
    const geoJsonCoordinates = coordinates.map(coord => [coord.lon, coord.lat]);

    // Extract upper and lower limits from the second column
    const upperLimitCell = $row.find('td').eq(1);
    let upperLimit = upperLimitCell.text().trim();
    let lowerLimit = 'SFC'; // Default

    // Try to extract upper and lower limits properly
    const cellContent = upperLimitCell.text();
    if (cellContent.includes('\n')) {
      const parts = cellContent.split('\n').map(p => p.trim()).filter(p => p);
      if (parts.length >= 2) {
        upperLimit = parts[0];
        lowerLimit = parts[1];
      }
    } else {
      // Look for patterns like "Upper Limit\nLower Limit" or similar
      const lines = cellContent.split(/[\r\n]+/).map(l => l.trim()).filter(l => l);
      if (lines.length >= 2) {
        upperLimit = lines[0];
        lowerLimit = lines[1];
      }
    }

    // Extract remarks from the third column
    const remarksCell = $row.find('td').eq(2);
    const remarks = remarksCell.text().trim();

    // Create GeoJSON feature
    const feature: AirspaceFeature = {
      type: 'Feature',
      geometry: {
        type: 'Polygon',
        coordinates: [geoJsonCoordinates] // Single polygon, so wrap in array
      },
      properties: {
        designator: designator.trim(),
        upperLimit: upperLimit.trim(),
        lowerLimit: lowerLimit.trim(),
        remarks: remarks,
        sourceUrl: sourceUrl
      }
    };

    features.push(feature);
  });

  return {
    features,
    issues,
    effectiveDate,
    sourceUrl,
    sha256,
    generatedAt: new Date().toISOString()
  };
}

/**
 * Validate geometry for a feature
 */
function validateGeometry(feature: AirspaceFeature, issues: string[]): AirspaceFeature {
  const coords = feature.geometry.coordinates[0]; // Assuming single polygon ring

  // Check ring closure
  if (coords.length < 2) {
    issues.push(`INVALID_GEOMETRY: Feature ${feature.properties.designator} has less than 2 points`);
    return feature;
  }

  const firstPoint = coords[0];
  const lastPoint = coords[coords.length - 1];

  // Check if ring is closed (first and last points are the same)
  const tolerance = 0.000001;
  const isClosed = Math.abs(firstPoint[0] - lastPoint[0]) < tolerance &&
                  Math.abs(firstPoint[1] - lastPoint[1]) < tolerance;

  if (!isClosed) {
    // Close the ring by adding the first point to the end
    coords.push(firstPoint);
    issues.push(`GEOMETRY_FIX: Feature ${feature.properties.designator} ring was not closed, auto-closing`);
  }

  // Check minimum points (should be at least 4 for a valid polygon: 3 unique + 1 closing)
  if (coords.length < 4) {
    issues.push(`INVALID_GEOMETRY: Feature ${feature.properties.designator} has less than 4 points`);
  }

  // Check coordinate ranges
  for (let i = 0; i < coords.length; i++) {
    const [lon, lat] = coords[i];

    // Validate coordinate ranges
    if (lon < -180 || lon > 180) {
      issues.push(`INVALID_COORDINATE: Feature ${feature.properties.designator} point ${i} longitude ${lon} out of range`);
    }

    if (lat < -90 || lat > 90) {
      issues.push(`INVALID_COORDINATE: Feature ${feature.properties.designator} point ${i} latitude ${lat} out of range`);
    }
  }

  // Check extent sanity for Estonian airspace
  // Estonian airspace is roughly between 22°E-28°E and 57°N-60°N
  const lons = coords.map(coord => coord[0]);
  const lats = coords.map(coord => coord[1]);
  const minLon = Math.min(...lons);
  const maxLon = Math.max(...lons);
  const minLat = Math.min(...lats);
  const maxLat = Math.max(...lats);

  if (minLon < 20 || maxLon > 30 || minLat < 55 || maxLat > 62) {
    issues.push(`EXTENT_SANITY: Feature ${feature.properties.designator} extent [${minLon},${minLat},${maxLon},${maxLat}] is outside plausible Estonian region`);
  }

  return feature;
}

/**
 * Generate GeoJSON FeatureCollection from parse results with validation
 */
export function generateGeoJson(result: ParseResult): string {
  // Validate all features
  const validatedFeatures = result.features.map(feature => validateGeometry(feature, result.issues));

  return JSON.stringify({
    type: 'FeatureCollection',
    features: validatedFeatures,
    metadata: {
      effectiveDate: result.effectiveDate,
      sourceUrl: result.sourceUrl,
      sha256: result.sha256,
      generatedAt: result.generatedAt,
      issues: result.issues,
      featureCount: validatedFeatures.length
    }
  }, null, 2);
}

/**
 * Fetch and parse eAIP ENR 5.1 page
 */
export async function fetchAndParseEaipEnr51(url: string): Promise<ParseResult> {
  try {
    const response = await fetch(url);
    const html = await response.text();
    
    return await parseEaipEnr51(html, url);
  } catch (error) {
    throw new Error(`Failed to fetch and parse eAIP ENR 5.1: ${error}`);
  }
}