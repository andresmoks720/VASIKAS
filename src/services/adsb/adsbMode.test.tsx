import { afterEach, describe, expect, it, vi } from "vitest";

const STORAGE_KEY = "adsb:useLive";

afterEach(() => {
  window.localStorage.clear();
  vi.resetModules();
  vi.clearAllMocks();
});

describe("adsbMode", () => {
  it("defaults to mock when env mocks are enabled and no preference is stored", async () => {
    vi.doMock("@/shared/env", () => ({
      ENV: {
        useMocks: () => true,
      },
    }));

    const { getUseLiveAdsb } = await import("./adsbMode");

    expect(getUseLiveAdsb()).toBe(false);
  });

  it("hydrates from localStorage when present", async () => {
    window.localStorage.setItem(STORAGE_KEY, "true");

    vi.doMock("@/shared/env", () => ({
      ENV: {
        useMocks: () => true,
      },
    }));

    const { getUseLiveAdsb } = await import("./adsbMode");

    expect(getUseLiveAdsb()).toBe(true);
  });

  it("persists updates when toggled", async () => {
    vi.doMock("@/shared/env", () => ({
      ENV: {
        useMocks: () => true,
      },
    }));

    const { getUseLiveAdsb, setUseLiveAdsb } = await import("./adsbMode");

    expect(getUseLiveAdsb()).toBe(false);

    setUseLiveAdsb(true);

    expect(window.localStorage.getItem(STORAGE_KEY)).toBe("true");
    expect(getUseLiveAdsb()).toBe(true);
  });
});
