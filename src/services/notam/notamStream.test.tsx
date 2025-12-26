import React from "react";
import { render } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { useNotamStream } from "./notamStream";
import { ENV } from "@/shared/env";

const usePollingMock = vi.fn();
const normalizeNotamsMock = vi.fn();

vi.mock("@/services/polling/usePolling", () => ({
  usePolling: (...args: unknown[]) => usePollingMock(...args),
}));

vi.mock("@/shared/env", () => ({
  ENV: {
    notamUrl: vi.fn(),
    poll: {
      notamMs: vi.fn(),
    },
  },
}));

vi.mock("./notamInterpreter", () => ({
  normalizeNotams: (...args: unknown[]) => normalizeNotamsMock(...args),
}));

function TestHarness() {
  useNotamStream();
  return null;
}

describe("useNotamStream", () => {
  const envMock = ENV as unknown as {
    notamUrl: ReturnType<typeof vi.fn>;
    poll: { notamMs: ReturnType<typeof vi.fn> };
  };

  beforeEach(() => {
    usePollingMock.mockReset();
    normalizeNotamsMock.mockReset();
    envMock.notamUrl.mockReturnValue("https://example.com/notams.json");
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
    usePollingMock.mockImplementation((key: string, url: string, pollMs: number, mapFn?: (raw: unknown) => unknown) => {
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
    });

    const now = new Date("2025-01-02T00:00:00Z");
    vi.useFakeTimers();
    vi.setSystemTime(now);

    render(<TestHarness />);

    const raw = { items: [] };
    mapper?.(raw);

    expect(normalizeNotamsMock).toHaveBeenCalledWith(raw, "2025-01-02T00:00:00.000Z");

    vi.useRealTimers();
  });

  it("passes through null raw payloads", () => {
    let mapper: ((raw: unknown) => unknown) | undefined;
    usePollingMock.mockImplementation((key: string, url: string, pollMs: number, mapFn?: (raw: unknown) => unknown) => {
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
    });

    render(<TestHarness />);

    mapper?.(null);

    expect(normalizeNotamsMock).toHaveBeenCalledWith(null, expect.any(String));
  });

  it("uses empty URLs and zero intervals when provided by ENV", () => {
    envMock.notamUrl.mockReturnValue("");
    envMock.poll.notamMs.mockReturnValue(0);

    render(<TestHarness />);

    expect(usePollingMock).toHaveBeenCalledWith("notam:", "", 0, expect.any(Function));
  });
});
