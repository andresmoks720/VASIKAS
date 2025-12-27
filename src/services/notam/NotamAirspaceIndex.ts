import { NormalizedNotam, NotamGeometry } from "./notamTypes";
import { AirspaceFeature, EnhancedNotam } from "../airspace/airspaceTypes";

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
            geometrySource: 'html', // Using HTML-derived airspace data
            geometrySourceDetails: {
              ...notam.geometrySourceDetails, // Preserve original source details
              sourceUrl: airspace.properties.sourceUrl,
              effectiveDate: airspace.properties.effectiveDate, // if available
              parserVersion: airspace.properties.parserInfo?.version,
              issues: []
            },
            issues: []
          };
        }
      }

      // If no matching airspace found, return original with no enhancement
      return {
        ...notam,
        enhancedGeometry: null,
        sourceGeometry: notam.geometry,
        geometrySource: notam.geometrySource, // Use the original geometry source
        geometrySourceDetails: notam.geometrySourceDetails, // Preserve original source details
        issues: notam.geometry ? [] : ['NO_GEOMETRY']
      };
    });
  }

  /**
   * Convert AirspaceGeometry to NotamGeometry format
   */
  private convertAirspaceToNotamGeometry(airspaceGeometry: import("../airspace/airspaceTypes").AirspaceGeometry): NotamGeometry | null {
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