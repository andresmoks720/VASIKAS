# Evaluation questions for Anduril counter‑UAS / drone detection in Narva for a 1‑year pilot

## Executive summary

A 1‑year Narva pilot lives or dies on a small number of decision drivers: whether the solution can deliver **actionable early warning** in a **river-border + urban RF-noise** environment, remain useful under **GNSS interference**, and fit into **existing operator and patrol workflows** rather than creating a parallel “science project”. fileciteturn0file1 fileciteturn0file0 citeturn10view2 citeturn2search6

Operationally, Narva’s **short reaction windows** and immediate transition from riverbank to dense urban environment shift value away from “perfect targeting” and toward: fast alerting, prioritisation, low false alarms, and structured evidence export for later action. fileciteturn0file0 citeturn10view2

Technically, you should treat **C2 / fusion** as the core deliverable of the pilot, because Narva already has multiple disparate sources (e.g., ground radar picture plus drone-related RF/ID detections), and the pain point is turning noisy detections into a single, trusted track/incident workflow. fileciteturn0file1 citeturn13search8 citeturn6view3

For Anduril specifically, their public Lattice developer documentation positions Lattice as an SDK/API platform (REST + gRPC) with “open data models” to integrate external systems, which is highly relevant if you are **not buying hardware** and want a software-first pilot that ingests third‑party sensors. citeturn6view3turn19view0turn8view0

On the commercial side, assume **C2 is not “free”**. In at least one published **12‑month subscription** listing for a surveillance tower capability, the “Lattice Platform AI Software License (Application/UI for controlling tower(s))” is explicitly included as a priced component (bundled in that offer), which is a useful reference point when you ask how Anduril prices “software-only” vs “capability-as-a-service”. citeturn9view0

## Narva decision drivers and what they mean for a 1‑year pilot

Narva’s border geometry and operating environment strongly penalise slow, analyst-heavy workflows. Your internal notes describe the river border as narrow in places (tens to hundreds of metres) and emphasise that a crossing can happen in well under a minute, which means “detect → interpret → dispatch” often becomes “detect → log → pursue later” unless alerting is extremely fast and high confidence. fileciteturn0file0

Your current baseline also highlights why **false positives** are existential: drone-related detection coverage is limited in practice, and many “detections” do not yield visual confirmation, so the system must express uncertainty and support triage rather than forcing patrols to chase ghosts. fileciteturn0file1 citeturn10view2

GNSS interference is not hypothetical in this region. European institutions and Member States have documented the growth of GNSS jamming/spoofing as a security concern, and Estonian public reporting has described impacts since 2022. That matters because many distributed sensing/localisation approaches (including TDOA-style systems) depend on precise timing, often GNSS‑disciplined, or need well-designed alternatives. citeturn2search6turn2news45turn2search18turn2search0

Finally, because you are not considering hardware purchase from Anduril, Narva’s key question becomes: **Can Anduril’s C2 layer ingest and fuse your existing sources (2D radar + RF/ID detections) and drive your existing dispatch workflow?** Lattice publicly exposes integration primitives (Entities/Tasks/Objects) and supports both REST and gRPC, which is the right starting point—but you need concrete acceptance criteria around latency, reliability, and evidence capture. citeturn6view3turn19view0turn13search8

image_group{"layout":"carousel","aspect_ratio":"16:9","query":["Anduril Sentry Tower","Anduril Lattice user interface screenshot","Anduril Anvil interceptor drone","Anduril counter UAS system"]}

## Prioritised questions for Anduril representatives

The table is designed for a purchaser/operational lead: each “High” item should either produce (a) a document you can file, (b) a measurable KPI, or (c) a contractual commitment.

### Question set with priority

