# AGENTS.md

This repository is a **frontend-first prototype** web app that displays:

- Drone locations (telemetry) and detected objects from sensors
- Basic air-traffic overlays (ADS-B, prototype-only)
- NOTAMs (from EANS JSON), visualized on the map and in panels

**Primary goal:** get the **frontend up and running fast** with mocked data and browser polling.

---

## Non-negotiables (read first)

1) **NO PROXY (HARD RULE)**
   - All HTTP requests are done **directly from the browser** until the GUI works.
   - Do **not** add a proxy server, backend forwarding, or “temporary proxy to fix CORS”.
   - If an endpoint has CORS issues: keep mocks on, document it in `docs/DATA_SOURCES.md`, and move on.

2) **Prototype scope only**
   - No backend DB yet: read from `public/mock/*` and/or public endpoints.
   - Auth is **scaffold-only**: `VITE_AUTH_MODE=off|basic` exists, but only `off` is implemented now.

3) **Time & units rules**
   - UTC everywhere in “data/storage logic”. **Local time only in UI formatting**.
   - Keep both **event time** and **ingest time** for robustness.
   - Units:
     - Drones: speed **m/s**
     - Aircraft: speed **km/h**
     - Altitudes stored in **m** (meters)
     - NOTAM/UI text shows **both ft and m**

4) **Map & projections**
   - Domain geometry is **WGS-84** (EPSG:4326) as `[lon, lat]`.
   - OpenLayers `View` is **EPSG:3857**.
   - Transform only at boundaries (render / OpenLayers feature creation).

---

## Stack (MVP)

- React + TypeScript + Vite
- UI: Material UI (MUI)
- Map: OpenLayers
- Basemap: Maa-amet orthophoto via WMTS
- Testing:
  - Unit/component: Vitest + React Testing Library
  - Network mocking: MSW
  - E2E smoke: Playwright

---

## Setup & commands (npm only)

**Do not mix package managers. Use npm.**

- Install deps: `npm install`
- Dev server: `npm run dev`
- Build: `npm run build`
- Preview build: `npm run preview`
- Lint: `npm run lint`
- Typecheck: `npm run typecheck`
- Unit tests: `npm run test`
- E2E smoke: `npm run test:e2e`

Expected `package.json` scripts:

- `dev`: `vite`
- `build`: `vite build`
- `preview`: `vite preview`
- `lint`: `eslint .`
- `typecheck`: `tsc -p tsconfig.json --noEmit`
- `test`: `vitest`
- `test:e2e`: `playwright test`

---

## Build-time configuration (Vite env vars)

All build-time config uses **Vite env vars** (`VITE_*`). Vite injects `VITE_*` values
into `import.meta.env` **when the dev server starts or during a build**; changing
OS env vars after the server is running will not update an already-built bundle.
Access env values only through `src/shared/env.ts`, which validates and parses them.

Recommended:

- `VITE_USE_MOCKS=1|0` (default `1` for MVP)
- `VITE_NOTAM_URL=https://aim.eans.ee/web/notampib/area24.json`
- `VITE_ADSB_BASE_URL=https://api.airplanes.live/v2`
- `VITE_ADSB_CENTER_LAT=58.5953`
- `VITE_ADSB_CENTER_LON=25.0136`
- `VITE_ADSB_RADIUS_NM=250`
- `VITE_DRONE_URL=...`
- `VITE_SENSORS_URL=...`
- `VITE_MAP_WMTS_URL=...` (Maa-amet WMTS base URL)
- `VITE_AUTH_MODE=off|basic` (default `off`)
- `VITE_POLL_ADSB_MS=10000`
- `VITE_POLL_DRONES_MS=1000`
- `VITE_POLL_SENSORS_MS=1000`

Vite loads `.env`, `.env.local`, `.env.[mode]`, `.env.[mode].local`, and OS env
vars in that order. Dev uses the `development` mode, tests may use `test`, and
production builds use `production`. `*.local` files are machine-specific and are
gitignored; track the schema in `.env.example`.

- `.env.example` must list all supported `VITE_*` keys with safe defaults/comments.
- `.env.local` stays untracked for developer-specific overrides.
- If we need runtime-tweakable config later, introduce a server-served JSON (e.g., `/config.json`) and document it separately from Vite envs.

**Important:** even if some docs suggest a proxy for Maa-amet or other endpoints, we do not do that in MVP.

