# GeoJSON Schema Suggestions

**User:** Andres Moks (andres.moks@gmail.com)  
**Created:** 1/5/2026 22:22:23  
**Updated:** 1/5/2026 23:16:50  
**Exported:** 1/7/2026 23:46:30  
**Link:** [https://chatgpt.com/c/695c1d7e-88d4-832d-9124-e5a7f2fbdc75](https://chatgpt.com/c/695c1d7e-88d4-832d-9124-e5a7f2fbdc75)  

## Prompt:
uas.geojson

File

test\_notam.json

File

schema.md

File

I am creating a map for drone pilots to display restrictions. considering we get info in this geojson file, how much does suggested schema make sense? (i provided a file that is supposed to follow this schema) i am looking to create a format i could parse all notam and aip info into that would have all info in one place and no notam obscurities ("from mon-fri except holidays", or "from sunrise" etc). look into that uas.geojson file and make suggestions

## Response:
Could you clarify the following so I can make the best schema and normalization recommendations?

1.  **Scope**: Will this format cover both NOTAMs and eAIP airspace definitions, including UAS-specific zones?
2.  **Intended Consumers**: Is the target strictly frontend visualization (e.g., map rendering), or is this also for planning tools, backend validation, or analytics?
3.  **Precision of Time**: Is it acceptable to use precomputed UTC windows only (as in the `activations` array), or do you also want to preserve the original text rule for traceability or re-computation?
4.  **Altitude Handling**: Is it sufficient to model `lowerLimit`/`upperLimit` as value/unit/referenceDatum, or do you expect derived fields like absolute AMSL or AGL altitudes for rendering?
5.  **Circular Areas**: Should circular regions remain in GeoJSON via point + radius metadata, or would you prefer backend-converted Polygons?
6.  **Overlap Resolution**: Should conflicting NOTAMs (e.g. REPLACEMENT/MODIFICATION chains) be resolved so only the latest is active in the file?

This will help fine-tune recommendations for simplifying frontend logic while preserving backend fidelity.

## Prompt:
for now limit the main scope to the geojson file i gave but suggest also by NOTAMs and eAIP both.

customer is my own visualization engine. it shows areas + displays info of notams. no analytics etc.

i am thinking of pre computed times myself.

4. nothing too complex for altitude, give your suggestoins

5. i think we often have overlapping notam areas. 
but for modifications - we should solve it in the backend and send only the latest.

this is the point for my own "standard" - to have a simplified source of truth, so frontend would not have to do all this work

## Response:
Understood. I’ll review the `uas.geojson` file against your proposed schema and evaluate how well it serves as a normalized, frontend-friendly source of truth for displaying drone-related airspace restrictions. I’ll also assess it in light of potential integration with both NOTAM and eAIP-derived data.

I’ll focus on:

*   Consistency and completeness of required fields (`restriction`, `priority`, `schedule`, etc.)
*   Representation of geometries including circles, multipolygons, and holes
*   Handling of schedule complexities, modifications, and replacements
*   Altitude modeling and radius representation
*   Suggestions for any improvements or simplifications to better serve as a preprocessed format

I’ll get back to you shortly with structured feedback and improvement recommendations.

Research completed in 7m · 3 sources

## Response:
Evaluation of the Unified Airspace Schema vs. `uas.geojson` Output
==================================================================

Support for NOTAM and eAIP Features
-----------------------------------

The unified schema is designed to normalize both permanent airspace data (eAIP) and temporary NOTAM-based restrictions into a single format. In the schema, each feature includes a `source` property (e.g. `"EAIP"`, `"NOTAM"`) to indicate origin. This clearly distinguishes permanent structures (like restricted zones from Aeronautical Information Publications) from temporary notices. The current `uas.geojson` file does contain both types of features (for example, an **EERZ**\-prefix ID indicating a permanent restricted zone, and **A####/YY** IDs for NOTAMs), but it lacks an explicit `source` field. The data merges eAIP-derived zones and NOTAM-derived zones without labeling them, so the frontend must infer the origin (e.g. by ID format or other fields). Adopting the schema’s `source` field would make the distinction explicit and reliable, ensuring both NOTAM and eAIP features are handled appropriately (e.g. filtering, styling) without guesswork. Overall, the schema does **support both** permanent and temporary features; the key improvement needed is for the output to actually include those source tags so that the unified format’s intent is realized on the frontend side.

Handling of Geometry Types
--------------------------

**Polygon and MultiPolygon:** The unified format leverages GeoJSON geometry, so it can represent complex shapes. In practice, most drone restriction areas are polygons (possibly multi-polygons). The example output confirms polygon support, and the schema doesn’t restrict using GeoJSON MultiPolygon if needed (e.g. a restricted area comprising separate zones). The provided `uas.geojson` data primarily uses Polygons. Notably, it even represents an “outside Estonia” area as a large polygon with a hole – using an outer rectangle (global bounds) and an inner boundary of Estonia’s territory. This demonstrates that **polygons with holes** are handled correctly in the data (valid GeoJSON rings), and the schema can accommodate that (holes are inherent in polygon coordinate arrays).

**LineString:** While less common for airspace, certain restrictions (e.g. closed runways or narrow corridors) might be linear. The schema being GeoJSON-based means LineString is allowed, though the current parser may not have produced any in `uas.geojson` (it only contains areas). A test scenario highlights a runway closure represented as a LineString, indicating the format should handle lines even if the current implementation had limitations. For visualization, a line might be rendered with a buffer or simply as a highlighted line segment. Ensuring the schema and parser support LineString geometry would cover this edge case.

**Point with Radius:** Drone notices sometimes define a circular area (given by center point and radius). GeoJSON has no native circle geometry, but the schema accounts for this by using a Point geometry with an associated `radius` property in meters. In the unified schema, if a feature has `"geometry": {"type": "Point", ...}` plus a `radius`, the frontend is expected to draw a circle of that radius around the point. This approach is simple and avoids needing complex shapes in the data. Currently, `uas.geojson` does not appear to include point+radius features (no `radius` field is present). It’s possible the backend expanded any circles into polygon approximations or none were needed for the dataset timeframe. However, to fully serve as a unified format, the output should support this pattern. The schema’s allowance for a radius property and the test examples (e.g. a NOTAM for crane work with `"type": "Point"` and `"radius": 1000` for 1 km circle) confirm that point-based restrictions will be covered well by the format.

In summary, the schema is flexible enough to handle **Polygons (with holes), MultiPolygons, LineStrings, and Points (with radius)**. The current file mostly uses polygons, including at least one polygon-with-hole, which is in line with schema capabilities. Going forward, implementing point+radius and line geometries as per schema would further unify all possible airspace restriction shapes under this format.

Schedule Format and Activation Windows
--------------------------------------

One of the schema’s strengths is offloading complex time schedules to the backend. Instead of the frontend parsing free-form schedule text (e.g. “MON-FRI 0800-1600 excl holidays”), the schema defines a `schedule` object with precomputed activation periods. In concept, the backend should **“unroll” recurring rules into explicit time windows** (UTC intervals) covering a certain lookahead (e.g. 7 days). These would be provided as a list in `schedule.activations`, each with a start and end timestamp (and possibly a status or commentary) so that the frontend can simply check the current time against these windows. This design adequately handles complex NOTAM timing rules: for example, weekends vs weekdays, specific dates, or daylight-dependent times can all be expanded into concrete intervals. The only limitation is the chosen horizon – if a NOTAM recurs over many months, typically the list would include just the near-future instances (which is usually sufficient for a map display).

Comparing this to `uas.geojson`: the current file’s approach is **less granular**. For a NOTAM with multiple activation windows, it often provides only an overall validity period (`startDateTime` to `endDateTime`) and a textual schedule description, without structured sub-intervals. For example, a NOTAM might be active on Dec 31 and Jan 2-3 for a few hours each day; in the file it appears with one broad interval (Dec 31 to Jan 03) and the details of daily times only in the message text. This means the frontend would have to interpret that text or assume continuous activity, which is not ideal. The unified schema’s method (listing each active window separately) is clearly more robust and **consistent across features**: permanent areas simply have `isPermanent: true` and no activations (always “hot”), one-off NOTAMs have a single activation window, and recurring or complex NOTAMs have multiple windows enumerated. The test data illustrates this consistency: a complex rule like “Mon-Fri 0600-1800” was translated into a series of daily start/end entries in the `activations` list, and permanent zones just omit the list and mark `isPermanent: true`.

In conclusion, the **precomputed schedule** format is sufficient and indeed very helpful for covering complex time rules. It dramatically reduces frontend complexity (a simple time comparison instead of parsing cron-like rules). The current output should evolve to use this format – ensuring that every NOTAM’s exact active periods are listed in machine-readable form. This will make the visualization accurate (e.g. shading or highlighting a zone only when active) with minimal client logic.

Altitude Limits Representation
------------------------------

The schema models altitude limits with a `lowerLimit` and `upperLimit`, each given as an object containing the numeric value, the unit, and a reference datum (e.g. above ground level or sea level). This is a concise representation that preserves all essential info needed for display. For visualization, typically we want to show something like “Surface to 3000 FT AMSL” or “100 FT AGL to 400 FT AGL”. The provided structure supports that directly. The frontend can take the value and unit and format a label, and possibly use the reference (SFC/AGL/AMSL) to append context. It’s also sufficient for filtering logic (e.g. “show me restrictions below 500 ft”) since the values are numeric and units known.

The current `uas.geojson` file contains altitude information but in a more duplicated manner. For example, a zone might have:

*   `geometry.lowerLimit = 3000, lowerVerticalReference = "AGL", uomDimensions = "FT"` (original data),
*   plus separate properties like `"lower": "3000 FT AGL"` and `"lowerMeters": 900` (converted).  
    This redundancy (original value, formatted string, and converted meters) was likely to aid different use cases. However, for purely frontend display, we might not need all of these. The unified schema’s single source of truth (value+unit+reference) is enough to derive any needed format. If the frontend is to be kept very simple, including a pre-formatted string or a meter conversion isn’t harmful – but it does bloat the data a bit. Since the schema’s goal is simplification, a reasonable approach is to pick one consistent unit system for numeric comparisons (e.g. always use feet as published, or always convert to meters internally) and let the frontend format as needed. The **schema example sticks to published units** and values, which avoids confusion (pilots often recognize FT or FL easily, whereas drones might use meters – either way, it’s explicit in each feature).

Crucially, the lower/upper model handles typical scenarios: ground references (“SFC” or 0 AGL) can be indicated clearly, and ceilings like a flight level or AMSL altitude are numeric. One corner case is “unlimited” upper altitudes – in NOTAMs this is sometimes stated as “UNL”. The schema didn’t specify a special code for that, but it could be represented by a very high value with unit or a string "UNL" in the unit field. For visualization, marking it as “Unlimited” or “No upper limit” would be fine. As is, **the altitude model is sufficient for map purposes**. It conveys the vertical extent of restrictions so the frontend can, for instance, show a label or allow the user to filter out high-altitude restrictions if they only fly low.

Resolving NOTAM Modifications and Replacements
----------------------------------------------

A unified data format should save the frontend from having to interpret NOTAM cancellation or modification chains. In real operations, a NOTAM may replace a previous one, or temporarily modify an existing airspace. The schema addresses this by providing a way to link related features. Specifically, `relatedTo` can reference an identifier of another feature (e.g. a NOTAM pointing to the ID of a permanent zone it affects), and an optional `relationType` can describe the relationship (such as "ACTIVATION" of a dormant danger area, "MODIFICATION" of some property, or "REPLACEMENT" of a previous notice).

In the test scenarios, for example, a NOTAM activating a danger area included `"relatedTo": "EED123"` to tie it to that permanent area. Another scenario showed a NOTAM that **replaced** a previous NOTAM by listing the old NOTAM’s ID in `relatedTo` and using `"relationType": "REPLACEMENT"`. The expectation is that the backend aggregator uses these links to avoid confusion. It should ideally **not output the superseded NOTAM at all**, or mark it as inactive, and only output the current data needed for display. That way, the frontend isn’t juggling multiple NOTAMs where one cancels another – it simply sees the end result.

Looking at `uas.geojson`, it appears that replacements were already handled to some extent (we don’t see duplicate NOTAMs for the same area; presumably outdated ones are removed). However, the file does _not_ include `relatedTo` references for cases where a NOTAM is an activation or change to an existing zone. For instance, one NOTAM in the data is described as “RESTRICTED AREA EER15F ACT…” in the text, which clearly relates to area EER15F, but there is no structured field linking it to EER15F’s feature. The frontend would have to deduce that from the text if it needed to inform the user or highlight the base area. Incorporating the `relatedTo` field (and using consistent IDs for the permanent features) would solve this. The frontend could then easily find “EER15F” in the dataset and perhaps visually indicate that it’s active under NOTAM, or just trust the NOTAM feature’s geometry and altitudes as the authoritative representation during its active period.

For replacement chains, using `relationType: "REPLACEMENT"` as in the schema example allows the aggregator to flag relationships, but more importantly, the aggregator should merge or drop the old data. The schema’s goal is **no frontend chain processing** – i.e., by the time the data reaches the client, it’s already resolved to the latest state. We should ensure the format (perhaps via metadata or simply by omission of cancelled NOTAMs) makes this guarantee. In practice, this means if NOTAM `A0005/26` is replaced by `A0006/26`, only `A0006/26` appears in the output (with maybe a note in its content or a link that it replaced the other). The user just sees one active feature, and the history is handled in the backend. The current file is likely doing this removal, but making the relationship explicit would improve transparency and allow the client to show, for example, a note “(Corrected coordinates, replaces A0005/26)” as given in the content without having to parse that out of free text.

In summary, the unified format is on the right track for handling modifications/replacements – it provides linking fields so that the **frontend doesn’t need to reconcile NOTAM chains or figure out which permanent area is affected**. The main step is to fully implement those fields in the output and ensure old or superseded data isn’t included as active features.

Recommendations for Enhancing the Format
----------------------------------------

To make the unified `uas.geojson` format more robust and reduce frontend effort even further, a few improvements are suggested:

*   **Include Source and Identification Metadata:** Every feature should clearly indicate its origin. Adding the `source` property (with values like `NOTAM`, `EAIP`, etc.) as defined in the schema will remove ambiguity. This allows frontend filters (e.g. “show/hide NOTAMs”) and conditional styling. Additionally, ensure each feature’s `identifier` or `id` is unique and retains the domain context (e.g. use the published NOTAM identifier with year, and stable IDs for eAIP zones). The current output uses an `identifier` but no source; adding `source` would fully disambiguate them.
*   **Provide Full Temporal Details:** Adopt the `schedule.activations` list approach for all non-permanent features. The backend should calculate all the activation periods of a NOTAM up front. This means instead of a NOTAM feature having an empty `schedule` array and a cryptic time range that covers inactive gaps, it would have a populated `schedule.activations` with each active window. For example, if a restriction is active on Dec 31 07:00–08:40 and Jan 02–03 07:00–08:40, the feature’s schedule would include those three intervals explicitly. This change would make the data self-explanatory – the frontend can simply check “now” against those intervals to know if the restriction is in effect, without parsing the message text. It also aligns with the schema’s philosophy of doing heavy lifting in the backend (e.g. computing sunrise-based times or complex weekday rules) so the client stays simple.
*   **Improve Linking of Related Features:** Utilize the `relatedTo` field wherever applicable to link features that are logically connected. If a NOTAM activates or changes a permanent zone, set `relatedTo` to the permanent zone’s ID, and possibly use a `relationType` (like “ACTIVATION” or “MODIFICATION”) to clarify. If a NOTAM replaces a previous NOTAM, mark it with `relatedTo` pointing to the old one and `relationType: "REPLACEMENT"` – and do not include the old NOTAM as a separate active feature. These links can be leveraged by the frontend for user info (e.g. clicking a NOTAM could highlight the related zone it’s modifying, or show a note “replaces X”). More importantly, this ensures the frontend doesn’t need to contain logic for chaining NOTAM updates; it will only see the net outcomes.
*   **Align Restriction Categories and Add Missing Ones:** The schema defines a set of normalized restriction levels (PROHIBITED, RESTRICTED, DANGER, REQ\_AUTHORISATION, etc.), which map to specific map colors and user warning levels. The current file sometimes uses `restriction: "NO_RESTRICTION"` for zones that actually do impose limitations (for example, a zone requiring permission was labeled "NO\_RESTRICTION" despite clearly being a restricted area). Going forward, each feature’s `restriction` should use the closest matching enum value so that the intended color and warning are applied. If a case doesn’t fit these (e.g. a general warning area or obstacle), consider introducing a category like “WARNING” or use “LOW” priority informational markers. In fact, the test data included “WARNING” as a restriction for an obstacle/crane scenario – if such a category is useful, it could be added to the schema. Ensuring consistent categorization will make the frontend logic straightforward (it just checks the `restriction` to choose styling and messaging, rather than also scanning other fields or messages for cues).
*   **Leverage Priority for Display Urgency:** The schema provides a `priority` field to denote how urgent/important a feature is, e.g. `CRITICAL`, `HIGH`, `LOW`. The current output did not explicitly include priority for each feature (or used a custom scheme like a `hidden` flag or RGBA transparency to convey importance). Implementing the `priority` field as defined will help the frontend sorting and layering (e.g. critical warnings on top). For example, an active prohibited area might be HIGH or CRITICAL priority (rendered prominently), whereas a long-term inactive danger area could be LOW (perhaps dimmed). Using this consistently means the front-end doesn’t have to derive urgency from other data points or timestamps.
*   **Optimize for Frontend Performance:** To reduce the work on the client, the backend can precompute or simplify certain aspects:
    *   **Colors and Styling:** The schema implies a color mapping based on restriction, but the current file actually provides RGBA color values for fill and stroke. While not strictly necessary, providing these style attributes (or a reference like a style class) can save the frontend from implementing the mapping logic. It ensures consistency – e.g., if the standard “Danger” color is a certain yellow, the data already carries that. This is useful as long as the style scheme is stable. Alternatively, just sticking with the known categories and having the frontend map them might be fine; the key is to avoid any complex conditional logic beyond a simple lookup.
    *   **Geometry simplification:** Some features, like the large “Outside Estonia” polygon, have very detailed coordinates (hundreds of points outlining the country border). For web map display, especially at small scales, this level of detail might be unnecessary. The backend could offer a simplified geometry for such global features or heavy polygons to improve rendering speed. This could be done either by generalizing the polygon or by splitting features (though splitting might break the conceptual unity of a zone). Since the schema doesn’t explicitly cover multiple geometry resolutions, this is just a consideration for performance – e.g., a potential `simplifiedGeometry` property or an alternative tile-based approach if needed for very complex shapes.
    *   **Metadata for updates:** It’s helpful to include top-level metadata like a generation timestamp and data version. The schema’s example includes `generatedAt` and some metadata about the source data versions. The current file lacks this, so adding it would help the frontend cache or validate data freshness (especially important if the data is fetched periodically). It also can include an `activeCount` or similar indicator of how many features are currently active, which is a quick metric the UI might display (e.g. “5 active restrictions in your area”). Including such metadata is purely informational but aligns with reducing frontend guesswork about the dataset state.

In conclusion, the `uas.geojson` format already consolidates diverse airspace information in one place, which is a big win for frontend simplicity. By refining it to fully adhere to the unified schema – with clear source labels, complete schedule breakdowns, proper linking of related notices, consistent categories, and convenient extras for display – it will serve as a **robust, drop-in visualization dataset**. These changes mean the frontend map can remain as dumb as possible, merely rendering what’s in the file (with minimal logic), which improves reliability and maintainability of the client-side code. Each suggestion above aims to minimize the need for the frontend to “know” about NOTAM intricacies or perform calculations, thereby truly achieving the unified, simplified format’s goal.

**Sources:** The evaluation references the provided schema description and sample/test data instances from the `uas.geojson` and related files to illustrate current vs. intended usage. These examples underpin the recommendations for aligning the output with the schema for an optimal front-end integration.



---
Powered by [ChatGPT Exporter](https://www.chatgptexporter.com)