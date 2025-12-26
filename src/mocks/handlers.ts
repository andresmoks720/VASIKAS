import { http, HttpResponse } from "msw";

const DRONE_POSITIONS = [
  { lon: 24.7536, lat: 59.4369 },
  { lon: 24.7565, lat: 59.439 },
  { lon: 24.7605, lat: 59.4372 },
  { lon: 24.7568, lat: 59.4348 },
  { lon: 24.7525, lat: 59.4355 },
] as const;

const BASE_DRONE = {
  id: "drone-001",
  label: "DJI Mavic (demo)",
  headingDeg: 90,
  speedMps: 12.4,
  altitude: {
    meters: 86,
    ref: "AGL" as const,
    source: "reported" as const,
    comment: "MSW mock",
  },
  eventTimeUtc: "2025-12-18T10:15:30Z",
};

const SENSORS = [
  {
    id: "sensor-425006",
    name: "Demo Sensor A",
    kind: "aeroscope",
    position: {
      lon: 24.744,
      lat: 59.428,
    },
    status: "online",
    lastSeenUtc: "2025-12-18T10:15:25Z",
    coverage: {
      radiusMeters: 5000,
      minAltM: 0,
      maxAltM: 500,
    },
  },
  {
    id: "sensor-radar-1",
    name: "Demo Radar",
    kind: "radar",
    position: {
      lon: 24.76,
      lat: 59.44,
    },
    status: "online",
    lastSeenUtc: "2025-12-18T10:15:25Z",
    coverage: {
      radiusMeters: 12000,
      minAltM: 0,
      maxAltM: 3000,
    },
  },
  {
    id: "sensor-rfdf-1",
    name: "Demo RF DF",
    kind: "rf_df",
    position: {
      lon: 24.75,
      lat: 59.435,
    },
    status: "degraded",
    lastSeenUtc: "2025-12-18T10:10:00Z",
    coverage: {
      radiusMeters: 3000,
      minAltM: 0,
      maxAltM: 200,
    },
  },
] as const;

let droneRequestCount = 0;
const SNAPSHOT_TIME_UTC = "2025-12-18T10:15:30Z";
const SNAPSHOT_EPOCH_SEC = Math.floor(Date.parse(SNAPSHOT_TIME_UTC) / 1000);

const parseNumberParam = (value: string | null, fallback: number) => {
  if (value === null) {
    return fallback;
  }

  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : fallback;
};

const parseCenterParam = (value: string | null) => {
  if (!value) {
    return { lat: 0, lon: 0 };
  }

  const [latRaw, lonRaw] = value.split(",");
  const lat = parseNumberParam(latRaw ?? null, 0);
  const lon = parseNumberParam(lonRaw ?? null, 0);

  return { lat, lon };
};

const nextDroneStep = () => {
  const position = DRONE_POSITIONS[droneRequestCount % DRONE_POSITIONS.length];
  droneRequestCount += 1;

  return [{ ...BASE_DRONE, position }];
};

export function resetMockHandlers() {
  droneRequestCount = 0;
}

const adsbHandlers: ReturnType<typeof http.get>[] = [];

if (process.env.MSW_ENABLE_ADSB === "1") {
  const ADSB = [
    {
      id: "4ca123",
      callsign: "FIN123",
      position: {
        lon: 24.832,
        lat: 59.413,
      },
      trackDeg: 275,
      groundSpeedKmh: 720,
      altitude: {
        meters: 3500,
        ref: "MSL" as const,
        source: "reported" as const,
        comment: "ADS-B reported",
      },
      eventTimeUtc: "2025-12-18T10:15:20Z",
    },
  ] as const;

  adsbHandlers.push(http.get("/mock/adsb.json", () => HttpResponse.json(ADSB)));
}

export const handlers = [
  http.get("/mock/drones.json", () => HttpResponse.json(nextDroneStep())),
  http.get("/mock/sensors.json", () => HttpResponse.json(SENSORS)),
  http.get(/\/v1\/drones/, ({ request }) => {
    const url = new URL(request.url);
    const center = parseCenterParam(url.searchParams.get("center"));
    const radiusM = parseNumberParam(url.searchParams.get("radius_m"), 0);
    const n = parseNumberParam(url.searchParams.get("n"), 1);
    const periodS = parseNumberParam(url.searchParams.get("period_s"), 0);
    const count = Math.max(1, Math.floor(n));
    const offset = radiusM > 0 ? Math.min(radiusM, 1000) / 100000 : 0.01;
    const drones = Array.from({ length: count }, (_, index) => {
      const step = index % 2 === 0 ? 1 : -1;
      return {
        id: `msw-drone-${index + 1}`,
        label: "MSW Drone",
        position: {
          lat: center.lat + offset * step,
          lon: center.lon + offset * step,
        },
        headingDeg: 45,
        speedMps: 10,
        altitude: {
          meters: 150,
          ref: "AGL",
          source: "reported",
          comment: "MSW generated",
        },
        eventTimeUtc: SNAPSHOT_TIME_UTC,
      };
    });

    return HttpResponse.json({
      server_time_utc: SNAPSHOT_TIME_UTC,
      t_sec_used: SNAPSHOT_EPOCH_SEC,
      center,
      meta: {
        model: "msw-snapshot",
        radius_m: radiusM,
        n,
        period_s: periodS,
      },
      drones,
    });
  }),
  http.all("*", ({ request }) => {
    console.log("[MSW] Unhandled request:", request.url);
    return new HttpResponse(null, { status: 404 });
  }),
  ...adsbHandlers,
];
