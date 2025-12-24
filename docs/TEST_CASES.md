# TEST_CASES.md

| ID | Description | Implemented? | Location? | Notes? |
| --- | --- | --- | --- | --- |
| UNIT-URL-001 | parseTool/parseEntity | Yes | `src/layout/MapShell/urlState.test.ts` | URL helper coverage. |
| UNIT-URL-002 | formatEntity roundtrip + parseTool fallback | Yes | `src/layout/MapShell/urlState.test.ts` | Covers null/empty fallback behavior. |
| UNIT-ALT-001 | formatAltitude comment rule | Yes | `src/shared/units/altitude.test.ts` | Ensures comment always shown. |
| UNIT-ALT-002 | altitude shows meters + feet | Yes | `src/shared/units/altitude.test.ts` | Use when showFeet is enabled. |
| UNIT-ADSB-001 | mapAircraftDto missing fields + units | Yes | `src/services/adsb/adsbClient.test.ts` | Null-safe + knots→km/h. |
| UI-SENS-001 | SensorsPanel empty/list render | Yes | `src/features/sensors/SensorsPanel.test.tsx` | Empty state + list split. |
| UI-SENS-002 | SensorsPanel stale + row status | Yes | `src/features/sensors/SensorsPanel.test.tsx` | Status pill + age text. |
| UNIT-UTC-001 | formatUtcTimestamp handling | Yes | `src/shared/time/utc.test.ts` | Unknown/invalid/normalized UTC + timezone requirement. |
| UNIT-SENS-002 | mapSensorDto adds ingest/source | Yes | `src/services/sensors/sensorsTypes.test.ts` | DTO mapping coverage. |
| UI-STATUS-001 | StatusPill label rendering | Yes | `src/ui/StatusPill.test.tsx` | Polling status label. |
| E2E-NAV-002 | tool switch updates URL | Yes | `e2e/smoke.spec.ts` | URL + sidebar heading. |
| E2E-MAP-001 | map click selects flight and updates URL | Yes | `e2e/map-selection.spec.ts` | Map marker click updates entity query. |
| E2E-SMOKE-001 | load map + switch tools | Yes | `e2e/smoke.spec.ts` | Smoke path for map + routing. |

## Test Plan (current ticket)

| ID | Purpose | Layer | Target file |
| --- | --- | --- | --- |
| UNIT-UTC-001 | Normalize/validate UTC formatting for empty/invalid inputs + require timezone. (Implemented) | Unit | `src/shared/time/utc.test.ts` |
| UNIT-SENS-002 | Map sensor DTO adds ingest/source safely. (Implemented) | Unit | `src/services/sensors/sensorsTypes.test.ts` |
| UI-STATUS-001 | StatusPill renders expected label for polling state. (Implemented) | UI | `src/ui/StatusPill.test.tsx` |
| E2E-NAV-002 | Tool switching updates URL and sidebar heading. (Implemented) | E2E | `e2e/smoke.spec.ts` |