| Priority | Area | Question to ask Anduril | Why it matters for a 1‑year Narva test | What you should request as proof |
|---|---|---|---|---|
| **High** | Scope & outcome | What *exactly* is the pilot’s deliverable: detection-only, DTI (detect/track/identify), operator attribution, and/or mitigation? What is explicitly out of scope? | Narva’s reaction window is short; if “mitigation” is not legally/operationally ready, the pilot must still succeed via detection + workflow + evidence. fileciteturn0file0 citeturn10view2 | Draft CONOPS + RACI + acceptance test plan (before deployment). citeturn10view2turn13search8 |
| **High** | Performance claims | For small UAS (micro/mini), what are your *guaranteed* detection and tracking performance metrics (Pd, FAR) in an **urban RF-noisy river-border** environment? | False alarms are already a pain point; Narva needs quantified Pd/FAR under local clutter and RF noise. fileciteturn0file1 citeturn10view2turn5search1 | Third-party or government test reports; scenario definitions; confusion matrix on Narva-like clutter. citeturn5search0turn10view2 |
| **High** | False positives | How do you measure and report false alarms (per hour, per km², per sensor, per track-minute)? Do you support operator feedback loops to label false positives and retrain/tune? | Narva operations cannot tolerate “400 pings/day” without actionable certainty. fileciteturn0file1 | KPI definition, tuning procedures, and a pilot-time “false-alarm reduction plan” with milestones. citeturn5search0turn10view2 |
| **High** | Localisation accuracy | What localisation do you provide (2D/3D), with what error bounds, and how is uncertainty shown to operators? | If localisation is a coarse “sector”, patrol dispatch becomes inefficient; uncertainty must be explicit. fileciteturn0file1 | Accuracy vs geometry plots; confidence ellipses; example UI screenshots and exported metadata. citeturn13search8turn2search16 |
| **High** | Altitude resolution | Can you estimate altitude (and with what accuracy)? If your inputs are 2D radar + EO/IR, how do you derive Z? | 2D radar pictures can detect tracks without altitude; drones need usable height to cue cameras and risk scoring. fileciteturn0file1 | Demonstration of altitude estimate under clutter; definition of “altitude” (AMSL/AGL) and reference datum. citeturn13search8turn1search3 |
| **High** | Sensor fusion | Do you fuse tracks from third‑party 2D radar + RF detection + Remote ID + EO/IR into one “entity”? What is your fusion logic (association rules, track management)? | Multi-sensor fusion is the whole point; Narva needs one coherent picture, not separate consoles. fileciteturn0file1 | Fusion architecture doc, track association parameters, and a way to export “track lineage” for evidence. citeturn13search8turn6view3 |
| **High** | Integration readiness | What integration interfaces are available for us: REST, gRPC, message queue, WebSocket? Are the APIs GA or beta? | A 1‑year pilot cannot depend on unstable APIs; you need GA commitments and lifecycle clarity. citeturn6view3 | API catalogue with availability levels; integration sample code; versioning/support policy. citeturn6view3turn19view0 |
| **High** | Identity & auth | How do you handle auth (OAuth, tokens), key management, and least-privilege roles for operators vs integrators? | Police workflows require auditable access control and separation of duties. citeturn6view3turn10view2 | Security architecture + role matrix + audit log format. citeturn6view3turn10view2 |
| **High** | Remote ID support | Which Remote ID standards do you decode and fuse (ASTM F3411 broadcast/network, EU “direct remote identification” add-on requirements)? | If you rely on Remote ID, you must support both US and EU ecosystems and decode BLE/Wi‑Fi style broadcasts where present. citeturn1search0turn1search1turn1search2 | Decoder spec + supported message types + field mapping + raw capture export for forensics. citeturn1search0turn1search2 |
| **High** | GNSS resilience | What happens to detection/localisation if GNSS is jammed/spoofed? What alternative timing/holdover do you use? | GNSS interference is rising in Europe; timing-sensitive localisation can degrade without a resilience plan. citeturn2search6turn2search0turn2search5 | A “GNSS-denied mode” specification; test report showing performance degradation curves. citeturn2search5turn2search6 |
| **High** | RF environment | How do you discriminate UAV control links from dense urban emitters (Wi‑Fi/BT/industrial), and what is the expected false positive rate impact? | Narva urban RF noise is specifically called out as problematic; discrimination is essential. fileciteturn0file1 | RF classifier features; interference testing; calibration procedure; site survey RF spectrum report. citeturn10view2turn5search0 |
| **High** | “Two nodes” viability | If we deploy only **two nodes**, what localisation and coverage can you honestly deliver, and what is the minimum configuration to be operationally useful? | You asked for the minimum spend: two nodes must still prove value (workflows + metrics), even if they cannot cover the whole border. fileciteturn0file1 | A 2-node pilot design with explicit limitations and measurable KPIs for that footprint. citeturn13search8turn2search16 |
| **High** | Workflow integration | How will alerts/tasks flow into our patrol workflow (dispatch, acknowledgement, escalation), and what are the latency targets? | A 1‑year test is primarily about operational fit; latency and acknowledgement loops are key. fileciteturn0file1 | End-to-end sequence diagrams + acceptance test for “alert → patrol view → acknowledgement”. citeturn13search8turn10view2 |
| **High** | Evidence & export | What evidence artifacts do you generate (logs, track history, screenshots/clips, RF captures), and can we export them in standard formats? | Narva often becomes “after-the-fact”; you need court/incident-ready data and chain-of-custody. fileciteturn0file0 | Data dictionary + export formats + retention settings + signed logs option. citeturn13search8turn10view2 |
| **High** | Data ownership | Who owns pilot data and derived models? Can we retain data after pilot ends? | Avoid vendor lock-in; preserve evidence and analytics value beyond the pilot. citeturn10view2turn13search8 | Contract clause: customer ownership + export in bulk + post-termination access window. citeturn9view0turn13search8 |
| **High** | On‑prem vs cloud | Can the solution run air‑gapped / on‑prem, and what degrades if comms drop? | Border environments and national systems often require local operation; comms loss must not kill detection. citeturn10view2turn13search8 | Architecture options; offline behaviour; local buffering limits; recovery semantics. citeturn13search8turn6view3 |
| **High** | Support & SLA | What is the support model (24/7?), incident response times, spares, and uptime SLA for the pilot? | A pilot that is down during “interesting days” proves nothing. citeturn10view2turn13search8 | SLA draft + escalation contacts + maintenance schedule + uptime reporting method. citeturn9view0turn13search8 |
| Medium | Interoperability standards | Do you publish/export tracks using common formats (e.g., Cursor-on-Target, ASTERIX) and can you ingest ASTERIX CAT062 from our radar stack? | Radar integration is typically ASTERIX in Europe; common formats reduce integration cost. citeturn1search3turn0search17 | Example messages; field mapping; conformance statement; test harness. citeturn1search3turn0search17 |
| Medium | Time synchronisation | What time sync do you require (NTP/PTP/GNSS), and what tolerance is needed for track fusion/localisation? | Distributed sensor fusion and multilateration are timing-sensitive; you need explicit tolerances. citeturn2search0turn2search16 | Timing budget, holdover specs, and test plan for time drift. citeturn2search0turn2search5 |
| Medium | Cyber assurance | What hardening guidance, patch cadence, vulnerability disclosure, and audit logging do you provide? | Police-grade systems need a realistic security operations plan. citeturn10view2turn6view3 | STIG-like checklist; SBOM; pen-test results; logging schema. citeturn13search8turn6view3 |
| Medium | Legal constraints | What “counter” options require special legal authority (e.g., jamming), and how do you help customers stay compliant with national spectrum law? | In Estonia, harmful radio interference is prohibited except where law explicitly allows; you must keep “mitigation” aligned to authority. citeturn18view0 | Written legal/spectrum compliance assumptions; options that are detect-only vs mitigate. citeturn18view0turn3search3 |
| Medium | Export controls | Are any components/software subject to US export controls (ITAR/EAR) or EU dual‑use export rules, and how does that affect support and updates delivered to Estonia? | Export controls can affect timelines, hosting, and who can access technical data. citeturn4search0turn4search1turn4search2 | Export classification (ECCN/USML if applicable) + delivery plan + constraints on documentation access. citeturn4search0turn4search1turn4search6 |
| Medium | Training | What is the training burden per operator, and what refreshers are needed? | High turnover or low familiarity kills pilot outcomes; training must be measurable. citeturn10view2turn13search8 | Training plan + proficiency test + training data sets and scenarios. citeturn10view2turn5search0 |
| Medium | Site survey | Will you perform an RF survey, comms survey, and line‑of‑sight modelling for each node location? | Urban RF noise and river geometry require engineering, not guessing. fileciteturn0file1 | Site survey outputs + recommended mast heights + predicted coverage heatmaps. citeturn10view2turn13search8 |
| Medium | Pilot transparency | Will you provide raw logs + ground truth from test flights to allow independent scoring? | Vendors can “win” demos with curated views; you need independent verification. citeturn5search0turn10view2 | Raw event logs, track history export, and scoring scripts. citeturn5search0turn13search8 |
| Low | Future scaling | If the pilot succeeds, what is the scaling path to cover more of the border (procurement, deployment rate, staffing)? | Useful for roadmap, but not required to decide pilot success. citeturn10view2 | Scaling plan with cost curve; operational staffing model. citeturn10view2turn9view0 |

