# DATA_SOURCES.md

This document inventories **all data sources** used by the **frontend-first** prototype.

**Hard rule reminder:** **NO PROXY.** All requests are made **directly from the browser** until the GUI works. If CORS blocks a source, keep mocks enabled and document the failure here.

---

## Quick start

### Use mocks (default)

- Set `VITE_USE_MOCKS=1`
- Data is loaded from `public/mock/*` via `fetch("/mock/<file>.json")`
- MSW may be used in tests to mock remote endpoints deterministically.

### Use live endpoints

- Set `VITE_USE_MOCKS=0`
- Provide the relevant `VITE_*_URL` env vars
- If any endpoint fails due to CORS/network, revert to mocks and note it below.

---

## Sources at a glance

### NOTAM

- **Purpose:** NOTAM list + (where possible) geometry overlays on the map.
- **Env var:** `VITE_NOTAM_URL`
- **Default URL:** `https://aim.eans.ee/web/notampib/area24.json`
- **Refresh:** poll every `VITE_POLL_NOTAM_MS` (if not set, treat as **60s** in prototype)
- **Notes:** NOTAM interpretation is **frontend-only** for the prototype; later moved to backend.

### Drone telemetry

- **Purpose:** show drone positions and basic metadata.
- **Env var:** `VITE_DRONE_URL`
- **Refresh:** `VITE_POLL_DRONES_MS` (default **1000 ms**)
- **Fallback:** `/mock/drones.json`

### Sensors

- **Purpose:** show sensor locations + status + optional detections.
- **Env var:** `VITE_SENSORS_URL`
- **Refresh:** `VITE_POLL_SENSORS_MS` (default **1000 ms**)
- **Fallback:** `/mock/sensors.json`

### ADS-B (prototype)

- **Purpose:** show basic air traffic overlays.
- **Env var:** `VITE_ADSB_URL`
- **Refresh:** `VITE_POLL_ADSB_MS` (default **10000 ms**)
- **Fallback:** `/mock/adsb.json`

### Maa-amet WMTS basemap

- **Purpose:** orthophoto basemap.
- **Env var:** `VITE_MAP_WMTS_URL`
- **Refresh:** tiles load on demand.
- **Notes:** WMTS config details are tracked as TODOs in `src/map/layers/maaAmetOrthoWmts.ts`.

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

**Type:** `DroneTelemetryDto[]`

```json
[
  {
    "id": "drone-001",
    "label": "DJI Mavic (demo)",
    "position": { "lon": 24.7536, "lat": 59.4369 },
    "headingDeg": 90,
    "speedMps": 12.4,
    "altitude": {
      "meters": 86,
      "ref": "AGL",
      "source": "detected",
      "comment": "RF+vision fused"
    },
    "eventTimeUtc": "2025-12-18T10:15:30Z"
  }
]
```

**Mapping notes**

- `ingestTimeUtc` is added client-side.
- If upstream provides altitude as text (e.g., “120m AGL est.”), store parsable meters and keep the text in `altitude.rawText`.

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
    "position": { "lon": 24.832, "lat": 59.413 },
    "trackDeg": 275,
    "groundSpeedKmh": 720,
    "altitude": {
      "meters": 3500,
      "ref": "MSL",
      "source": "reported",
      "comment": "ADS-B reported (pressure altitude)"
    },
    "eventTimeUtc": "2025-12-18T10:15:20Z"
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
