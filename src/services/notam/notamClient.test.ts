import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { fetchNotamRaw } from "./notamClient";

// Mock the ENV module
vi.mock("@/shared/env", () => ({
    ENV: {
        notamUrl: () => "/mock/notams.sample.json",
    },
}));

describe("fetchNotamRaw", () => {
    const mockResponse = {
        generatedAtUtc: "2025-12-18T10:00:00Z",
        items: [{ id: "A1234/25", text: "TEMP RESTRICTED AREA" }],
    };

    beforeEach(() => {
        vi.stubGlobal("fetch", vi.fn());
    });

    afterEach(() => {
        vi.restoreAllMocks();
    });

    it("returns parsed JSON on successful fetch", async () => {
        vi.mocked(fetch).mockResolvedValue({
            ok: true,
            json: async () => mockResponse,
        } as Response);

        const result = await fetchNotamRaw();

        expect(result).toEqual(mockResponse);
        expect(fetch).toHaveBeenCalledWith("/mock/notams.sample.json", {
            signal: undefined,
            cache: "no-store",
        });
    });

    it("throws descriptive error on HTTP error status", async () => {
        vi.mocked(fetch).mockResolvedValue({
            ok: false,
            status: 500,
            statusText: "Internal Server Error",
        } as Response);

        await expect(fetchNotamRaw()).rejects.toThrow(
            "NOTAM fetch failed: 500 Internal Server Error (/mock/notams.sample.json)",
        );
    });

    it("throws descriptive error on 404", async () => {
        vi.mocked(fetch).mockResolvedValue({
            ok: false,
            status: 404,
            statusText: "Not Found",
        } as Response);

        await expect(fetchNotamRaw()).rejects.toThrow(
            "NOTAM fetch failed: 404 Not Found",
        );
    });

    it("propagates network errors", async () => {
        vi.mocked(fetch).mockRejectedValue(new Error("Network error"));

        await expect(fetchNotamRaw()).rejects.toThrow("Network error");
    });

    it("respects AbortSignal", async () => {
        const abortError = new DOMException("Aborted", "AbortError");
        vi.mocked(fetch).mockRejectedValue(abortError);

        const controller = new AbortController();
        controller.abort();

        await expect(fetchNotamRaw(controller.signal)).rejects.toThrow("Aborted");
    });

    it("passes signal to fetch", async () => {
        vi.mocked(fetch).mockResolvedValue({
            ok: true,
            json: async () => mockResponse,
        } as Response);

        const controller = new AbortController();
        await fetchNotamRaw(controller.signal);

        expect(fetch).toHaveBeenCalledWith("/mock/notams.sample.json", {
            signal: controller.signal,
            cache: "no-store",
        });
    });
});
