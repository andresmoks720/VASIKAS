import { NormalizedNotam, NotamGeometry } from "./notamTypes";
import { AirspaceFeature, EnhancedNotam } from "../airspace/airspaceTypes";

/**
 * Combines eAIP airspace data with NOTAM data to provide enhanced visualization
 * Maps NOTAM designators to corresponding eAIP polygons when available
 */
export class NotamAirspaceIndex {
  private airspaceMap: Map<string, AirspaceFeature[]> = new Map();
  private readonly tolerance = 0.000001;
  private currentSourceType: 'html' | 'geojson' | 'notamText' | 'none' = 'none';
  private currentEffectiveDate: string | null = null;

  constructor() { }

  /**
   * Load airspace data from eAIP GeoJSON or HTML
   */
  loadAirspaceData(features: AirspaceFeature[], sourceType: 'html' | 'geojson' = 'geojson', effectiveDate: string | null = null) {
    this.airspaceMap.clear();
    this.currentSourceType = sourceType;
    this.currentEffectiveDate = effectiveDate;

    for (const feature of features) {
      if (feature.properties.designator) {
        // Normalize designator (remove spaces, convert to uppercase)
        const normalizedDesignator = this.normalizeDesignator(feature.properties.designator);
        const existing = this.airspaceMap.get(normalizedDesignator) || [];
        existing.push(feature);
        this.airspaceMap.set(normalizedDesignator, existing);
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
   * Find airspace polygons for a given designator
   */
  getAirspaceByDesignator(designator: string): AirspaceFeature[] {
    const normalized = this.normalizeDesignator(designator);
    return this.airspaceMap.get(normalized) || [];
  }

  /**
   * Enhance NOTAMs with eAIP geometry when available
   */
  enhanceNotamsWithAirspace(notams: NormalizedNotam[]): EnhancedNotam[] {
    return notams.map(notam => {
      // Try to extract designator from NOTAM text
      const designator = this.extractDesignator(notam.text);

      if (designator) {
        const airspaces = this.getAirspaceByDesignator(designator);
        if (airspaces.length > 0) {
          const geometries = airspaces
            .map(a => this.convertAirspaceToNotamGeometry(a.geometry))
            .filter((g): g is NotamGeometry => g !== null);

          if (geometries.length > 0) {
            // If multiple geometries, merge into a MultiPolygon (or just pick the first if it's already one)
            const combinedGeometry = this.mergeGeometries(geometries);
            const firstAirspace = airspaces[0]!;

            return {
              ...notam,
              enhancedGeometry: combinedGeometry,
              sourceGeometry: notam.geometry, // Keep original geometry as fallback
              geometrySource: this.currentSourceType,
              geometrySourceDetails: {
                ...notam.geometrySourceDetails, // Preserve original source details
                source: this.currentSourceType,
                sourceUrl: firstAirspace.properties.sourceUrl,
                effectiveDate: this.currentEffectiveDate || firstAirspace.properties.effectiveDate,
                parserVersion: firstAirspace.properties.parserInfo?.version,
                issues: airspaces.length > 1 ? [`MULTI_PART_AIRSPACE (${airspaces.length} parts)`] : []
              },
              issues: []
            };
          } else {
            // Found matching airspace but could not convert geometry
            return {
              ...notam,
              enhancedGeometry: null,
              sourceGeometry: notam.geometry,
              geometrySource: notam.geometrySource,
              geometrySourceDetails: notam.geometrySourceDetails,
              issues: ['ENHANCEMENT_GEOMETRY_INVALID', ...(notam.geometry ? [] : ['NO_GEOMETRY'])]
            };
          }
        }
      }

      // If no matching airspace found, or designator missing, return original with no enhancement
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
   * Merge multiple NotamGeometry objects into one
   */
  private mergeGeometries(geometries: NotamGeometry[]): NotamGeometry {
    if (geometries.length === 1) return geometries[0];

    const polygons: [number, number][][][] = [];

    for (const geom of geometries) {
      if (!geom) continue;
      if (geom.kind === 'polygon') {
        polygons.push(geom.rings);
      } else if (geom.kind === 'multiPolygon') {
        polygons.push(...geom.polygons);
      }
      // Circles are not currently supported for merging into polygons here
    }

    if (polygons.length === 0) return null;
    if (polygons.length === 1) return { kind: 'polygon', rings: polygons[0]! };

    return {
      kind: 'multiPolygon',
      polygons
    };
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
    const designatorRegex = /\b((?:EER|EED|EEP|EET)\d+[A-Z]?)\b/gi;
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