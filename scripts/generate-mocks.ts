import * as fs from 'node:fs';
import * as path from 'node:path';

// --- Configuration ---
const SEED = 1337;
const TALLINN_CENTER = { lon: 24.7536, lat: 59.4369 };
const BASE_TIME = "2025-12-18T10:00:00Z";
const DURATION_SEC = 120;

// --- Helpers ---

class Mulberry32 {
  private state: number;

  constructor(seed: number) {
    this.state = seed;
  }

  next(): number {
    let t = (this.state += 0x6D2B79F5);
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  }

  nextRange(min: number, max: number): number {
    return min + this.next() * (max - min);
  }

  nextItem<T>(items: T[]): T {
    return items[Math.floor(this.next() * items.length)];
  }
}

const rng = new Mulberry32(SEED);

function ensureDir(dirPath: string) {
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
  }
}

function writeJson(filePath: string, data: any) {
  ensureDir(path.dirname(filePath));
  // Use a replacer or just rely on V8 key order for now, generally stable for object literals defined mostly consistently.
  // For strictly deterministic keys, we'd need a consistent-stringify function.
  // Given the requirements, JSON.stringify(data, null, 2) is adequate if we construct objects consistently.
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2) + '\n');
  console.log(`Generated ${filePath}`);
}

function writeNdjson(filePath: string, items: any[]) {
  ensureDir(path.dirname(filePath));
  // Sort by eventTimeUtc to ensure NDJSON valid ordering conventions
  const sortedItems = [...items].sort((a, b) => {
    return new Date(a.eventTimeUtc).getTime() - new Date(b.eventTimeUtc).getTime();
  });

  const content = sortedItems.map(i => JSON.stringify(i)).join('\n') + '\n';
  fs.writeFileSync(filePath, content);
  console.log(`Generated ${filePath}`);
}

// --- Types ---

type Position = { lon: number; lat: number };
// ... existing types ...

// --- Generators ---

function generateSensors() {
  return [
    {
      id: "sensor-425006",
      name: "Demo Sensor A",
      kind: "aeroscope",
      position: { lon: 24.744, lat: 59.428 },
      status: "online",
      lastSeenUtc: "2025-12-18T10:15:25Z",
      coverage: { radiusMeters: 5000, minAltM: 0, maxAltM: 500 }
    },
    {
      id: "sensor-radar-1",
      name: "Demo Radar",
      kind: "radar",
      position: { lon: 24.760, lat: 59.440 },
      status: "online",
      lastSeenUtc: "2025-12-18T10:15:25Z",
      coverage: { radiusMeters: 12000, minAltM: 0, maxAltM: 3000 }
    },
    {
      id: "sensor-rfdf-1",
      name: "Demo RF DF",
      kind: "rf_df",
      position: { lon: 24.750, lat: 59.435 },
      status: "degraded",
      lastSeenUtc: "2025-12-18T10:10:00Z",
      coverage: { radiusMeters: 3000, minAltM: 0, maxAltM: 200 }
    }
  ];
}

function generateDrones() {
  return [
    {
      id: "drone-001",
      label: "DJI Mavic (demo)",
      position: { lon: 24.7536, lat: 59.4369 },
      headingDeg: 90,
      speedMps: 12.4,
      altitude: { meters: 86, ref: "AGL", source: "reported", comment: "AeroScope mock" },
      eventTimeUtc: "2025-12-18T10:15:30Z"
    }
  ];
}

function generateAdsb() {
  return [
    {
      id: "4ca123",
      callsign: "FIN123",
      position: { lon: 24.832, lat: 59.413 },
      trackDeg: 275,
      groundSpeedKmh: 720,
      altitude: {
        meters: 3500,
        ref: "MSL",
        source: "reported",
        comment: "ADS-B reported"
      },
      eventTimeUtc: "2025-12-18T10:15:20Z"
    }
  ];
}

