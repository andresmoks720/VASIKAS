import { describe, expect, it, vi, afterEach } from "vitest";

const STORAGE_KEY = "notams:useLive";

afterEach(() => {
  window.localStorage.clear();
  vi.resetModules();
  vi.clearAllMocks();
});

describe("notamMode", () => {
  it("defaults to mock when env mocks are enabled and no preference is stored", async () => {
    vi.doMock("@/shared/env", () => ({
      ENV: {
        useMocks: () => true,
      },
    }));

    const { getUseLiveNotams } = await import("./notamMode");

    expect(getUseLiveNotams()).toBe(false);
  });

  it("hydrates from localStorage when present", async () => {
    window.localStorage.setItem(STORAGE_KEY, "true");

    vi.doMock("@/shared/env", () => ({
      ENV: {
        useMocks: () => true,
      },
    }));

    const { getUseLiveNotams } = await import("./notamMode");

    expect(getUseLiveNotams()).toBe(true);
  });

  it("persists updates when toggled", async () => {
    vi.doMock("@/shared/env", () => ({
      ENV: {
        useMocks: () => true,
      },
    }));

    const { getUseLiveNotams, setUseLiveNotams } = await import("./notamMode");

    expect(getUseLiveNotams()).toBe(false);

    setUseLiveNotams(true);

    expect(window.localStorage.getItem(STORAGE_KEY)).toBe("true");
    expect(getUseLiveNotams()).toBe(true);
  });
});
