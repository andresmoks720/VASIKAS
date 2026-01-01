import { useState, useEffect } from "react";
import { useNotamStream } from "./notamStream";
import { EnhancedNotam } from "../airspace/airspaceTypes";
import { airspaceIntegrationService } from "../airspace/AirspaceIntegrationService";

/**
 * Hook that provides NOTAMs enhanced with eAIP airspace geometry
 */
export function useEnhancedNotamStream() {
  const { data: notams, ...notamStream } = useNotamStream();
  const [enhancedData, setEnhancedData] = useState<EnhancedNotam[] | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [effectiveDate, setEffectiveDate] = useState<string | null>(null);
  const [lastFetchErrorTime, setLastFetchErrorTime] = useState<number>(0);

  const FETCH_COOLDOWN_MS = 5 * 60 * 1000; // 5 minutes cooldown on error

  // Use the shared airspace integration service
  const airspaceService = airspaceIntegrationService;

  useEffect(() => {
    async function enhanceNotams() {
      if (!notams || notams.length === 0) {
        setEnhancedData([]);
        setIsLoading(false);
        // Do not clear effectiveDate or metadata here if we already have it
        // This allows the UI to still show "Data Loaded" status for current cycle
        return;
      }

      try {
        // Skip enhancement if we're in a cooldown after an error
        const now = Date.now();
        if (lastFetchErrorTime > 0 && now - lastFetchErrorTime < FETCH_COOLDOWN_MS) {
          // If we already have some data (even if old), keep it. 
          // If we have nothing, we should still try to show original NOTAMs.
          if (!enhancedData) {
            setEnhancedData(notams.map(notam => ({
              ...notam,
              enhancedGeometry: null,
              sourceGeometry: notam.geometry,
              geometrySource: notam.geometrySource,
              geometrySourceDetails: notam.geometrySourceDetails,
              issues: ['ENHANCEMENT_COOLDOWN', ...(notam.geometry ? [] : ['NO_GEOMETRY'])]
            })));
          }
          setIsLoading(false);
          return;
        }

        setIsLoading(true);
        let htmlFetchFailed = false;
        let geojsonFetchFailed = false;

        // Try to load airspace data from HTML first
        try {
          const today = new Date().toISOString().split('T')[0];
          if (!airspaceService.isLoadedFromHtml() && !airspaceService.isLoadedForDate(today)) {
            await airspaceService.loadAirspaceFromHtml();
          }
        } catch (htmlError) {
          console.warn("Failed to load airspace data from HTML:", htmlError);
          htmlFetchFailed = true;

          // Fallback to GeoJSON loading
          try {
            const fallbackDate = new Date().toISOString().split('T')[0];
            if (!airspaceService.isLoadedForDate(fallbackDate)) {
              await airspaceService.loadAirspaceData(fallbackDate);
            }
          } catch (geojsonError) {
            console.error("Failed to load airspace data from GeoJSON:", geojsonError);
            geojsonFetchFailed = true;
            throw geojsonError;
          }
        }

        // Enhance the NOTAMs with eAIP geometry
        const enhanced = airspaceService.enhanceNotams(notams);
        const sourceUrl = airspaceService.getLoadedSourceUrl();
        const sourceType = airspaceService.getLoadedSourceType();
        const effective = airspaceService.getEffectiveDate();
        setEffectiveDate(effective);

        const enrichedByService = enhanced.map(notam => {
          if (notam.enhancedGeometry && notam.geometrySourceDetails) {
            let finalUrl = notam.geometrySourceDetails.sourceUrl;
            if (!finalUrl && sourceType === 'html') {
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

        // Add fetch failure flags if any (but enhancement might have still "succeeded" for some NOTAMs if data was already cached)
        const enriched = enrichedByService.map(notam => {
          const issues = [...(notam.issues || [])];
          if (htmlFetchFailed && !airspaceService.isLoadedFromHtml()) issues.push('HTML_FETCH_FAILED');
          if (geojsonFetchFailed && !airspaceService.isLoadedForDate(new Date().toISOString().split('T')[0])) issues.push('GEOJSON_FETCH_FAILED');
          return { ...notam, issues };
        });

        setEnhancedData(enriched);
      } catch (err) {
        const error = err instanceof Error ? err : new Error(String(err));
        console.error("Failed to enhance NOTAMs with airspace data:", error);
        setLastFetchErrorTime(Date.now());

        // Still return original NOTAMs if enhancement fails, but mark why
        const failureReason = error.message.includes('fetch') ? 'FETCH_FAILED' : 'ENHANCEMENT_FAILED';

        setEnhancedData(notams.map(notam => ({
          ...notam,
          enhancedGeometry: null,
          sourceGeometry: notam.geometry,
          geometrySource: notam.geometrySource,
          geometrySourceDetails: notam.geometrySourceDetails,
          issues: [failureReason, ...(notam.geometry ? [] : ['NO_GEOMETRY'])]
        })));
      } finally {
        setIsLoading(false);
      }
    }

    enhanceNotams();
  }, [FETCH_COOLDOWN_MS, airspaceService, enhancedData, lastFetchErrorTime, notams]);

  return {
    data: enhancedData,
    isLoading,
    effectiveDate,
    ...notamStream
  };
}
