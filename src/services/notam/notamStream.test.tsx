import React from "react";
import { act, render } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { useNotamStream } from "./notamStream";
import { ENV } from "@/shared/env";

const usePollingMock = vi.fn();
const normalizeNotamsMock = vi.fn();
const countNotamItemsMock = vi.fn();
const useNotamModeMock = vi.fn();

vi.mock("@/services/polling/usePolling", () => ({
  usePolling: (...args: unknown[]) => usePollingMock(...args),
}));

vi.mock("@/shared/env", async () => {
  const actual = await vi.importActual<typeof import("@/shared/env")>("@/shared/env");
  return {
    ...actual,
    ENV: {
      notam: {
        mockUrl: vi.fn(),
        liveUrl: vi.fn(),
      },
      poll: {
        notamMs: vi.fn(),
      },
    },
  };
});

vi.mock("./notamNormalizer", () => ({
  normalizeNotams: (...args: unknown[]) => normalizeNotamsMock(...args),
  countNotamItems: (...args: unknown[]) => countNotamItemsMock(...args),
}));

vi.mock("./notamMode", () => ({
  useNotamMode: () => useNotamModeMock(),
}));

function TestHarness() {
  useNotamStream();
  return null;
}

describe("useNotamStream", () => {
  const envMock = ENV as unknown as {
    notam: {
      mockUrl: ReturnType<typeof vi.fn>;
      liveUrl: ReturnType<typeof vi.fn>;
    };
    poll: { notamMs: ReturnType<typeof vi.fn> };
  };

  beforeEach(() => {
    usePollingMock.mockReset();
    normalizeNotamsMock.mockReset();
    countNotamItemsMock.mockReset();
    normalizeNotamsMock.mockReturnValue([]);
    countNotamItemsMock.mockReturnValue(0);
    useNotamModeMock.mockReturnValue({ useLiveNotams: false });
    envMock.notam.mockUrl.mockReturnValue("/mock/notams.sample.json");
    envMock.notam.liveUrl.mockReturnValue("https://example.com/notams.json");
    envMock.poll.notamMs.mockReturnValue(60000);
    usePollingMock.mockReturnValue({
      data: null,
      status: "idle",
      lastOkUtc: null,
      lastErrorUtc: null,
      ageSeconds: null,
      error: null,
      tick: 0,
    });
  });

  it("creates a mapper that normalizes raw payloads with ingest time", () => {
    let mapper: ((raw: unknown) => unknown) | undefined;
    usePollingMock.mockImplementation(
      (
        key: string,
        url: string,
        pollMs: number,
        mapFn?: (raw: unknown) => unknown,
        fetcher?: (url: string, options?: RequestInit) => Promise<unknown>,
      ) => {
      mapper = mapFn;
      expect(fetcher).toEqual(expect.any(Function));
      return {
        data: null,
        status: "idle",
        lastOkUtc: null,
        lastErrorUtc: null,
        ageSeconds: null,
        error: null,
        tick: 0,
      };
      },
    );

    const now = new Date("2025-01-02T00:00:00Z");
    vi.useFakeTimers();
    vi.setSystemTime(now);

    render(<TestHarness />);

    const raw = { items: [] };
    act(() => {
      mapper?.(raw);
    });

    expect(normalizeNotamsMock).toHaveBeenCalledWith(raw, "2025-01-02T00:00:00.000Z");

    vi.useRealTimers();
  });

  it("passes through null raw payloads", () => {
    let mapper: ((raw: unknown) => unknown) | undefined;
    usePollingMock.mockImplementation(
      (
        key: string,
        url: string,
        pollMs: number,
        mapFn?: (raw: unknown) => unknown,
      ) => {
        mapper = mapFn;
        return {
          data: null,
          status: "idle",
          lastOkUtc: null,
          lastErrorUtc: null,
          ageSeconds: null,
          error: null,
          tick: 0,
        };
      },
    );

    render(<TestHarness />);

    act(() => {
      mapper?.(null);
    });

    expect(normalizeNotamsMock).toHaveBeenCalledWith(null, expect.any(String));
  });

  it("uses the mock URL when live mode is disabled", () => {
    envMock.poll.notamMs.mockReturnValue(0);

    render(<TestHarness />);

    expect(usePollingMock).toHaveBeenCalledWith(
      "notam:/mock/notams.sample.json",
      "/mock/notams.sample.json",
      0,
      expect.any(Function),
      expect.any(Function),
    );
  });

  it("uses the live URL when live mode is enabled", () => {
    useNotamModeMock.mockReturnValue({ useLiveNotams: true });

    render(<TestHarness />);

    expect(usePollingMock).toHaveBeenCalledWith(
      "notam:https://example.com/notams.json",
      "https://example.com/notams.json",
      60000,
      expect.any(Function),
      expect.any(Function),
    );
  });
});
