import React from "react";
import { screen } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { NotamsPanel } from "./NotamsPanel";
import * as StreamsProvider from "@/services/streams/StreamsProvider";
import { makeNotam } from "@/shared/test/factories";
import { renderWithRouter } from "@/shared/test/render";

vi.mock("@/layout/MapShell/useSidebarUrlState", () => ({
  useSidebarUrlState: () => ({
    selectEntity: vi.fn(),
  }),
}));

describe("NotamsPanel", () => {
  it("renders empty state when no NOTAMs are available", () => {
    vi.spyOn(StreamsProvider, "useSharedNotamStream").mockReturnValue({
      data: [],
      status: "live",
      lastOkUtc: null,
      lastErrorUtc: null,
      tick: 0,
      ageSeconds: null,
      error: null,
    });

    renderWithRouter(<NotamsPanel />, { route: "/notams" });

    expect(screen.getByText("No NOTAMs available right now.")).toBeInTheDocument();
  });

  it("renders NOTAMs even without geometry", () => {
    const notamWithoutGeometry = makeNotam({
      id: "C1234/25",
      summary: "TEST NOTAM WITHOUT GEOMETRY",
      geometry: null,
    });

    vi.spyOn(StreamsProvider, "useSharedNotamStream").mockReturnValue({
      data: [notamWithoutGeometry],
      status: "live",
      lastOkUtc: "",
      lastErrorUtc: null,
      tick: 0,
      ageSeconds: 5,
      error: null,
    });

    renderWithRouter(<NotamsPanel />, { route: "/notams" });

    expect(screen.getByText("C1234/25")).toBeInTheDocument();
    expect(screen.getByText("TEST NOTAM WITHOUT GEOMETRY")).toBeInTheDocument();
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

    vi.spyOn(StreamsProvider, "useSharedNotamStream").mockReturnValue({
      data: [notamWithAltitude, notamWithoutAltitude],
      status: "live",
      lastOkUtc: "2025-01-01T00:00:00Z",
      lastErrorUtc: null,
      tick: 0,
      ageSeconds: 10,
      error: null,
    });

    renderWithRouter(<NotamsPanel />, { route: "/notams" });

    expect(screen.getByText("A0001/25")).toBeInTheDocument();
    expect(screen.getByText("ALT LIMIT")).toBeInTheDocument();
    expect(screen.getByText("A0002/25")).toBeInTheDocument();
    expect(screen.getByText("NO ALT LIMIT")).toBeInTheDocument();
    expect(screen.getByText("No altitude limits")).toBeInTheDocument();
  });
});
