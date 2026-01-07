# Schedule Normalization Ideas

**User:** Andres Moks (andres.moks@gmail.com)  
**Created:** 1/5/2026 1:28:48  
**Updated:** 1/5/2026 1:41:47  
**Exported:** 1/7/2026 23:48:16  
**Link:** [https://chatgpt.com/c/695af7ae-2830-8329-8d5e-35372577c8ba](https://chatgpt.com/c/695af7ae-2830-8329-8d5e-35372577c8ba)  

## Prompt:
notam Schedules: Complex text schedules ("MON-FRI EXC HOLIDAYS") are hard to normalize. suggest ideas how to replace these etc for machine reading json

## Response:
Thought for 1m 5s

A workable way out is to **stop trying to “normalize English”** and instead normalize into a **small set of schedule primitives** (then you can re-render to text if you ever need to).

### 1) Pick a canonical schedule model (don’t invent one unless you must)

Two solid options:

*   **AIXM/Digital NOTAM “Timesheet” style**: built for aeronautical schedules, explicitly models day/date patterns + time windows, and Digital NOTAM guidance intentionally _limits_ schedule complexity (e.g., discouraging/forbidding mixes that become ambiguous). [swim-eurocontrol.atlassian.net](https://swim-eurocontrol.atlassian.net/wiki/spaces/DNOTAM/pages/220791029/Schedules)
*   **iCalendar RRULE (RFC 5545)**: a widely-implemented recurrence rule system (weekly, by weekday, exclusions via EXDATE). Good general-purpose backbone. [datatracker.ietf.org+1](https://datatracker.ietf.org/doc/html/rfc5545?utm_source=chatgpt.com)

Bonus: you can store **both**: an AIXM-ish JSON object + an RRULE string for interoperability.

### 2) Replace free-text tokens with explicit fields

NOTAM “Item D” is literally a “time schedule” slot in the ICAO format. Treat it as structured data, not prose. [ffac.ch+1](https://ffac.ch/wp-content/uploads/2020/11/ICAO-Doc-10066-Aeronautical-Information-Management.pdf?utm_source=chatgpt.com)

Example JSON for `"MON-FRI EXC HOL 0900-1700"`:

```json
{
  "schedule": {
    "type": "weekly",
    "tz": "UTC",
    "rules": [
      {
        "byDay": ["MO", "TU", "WE", "TH", "FR"],
        "intervals": [{"start": "09:00", "end": "17:00"}]
      }
    ],
    "exclusions": {
      "holidayCalendar": {"kind": "public", "scope": "state", "code": "EE"},
      "dates": []
    }
  },
  "source": {"raw": "MON-FRI EXC HOL 0900-1700"}
}
```

Notes:

*   Weekday range semantics like `MON-FRI` are well-defined in NOTAM guidance (hyphen = successive days). [faa.gov](https://www.faa.gov/air_traffic/publications/atpubs/notam_html/chap3_section_3.html?utm_source=chatgpt.com)
*   “HOL” must become either a **calendar reference** or an explicit **date list**. (“Holiday” exists as an abbreviation, but it’s not machine-actionable by itself.) [eaip.eans.ee](https://eaip.eans.ee/2025-10-30/html/eAIP/EE-GEN-2.2-en-GB.html?utm_source=chatgpt.com)

### 3) Holidays: model them as data, not a word

You have three sane strategies:

*   **Reference a calendar**: `{code:"EE", scope:"state"}` (or aerodrome-local if you have that concept).
*   **Inline explicit dates**: `exclusions.dates = ["2026-02-24", ...]` (best for deterministic playback/audit).
*   **Hybrid**: reference calendar + optionally cache expanded dates for the validity window.

This is important because “legal holidays” are _local-calendar concepts_ and get weird when you force everything into UTC-only logic. AIXM discussions explicitly call out this kind of mismatch. [aixm.aero](https://aixm.aero/sites/default/files/imce/AIXM51/changes/5.1-36_timesheet_revision.pdf?utm_source=chatgpt.com)

### 4) Sunrise/sunset (“HJ”, “SR/SS”) needs an astronomical rule

Abbreviations like **HJ = sunrise-to-sunset** exist, but to compute them you need:

*   a **location** (lat/long or aerodrome reference), and
*   a **sun algorithm** (then produce concrete intervals). [eaip.eans.ee](https://eaip.eans.ee/2025-10-30/html/eAIP/EE-GEN-2.2-en-GB.html?utm_source=chatgpt.com)

Represent it like:

```json
{
  "intervals": [{
    "startEvent": {"type": "sunrise", "offsetMinutes": 0},
    "endEvent": {"type": "sunset", "offsetMinutes": 0}
  }],
  "location": {"icao": "EETN"}
}
```

…and expand to actual times only when you need to evaluate for a date range.

### 5) Keep the raw string + a parse status (because reality is feral)

Add:

```json
"parse": {"status": "ok|partial|fail", "confidence": 0.0}
```

Digital NOTAM guidance _intentionally_ restricts allowed combinations because mixed schedule types get ambiguous fast. [swim-eurocontrol.atlassian.net](https://swim-eurocontrol.atlassian.net/wiki/spaces/DNOTAM/pages/220791029/Schedules)  
Your parser should be allowed to say “partial” and preserve raw text.

### 6) Optional interoperability layer: emit RRULE too

For the same example:

```json
{
  "ical": {
    "dtstart": "20260105T090000Z",
    "duration": "PT8H",
    "rrule": "FREQ=WEEKLY;BYDAY=MO,TU,WE,TH,FR",
    "exdate": []
  }
}
```

(RRULE gives you libraries and tooling basically everywhere. [datatracker.ietf.org+1](https://datatracker.ietf.org/doc/html/rfc5545?utm_source=chatgpt.com))

* * *

**Pitfall / alternative view:** “EXC HOL” is underspecified unless you define _which_ holiday set (state? aerodrome? observed vs actual date). If you can’t reliably resolve that, the safer machine-readable substitute is to **expand into explicit concrete intervals** for the NOTAM validity window (or a rolling horizon) and treat the original schedule text as authoritative for humans.



---
Powered by [ChatGPT Exporter](https://www.chatgptexporter.com)