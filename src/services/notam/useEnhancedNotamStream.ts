import { useEffect, useRef, useState } from "react";
import { useNotamStream } from "./notamStream";
import { EnhancedNotam } from "../airspace/airspaceTypes";
import { airspaceIntegrationService } from "../airspace/AirspaceIntegrationService";

const FETCH_COOLDOWN_MS = 5 * 60 * 1000; // 5 minutes cooldown on error

/**
 * Hook that provides NOTAMs enhanced with eAIP airspace geometry
 */
export function useEnhancedNotamStream() {
  const { data: notams, ...notamStream } = useNotamStream();
  const [enhancedData, setEnhancedData] = useState<EnhancedNotam[] | null>(null);
  const enhancedDataRef = useRef<EnhancedNotam[] | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [enhancementError, setEnhancementError] = useState<Error | null>(null);
  const [effectiveDate, setEffectiveDate] = useState<string | null>(null);
  const [lastFetchErrorTime, setLastFetchErrorTime] = useState<number>(0);

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
          if (!enhancedDataRef.current) {
            const fallback = notams.map(notam => ({
              ...notam,
              enhancedGeometry: null,
              sourceGeometry: notam.geometry,
              geometrySource: notam.geometrySource,
              geometrySourceDetails: notam.geometrySourceDetails,
              issues: ['ENHANCEMENT_COOLDOWN', ...(notam.geometry ? [] : ['NO_GEOMETRY'])]
            }));
            enhancedDataRef.current = fallback;
            setEnhancedData(fallback);
          }
          setIsLoading(false);
          return;
        }

        setIsLoading(true);
        setEnhancementError(null);

        let htmlFetchFailed = false;
        let geojsonFetchFailed = false;

        // Try to load airspace data from HTML first
        try {
          const today = new Date().toISOString().split('T')[0];
          if (!airspaceIntegrationService.isLoadedFromHtml() && !airspaceIntegrationService.isLoadedForDate(today)) {
            await airspaceIntegrationService.loadAirspaceFromHtml();
          }
        } catch (htmlError) {
          console.warn("Failed to load airspace data from HTML:", htmlError);
          htmlFetchFailed = true;

          // Fallback to GeoJSON loading
          try {
            const fallbackDate = new Date().toISOString().split('T')[0];
            if (!airspaceIntegrationService.isLoadedForDate(fallbackDate)) {
              await airspaceIntegrationService.loadAirspaceData(fallbackDate);
            }
          } catch (geojsonError) {
            console.error("Failed to load airspace data from GeoJSON:", geojsonError);
            geojsonFetchFailed = true;
            throw geojsonError;
          }
        }

        // Enhance the NOTAMs with eAIP geometry
        const enhanced = airspaceIntegrationService.enhanceNotams(notams);
        const sourceUrl = airspaceIntegrationService.getLoadedSourceUrl();
        const sourceType = airspaceIntegrationService.getLoadedSourceType();
        const effective = airspaceIntegrationService.getEffectiveDate();
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
          if (htmlFetchFailed && !airspaceIntegrationService.isLoadedFromHtml()) issues.push('HTML_FETCH_FAILED');
          if (geojsonFetchFailed && !airspaceIntegrationService.isLoadedForDate(new Date().toISOString().split('T')[0])) issues.push('GEOJSON_FETCH_FAILED');
          return { ...notam, issues };
        });

        enhancedDataRef.current = enriched;
        setEnhancedData(enriched);
      } catch (err) {
        const error = err instanceof Error ? err : new Error(String(err));
        console.error("Failed to enhance NOTAMs with airspace data:", error);
        setEnhancementError(error);
        setLastFetchErrorTime(Date.now());

        // Still return original NOTAMs if enhancement fails, but mark why
        const failureReason = error.message.includes('fetch') ? 'FETCH_FAILED' : 'ENHANCEMENT_FAILED';

        const fallback = notams.map(notam => ({
          ...notam,
          enhancedGeometry: null,
          sourceGeometry: notam.geometry,
          geometrySource: notam.geometrySource,
          geometrySourceDetails: notam.geometrySourceDetails,
          issues: [failureReason, ...(notam.geometry ? [] : ['NO_GEOMETRY'])]
        }));
        enhancedDataRef.current = fallback;
        setEnhancedData(fallback);
      } finally {
        setIsLoading(false);
      }
    }

    enhanceNotams();
  }, [lastFetchErrorTime, notams]);

  return {
    data: enhancedData,
    isLoading,
    enhancementError,
    effectiveDate,
    ...notamStream
  };
}
