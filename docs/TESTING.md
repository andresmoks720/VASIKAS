# TESTING.md

## Start here for non-trivial tickets

- Before writing code, produce a concrete **Test Plan** and update `docs/TEST_CASES.md`.
- For pure-logic updates, follow a red-green workflow: add explicit failing unit tests first,
  implement the fix, and include at least one regression test to guard against likely mistakes.

## Test layers

- **Unit**: pure logic helpers and data transformations.
- **Component**: UI rendering and interactions without map internals.
- **E2E**: smoke coverage for map rendering and routing/tool switches.

## What to test where

- **Unit**
  - Domain formatting (altitude/speed), URL parsing helpers, DTO mapping, polling utilities.
- **Component**
  - Panel empty states, basic list rendering, and form behaviors.
- **E2E**
  - Map load + basemap visibility, tool switching, selection URL changes.

## Running tests locally

- Unit/component: `npm run test`
- Watch: `npm run test:watch`
- Coverage: `npm run test:coverage`
- E2E smoke: `npm run test:e2e`

## CI

- CI runs `npm ci`, `npm run typecheck`, `npm run lint`, and `npm run test:coverage`.
- Coverage output is uploaded from `coverage/` as a build artifact.
- E2E smoke tests run via Playwright with the HTML report uploaded as an artifact.

## Coverage philosophy

- **Aim high** in `src/shared/` and `src/services/` where logic is pure.
- **Accept lower** coverage for `src/map/` since map rendering is validated via E2E.
- Keep coverage focused on logic; avoid over-testing OpenLayers integration.
