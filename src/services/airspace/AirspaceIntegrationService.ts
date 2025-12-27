import { NormalizedNotam, NotamGeometry } from "../notam/notamTypes";
import { AirspaceFeature, EnhancedNotam } from "./airspaceTypes";
import { AirspaceLoader } from "./airspaceLoader";
import { NotamAirspaceIndex } from "../notam/NotamAirspaceIndex";

/**
 * Service to integrate eAIP airspace data with NOTAM visualization
 */
export class AirspaceIntegrationService {
  private airspaceIndex: NotamAirspaceIndex;
  private airspaceLoader: AirspaceLoader;
  private loadedDate: string | null = null;

  constructor() {
    this.airspaceIndex = new NotamAirspaceIndex();
    this.airspaceLoader = new AirspaceLoader();
  }

  /**
   * Load airspace data from the eAIP GeoJSON file
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
   * Load airspace data from a specific URL
   */
  async loadAirspaceDataFromUrl(url: string): Promise<void> {
    try {
      // Load airspace data using the loader
      const { features } = await this.airspaceLoader.loadAirspaceData(url);

      // Load the features into the index
      this.airspaceIndex.loadAirspaceData(features);
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
  setAirspaceData(airspaceFeatures: AirspaceFeature[], date: string) {
    this.airspaceIndex.loadAirspaceData(airspaceFeatures);
    this.loadedDate = date;
  }

  /**
   * Get the airspace index for direct access (if needed)
   */
  getAirspaceIndex(): NotamAirspaceIndex {
    return this.airspaceIndex;
  }
}