import { useCallback } from "react";

import { usePolling } from "@/services/polling/usePolling";
import { Aircraft, AdsbDto, mapAdsbDtos } from "./adsbTypes";

const DEFAULT_POLL_MS = 10000;

function parsePollInterval(raw?: string): number {
  const parsed = Number(raw);

  return Number.isFinite(parsed) && parsed > 0 ? parsed : DEFAULT_POLL_MS;
}

function parseAdsbResponse(raw: unknown, ingestTimeUtc: string): Aircraft[] {
  if (!Array.isArray(raw)) {
    throw new Error("ADS-B response must be an array");
  }

  return mapAdsbDtos(raw as AdsbDto[], ingestTimeUtc);
}

export function useAdsbStream() {
  const url = import.meta.env.VITE_ADSB_URL ?? "/mock/adsb.json";
  const pollMs = parsePollInterval(import.meta.env.VITE_POLL_ADSB_MS);

  const mapper = useCallback((raw: unknown) => {
    const ingestTimeUtc = new Date().toISOString();
    return parseAdsbResponse(raw, ingestTimeUtc);
  }, []);

  return usePolling<Aircraft[]>(`adsb:${url}`, url, pollMs, mapper);
}
