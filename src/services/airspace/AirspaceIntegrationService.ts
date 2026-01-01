import { NormalizedNotam } from "../notam/notamTypes";
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
  private loadHtmlPromise: Promise<void> | null = null;

  constructor() {
    this.airspaceIndex = new NotamAirspaceIndex();
    this.airspaceLoader = new AirspaceLoader();
  }

  /**
   * Load airspace data from eAIP HTML content (primary method)
   */
  async loadAirspaceFromHtml(autoDiscover: boolean = false): Promise<void> {
    if (this.loadHtmlPromise) {
      return this.loadHtmlPromise;
    }

    this.loadHtmlPromise = (async () => {
      try {
        // Get the target URL from env (same as fetchEaipHtml uses)
        const { ENV } = await import("@/shared/env");
        const targetUrl = ENV.airspace.eaipEnr51Url();

        if (targetUrl && !autoDiscover) {
          // Find if we have any cached data for this URL that is fresh
          for (const [key, cached] of this.loadCache.entries()) {
            if (key.startsWith(targetUrl)) {
              const ageMs = Date.now() - cached.timestamp;
              if (ageMs < 60 * 60 * 1000) { // 1 hour in milliseconds
                // Found fresh cached data for this URL
                this.airspaceIndex.loadAirspaceData(cached.features, 'html', cached.effectiveDate || null);
                this.loadedSourceUrl = targetUrl;
                this.loadedSourceType = 'html';
                this.loadedDate = cached.effectiveDate || null;
                return;
              }
            }
          }
        }

        // Fetch the HTML content if no fresh cache found
        const fetchResult = await fetchEaipHtml({ autoDiscover });

        // Check if we have a cached version for this source URL + content hash
        const contentHash = this.computeSimpleHash(fetchResult.html);
        const cacheKey = `${fetchResult.sourceUrl}_${contentHash}`;
        const cached = this.loadCache.get(cacheKey);

        if (cached) {
          // Use cached data if it's less than 1 hour old
          const ageMs = Date.now() - cached.timestamp;
          if (ageMs < 60 * 60 * 1000) {
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
              version: parseResult.parserVersion || '1.0.0',
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
    })();

    try {
      await this.loadHtmlPromise;
    } finally {
      this.loadHtmlPromise = null;
    }
  }

  private computeSimpleHash(str: string): string {
    const sanitized = this.sanitizeHtmlForHashing(str);
    let hash = 0;
    for (let i = 0; i < sanitized.length; i++) {
      const char = sanitized.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash; // Convert to 32bit integer
    }
    return Math.abs(hash).toString(36);
  }

  /**
   * Remove dynamic content from HTML for more stable caching
   */
  private sanitizeHtmlForHashing(html: string): string {
    // Remove common dynamic patterns in eAIP HTML
    return html
      .replace(/Generated at:?\s*[^<]*/gi, '')
      .replace(/Report Date:?\s*[^<]*/gi, '')
      .replace(/Effective Date:?\s*[^<]*/gi, '')
      .replace(/\d{10,}/g, 'TS'); // Replace long timestamps
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
      const { features, sourceUrl } = await this.airspaceLoader.loadAirspaceData(url);

      // Load the features into the index
      this.airspaceIndex.loadAirspaceData(features, 'geojson', null); // URL implies potential GeoJSON fallback

      this.loadedSourceUrl = sourceUrl || url;
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

    // Determine if this is a date or URL more robustly
    const isUrl = dateOrUrl.startsWith('http://') || dateOrUrl.startsWith('https://') || dateOrUrl.includes('://') || dateOrUrl.startsWith('/');
    const isDate = /^\d{4}-\d{2}-\d{2}$/.test(dateOrUrl);

    if (isUrl) {
      this.loadedSourceUrl = dateOrUrl;
      // Heuristic: if it ends with .geojson or contains /data/, it's likely geojson
      if (dateOrUrl.toLowerCase().endsWith('.geojson') || dateOrUrl.includes('/data/')) {
        this.loadedSourceType = 'geojson';
      } else {
        this.loadedSourceType = 'html';
      }
    } else if (isDate) {
      this.loadedDate = dateOrUrl;
      this.loadedSourceType = 'geojson';
    } else {
      // Fallback if neither matches clearly
      this.loadedSourceUrl = dateOrUrl;
      this.loadedSourceType = 'html';
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

/**
 * Shared instance of AirspaceIntegrationService to ensure caching across components
 */
export const airspaceIntegrationService = new AirspaceIntegrationService();