## Node count: minimum viable deployments, including a 2‑node pilot

### Starting point: define what a “node” means for your pilot

For a **software‑first** (no hardware purchase) approach, define a node as a *deployable sensing + compute + comms point that publishes detections/tracks into the C2 layer*. That can be: an existing tower/radar site with a connector, a third‑party RF sensor, or an EO/IR/radar package you already own—provided Anduril can ingest it through supported APIs/data models. citeturn6view3turn8view0turn13search8

If you also evaluate **capability‑as‑a‑service** (lease/subscription, not buy), published pricing examples show Anduril structures “annual, per node” items such as communications services and a 12‑month subscription that bundles the operator UI licence (Lattice) with the fielded node. That reference helps you ask “how many nodes can we afford for one year?” without committing to purchase. citeturn9view0

### What is the minimum number of nodes?

There are three “minimums”, depending on your goal:

**Zero new nodes (integration pilot)**  
If your main risk is integration and workflow, you can run a pilot that ingests existing feeds (2D radar tracks, existing RF/ID detections) and measures alert latency, false alarm handling, operator workload, and evidence export—without adding physical nodes. This aligns with the EU C‑UAS guidance that stresses process + integration + stakeholder roles, not only sensors. citeturn10view2turn13search8turn6view3

**Two nodes (minimum field pilot)**  
With two nodes you can credibly test:
- end‑to‑end workflow (alert → operator → patrol acknowledgment),
- urban RF-noise behaviour vs a less noisy segment (if you place nodes accordingly),
- the platform’s ability to represent uncertainty and reduce false positives,
- GNSS‑degraded operations and comms dropouts. fileciteturn0file1 citeturn2search6turn10view2turn13search8

