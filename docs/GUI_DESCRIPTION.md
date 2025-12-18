#This document describes expected visual outcome:

1) Overall layout and layering

Base canvas: a full-viewport interactive map (streets/terrain/water, Leaflet/OpenStreetMap vibe). Everything else is a floating overlay on top of the map.

Persistent chrome (always visible):

Top-left brand block + top-left icon toolbar (primary navigation).

Top-right session controls (org/user, language).

Map-native controls (zoom), plus app controls (Layers button) in the corners.

Dynamic content surface: a left sidebar panel (roughly 350–400px wide) that changes content depending on the selected tool (Air traffic, Geofences, Sensors, Known drones, History, Object details). 

pasted

Z-order (mental model):

Map (lowest)

Map overlays (polygons/zones, markers)

Corner map controls (zoom, scale, attribution)

Floating app panels (left sidebar, small widgets)

Popups anchored to map markers (detail popovers)

2) Top-left: branding + primary navigation
Branding strip (top-left)

Dark background container.

Hamburger icon (menu) + DRONERADAR wordmark.

Red “radar” emblem next to/behind the brand text (accent identity).

Primary toolbar (below branding)

A slim white horizontal strip containing icon buttons. The exact set varies by view/build, but the core pattern stays:

Common icons and meaning:

Radar → live monitoring / air traffic.

Polygon/hex → geofences.

Clock → history (past flights playback / logs).

Drone → “Known drones” management (allowlist/roles). 

pasted

Sliders/gear → filters/settings. 

pasted

Document/list → logs/reports (if present in your build).

User/person → account/admin area (if present).

Refresh → reload data (if present). 

pasted

Chevron → collapse/expand the toolbar strip.

States:

Active tool shows a red highlight (especially the Radar tool).

Inactive icons are neutral/dark on white.

3) Top-right: session controls

Compact, right-aligned controls:

Org/User button (example label: “PPA 1”).

Language dropdown (example: “ENG”).

Optional fullscreen toggle (observed as part of system controls in some sequences). 

pasted

Visual style: muted/gray buttons, small caps feel, minimal decoration.

4) Map UI elements and graphics
Map markers (domain-specific)

Green circular markers with white glyphs:

“H” / hub-home style icons (detection sites / hubs)

aviation-related markers (helipads/airports) with short labels (e.g., TLL)

Markers are clickable and can open:

a small map-anchored popup, and/or

update the left sidebar with the selected object’s details.

Overlays (zones/areas)

Semi-transparent gray restricted rectangles/areas.

Polygons/circles for geofences.

In the geofence wizard, a translucent purple circle + center crosshair appears and is draggable.

Corner controls

Bottom-right: “Layers” button (square button + stack icon).

Bottom-left: scale bar (metric + imperial style).

Attribution line (Leaflet/OSM style).

5) Left sidebar: shared structure (all panels)

No matter which tool is selected, the left sidebar behaves consistently:

Header block:

Title (bold, dark gray)

Subtitle (smaller, light gray)

Close “X” top-right inside the panel

Body:

Controls / filters

Then content (lists, cards, accordions, detail sections)

Styling:

Background: white

Borders/dividers: very light gray

Typography: modern sans-serif; headings high contrast; metadata in muted gray

Buttons: rounded rectangles; primary actions are stronger color

6) Panel: Air traffic (Radar)

A compact status widget or sidebar state when Radar is active:

Header: “Air traffic” + close X

Empty state: “No drones airborne”

Control: Measurement period dropdown/selector (example value: “3 s”)

This reads like a “live feed status” card: simple, calm, and always ready to turn noisy when drones appear.

7) Panel: Geofences
Geofence list view

Title: Geofences

Subtitle: “Defining areas of responsibility and interest”

Primary action: New geofence

Section: Currently active

List items: short codes (T1, STBCK, etc.) with validity metadata (e.g., “Indefinite”)

Interaction:

Clicking a geofence highlights it on the map and opens the detail view.

Geofence detail view

Thumbnail/header image (small map preview)

