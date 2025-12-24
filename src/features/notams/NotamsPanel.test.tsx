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
});
