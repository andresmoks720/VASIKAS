# TESTING.md

## Start here for non-trivial tickets

- Before writing code, produce a concrete **Test Plan** and update `docs/TEST_CASES.md`.
- For pure-logic updates, follow a red-green workflow: add explicit failing unit tests first,
  implement the fix, and include at least one regression test to guard against likely mistakes.
- Bugfixes must include a regression test.
- Map changes require Playwright proof (no pixel assertions).

## Test pyramid expectations

- **Unit** (base): pure logic helpers, parsing, and data transformations.
- **Component** (middle): UI rendering and user interactions without map internals.
- **E2E** (top): map rendering, routing/tool switches, and layer-level integration.

Keep the pyramid narrow at the top: use E2E for map validation and integration seams,
not for verifying every visual detail.

## What to test where

- **Unit**
  - Domain formatting (altitude/speed), URL parsing helpers, DTO mapping, polling utilities.
  - Parsing/normalization logic in `src/services/`.
- **Component**
  - Panel empty states, basic list rendering, and form behaviors.
- **E2E**
  - Map load + basemap visibility, tool switching, selection URL changes.
  - Map layers render features with sane extents (no world-spanning surprises).

## Running tests locally

- Unit/component: `npm run test`
- Watch: `npm run test:watch`
- Coverage: `npm run test:coverage`
- E2E smoke: `npm run test:e2e`

## CI expectations

- CI runs `npm ci`, `npm run typecheck`, `npm run lint`, and `npm run test:coverage`.
- Coverage output is uploaded from `coverage/` as a build artifact.
- E2E smoke tests run via Playwright with the HTML report uploaded as an artifact.

## Coverage philosophy

- **High** coverage in `src/shared/` and `src/services/` where logic is pure.
- **Map integration** coverage is validated via Playwright E2E (not unit mocks).
- Keep coverage focused on logic; avoid over-testing OpenLayers internals.
