# DB plan and mock data formats

This document explains:

1) **How we plan to store drone/sensor tracking data later in a database** (Option 1: Postgres + PostGIS + time-series tables)
2) **How we store and replay the same kinds of data in files right now** for a frontend-first prototype

The guiding idea is to treat counter‑UAS monitoring as an **event stream**:

- **Truth** (what the drone actually did in a scenario)
- **Observations** (what sensors reported — often partial/noisy)
- **Tracks** (optional fusion/cleaned track product — derived from observations)

This model scales from “one drone moving linearly in a demo” to “replayable swarms with multiple sensor types and noise/dropouts”.

---

## Non‑negotiable conventions

These apply to both files now and the DB later.

### Coordinates

- All domain geometry uses **WGS‑84** (EPSG:4326) as `[lon, lat]`.
- Map rendering uses EPSG:3857, but **only** at the OpenLayers boundary.

### Time

- Use UTC everywhere in domain/storage logic.
- Every event stores two timestamps:
  - `eventTimeUtc`: when the measurement/event occurred (sensor time / truth time)
  - `ingestTimeUtc`: when we received/processed it

### Units

- Default metric.
- Drone speed: **m/s**.
- Aircraft speed: **km/h**.
- Altitude is stored in **meters**, with reference and source.

Altitude type:

```ts
export type AltitudeRef = "AGL" | "MSL";
export type AltitudeSource = "detected" | "reported" | "unknown";

export type Altitude = {
  meters: number | null;
  ref: AltitudeRef;
  source: AltitudeSource;
  comment?: string;  // ALWAYS shown next to altitude
  rawText?: string;  // if upstream gave unparseable text
};
```

---

## Why an event stream model

Counter‑UAS sensors are heterogeneous:

- **AeroScope-like telemetry**: rich (position, heading, altitude, ID, …)
- **Radar**: noisy track updates (position + uncertainty; IDs may drift)
- **RF direction finding**: bearing-only or bearing+confidence
- **Vision**: detections, sometimes without precise geolocation

A single “one perfect schema” approach breaks quickly.

Instead we store **observations as append-only events** with:

- required shared fields (time, sensor id, kind)
- optional common fields (position, altitude, speed, heading)
- `raw` payload for sensor-specific fields

Then we can derive:

- live “current state” views (latest per entity/track)
- fused/clean tracks
- audit and history

---

## Database plan (Option 1): Postgres + PostGIS + time-series tables

### Overview

We plan to use:

- **Postgres** for relational integrity and metadata
- **PostGIS** for geospatial types and indexes
- (Optional later) **TimescaleDB** if event volume requires time-series acceleration

The database will store:

1) **Metadata**: sensors, entities (drones/aircraft/unknown), users (later)
2) **Raw observations**: append-only events from sensors/APIs
3) **Derived tracks**: cleaned/fused results (optional, can be added later)
4) **Geofences / areas**: circles/polygons, including NOTAM-derived overlays

### Core tables (proposed)

#### 1) `sensors`

Stores sensor metadata and optionally its fixed location.

- `sensor_id` (text/uuid)
- `name` (text)
- `kind` (text) — e.g. `aeroscope`, `radar`, `rf_df`, `camera`
- `position` (geometry(Point, 4326), nullable)
- `status` (text)
- `config` (jsonb) — calibration, bands, firmware, etc.
- `created_at_utc`, `updated_at_utc`

Indexes:

- `gist(position)` (if position is present)
- `btree(kind)` (optional)

#### 2) `entities`

Represents “things we track” (drone, aircraft, unknown, etc.).

- `entity_id` (text/uuid)
- `entity_kind` (text) — `drone|aircraft|unknown|sensor` (expandable)
- `label` (text)
- `external_ids` (jsonb) — e.g. remote id, callsign, ICAO, vendor ids
- `created_at_utc`, `updated_at_utc`

#### 3) `observations` (append-only)

This is the main time-series log.