What you typically **cannot** guarantee with only two nodes (unless another sensor provides the missing geometry) is precise RF‑based emitter localisation: multilateration/TDOA approaches depend heavily on receiver geometry and tight timing, and accuracy degrades with poor geometry. citeturn2search0turn2search16

**Three+ nodes (credible localisation pilot)**  
If your pilot success criteria include “operator location within X metres” (or tight aerial track localisation from passive RF), it is safer to plan for ≥3 nodes with overlap, because geometry drives accuracy and resilience to single-node outages. citeturn2search16turn13search8

### “What could we do with 2 nodes?” – two concrete pilot designs

**Design A: “Urban stress test + workflow proof” (recommended for Narva)**  
- Node 1: placed to maximise exposure to urban RF clutter near the river-facing city environment.  
- Node 2: placed at a comparatively quieter segment to establish a clean baseline.  
Outcome: you learn whether the system’s false-alarm management and fusion logic can survive the environment that currently causes ambiguous detections. fileciteturn0file1 citeturn5search0turn10view2

**Design B: “Two-node overlap wedge” (if you need localisation practice)**  
- Place nodes to create an overlap area (“wedge”) where both nodes see the same airspace segment, then rely on a third input (existing radar/camera) for disambiguation.  
Outcome: you can test track association and uncertainty reporting even if RF-only localisation is limited. citeturn13search8turn1search3turn2search16

