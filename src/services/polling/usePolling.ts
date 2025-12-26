import { useEffect, useMemo, useRef, useState } from "react";

import { ENV } from "@/shared/env";
import { getJson } from "@/services/http/apiClient";

export type PollingStatus = "idle" | "loading" | "live" | "stale" | "error";

export type PollingResult<T> = {
  data: T | null;
  status: PollingStatus;
  lastOkUtc: string | null;
  lastErrorUtc: string | null;
  ageSeconds: number | null;
  error: Error | null;
  tick: number;
};

type InternalState<T> = {
  data: T | null;
  lastOkMs: number | null;
  lastErrorMs: number | null;
  error: Error | null;
  isFetching: boolean;
  tick: number;
};

const DEFAULT_INTERVAL_MS = ENV.poll.defaultMs();

function initialState<T>(): InternalState<T> {
  return {
    data: null,
    lastOkMs: null,
    lastErrorMs: null,
    error: null,
    isFetching: false,
    tick: 0,
  };
}

export function computeAgeSeconds(
  lastOkMs: number | null,
  nowMs: number,
): number | null {
  if (lastOkMs === null) {
    return null;
  }

  return Math.max(0, Math.floor((nowMs - lastOkMs) / 1000));
}

function toIsoString(ms: number | null): string | null {
  return ms === null ? null : new Date(ms).toISOString();
}

function normalizeInterval(intervalMs?: number): number {
  if (intervalMs && intervalMs > 0) {
    return intervalMs;
  }

  return Number.isFinite(DEFAULT_INTERVAL_MS) && DEFAULT_INTERVAL_MS > 0
    ? DEFAULT_INTERVAL_MS
    : 5000;
}

export function classifyPollingStatus({
  lastOkMs,
  lastErrorMs,
  nowMs,
  intervalMs,
  isFetching,
}: {
  lastOkMs: number | null;
  lastErrorMs: number | null;
  nowMs: number;
  intervalMs: number;
  isFetching: boolean;
}): PollingStatus {
  if (lastOkMs === null) {
    if (isFetching) {
      return "loading";
    }

    return lastErrorMs ? "error" : "idle";
  }

  const ageMs = nowMs - lastOkMs;
  const threshold = intervalMs * 2;
  const hasRecentError =
    lastErrorMs !== null && (lastOkMs === null || lastErrorMs > lastOkMs);

  if (hasRecentError && ageMs > threshold) {
    return "error";
  }

  if (ageMs > threshold) {
    return "stale";
  }

  return "live";
}

export function usePolling<T>(
  key: string,
  url: string,
  intervalMs?: number,
  mapFn?: (raw: unknown) => T,
): PollingResult<T> {
  const resolvedInterval = normalizeInterval(intervalMs);
  const abortRef = useRef<AbortController | null>(null);
  const [internal, setInternal] = useState<InternalState<T>>(() => initialState<T>());
  const [nowMs, setNowMs] = useState(() => Date.now());

  useEffect(() => {
    setInternal(initialState<T>());
  }, [key]);

  useEffect(() => {
    const ageTimer = window.setInterval(() => {
      setNowMs(Date.now());
    }, 1000);

    return () => {
      window.clearInterval(ageTimer);
    };
  }, []);

  useEffect(() => {
    let cancelled = false;

    const performFetch = async () => {
      console.log(`[usePolling] performFetch for ${url}`);
      abortRef.current?.abort();
      const controller = new AbortController();
      abortRef.current = controller;

      setInternal((prev) => ({ ...prev, isFetching: true }));

      try {
        const raw = await getJson<unknown>(url, { signal: controller.signal });
        const mapped = (mapFn ? mapFn(raw) : (raw as T));
        const now = Date.now();

        if (cancelled) {
          return;
        }

        setInternal((prev) => ({
          ...prev,
          data: mapped,
          lastOkMs: now,
          isFetching: false,
          error: null,
          tick: prev.tick + 1,
        }));
      } catch (err) {
        if (cancelled) {
          return;
        }

        if (err instanceof DOMException && err.name === "AbortError") {
          setInternal((prev) => ({ ...prev, isFetching: false }));
          return;
        }

        const now = Date.now();

        setInternal((prev) => ({
          ...prev,
          isFetching: false,
          lastErrorMs: now,
          error: err instanceof Error ? err : new Error(String(err)),
        }));
      }
    };

    performFetch();
    const intervalId = window.setInterval(performFetch, resolvedInterval);

    return () => {
      cancelled = true;
      abortRef.current?.abort();
      window.clearInterval(intervalId);
    };
  }, [key, mapFn, resolvedInterval, url]);

  const status = useMemo(
    () =>
      classifyPollingStatus({
        lastOkMs: internal.lastOkMs,
        lastErrorMs: internal.lastErrorMs,
        nowMs,
        intervalMs: resolvedInterval,
        isFetching: internal.isFetching,
      }),
    [internal.isFetching, internal.lastErrorMs, internal.lastOkMs, nowMs, resolvedInterval],
  );

  const ageSeconds = useMemo(
    () => computeAgeSeconds(internal.lastOkMs, nowMs),
    [internal.lastOkMs, nowMs],
  );

  return useMemo(
    () => ({
      data: internal.data,
      status,
      lastOkUtc: toIsoString(internal.lastOkMs),
      lastErrorUtc: toIsoString(internal.lastErrorMs),
      ageSeconds,
      error: internal.error,
      tick: internal.tick,
    }),
    [ageSeconds, internal.data, internal.error, internal.lastErrorMs, internal.lastOkMs, internal.tick, status],
  );
}
