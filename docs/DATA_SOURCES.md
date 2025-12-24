# DATA_SOURCES.md

This document inventories **all data sources** used by the **frontend-first** prototype.

**Hard rule reminder:** **NO PROXY.** All requests are made **directly from the browser** until the GUI works. If CORS blocks a source, keep mocks enabled and document the failure here.

---

## Quick start

### Use mocks (default)

- Set `VITE_USE_MOCKS=1`
- Data is loaded from `public/mock/*` via `fetch("/mock/<file>.json")`
- MSW may be used in tests to mock remote endpoints deterministically.

### Local persistence (Phase 2)

- User-created **geofences** and **sensors** are stored in **browser localStorage** for the prototype.
- Schema is versioned; current key is `cuas.state.v1` (alternatively split keys `cuas.geofences.v1` / `cuas.sensors.v1`).
- If localStorage is empty or holds corrupt JSON, the app falls back to mock defaults so the UI still loads.

### Use live endpoints

- Set `VITE_USE_MOCKS=0`
- Provide the relevant `VITE_*_URL` env vars
- If any endpoint fails due to CORS/network, revert to mocks and note it below.
- **Error handling:** Fetches go through a shared `apiClient` wrapper to normalize HTTP, parse, and network errors while still preserving polling "last-good" behavior.

---

## Sources at a glance

### NOTAM

- **Purpose:** NOTAM list + (where possible) geometry overlays on the map.
- **Env var:** `VITE_NOTAM_URL`
- **Default URL:** `https://aim.eans.ee/web/notampib/area24.json`
- **Refresh:** poll every `VITE_POLL_NOTAM_MS` (default **60000 ms / 60s**)
- **Mock fallback:** When `VITE_USE_MOCKS=1`, fetches `/mock/notams.sample.json` instead.
- **Error handling:** On network/CORS errors, the app keeps the last good payload and shows a "stale" or "error" status indicator.
- **Notes:** NOTAM interpretation is **frontend-only** for the prototype; later moved to backend.

### Drone telemetry

- **Purpose:** show drone positions and basic metadata.
- **Env var:** `VITE_DRONE_URL`
- **Refresh:** `VITE_POLL_DRONES_MS` (default **1000 ms**)
- **Fallback:** `/mock/drones.json`
- **Motion (mock):** `/mock/drones.json` stores a `track` array per drone with `timeUtc`, position, heading, speed, and altitude. The frontend interpolates linearly between samples and loops the track to show continuous motion.

### Sensors

- **Purpose:** show sensor locations + status + optional detections.
- **Env var:** `VITE_SENSORS_URL`
- **Refresh:** `VITE_POLL_SENSORS_MS` (default **1000 ms**)
- **Fallback:** `/mock/sensors.json`

### ADS-B (prototype)

- **Purpose:** show basic air traffic overlays.
- **Base URL:** `https://api.airplanes.live/v2`
- **Endpoint:** `/point/{lat}/{lon}/{radiusNm}` (radius in **nautical miles**, max **250 nm**). The app builds this from:
  - `VITE_ADSB_BASE_URL`
  - `VITE_ADSB_CENTER_LAT`
  - `VITE_ADSB_CENTER_LON`
  - `VITE_ADSB_RADIUS_NM`
- **Polling:** every `VITE_POLL_ADSB_MS` (default **10000 ms / 10s**)
- **Rate limit:** upstream allows **1 req/sec**; current polling is safely below.
- **Fields consumed:** `hex`, `flight`, `lat`, `lon`, `track`, `gs`, `alt_baro`, `seen_pos`, `seen`, `lastPosition`. Keys may be absent when data is stale; `lastPosition` provides the last known coordinates when current `lat/lon` are missing.
- **Fallback:** `/mock/adsb.json`
- **Motion (mock):** `/mock/adsb.json` includes a looping `track` array with timestamp offsets and positions. The frontend interpolates linearly between samples using `t0Utc` and `durationSec` so one airplane moves continuously without hard-coded points.

### Maa-amet WMTS basemap

- **Purpose:** orthophoto basemap.
- **Env var:** `VITE_MAP_WMTS_URL`
- **Refresh:** tiles load on demand.
- **Notes:** WMTS config details are tracked as TODOs in `src/map/layers/maaAmetOrthoWmts.ts`.

### Offline basemap (mock mode)

