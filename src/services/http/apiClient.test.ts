import { afterEach, describe, expect, it, vi } from "vitest";

import { getJson, withTimeout } from "./apiClient";

describe("apiClient.getJson", () => {
  const originalFetch = globalThis.fetch;

  afterEach(() => {
    globalThis.fetch = originalFetch;
  });

  it("returns parsed JSON for successful responses", async () => {
    globalThis.fetch = vi.fn().mockResolvedValue({
      ok: true,
      status: 200,
      statusText: "OK",
      json: async () => ({ hello: "world" }),
    });

    await expect(getJson<{ hello: string }>("/ok")).resolves.toEqual({ hello: "world" });
  });

  it("throws ApiError for HTTP errors", async () => {
    globalThis.fetch = vi.fn().mockResolvedValue({
      ok: false,
      status: 500,
      statusText: "Server Error",
      json: async () => ({ message: "fail" }),
    });

    await expect(getJson("/bad")).rejects.toMatchObject({
      kind: "http",
      status: 500,
      url: "/bad",
    });
  });

  it("throws ApiError for JSON parse errors", async () => {
    globalThis.fetch = vi.fn().mockResolvedValue({
      ok: true,
      status: 200,
      statusText: "OK",
      json: async () => {
        throw new Error("bad json");
      },
    });

    await expect(getJson("/parse")).rejects.toMatchObject({
      kind: "parse",
      url: "/parse",
    });
  });

  it("throws ApiError for network errors", async () => {
    globalThis.fetch = vi.fn().mockRejectedValue(new Error("network down"));

    await expect(getJson("/network")).rejects.toMatchObject({
      kind: "network",
      url: "/network",
    });
  });

  it("wraps non-Error rejections as network ApiError", async () => {
    globalThis.fetch = vi.fn().mockRejectedValue("offline");

    await expect(getJson("/network")).rejects.toMatchObject({
      kind: "network",
      url: "/network",
    });
  });
});

describe("apiClient.withTimeout", () => {
  it.each([
    { label: "undefined", value: undefined },
    { label: "zero", value: 0 },
    { label: "negative", value: -1 },
  ])("returns original signal for $label timeout", ({ value }) => {
    const controller = new AbortController();
    const { signal, clear } = withTimeout(controller.signal, value);

    expect(signal).toBe(controller.signal);
    clear();
  });

  it("aborts immediately when provided signal is already aborted", () => {
    const controller = new AbortController();
    controller.abort();

    const { signal, clear } = withTimeout(controller.signal, 1000);

    expect(signal?.aborted).toBe(true);
    clear();
  });

  it("aborts after timeout boundary", () => {
    vi.useFakeTimers();
    const { signal, clear } = withTimeout(undefined, 10);

    expect(signal?.aborted).toBe(false);
    vi.advanceTimersByTime(10);

    expect(signal?.aborted).toBe(true);
    clear();
    vi.useRealTimers();
  });
});
