# ARCHITECTURE.md

This is a **frontend-first** architecture for a prototype that shows:

- Drone telemetry + sensor detections
- ADS-B air traffic (prototype)
- NOTAM overlays (EANS JSON)

**Goal:** ship a working GUI quickly using browser polling + mocks.

> Hard rule: **NO PROXY.** All network calls are direct from the browser until the GUI works.

---

## High-level layout

The app is a **persistent map shell** with tool panels inside it.

- **MapShell** (always mounted)
  - OpenLayers map (persistent)
  - Top toolbar (tool navigation)
  - Session controls (auth scaffold, `off` mode only)
  - Left sidebar (either a tool panel or an object details panel)

Routing contract:

- Tools live in the **path**: `/air`, `/sensors`, `/geofences`, `/known-drones`, `/history`
- Selection is **global** and lives in query params: `?entity=sensor:425006`
- History context is query params:
  - `/history?hDate=2025-12-18`
  - `/history?hDate=2025-12-18&hArea=T1`

This keeps URLs clean, shareable, and consistent.

---

## Key modules

### 1) `src/layout/MapShell/*`

Owns the overall page structure and URL-backed state.

- `MapShell.tsx`: layout composition + wiring
- `urlState.ts`: parse/format helpers for `tool` and `entity`
- `useSidebarUrlState.ts`: the “hybrid brain” that reads URL state and provides setters
- `LeftSidebar.tsx`: renders either a tool panel or the object details panel

**Policy:**

- Tool navigation pushes browser history
- Entity selection replaces history by default (avoid back-button spam)

---

### 2) `src/map/*` (OpenLayers boundary)

OpenLayers is isolated to this folder.

- `MapView.tsx` owns the OpenLayers `Map` instance and lifecycle
- `layers/*` defines base and vector layers
- `styles/*` defines OpenLayers styles
- `transforms.ts` handles EPSG:4326 ⇄ EPSG:3857 conversions
- `mapApi.ts` exposes a narrow API to the UI

**Non-negotiable boundary:** panels in `src/features/*` must not import OpenLayers.

---

### 3) `src/services/*` (data + polling)

Responsible for:

- fetching raw DTOs from live endpoints (or from mocks)
- mapping DTOs → **domain objects**
- exposing consistent data to UI via hooks

Key pieces:

- `services/polling/usePolling.ts`: a shared polling primitive
  - uses `AbortController`
  - keeps last known-good data
  - exposes staleness metadata

- `services/notam/notamInterpreter.ts`:
  - best-effort NOTAM normalization (prototype only)
  - stores altitudes in meters
  - UI shows ft+m

---

### 4) `src/shared/*` (single source of truth)

All formatting and conversions live here.

- `shared/time/*`: UTC parsing + local formatting
- `shared/units/*`: m ↔ ft, speed formatting, etc.
- `shared/types/domain.ts`: domain types (Altitude, EntityRef, etc.)

Rule: do not re-implement unit/time logic inside components.

---

## Data flow

**One-way data flow** (services → state → rendering), with explicit selection actions.

```text
Browser fetch / mocks
   │
   ▼
services/*Client.ts  (DTO fetch)
   │
   ▼
services/* mapping    (DTO → domain)
   │
   ▼
MapShell + Panels     (render domain)
   │
   ├─► mapApi          (focus/select, layer toggles)
   └─► URL state       (entity + history context)
```

### Polling behavior

- ADS-B: ~10s
- Drones: ~1s
- Sensors: ~1s
- NOTAM: best-effort (prototype default ~60s unless decided otherwise)

On error:

- keep last known-good data
- surface “stale” indicator based on `ingestTimeUtc`

---

## State model

### URL-backed state (shareable)

- `tool` (path param)
- `entity` (query param)
- history context (`hDate`, `hArea`)

### Local UI state (not shareable)

- sidebar width/collapsed
- transient filters (typing, dropdowns)
- popovers/tooltips
- draft geometry (until explicitly saved)

This avoids noisy URLs and keeps shareable state intentional.

---

## Map model

### Projections

- Domain geometry: EPSG:4326 `[lon, lat]`
- Map `View`: EPSG:3857
- Transform at boundaries only (feature creation/render)

### Layers

- **Base layer:** Maa-amet orthophoto WMTS
- **Vector layers:** drones, sensors, ADS-B tracks, NOTAM overlays

All WMTS config is centralized in `src/map/layers/maaAmetOrthoWmts.ts`.

---

## Selection and details

Selection is global:

- Clicking an entity on the map sets `?entity=<kind>:<id>`
- Sidebar switches to `ObjectDetailsPanel`
- Closing details clears the `entity` param

This makes map interactions consistent across tools.

---

## Auth (scaffold only)

Auth exists only as a **toggle-able interface** for later.

- `VITE_AUTH_MODE=off|basic`
- Only `off` is active now:
  - behaves as logged-in admin (`demo`, role `admin`)

No real auth flow is implemented in the prototype.

---

## Testing strategy

### Unit / component

- Vitest + React Testing Library
- focus on:
  - formatting helpers (altitude/time/unit rules)
  - URL parsing/formatting
  - panel rendering (empty + basic list)

### Integration mocking

- MSW provides deterministic endpoint behavior for polling

### E2E smoke

- Playwright
- minimal checks:
  - app loads and map renders
  - tool switch changes sidebar
  - marker click updates URL + opens details

---

## Intentional gaps (prototype)

These are expected later and are intentionally not part of the MVP:

- backend ingestion + DB
- roles, audit log, access control
- production-grade NOTAM parsing
- proxy layer (explicitly forbidden for now)
- Maa-amet terms/compliance enforcement (prototype bypass)

---

## Where to look next

- `AGENTS.md` — working rules + folder map + constraints
- `docs/DATA_SOURCES.md` — endpoints + JSON examples
- `docs/UI_RULES.md` — display rules for time/units/labels

