# UI_RULES.md

UI rules for the **frontend-first** drone + sensor + NOTAM map prototype.

This file exists so nobody has to guess how to display time/units/labels.

---

## Core principles

1) **Clarity beats cleverness**
   - Prefer explicit labels (`AGL`, `MSL`, `detected`, `reported`) over ambiguous icons.

2) **UTC in domain, local only in UI**
   - Internal domain values remain UTC.
   - Convert to local time only at the last moment (render/formatting).

3) **Metric-first**
   - Base storage and primary display is metric.
   - When aviation conventions demand it (NOTAM, aircraft altitude), also show feet.

4) **No naked numbers**
   - Numbers must have units and context.
   - Altitude must always show reference and source, and a visible comment.

---

## Time rules

### Storage

Every event-like domain object must carry:

- `eventTimeUtc`: when upstream says the event happened (ISO-8601 with `Z`)
- `ingestTimeUtc`: when the frontend received/processed it (ISO-8601 with `Z`)

### UI display

- **Default display:** local time (user’s locale), but always derived from `eventTimeUtc`.
- Show UTC explicitly only where it helps debugging (e.g., in a detail “raw” section).
- If `eventTimeUtc` is missing or invalid, display `Unknown time` and keep raw value in a debug field.

### Recommended formats

- List rows (compact): `HH:mm:ss` (local)
- Detail header: `YYYY-MM-DD HH:mm:ss` (local)
- History day selector uses UTC date strings: `hDate=YYYY-MM-DD`

### Staleness indicators

For polled data, show staleness based on `ingestTimeUtc`:

- `Live` if age ≤ 2× poll interval
- `Stale (Xs)` if age > 2× poll interval
- `Offline` if no data received yet

(Exact thresholds can be tuned later; keep logic centralized.)

---

## Coordinate rules

### Domain representation

- Store positions as WGS-84 (EPSG:4326) in `[lon, lat]`.
- UI may show coordinates as:
  - decimal degrees: `59.43690, 24.75360` (lat, lon) **OR**
  - explicit labels: `Lat 59.43690, Lon 24.75360`

### Map projection

- OpenLayers `View` is EPSG:3857.
- Transform only at boundaries (feature creation/render). Do not store 3857 in domain.

### Map controls and overlays

- **Cursor Coordinates Overlay**:
  - Show current mouse cursor coordinates in the bottom-right corner of the map.
  - Format: `DD.DDDDDD°N, DD.DDDDDD°E`.
  - Style: 100% transparent background (no box/border) to minimize map obstruction.
  - Interaction: Non-interactive (pointer-events: none) so it doesn't block map clicks.
- **Map View Persistence**:
  - The map view state (zoom level and center position) MUST be persistent across navigations and tool switches.
  - Selecting a different tool in the sidebar or navigating via the URL must not reset the map's current focus, unless explicitly requested by the feature logic (e.g., clicking on a specific aircraft in a list).

---

## Units rules

### Distance

- meters: `m`
- kilometers: `km` (only when values are large or context demands it)

### Speed

- Drones: **m/s**
- Aircraft (ADS-B): **km/h**

Display guidelines:

- Drones: `12.4 m/s`
- Aircraft: `720 km/h`

### Heading / track

- Degrees: `°`
- Display: `275°` (no decimals unless needed)

---

## Altitude rules (strict)

### Domain types (must match code)

```ts
export type AltitudeRef = "AGL" | "MSL";
export type AltitudeSource = "detected" | "reported" | "unknown";

export type Altitude = {
  meters: number | null;
  ref: AltitudeRef;
  source: AltitudeSource;
  comment?: string; // ALWAYS shown next to altitude
  rawText?: string;
};
```

### Storage

- Store altitude values in **meters**.
- Store both:
  - reference: `AGL` vs `MSL`
  - source: `detected` vs `reported` vs `unknown`
- If upstream provides a non-parseable altitude text, keep it in `rawText`.

### Display (mandatory)

- **Never** display altitude as just a number.
- Always include:
  - meters value (or `—` if null)
  - reference (`AGL`/`MSL`)
  - source (`detected`/`reported`/`unknown`)
  - a visible comment (even if short)

Examples:

- `86 m — AGL (detected) — RF+vision fused`
- `120 m — AGL (reported) — Remote ID`
- `540 m — MSL (unknown) — source unclear`

If `meters` is null:

- `— — AGL (detected) — <comment> (raw: <rawText>)`

### NOTAM altitude display

NOTAM-derived altitudes are stored in meters but **UI text shows both ft and m**:

- `300 m (984 ft) — MSL (reported) — from NOTAM`

Rules:

- Show both units for any NOTAM altitude in lists and details.
- Keep ft value derived from meters (not separately stored), unless the only available info is raw text.

---

## NOTAM UI rules

### Panels

Each NOTAM list item should show:

- NOTAM ID (`A1234/25`)
- Short summary (best-effort)
- Validity window (local display, derived from UTC)
- Altitude limits (both ft+m)
- A status tag:
  - `Active` / `Upcoming` / `Expired` (based on now vs validity)

### Map overlays

- If geometry can be derived: draw it.
- If geometry is unknown/unparsed: still list the NOTAM, and show `No geometry (prototype)`.

---

## Labeling and typography

- Map labels should be short:
  - Drone: `D-001` or a short label, plus optional altitude
  - Sensor: `S-425006`
- Details panel can show full identifiers.
- Avoid dense text on the map. Put details in the sidebar.

---

## Empty states and errors

### Empty state

When a list has no items:

- Show a friendly empty state: `No drones detected` / `No NOTAMs`.
- Include the last update time if known.

### Fetch errors

- Do not clear the UI on a transient error.
- Keep last known-good data and show a non-blocking warning:
  - `Live data fetch failed — showing last update from 10:15:30`

### CORS / blocked endpoint

- Do not implement a proxy.
- Switch to mocks (`VITE_USE_MOCKS=1`) and document the issue in `docs/DATA_SOURCES.md`.

---

## Formatting helpers (single source of truth)

All formatting must go through helpers in `src/shared/`:

- `src/shared/time/*` for time formatting
- `src/shared/units/altitude.ts` for altitude + ft conversion + display strings
- `src/shared/units/speed.ts` for speed formatting

Do not re-implement conversion/formatting inside components.

---

## Interaction rules (map ↔ sidebar)

- Clicking an entity on the map sets the global `entity` query param and opens `ObjectDetailsPanel`.
- Clearing selection removes `entity` from the URL.
- Tool changes push browser history; entity selection replaces history by default.

---

## Accessibility

- Ensure keyboard navigation in the sidebar lists.
- Provide `aria-label`s for icon-only buttons.
- Keep contrast acceptable for map overlay labels and status pills.

---

## Layout and Scrolling

### Sidebar Panels
- All sidebar panels (Airplanes, Drones, Sensors, Geofences, etc.) must be scrollable.
- **Header Persistence**: Ideally, the panel header (title, status, primary actions) should remain visible at the top while the list or detail content scrolls.
- **Scroll Bars**: List containers within panels must use `overflow: "auto"` (not `hidden`) and have their heights constrained (e.g., via `flex: 1` in a `height: 100%` container) to ensure scrollbars appear when content exceeds the available space.
- **No Page Scroll**: The main application layout is fixed to the viewport (`100vh`). Scrolling must be contained within specific UI regions (Sidebar, Map Detail, etc.).

---

## TODOs (expected to evolve)

- Decide canonical coordinate display (lat/lon vs lon/lat) for UI fields.
- Decide whether to show both UTC and local time in detail view.
- Define severity levels for detections/alerts (prototype may show a simple tag).

