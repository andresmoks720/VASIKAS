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
  const [effectiveDate, setEffectiveDate] = useState<string | null>(null);

  // Initialize the airspace integration service
  const airspaceService = useMemo(() => new AirspaceIntegrationService(), []);

  useEffect(() => {
    async function enhanceNotams() {
      if (!notams || notams.length === 0) {
        setEnhancedData([]);
        setIsLoading(false);
        setEffectiveDate(null);
        return;
      }

      try {
        setIsLoading(true);
        setError(null); // Clear previous errors

        // Try to load airspace data from HTML first (primary method)
        try {
          await airspaceService.loadAirspaceFromHtml();
        } catch (htmlError) {
          console.warn("Failed to load airspace data from HTML, falling back to GeoJSON:", htmlError);

          // Fallback to GeoJSON loading
          try {
            // Use current date as fallback for GeoJSON if not specified
            const fallbackDate = new Date().toISOString().split('T')[0];

            // Load airspace data if not already loaded
            if (!airspaceService.isLoadedForDate(fallbackDate)) {
              await airspaceService.loadAirspaceData(fallbackDate);
            }
          } catch (geojsonError) {
            console.error("Failed to load airspace data from both HTML and GeoJSON sources:", geojsonError);
            throw geojsonError;
          }
        }

        // Enhance the NOTAMs with eAIP geometry
        const enhanced = airspaceService.enhanceNotams(notams);
        const sourceUrl = airspaceService.getLoadedSourceUrl();
        const sourceType = airspaceService.getLoadedSourceType();
        const effective = airspaceService.getEffectiveDate();
        setEffectiveDate(effective);

        // Further enrich with URL if needed
        const enriched = enhanced.map(notam => {
          if (notam.enhancedGeometry && notam.geometrySourceDetails) {
            let finalUrl = notam.geometrySourceDetails.sourceUrl;
            if (!finalUrl && sourceType === 'html') {
              // Only construct URL if we have a real effective date from HTML
              const dateParam = effective || new Date().toISOString().split('T')[0];
              finalUrl = `https://eaip.eans.ee/current/html/eAIP/ENR-5.1-en-GB.html?date=${dateParam}`;
            } else if (!finalUrl) {
              finalUrl = sourceUrl || undefined;
            }

            return {
              ...notam,
              geometrySourceDetails: {
                ...notam.geometrySourceDetails,
                sourceUrl: finalUrl
              }
            };
          }
          return notam;
        });

        setEnhancedData(enriched);
      } catch (err) {
        const error = err instanceof Error ? err : new Error(String(err));
        console.error("Failed to enhance NOTAMs with airspace data:", error);
        setError(error);

        // Still return original NOTAMs if enhancement fails, but mark why
        const failureReason = error.message.includes('fetch') ? 'FETCH_FAILED' : 'ENHANCEMENT_FAILED';

        setEnhancedData(notams.map(notam => ({
          ...notam,
          enhancedGeometry: null,
          sourceGeometry: notam.geometry,
          geometrySource: notam.geometrySource,
          issues: [failureReason, ...(notam.geometry ? [] : ['NO_GEOMETRY'])]
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
    effectiveDate,
    ...notamStream
  };
}