---

## Repo structure (where code goes)

Keep OpenLayers isolated from UI panels.

```
src/
  app/
    main.tsx               # bootstrap
    App.tsx                # router + global providers
    routes.tsx             # route contract (/:tool)
    env.ts                 # typed env access (VITE_*)

  layout/
    MapShell/
      MapShell.tsx         # persistent map + chrome + sidebar
      LeftSidebar.tsx
      TopToolbar.tsx
      SessionControls.tsx  # auth scaffold UI (shows demo user)
      urlState.ts          # parseTool/parseEntity helpers
      useSidebarUrlState.ts

  map/
    MapView.tsx            # owns OpenLayers Map instance
    mapApi.ts              # narrow API UI can call
    transforms.ts          # EPSG:4326 <-> 3857 boundary helpers
    layers/
      maaAmetOrthoWmts.ts  # WMTS config in one place
      vectors.ts           # vector layers (drones/sensors/notams)
    styles/
      icons.ts
      labels.ts

  features/                # UI panels only (NO OpenLayers imports)
    air/
      AirTrafficPanel.tsx
    sensors/
      SensorsPanel.tsx
    drones/
      KnownDronesPanel.tsx
    geofences/
      GeofencesPanel.tsx
    history/
      HistoryPanel.tsx
    objectDetails/
      ObjectDetailsPanel.tsx

  services/
    polling/
      usePolling.ts        # shared polling hook w/ AbortController

    adsb/
      adsbClient.ts        # fetch + DTO->domain mapping
      adsbTypes.ts

    drones/
      droneClient.ts
      droneTypes.ts

    sensors/
      sensorsClient.ts
      sensorsTypes.ts

    notam/
      notamClient.ts       # fetch JSON
      notamInterpreter.ts  # interpret + normalize into meters
      notamTypes.ts

  shared/
    types/
      domain.ts            # Domain types (Altitude, EntityRef, etc.)
    time/
      utc.ts               # parse/format (UTC in, local out)
    units/
      altitude.ts          # ft<->m + formatting helpers
      speed.ts             # m/s + km/h helpers

  ui/
    EmptyState.tsx
    KeyValueRow.tsx
    StatusPill.tsx

  mocks/
    handlers.ts            # MSW handlers
    browser.ts             # MSW worker (optional)
    server.ts              # MSW for Vitest

public/
  mock/
    drones.json
    sensors.json
    adsb.json
    notams.sample.json

docs/
  ARCHITECTURE.md
  DATA_SOURCES.md
  UI_RULES.md
```

---

## Architecture boundaries (enforced)

### Map boundary

- `src/map/MapView.tsx` owns the OpenLayers `Map` instance.
- Feature panels **must not** import OpenLayers or mutate map state directly.
- Panels communicate via `mapApi` only:
  - `mapApi.setSelection({ kind, id })`
  - `mapApi.setLayerVisibility(key, visible)`
  - `mapApi.focusEntity(ref)`

### Data boundary

- Services convert raw DTOs into **domain objects**.
- Panels render **view models / formatted strings**, not raw DTOs.

---

## Domain types and UI rules (strict)

### Altitude

Use these types verbatim:

```ts
export type AltitudeRef = "AGL" | "MSL";
export type AltitudeSource = "detected" | "reported" | "unknown";

export type Altitude = {
  meters: number | null;        // number stays a number
  ref: AltitudeRef;             // AGL vs MSL
  source: AltitudeSource;       // detected vs drone-reported
  comment?: string;             // ALWAYS shown next to altitude
  rawText?: string;             // if upstream gave unparseable text
};
```

Display rules:

- **No naked altitude numbers.**
- Always show altitude like:
  - `86 m — AGL (detected)`
  - `120 m — AGL (reported)`
  - `540 m — MSL (unknown)`
- NOTAM-derived altitudes are stored in meters but UI shows both:
  - `300 m (984 ft) — MSL (reported) — <comment>`

**Altitude comment must be visible next to the altitude** (even if it’s a short hint like `"from NOTAM text"`).

### Time

- Internal domain objects: UTC only.
- UI formatting: local time allowed, but keep the original UTC value.
- Store both:
  - `eventTimeUtc` (when the sensor/drone says it happened)
  - `ingestTimeUtc` (when we received it)

---

## NOTAM handling (prototype)

