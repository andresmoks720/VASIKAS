import React from "react";
import { render } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { useNotamPolling } from "./useNotamPolling";
import { ENV } from "@/shared/env";

const usePollingMock = vi.fn();

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

type PollOverrides = { pollMs?: number | null | string };

function TestHarness({ pollMs }: PollOverrides) {
  useNotamPolling(pollMs === undefined ? undefined : { pollMs: pollMs as number });
  return null;
}

describe("useNotamPolling", () => {
  const envMock = ENV as unknown as {
    notamUrl: ReturnType<typeof vi.fn>;
    poll: { notamMs: ReturnType<typeof vi.fn> };
  };

  beforeEach(() => {
    usePollingMock.mockReturnValue({
      data: null,
      status: "idle",
      lastOkUtc: null,
      lastErrorUtc: null,
      ageSeconds: null,
      error: null,
      tick: 0,
    });
    usePollingMock.mockClear();
    envMock.notamUrl.mockReturnValue("https://example.com/notams.json");
    envMock.poll.notamMs.mockReturnValue(60000);
  });

  it("uses ENV defaults when options are omitted", () => {
    render(<TestHarness />);

    expect(usePollingMock).toHaveBeenCalledWith(
      "notam:https://example.com/notams.json",
      "https://example.com/notams.json",
      60000,
    );
  });

  it("falls back to ENV when pollMs is null", () => {
    render(<TestHarness pollMs={null} />);

    expect(usePollingMock).toHaveBeenCalledWith(
      "notam:https://example.com/notams.json",
      "https://example.com/notams.json",
      60000,
    );
  });

  it.each([
    { label: "zero", value: 0 },
    { label: "negative", value: -500 },
    { label: "huge", value: 9_999_999 },
  ])("passes boundary pollMs values ($label)", ({ value }) => {
    render(<TestHarness pollMs={value} />);

    expect(usePollingMock).toHaveBeenCalledWith(
      "notam:https://example.com/notams.json",
      "https://example.com/notams.json",
      value,
    );
  });

  it.each([
    { label: "NaN", value: Number.NaN },
    { label: "empty string", value: "" },
  ])("passes invalid pollMs values ($label)", ({ value }) => {
    render(<TestHarness pollMs={value} />);

    expect(usePollingMock).toHaveBeenCalledWith(
      "notam:https://example.com/notams.json",
      "https://example.com/notams.json",
      value,
    );
  });
});
