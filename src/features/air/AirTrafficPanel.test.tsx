import React from "react";
import { render, screen } from "@testing-library/react";
import { vi } from "vitest";

import { AirTrafficPanel } from "./AirTrafficPanel";

vi.mock("@/services/streams/StreamsProvider", () => ({
  useSharedAdsbStream: () => ({
    data: [
      {
        id: "4ca123",
        callsign: "FIN123",
        position: { lon: 24.832, lat: 59.413 },
        trackDeg: 180,
        groundSpeedKmh: 720,
        altitude: {
          meters: 3500,
          ref: "MSL",
          source: "reported",
          comment: "ADS-B reported",
        },
        eventTimeUtc: "2025-12-18T10:15:20Z",
        ingestTimeUtc: "2025-12-18T10:15:21Z",
      },
    ],
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
    render(<AirTrafficPanel />);

    expect(screen.getByText(/FIN123/)).toBeInTheDocument();
    expect(
      screen.getByText("Altitude: 3500 m (11483 ft) — MSL (reported) — ADS-B reported"),
    ).toBeInTheDocument();
    expect(screen.getByText("Ground speed: 720 km/h")).toBeInTheDocument();
  });
});
