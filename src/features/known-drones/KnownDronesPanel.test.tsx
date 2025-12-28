import React from "react";
import { screen } from "@testing-library/react";
import { vi } from "vitest";

import { KnownDronesPanel } from "./KnownDronesPanel";
import { makeDrone } from "@/shared/test/factories";
import { renderWithRouter } from "@/shared/test/render";

const dronesStreamState = {
  data: [] as ReturnType<typeof makeDrone>[],
  status: "live" as const,
  ageSeconds: 2,
  error: null as Error | null,
};

vi.mock("@/services/streams/StreamsProvider", () => ({
  useSharedDronesStream: () => dronesStreamState,
}));

vi.mock("@/layout/MapShell/useSidebarUrlState", () => ({
  useSidebarUrlState: () => ({ selectEntity: vi.fn() }),
}));

describe("KnownDronesPanel", () => {
  it("renders the empty state when no drones are available", () => {
    dronesStreamState.data = [];

    renderWithRouter(<KnownDronesPanel />, { route: "/known-drones" });

    expect(screen.getByText("No drones reported yet.")).toBeInTheDocument();
  });

  it("renders formatted altitude and speed for drones", () => {
    dronesStreamState.data = [makeDrone({ ingestTimeUtc: "2025-12-18T10:15:31Z" })];

    renderWithRouter(<KnownDronesPanel />, { route: "/known-drones" });

    expect(screen.getByText(/Demo Drone/)).toBeInTheDocument();
    expect(screen.getByText("Altitude: 120 m — AGL (detected) — mock altitude")).toBeInTheDocument();
    expect(screen.getByText("Speed: 12.4 m/s")).toBeInTheDocument();
    expect(screen.getByText("Last update: 2025-12-18T10:15:31Z")).toBeInTheDocument();
  });
});
