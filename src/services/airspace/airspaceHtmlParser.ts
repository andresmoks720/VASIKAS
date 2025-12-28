import type { AirspaceFeature } from "./airspaceTypes";

/**
 * Wrapper for the HTML parser that converts eAIP HTML to AirspaceFeatures
 */
export async function parseEaipHtml(html: string, sourceUrl: string): Promise<{
  features: AirspaceFeature[];
  issues: string[];
  metadata: {
    sourceUrl: string;
    effectiveDate?: string;
    generatedAt: string;
    featureCount: number;
  };
}> {
  // Dynamically import the parser from the tools module to avoid bundling it in the runtime unnecessarily
  const { parseEaipEnr51 } = await import("../../../tools/eaip-import/src/parser");

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