Title (code) + human name/description

Attribute rows with icons:

Buffer (e.g., 100m)

Maximum height (e.g., starting from 100m)

Validity period (Indefinite)

Actions (icon + text buttons):

Show on map (eye)

Edit details (pencil)

Delete (trash)

New geofence wizard (multi-step)

Progress indicator: 1–7 circles in a row

Active step: green

Future steps: gray

Step 1: Territory

Explanation text (polygon vs circle)

Shape selector: Polygon | Circle

Coordinate mode toggle: LAT–LON | MGRS

Inputs:

Latitude, Longitude

Radius (meters) if circle

Map shows the draggable translucent shape

Step 2: Maximum height

Checkbox: “Specify maximum allowed height” (off by default)

Back / Next controls

(You can scaffold steps 3–7 even if not shown; the UI is built to imply a longer guided flow.)

8) Panel: Sensors (overview + map popup)

A “Sensors” sidebar state exists in the navigation set observed later:

Header: Sensors

Subtitle: “Overview and sensor status”

Content grouped by region/owner (accordion-like grouping)

Each sensor row includes:

Sensor-type icon (tower/radar dish)

Name (e.g., “Nursi toe 2”)

Status dot (green = online; gray = offline)

Small technical readout / ID (e.g., “425006”) 

pasted

Map popup for a sensor (anchored tooltip card):

Title + close X

Fields: Serial number, Group, Coordinates

Actions:

Show on map (toggle)

Change location (crosshair/edit)

Remove location (trash; destructive color) 

pasted

9) Panel: Known drones (allowlist/roles)

A form-driven management panel:

Title: Known drones

Subtitle: “Marking friendly and hostile drones”

Inputs:

Drone serial number (required)

Drone identifier/model (required; dropdown/autocomplete)

Notes (optional text area)

Role validity:

Radio: Indefinite / Temporary

Actions (three prominent buttons):

Add as friendly (green, strong)

Add as neutral (gray)

Add as hostile (red, destructive emphasis)

Below: search/results section (“Drones matching search criteria”) with result cards and an update flow. 

pasted

This panel’s visual logic is: “data entry up top, searchable roster below.”

10) Panel: History (past flights)

A browsing panel optimized for daily review:

Header:

Title: History

Subtitle: “Browse past flights”

Close X

Controls row:

“Select area” button (outlined)

Date navigation:

Left arrow (previous day)

Date label (Today / DD.MM) with calendar icon

Right arrow (next day)

Content grouping (accordion by date):

Section headers like “YESTERDAY’S FLIGHTS”, “16.12 FLIGHTS”

Header shows flight count + chevron

Inside a date group:

Summary stats box (light background/border) with counts:

Flights violating geofences

Flights of hostile drones

Flights over the 120m limit
(Counts turn red when non-zero.)

Flight list cards:

Left: time (bold)

Middle: model name (bold) + serial/identifier + location (muted)

Right: telemetry snippet (altitude “H > Xm”); red if limit exceeded

Small drone/camera glyph near the model is plausible/consistent. 

pasted

11) Object detail panel (selected site/object)

When a specific site/object is selected (e.g., “Nursi toe 2”), the sidebar becomes a detail card:

Header image thumbnail (location photo)

Big title

Field rows:

Serial number

Group/owner label with icon

Coordinates with copy icon

Actions:

Show on map (eye)

Change location (edit)

Remove location (trash/destructive)

This is the “entity profile” pattern used across the app.

12) Visual language (so it feels like the same product)

Palette (functional, not decorative):

White panels (#fff) with light gray dividers

Dark gray headings, muted gray metadata

Green = safe/online/friendly/primary “go” actions

Red = violations/hostile/destructive actions

Blue sometimes for secondary actions like “Update” 

pasted

Iconography:

Thin-line or simple filled glyphs, consistent stroke weight

Icons always paired with text in side panels; icons alone in the top toolbar

Motion:

Sidebar swaps content or slides in/out; accordions expand/collapse; map popups appear anchored.