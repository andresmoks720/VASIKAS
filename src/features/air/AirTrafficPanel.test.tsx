import React from "react";
import { screen } from "@testing-library/react";
import { vi } from "vitest";

import { AirTrafficPanel } from "./AirTrafficPanel";
import { makeAircraft } from "@/shared/test/factories";
import { renderWithRouter } from "@/shared/test/render";

const adsbStreamState = {
  data: [] as ReturnType<typeof makeAircraft>[],
  status: "live" as const,
  ageSeconds: 1,
  error: null as Error | null,
};

vi.mock("@/services/streams/StreamsProvider", () => ({
  useSharedAdsbStream: () => adsbStreamState,
}));

vi.mock("@/layout/MapShell/useSidebarUrlState", () => ({
  useSidebarUrlState: () => ({ selectEntity: vi.fn() }),
}));

describe("AirTrafficPanel", () => {
  it("renders the empty state when there are no flights", () => {
    adsbStreamState.data = [];

    renderWithRouter(<AirTrafficPanel />, { route: "/air" });

    expect(screen.getByText("No aircraft visible right now.")).toBeInTheDocument();
  });

  it("renders formatted altitude and speed for aircraft", () => {
    adsbStreamState.data = [makeAircraft()];

    renderWithRouter(<AirTrafficPanel />, { route: "/air" });

    expect(screen.getByText(/FIN123/)).toBeInTheDocument();
    expect(
      screen.getByText("Altitude: 3500 m (11483 ft) — MSL (reported) — ADS-B reported"),
    ).toBeInTheDocument();
    expect(screen.getByText("Ground speed: 720 km/h")).toBeInTheDocument();
  });
});
