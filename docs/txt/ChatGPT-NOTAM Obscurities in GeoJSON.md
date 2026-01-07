# NOTAM Obscurities in GeoJSON

**User:** Andres Moks (andres.moks@gmail.com)  
**Created:** 1/5/2026 19:50:52  
**Updated:** 1/7/2026 23:47:16  
**Exported:** 1/7/2026 23:47:37  
**Link:** [https://chatgpt.com/c/695bf9b4-4a5c-8331-b3cc-b325dc9fbc92](https://chatgpt.com/c/695bf9b4-4a5c-8331-b3cc-b325dc9fbc92)  

## Prompt:
https://utm.eans.ee/avm/utm/uas.geojson

analyze if this document has regular notam obscurities ("from mon-fri except holidays", or "from sunrise" etc) or it has been replaced with better info for drones?

## Response:
Thought for 2m 38s

Looked for available tools

Thought for 1m 3s

I can’t directly inspect that GeoJSON from here: the host returns a `(400) OK` to automated fetches, so I can’t see the contents/fields to tell you “yes/no” from first principles.

What I _can_ say from the surrounding official context:

*   Estonia’s drone map/UTM stack has evolved from “mainly permanent areas” (early 2023 messaging) [EANS](https://www.eans.ee/uudised/droonilennutamise-reeglid-muutuvad-lihtsamaks?utm_source=chatgpt.com) to a newer application that explicitly includes NOTAMs (July 13, 2023 announcement). [EANS AIM](https://aim.eans.ee/en/node/241?utm_source=chatgpt.com)
*   By Oct 2, 2025, the app description says it “displays all the temporary and permanent restriction areas, including UAS geozones and NOTAM’s”. [Google Play](https://play.google.com/store/apps/details?hl=en&id=ee.eans.utm.prod&utm_source=chatgpt.com)
*   The Transport Administration still frames the downloadable JSON as “supplementary” and reminds pilots there can be temporary restrictions (NOTAM). [Transpordiamet](https://transpordiamet.ee/en/aviation-and-aviation-safety/flying-drones-estonia/geographical-zones)  
    So: the system got “better for drones”, but that **doesn’t guarantee** the _downloaded GeoJSON_ is free of NOTAM-style schedule text—especially if it includes NOTAM-derived areas.

### Quick way to detect “NOTAM obscurities” locally

Download and scan for the classic patterns (“MON-FRI”, “EXC HOL”, “SR/SS”, “SUNRISE/SUNSET”, “H24”, etc.) and also check whether validity is structured (timestamps/fields) vs free-text.

```bash
curl -L --fail -o ~/uas.geojson 'https://utm.eans.ee/avm/utm/uas.geojson'
python - <<'PY'
import json, re
from pathlib import Path

p = Path.home() / "uas.geojson"
data = json.loads(p.read_bytes())

# NOTAM-ish ambiguity patterns
pat = re.compile(
    r'\b(MON|TUE|WED|THU|FRI|SAT|SUN)\b'
    r'|(\bMON\b\s*-\s*\bFRI\b)|(\bEXC\b|\bEXCEPT\b)'
    r'|(\bHOL\b|\bHOLIDAYS?\b)'
    r'|(\bSR\b|\bSS\b|\bSUNRISE\b|\bSUNSET\b)'
    r'|(\bH24\b|\bDLY\b|\bDAILY\b|\bUFN\b)',
    re.IGNORECASE
)

# ISO-like timestamps (a sign of "better than NOTAM prose")
iso = re.compile(r'\b20\d{2}-\d{2}-\d{2}[T ]\d{2}:\d{2}(:\d{2})?(Z|[+-]\d{2}:\d{2})?\b')

hits = []
iso_hits = 0
timeish_keys = set()

def walk(x, path=""):
    global iso_hits
    if isinstance(x, dict):
        for k, v in x.items():
            if re.search(r'(valid|start|end|from|to|time|date|schedule|activation|period|timezone)', k, re.I):
                timeish_keys.add(k)
            walk(v, f"{path}/{k}")
    elif isinstance(x, list):
        for i, v in enumerate(x):
            walk(v, f"{path}[{i}]")
    elif isinstance(x, str):
        if pat.search(x):
            hits.append((path, x))
        if iso.search(x):
            iso_hits += 1

walk(data)

print(f"NOTAM-ish text matches: {len(hits)}")
for where, s in hits[:40]:
    s1 = " ".join(s.split())
    print(f"- {where}: {s1[:220]}")

print(f"\nISO timestamp-ish strings found: {iso_hits}")
print(f"Time/schedule-like property keys (sample): {sorted(timeish_keys)[:60]}")
PY
```

### How to interpret the output

*   **Many NOTAM-ish matches** → the GeoJSON still contains “human NOTAM prose” somewhere (often in `remarks/description/conditions` fields).
*   **Few/no matches + lots of ISO timestamps + explicit `validFrom/validTo`\-style keys** → it’s closer to “drone-friendly digital validity”, not “SUNRISE-to-SUNSET” prose.

### Devil’s-advocate pitfall

Even if the file looks clean (structured validity, no “MON–FRI EXC HOL”), it can still be incomplete for _real-time_ constraints—because the official guidance still treats the map/JSON as supplementary and calls out temporary restrictions/NOTAM as a separate moving target. [Transpordiamet](https://transpordiamet.ee/en/aviation-and-aviation-safety/flying-drones-estonia/geographical-zones)

## Prompt:
uas.geojson

File

analyze if this document has regular notam obscurities ("from mon-fri except holidays", or "from sunrise" etc) or it has been replaced with better info for drones?

## Response:
Thought for 2m 51s

I can’t read `/mnt/data/uas.geojson` from this chat runtime, so I don’t know (from direct inspection) whether _that specific file_ still contains NOTAM-style schedule prose.

What _is_ clear from official context is that the newer EANS drone map/app explicitly **includes NOTAMs** alongside UAS geozones. [aim.eans.ee+1](https://aim.eans.ee/en/node/241?utm_source=chatgpt.com) And Transpordiamet still treats the map as **supplementary** and tells pilots to also check **temporary restrictions published by NOTAM**. [transpordiamet.ee](https://transpordiamet.ee/en/aviation-and-aviation-safety/flying-drones-estonia/geographical-zones?utm_source=chatgpt.com)  
So even if the GeoJSON got “more drone-native”, the system as a whole still has NOTAM in the loop.

### Deterministic check: does this GeoJSON still contain “NOTAM obscurities”?

Run this locally; it will:

*   scan all string fields for classic NOTAM-ish patterns (`MON-FRI`, `EXC HOL`, `SR/SS`, `SUNRISE`, `H24`, `UFN`, etc.)
*   report examples (with feature name/id if present)
*   report whether there are _machine-readable_ validity fields (ISO timestamps / `validFrom`/`validTo` style keys)

```bash
python - <<'PY'
import json, re
from pathlib import Path
from datetime import datetime

p = Path("/mnt/data/uas.geojson")
data = json.loads(p.read_bytes())

features = data.get("features", []) if isinstance(data, dict) else data
print(f"Features: {len(features)}")

# NOTAM-ish ambiguity patterns
notam_pat = re.compile(
    r'\b(MON|TUE|WED|THU|FRI|SAT|SUN)\b'
    r'|(\bMON\b\s*-\s*\bFRI\b)|(\bSAT\b\s*-\s*\bSUN\b)'
    r'|(\bEXC\b|\bEXCEPT\b)|(\bHOL\b|\bHOLIDAY(S)?\b)'
    r'|(\bSR\b|\bSS\b|\bSUNRISE\b|\bSUNSET\b)'
    r'|(\bH24\b|\bDLY\b|\bDAILY\b|\bUFN\b|\bUNTIL\s+FURTHER\s+NOTICE\b)'
    r'|(\bACT\b|\bACTIVE\b|\bWHEN\s+ACTIVE\b|\bON\s+REQ\b|\bON\s+REQUEST\b)',
    re.IGNORECASE
)

# ISO-ish timestamps (sign of “better than prose”)
iso_pat = re.compile(r'\b20\d{2}-\d{2}-\d{2}[T ]\d{2}:\d{2}(:\d{2})?(Z|[+-]\d{2}:\d{2})?\b')

time_key_pat = re.compile(r'(valid|start|end|from|to|time|date|schedule|activation|period|timezone)', re.I)

def flatten_strings(x):
    """Yield all strings from nested dict/list structures."""
    if isinstance(x, dict):
        for v in x.values():
            yield from flatten_strings(v)
    elif isinstance(x, list):
        for v in x:
            yield from flatten_strings(v)
    elif isinstance(x, str):
        yield x

def feature_label(f):
    props = f.get("properties", {}) if isinstance(f, dict) else {}
    for k in ("id","identifier","name","title","zoneId","uid"):
        if k in props and props[k]:
            return f"{k}={props[k]}"
    return "<no id/name>"

hits = []
iso_hits = 0
time_keys = set()

for f in features:
    if not isinstance(f, dict):
        continue
    props = f.get("properties", {}) if isinstance(f.get("properties", {}), dict) else {}
    for k in props.keys():
        if time_key_pat.search(k):
            time_keys.add(k)

    blob = f  # scan whole feature (properties + geometry metadata)
    for s in flatten_strings(blob):
        if iso_pat.search(s):
            iso_hits += 1
        if notam_pat.search(s):
            hits.append((feature_label(f), s))

print(f"\nNOTAM-ish text matches: {len(hits)}")
for lbl, s in hits[:30]:
    s1 = " ".join(s.split())
    print(f"- {lbl}: {s1[:220]}")

print(f"\nISO timestamp-ish strings found: {iso_hits}")
print(f"Time/schedule-like property keys (found): {sorted(time_keys)}")
PY
```

### How to read the result

*   **Many “NOTAM-ish text matches”** → the GeoJSON still carries the usual human-prose ambiguities somewhere (often in `description/remark/conditions`\-type fields).
*   **Near-zero matches + lots of ISO timestamps + explicit validity keys** → it’s been “drone-normalized” (machine-readable schedules) rather than NOTAM prose.
*   **Zero matches + _no_ validity fields** → likely **only permanent UAS geozones** (clean, but you’re missing temporaries that still arrive via NOTAM / the live app overlay). [transpordiamet.ee+1](https://transpordiamet.ee/en/aviation-and-aviation-safety/flying-drones-estonia/geographical-zones?utm_source=chatgpt.com)

One pitfall / alternative view: “SR/SS” (sunrise/sunset) is inherently location+date dependent, so even “better” datasets sometimes keep it as a token or prose unless they ship per-day computed times (rare). So “no SR/SS strings” doesn’t automatically mean the schedule semantics are fully unambiguous.



---
Powered by [ChatGPT Exporter](https://www.chatgptexporter.com)