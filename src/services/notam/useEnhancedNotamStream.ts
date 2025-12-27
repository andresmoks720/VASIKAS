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

        // Get the effective date from the environment or derive it from the current date
        // For now, we'll use a placeholder date - in a real implementation,
        // this would come from the eAIP history page
        const effectiveDate = "2025-10-30"; // Placeholder - should be dynamic

        // Load airspace data if not already loaded for this date
        if (!airspaceService.isLoadedForDate(effectiveDate)) {
          await airspaceService.loadAirspaceData(effectiveDate);
        }

        // Enhance the NOTAMs with eAIP geometry
        const enhanced = airspaceService.enhanceNotams(notams);
        setEnhancedData(enhanced);
      } catch (err) {
        console.error("Failed to enhance NOTAMs with airspace data:", err);
        setError(err instanceof Error ? err : new Error(String(err)));
        // Still return original NOTAMs if enhancement fails
        setEnhancedData(notams.map(notam => ({
          ...notam,
          enhancedGeometry: notam.geometry,
          sourceGeometry: notam.geometry,
          geometrySource: notam.geometry ? 'parsed' : 'none',
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