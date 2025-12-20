import { ENV } from "@/shared/env";

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

    const response = await fetch(url, {
        signal,
        cache: "no-store",
    });

    if (!response.ok) {
        throw new Error(
            `NOTAM fetch failed: ${response.status} ${response.statusText} (${url})`,
        );
    }

    return response.json();
}
