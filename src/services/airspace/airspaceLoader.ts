import type { AirspaceFeature } from "./airspaceTypes";

// Version constant for the GeoJSON loader
export const GEOJSON_LOADER_VERSION = "1.0.0";
type AirspaceManifest = { effectiveDate: string };
type AirspaceMetadata = Record<string, unknown> & {
  latestManifest?: AirspaceManifest;
  latestManifestUrl?: string;
  effectiveDate?: string;
  loaderVersion?: string;
};

/**
 * Service to load airspace data from public or data-served GeoJSON
 */
export class AirspaceLoader {
  static readonly LATEST_MANIFEST_URL = "/data/airspace/ee/latest.json";

  private resolvePublicUrl(path: string): string {
    if (/^[a-z][a-z0-9+.-]*:/i.test(path) || path.startsWith("//")) {
      return path;
    }

    const baseUrl = import.meta.env.BASE_URL ?? "/";
    const normalizedBase = baseUrl.endsWith("/") ? baseUrl.slice(0, -1) : baseUrl;
    const normalizedPath = path.startsWith("/") ? path : `/${path}`;

    return `${normalizedBase}${normalizedPath}`;
  }

  private isValidEffectiveDate(value: unknown): value is string {
    return typeof value === "string" && /^\d{4}-\d{2}-\d{2}$/.test(value);
  }

  /**
   * Load airspace data from a GeoJSON endpoint
   * @param url The URL to the GeoJSON file (e.g., /data/airspace/ee/${date}/enr5_1.geojson)
   */
  async loadAirspaceData(url: string): Promise<{ features: AirspaceFeature[]; metadata?: AirspaceMetadata; sourceUrl?: string }> {
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
        sourceUrl: url,
        metadata: {
          ...geojsonData.metadata,
          loaderVersion: GEOJSON_LOADER_VERSION
        }
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
  async loadAirspaceByDate(effectiveDate: string): Promise<{ features: AirspaceFeature[]; metadata?: AirspaceMetadata; sourceUrl?: string }> {
    const url = this.resolvePublicUrl(`/data/airspace/ee/${effectiveDate}/enr5_1.geojson`);
    const result = await this.loadAirspaceData(url);

    // Add loader version to metadata
    return {
      features: result.features,
      sourceUrl: result.sourceUrl,
      metadata: {
        ...result.metadata,
        loaderVersion: GEOJSON_LOADER_VERSION,
        effectiveDate
      }
    };
  }

  /**
   * Load airspace data using the latest manifest pointer.
   */
  async loadLatestAirspace(manifestUrl: string = AirspaceLoader.LATEST_MANIFEST_URL): Promise<{
    features: AirspaceFeature[];
    metadata?: AirspaceMetadata;
    sourceUrl?: string;
  }> {
    const resolvedManifestUrl = this.resolvePublicUrl(manifestUrl);
    const response = await fetch(resolvedManifestUrl);

    if (!response.ok) {
      throw new Error(`Failed to load latest airspace manifest: ${response.status} ${response.statusText}`);
    }

    const manifest = await response.json() as { effectiveDate?: string };
    const effectiveDate = manifest.effectiveDate;
    if (!this.isValidEffectiveDate(effectiveDate)) {
      throw new Error("Invalid latest airspace manifest: missing effectiveDate");
    }

    const result = await this.loadAirspaceByDate(effectiveDate);

    return {
      features: result.features,
      sourceUrl: result.sourceUrl,
      metadata: {
        ...result.metadata,
        latestManifest: { effectiveDate },
        latestManifestUrl: resolvedManifestUrl,
      },
    };
  }

  /**
   * Get the URL for airspace data by effective date
   */
  getAirspaceUrl(effectiveDate: string): string {
    return this.resolvePublicUrl(`/data/airspace/ee/${effectiveDate}/enr5_1.geojson`);
  }
}
