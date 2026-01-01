# TEST_CASES.md

| ID | Description | Implemented? | Location? | Notes? |
| --- | --- | --- | --- | --- |
| UNIT-URL-001 | parseTool/parseEntity | Yes | `src/layout/MapShell/urlState.test.ts` | URL helper coverage. |
| UNIT-URL-002 | formatEntity roundtrip + parseTool fallback | Yes | `src/layout/MapShell/urlState.test.ts` | Covers null/empty fallback behavior. |
| UNIT-ALT-001 | formatAltitude comment rule | Yes | `src/shared/units/altitude.test.ts` | Ensures comment always shown. |
| UNIT-ALT-002 | altitude shows meters + feet | Yes | `src/shared/units/altitude.test.ts` | Use when showFeet is enabled. |
| UNIT-SPEED-001 | speed formatter edge cases | Yes | `src/shared/units/speed.test.ts` | Covers null/NaN + boundary values. |
| UNIT-ADSB-001 | mapAircraftDto missing fields + units | Yes | `src/services/adsb/adsbClient.test.ts` | Null-safe + knots→km/h. |
| UNIT-ADSB-MOTION-002 | ADS-B motion invalid durations + empty tracks | Yes | `src/services/adsb/adsbMotion.test.ts` | Invalid timestamps, duration, and empty track coverage. |
| UI-SENS-001 | SensorsPanel empty/list render | Yes | `src/features/sensors/SensorsPanel.test.tsx` | Empty state + list split. |
| UI-SENS-002 | SensorsPanel stale + row status | Yes | `src/features/sensors/SensorsPanel.test.tsx` | Status pill + age text. |
| UNIT-UTC-001 | formatUtcTimestamp handling | Yes | `src/shared/time/utc.test.ts` | Unknown/invalid/normalized UTC + timezone requirement. |
| UNIT-UTC-002 | formatUtcTimestamp boundary + whitespace | Yes | `src/shared/time/utc.test.ts` | Whitespace handling + out-of-range timestamps. |
| UNIT-SENS-002 | mapSensorDto adds ingest/source | Yes | `src/services/sensors/sensorsTypes.test.ts` | DTO mapping coverage. |
| UI-STATUS-001 | StatusPill label rendering | Yes | `src/ui/StatusPill.test.tsx` | Polling status label. |
| UNIT-DRONE-MOTION-002 | Drone motion invalid timestamps + empty tracks | Yes | `src/services/drones/droneMotion.test.ts` | Invalid timestamp/empty track handling. |
| UNIT-POLL-EDGE-001 | Polling status edge cases | Yes | `src/services/polling/usePolling.test.ts` | Idle/error + invalid interval handling. |
| UNIT-HTTP-002 | ApiClient timeout boundaries | Yes | `src/services/http/apiClient.test.ts` | Timeout edge cases + abort handling. |
| E2E-NAV-002 | tool switch updates URL | Yes | `e2e/smoke.spec.ts` | URL + sidebar heading. |
| E2E-MAP-001 | map click selects flight and updates URL | Yes | `e2e/map-selection.spec.ts` | Map marker click updates entity query. |
| E2E-MAP-002 | offline tiles failure falls back to online basemap | Yes | `e2e/basemap-offline.spec.ts` | Forces mock tile 404s to confirm OSM fallback. |
| E2E-SMOKE-001 | load map + switch tools | Yes | `e2e/smoke.spec.ts` | Smoke path for map + routing. |
| DOC-TEST-001 | testing culture requirements documented | Yes | `agents.md`, `docs/TESTING.md` | Codifies test expectations for future work. |
| UNIT-NOTAM-OBS-001 | NOTAM geometry parse reasons + dev logging | Yes | `src/services/notam/notamGeometryParsing.test.ts`, `src/map/layers/controllers/createNotamsLayerController.test.ts` | Ensures schema mismatches are observable. |
| UNIT-NOTAM-CONTRACT-001 | NOTAM geometry contract fixtures | Yes | `src/services/notam/notamGeometryParsing.test.ts` | Fixture-driven schema guardrails. |
| TOOL-NOTAM-REPORT-001 | NOTAM geometry report script | Yes | `scripts/notam-geometry-report.ts` | Local diagnosis tool. |
| UNIT-ENV-001 | Env parsing helpers | Yes | `src/shared/env.test.ts` | Boolean/number parsing and URL resolution. |
| UNIT-ENV-002 | Optional env coordinate range validation | Yes | `src/shared/env.test.ts` | Rejects NaN/out-of-range optional coordinates. |
| UNIT-ADSB-TYPES-001 | ADS-B track DTO sorting | Yes | `src/services/adsb/adsbTypes.test.ts` | Sorting and validation coverage. |
| UNIT-DRONE-TYPES-001 | Drone track DTO mapping | Yes | `src/services/drones/droneTypes.test.ts` | Sorting and altitude comment defaults. |
| UNIT-DRONE-CLIENT-002 | Drone client supports envelope response from Mock API | Yes | `src/services/drones/droneClient.test.ts` | Support for `{ drones: [] }` format. |
| UI-HISTORY-001 | HistoryPanel empty + list render | Yes | `src/features/history/HistoryPanel.test.tsx` | Empty state and populated props. |
| UI-DRONES-002 | KnownDronesPanel empty + list render | Yes | `src/features/known-drones/KnownDronesPanel.test.tsx` | Empty state and list rendering. |
| UI-AIR-002 | AirTrafficPanel empty + list render | Yes | `src/features/air/AirTrafficPanel.test.tsx` | Empty state and list rendering. |
| UI-NOTAM-001 | NotamsPanel empty + list render | Yes | `src/features/notams/NotamsPanel.test.tsx` | Empty state + list render coverage, including live fallback label. |
| UNIT-TIME-UPDATE-001 | formatUpdateAge label formatting | Yes | `src/shared/time/updateAge.test.ts` | Ensures seconds/minutes copy uses explicit wording. |
| UNIT-NOTAM-POLL-001 | NOTAM polling defaults + boundary values | Yes | `src/services/notam/useNotamPolling.test.tsx` | Option handling + invalid/boundary inputs. |
| UNIT-NOTAM-STREAM-001 | NOTAM stream mapper + env boundaries | Yes | `src/services/notam/notamStream.test.tsx` | Mapper delegation + empty URL interval. |
| UNIT-NOTAM-MODE-001 | NOTAM live/mock toggle persistence | Yes | `src/services/notam/notamMode.test.tsx` | Local storage hydration and updates. |
| UNIT-NOTAM-COUNT-001 | NOTAM raw item counting | Yes | `src/services/notam/notamNormalizer.test.ts` | Counts mock/live payload items for discrepancy checks. |
| UNIT-NOTAM-RADIUS-001 | NOTAM radius unit normalization | Yes | `src/services/notam/altitude/altitudeParser.test.ts` | Covers km/nm string and numeric radius inputs. |
| UNIT-STREAMS-CTX-001 | StreamsProvider context enforcement | Yes | `src/services/streams/StreamsProvider.test.tsx` | Shared hooks and missing-provider error. |
| UNIT-DRONE-SNAPSHOT-001 | Snapshot drone stream uses MSW handler | Yes | `src/services/drones/droneSnapshotClient.msw.test.ts` | Ensures snapshot flow returns drones without external server. |
| UNIT-MOCK-FIXTURES-001 | Mock ADS-B/drone fixtures validate track DTOs | Yes | `src/services/mockFixtures.test.ts` | Guards against empty-track mock regressions. |
| UNIT-MAP-TILE-001 | Offline XYZ tiles use placeholder only on load error | Yes | `src/map/layers/offlineXyz.test.ts` | Ensures fallback only after tile failure. |
| UNIT-NOTAM-HTML-001 | NOTAM HTML fetch and parse integration | Yes | `src/services/airspace/airspaceHtmlClient.test.ts`, `src/services/airspace/airspaceHtmlParser.test.ts` | Verify HTML fetch → parse → NOTAM enhancement path works. |
| UNIT-NOTAM-ENHANCE-002 | Enhanced NOTAM stream avoids redundant airspace reloads | Yes | `src/services/notam/useEnhancedNotamStream.test.tsx` | Ensures cached airspace data prevents repeat HTML/GeoJSON fetches. |
| UNIT-AIRSPACE-LOADER-001 | Airspace loader latest manifest fallback | Yes | `src/services/airspace/airspaceLoader.test.ts` | Ensures latest.json effective date drives GeoJSON load. |
| UNIT-EAIP-DISCOVERY-001 | EAIP discovery parses effective date + redirect fallback | Yes | `src/services/airspace/eaipDiscovery.test.ts` | Covers history page parsing and redirect fallback. |
| UNIT-NOTAM-COORD-001 | Enhanced coordinate parsing handles suffix S/W directions | Yes | `src/services/notam/geometry/enhancedCoordParsers.test.ts` | Regression coverage for decimal degrees with suffix directions. |
| UNIT-AIRSPACE-PARSER-001 | eAIP ENR 5.1 parsing errors + DMS coordinate parsing | Yes | `test/eaip-parser.test.ts` | Ensures tooling parser reports coordinate parse errors and DMS parsing. |