### Simple node-estimation method for a linear border

This is intentionally “back‑of‑the‑envelope” for procurement sizing; it is not a substitute for RF propagation modelling and a site survey. The EU C‑UAS approach explicitly expects site-specific design and testing rather than assuming a universal “silver bullet.” citeturn10view2turn13search8

**Inputs you must lock down (ask Anduril to provide ranges as bands, not point numbers):**
- Threat class to optimise for (micro, small quadcopter, fixed‑wing) and whether cooperative Remote ID is assumed. citeturn1search0turn1search2  
- Detection range per node by sensor modality (radar vs EO/IR vs RF) and the minimum altitude/LOS assumptions behind that range. citeturn13search8turn2search16  
- Required localisation accuracy (e.g., “≤100 m 95%” vs “sector-level is fine”) and whether you need 2D or 3D. citeturn13search8turn2search16  
- Required overlap factor if you need triangulation/multilateration (typically you want each point in the defended area covered by ≥2 sensors; ≥3 if you require robust localisation). citeturn2search16turn13search8  
- Mast heights and line-of-sight to the river corridor (and existence of tall structures you can reuse). citeturn10view2turn13search8  
- Timing method (GNSS/holdover/PTP) and expected performance under jamming. citeturn2search0turn2search6turn2search5  

**Method (linear-border approximation):**
1. Choose representing “effective along-border coverage per node” as \(L_{eff}\) (km), after accounting for urban clutter, terrain masking, and the minimum drone altitude you care about.  
2. Choose overlap factor \(O\):  
   - \(O = 1.2\) for detection-only (some overlap for handoff),  
   - \(O = 1.8–2.5\) if you require consistent multi-sensor confirmation,  
   - \(O ≥ 3\) if you require strong localisation with redundancy. citeturn13search8turn2search16turn10view2  
3. Compute rough node count: \(N \approx \lceil \frac{BorderLength}{L_{eff} / O} \rceil\).  
4. Validate by plotting candidate sites and checking overlap gaps and geometry (see template below).

### Site table template to compute node coverage and overlaps

Fill this with candidate mast/tower sites, then use it to compute pairwise distances, overlap regions, and which segments are covered by ≥1/≥2/≥3 nodes.

| Site ID | Lat | Lon | Ground elevation (m) | Proposed mast height (m AGL) | Environment (urban/river/rural) | Existing assets at site (radar/camera/network) | Available power (grid/solar/gen) | Backhaul options (fibre/4G/5G/microwave) | Expected RF noise (low/med/high) | Restrictions (access, permissions, LoS limits) | Notes |
|---|---:|---:|---:|---:|---|---|---|---|---|---|---|
| N‑01 |  |  |  |  |  |  |  |  |  |  |  |
| N‑02 |  |  |  |  |  |  |  |  |  |  |  |
| N‑03 |  |  |  |  |  |  |  |  |  |  |  |

## C2 and integration requirements to request

Because you are not buying hardware from Anduril, the technical heart of your evaluation is: **Can Anduril’s C2 ingest, normalise, fuse, and task against your data sources in a stable, supportable way?** Anduril’s own developer documentation describes Lattice APIs (Entities/Tasks/Objects), and provides both REST and gRPC integration paths plus sample apps using environment tokens. citeturn6view3turn19view0

### Integration questions you should ask as “show me the interface”

Ask Anduril to demonstrate (live, in a sandbox if possible) the following:

**APIs and data models**
- Publish/update a track/entity with position, speed, classification, confidence, and unique IDs (including how de-duplication works). citeturn6view3turn19view0  
- Create a task/workflow step (e.g., “slew camera to track”, “request patrol acknowledgement”) and show its lifecycle. citeturn6view3turn13search8  
- Store binary artifacts (RF captures, screenshots, short clips) as “objects” and show retrieval and retention controls. citeturn6view3turn13search8  

