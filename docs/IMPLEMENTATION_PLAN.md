# IMPLEMENTATION_PLAN.md

## Current status

Use this section to state the **actual** project status; do not leave examples in place.

- Phase: <current phase name + short description>
- Implemented:
  - <shipped items>
- In progress:
  - <work underway (remove once shipped)>
- Next (1–3 concrete actions):
  - <upcoming work>

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
  - event/ingest times
- “Stale” indicator per stream (even for mocks).

### Acceptance

- On load, at least one sensor is visible.
- One drone moves smoothly/stepwise across the map.
- One aircraft track is visible (mock).

### Tests

- Unit: `formatAltitude`, `formatSpeed`, ft↔m conversion.
- MSW: polling returns deterministic mocked responses.
- Playwright: open app → drone marker exists → after ~2s position changes.

---

## Phase 2 — Geofences + sensor add/remove (mock persistence)

### Goals

- Users can create geofences (circle minimum; polygon optional later).
- Users can add/remove sensors (still mock-based) and see them on the map.

### Implementation notes

- Persistence is **in-memory** first, optionally `localStorage` behind a small adapter.
- Keep geofence geometry stored in WGS-84.
- Editing UX can be minimal:
  - create circle by clicking center and entering radius
  - list view to rename/delete

### Deliverables

- Geofence CRUD in UI:
  - create circle
  - list
  - delete
  - basic rename
- Sensor CRUD in UI (prototype):
  - add sensor with lon/lat + name + kind
  - delete sensor
- `docs/DATA_SOURCES.md` updated to include geofence and local persistence notes.

### Acceptance

- Create a circle geofence → appears on map layer and in geofence list.
- Add a sensor → appears on map and in sensors list.

### Tests

- Unit: geometry helpers (circle approximation, WGS84 storage).
- Component: GeofencePanel form submits and list updates.
- Playwright: create geofence end-to-end.

---

## Phase 3 — NOTAM ingest + overlays + “geofence from NOTAM”

### Goals

- Fetch NOTAM JSON (EANS) or use mock if blocked.
- Interpret enough to display a NOTAM list and (best-effort) map overlays.
- Create geofences from NOTAM entries (manual confirmation button).

### Implementation notes

- Keep NOTAM interpretation in `services/notam/notamInterpreter.ts` (adapter boundary).
- Expect NOTAM parsing to be imperfect in frontend prototype.
- If geometry can’t be derived, still show the NOTAM entry and mark geometry as unavailable.

### Deliverables

- NOTAM panel:
  - list entries
  - validity window
  - altitude display in **m and ft**
  - “Create geofence from NOTAM” action (where possible)
- NOTAM map layer (polygons/circles when available).

### Acceptance

- NOTAMs load (live or mock) and are visible in a list.
- At least one NOTAM overlay can be displayed from mock samples.
- User can create a geofence from a NOTAM (using mock geometry).

### Tests

- Unit: NOTAM altitude parsing and formatting (m+ft).
- Unit: NOTAM interpreter returns stable normalized objects for sample fixtures.
- Component: NOTAM list renders and “create geofence” button calls handler.

---

## Phase 4 — Live ADS-B client (browser fetch)

### Goals

- Add a real ADS-B client that polls every 10 seconds.
- Keep fallback to mocks when endpoint fails.

### Implementation notes

- **No proxy**. If CORS blocks, document and keep mocks on.
- Client should:
  - normalize DTO → domain
  - update staleness indicators

### Deliverables

- `services/adsb/adsbClient.ts` with:
  - fetch
  - mapping
  - error handling
- UI toggle (optional): “Live / Mock” badge determined by `VITE_USE_MOCKS`.

### Acceptance

- With a working ADS-B endpoint, aircraft markers update every 10s.
- If endpoint fails, app keeps last good data and shows stale/error state.

### Tests

- MSW: ADS-B endpoint mocked for deterministic unit/integration tests.

---

## Phase 5 — Live single drone sensor client (others mocked)

### Goals

- Integrate one real drone sensor feed (or a single drone API) while keeping the rest mocked.
- Prove the adapter pattern and staleness handling.

### Deliverables

- `services/drones/droneClient.ts` supports:
  - one live feed URL
  - mock fallback
- Data model includes `Altitude` with comments and source.

### Acceptance

- One live drone appears/updates ~1 Hz.
- Mock drones can still be enabled for demos.

### Tests

- Unit: mapping for the live DTO into domain altitude/time rules.
- MSW: simulate intermittent failures and verify stale indicator logic.

---

## Phase 6 — Backend persistence (geo areas + history)

### Goals

- Persist geofences/sensors/history in a DB.
- Introduce a real history timeline and day-scoped history URLs.

### Out of scope

- Proxy servers are still not introduced here unless strictly needed.

### Deliverables

- Backend service (separate repo or folder) providing:
  - geofence CRUD
  - sensor CRUD
  - event history queries
- Frontend clients switch from local storage to backend endpoints via env vars.

### Acceptance

- Refreshing the page keeps geofences/sensors.
- `/history?hDate=YYYY-MM-DD` shows events for the day.

### Tests

- Frontend contract tests against mocked backend endpoints (MSW).
- Backend unit tests for persistence (owned by backend plan).

---

## Phase 7 — Proxy servers (only after GUI is stable)

### Goals

- Add proxy only when it unlocks real integrations blocked by CORS or auth.
- Keep the frontend URL contracts stable.

### Deliverables

- Proxy service endpoints:
  - NOTAM fetch proxy (if needed)
  - Maa-amet tiles proxy (if needed)
  - ADS-B proxy (if needed)

### Acceptance

- Proxy is optional and gated by env var.
- App still works without proxy (mock mode).

---

## Phase 8 — Logging, authentication, roles, audit, history UX upgrades

### Goals

- Add real authentication (`VITE_AUTH_MODE=basic` + backend auth).
- Add role-aware UI (read-only vs operator vs admin) and audit trail.
- Improve history browsing (filters, playback, exports).

### Deliverables

- Auth enabled end-to-end
- Audit events for critical actions:
  - create/delete geofence
  - create/delete sensor
  - login/logout

---

## Work breakdown into milestones (suggested)

1) **M0: Skeleton** (Phase 0)
2) **M1: Demo motion** (Phase 1)
3) **M2: Editable world** (Phase 2)
4) **M3: NOTAM overlay demo** (Phase 3)
5) **M4: Live air traffic** (Phase 4)
6) **M5: First real drone sensor** (Phase 5)

After M5, decide whether to invest next into **backend persistence** or **more sensors**.

---

## Testing guidance (what to test where)

### Prefer unit tests for

- time parsing/formatting boundaries
- unit conversions (ft↔m, m/s↔km/h)
- NOTAM normalization functions
- URL state parsing and formatting

### Prefer E2E/integration tests for

- map rendering and layer visibility
- tool switching + selection UX
- geofence creation interactions

Rationale: OpenLayers rendering is integration-heavy; brittle unit tests around map internals are not worth it.

---

## Risk list (prototype)

- **CORS** from public endpoints (NOTAM, ADS-B, Maa-amet WMTS)
  - Mitigation: mocks + document failures in `docs/DATA_SOURCES.md`.
- NOTAM geometry extraction is messy
  - Mitigation: best-effort in frontend; keep interpreter behind adapter.
- Map clutter at low zoom
  - Mitigation: clustering/label suppression later; keep MVP simple.

---

## What we deliberately postpone

- Robust auth/roles/audit
- Server-side NOTAM parsing
- Persistence and long-term history
- Proxy servers
- Any sensitivity/security hardening

The point is to **get the GUI working** first.

