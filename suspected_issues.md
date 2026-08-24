# Suspected Issues Report

This document outlines the main issues identified across the repository (`y:\Vasikas`), including build/type errors, test suite failures, documented technical failure modes, and workspace hygiene concerns.

---

## 1. Executive Summary

A comprehensive audit of the workspace revealed issues in four primary areas:
1. **TypeScript Type System & Dependency Errors**: Typecheck fails due to missing subpath module declarations and monorepo workspace misconfigurations.
2. **Test Suite Execution & Runtime Failures**: Vitest runs fail across multiple test suites due to MSW handler mismatches, environment polyfill conflicts (`AbortSignal`), and unresolved sub-package imports.
3. **Core Technical & Spatial Vulnerabilities**: Critical spatial parsing, destructuring, boundary validation, and error-handling bugs exist in telemetry, NOTAM, and geometry layers.
4. **Repository Structure & Workspace Hygiene**: Loose scraping artifacts, empty directories, duplicated codebases (`VASIKAS` vs `parser_proto`), and unorganized root files clutter the workspace.

---

## 2. Build & Type System Issues (`npm run typecheck`)

Running `npm run typecheck` in `VASIKAS` fails with 11 TypeScript compilation errors:

### A. Missing Module Type Declarations & Uninstalled Types
* **`ajv-formats`**: Missing module declaration in `parser/normalize/validate.ts(2,24)`.
* **MUI Icon Exports**: `@mui/icons-material/ExpandMore` and `ExpandLess` subpath imports fail type checking in `src/ui/UnvisualizableNotams.tsx(3,28)`. Standard named imports from `@mui/icons-material` should be used instead.
* **`tools/eaip-import` Types**: `cheerio`, `crypto-js`, and `domhandler` type definitions cannot be found in `tools/eaip-import/src/parser.ts`.

### B. Strict Mode (`noImplicitAny`) Violations
* **`tools/eaip-import/src/parser.ts`**: Callback parameters `el`, `candidate`, `a`, and `b` lack explicit type annotations, violating strict TypeScript compiler rules.

### C. Monorepo & TSConfig Workspace Misconfiguration
* `tools/eaip-import` defines its own `package.json` dependencies (`cheerio`, `crypto-js`, `@types/crypto-js`), but root `VASIKAS/tsconfig.json` includes `tools` without setting up proper TypeScript project references or npm workspace dependency linking.

---

## 3. Test Suite Failures (`npm run test:run`)

Vitest test run results (`5 failed | 72 passed (77 test files)`):

### A. Skipped / 0-Test Execution Files
Due to module resolution failures when importing `tools/eaip-import/src/parser` or `ajv-formats`, Vitest catches unhandled import errors and skips test execution inside:
* `test/eaip-parser.test.ts` (0 tests executed)
* `test/eaip-scraper.test.ts` (0 tests executed)
* `parser/normalize/schemaValidation.test.ts` (0 tests executed)

### B. MSW Mock & Drone Service Failures
* **`src/services/drones/droneSnapshotClient.msw.test.ts`**:
  * `AssertionError: expected null not to be null`
  * `AssertionError: expected 'error' to be 'live'`
  * Cause: Mock Service Worker (MSW) endpoint handlers or mock payloads do not match the expected API schema / status transitions in `droneSnapshotClient`.

### C. React Router & AbortSignal Polyfill Crashes
* **`src/layout/MapShell/MapShell.test.tsx`**:
  * `TypeError: RequestInit: Expected signal ("AbortSignal {}") to be an instance of AbortSignal.`
  * Cause: Incompatibility between Node's native `undici` fetch implementation, MSW interceptors, and React Router navigation in the Vitest jsdom environment.

### D. Invalid HTML DOM Nesting Warning
* **`KnownDronesPanel.tsx`**:
  * `Warning: validateDOMNesting(...): <div> cannot appear as a descendant of <p>.`
  * Cause: `ListItemText` `secondary` prop renders a default `<p>` element around child `<Stack>` and `<Typography>` elements. Setting `secondaryTypographyProps={{ component: 'div' }}` resolves this.

---

## 4. Technical & Architectural Vulnerabilities (Documented EANS Failure Modes)

The system contains several critical runtime vulnerabilities and edge-case fragility points (documented in `eans failure.txt`):

