import React from "react";
import { render, screen } from "@testing-library/react";
import { vi } from "vitest";

import { KnownDronesPanel } from "./KnownDronesPanel";

vi.mock("@/services/streams/StreamsProvider", () => ({
  useSharedDronesStream: () => ({
    data: [
      {
        id: "drone-001",
        label: "Demo Drone",
        position: { lon: 24.7536, lat: 59.4369 },
        headingDeg: 95,
        speedMps: 12.4,
        altitude: {
          meters: 120,
          ref: "AGL",
          source: "detected",
          comment: "",
        },
        eventTimeUtc: "2025-12-18T10:15:30Z",
        ingestTimeUtc: "2025-12-18T10:15:31Z",
      },
    ],
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
    render(<KnownDronesPanel />);

    expect(screen.getByText(/Demo Drone/)).toBeInTheDocument();
    expect(screen.getByText("Altitude: 120 m — AGL (detected) — from upstream")).toBeInTheDocument();
    expect(screen.getByText("Speed: 12.4 m/s")).toBeInTheDocument();
    expect(screen.getByText("Last update: 2025-12-18T10:15:31Z")).toBeInTheDocument();
  });
});
