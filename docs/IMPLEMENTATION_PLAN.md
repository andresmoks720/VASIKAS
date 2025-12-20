# IMPLEMENTATION_PLAN.md

## Current status

- Phase: Phase 1 — Mocked sensors + mocked moving drone + basic layers
- Implemented:
  - Phase 0 scaffold: routing, MapShell, OpenLayers baseline, URL helpers, and testing harness.
  - Mock data generator (TypeScript) runnable via `npm run gen:mocks` to refresh snapshot + scenario assets.
  - Shared polling hook with staleness classification plus drone client (mock motion) and sidebar status indicator.
  - Sensors polling client with ingest timestamps and OpenLayers marker layer (mock-visible on load).
  - Sensor, drone, and ADS-B vector layers rendered in `MapView` with selection styling.
  - Drone mock motion driven by looping track data from `public/mock/drones.json`.
  - ADS-B mock motion driven by looping track data with interpolated positions.
- In progress:
  - Expanding panel details and formatting for Phase 1 mock feeds.
- Next (1–3 concrete actions):
  - Hook panels to formatted altitude/speed helpers.
  - Finalize Maa-amet WMTS layer configuration (layer id, matrix set, attribution).
  - Flesh out UI formatting for ADS-B rows and details using domain helpers.

### Status rules

- Keep this section concise and factual; update it in the same PR as related code.
- Remove items from **In progress** once they land; keep **Next** to 1–3 concrete actions.
- Work in one phase at a time; if scope expands, update the phase description before coding.
- Each meaningful change should reference its phase and refresh this status section.

This plan steers development of the **frontend-first** Estonia drone location web app.

**North star:** a single-map UI that can show drones, sensors, NOTAMs, and basic air traffic with fast iteration using mocks and polling.

**Hard constraints:**

- **NO PROXY** until the GUI is working (see `AGENTS.md`).
- **Frontend-first**: read from `public/mock/*` and public endpoints.
- **UTC everywhere in domain logic**, local time only at UI formatting boundary.
- Domain coordinates in **WGS-84 (lon/lat)**; map view **EPSG:3857**.

---

## Definition of “done” for the prototype (smoke path)

A build is “prototype-done” when the following smoke path works locally:

1) Load the app → map renders with Maa-amet WMTS basemap.
2) Switch tools (Air / Sensors / Geofences / History) → sidebar changes.
3) Add a geofence (at least a circle) → it appears on the map and in the list.
4) Add a sensor → it appears on the map and in the list.
5) See a drone (mock) moving on the map (linear motion is fine) and details update.

**Testing strategy:** treat map rendering as integration/E2E-heavy; test pure logic separately.

---

## Phases overview

- **Phase 0** — Repo scaffolding and baseline UI skeleton
- **Phase 1** — Mocked sensors + mocked moving drone + basic layers
- **Phase 2** — Geofences (create/edit/delete) + sensor add/remove (mock persistence)
- **Phase 3** — NOTAM ingest + NOTAM overlays + “geofence from NOTAM” (best-effort)
- **Phase 4** — Live ADS-B client (browser fetch) + fallback to mocks
- **Phase 5** — Live single drone sensor client + others still mocked
- **Phase 6** — Backend persistence (geo areas + history)
- **Phase 7** — Add proxy servers (only after GUI is stable)
- **Phase 8** — Logging, authentication, roles, audit, history UX upgrades

Each phase has acceptance criteria and the minimum tests required.

---

## Phase 0 — Repo scaffolding + baseline UI skeleton

### Goals

- App boots with routing contract and a persistent map shell.
- Basic tool navigation works.
- Testing harness is in place.

### Deliverables

- React + Vite + TS + MUI baseline.
- Router with `/:tool` and default redirect to `/air`.
- `MapShell` layout:
  - persistent OpenLayers map
  - top toolbar (tool switch)
  - left sidebar (tool panels)
  - session controls stub (auth off mode)
- Stubs for panels:
  - `AirTrafficPanel`, `SensorsPanel`, `GeofencesPanel`, `HistoryPanel`, `ObjectDetailsPanel`
- `docs/ARCHITECTURE.md` draft (1 page) describing MapShell + routing.

### Acceptance

- `npm run dev` opens `/air` and map element exists.
- Tool switching changes sidebar.

### Tests

- Unit tests for URL helpers: `parseTool`, `parseEntity`, `formatEntity`.
- Playwright smoke: load app → verify sidebar title changes when switching tools.

---

## Phase 1 — Mocked sensors + mocked moving drone + basic layers

### Goals

- Show mocked sensors and drone(s) as vector layers.
- Demonstrate motion with **one airplane and one drone** moving in simple linear motion from file data.

### Implementation notes

- Prefer the simplest approach: a precomputed time series in `/public/mock/drones.json` and `/public/mock/adsb.json`.
- UI can “animate” by selecting a row based on `Date.now()` modulo duration.
- Keep domain objects in WGS-84; transform when creating OL features.

### Deliverables

- Vector layers:
  - sensors markers
  - drones markers
  - ADS-B markers (mock-only in this phase)
- Details panel shows:
  - position
  - altitude formatting (with comment)
  - speed formatting