- `obs_id` (bigserial/uuid)
- `sensor_id` (fk)
- `entity_id` (fk, nullable) — may be unknown at ingest time
- `track_id` (nullable) — used if the sensor outputs track IDs directly
- `event_time_utc` (timestamptz)
- `ingest_time_utc` (timestamptz)
- `obs_kind` (text)
  - examples: `telemetry`, `track_update`, `bearing`, `detection`, `status`
- `position` (geometry(Point, 4326), nullable)
- `altitude` (jsonb, nullable) — our `Altitude` type
- `velocity` (jsonb, nullable)
  - recommended keys: `{ "speedMps": number, "headingDeg": number }`
- `confidence` (real, nullable)
- `raw` (jsonb, nullable) — original sensor payload or extra fields

Indexes:

- `btree(event_time_utc)`
- `btree(sensor_id, event_time_utc DESC)`
- `btree(entity_id, event_time_utc DESC)` (when entity_id is present)
- `gist(position)` for spatial filtering

Partitioning (later):

- Partition by time (monthly/weekly) if needed.
- Or use Timescale hypertables.

#### 4) `tracks` (derived)

Stores the lifecycle of a fused/cleaned track.

- `track_id` (text/uuid)
- `classification` (text) — `drone|bird|unknown|aircraft|false_positive`
- `first_seen_utc`, `last_seen_utc`
- `status` (text)
- `source` (text) — fusion pipeline version
- `meta` (jsonb)

#### 5) `track_points` (derived)

Stores cleaned track points, sampled at a stable cadence.

- `track_id` (fk)
- `event_time_utc` (timestamptz)
- `position` (geometry(Point, 4326))
- `altitude` (jsonb, nullable)
- `speed_mps` (real, nullable)
- `heading_deg` (real, nullable)
- `covariance` (jsonb, nullable) — e.g. `{sigmaX, sigmaY, sigmaZ}`
- `source` (text)

Indexes:

- `btree(track_id, event_time_utc)`
- `gist(position)`

#### 6) `geofences`

Stores user-created or NOTAM-derived geofences.

- `geofence_id` (text/uuid)
- `name` (text)
- `kind` (text) — `circle|polygon|notam_area`
- `geometry` (geometry(Polygon, 4326), nullable)
- `center` (geometry(Point, 4326), nullable)
- `radius_m` (real, nullable)
- `valid_from_utc`, `valid_to_utc` (nullable)
- `source` (text) — `user|notam|import`
- `source_ref` (text, nullable) — e.g. NOTAM id
- `meta` (jsonb)

---

## Query patterns we will need later

These shape how we design both DB and mock files.

### Live map queries

- “Latest known position per entity/track” within a bounding box
- “Sensors list + status”
- “NOTAM/geofence overlays”

Implementation note: we will likely maintain **materialized views** or cached “latest” tables:

- `entity_latest(entity_id, event_time_utc, position, altitude, velocity, source_sensor_id, ...)`

Derived from `observations`.

### History queries

- “All events for day D (UTC)” optionally filtered by area
- “Track playback”: points for a track in `[t0, t1]`
- “Sensor health over time”

---

## Mock data plan (files now) — designed to map to DB later

### Why we use files now

Frontend prototype goals:

- no backend
- deterministic demo data
- scenario replay (later swarms)

We keep file formats deliberately close to the DB/event model so that:

- mock ingest → `observations` table is straightforward later
- the UI doesn’t need a rewrite when real feeds arrive

---

## Two mock modes

### Mode A — Simple static JSON files (current MVP)

These are “snapshot” feeds polled by the browser.

Location:

- `public/mock/drones.json`
- `public/mock/sensors.json`
- `public/mock/adsb.json`
- `public/mock/notams.sample.json`

Use this mode for Phase 0/Phase 1.

### Mode B — Scenario replay engine (recommended next)

This mode supports replays and swarms.

Location:

- `public/mock/scenarios/<scenarioId>/...`

The scenario engine can either:

- precompute an `observations.ndjson` log, or
- compute observations on the fly from a “truth trajectory” + sensor models

---

## Static mock file formats (Mode A)

### `public/mock/sensors.json`

