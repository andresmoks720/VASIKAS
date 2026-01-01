import { NormalizedNotam, NotamGeometry } from "./notamTypes";
import { AirspaceFeature, AirspaceGeometry, EnhancedNotam } from "../airspace/airspaceTypes";

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
    return designator.toUpperCase().replace(/[\s\-_]+/g, '');
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
          const conversionIssues: string[] = [];
          const geometries = airspaces
            .map(a => {
              const result = this.convertAirspaceToNotamGeometry(a.geometry);
              if (result.issues) conversionIssues.push(...result.issues);
              return result.geometry;
            })
            .filter((g): g is NotamGeometry => g !== null);

          if (geometries.length > 0) {
            // If multiple geometries, merge into a MultiPolygon
            const combinedGeometry = this.mergeGeometries(geometries);
            const firstAirspace = airspaces[0]!;

            // Merge details: keep original issues if any, but mark enhancement success
            const enhancedIssues = [
              ...(airspaces.length > 1 ? [`MULTI_PART_AIRSPACE (${airspaces.length} parts)`] : [])
            ];

            return {
              ...notam,
              enhancedGeometry: combinedGeometry,
              sourceGeometry: notam.geometry, // Keep original geometry as fallback
              sourceGeometrySource: notam.geometrySource, // Track original source
              geometrySource: this.currentSourceType,
              geometrySourceDetails: {
                ...notam.geometrySourceDetails, // Preserve original source details (v1 parser info etc)
                source: this.currentSourceType,
                sourceUrl: firstAirspace.properties.sourceUrl,
                effectiveDate: this.currentEffectiveDate || firstAirspace.properties.effectiveDate,
                parserVersion: firstAirspace.properties.parserInfo?.version,
                issues: [...(notam.geometrySourceDetails?.issues || []), ...enhancedIssues, ...conversionIssues]
              },
              issues: []
            };
          } else {
            // Found matching airspace but could not convert geometry
            return {
              ...notam,
              enhancedGeometry: null,
              sourceGeometry: notam.geometry,
              geometrySource: notam.geometrySource, // Use original source
              geometrySourceDetails: {
                ...notam.geometrySourceDetails,
                source: notam.geometrySourceDetails?.source ?? 'none',
                issues: [...(notam.geometrySourceDetails?.issues || []), 'ENHANCEMENT_GEOMETRY_INVALID']
              },
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
  private convertAirspaceToNotamGeometry(airspaceGeometry: AirspaceGeometry): { geometry: NotamGeometry | null, issues?: string[] } {
    if (airspaceGeometry.type === 'Polygon') {
      return {
        geometry: {
          kind: 'polygon',
          rings: airspaceGeometry.coordinates
        }
      };
    } else if (airspaceGeometry.type === 'MultiPolygon') {
      return {
        geometry: {
          kind: 'multiPolygon',
          polygons: airspaceGeometry.coordinates
        }
      };
    }
    return {
      geometry: null,
      issues: [`UNSUPPORTED_AIRSPACE_GEOMETRY_TYPE: ${airspaceGeometry.type}`]
    };
  }

  /**
   * Extract designator from NOTAM text (e.g., "EER15D", "TSA 4A", "EED2", etc.)
   */
  private extractDesignator(text: string): string | null {
    // Look for patterns like EER15D, EED2, EEPxx, TSAxx, TRAxx, TMA 1, CTR TARTU, etc.
    // Handles optional spaces between prefix and ID
    // Broadened to include TMA, CTR, CTA, FIR, UIR, ADIZ
    const designatorRegex = /\b((?:EER|EED|EEP|EET|TSA|TRA|CBA|EEN|EEY|EEA|EEL|EEM|EEO|EES|EEV|TMA|CTR|CTA|FIR|UIR|ADIZ|EE[-_]?[RDP])\s*[A-Z0-9/-]+(?:\s+[A-Z0-9-]+)?)\b/gi;
    const matches = text.match(designatorRegex);

    if (matches) {
      // First try: exact matches (normalized)
      for (const match of matches) {
        const normalized = this.normalizeDesignator(match.trim());
        if (this.hasDesignator(normalized)) {
          return normalized;
        }
      }

      // Second try: handle multi-word matches (e.g. "TMA 1 ACTIVE" should try "TMA 1")
      for (const match of matches) {
        const parts = match.trim().split(/\s+/);
        if (parts.length > 1) {
          for (let i = parts.length - 1; i >= 1; i--) {
            const candidate = this.normalizeDesignator(parts.slice(0, i).join(' '));
            if (this.hasDesignator(candidate)) {
              return candidate;
            }
          }
        }
      }

      // Fallback: original logic for the first match if no index match found
      // Re-normalize to prefix only for the check if it's a multi-word match
      const firstPart = matches[0].trim().split(/\s+/)[0];
      const checkNormalized = this.normalizeDesignator(firstPart);
      if (/^(EER|EED|EEP|EET|TSA|TRA|CBA|EEN|EEY|EEA|EEL|EEM|EEO|EES|EEV|TMA|CTR|CTA|FIR|UIR|ADIZ|EE[-_]?[RDP])/i.test(checkNormalized)) {
        return this.normalizeDesignator(matches[0].trim());
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