**Message formats and coordinate systems**
- Confirm which standards you can ingest/publish for position/track exchange:  
  - Cursor-on-Target (widely used in tactical systems). citeturn0search17  
  - ASTERIX track messages are common for radar integration in Europe (e.g., CAT062 for system track data). citeturn1search3turn1search7  
  - If you have NATO interoperability needs, ask about STANAG family support and any conformance statements. citeturn4search3turn4search18  
- Confirm coordinate reference used internally (WGS‑84 vs local projected), and how they handle AGL vs AMSL altitude. citeturn1search3turn2search16  

**Timing, latency, bandwidth**
- Required time sync at nodes and in the core: NTP vs PTP vs GNSS‑disciplined time, and how large timing errors affect fusion/localisation. Timing sensitivity is well known in multilateration contexts, and GNSS timing is a common synchronisation mechanism. citeturn2search0turn2search16  
- End‑to‑end latency budget: sensor → fusion → UI → dispatch integration. Require percentile metrics (p50/p95/p99), not a single number. citeturn13search8turn5search0  

**Security and deployment topology**
- Authentication methods: OAuth/token usage, token rotation, and whether you can run entirely on‑prem with your identity provider. citeturn6view3turn13search8  
- Transport security: TLS, mutual authentication, VPN options, and whether edge nodes can buffer and forward when links restore. citeturn13search8turn6view3  

### Acceptance criteria to insist on for integration

Use “interface acceptance tests” so success is not subjective:

- **Track ingest**: “From our radar feed, 1,000 synthetic tracks/hour are ingested without loss; duplicates resolved; UI shows correct ID continuity.” citeturn1search3turn13search8  
- **Alerting**: “From an RF/ID detection event, operator receives alert within X seconds p95; can acknowledge/annotate; event retained.” citeturn13search8turn5search1  
- **Export**: “For any incident, we can export the full timeline (detections, track history, evidence artifacts) in documented formats within Y minutes.” citeturn13search8turn10view2  

## Commercial and contractual structure for a 1‑year test

### Clarify “software-only” vs “capability-as-a-service” without buying hardware

You can structure a 1‑year deal in at least two non-purchase ways:

- **Software-only + integration services** (you provide sensors/compute/hardware): this directly leverages Anduril’s published Lattice APIs/SDK model. citeturn6view3turn8view0turn19view0  
- **Subscription/lease** where hardware is provided and later recovered (a published example explicitly states “12‑month subscription” and that towers are recovered after the term, while including the Lattice UI licence in the bundle). citeturn9view0  

If you truly want **no Anduril field hardware at all**, make that a hard requirement and ask for a written “supported third‑party sensor list” plus a committed integration timeline. citeturn6view3turn13search8

### Is C2 extra?

Do not assume either way. Treat C2 as a priced component unless a contract line explicitly bundles it. The published subscription example bundles the Lattice platform/UI licence with the node service, and separately prices “communications service (annual, per node)”, which suggests Anduril can unbundle components depending on procurement model. citeturn9view0

Your direct questions:
- “If we do not use Anduril towers, what is the licensing model for Lattice UI + fusion + connectors?” citeturn6view3turn8view0  
- “What is priced per node vs per operator vs enterprise?” citeturn9view0  

### Cost components to request from Anduril and how to compare

Ask Anduril to quote costs in **one-time vs recurring**, and to explicitly flag pass-through costs (travel, third‑party hosting, comms). The published subscription example also bakes in items like pre‑deployment site survey, logistics, comms services, and training—use that as a checklist even if you won’t buy the same bundle. citeturn9view0turn10view2

#### Sample cost comparison table (1‑year pilot, no hardware purchase)