Represents sensor metadata.

```json
[
  {
    "id": "sensor-425006",
    "name": "Demo Sensor A",
    "kind": "aeroscope",
    "position": { "lon": 24.744, "lat": 59.428 },
    "status": "online",
    "lastSeenUtc": "2025-12-18T10:15:25Z",
    "coverage": { "radiusMeters": 5000, "minAltM": 0, "maxAltM": 500 }
  }
]
```

Mapping to DB later:

- goes to `sensors`
- `coverage` can become `config` or a dedicated coverage table

### `public/mock/drones.json`

Represents drone telemetry snapshots.

```json
[
  {
    "id": "drone-001",
    "label": "DJI Mavic (demo)",
    "position": { "lon": 24.7536, "lat": 59.4369 },
    "headingDeg": 90,
    "speedMps": 12.4,
    "altitude": { "meters": 86, "ref": "AGL", "source": "reported", "comment": "AeroScope mock" },
    "eventTimeUtc": "2025-12-18T10:15:30Z"
  }
]
```

Mapping to DB later:

- each item becomes an `observations` row with:
  - `obs_kind = telemetry`
  - `position`, `altitude`, `velocity`

### `public/mock/adsb.json`

Represents air traffic snapshots.

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
      "comment": "ADS-B reported (mocked)"
    },
    "eventTimeUtc": "2025-12-18T10:15:20Z"
  }
]
```

Mapping to DB later:

- becomes `observations` with `obs_kind = track_update` or `telemetry` (aircraft stream)

### `public/mock/notams.sample.json`

Stores NOTAM raw-like items for the prototype.

```json
{
  "generatedAtUtc": "2025-12-18T10:00:00Z",
  "items": [
    {
      "id": "A1234/25",
      "text": "TEMP RESTRICTED AREA ... SFC TO 3000FT AMSL ...",
      "validFromUtc": "2025-12-18T00:00:00Z",
      "validToUtc": "2025-12-19T23:59:59Z"
    }
  ]
}
```

Mapping to DB later:

- stored in a NOTAM ingestion table (optional), but the main output is `geofences`:
  - `source = notam`
  - `source_ref = notam id`
  - `valid_from_utc`, `valid_to_utc`

---

## Scenario format (Mode B) — best way to mock flights now and later

### Directory layout

```
public/mock/scenarios/
  linear-1/
    scenario.json
    truth.geojson         # simple option (LineString(s) with time samples)
    truth.mfjson          # preferred option (Moving Features JSON)
    sensors.json
    observations.ndjson   # optional precomputed event log
