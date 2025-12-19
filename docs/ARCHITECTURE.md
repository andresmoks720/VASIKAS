# ARCHITECTURE.md

This page is a practical map-first guide for the prototype. The app is a **persistent MapShell**: the map stays mounted while the sidebar and toolbar react to URL state. No proxy servers are used.

## Layout + routing contract

- Path = **tool**: `/air`, `/sensors`, `/geofences`, `/known-drones`, `/history`
- Query = **selection/history**: `?entity=kind:id`, optional `hDate`, `hArea`
- MapShell pieces:
  - **Toolbar**: switches tools (pushes history)
  - **Sidebar**: shows a tool panel or object details (entity selection replaces history)
  - **Map**: persistent OpenLayers view in EPSG:3857, domain data stored as EPSG:4326 `[lon, lat]`

## Boundaries (what goes where)

- `src/map/*`: **OpenLayers only** (MapView owns the map). Add base/vector layers in `map/layers/*`, styles in `map/styles/*`, projection helpers in `map/transforms.ts`. Panels must never import OL.
- `src/layout/MapShell/*`: URL state, layout wiring, and sidebar orchestration. No map logic beyond mounting `<MapView />`.
- `src/features/*`: **panels only** (React UI). Fetch state via services/hooks; talk to the map through a narrow `mapApi` once added.
- `src/services/*`: data clients + polling + DTO→domain mapping. Keep VITE_* config and mocks here.
- `src/shared/*`: domain types, time/unit helpers. Do not duplicate conversions elsewhere.

## Where to add things next

- **New map layer**: create under `src/map/layers/`, wire into `MapView` (or a future `mapApi`) and keep styling in `src/map/styles/`.
- **New panel**: add a component in `src/features/<tool>/`, export a heading, and register it in `LeftSidebar`.
- **New client/polling**: implement in `src/services/<area>/`, expose hooks, and keep mock handlers in `src/mocks/handlers.ts`.
- **URL handling**: extend `urlState.ts` and `useSidebarUrlState.ts` if more query params or tool routes are needed.

## Data + control flow (at a glance)

```
services (fetch + map DTOs)
     ↓
MapShell / panels (React state + render)
     ↓             ↓
  mapApi*       URL state (tool + entity)
```

`mapApi` is the planned bridge for focus/select and layer toggles; panels never reach into OpenLayers directly.
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
