import { Drone } from "@/services/drones/droneTypes";
import { Aircraft } from "@/services/adsb/adsbTypes";
import { Sensor } from "@/services/sensors/sensorsTypes";
import { Geofence } from "@/services/geofences/geofenceStore";
import { NormalizedNotam } from "@/services/notam/notamTypes";
import { Altitude } from "@/shared/types/domain";

const DEFAULT_TIME_UTC = "2025-01-01T00:00:00Z";

function makeAltitude(overrides: Partial<Altitude> = {}): Altitude {
  return {
    meters: 120,
    ref: "AGL",
    source: "reported",
    comment: "mock altitude",
    ...overrides,
  };
}

export function makeDrone(overrides: Partial<Drone> = {}): Drone {
  return {
    id: "drone-001",
    label: "Demo Drone",
    position: { lon: 24.7536, lat: 59.4369 },
    headingDeg: 95,
    speedMps: 12.4,
    altitude: makeAltitude({ source: "detected" }),
    eventTimeUtc: DEFAULT_TIME_UTC,
    ingestTimeUtc: DEFAULT_TIME_UTC,
    ...overrides,
  };
}

export function makeAircraft(overrides: Partial<Aircraft> = {}): Aircraft {
  return {
    id: "4ca123",
    callsign: "FIN123",
    position: { lon: 24.832, lat: 59.413 },
    positionSource: "current",
    trackDeg: 180,
    groundSpeedKmh: 720,
    altitude: makeAltitude({
      meters: 3500,
      ref: "MSL",
      source: "reported",
      comment: "ADS-B reported",
    }),
    eventTimeUtc: DEFAULT_TIME_UTC,
    ingestTimeUtc: DEFAULT_TIME_UTC,
    registration: "OH-XYZ",
    aircraftType: "A320",
    ...overrides,
  };
}

export function makeSensor(overrides: Partial<Sensor> = {}): Sensor {
  return {
    id: "sensor-001",
    name: "Demo Sensor",
    kind: "radar",
    position: { lon: 24.5, lat: 59.5 },
    status: "online",
    lastSeenUtc: DEFAULT_TIME_UTC,
    coverage: { radiusMeters: 3000, minAltM: 0, maxAltM: 500 },
    ingestTimeUtc: DEFAULT_TIME_UTC,
    source: "base",
    ...overrides,
  };
}

export function makeGeofence(overrides: Partial<Geofence> = {}): Geofence {
  return {
    id: "geofence-001",
    name: "Test Zone",
    geometry: { kind: "circle", center: { lon: 24, lat: 59 }, radiusMeters: 500 },
    createdAtUtc: DEFAULT_TIME_UTC,
    updatedAtUtc: DEFAULT_TIME_UTC,
    ...overrides,
  };
}

export function makeNotam(overrides: Partial<NormalizedNotam> = {}): NormalizedNotam {
  return {
    id: "A1234/25",
    summary: "TEMP RESTRICTED AREA",
    text: "TEMP RESTRICTED AREA FOR DRONE OPS",
    validFromUtc: DEFAULT_TIME_UTC,
    validToUtc: "2025-01-02T00:00:00Z",
    altitudes: [
      makeAltitude({
        meters: 300,
        ref: "MSL",
        source: "reported",
        comment: "from NOTAM",
      }),
    ],
    geometry: { kind: "circle", center: [24.75, 59.44], radiusMeters: 5000 },
    eventTimeUtc: DEFAULT_TIME_UTC,
    raw: { id: "A1234/25" },
    ...overrides,
  };
}
