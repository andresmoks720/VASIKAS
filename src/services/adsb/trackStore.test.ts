import { describe, expect, it } from "vitest";

import { updateTrackStore } from "./trackStore";

const NOW = Date.parse("2024-01-01T00:03:00Z");

describe("trackStore", () => {
  it("deduplicates identical points and enforces non-decreasing time", () => {
    const firstSnapshot = updateTrackStore(
      new Map(),
      [{ id: "abc", position: { lon: 1, lat: 1 }, eventTimeUtc: "2024-01-01T00:00:00Z" }],
      undefined,
      NOW,
    );

    const secondSnapshot = updateTrackStore(
      firstSnapshot.state,
      [
        { id: "abc", position: { lon: 1, lat: 1 }, eventTimeUtc: "2024-01-01T00:00:00Z" }, // duplicate
        { id: "abc", position: { lon: 1.5, lat: 1.5 }, eventTimeUtc: "2024-01-01T00:00:05Z" }, // forward
        { id: "abc", position: { lon: 2, lat: 2 }, eventTimeUtc: "2023-12-31T23:59:00Z" }, // backwards
      ],
      undefined,
      NOW,
    );

    expect(secondSnapshot.tracks.get("abc")).toEqual([
      { position: { lon: 1, lat: 1 }, eventTimeUtc: "2024-01-01T00:00:00Z" },
      { position: { lon: 1.5, lat: 1.5 }, eventTimeUtc: "2024-01-01T00:00:05Z" },
    ]);
  });

  it("caps per-aircraft history and prunes by age", () => {
    const options = { maxPoints: 3, maxAgeMs: 120_000 };
    let state = new Map();

    state = updateTrackStore(
      state,
      [
        { id: "abc", position: { lon: 1, lat: 1 }, eventTimeUtc: "2024-01-01T00:00:00Z" },
        { id: "abc", position: { lon: 2, lat: 2 }, eventTimeUtc: "2024-01-01T00:01:30Z" },
        { id: "abc", position: { lon: 3, lat: 3 }, eventTimeUtc: "2024-01-01T00:02:30Z" },
      ],
      options,
      NOW,
    ).state;

    const result = updateTrackStore(
      state,
      [{ id: "abc", position: { lon: 4, lat: 4 }, eventTimeUtc: "2024-01-01T00:02:50Z" }],
      options,
      NOW,
    );

    expect(result.tracks.get("abc")).toEqual([
      { position: { lon: 2, lat: 2 }, eventTimeUtc: "2024-01-01T00:01:30Z" },
      { position: { lon: 3, lat: 3 }, eventTimeUtc: "2024-01-01T00:02:30Z" },
      { position: { lon: 4, lat: 4 }, eventTimeUtc: "2024-01-01T00:02:50Z" },
    ]);
  });

  it("drops tracks after missed polls", () => {
    const options = { maxMissedPolls: 2, maxAgeMs: 10 * 60_000 };
    const first = updateTrackStore(
      new Map(),
      [{ id: "abc", position: { lon: 1, lat: 1 }, eventTimeUtc: "2024-01-01T00:00:00Z" }],
      options,
      NOW,
    );

    const second = updateTrackStore(first.state, [], options, NOW + 10_000);
    expect(second.tracks.get("abc")).toBeDefined();

    const third = updateTrackStore(second.state, [], options, NOW + 20_000);
    expect(third.tracks.get("abc")).toBeUndefined();
  });
});
