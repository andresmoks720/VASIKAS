import { readFileSync } from "node:fs";

import { describe, expect, it } from "vitest";

import type { AdsbTrackDto } from "@/services/adsb/adsbTypes";
import { mapAdsbTrackDtos } from "@/services/adsb/adsbTypes";
import type { DroneTrackDto } from "@/services/drones/droneTypes";
import { mapDroneTrackDtos } from "@/services/drones/droneTypes";

function readMockJson(relativePath: string): unknown {
  const fileUrl = new URL(relativePath, import.meta.url);
  const raw = readFileSync(fileUrl, "utf-8");
  return JSON.parse(raw);
}

describe("mock fixtures", () => {
  it("parses ADS-B mock tracks", () => {
    const raw = readMockJson("../../public/mock/adsb.json");
    if (!Array.isArray(raw)) {
      throw new Error("ADS-B mock fixture must be an array.");
    }
    const tracks = mapAdsbTrackDtos(raw as AdsbTrackDto[]);

    expect(tracks.length).toBeGreaterThan(0);
    expect(tracks[0]?.track.length).toBeGreaterThan(0);
  });

  it("parses drone mock tracks", () => {
    const raw = readMockJson("../../public/mock/drones.json");
    if (!Array.isArray(raw)) {
      throw new Error("Drone mock fixture must be an array.");
    }
    const tracks = mapDroneTrackDtos(raw as DroneTrackDto[]);

    expect(tracks.length).toBeGreaterThan(0);
    expect(tracks[0]?.track.length).toBeGreaterThan(0);
  });
});
