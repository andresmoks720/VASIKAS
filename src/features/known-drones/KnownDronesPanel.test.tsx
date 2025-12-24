import React from "react";
import { screen } from "@testing-library/react";
import { vi } from "vitest";

import { KnownDronesPanel } from "./KnownDronesPanel";
import { makeDrone } from "@/shared/test/factories";
import { renderWithRouter } from "@/shared/test/render";

vi.mock("@/services/streams/StreamsProvider", () => ({
  useSharedDronesStream: () => ({
    data: [makeDrone({ ingestTimeUtc: "2025-12-18T10:15:31Z" })],
    status: "live",
    ageSeconds: 2,
    error: null,
  }),
}));

vi.mock("@/layout/MapShell/useSidebarUrlState", () => ({
  useSidebarUrlState: () => ({ selectEntity: vi.fn() }),
}));

describe("KnownDronesPanel", () => {
  it("renders formatted altitude and speed for drones", () => {
    renderWithRouter(<KnownDronesPanel />, { route: "/drones" });

    expect(screen.getByText(/Demo Drone/)).toBeInTheDocument();
    expect(screen.getByText("Altitude: 120 m — AGL (detected) — mock altitude")).toBeInTheDocument();
    expect(screen.getByText("Speed: 12.4 m/s")).toBeInTheDocument();
    expect(screen.getByText("Last update: 2025-12-18T10:15:31Z")).toBeInTheDocument();
  });
});