```

### 1) `scenario.json` (controller)

Defines simulation clock and which streams to emit.

```json
{
  "version": "0.1",
  "scenarioId": "linear-1",
  "t0Utc": "2025-12-18T10:00:00Z",
  "durationSec": 600,
  "playback": { "speed": 1, "loop": true },
  "truth": { "format": "mfjson", "path": "./truth.mfjson" },
  "sensors": { "path": "./sensors.json" },
  "streams": [
    {
      "streamId": "aeroscope-demo",
      "kind": "telemetry",
      "sensorKind": "aeroscope",
      "emitHz": 1,
      "model": { "noiseMeters": 2, "dropoutPct": 0.0 }
    },
    {
      "streamId": "radar-demo",
      "kind": "track_update",
      "sensorKind": "radar",
      "emitHz": 1,
      "model": { "noiseMeters": 25, "idSwapPct": 0.02 }
    }
  ]
}
```

### 2) `truth` (the ground truth trajectory)

We support two truth encodings:

#### A) Simple truth GeoJSON (easy)

A GeoJSON `FeatureCollection` with per-entity sampled points in properties.

- Geometry: `LineString` with `[lon,lat]` coordinates
- Properties: `timesUtc[]` aligned with coordinates

Example:

```json
{
  "type": "FeatureCollection",
  "features": [
    {
      "type": "Feature",
      "properties": {
        "entityId": "drone-001",
        "entityKind": "drone",
        "timesUtc": [
          "2025-12-18T10:00:00Z",
          "2025-12-18T10:00:01Z"
        ],
        "altitudeM": [80, 81],
        "altitudeRef": "AGL"
      },
      "geometry": {
        "type": "LineString",
        "coordinates": [
          [24.7500, 59.4300],
          [24.7502, 59.4301]
        ]
      }
    }
  ]
}
```

This is sufficient for Phase 1 linear motion.

#### B) Moving Features JSON (preferred, trajectory-native)

MF-JSON is designed for moving points and time-varying properties.

We store MF-JSON as the canonical truth format when we start swarms.

### 3) `sensors.json` (scenario-local sensor configuration)

This file defines which sensors exist in the scenario and where.

```json
[
  {
    "id": "sensor-425006",
    "name": "Demo AeroScope",
    "kind": "aeroscope",
    "position": { "lon": 24.744, "lat": 59.428 },
    "config": { "rangeMeters": 5000 }
  },
  {
    "id": "sensor-radar-1",
    "name": "Demo Radar",
    "kind": "radar",
    "position": { "lon": 24.760, "lat": 59.440 },
    "config": { "rangeMeters": 12000 }
  }
]
```

### 4) `observations.ndjson` (optional precomputed event log)

NDJSON is one JSON object per line, in chronological order.

Use it when:

- you want exact determinism
- you want to avoid implementing sensor models early
- you want to share “replay logs” easily

Example line:

```json
{"eventTimeUtc":"2025-12-18T10:00:01Z","ingestTimeUtc":"2025-12-18T10:00:01Z","sensorId":"sensor-425006","obsKind":"telemetry","entityId":"drone-001","position":{"lon":24.7502,"lat":59.4301},"velocity":{"speedMps":12.4,"headingDeg":90},"altitude":{"meters":86,"ref":"AGL","source":"reported","comment":"AeroScope mock"},"confidence":0.9,"raw":{"vendor":"dji","source":"aeroscope"}}
```

Mapping to DB later:

- each line becomes one row in the `observations` table.
- `raw` preserves sensor-specific detail.

---

## How the scenario engine should behave

### Core responsibilities

- Load `scenario.json`
- Maintain a deterministic simulation clock:
  - pause/resume
  - seek
  - speed multiplier
  - loop
- Produce event streams at configured Hz:
  - telemetry stream
  - radar track updates
  - bearing-only updates

### Recommended approach

1) Use `truth` as the authoritative path.
2) On each tick, sample truth at time `t`:
   - linear interpolation between points (good enough)
3) Convert truth sample to sensor observation via a **sensor model**:
   - add noise
   - dropouts
   - occasional ID changes for radar (optional)
4) Emit a normalized observation event.

This approach scales to swarms naturally: N entities, same sampler, same emission loop.

---

## How files map to future DB tables

| File artifact | DB destination later | Notes |
|---|---|---|
| `public/mock/sensors.json` | `sensors` | metadata + config |
| `public/mock/drones.json` | `observations` | `obs_kind=telemetry` |
| `public/mock/adsb.json` | `observations` | aircraft telemetry/track updates |
| `public/mock/notams.sample.json` | `geofences` (+ optional notam table) | NOTAM-derived areas |
| `observations.ndjson` | `observations` | 1:1 mapping (append-only) |
| `truth.*` | (optional) `truth_runs` / test fixtures | not required in production |
| user-created geofences | `geofences` | persistent |

---

## Practical guidance: what we should implement first

For the immediate prototype (Phase 1):

- Implement **simple truth GeoJSON** with time arrays (easiest to author)
- Implement a basic scenario player that:
  - samples one drone and one aircraft linearly
  - emits telemetry events at 1 Hz
  - updates the UI layers

Then evolve toward:

- MF-JSON truth
- NDJSON replay logs
- multiple sensors and sensor models

---

## What we intentionally postpone

- Any proxy or backend forwarding
- Production-grade sensor fusion
- Full NOTAM geometry decoding in the frontend
- Auth/roles/audit

The objective is to keep the mock formats and DB plan aligned while getting the GUI working fast.
