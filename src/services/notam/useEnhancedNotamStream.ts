import { useState, useEffect, useCallback, useMemo } from "react";
import { useNotamStream } from "./notamStream";
import { EnhancedNotam } from "../airspace/airspaceTypes";
import { AirspaceIntegrationService } from "../airspace/AirspaceIntegrationService";
import { NormalizedNotam } from "./notamTypes";

/**
 * Hook that provides NOTAMs enhanced with eAIP airspace geometry
 */
export function useEnhancedNotamStream() {
  const { data: notams, ...notamStream } = useNotamStream();
  const [enhancedData, setEnhancedData] = useState<EnhancedNotam[] | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  // Initialize the airspace integration service
  const airspaceService = useMemo(() => new AirspaceIntegrationService(), []);

  useEffect(() => {
    async function enhanceNotams() {
      if (!notams || notams.length === 0) {
        setEnhancedData([]);
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);

        let effectiveDate: string | null = null;

        // Try to load airspace data from HTML first (primary method)
        try {
          await airspaceService.loadAirspaceFromHtml();
          // If HTML loading succeeded, we need to determine the effective date
          // For now, use current date - in a real implementation this would come from the HTML
          effectiveDate = new Date().toISOString().split('T')[0];
        } catch (htmlError) {
          console.warn("Failed to load airspace data from HTML, falling back to GeoJSON:", htmlError);

          // Fallback to GeoJSON loading
          try {
            // Get the effective date from the environment or derive it from the current date
            // For now, we'll use a placeholder date - in a real implementation,
            // this would come from the eAIP history page
            effectiveDate = "2025-10-30"; // Placeholder - should be dynamic

            // Load airspace data if not already loaded for this date
            if (!airspaceService.isLoadedForDate(effectiveDate)) {
              await airspaceService.loadAirspaceData(effectiveDate);
            }
          } catch (geojsonError) {
            console.error("Failed to load airspace data from both HTML and GeoJSON sources:", geojsonError);
            throw geojsonError;
          }
        }

        // Enhance the NOTAMs with eAIP geometry
        const enhanced = airspaceService.enhanceNotams(notams);

        // Attach source metadata to enhanced NOTAMs
        const enhancedWithMetadata = enhanced.map(notam => {
          // If geometry came from HTML source, attach the HTML source details
          if (notam.geometrySource === 'html' && notam.enhancedGeometry) {
            return {
              ...notam,
              geometrySource: 'html',
              geometrySourceDetails: {
                ...notam.geometrySourceDetails,
                sourceUrl: effectiveDate ? `https://eaip.eans.ee/current/html/eAIP/ENR-5.1-en-GB.html?date=${effectiveDate}` : undefined,
                parserVersion: '1.0',
                effectiveDate: effectiveDate,
              }
            };
          }

          // If geometry came from GeoJSON source
          if (notam.geometrySource === 'geojson' && notam.enhancedGeometry) {
            return {
              ...notam,
              geometrySource: 'geojson',
              geometrySourceDetails: {
                ...notam.geometrySourceDetails,
                sourceUrl: effectiveDate ? `/data/airspace/ee/${effectiveDate}/enr5_1.geojson` : undefined,
                parserVersion: '1.0',
                effectiveDate: effectiveDate,
              }
            };
          }

          // For fallback to original NOTAM text parsing
          return {
            ...notam,
            geometrySource: notam.geometrySource, // Use the original geometry source
            geometrySourceDetails: notam.geometrySourceDetails // Use the original source details
          };
        });
        setEnhancedData(enhancedWithMetadata);
      } catch (err) {
        console.error("Failed to enhance NOTAMs with airspace data:", err);
        setError(err instanceof Error ? err : new Error(String(err)));
        // Still return original NOTAMs if enhancement fails
        setEnhancedData(notams.map(notam => ({
          ...notam,
          enhancedGeometry: notam.geometry,
          sourceGeometry: notam.geometry,
          geometrySource: notam.geometrySource,
          issues: notam.geometry ? [] : ['NO_GEOMETRY']
        })));
      } finally {
        setIsLoading(false);
      }
    }

    enhanceNotams();
  }, [notams, airspaceService]);

  return {
    data: enhancedData,
    isLoading,
    error,
    ...notamStream
  };
}