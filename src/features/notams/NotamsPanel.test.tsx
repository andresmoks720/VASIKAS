import React from "react";
import { fireEvent, screen } from "@testing-library/react";
import { beforeEach, describe, it, expect, vi } from "vitest";
import { NotamsPanel } from "./NotamsPanel";
import * as StreamsProvider from "@/services/streams/StreamsProvider";
import { makeNotam } from "@/shared/test/factories";
import { renderWithRouter } from "@/shared/test/render";
import type { EnhancedNotam } from "@/services/airspace/airspaceTypes";

const toggleUseLiveNotams = vi.fn();
type NotamStream = ReturnType<typeof StreamsProvider.useSharedNotamStream>;

const makeStream = (overrides: Partial<NotamStream> = {}): NotamStream => ({
  data: [] as EnhancedNotam[],
  status: "live",
  lastOkUtc: null,
  lastErrorUtc: null,
  tick: 0,
  ageSeconds: null,
  error: null,
  rawCount: 0,
  displayedCount: 0,
  dataSource: "mock",
  liveError: null,
  isLoading: false,
  effectiveDate: null,
  ...overrides,
});

vi.mock("@/layout/MapShell/useSidebarUrlState", () => ({
  useSidebarUrlState: () => ({
    selectEntity: vi.fn(),
  }),
}));

vi.mock("@/services/notam/notamMode", () => ({
  useNotamMode: () => ({
    useLiveNotams: false,
    toggleUseLiveNotams,
  }),
}));

describe("NotamsPanel", () => {
  beforeEach(() => {
    toggleUseLiveNotams.mockReset();
  });

  it("renders empty state when no NOTAMs are available", () => {
    vi.spyOn(StreamsProvider, "useSharedNotamStream").mockReturnValue(makeStream());

    renderWithRouter(<NotamsPanel />, { route: "/notams" });

    expect(screen.getByText("No NOTAMs available right now.")).toBeInTheDocument();
    expect(screen.getByText("Total: 0 • Displayed: 0")).toBeInTheDocument();
  });

  it("renders NOTAMs even without geometry", () => {
    const notamWithoutGeometry = makeNotam({
      id: "C1234/25",
      summary: "TEST NOTAM WITHOUT GEOMETRY",
      geometry: null,
    });

    vi.spyOn(StreamsProvider, "useSharedNotamStream").mockReturnValue(
      makeStream({
        data: [notamWithoutGeometry as EnhancedNotam],
        lastOkUtc: "",
        ageSeconds: 5,
        rawCount: 1,
        displayedCount: 1,
        dataSource: "live",
      }),
    );

    renderWithRouter(<NotamsPanel />, { route: "/notams" });

    expect(screen.getByText("C1234/25")).toBeInTheDocument();
    expect(screen.getByText("TEST NOTAM WITHOUT GEOMETRY")).toBeInTheDocument();
    expect(screen.getByText("Total: 1 • Displayed: 1")).toBeInTheDocument();
  });

  it("renders a list of NOTAMs with altitude fallbacks", () => {
    const notamWithAltitude = makeNotam({
      id: "A0001/25",
      summary: "ALT LIMIT",
    });
    const notamWithoutAltitude = makeNotam({
      id: "A0002/25",
      summary: "NO ALT LIMIT",
      altitudes: [],
    });

    vi.spyOn(StreamsProvider, "useSharedNotamStream").mockReturnValue(
      makeStream({
        data: [notamWithAltitude as EnhancedNotam, notamWithoutAltitude as EnhancedNotam],
        lastOkUtc: "2025-01-01T00:00:00Z",
        ageSeconds: 10,
        rawCount: 2,
        displayedCount: 2,
        dataSource: "live",
      }),
    );

    renderWithRouter(<NotamsPanel />, { route: "/notams" });

    expect(screen.getByText("A0001/25")).toBeInTheDocument();
    expect(screen.getByText("ALT LIMIT")).toBeInTheDocument();
    expect(screen.getByText("A0002/25")).toBeInTheDocument();
    expect(screen.getByText("NO ALT LIMIT")).toBeInTheDocument();
    expect(screen.getByText("No altitude limits")).toBeInTheDocument();
  });

  it("toggles the NOTAM live mode control", () => {
    vi.spyOn(StreamsProvider, "useSharedNotamStream").mockReturnValue(makeStream());

    renderWithRouter(<NotamsPanel />, { route: "/notams" });

    fireEvent.click(screen.getByRole("button", { name: /Switch to Live/i }));

    expect(toggleUseLiveNotams).toHaveBeenCalledTimes(1);
  });

  it("labels live fallback data as mock fallback", () => {
    vi.spyOn(StreamsProvider, "useSharedNotamStream").mockReturnValue(
      makeStream({ dataSource: "fallback", liveError: new Error("Timeout") }),
    );

    renderWithRouter(<NotamsPanel />, { route: "/notams" });

    expect(screen.getByText("Mock (live fallback)")).toBeInTheDocument();
    expect(screen.getByText(/Live NOTAM fetch failed: Timeout/)).toBeInTheDocument();
  });
});
