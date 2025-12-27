import type { AirspaceFeature } from "./airspaceTypes";

/**
 * Runtime service to fetch and parse eAIP HTML data for airspace geometry
 */
export class AirspaceHtmlService {
  /**
   * Fetches eAIP HTML content from the configured URL
   */
  async fetchEaipHtml(): Promise<{ html: string; sourceUrl: string; fetchedAtUtc: string }> {
    // Get the URL from environment variables
    const url = import.meta.env.VITE_EAIP_ENR51_URL as string;
    
    if (!url) {
      throw new Error("VITE_EAIP_ENR51_URL environment variable is not set");
    }

    try {
      const response = await fetch(url);
      
      if (!response.ok) {
        throw new Error(`Failed to fetch eAIP HTML: ${response.status} ${response.statusText}`);
      }
      
      const html = await response.text();
      
      return {
        html,
        sourceUrl: url,
        fetchedAtUtc: new Date().toISOString(),
      };
    } catch (error) {
      console.error(`Failed to fetch eAIP HTML from ${url}:`, error);
      throw error;
    }
  }

  /**
   * Parses eAIP HTML content into AirspaceFeatures
   */
  async parseEaipHtml(html: string, sourceUrl: string): Promise<{
    features: AirspaceFeature[];
    issues: string[];
    metadata: {
      sourceUrl: string;
      effectiveDate?: string;
      generatedAt: string;
      featureCount: number;
    };
  }> {
    // Import the HTML parser from the tools module (this will be the shared parser logic)
    const { parseEaipEnr51 } = await import("../../tools/eaip-import/src/parser");
    
    try {
      // Parse the HTML content using the shared parser
      const parseResult = await parseEaipEnr51(html, sourceUrl);
      
      return {
        features: parseResult.features as AirspaceFeature[],
        issues: parseResult.issues || [],
        metadata: {
          sourceUrl,
          effectiveDate: parseResult.effectiveDate,
          generatedAt: new Date().toISOString(),
          featureCount: parseResult.features.length,
        }
      };
    } catch (error) {
      console.error("Failed to parse eAIP HTML:", error);
      throw error;
    }
  }

  /**
   * Fetches and parses eAIP HTML in one operation
   */
  async fetchAndParseEaipHtml(): Promise<{
    features: AirspaceFeature[];
    issues: string[];
    metadata: {
      sourceUrl: string;
      effectiveDate?: string;
      fetchedAtUtc: string;
      featureCount: number;
    };
  }> {
    const fetchResult = await this.fetchEaipHtml();
    const parseResult = await this.parseEaipHtml(fetchResult.html, fetchResult.sourceUrl);
    
    return {
      features: parseResult.features,
      issues: parseResult.issues,
      metadata: {
        ...parseResult.metadata,
        fetchedAtUtc: fetchResult.fetchedAtUtc,
      }
    };
  }
}