| Cost line item | One-time (EUR) | Recurring monthly (EUR) | Recurring annual (EUR) | Notes / comparison traps |
|---|---:|---:|---:|---|
| C2 software licence (UI + fusion) |  |  |  | Confirm whether priced per node, per user, or site-wide; confirm term end behaviour (“licence cessation”). citeturn9view0turn6view3 |
| Data connectors / ingestion adapters |  |  |  |  | Separate “build once” vs “maintain” costs; require documented APIs and support policy. citeturn6view3turn19view0 |
| Integration engineering for 2D radar feed |  |  |  |  | Specify ASTERIX/other format, mapping, and acceptance tests. citeturn1search3turn1search7 |
| Integration engineering for RF/Remote ID sources |  |  |  |  | Demand field mapping for ASTM/EU Remote ID where relevant. citeturn1search0turn1search2 |
| Hosting (on‑prem deployment support or managed hosting) |  |  |  |  | Data sovereignty requirements may force on‑prem; define who patches. citeturn13search8turn6view3 |
| Support & SLA (24/7 vs business hours) |  |  |  |  | Make SLA measurable: response times, uptime, planned maintenance windows. citeturn13search8turn10view2 |
| Training package |  |  |  |  | Include operator proficiency test and refreshers. citeturn10view2 |
| Security work (pen test support, audit evidence, hardening) |  |  |  |  | Ensure you receive audit logs + SBOM and a vulnerability response process. citeturn13search8turn6view3 |
| Decommissioning / exit support |  |  |  |  | Budget for data export, config handover, and secure wipe. citeturn13search8turn9view0 |

### Regulatory and export-control questions to put in the contract

- **Spectrum/jamming**: Estonian law prohibits causing harmful radio interference except where explicitly allowed; require the contract to state that any mitigation that could cause interference will not be enabled/used without your written legal authorisation and spectrum sign-off. citeturn18view0turn3search3  
- **Export controls**: require written classification and constraints under US ITAR/EAR and EU dual‑use regimes, because they can affect support, patches, and what documentation can be shared. citeturn4search0turn4search1turn4search2turn4search6  

## Risks, KPIs, acceptance tests, and contract deliverables for a 1‑year pilot

European guidance on C‑UAS stresses that solutions are site-specific, require stakeholder processes, and must be validated through test plans and acceptance criteria—not just vendor claims. citeturn10view2turn5search0turn13search8

### Risk checklist tailored for Narva

| Risk | Why it is likely in Narva | Mitigation you require from Anduril in the pilot |
|---|---|---|
| High false alarm load | Urban RF noise + cluttered environment; internal baseline already notes ambiguous detections. fileciteturn0file1 | Explicit FAR KPI + tuning plan + operator feedback loop + rejection of “demo mode” scoring. citeturn5search0turn10view2 |
| GNSS interference breaks timing/localisation | Europe has documented increasing GNSS jamming/spoofing concern; timing is critical for some localisation methods. citeturn2search6turn2search0turn2search5 | “GNSS‑denied mode” spec + holdover/timing approach + test under GNSS degradation. citeturn2search5turn2search6 |
| Integration delay consumes the year | C2 integration is often the long pole; APIs must be stable and supported. citeturn6view3turn13search8 | Milestone plan: week‑by‑week integration checkpoints + interface acceptance tests. citeturn13search8turn6view3 |
| Vendor lock-in via proprietary exports | If evidence cannot be exported, the pilot has limited lasting value. citeturn13search8turn10view2 | Contractual right to bulk export + documentation + schema stability. citeturn13search8turn9view0 |
| Legal/regulatory mismatch on “counter” actions | Harmful interference is prohibited except where permitted; mitigation features can create compliance risk. citeturn18view0turn3search0 | Detect-only pilot by default; mitigation gated behind written authority. citeturn18view0turn3search3 |

**Devil’s advocate (worth stating explicitly):** with Narva’s short reaction window, even a *perfect* detection system may not produce “on‑scene interdictions”; success might instead look like better triage and evidence for later action. If stakeholders silently expect “catch them at the riverbank”, the pilot can be unfairly labelled a failure. fileciteturn0file0 citeturn10view2

### KPI table for pilot acceptance

