import React from "react";
import { fireEvent, screen } from "@testing-library/react";
import { beforeEach, describe, it, expect, vi } from "vitest";
import { NotamsPanel } from "./NotamsPanel";
import * as StreamsProvider from "@/services/streams/StreamsProvider";
import { makeNotam } from "@/shared/test/factories";
import { renderWithRouter } from "@/shared/test/render";
import type { NormalizedNotam } from "@/services/notam/notamTypes";
import type { EnhancedNotam } from "@/services/airspace/airspaceTypes";

const toggleUseLiveNotams = vi.fn();

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
  const toEnhancedNotam = (notam: NormalizedNotam): EnhancedNotam => ({
    ...notam,
    enhancedGeometry: null,
    sourceGeometry: notam.geometry,
    issues: [],
  });

  beforeEach(() => {
    toggleUseLiveNotams.mockReset();
  });

  it("renders empty state when no NOTAMs are available", () => {
    vi.spyOn(StreamsProvider, "useSharedNotamStream").mockReturnValue({
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
      enhancementError: null,
      isLoading: false,
      effectiveDate: null,
    });

    renderWithRouter(<NotamsPanel />, { route: "/notams" });

    expect(screen.getByText("No NOTAMs available right now.")).toBeInTheDocument();
    expect(screen.getByText("Total: 0 • Displayed: 0")).toBeInTheDocument();
  });

  it("renders NOTAMs even without geometry", () => {
    const notamWithoutGeometry = toEnhancedNotam(makeNotam({
      id: "C1234/25",
      summary: "TEST NOTAM WITHOUT GEOMETRY",
      geometry: null,
    }));

    vi.spyOn(StreamsProvider, "useSharedNotamStream").mockReturnValue({
      data: [notamWithoutGeometry],
      status: "live",
      lastOkUtc: "",
      lastErrorUtc: null,
      tick: 0,
      ageSeconds: 5,
      error: null,
      rawCount: 1,
      displayedCount: 1,
      dataSource: "live",
      liveError: null,
      enhancementError: null,
      isLoading: false,
      effectiveDate: null,
    });

    renderWithRouter(<NotamsPanel />, { route: "/notams" });

    expect(screen.getByText("C1234/25")).toBeInTheDocument();
    expect(screen.getByText("TEST NOTAM WITHOUT GEOMETRY")).toBeInTheDocument();
    expect(screen.getByText("Total: 1 • Displayed: 1")).toBeInTheDocument();
  });

  it("renders a list of NOTAMs with altitude fallbacks", () => {
    const notamWithAltitude = toEnhancedNotam(makeNotam({
      id: "A0001/25",
      summary: "ALT LIMIT",
    }));
    const notamWithoutAltitude = toEnhancedNotam(makeNotam({
      id: "A0002/25",
      summary: "NO ALT LIMIT",
      altitudes: [],
    }));

    vi.spyOn(StreamsProvider, "useSharedNotamStream").mockReturnValue({
      data: [notamWithAltitude, notamWithoutAltitude],
      status: "live",
      lastOkUtc: "2025-01-01T00:00:00Z",
      lastErrorUtc: null,
      tick: 0,
      ageSeconds: 10,
      error: null,
      rawCount: 2,
      displayedCount: 2,
      dataSource: "live",
      liveError: null,
      enhancementError: null,
      isLoading: false,
      effectiveDate: null,
    });

    renderWithRouter(<NotamsPanel />, { route: "/notams" });

    expect(screen.getByText("A0001/25")).toBeInTheDocument();
    expect(screen.getByText("ALT LIMIT")).toBeInTheDocument();
    expect(screen.getByText("A0002/25")).toBeInTheDocument();
    expect(screen.getByText("NO ALT LIMIT")).toBeInTheDocument();
    expect(screen.getByText("No altitude limits")).toBeInTheDocument();
  });

  it("toggles the NOTAM live mode control", () => {
    vi.spyOn(StreamsProvider, "useSharedNotamStream").mockReturnValue({
      data: [],
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
      enhancementError: null,
      isLoading: false,
      effectiveDate: null,
    });

    renderWithRouter(<NotamsPanel />, { route: "/notams" });

    fireEvent.click(screen.getByRole("button", { name: /Switch to Live/i }));

    expect(toggleUseLiveNotams).toHaveBeenCalledTimes(1);
  });

  it("labels live fallback data as mock fallback", () => {
    vi.spyOn(StreamsProvider, "useSharedNotamStream").mockReturnValue({
      data: [],
      status: "live",
      lastOkUtc: null,
      lastErrorUtc: null,
      tick: 0,
      ageSeconds: null,
      error: null,
      rawCount: 0,
      displayedCount: 0,
      dataSource: "fallback",
      liveError: new Error("Timeout"),
      enhancementError: null,
      isLoading: false,
      effectiveDate: null,
    });

    renderWithRouter(<NotamsPanel />, { route: "/notams" });

    expect(screen.getByText("Mock (live fallback)")).toBeInTheDocument();
    expect(screen.getByText(/Live NOTAM fetch failed: Timeout/)).toBeInTheDocument();
  });
});
