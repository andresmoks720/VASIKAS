import { NormalizedNotam, NotamGeometry } from "../notam/notamTypes";

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
 * Service to integrate eAIP airspace data with NOTAM visualization
 */
export class AirspaceIntegrationService {
  private airspaceData: Map<string, AirspaceFeature> = new Map();
  private loadedDate: string | null = null;

  /**
   * Load airspace data from the eAIP GeoJSON file
   */
  async loadAirspaceData(effectiveDate: string): Promise<void> {
    try {
      // Construct the path to the eAIP data
      const filePath = `../../../data/airspace/ee/${effectiveDate}/enr5_1.geojson`;

      // In a real implementation, we would load the file from the path
      // For now, we'll simulate loading by creating a mock loader
      console.log(`Loading airspace data for date: ${effectiveDate}`);

      // This would be replaced with actual file loading logic
      // const data = await fs.promises.readFile(filePath, 'utf-8');
      // const geojsonData = JSON.parse(data);

      // For demonstration purposes, we'll use an empty map
      this.loadedDate = effectiveDate;
    } catch (error) {
      console.error(`Failed to load airspace data for ${effectiveDate}:`, error);
      throw error;
    }
  }

  /**
   * Enhance NOTAMs with eAIP geometry when available
   */
  enhanceNotams(notams: NormalizedNotam[]): EnhancedNotam[] {
    return notams.map(notam => {
      // Extract designator from NOTAM text (look for patterns like EER15D, EED2, etc.)
      const designator = this.extractDesignator(notam.text);
      
      if (designator && this.airspaceData.has(designator)) {
        const airspaceFeature = this.airspaceData.get(designator)!;
        
        // Use the eAIP geometry instead of the parsed geometry
        const enhancedGeometry = this.convertAirspaceGeometry(airspaceFeature.geometry);
        
        return {
          ...notam,
          enhancedGeometry,
          sourceGeometry: notam.geometry, // Keep original as fallback
          geometrySource: 'eAIP',
          issues: []
        };
      }
      
      // If no matching airspace found, return original with no enhancement
      return {
        ...notam,
        enhancedGeometry: notam.geometry, // Use original if no enhancement
        sourceGeometry: notam.geometry,
        geometrySource: notam.geometry ? 'parsed' : 'none',
        issues: notam.geometry ? [] : ['NO_GEOMETRY']
      };
    });
  }

  /**
   * Extract designator from NOTAM text
   */
  private extractDesignator(text: string): string | null {
    // Look for patterns like EER15D, EED2, etc.
    const designatorRegex = /\b(EER\d+[A-Z]?|EED\d+[A-Z]?|EEP\d+[A-Z]?|EET\d+[A-Z]?)\b/gi;
    const matches = text.match(designatorRegex);
    
    if (matches) {
      // Return the first match in uppercase without spaces
      return matches[0].toUpperCase().replace(/\s+/g, '');
    }
    
    return null;
  }

  /**
   * Convert airspace geometry to NOTAM geometry format
   */
  private convertAirspaceGeometry(airspaceGeometry: AirspaceGeometry): NotamGeometry | null {
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
   * Get available designators
   */
  getAvailableDesignators(): string[] {
    return Array.from(this.airspaceData.keys());
  }

  /**
   * Check if service has loaded data for a specific date
   */
  isLoadedForDate(date: string): boolean {
    return this.loadedDate === date;
  }

  /**
   * Set airspace data directly (for testing or external loading)
   */
  setAirspaceData(airspaceFeatures: AirspaceFeature[], date: string) {
    this.airspaceData.clear();
    for (const feature of airspaceFeatures) {
      if (feature.properties.designator) {
        const normalizedDesignator = this.normalizeDesignator(feature.properties.designator);
        this.airspaceData.set(normalizedDesignator, feature);
      }
    }
    this.loadedDate = date;
  }

  /**
   * Normalize designator for comparison
   */
  private normalizeDesignator(designator: string): string {
    return designator.toUpperCase().replace(/\s+/g, '');
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