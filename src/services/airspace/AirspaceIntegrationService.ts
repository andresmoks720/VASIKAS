import { NormalizedNotam, NotamGeometry } from "../notam/notamTypes";
import { AirspaceFeature, EnhancedNotam } from "./airspaceTypes";
import { AirspaceLoader } from "./airspaceLoader";
import { NotamAirspaceIndex } from "../notam/NotamAirspaceIndex";
import { fetchEaipHtml } from "./airspaceHtmlClient";
import { parseEaipEnr51 } from "./runtimeHtmlParser";

/**
 * Service to integrate eAIP airspace data with NOTAM visualization
 */
export class AirspaceIntegrationService {
  private airspaceIndex: NotamAirspaceIndex;
  private airspaceLoader: AirspaceLoader;
  private loadedDate: string | null = null;
  private loadedSourceUrl: string | null = null;
  private loadedSourceType: 'html' | 'geojson' | null = null;
  private loadCache: Map<string, { features: AirspaceFeature[], effectiveDate?: string, timestamp: number }> = new Map();

  constructor() {
    this.airspaceIndex = new NotamAirspaceIndex();
    this.airspaceLoader = new AirspaceLoader();
  }

  /**
   * Load airspace data from eAIP HTML content (primary method)
   */
  async loadAirspaceFromHtml(): Promise<void> {
    try {
      // Fetch the HTML content
      const fetchResult = await fetchEaipHtml();

      // Check if we have a cached version for this source URL
      // Use a combined key of URL + first 8 chars of content hash if possible, 
      // but here we'll just check if content has changed.
      const contentHash = this.computeSimpleHash(fetchResult.html);
      const cacheKey = `${fetchResult.sourceUrl}_${contentHash}`;
      const cached = this.loadCache.get(cacheKey);

      if (cached) {
        // Use cached data if it's less than 1 hour old
        const ageMs = Date.now() - cached.timestamp;
        if (ageMs < 60 * 60 * 1000) { // 1 hour in milliseconds
          this.airspaceIndex.loadAirspaceData(cached.features, 'html', cached.effectiveDate || null);
          this.loadedSourceUrl = fetchResult.sourceUrl;
          this.loadedSourceType = 'html';
          this.loadedDate = cached.effectiveDate || null;
          return;
        }
      }

      // Parse the HTML content
      const parseResult = await parseEaipEnr51(fetchResult.html, fetchResult.sourceUrl);

      // Add parser version to the features
      for (const feature of parseResult.features) {
        if (!feature.properties.parserInfo) {
          feature.properties.parserInfo = {
            version: parseResult.parserVersion,
            source: 'html'
          };
        }
      }

      // Cache the parsed features
      this.loadCache.set(cacheKey, {
        features: parseResult.features,
        effectiveDate: parseResult.effectiveDate,
        timestamp: Date.now()
      });

      this.loadedSourceUrl = fetchResult.sourceUrl;
      this.loadedSourceType = 'html';
      this.loadedDate = parseResult.effectiveDate || null;

      // Load the features into the index
      this.airspaceIndex.loadAirspaceData(parseResult.features, 'html', this.loadedDate);
    } catch (error) {
      console.error("Failed to load airspace data from HTML:", error);
      throw error;
    }
  }

  private computeSimpleHash(str: string): string {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash; // Convert to 32bit integer
    }
    return Math.abs(hash).toString(36);
  }

  /**
   * Load airspace data from the eAIP GeoJSON file (fallback method)
   */
  async loadAirspaceData(effectiveDate: string): Promise<void> {
    try {
      // Load airspace data using the loader
      const { features, sourceUrl } = await this.airspaceLoader.loadAirspaceByDate(effectiveDate);

      // Load the features into the index
      this.airspaceIndex.loadAirspaceData(features, 'geojson', effectiveDate);

      this.loadedDate = effectiveDate;
      this.loadedSourceType = 'geojson';
      this.loadedSourceUrl = sourceUrl || `geojson://${effectiveDate}`;
    } catch (error) {
      console.error(`Failed to load airspace data for ${effectiveDate}:`, error);
      throw error;
    }
  }

  /**
   * Load airspace data from a specific URL (fallback method)
   */
  async loadAirspaceDataFromUrl(url: string): Promise<void> {
    try {
      // Load airspace data using the loader
      const { features } = await this.airspaceLoader.loadAirspaceData(url);

      // Load the features into the index
      this.airspaceIndex.loadAirspaceData(features, 'geojson', null); // URL implies potential GeoJSON fallback

      this.loadedSourceUrl = url;
      this.loadedSourceType = 'geojson';
      this.loadedDate = 'URL_LOAD';
    } catch (error) {
      console.error(`Failed to load airspace data from ${url}:`, error);
      throw error;
    }
  }

  /**
   * Enhance NOTAMs with eAIP geometry when available
   */
  enhanceNotams(notams: NormalizedNotam[]): EnhancedNotam[] {
    return this.airspaceIndex.enhanceNotamsWithAirspace(notams);
  }

  /**
   * Get available designators
   */
  getAvailableDesignators(): string[] {
    return this.airspaceIndex.getAvailableDesignators();
  }

  /**
   * Check if service has loaded data from HTML source
   */
  isLoadedFromHtml(): boolean {
    return this.loadedSourceType === 'html';
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
  setAirspaceData(airspaceFeatures: AirspaceFeature[], dateOrUrl: string) {
    this.airspaceIndex.loadAirspaceData(airspaceFeatures);
    // Determine if this is a date or URL
    if (dateOrUrl.includes('/')) {
      this.loadedSourceUrl = dateOrUrl;
      this.loadedSourceType = 'html'; // Heuristic
    } else {
      this.loadedDate = dateOrUrl;
      this.loadedSourceType = 'geojson';
    }
  }

  /**
   * Get the current source URL
   */
  getLoadedSourceUrl(): string | null {
    return this.loadedSourceUrl;
  }

  /**
   * Get the current effective date
   */
  getEffectiveDate(): string | null {
    return this.loadedDate;
  }

  /**
   * Get the current source type
   */
  getLoadedSourceType(): 'html' | 'geojson' | null {
    return this.loadedSourceType;
  }

  /**
   * Get comprehensive metadata about the loaded source
   */
  getLoadedMetadata() {
    return {
      sourceType: this.loadedSourceType,
      sourceUrl: this.loadedSourceUrl,
      effectiveDate: this.loadedDate,
      isLoaded: !!this.loadedSourceType
    };
  }

  /**
   * Get the airspace index for direct access (if needed)
   */
  getAirspaceIndex(): NotamAirspaceIndex {
    return this.airspaceIndex;
  }
}