- Fetch NOTAM JSON from `VITE_NOTAM_URL`.
- Implement `src/services/notam/notamInterpreter.ts` that:
  - Decodes/normalizes NOTAM content as needed
  - Converts altitude/levels into **meters**
  - Produces domain objects ready for UI + map layers

You may use an existing JS NOTAM decoding library (adapter style), but keep it **behind** `notamInterpreter.ts` so we can swap later.

**Important:** NOTAM interpretation will move to backend later; this is UI-only for now.

---

## Polling behavior (prototype)

- ADS-B: poll every **10s** (default)
- Drones: poll **~1 Hz** (default)
- Sensors: poll **~1 Hz** (default)

Rules:

- Use `AbortController` to cancel in-flight requests on interval tick/unmount.
- On network error: keep last good data and expose a **stale indicator** (e.g., “last updated 32s ago”).

---

## Maa-amet WMTS basemap

- Use Maa-amet orthophoto via WMTS.
- Keep WMTS config in `src/map/layers/maaAmetOrthoWmts.ts`.

**Prototype note:** we can temporarily bypass Maa-amet rules at this stage.

TODOs (do not hallucinate / do not guess):

- Exact WMTS layer name
- matrixSet identifier
- attribution text
- tile grid details

---

## Routing & deep links (URL contract)

Tool belongs in the path:

- `/air`
- `/sensors`
- `/geofences`
- `/known-drones`
- `/history?hDate=2025-12-18&hArea=T1`

Global entity selection uses a query param:

- `/air?entity=sensor:425006`

Why this contract:

- tool in path → clean URLs and fast routing
- entity is global → map click selection works from any tool
- only minimal history context in URL → everything else stays local

Router setup:

```tsx
// src/app/routes.tsx
import { createBrowserRouter, Navigate } from "react-router-dom";
import { MapShell } from "@/layout/MapShell/MapShell";

export const router = createBrowserRouter([
  { path: "/", element: <Navigate to="/air" replace /> },
  {
    path: "/:tool",
    element: <MapShell />,
  },
]);
```

URL-state helpers live in:

- `src/layout/MapShell/urlState.ts`
- `src/layout/MapShell/useSidebarUrlState.ts`

History/back button policy:

- Tool changes push history
- Entity selection replaces history by default (avoid back-button spam)

---

## Auth scaffold (do not implement yet)

We keep `VITE_AUTH_MODE=off|basic` for future work.

Only `off` exists now and behaves as logged-in admin:

```ts
const mockUser = { username: "demo", roles: ["admin"] as const };

export function useAuth() {
  return {
    isAuthenticated: true,
    user: mockUser,
    login: async () => {},
    logout: () => {},
  };
}
```

Do not implement “basic” beyond placeholder types/interfaces.

---

## Testing (minimum bar)

### Unit + component (Vitest + RTL)

Required tests:

- `formatAltitude()` / `formatSpeed()` / NOTAM altitude formatting
- `parseTool()` / `parseEntity()` / URL-state helpers
- Panel empty state renders + basic list render (History/Air/Sensors)

### Network mocking (MSW)

- Mock NOTAM / ADS-B / drones / sensors endpoints so polling is deterministic. Until we include sensor APIs.

### E2E smoke (Playwright)

At least:

- App loads → map renders → base layer visible
- Switch tools → sidebar panel changes
- Click a marker → selection updates URL and object details opens

---

## Change policy

✅ Always:

- Keep changes small and runnable.
- Before calling work “done”, run: `npm run typecheck`, `npm run lint`, `npm run test`.

⚠️ Ask first (in PR description or issue):

- Adding new runtime dependencies
- Changing polling intervals, schemas, projections, or URL contract
- Introducing a global state framework (Redux, MobX, etc.)

🚫 Never:

- Commit secrets / API keys
- Spread unit/time conversion logic outside `src/shared/`
- Put OpenLayers logic into `src/features/*`
- Add a proxy (until GUI works)

---

## Companion docs (keep current)

- `docs/ARCHITECTURE.md` — MapShell + panel router + polling overview (1 page)
- `docs/DATA_SOURCES.md` — endpoints, polling rates, JSON shape examples (draft OK)
- `docs/UI_RULES.md` — units/time/labels rules (so nobody guesses)

- docs/IMPLEMENTATION_PLAN.md, maintain a small, explicit section at the top to note where we are in the plan. Change after sucessful implementations that fulfill a step.
