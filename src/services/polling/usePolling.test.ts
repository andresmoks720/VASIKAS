import { describe, expect, it } from "vitest";

import { classifyPollingStatus, computeAgeSeconds } from "./usePolling";

const NOW = Date.UTC(2025, 11, 18, 10, 0, 0);

describe("computeAgeSeconds", () => {
  it("returns null when no successful poll has occurred", () => {
    expect(computeAgeSeconds(null, NOW)).toBeNull();
  });

  it("returns whole seconds elapsed since last success", () => {
    const lastOk = NOW - 4321;

    expect(computeAgeSeconds(lastOk, NOW)).toBe(4);
  });

  it("clamps negative ages to zero", () => {
    const futureOk = NOW + 2000;

    expect(computeAgeSeconds(futureOk, NOW)).toBe(0);
  });
});

describe("classifyPollingStatus", () => {
  const intervalMs = 1000;

  it("returns loading on first in-flight fetch", () => {
    expect(
      classifyPollingStatus({
        lastOkMs: null,
        lastErrorMs: null,
        nowMs: NOW,
        intervalMs,
        isFetching: true,
      }),
    ).toBe("loading");
  });

  it("returns idle before any successful or failed fetch", () => {
    expect(
      classifyPollingStatus({
        lastOkMs: null,
        lastErrorMs: null,
        nowMs: NOW,
        intervalMs,
        isFetching: false,
      }),
    ).toBe("idle");
  });

  it("returns error when only failures have occurred", () => {
    expect(
      classifyPollingStatus({
        lastOkMs: null,
        lastErrorMs: NOW - intervalMs,
        nowMs: NOW,
        intervalMs,
        isFetching: false,
      }),
    ).toBe("error");
  });

  it("returns live when within the freshness window", () => {
    const recentOk = NOW - intervalMs;

    expect(
      classifyPollingStatus({
        lastOkMs: recentOk,
        lastErrorMs: null,
        nowMs: NOW,
        intervalMs,
        isFetching: false,
      }),
    ).toBe("live");
  });

  it("returns stale when outside the freshness window", () => {
    const oldOk = NOW - intervalMs * 3;

    expect(
      classifyPollingStatus({
        lastOkMs: oldOk,
        lastErrorMs: null,
        nowMs: NOW,
        intervalMs,
        isFetching: false,
      }),
    ).toBe("stale");
  });

  it("treats negative polling intervals as stale for invalid input", () => {
    const recentOk = NOW;

    expect(
      classifyPollingStatus({
        lastOkMs: recentOk,
        lastErrorMs: null,
        nowMs: NOW,
        intervalMs: -1000,
        isFetching: false,
      }),
    ).toBe("stale");
  });

  it("returns error when the last result failed and the last success is too old", () => {
    const lastOkMs = NOW - intervalMs * 4;
    const lastErrorMs = NOW - intervalMs;

    expect(
      classifyPollingStatus({
        lastOkMs,
        lastErrorMs,
        nowMs: NOW,
        intervalMs,
        isFetching: false,
      }),
    ).toBe("error");
  });
});