- **Purpose:** provide a deterministic basemap without external tile traffic when `VITE_USE_MOCKS=1` (default).
- **Tile path:** `/tiles/demo/{z}/{x}/{y}.png` served from `public/tiles/demo`. A placeholder in-memory tile is used so no binary assets are committed; drop lightweight PNG tiles here if you have a demo set covering Estonia/Tallinn for zoom levels 7–10.
- **Behavior:** MapView selects the offline XYZ layer first when mocks are enabled, avoiding any network calls to third-party basemap providers. Maa-amet WMTS remains TODO and is **not required** for mock/offline runs.

---

## Shared conventions

### Coordinates

- **Domain storage:** WGS-84 (EPSG:4326) `[lon, lat]`
- **Map view:** EPSG:3857
- **Rule:** transform only at boundaries (OpenLayers feature creation/render).

### Time

All domain events must carry:

- `eventTimeUtc`: when the event happened (from upstream if present)
- `ingestTimeUtc`: when the frontend received/processed it (set client-side)

**UTC everywhere** in domain/storage logic. Local time only in UI formatting.

### Units

- Distances: meters
- Drone speed: m/s
- Aircraft speed: km/h
- Altitudes:
  - stored in meters (m)
  - **UI always shows a comment next to altitude**
  - aircraft + NOTAM altitude text always shows **both ft and m**

---

## Data shapes (prototype contracts)

These JSON shapes define what the **frontend prototype** expects.

- Real upstream schemas may differ.
- The app should map upstream DTOs into the internal domain objects.
- If a live endpoint differs, adjust only the client mapping layer (`src/services/*/*Client.ts`) and update this doc.

### 1) Drone telemetry (mock + browser DTO)

**File:** `public/mock/drones.json`

**Type:** `DroneTrackDto[]`

```json
[
  {
    "id": "drone-001",
    "label": "DJI Mavic (demo)",
    "track": [
      {
        "timeUtc": "2025-12-18T10:15:30Z",
        "position": { "lon": 24.7536, "lat": 59.4369 },
        "headingDeg": 85,
        "speedMps": 12.4,
        "altitude": {
          "meters": 86,
          "ref": "AGL",
          "source": "reported",
          "comment": "AeroScope mock"
        }
      },
      {
        "timeUtc": "2025-12-18T10:15:40Z",
        "position": { "lon": 24.7568, "lat": 59.4392 },
        "headingDeg": 110,
        "speedMps": 12.6,
        "altitude": {
          "meters": 92,
          "ref": "AGL",
          "source": "reported",
          "comment": "AeroScope mock"
        }
      }
    ]
  }
]
```

**Mapping notes**

- `ingestTimeUtc` is added client-side at sampling time.
- The frontend interpolates between consecutive `track` samples and wraps when it reaches the end to keep motion continuous.
- If altitude text is missing a comment, the client injects a placeholder comment to comply with UI rules.

---

### 2) Sensors (mock + browser DTO)

**File:** `public/mock/sensors.json`

**Type:** `SensorDto[]`

```json
[
  {
    "id": "sensor-425006",
    "name": "Demo Sensor A",
    "kind": "rf",
    "position": { "lon": 24.744, "lat": 59.428 },
    "status": "online",
    "lastSeenUtc": "2025-12-18T10:15:25Z",
    "coverage": {
      "radiusMeters": 5000,
      "minAltM": 0,
      "maxAltM": 500
    }
  }
]
```

**Mapping notes**

- **Base Sensors:** Loaded from `/mock/sensors.json` (or `VITE_SENSORS_URL`). Marked with `source: "base"`.
- **User Sensors:** Created via UI, persisted in `localStorage` (`cuas.state.v1`). Marked with `source: "user"`.
- Sensor coverage is optional in MVP; keep `coverage` nullable if not known.
- If a sensor also emits detections, keep detections in the **drone/object** stream, not embedded in the sensor record.

---

### 3) ADS-B (prototype)

**File:** `public/mock/adsb.json`

**Type:** `AdsbTrackDto[]`

```json
[
  {
    "id": "4ca123",
    "callsign": "FIN123",
    "t0Utc": "2025-12-18T10:15:20Z",
    "durationSec": 60,
    "track": [
      {
        "offsetSec": 0,
        "position": { "lon": 24.832, "lat": 59.413 },
        "trackDeg": 275,
        "groundSpeedKmh": 720,
        "altitude": {
          "meters": 3500,
          "ref": "MSL",
          "source": "reported",
          "comment": "ADS-B reported (pressure altitude)"
        }
      },
      {
        "offsetSec": 15,
        "position": { "lon": 24.79, "lat": 59.42 },
        "trackDeg": 280,
        "groundSpeedKmh": 715,
        "altitude": {
          "meters": 3450,
          "ref": "MSL",
          "source": "reported",
          "comment": "ADS-B reported (pressure altitude)"
        }
      }
    ]
  }
]
```

