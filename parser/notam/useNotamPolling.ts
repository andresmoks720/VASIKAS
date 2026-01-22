import { PollingResult, usePolling } from "@/services/polling/usePolling";
import { ENV } from "@/shared/env";

export type UseNotamPollingOptions = {
    /** Override poll interval in milliseconds. Defaults to VITE_POLL_NOTAM_MS (60000). */
    pollMs?: number;
};

/**
 * React hook that polls NOTAM data at a configured interval.
 *
 * Uses the shared polling infrastructure which provides:
 * - AbortController for cancelling in-flight requests
 * - Last good data preservation on network errors
 * - Stream status (idle/loading/live/stale/error)
 * - Age tracking (lastOkUtc, lastErrorUtc, ageSeconds)
 *
 * @param opts - Optional configuration overrides
 * @returns Polling result with raw NOTAM data and status information
 */
export function useNotamPolling(opts?: UseNotamPollingOptions): PollingResult<unknown> {
    const url = ENV.notamUrl();
    const pollMs = opts?.pollMs ?? ENV.poll.notamMs();

    return usePolling<unknown>(`notam:${url}`, url, pollMs);
}