1. **Telemetry Destructuring Crash**: `parseTelemetryArray` uses raw positional destructuring (`const [id, ..., opacity] = data;`). Shortened backend payloads set variables to `undefined`, propagating `NaN` into Turf/map calculations.
2. **Latitude Overflow / Bypass**: `normalizeCoordinates` normalizes longitude to `[-180, 180]` but skips latitude validation. Latitudes outside `[-90, 90]` reach map projection engines (MapLibre / OpenLayers) and black out the viewport.
3. **Silent Spatial Exception Suppression**: `booleanIntersects` calls in `getIntersectingZones` catch Turf exceptions in `try-catch` blocks returning `false`, causing complex or self-intersecting geometries to be silently ignored during conflict detection.
4. **Polygon Complexity Crash**: Validation calls `turf.polygon()` directly on raw input without checking for minimum vertices (>= 4 points including closed ring), throwing uncaught exceptions.
5. **Unguarded `JSON.parse` Calls**: Parsing of `operationplans.json` and GeoJSON `originalPlan` lacks `try-catch` guards, causing total layer render failure when backend responses are empty or malformed.
6. **Positional Socket Event Fragility**: Socket `alert` events unpack payload parameters via fixed array index positioning; missing payload elements pollute local state with `undefined`.
7. **Unchecked Property Access on Fallbacks**: Expressions like `(data.features || {})[0].id` throw `TypeError: Cannot read property 'id' of undefined` when `data.features` is undefined (`{}[0]` evaluates to `undefined`).
8. **Infinite Asset Request Loops**: Asset loaders (`loadIcon`) lack retry limits or fallbacks, flooding network endpoints on HTTP 404/500 errors. Polling hooks retry at a fixed 5-second interval without exponential backoff.
9. **Unauthenticated Fallthrough ("Auth Stall")**: Keycloak auth failures are caught silently, leaving `user = null` with a visible map interface where subsequent backend requests fail.
10. **Generic Error Sink**: Fetch wrappers collapse HTTP 401, 403, and 500 status codes into generic `Error('Something went wrong')`, preventing distinction between auth issues and server crashes.

---

## 5. Repository Hygiene & Structure Issues

1. **Root Directory Clutter (`y:\Vasikas`)**:
   - Workspace root contains unorganized web scrapes (`dr/Drooniradar.html`, `dr1/`), raw media files (`.jpg`, `.png`), Word documents (`.docx`), temporary office files (`~$...docx`, `~WRL...tmp`), and unintegrated Python scripts (`br1.py`).
2. **Empty Subdirectories**:
   - `y:\Vasikas\ParserDroon` and `y:\Vasikas\parser` are empty subdirectories.
3. **Duplicated / Split Codebase Context**:
   - Code and documentation are split between `y:\Vasikas\VASIKAS` (main application) and `y:\Vasikas\parser_proto` (prototype TypeScript implementation files and documentation).

---

## 6. Recommendations & Next Steps

1. **Fix TypeScript & Monorepo Setup**:
   * Add `@types/crypto-js` and `ajv-formats` to `VASIKAS/package.json` or configure npm workspaces.
   * Update `@mui/icons-material` imports to use named export syntax (`import { ExpandMore, ExpandLess } from '@mui/icons-material'`).
   * Add explicit type annotations in `tools/eaip-import/src/parser.ts`.
2. **Resolve Test Failures**:
   * Align MSW handler response payloads with `droneSnapshotClient` data expectations.
   * Fix DOM nesting in `KnownDronesPanel.tsx` using `secondaryTypographyProps={{ component: 'div' }}`.
   * Add global polyfills or MSW configuration to handle `AbortSignal` in `MapShell.test.tsx`.
3. **Harden Spatial & Data Ingestion Parsing**:
   * Add safe array bounds checking before destructuring telemetry & socket payloads.
   * Validate latitude bounds (`[-90, 90]`) during coordinate normalization.
   * Wrap `turf.polygon()` and `JSON.parse()` calls in safe parser guards with fallback defaults and structured error logging.
4. **Clean Up Workspace Structure**:
   * Remove empty directories (`ParserDroon`, `parser`).
   * Consolidate prototype parser files (`parser_proto`) into the main project structure or clear documentation bounds.
   * Move loose root documents and scraped files into dedicated `docs/` or `assets/` subdirectories.
