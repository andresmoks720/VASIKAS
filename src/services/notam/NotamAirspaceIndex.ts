import { NormalizedNotam, NotamGeometry } from "./notamTypes";

// Define the AirspaceFeature type since it's not imported from the right place
interface AirspaceCoordinate {
  lat: number;
  lon: number;
}

interface AirspaceGeometry {
  type: string;
  coordinates: number[][][]; // [lon, lat] pairs for polygon rings
}

interface AirspaceProperties {
  designator: string;
  name?: string;
  upperLimit: string;
  lowerLimit: string;
  remarks?: string;
  sourceUrl: string;
}

export interface AirspaceFeature {
  type: string;
  geometry: AirspaceGeometry;
  properties: AirspaceProperties;
}

/**
 * Combines eAIP airspace data with NOTAM data to provide enhanced visualization
 * Maps NOTAM designators to corresponding eAIP polygons when available
 */
export class NotamAirspaceIndex {
  private airspaceMap: Map<string, AirspaceFeature> = new Map();
  private readonly tolerance = 0.000001;

  constructor() {}

  /**
   * Load airspace data from eAIP GeoJSON
   */
  loadAirspaceData(features: AirspaceFeature[]) {
    this.airspaceMap.clear();

    for (const feature of features) {
      if (feature.properties.designator) {
        // Normalize designator (remove spaces, convert to uppercase)
        const normalizedDesignator = this.normalizeDesignator(feature.properties.designator);
        this.airspaceMap.set(normalizedDesignator, feature);
      }
    }
  }

  /**
   * Normalize designator for comparison (e.g., "EER15D" vs "EER 15D")
   */
  private normalizeDesignator(designator: string): string {
    return designator.toUpperCase().replace(/\s+/g, '');
  }

  /**
   * Find airspace polygon for a given designator
   */
  getAirspaceByDesignator(designator: string): AirspaceFeature | undefined {
    const normalized = this.normalizeDesignator(designator);
    return this.airspaceMap.get(normalized);
  }

  /**
   * Enhance NOTAMs with eAIP geometry when available
   */
  enhanceNotamsWithAirspace(notams: NormalizedNotam[]): EnhancedNotam[] {
    return notams.map(notam => {
      // Try to extract designator from NOTAM text
      const designator = this.extractDesignator(notam.text);

      if (designator) {
        const airspace = this.getAirspaceByDesignator(designator);
        if (airspace) {
          // Use eAIP geometry instead of or in addition to parsed geometry
          return {
            ...notam,
            enhancedGeometry: this.convertAirspaceToNotamGeometry(airspace.geometry),
            sourceGeometry: notam.geometry, // Keep original geometry as fallback
            geometrySource: 'eAIP',
            issues: []
          };
        }
      }

      // If no matching airspace found, return original with no enhancement
      return {
        ...notam,
        enhancedGeometry: null,
        sourceGeometry: notam.geometry,
        geometrySource: notam.geometry ? 'parsed' : 'none',
        issues: notam.geometry ? [] : ['NO_GEOMETRY']
      };
    });
  }

  /**
   * Convert AirspaceGeometry to NotamGeometry format
   */
  private convertAirspaceToNotamGeometry(airspaceGeometry: AirspaceGeometry): NotamGeometry | null {
    if (airspaceGeometry.type === 'Polygon') {
      return {
        kind: 'polygon',
        rings: airspaceGeometry.coordinates
      };
    } else if (airspaceGeometry.type === 'MultiPolygon') {
      return {
        kind: 'multiPolygon',
        polygons: airspaceGeometry.coordinates as [number, number][][][]
      };
    }
    return null;
  }

  /**
   * Extract designator from NOTAM text (e.g., "EER15D", "EED2", etc.)
   */
  private extractDesignator(text: string): string | null {
    // Look for patterns like EER15D, EED2, EEPxx, etc.
    const designatorRegex = /\b([A-Z]{2,3}\d+[A-Z]?)\b/gi;
    const matches = text.match(designatorRegex);

    if (matches) {
      // Return the first match that looks like a valid airspace designator
      for (const match of matches) {
        const normalized = this.normalizeDesignator(match.trim());
        // Validate that it's a known type (EER, EED, EEP, etc.)
        if (/^(EER|EED|EEP|EET)/i.test(normalized)) {
          return normalized;
        }
      }
    }

    return null;
  }

  /**
   * Get all available designators
   */
  getAvailableDesignators(): string[] {
    return Array.from(this.airspaceMap.keys());
  }

  /**
   * Check if a designator exists in the index
   */
  hasDesignator(designator: string): boolean {
    const normalized = this.normalizeDesignator(designator);
    return this.airspaceMap.has(normalized);
  }
}

/**
 * Enhanced NOTAM with additional geometry information
 */
export interface EnhancedNotam extends NormalizedNotam {
  /** Enhanced geometry from eAIP data when available */
  enhancedGeometry: NotamGeometry | null;
  /** Original geometry from NOTAM parsing */
  sourceGeometry: NotamGeometry | null;
  /** Source of the primary geometry ('eAIP', 'parsed', or 'none') */
  geometrySource: 'eAIP' | 'parsed' | 'none';
  /** Issues with geometry parsing or enhancement */
  issues: string[];
}