**UI rules reminder**

- Aircraft speed: show **km/h**.
- Aircraft altitude: show **both ft and m** in text.

---

### 4) NOTAM feed

**Live URL:** `https://aim.eans.ee/web/notampib/area24.json`

Because live access may be affected by CORS/timeouts, the repo also includes:

- **File:** `public/mock/notams.sample.json`

The prototype stores:

1) The **raw upstream record** (for debugging), and
2) A **normalized NOTAM domain object** used by the map/panels.

#### 4.1 Raw NOTAM JSON (as stored in mocks)

**Type:** `unknown` (schema may change)

For the mock file, we use a minimal stable structure:

```json
{
  "generatedAtUtc": "2025-12-18T10:00:00Z",
  "items": [
    {
      "id": "A1234/25",
      "text": "TEMP RESTRICTED AREA ... SFC TO 3000FT AMSL ...",
      "validFromUtc": "2025-12-18T00:00:00Z",
      "validToUtc": "2025-12-19T23:59:59Z",
      "raw": {
        "provider": "EANS",
        "payload": "...optional raw fields..."
      }
    }
  ]
}
```

#### 4.2 Normalized NOTAM domain object (frontend output)

Produced by `src/services/notam/notamInterpreter.ts`.

Key fields the UI expects:

- `id` (e.g., `A1234/25`)
- `summary` (short, UI-safe text)
- `text` (full NOTAM text)
- `validFromUtc`, `validToUtc`
- `altitudes[]` normalized into meters (and always carrying a comment)
- `geometry` (optional): derived polygon/circle/line when possible

Example normalized record:

```json
{
  "id": "A1234/25",
  "summary": "TEMP RESTRICTED AREA (demo)",
  "text": "TEMP RESTRICTED AREA ... SFC TO 3000FT AMSL ...",
  "validFromUtc": "2025-12-18T00:00:00Z",
  "validToUtc": "2025-12-19T23:59:59Z",
  "altitudes": [
    {
      "meters": 0,
      "ref": "AGL",
      "source": "reported",
      "comment": "SFC from NOTAM"
    },
    {
      "meters": 914.4,
      "ref": "MSL",
      "source": "reported",
      "comment": "3000 FT AMSL from NOTAM",
      "rawText": "3000FT AMSL"
    }
  ],
  "geometry": null,
  "eventTimeUtc": "2025-12-18T10:00:00Z"
}
```

**UI rule reminder**

- NOTAM altitude text must show **both ft and m**, even though `meters` is stored.

---

## Polling and staleness

All polling uses `AbortController` and should:

- cancel the previous in-flight request if a new tick occurs
- keep last known-good data on error
- expose a “stale” indicator (e.g., age since `ingestTimeUtc`)

Defaults (unless overridden by env vars):

- `ADS-B`: 10s
- `Drones`: 1s
- `Sensors`: 1s
- `NOTAM`: 60s (prototype assumption; update if product decides otherwise)

---

## Known CORS / access issues (fill in as discovered)

Record issues here so engineers don’t waste time.

- `VITE_NOTAM_URL`: (TODO) verify in browser devtools; if blocked, keep using `/mock/notams.sample.json`.
- Maa-amet WMTS: (TODO) verify tile requests from the browser; note any required headers or access constraints.

---

## Generated Mock Data

The mock resources are generated by the `scripts/generate-mocks.ts` script.

**To generate mocks (Recommended):**
1.  Ensure Node.js is installed.
2.  Install dependencies: `npm install`
3.  Run the generator: `npm run gen:mocks`

**Fallback (if Node.js is not available):**
A PowerShell script `scripts/generate-mocks.ps1` is provided which mimics the logic (with slight RNG differences).
Run: `powershell -ExecutionPolicy Bypass -File scripts/generate-mocks.ps1`

- **Snapshot Mode (Mode A)**:
  - `public/mock/sensors.json`
  - `public/mock/drones.json`
  - `public/mock/adsb.json`
  - `public/mock/notams.sample.json`
- **Scenario Mode (Mode B)**:
  - `public/mock/scenarios/linear-1/scenario.json`
  - `public/mock/scenarios/linear-1/truth.mfjson`
  - `public/mock/scenarios/linear-1/sensors.json`
  - `public/mock/scenarios/linear-1/observations.ndjson`

---

## Change log (keep short)

- 2025-12-18: initial draft created (frontend-first, mock-driven)
- 2025-12-19: added scenario assets under `public/mock/scenarios/linear-1` (generated by `scripts/generate-mocks.ps1`)
```