function generateNotams() {
  return {
    generatedAtUtc: "2025-12-18T10:00:00Z",
    items: [
      {
        id: "A1234/25",
        text: "TEMP RESTRICTED AREA ... SFC TO 3000FT AMSL ...",
        validFromUtc: "2025-12-18T00:00:00Z",
        validToUtc: "2025-12-19T23:59:59Z",
        geometryHint: {
          type: "circle",
          center: { lon: 24.7536, lat: 59.4369 },
          radiusMeters: 1000
        }
      },
      {
        id: "B5678/25",
        text: "DRONE EXERCISE ... GND TO 500FT AGL ...",
        validFromUtc: "2025-12-18T08:00:00Z",
        validToUtc: "2025-12-18T16:00:00Z",
        geometryHint: {
          type: "polygon",
          coordinates: [
            [24.74, 59.43],
            [24.76, 59.43],
            [24.76, 59.44],
            [24.74, 59.44],
            [24.74, 59.43]
          ]
        }
      }
    ]
  };
}

// --- Scenario Generation ---

function interpolate(start: number, end: number, fraction: number) {
  return start + (end - start) * fraction;
}

function generateScenarioLinear1() {
  const scenarioId = "linear-1";
  const baseDir = `public/mock/scenarios/${scenarioId}`;

  // 1. scenario.json
  const scenario = {
    version: "0.1",
    scenarioId: scenarioId,
    t0Utc: BASE_TIME,
    durationSec: DURATION_SEC,
    playback: { speed: 1, loop: true },
    truth: { format: "mfjson", path: "./truth.mfjson" },
    sensors: { path: "./sensors.json" },
    streams: [
      {
        streamId: "aeroscope-demo",
        kind: "telemetry",
        sensorKind: "aeroscope",
        emitHz: 1,
        model: { noiseMeters: 2, dropoutPct: 0.0 }
      },
      {
        streamId: "radar-demo",
        kind: "track_update",
        sensorKind: "radar",
        emitHz: 1,
        model: { noiseMeters: 25, idSwapPct: 0.02 }
      }
    ]
  };
  writeJson(`${baseDir}/scenario.json`, scenario);

  // 2. sensors.json (scenario specific)
  const scenarioSensors = [
    {
      id: "sensor-425006",
      name: "Demo AeroScope",
      kind: "aeroscope",
      position: { lon: 24.744, lat: 59.428 },
      config: { rangeMeters: 5000 }
    },
    {
      id: "sensor-radar-1",
      name: "Demo Radar",
      kind: "radar",
      position: { lon: 24.760, lat: 59.440 },
      config: { rangeMeters: 12000 }
    }
  ];
  writeJson(`${baseDir}/sensors.json`, scenarioSensors);

  // 3. Truth Data (Drone & Aircraft)
  // Drone Path: Linear movement
  const droneStart = { lon: 24.7500, lat: 59.4300 };
  const droneEnd = { lon: 24.7600, lat: 59.4350 };
  const droneAlt = 80;

  // Aircraft Path: Linear movement
  const aircraftStart = { lon: 24.8000, lat: 59.4100 };
  const aircraftEnd = { lon: 24.7000, lat: 59.4500 };
  const aircraftAlt = 3000;

  const steps = DURATION_SEC; // 1Hz
  const droneCoords: number[][] = [];
  const droneTimes: string[] = [];
  const droneAlts: number[] = [];

  const aircraftCoords: number[][] = [];
  const aircraftTimes: string[] = [];
  const aircraftAlts: number[] = [];

  const startTime = new Date(BASE_TIME).getTime();

  for (let i = 0; i <= steps; i++) {
    const fraction = i / steps;
    const t = new Date(startTime + i * 1000).toISOString();

    // Drone
    droneCoords.push([
      interpolate(droneStart.lon, droneEnd.lon, fraction),
      interpolate(droneStart.lat, droneEnd.lat, fraction)
    ]);
    droneTimes.push(t);
    droneAlts.push(droneAlt + Math.sin(i * 0.1) * 2); // Slight wobble

    // Aircraft
    aircraftCoords.push([
      interpolate(aircraftStart.lon, aircraftEnd.lon, fraction),
      interpolate(aircraftStart.lat, aircraftEnd.lat, fraction)
    ]);
    aircraftTimes.push(t);
    aircraftAlts.push(aircraftAlt);
  }

  // truth.mfjson
  const truthMfjson = {
    type: "FeatureCollection",
    features: [
      {
        type: "Feature",
        properties: {
          entityId: "drone-001",
          entityKind: "drone",
          datetimes: droneTimes,
          altitudeM: droneAlts,
          altitudeRef: "AGL"
        },
        geometry: {
          type: "LineString",
          coordinates: droneCoords
        }
      },
      {
        type: "Feature",
        properties: {
          entityId: "flight-001",
          entityKind: "aircraft",
          datetimes: aircraftTimes,
          altitudeM: aircraftAlts,
          altitudeRef: "MSL"
        },
        geometry: {
          type: "LineString",
          coordinates: aircraftCoords
        }
      }
    ]
  };
  writeJson(`${baseDir}/truth.mfjson`, truthMfjson);

  // truth.gpx (Corrected attributes)
  let gpxContent = `<?xml version="1.0" encoding="UTF-8"?>
<gpx version="1.1" creator="Antigravity">
  <trk>
    <name>drone-001</name>
    <trkseg>
`;
  for (let i = 0; i < droneCoords.length; i++) {
    // GPX 1.1 uses lat, lon attributes on trkpt
    gpxContent += `      <trkpt lat="${droneCoords[i][1]}" lon="${droneCoords[i][0]}">
        <ele>${droneAlts[i]}</ele>
        <time>${droneTimes[i]}</time>
      </trkpt>
`;
  }
  gpxContent += `    </trkseg>
  </trk>
</gpx>`;
  ensureDir(baseDir);
  fs.writeFileSync(`${baseDir}/truth.gpx`, gpxContent);
  console.log(`Generated ${baseDir}/truth.gpx`);


  // 4. observations.ndjson
  const observations: any[] = [];

  for (let i = 0; i < steps; i++) { // Don't include the last point for velocity calc simplicity or just do steps
    const t = droneTimes[i];
    const nextT = droneTimes[i + 1] || t; // Fallback for last point

    // Drone Telemetry (AeroScope)
    const dronePos = { lon: droneCoords[i][0], lat: droneCoords[i][1] };
    // Simple velocity calc
    const dLon = (droneCoords[i + 1]?.[0] ?? droneCoords[i][0]) - droneCoords[i][0];
    const dLat = (droneCoords[i + 1]?.[1] ?? droneCoords[i][1]) - droneCoords[i][1];
    const heading = Math.atan2(dLon, dLat) * 180 / Math.PI; // Rough heading

    observations.push({
      eventTimeUtc: t,
      ingestTimeUtc: t,
      sensorId: "sensor-425006",
      obsKind: "telemetry",
      entityId: "drone-001",
      position: dronePos,
      velocity: { speedMps: 12.4, headingDeg: (heading + 360) % 360 },
      altitude: { meters: droneAlts[i], ref: "AGL", source: "reported", comment: "AeroScope mock" },
      confidence: 0.9,
      raw: { vendor: "dji", source: "aeroscope" }
    });

    // Radar Track Update (Noisy)
    // Mulberry32 Returns 0..1
    const noiseLat = (rng.next() - 0.5) * 0.0001; // Approx 10m
    const noiseLon = (rng.next() - 0.5) * 0.0001;

    observations.push({
      eventTimeUtc: t,
      ingestTimeUtc: t,
      sensorId: "sensor-radar-1",
      trackId: "track-001",
      // entityId: "drone-001", // Radar might not know entityId immediately
      obsKind: "track_update",
      position: { lon: dronePos.lon + noiseLon, lat: dronePos.lat + noiseLat },
      altitude: { meters: droneAlts[i] + (rng.next() - 0.5) * 5, ref: "AGL", source: "detected", comment: "Radar detected" },
      confidence: 0.7 + rng.next() * 0.3,
      raw: { rcs: 0.1 }
    });
  }

  writeNdjson(`${baseDir}/observations.ndjson`, observations);
}


// --- Main ---

function main() {
  console.log("Generating mock data...");

  // A) Snapshot mocks
  writeJson('public/mock/sensors.json', generateSensors());
  writeJson('public/mock/drones.json', generateDrones());
  writeJson('public/mock/adsb.json', generateAdsb());
  writeJson('public/mock/notams.sample.json', generateNotams());

  // B) Scenario mocks
  generateScenarioLinear1();

  console.log("Done.");
}

main();
