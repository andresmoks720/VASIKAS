import { ENV } from "@/shared/env";
import { getJson } from "@/services/http/apiClient";

/**
 * Fetches raw NOTAM JSON from the configured endpoint.
 *
 * - When VITE_USE_MOCKS=1: fetches /mock/notams.sample.json
 * - When VITE_USE_MOCKS=0: fetches VITE_NOTAM_URL
 *
 * @param signal - Optional AbortSignal to cancel the request
 * @returns The raw JSON response (caller is responsible for parsing/validating)
 * @throws Error on network failure or non-OK HTTP status
 */
export async function fetchNotamRaw(signal?: AbortSignal): Promise<unknown> {
    const url = ENV.notamUrl();

    return getJson<unknown>(url, { signal });
}
