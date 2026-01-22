# Unified Restriction GeoJSON v2 (meters-first, schedule-unrolled, chain-free client)

This document defines the **output** format produced by the backend aggregator that normalizes **NOTAM + (e)AIP/AIP + UAS-zone** sources into a single GeoJSON file for visualization.

The core invariant is:

> **The frontend performs no NOTAM chain processing and no schedule parsing.**  
> Every Feature in the output is already the **effective truth** for “WHERE / WHEN / VERTICAL / WHAT”.

---

## 1. Goals

### Visualization needs (primary)
- **WHERE**: geometry
- **WHEN**: effective validity + explicit activation windows
- **VERTICAL**: lower/upper limits
- **WHAT**: restriction category + tags (for styling/filtering)

### Non-goals
- Analytics, trajectory planning, or probabilistic reasoning
- Frontend interpretation of:
  - NOTAM replacement/modification chains
  - “MON–FRI except holidays”
  - “SR/SS” (sunrise/sunset)
  - ambiguous textual schedule semantics

---

## 2. Top-level object (FeatureCollection)

### Required fields
- `type`: MUST be `"FeatureCollection"`
- `generatedAt`: ISO-8601 UTC timestamp of generation
- `lookaheadDays`: integer > 0; the horizon used when unrolling schedules into `activations`
- `units`: MUST be `{ "distance": "m", "altitude": "m" }`
- `rounding`: `{ "distance_m": int, "altitude_m": int }`
- `metadata`: parser + source versions + counts
- `features`: array of `RestrictionFeature`

### Recommended `metadata`
- `metadata.parserVersion`: semantic version string
- `metadata.sources.notamFetchedAt`: timestamp of NOTAM fetch
- `metadata.sources.eaipVersion`: eAIP cycle/version identifier (if applicable)
- `metadata.sources.aipEffectiveFrom` / `aipEffectiveUntil`: effective dates (if applicable)
- `metadata.counts.total`: total feature count emitted
- `metadata.counts.activeNow`: count of features active at `generatedAt` (see definition below)

### Definition: `activeNow`
A feature is “active now” if:
- `generatedAt` ∈ any `properties.time.activations[]` window.

---

## 3. Feature model: “Effective Restriction Instance”

Each GeoJSON Feature represents a **single effective restriction instance**:
- already resolved for NOTAM chain effects,
- already unrolled into concrete activation windows.

### Required fields
- `type`: MUST be `"Feature"`
- `id`: unique string within the file; MUST NOT be a raw NOTAM ID
- `geometry`: MUST exist (never `null`)
- `properties`: `RestrictionProperties`

---

## 4. Geometry rules (WHERE)

### Allowed geometry types
- `Polygon`
- `MultiPolygon`
- `Point` (ONLY when representing a circle using `properties.shape`)

### Circle representation
GeoJSON has no native circle. Circles are represented as:
- `geometry.type = "Point"`
- `properties.shape = { "type": "CIRCLE", "radius_m": number }`

Frontend rendering rule:
- If `geometry.type == "Point"` and `shape.type == "CIRCLE"`, render a circle of radius `radius_m` meters around the point.
- Otherwise, render the Point normally (if you ever allow non-circle points; by default do not).

### LineString rule
`LineString` is **not emitted** in v2 output. If input data implies a linear restriction (runway closure, corridor centerline):
- backend MUST buffer it to `Polygon`/`MultiPolygon` in meters.

### Polygon holes / winding
Backend MUST ensure produced GeoJSON is valid:
- polygons may include holes (inner rings)
- ring order/orientation must be consistent and accepted by the chosen geometry engine
- geometry MUST be closed rings

### Optional geometry helpers
- `properties.bbox`: `[minLon,minLat,maxLon,maxLat]` for culling
- `properties.labelPoint`: `[lon,lat]` for stable label placement

---

## 5. Time rules (WHEN)

The frontend MUST NOT parse schedule text. The backend MUST emit explicit windows.

### Required time fields
`properties.time` includes:
- `validFrom`: ISO-8601 UTC timestamp (always present)
- `validUntil`: ISO-8601 UTC timestamp (always present)
- `activations`: array of `{start,end}` windows, UTC, **min 1**
- `quality`: one of `EXACT | APPROX | PLACEHOLDER | UNKNOWN`

### Definitions
- `validFrom`/`validUntil`:
  - represent the *overall* validity envelope
  - MUST always be parseable timestamps (no “SR”, “SS”, “PERM”, etc.)
- `activations[]`:
  - represent the *actual “hot” windows* inside the validity envelope
  - MUST be explicit UTC timestamps
  - MUST be unrolled up to `lookaheadDays` (starting at or near `generatedAt`)
  - MUST contain only windows where the restriction is active
- Permanent restrictions:
  - `validFrom` = effective start of publication (AIP/eAIP) or equivalent
  - `validUntil` = far-future sentinel (recommended: `2100-01-01T00:00:00Z`)
  - `activations` MUST contain one window spanning `[validFrom, validUntil]`
  - `quality` SHOULD be `EXACT`

### SR/SS handling
Backend MUST replace sunrise/sunset tokens (SR/SS) before output.
During development:
- SR is replaced by **07:00**
- SS is replaced by **18:00**
- When placeholders are used:
  - `quality` MUST be `"PLACEHOLDER"`
  - `time.original.srSsPolicy` MUST be set (recommended: `PLACEHOLDER_0700_1800`)

