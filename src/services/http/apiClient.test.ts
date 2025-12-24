import { getJson } from "./apiClient";

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
});