## Test Plan (current ticket)

| ID | Purpose | Layer | Target file |
| --- | --- | --- | --- |
| UNIT-UTC-001 | Normalize/validate UTC formatting for empty/invalid inputs + require timezone. (Implemented) | Unit | `src/shared/time/utc.test.ts` |
| UNIT-SENS-002 | Map sensor DTO adds ingest/source safely. (Implemented) | Unit | `src/services/sensors/sensorsTypes.test.ts` |
| UI-STATUS-001 | StatusPill renders expected label for polling state. (Implemented) | UI | `src/ui/StatusPill.test.tsx` |
| E2E-NAV-002 | Tool switching updates URL and sidebar heading. (Implemented) | E2E | `e2e/smoke.spec.ts` |
| E2E-MAP-002 | Offline tiles failure triggers online basemap fallback. (Implemented) | E2E | `e2e/basemap-offline.spec.ts` |
| DOC-TEST-001 | Codify testing culture requirements and PR checklist. (Implemented) | Docs | `agents.md`, `docs/TESTING.md`, `.github/pull_request_template.md` |
| UNIT-NOTAM-OBS-001 | NOTAM geometry parse results + dev-only warnings. (Implemented) | Unit | `src/services/notam/notamGeometryParsing.test.ts`, `src/map/layers/controllers/createNotamsLayerController.test.ts` |
| UNIT-NOTAM-CONTRACT-001 | NOTAM geometry contract fixtures + success-rate guardrail. (Implemented) | Unit | `src/services/notam/notamGeometryParsing.test.ts`, `test/fixtures/notams.geometry.contract.json` |
| TOOL-NOTAM-REPORT-001 | NOTAM geometry report script for local diagnosis. (Implemented) | Tooling | `scripts/notam-geometry-report.ts` |
| UNIT-ENV-001 | Env parsing helpers: booleans, ranges, URLs. (Implemented) | Unit | `src/shared/env.test.ts` |
| UNIT-ENV-002 | Optional env coordinate validation for snapshot drones. (Implemented) | Unit | `src/shared/env.test.ts` |
| UNIT-ADSB-TYPES-001 | ADS-B track sorting + validation. (Implemented) | Unit | `src/services/adsb/adsbTypes.test.ts` |
| UNIT-DRONE-TYPES-001 | Drone track mapping + altitude comments. (Implemented) | Unit | `src/services/drones/droneTypes.test.ts` |
| UI-HISTORY-001 | HistoryPanel empty + populated render. (Implemented) | UI | `src/features/history/HistoryPanel.test.tsx` |
| UNIT-ADSB-MOTION-002 | ADS-B motion invalid durations + empty tracks. (Implemented) | Unit | `src/services/adsb/adsbMotion.test.ts` |
| UNIT-DRONE-MOTION-002 | Drone motion invalid timestamps + empty tracks. (Implemented) | Unit | `src/services/drones/droneMotion.test.ts` |
| UNIT-HTTP-002 | ApiClient timeout boundaries. (Implemented) | Unit | `src/services/http/apiClient.test.ts` |
| UI-DRONES-002 | KnownDronesPanel empty + populated render. (Implemented) | UI | `src/features/known-drones/KnownDronesPanel.test.tsx` |
| UI-AIR-002 | AirTrafficPanel empty + populated render. (Implemented) | UI | `src/features/air/AirTrafficPanel.test.tsx` |
| UI-NOTAM-001 | NotamsPanel empty + list render. (Implemented) | UI | `src/features/notams/NotamsPanel.test.tsx` |
| UNIT-TIME-UPDATE-001 | Polling update-age label formatting. (Implemented) | Unit | `src/shared/time/updateAge.test.ts` |
| UNIT-NOTAM-POLL-001 | NOTAM polling defaults + boundaries. (Implemented) | Unit | `src/services/notam/useNotamPolling.test.tsx` |
| UNIT-NOTAM-STREAM-001 | NOTAM stream mapper + env boundaries. (Implemented) | Unit | `src/services/notam/notamStream.test.tsx` |
| UNIT-NOTAM-MODE-001 | NOTAM live/mock toggle persistence. (Implemented) | Unit | `src/services/notam/notamMode.test.tsx` |
| UNIT-NOTAM-COUNT-001 | NOTAM raw item counting. (Implemented) | Unit | `src/services/notam/notamNormalizer.test.ts` |
| UNIT-NOTAM-RADIUS-001 | NOTAM radius unit normalization. (Implemented) | Unit | `src/services/notam/altitude/altitudeParser.test.ts` |
| UNIT-STREAMS-CTX-001 | StreamsProvider shared hook context. (Implemented) | Unit | `src/services/streams/StreamsProvider.test.tsx` |
| UNIT-DRONE-CLIENT-002 | Drone client supports envelope response from Mock API. (Implemented) | Unit | `src/services/drones/droneClient.test.ts` |
| UNIT-DRONE-SNAPSHOT-001 | Snapshot drone stream uses MSW handler (no external mock server). (Implemented) | Unit | `src/services/drones/droneSnapshotClient.msw.test.ts` |
| UNIT-MOCK-FIXTURES-001 | Mock ADS-B/drone fixtures validate track DTOs. (Implemented) | Unit | `src/services/mockFixtures.test.ts` |
| UNIT-POLL-EDGE-001 | Polling status idle/error + invalid interval. (Implemented) | Unit | `src/services/polling/usePolling.test.ts` |
| UNIT-SPEED-001 | Speed formatter edge cases. (Implemented) | Unit | `src/shared/units/speed.test.ts` |
| UNIT-UTC-002 | UTC timestamp whitespace + boundary checks. (Implemented) | Unit | `src/shared/time/utc.test.ts` |
| UNIT-MAP-TILE-001 | Offline XYZ tiles fallback only on error. (Implemented) | Unit | `src/map/layers/offlineXyz.test.ts` |
| UNIT-NOTAM-ENHANCE-002 | Enhanced NOTAM stream avoids redundant airspace reloads. (Implemented) | Unit | `src/services/notam/useEnhancedNotamStream.test.tsx` |
| UNIT-AIRSPACE-LOADER-001 | Airspace loader latest manifest fallback. (Implemented) | Unit | `src/services/airspace/airspaceLoader.test.ts` |
| UNIT-EAIP-DISCOVERY-001 | EAIP discovery parses effective date + redirect fallback. (Implemented) | Unit | `src/services/airspace/eaipDiscovery.test.ts` |
| UNIT-NOTAM-COORD-001 | Enhanced coordinate parsing handles suffix S/W directions. (Implemented) | Unit | `src/services/notam/geometry/enhancedCoordParsers.test.ts` |
| UNIT-AIRSPACE-PARSER-001 | eAIP ENR 5.1 parsing errors + DMS coordinate parsing. (Implemented) | Unit | `test/eaip-parser.test.ts` |
