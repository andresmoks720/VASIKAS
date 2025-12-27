/**
 * Parser for eAIP ENR 5.1 HTML content to extract airspace features
 * This is a tooling-only module - do not import into runtime code
 */

import * as cheerio from 'cheerio';
import type { AirspaceFeature } from './airspaceTypes';

// Define types for internal parsing
interface AirspaceCoordinate {
  lat: number;
  lon: number;
}

interface RawAirspaceFeature {
  designator: string;
  coordinates: AirspaceCoordinate[];
  upperLimit: string;
  lowerLimit: string;
  remarks?: string;
}

/**
 * Parse eAIP ENR 5.1 HTML content into AirspaceFeatures
 */
export async function parseEaipEnr51(html: string, sourceUrl: string): Promise<{
  features: AirspaceFeature[];
  issues: string[];
  effectiveDate?: string;
  sourceUrl: string;
  generatedAt: string;
}> {
  const $ = cheerio.load(html);
  const issues: string[] = [];
  const features: AirspaceFeature[] = [];

  // Extract effective date from meta tags or page content
  let effectiveDate: string | undefined;
  const effectiveDateMeta = $('meta[name="EM.effectiveDateStart"]').attr('content');
  if (effectiveDateMeta) {
    effectiveDate = effectiveDateMeta;
  }

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
    // Look for patterns like "DDMMSSN DDDMMSSE - DDMMSSN DDDMMSSE"
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
      if (Math.abs(firstPoint[0] - lastPoint[0]) > tolerance ||
          Math.abs(firstPoint[1] - lastPoint[1]) > tolerance) {
        // Add the first point to the end to close the ring
        coordinates.push(firstPoint);
      }
    }

    // Convert to [lon, lat] format for GeoJSON (OpenLayers expects lon-first for EPSG:4326)
    const geoJsonCoordinates = coordinates;

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
    generatedAt: new Date().toISOString()
  };
}

/**
 * Parse coordinate chain from text like "591633N 0261500E - 591639N 0255647E - ..."
 */
export function parseCoordinateChain(coordText: string): [number, number][] | null {
  // Split by " - " to get individual coordinate pairs
  const coordPairs = coordText.split(' - ');

  const coordinates: [number, number][] = [];

  for (const pair of coordPairs) {
    const trimmed = pair.trim();

    // Match pattern like "591633N 0261500E" (DDMMSSN DDDMMSSEx)
    const match = trimmed.match(/(\d{6})([NS])\s+(\d{6,7})([EW])/);
    if (!match) {
      // Try to match just a single coordinate (without space between lat and lon)
      const singleMatch = trimmed.match(/(\d{6})([NS])(\d{6,7})([EW])/);
      if (!singleMatch) {
        return null; // Invalid format
      }

      // Parse the single coordinate format (e.g., "591633N0261500E")
      const [, latDMS, latDir, lonDMS, lonDir] = singleMatch;

      // Parse latitude: DD MM SS
      const latDeg = parseInt(latDMS.substring(0, 2), 10);
      const latMin = parseInt(latDMS.substring(2, 4), 10);
      const latSec = parseInt(latDMS.substring(4, 6), 10);
      let lat = latDeg + latMin / 60 + latSec / 3600;
      if (latDir === 'S') {
        lat = -lat;
      }

      // Parse longitude: DDD MM SS (or DDDD MM SS)
      let lonDeg: number;
      let lonMin: number;
      let lonSec: number;

      if (lonDMS.length === 6) {
        // Format: DDD MM SS (3 digits for degrees)
        lonDeg = parseInt(lonDMS.substring(0, 3), 10);
        lonMin = parseInt(lonDMS.substring(3, 5), 10);
        lonSec = parseInt(lonDMS.substring(5, 7), 10);
      } else if (lonDMS.length === 7) {
        // For Estonian coordinates, format is still DDD MM SS with leading zero (0DDD MM SS)
        // So 7 digits means 3 digits for degrees with leading zero, 2 for minutes, 2 for seconds
        lonDeg = parseInt(lonDMS.substring(0, 3), 10);
        lonMin = parseInt(lonDMS.substring(3, 5), 10);
        lonSec = parseInt(lonDMS.substring(5, 7), 10);
      } else {
        return null; // Invalid longitude format
      }

      let lon = lonDeg + lonMin / 60 + lonSec / 3600;
      if (lonDir === 'W') {
        lon = -lon;
      }

      coordinates.push([lon, lat]);
    } else {
      // Parse the coordinate pair format (e.g., "591633N 0261500E")
      const [, latDMS, latDir, lonDMS, lonDir] = match;

      // Parse latitude: DD MM SS
      const latDeg = parseInt(latDMS.substring(0, 2), 10);
      const latMin = parseInt(latDMS.substring(2, 4), 10);
      const latSec = parseInt(latDMS.substring(4, 6), 10);
      let lat = latDeg + latMin / 60 + latSec / 3600;
      if (latDir === 'S') {
        lat = -lat;
      }

      // Parse longitude: DDD MM SS (or DDDD MM SS)
      let lonDeg: number;
      let lonMin: number;
      let lonSec: number;

      if (lonDMS.length === 6) {
        // Format: DDD MM SS (3 digits for degrees)
        lonDeg = parseInt(lonDMS.substring(0, 3), 10);
        lonMin = parseInt(lonDMS.substring(3, 5), 10);
        lonSec = parseInt(lonDMS.substring(5, 7), 10);
      } else if (lonDMS.length === 7) {
        // For Estonian coordinates, format is still DDD MM SS with leading zero (0DDD MM SS)
        // So 7 digits means 3 digits for degrees with leading zero, 2 for minutes, 2 for seconds
        lonDeg = parseInt(lonDMS.substring(0, 3), 10);
        lonMin = parseInt(lonDMS.substring(3, 5), 10);
        lonSec = parseInt(lonDMS.substring(5, 7), 10);
      } else {
        return null; // Invalid longitude format
      }

      let lon = lonDeg + lonMin / 60 + lonSec / 3600;
      if (lonDir === 'W') {
        lon = -lon;
      }

      coordinates.push([lon, lat]);
    }
  }

  return coordinates;
}