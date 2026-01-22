import { useCallback, useEffect, useMemo, useState } from "react";

import { usePolling } from "@/services/polling/usePolling";
import { ENV, resolveDataUrl } from "@/shared/env";
import { getJson } from "@/services/http/apiClient";

import { NormalizedNotam } from "./notamTypes";
import { countNotamItems, normalizeNotams } from "./notamNormalizer";
import { useNotamMode } from "./notamMode";

type ApiRequestOptions = Parameters<typeof getJson>[1];

export function useNotamStream() {
  const { useLiveNotams } = useNotamMode();
  const [rawCount, setRawCount] = useState<number | null>(null);
  const [displayedCount, setDisplayedCount] = useState<number | null>(null);
  const [dataSource, setDataSource] = useState<"live" | "mock" | "fallback" | null>(null);
  const [liveError, setLiveError] = useState<Error | null>(null);
  const mockUrl = ENV.notam.mockUrl();
  const liveUrl = ENV.notam.liveUrl();
  const url = useMemo(
    () =>
      resolveDataUrl({
        name: "VITE_NOTAM_URL",
        mockUrl,
        useMocks: !useLiveNotams,
        rawValue: liveUrl,
        fallbackToMock: true,
      }),
    [liveUrl, mockUrl, useLiveNotams],
  );
  const pollMs = ENV.poll.notamMs();

  useEffect(() => {
    setRawCount(null);
    setDisplayedCount(null);
    setDataSource(null);
    setLiveError(null);
  }, [url]);

  const mapper = useCallback((raw: unknown) => {
    const normalized = normalizeNotams(raw, new Date().toISOString());
    setRawCount(countNotamItems(raw));
    setDisplayedCount(normalized.length);
    return normalized;
  }, []);

  const fetcher = useCallback(
    async (targetUrl: string, options?: ApiRequestOptions) => {
      if (!useLiveNotams || targetUrl === mockUrl) {
        setDataSource("mock");
        setLiveError(null);
        return getJson<unknown>(targetUrl, options);
      }

      try {
        const response = await getJson<unknown>(targetUrl, options);
        setDataSource("live");
        setLiveError(null);
        return response;
      } catch (error) {
        if (error instanceof DOMException && error.name === "AbortError") {
          throw error;
        }

        console.warn("[notam] Live fetch failed; falling back to mock data.", error);
        setDataSource("fallback");
        setLiveError(error instanceof Error ? error : new Error(String(error)));
        return getJson<unknown>(mockUrl, options);
      }
    },
    [mockUrl, useLiveNotams],
  );

  const polling = usePolling<NormalizedNotam[]>(`notam:${url}`, url, pollMs, mapper, fetcher);

  return {
    ...polling,
    rawCount,
    displayedCount,
    dataSource,
    liveError,
  };
}
