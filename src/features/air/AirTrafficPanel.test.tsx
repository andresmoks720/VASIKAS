import React from "react";
import { screen } from "@testing-library/react";
import { vi } from "vitest";

import { AirTrafficPanel } from "./AirTrafficPanel";
import { makeAircraft } from "@/shared/test/factories";
import { renderWithRouter } from "@/shared/test/render";

vi.mock("@/services/streams/StreamsProvider", () => ({
  useSharedAdsbStream: () => ({
    data: [makeAircraft()],
    status: "live",
    ageSeconds: 1,
    error: null,
  }),
}));

vi.mock("@/layout/MapShell/useSidebarUrlState", () => ({
  useSidebarUrlState: () => ({ selectEntity: vi.fn() }),
}));

describe("AirTrafficPanel", () => {
  it("renders formatted altitude and speed for aircraft", () => {
    renderWithRouter(<AirTrafficPanel />, { route: "/air" });

    expect(screen.getByText(/FIN123/)).toBeInTheDocument();
    expect(
      screen.getByText("Altitude: 3500 m (11483 ft) — MSL (reported) — ADS-B reported"),
    ).toBeInTheDocument();
    expect(screen.getByText("Ground speed: 720 km/h")).toBeInTheDocument();
  });
});
