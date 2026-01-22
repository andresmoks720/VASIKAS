## Scope
- Create a new normalizer module at: `parser/normalize/`
- It MUST follow the JSON schema located at: `parser/normalize/schema` (treat it as the source of truth).
- It MUST be independent from any existing display/visualization logic. Do not import UI code or map-rendering helpers.
- This normalizer will replace the current input acquisition phase: the backend will fetch/parse sources and ONLY the produced JSON will be sent to the frontend.

## Input sources (for this implementation)
1) AIP/EAIP processing already present in the codebase:
   - Reuse the existing AIP processing pipeline that has been set up (do not rewrite it; adapt its outputs).
2) NOTAM PIB JSON feed:
   - Fetch and parse: `https://aim.eans.ee/web/notampib/area24.json`
   - Convert its contents into Unified Restriction Features.

## Input filtering (MUST)
- This normalizer is for map visualization. Only include NOTAM items that can be represented with a geographic geometry.
- Include a NOTAM if ANY of the following can be produced:
  - Polygon / MultiPolygon area
  - Point with radius (circle) OR a buffered polygon equivalent
  - LineString that can be buffered into a polygon
- Exclude (do not emit features for) NOTAM items that have no reliable spatial representation, e.g.:
  - fuel availability, hours of service, staffing, comms-only notices
  - procedural/text-only advisories without coordinates
  - any NOTAM where geometry cannot be derived or is missing
- When excluding, optionally count them in metadata (e.g. metadata.counts.droppedNoGeometry) for debugging, but do not output them as features.



## Output requirements (core invariant)
GOAL: **No frontend chain processing**
- By the time data reaches the client, it must already be resolved into the latest effective state.
- The frontend must NOT:
  - apply REPLACEMENT/MODIFICATION/CANCELLATION chains
  - parse schedule text
  - convert altitude units

## Schedule handling (MUST)
- The output `properties.time.validFrom` and `validUntil` MUST always be valid ISO-8601 UTC timestamps.
  - No “SR”, “SS”, “PERM”, “H24”, etc. in these fields.
- The output MUST contain `properties.time.activations[]` as explicit UTC windows.
- Lookahead horizon MUST be exactly 7 days (`lookaheadDays=7`).
- Placeholder SR/SS behavior (for now):
  - SR = 07:00 local time
  - SS = 18:00 local time
  - Mark `properties.time.quality = "PLACEHOLDER"`
  - Write `properties.time.original.srSsPolicy = "PLACEHOLDER_0700_1800"`
- If a schedule cannot be reliably unrolled, still emit valid timestamps and set:
  - `quality = "UNKNOWN"`
  - Provide best-effort activations within lookahead (or a single activation across validity if unavoidable), plus `time.original.rawText`.

## NOTAM chain resolution (MUST)
- Resolve NOTAM chains in the backend:
  - If NOTAM B replaces NOTAM A, do NOT emit A as a separate active feature.
  - Emit only the effective feature(s) derived from B.
  - Record traceability using:
    - `properties.link.relationType = "REPLACEMENT"`
    - `properties.link.supersedes = ["<A id>"]`
- For activations/modifications of permanent airspace:
  - Set `properties.link.relatedTo` to the permanent airspace ID when determinable.
  - Set `properties.link.relationType` to `ACTIVATION` or `MODIFICATION`.
- IMPORTANT: output MUST never include “patch features” with `geometry: null`. Always emit a fully materialized geometry.

## Units / vertical limits (MUST)
- Output is meters-first:
  - `properties.vertical.lower_m`, `upper_m` are numbers (meters).
  - Convert from FT/FL/etc in source data.
  - Apply rounding policy from the top-level output (altitude_m rounding step).
  - Preserve original published text in `properties.vertical.original` when available.
- “Do not break altitude calculation filters” requirement:
  - Ensure `lower_m <= upper_m` when `upper_m` is not null.
  - Ensure values are non-negative.
  - Do not lose meaning via rounding: keep `vertical.original` and (optionally) an unrounded internal intermediate in code, but the final JSON must follow schema exactly.

## Geometry rules (MUST)
- Prefer emitting only `Polygon` / `MultiPolygon`.
- If a NOTAM describes a circle:
  - Either buffer it into a polygon, OR emit `Point` with `properties.shape = {type:"CIRCLE", radius_m:<number>}`.
  - Choose ONE strategy consistently across the normalizer (document in code).
- Validate and preserve polygon holes if present.
- Add optional `bbox` and `labelPoint` when easy to compute (helps frontend performance but not required).

## Classification rules (MUST)
- Set:
  - `properties.category` (AIRSPACE/UAS_ZONE/OBSTACLE/PROCEDURE/INFO)
  - `properties.restriction` (PROHIBITED/RESTRICTED/DANGER/REQ_AUTHORISATION/WARNING/INFORMATION)
  - `properties.priority` (CRITICAL/HIGH/MEDIUM/LOW)
  - `properties.tags` (free-form; can mirror aviation terms; frontend must not depend on tags)
- Provide `properties.display.title/summary/content` best-effort for a consistent UI.

## Feature identity and traceability (MUST)
- `feature.id` MUST be an effective unique ID (not the raw NOTAM ID).
  - Use a stable scheme, e.g. `eff:<canonicalId>:<windowStart>` or similar.
- Each feature MUST include:
  - `properties.provenance.inputs[]` listing all upstream source items used (NOTAM ids, EAIP ids).
  - `properties.link` fields as per schema (even if `relatedTo=null`, `supersedes=[]`).

## Top-level metadata (MUST)
- Populate:
  - `generatedAt` (UTC now)
  - `lookaheadDays = 7`
  - `metadata.parserVersion` (use package version or hardcoded constant)
  - `metadata.sources.notamFetchedAt` (timestamp of fetch)
  - `metadata.sources.eaipVersion` if available from existing pipeline
  - `metadata.counts.total`, `metadata.counts.activeNow` (active at generatedAt)

## Deliverables
1) Code under `parser/normalize/`:
   - `index.ts` (or equivalent entrypoint)
   - `fetch_notam_pib.ts` (fetch + parse area24.json)
   - `normalize_notam.ts` (map PIB entries → features)
   - `normalize_aip.ts` (adapt existing AIP outputs → features)
   - `merge.ts` (combine AIP + NOTAM; resolve conflicts and chaining; dedupe)
   - `time_unroll.ts` (unroll schedule rules into activations, incl SR/SS placeholder)
   - `units.ts` (feet/FL → meters conversions + rounding)
2) Tests:
   - Unit tests for:
     - SR/SS placeholder conversion produces valid activations within lookahead
     - REPLACEMENT removes superseded features from output
     - altitude conversion + rounding preserves ordering (lower<=upper)
     - schema validation passes (use AJV or existing validator)
3) CLI (optional but useful):
   - `node parser/normalize/run.ts --out out.json` to generate output

## Acceptance criteria (non-negotiable)
- Output validates against `parser/normalize/schema`
- No geometry=null features
- No raw schedule parsing required in frontend; activations drive activity
- Lookahead is 7 days
- Altitudes are meters and safe for numeric filtering
- Superseded/replaced NOTAMs are not emitted as separate active features
- Normalizer is isolated from display logic