| KPI | Definition | Target proposal for a 1‑year pilot | How to measure in on‑site tests |
|---|---|---|---|
| Detection probability (Pd) | % of scripted drone flights detected within defended area | Set target by threat class (micro vs small): negotiate with vendor; require confidence intervals | Controlled flights with ground truth; score by scenario. citeturn5search0turn10view2 |
| False alarm rate (FAR) | False tracks/alerts per hour (or per km²) under normal conditions | “Low enough to sustain operations”: require numeric FAR + operator workload limit | Run with no friendly drones; log all alerts. citeturn5search1turn10view2 |
| Localisation error | Distance between reported and true drone position/operator position | If 2‑node pilot: accept coarse uncertainty but require explicit error bounds | Test flights at multiple points; measure error distribution. citeturn2search16turn13search8 |
| Time‑to‑operator | Time from first detection to operator alert | p95 threshold (seconds) | Timestamped logs from sensor → C2 → UI. citeturn13search8turn5search0 |
| Uptime | % time system is operational and producing outputs | Negotiate SLA for pilot | Automated health checks + weekly uptime report. citeturn13search8turn9view0 |
| Evidence completeness | For each incident, availability of full track history + artifacts | 100% of scored test scenarios | Attempt export for each scenario and verify contents. citeturn13search8turn10view2 |

### Suggested on‑site tests to validate vendor claims

Use a repeatable methodology: scenario-based testing with controlled flights and clear metrics is a recognised direction in counter‑drone evaluation work, and EU guidance emphasises design → test plan → acceptance criteria. citeturn5search0turn10view2turn13search8

A compact but high-yield Narva test pack:

1. **Baseline noise run (no drones)** in the exact deployment footprint for ≥72 hours to establish background FAR. citeturn10view2turn5search1  
2. **Controlled flights** for at least three threat classes (micro quad, small quad, small fixed‑wing), at multiple altitudes and river‑parallel vs perpendicular tracks. citeturn5search0turn10view2  
3. **Remote ID enabled/disabled toggles** (where lawful/possible) to validate decoding and fusion behaviour rather than assuming Remote ID always exists. citeturn1search0turn1search2  
4. **Urban RF stress window tests** during peak Wi‑Fi/Bluetooth activity to measure degradation and false positives. citeturn10view2turn5search0  
5. **GNSS-degraded exercise** (coordinate with appropriate authorities): not to jam, but to observe system behaviour during known interference conditions and verify “GNSS-denied mode” claims. citeturn2search6turn2search5turn18view0  
6. **Integration drill**: inject synthetic radar tracks (ASTERIX CAT062 or your actual feed) to test ingestion rate, correlation, and UI behaviour. citeturn1search3turn1search7  
7. **End-to-end workflow drill**: operator receives alert → acknowledges → triggers dispatch workflow; measure time-to-operator and task completion. citeturn13search8turn6view3  
8. **Evidence export drill**: for each scenario, export the full case package and verify it is complete and readable without vendor tooling. citeturn13search8turn10view2  

### Contract deliverables to prioritise for a 1‑year test

These should be explicitly listed in the contract with due dates (front‑loaded), because the pilot year is short.

| Deliverable | Priority for 1‑year pilot | Why it matters |
|---|---|---|
| Site survey report (RF + comms + LoS) + recommended node placement | **High** | Prevents “guess and deploy”; required in site-specific C‑UAS methodology. citeturn10view2turn13search8 |
| Integration design pack (interfaces, schemas, timing, security) | **High** | Without it, integration risk consumes the year; ties to API stability and acceptance tests. citeturn6view3turn13search8 |
| Pilot test plan + KPI scoring method (ground truth, logs, pass/fail) | **High** | Prevents demo-driven evaluation; aligns with standardised evaluation approaches. citeturn5search0turn10view2 |
| Operator training + proficiency check | **High** | Ensures results reflect system capability, not operator confusion. citeturn10view2 |
| Monthly performance report (Pd/FAR/latency/uptime) | **High** | Keeps pilot honest and supports go/no-go decisions. citeturn13search8turn9view0 |
| Evidence export specification + sample case packages | **High** | Narva value includes “after-the-fact”; exportability prevents lock-in. citeturn13search8turn10view2 |
| Maintenance and patch schedule + vulnerability response process | Medium | Security posture must be operationalised in the pilot year. citeturn6view3turn13search8 |
| End-of-pilot exit plan (data handover, config export, secure wipe) | Medium | Ensures you keep value after the pilot and can scale with another vendor if needed. citeturn13search8turn9view0 |