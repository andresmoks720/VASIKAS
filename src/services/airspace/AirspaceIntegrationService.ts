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
  private loadCache: Map<string, { features: AirspaceFeature[], timestamp: number }> = new Map();

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
      const cacheKey = `${fetchResult.sourceUrl}_${fetchResult.fetchedAtUtc.split('T')[0]}`; // Cache by source URL and date
      const cached = this.loadCache.get(cacheKey);

      if (cached) {
        // Use cached data if it's less than 1 hour old
        const ageMs = Date.now() - cached.timestamp;
        if (ageMs < 60 * 60 * 1000) { // 1 hour in milliseconds
          this.airspaceIndex.loadAirspaceData(cached.features);
          this.loadedSourceUrl = fetchResult.sourceUrl;
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
        timestamp: Date.now()
      });

      // Load the features into the index
      this.airspaceIndex.loadAirspaceData(parseResult.features);

      this.loadedSourceUrl = fetchResult.sourceUrl;
    } catch (error) {
      console.error("Failed to load airspace data from HTML:", error);
      throw error;
    }
  }

  /**
   * Load airspace data from the eAIP GeoJSON file (fallback method)
   */
  async loadAirspaceData(effectiveDate: string): Promise<void> {
    try {
      // Load airspace data using the loader
      const { features } = await this.airspaceLoader.loadAirspaceByDate(effectiveDate);

      // Load the features into the index
      this.airspaceIndex.loadAirspaceData(features);

      this.loadedDate = effectiveDate;
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
      this.airspaceIndex.loadAirspaceData(features);

      this.loadedSourceUrl = url;
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
    return this.loadedSourceUrl !== null;
  }

  /**
   * Check if service has loaded data for a specific date
   */
  isLoadedForDate(date: string): boolean {
    // We can't directly check if the index has data for a specific date,
    // but we can check if we have loaded data at all
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
    } else {
      this.loadedDate = dateOrUrl;
    }
  }

  /**
   * Get the airspace index for direct access (if needed)
   */
  getAirspaceIndex(): NotamAirspaceIndex {
    return this.airspaceIndex;
  }
}