When real SR/SS computation is implemented:
- `quality` SHOULD be `"EXACT"`
- `time.original.srSsPolicy` SHOULD be `REAL`

### Time window integrity rules
For every activation window:
- `start < end`
- windows MUST NOT extend outside `[validFrom, validUntil]`
- windows SHOULD NOT overlap (backend SHOULD merge overlaps)
- backend SHOULD deduplicate identical windows

### Example
If the restriction is active:
- Dec 31 07:00–08:40
- Jan 02 07:00–08:40
- Jan 03 07:00–08:40  
then `activations` MUST contain exactly these three windows, in UTC.

---

## 6. Vertical rules (VERTICAL)

All vertical values are **meters** after conversion and rounding.

### Required vertical fields
`properties.vertical` includes:
- `lower_m`: number ≥ 0
- `upper_m`: number ≥ 0 OR `null` (for unlimited/unknown)
- `lower_ref`, `upper_ref`: one of:
  - `SFC | AGL | AMSL | STD | UNKNOWN`
- `original`: optional; preserves published strings/units (recommended)

### Conversion rules (recommended)
- FT → meters: `m = ft * 0.3048`
- FL → meters: `FLxxx` means `xxx * 100 ft` under STD reference; convert then store `*_ref = "STD"`
- Rounding:
  - apply `rounding.altitude_m` as a step:
    - `0` means keep full precision
    - `1` means round to nearest meter
    - `10` means round to nearest 10 meters
  - if rounding is applied, `original` SHOULD be preserved for auditing

### Datum interpretation
This schema preserves the reference datum; it does not attempt to derive terrain-adjusted AMSL from AGL/SFC.
- if you later add terrain-based derivation, do it as new optional fields (do not change semantics of `lower_ref`/`upper_ref`).

---

## 7. Semantics and categorization (WHAT)

### Required fields
- `category`: one of:
  - `AIRSPACE | UAS_ZONE | OBSTACLE | PROCEDURE | INFO`
- `restriction`:
  - `PROHIBITED | RESTRICTED | DANGER | REQ_AUTHORISATION | WARNING | INFORMATION`
- `priority`:
  - `CRITICAL | HIGH | MEDIUM | LOW`
- `tags`: `string[]` (free-form)

### Tag philosophy
- `tags` is intentionally flexible; backend may emit aviation-style tags or your own vocabulary.
- Frontend processing MUST NOT depend on specific tag strings (tags are for display/filtering only).
- `restriction` and `priority` are the stable fields for coloring/z-order/urgency.

---

## 8. Chain-free client invariant (linking + provenance)

The backend MUST resolve NOTAM chains. The frontend MUST NOT.

### Link fields (informational only)
`properties.link` includes:
- `relationType`: `NEW | ACTIVATION | MODIFICATION | REPLACEMENT | CANCELLATION`
- `relatedTo`: stable ID of the “logical structure” this feature relates to (e.g., an EAIP zone ID), or `null`
- `supersedes`: array of IDs (raw NOTAM IDs and/or previous effective IDs) that were applied and are **not emitted as active features**

### Backend chain resolution rules
- If NOTAM B replaces NOTAM A:
  - output MUST include only the effective feature derived from B
  - output MUST NOT include A as a separate active feature
  - `supersedes` MUST include A’s ID
- If a NOTAM modifies a permanent structure:
  - output MUST contain a fully materialized effective feature (geometry + vertical + time)
  - output MUST NOT emit “geometry: null” patch features
  - `relatedTo` SHOULD reference the permanent structure ID
  - `relationType` SHOULD be `ACTIVATION` or `MODIFICATION`

### Provenance (traceability)
`properties.provenance.inputs[]` is required:
- each item: `{ source: NOTAM|EAIP|AIP|UAS_ZONE|OTHER, id: string }`
- contains all upstream inputs used to produce this effective feature

---

## 9. Display fields (optional but recommended)

To keep the frontend dumb and consistent across clients:
- `properties.display.title`: short title
- `properties.display.summary`: single-line summary (good for list items)
- `properties.display.content`: long-form text for popup/inspector
- `properties.display.contact`: optional contact/frequency

Backend SHOULD keep these human-readable strings aligned with the computed fields.

---

## 10. Implementation assumptions (so coding matches output)

1. **All timestamps are UTC** and ISO-8601.
2. **All numeric distances/altitudes are meters** after conversion.
3. **Rounding is applied in backend** using the top-level `rounding` policy.
4. **Schedules are unrolled in backend** into `activations` for `lookaheadDays`.
5. **SR/SS tokens are eliminated before output**:
   - placeholder now: SR=07:00, SS=18:00
   - quality MUST reflect placeholder use
6. **No LineString output**: buffer to polygons.
7. **No patch features** (`geometry` is never null).
8. **No superseded active features**: chains are resolved in backend.
9. **Frontend checks activity only via `activations`** (not via raw text).

---

## 11. Pitfall (known tradeoff)

Meters rounding can change boundaries near exact published values (e.g., 4000 ft = 1219.2 m).
Recommended mitigation:
- keep `vertical.original` (published)