import React from "react";
import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import {
  StreamsProvider,
  useSharedAdsbStream,
  useSharedDronesStream,
  useSharedNotamStream,
  useSharedSensorsStream,
} from "./StreamsProvider";

const adsbStream = {
  data: null,
  status: "idle",
  lastOkUtc: null,
  lastErrorUtc: null,
  ageSeconds: null,
  error: null,
  tick: 0,
};

const dronesStream = {
  data: [],
  status: "live",
  lastOkUtc: "2025-01-01T00:00:00Z",
  lastErrorUtc: null,
  ageSeconds: 1,
  error: null,
  tick: 2,
};

const sensorsStream = {
  data: null,
  status: "stale",
  lastOkUtc: null,
  lastErrorUtc: "2025-01-01T00:05:00Z",
  ageSeconds: 120,
  error: new Error("stale"),
  tick: 3,
};

const notamStream = {
  data: null,
  status: "error",
  lastOkUtc: null,
  lastErrorUtc: "2025-01-01T00:10:00Z",
  ageSeconds: null,
  error: new Error("boom"),
  tick: 4,
};

vi.mock("@/services/adsb/adsbClient", () => ({
  useAdsbStream: () => adsbStream,
}));

vi.mock("@/services/drones/droneClient", () => ({
  useDronesStream: () => dronesStream,
}));

vi.mock("@/services/sensors/sensorsClient", () => ({
  useSensorsStream: () => sensorsStream,
}));

vi.mock("@/services/notam/notamStream", () => ({
  useNotamStream: () => notamStream,
}));

function Consumer() {
  const adsb = useSharedAdsbStream();
  const drones = useSharedDronesStream();
  const sensors = useSharedSensorsStream();
  const notams = useSharedNotamStream();

  return (
    <>
      <span>adsb:{adsb.status}</span>
      <span>drones:{drones.status}</span>
      <span>sensors:{sensors.status}</span>
      <span>notams:{notams.status}</span>
    </>
  );
}

describe("StreamsProvider", () => {
  it("exposes stream values to shared hooks", () => {
    render(
      <StreamsProvider>
        <Consumer />
      </StreamsProvider>,
    );

    expect(screen.getByText("adsb:idle")).toBeInTheDocument();
    expect(screen.getByText("drones:live")).toBeInTheDocument();
    expect(screen.getByText("sensors:stale")).toBeInTheDocument();
    expect(screen.getByText("notams:error")).toBeInTheDocument();
  });

  it("throws when shared hooks are used without the provider", () => {
    const consoleError = vi.spyOn(console, "error").mockImplementation(() => { });

    expect(() => render(<Consumer />)).toThrowError("StreamsProvider is missing in the component tree");

    consoleError.mockRestore();
  });

  describe("Snapshot Mode", () => {
    beforeEach(() => {
      vi.resetModules();
    });

    it("uses snapshot stream when configured in env", async () => {
      // Re-mock dependencies for this specific test
      vi.doMock("@/shared/env", () => ({
        ENV: {
          drones: {
            mode: () => "snapshot",
          },
        },
      }));

      const snapshotData = [{ id: "snap1", label: "Snapshot Drone" }];
      vi.doMock("@/services/drones/droneSnapshotClient", () => ({
        useDronesSnapshotStream: () => ({
          data: snapshotData,
          status: "live",
        }),
      }));

      // Mock others to avoid errors
      vi.doMock("@/services/adsb/adsbClient", () => ({ useAdsbStream: () => ({ status: "idle" }) }));
      vi.doMock("@/services/drones/droneClient", () => ({ useDronesStream: () => ({ status: "idle" }) }));
      vi.doMock("@/services/sensors/sensorsClient", () => ({ useSensorsStream: () => ({ status: "idle" }) }));
      vi.doMock("@/services/notam/notamStream", () => ({ useNotamStream: () => ({ status: "idle" }) }));

      // Import fresh module
      const { StreamsProvider, useSharedDronesStream } = await import("./StreamsProvider");

      function SnapshotConsumer() {
        const drones = useSharedDronesStream();
        const firstId = Array.isArray(drones.data) ? drones.data[0]?.id : undefined;
        return <span>drones-id:{firstId}</span>;
      }

      render(
        <StreamsProvider>
          <SnapshotConsumer />
        </StreamsProvider>
      );

      expect(screen.getByText("drones-id:snap1")).toBeInTheDocument();
    });
  });
});
