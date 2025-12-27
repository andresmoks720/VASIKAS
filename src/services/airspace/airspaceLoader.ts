import type { AirspaceFeature } from "./airspaceTypes";

/**
 * Service to load airspace data from public or data-served GeoJSON
 */
export class AirspaceLoader {
  /**
   * Load airspace data from a GeoJSON endpoint
   * @param url The URL to the GeoJSON file (e.g., /data/airspace/ee/${date}/enr5_1.geojson)
   */
  async loadAirspaceData(url: string): Promise<{ features: AirspaceFeature[], metadata?: any }> {
    try {
      const response = await fetch(url);

      if (!response.ok) {
        throw new Error(`Failed to load airspace data: ${response.status} ${response.statusText}`);
      }

      const geojsonData = await response.json();

      if (!geojsonData.features || !Array.isArray(geojsonData.features)) {
        throw new Error('Invalid GeoJSON format: missing features array');
      }

      // Validate that features match the AirspaceFeature type
      const features = geojsonData.features as AirspaceFeature[];
      
      // Basic validation
      for (const feature of features) {
        if (!feature.properties || !feature.properties.designator) {
          console.warn('Airspace feature missing designator:', feature);
        }
      }

      return {
        features,
        metadata: geojsonData.metadata || undefined
      };
    } catch (error) {
      console.error(`Failed to load airspace data from ${url}:`, error);
      throw error;
    }
  }

  /**
   * Load airspace data by effective date
   * @param effectiveDate The date string in YYYY-MM-DD format
   */
  async loadAirspaceByDate(effectiveDate: string): Promise<{ features: AirspaceFeature[], metadata?: any }> {
    const url = `/data/airspace/ee/${effectiveDate}/enr5_1.geojson`;
    return this.loadAirspaceData(url);
  }

  /**
   * Get the URL for airspace data by effective date
   */
  getAirspaceUrl(effectiveDate: string): string {
    return `/data/airspace/ee/${effectiveDate}/enr5_1.geojson`;
  }
}