# Counter-drone system requirements

**User:** Andres Moks (andres.moks@gmail.com)  
**Created:** 12/14/2025 3:26:31  
**Updated:** 1/7/2026 23:28:39  
**Exported:** 1/7/2026 23:29:07  
**Link:** [https://chatgpt.com/c/693e1245-dbcc-8332-9d17-a689719d3978](https://chatgpt.com/c/693e1245-dbcc-8332-9d17-a689719d3978)  

## Prompt:
based on attached files, extract all kinds of requirements mentioned for the counter drone border guard  system

## Response:
Thought for 1m 26s

Below is a consolidated extraction of the _requirements / constraints / “we must have” statements_ that show up across the attached transcripts for the counter-drone border-guard (“droonimüür”) system. I’ve separated **hard requirements / clear decisions** from **candidate requirements / open questions** where the speakers explicitly frame things as “vision” or “needs deciding.”

* * *

1) Core purpose and scope
-------------------------

*   The system’s core problem to solve: when multiple counter-UAS devices are bought, **they must not each come with their own separate operator interface**; instead **all devices must end up visible/usable in one common interface**.
    H2\_resampled\_mono\_PRE180\_vadlig…
*   The system is treated as a **peace-time project** (even though war scenarios are discussed), with a primary goal of **detecting (and potentially enabling response to) drones** for border/security use cases (incl. smuggling).
    Sys Recording 354\_resampled\_mon…
    Tannar 121225 Recording 355\_res…
*   Phased intent: early on, a key goal is simply that **signals/feeds “work” end-to-end** (basic functioning), while the end-state is full situational awareness and management (“we see/handle it”).
    Tannar 121225 Recording 355\_res…

* * *

2) Coverage, rollout, and physical infrastructure
-------------------------------------------------

*   **By the end of 2027**, the expectation/requirement stated is: **the entire eastern border must be covered with sensors**.
    Tannar 121225 Recording 355\_res…
*   A working physical assumption/constraint is that the border build is roughly **~200 km** and that **fiber (“valguskaabel”) runs along the border**, with branch connections to sites.
    Tannar 121225 Recording 355\_res…
*   **Wired connectivity is the baseline**: sensors are expected to sit “on a network cable”; **radio/mesh sensor-to-sensor comms is explicitly _not_ the chosen approach** (at least “not a topic so far”).
    Tannar 121225 Recording 355\_res…
*   There is a requirement/lesson-learned constraint that **capabilities / critical equipment should not be placed right at the border edge** (war/escalation scenario: positions get abandoned, equipment left behind, picture disappears).
    Sys Recording 354\_resampled\_mon…

* * *

3) Sensors and field capability requirements
--------------------------------------------

### 3.1 Multi-sensor “stack” per surveillance position (explicit “should have”)

*   A border “seirepositsioon” is described as ideally containing **RF + radar + acoustic + a “proper camera”**.
    Tannar 121225 Recording 355\_res…
*   The camera is expected to **track objects and help identify/confirm** targets (not just passively view).
    Tannar 121225 Recording 355\_res…
*   The plan/decision direction is that **RF sensors + radars are already basically agreed for the border**, but there’s a push that **acoustic/optical shouldn’t be omitted** just because of doubts.
    Tannar 121225 Recording 355\_res…
    Tannar 121225 Recording 355\_res…

### 3.2 Remote ID / Drone ID

*   **Remote ID is included as a requirement/quantity line item**, and there’s an expectation that **RF sensors should already include “drone ID” capability** (Remote ID being counted even if “technically I require it already in RF sensors”).
    Sys Recording 354\_resampled\_mon…

### 3.3 Countermeasure / “effector” expectations (directional vs omni)

*   There’s an explicit preference for **directional / targeted effect** (e.g., a “proper antenna that can counter/jam” aimed at the specific object) rather than **omnidirectional (“omni”) blasting** that could affect friendlies nearby.
    Tannar 121225 Recording 355\_res…
    Tannar 121225 Recording 355\_res…

### 3.4 Detection performance realism (constraint on specs)

*   Detection range is treated as **highly environment-dependent** (terrain/weather), and there’s skepticism about vendor brochure numbers; the requirement implication is: **specs must be validated/tested**, not accepted as marketing.
    Tannar 121225 Recording 355\_res…

* * *

4) “One interface” and integration requirements
-----------------------------------------------

*   The system must provide **a unified integrated picture** instead of forcing operators to hop between vendor tools.
    H2\_resampled\_mono\_PRE180\_vadlig…
*   **Closed devices are a problem**: if a device is “very closed,” it may be **hard/impossible to integrate** (DJI AeroScope is named as an example). Therefore, procurement must account for **integratability**.
    H2\_resampled\_mono\_PRE180\_vadlig…
*   The team expects to define **technical conditions/specs** for sensors (e.g., radar requirements) and likely needs **middleware (“vahetarkvara”)** to connect devices into the platform.
    H2\_resampled\_mono\_PRE180\_vadlig…
*   There’s a clear “platform” direction: adopt **standard protocols / standard ‘languages’ / modular approach**, so new sensors can be “plugged in” and speak common interfaces.
    Tannar 121225 Recording 355\_res…
    Tannar 121225 Recording 355\_res…
*   The system should be able to incorporate/align with existing or market platforms/interfaces (explicitly referenced examples: **Artos, Sensobus, TRS-Raada/Leonardo, Hensoldt, Anduril**), at least to learn/fit interface expectations.
    H2\_resampled\_mono\_PRE180\_vadlig…
*   The ecosystem goal extends beyond the border: critical sites/ETODs may add their own RF sensors; the requirement becomes that **a standard/certification/compatibility rule exists so third-party sensors can be configured into the national system** (“if a factory in Viljandi adds RF, we still see it”).
    Tannar 121225 Recording 355\_res…
    Tannar 121225 Recording 355\_res…

* * *

5) System architecture, networking, and resilience
--------------------------------------------------

*   Architecture is described as a **central “base server”** where “all info comes together,” on a **closed network**, with a strong link back to Tallinn/HQ.
    Tannar 121225 Recording 355\_res…
*   The operational picture should support **filtered views by unit/region** (e.g., Narva sees only its sector), while HQ can expand to **see everything**.
    Tannar 121225 Recording 355\_res…
*   There’s a requirement question that becomes a design constraint: **connectivity and command must be resilient**—if Tallinn is unreachable, **Tartu (or local nodes) must still be able to manage their “piece.”**
    Tannar 121225 Recording 355\_res…
*   Radar clustering note: if multiple radars operate together for better performance, they may require **high bandwidth/fiber and shared compute**, meaning the architecture must handle **systems where data doesn’t “come out of one radar” but from a combined radar system.**
    Tannar 121225 Recording 355\_res…

* * *

6) Access control and sensitive-data handling
---------------------------------------------

*   Access is permissioned: “who sees what” depends on roles; **local units see their slice; central sees all**.
    Tannar 121225 Recording 355\_res…
    Tannar 121225 Recording 355\_res…
*   Military sensor data handling constraint: **raw/complete military sensor info is limited to specific places (e.g., only one location / General Staff),** and when shared, it may be **heavily masked** due to NATO secrecy constraints.
    Tannar 121225 Recording 355\_res…

* * *

7) User experience and operational workflow requirements
--------------------------------------------------------

*   Strong preference: **no install-heavy client setups**; **everything should run in the web**.
    Tannar 121225 Recording 355\_res…
*   Desired UX: “go to a URL, log in (ID-card, etc.), and you have access” vs downloading an Excel file.
    Tannar 121225 Recording 355\_res…
*   Border operators must be able to **monitor from a workstation and make decisions**, including **dispatching a patrol** based on drone location.
    Tannar 121225 Recording 355\_res…
*   Support multiple user groups and views (examples mentioned):
    *   **Planning/coverage view** showing “detection areas” (e.g., green zones where drones are reliably detected).
        Tannar 121225 Recording 355\_res…
    *   **Command-center workflow**: unidentified drone over a protected building → command center contacts nearest patrol → patrol responds/counters.
        Tannar 121225 Recording 355\_res…
    *   **Alerting**: users (e.g., close protection) may need **a “beep/alert” when a drone is nearby**, potentially driven by central server + the patrol’s location feed (KILP/location is referenced as already providing positions).
        Tannar 121225 Recording 355\_res…
        Tannar 121225 Recording 355\_res…

* * *

8) Legal/compliance requirements (called out as must-address)
-------------------------------------------------------------

*   The legal side is flagged as non-optional: must consider **personal data processing**, and specifically the concept of **“infosüsteemi pidamise kord”** (rules/requirements for operating an information system).
    Tannar 121225 Recording 355\_res…
*   There are **constraints on drone-data retention** (“piirangud … drooniandmete säilitamisele”) that need legal work; speakers anticipate this might require later adjustment (even law changes) but it’s still a system requirement to design around.
    Tannar 121225 Recording 355\_res…

* * *

9) Procurement, ownership, and vendor lock-in constraints
---------------------------------------------------------

*   Procurement must explicitly decide between **license vs code ownership**:
    *   If code is owned, PPA can **continue development without the original vendor**.
    *   If it’s only a license, use is limited by the license/vendor relationship.
        Tannar 121225 Recording 355\_res…
*   Desired property: solutions should **not be “closed”** so others can be contracted to continue development (avoid lock-in).
    Ppa\_resampled\_mono\_PRE180\_vadli…
    H1\_resampled\_mono\_PRE180\_vadlig…
*   Integration capability reality: it’s stated that **integration will likely need to be bought in** (skills gap), and current practice involves spinning vendor systems up (often Docker/Linux VMs) and wiring devices across networks/tunnels.
    Ppa\_resampled\_mono\_PRE180\_vadli…
    Ppa\_resampled\_mono\_PRE180\_vadli…

* * *

10) Delivery approach / lifecycle requirements
----------------------------------------------

*   Explicit staged approach:
    1.  **Analysis**: define who must connect, and what requirements are.
    2.  **Prototype**: prove devices/data can communicate / integrated data can be shown.
    3.  **Product**: move toward the full operational system.
        Ppa\_resampled\_mono\_PRE180\_vadli…
        Ppa\_resampled\_mono\_PRE180\_vadli…
*   “Plug-in play” requirement for future procurements: sensors (e.g., radars) should meet requirements so they are **easy to connect into the system**.
    Tannar 121225 Recording 355\_res…
*   Prototyping is expected to use **existing sensors plus incoming equipment**, while sensor types are “chosen” but suppliers may not be; the system must tolerate heterogeneous funding/projects and device diversity.
    Tannar 121225 Recording 355\_res…
    Tannar 121225 Recording 355\_res…

* * *

If you want to turn this into a clean “requirements catalog” (REQ-001…REQ-0xx) with **testable acceptance criteria** (what to verify, how to measure), that’s doable straight from the same extracted points—basically: turn the meeting-talk into engineering sentences and checks.

## Prompt:
mida veel transkriptsioonifailide põhjal peaks arvesse võtma (sh osapooled, liidestused)

## Response:
Thought for 50s

Siin on need “veel arvesse võtta” teemad, mis transkriptsioonidest päriselt läbi jooksevad – eriti **osapooled** ja **liidestused**, aga ka praktilised komistuskivid.

Osapooled ja rollid, mida tasub kohe kaardistada
------------------------------------------------

*   **PPA sees**: piiripunktid/kordonid + prefektuurid + juhtimiskeskused/valvekeskus (kes “vahib suurt pilti” ja kes ainult oma sektorit) – see rollijaotus on endalgi segane ja vajab varakult paika panemist.
    Sys Recording 354\_resampled\_mon…
*   **Kaitsevägi** kui põhipartner: eeldus on, et nad saavad **ligipääsu PPA süsteemile/pildile**, mitte “tagauksega otse sensoritesse” (ja tuleb otsustada, mis on rahuaja vs kriisiaja üleandmine/kasutus).
    Tannar 121225 Recording 355\_res…
    Tannar 121225 Recording 355\_res…
*   **Muud julgeoleku- ja riigiasutused** (mainitud): KAPO, “VLA-d” jm struktuuriüksused sisendite andjatena.
    Tannar 121225 Recording 355\_res…
*   **Kriitilised objektid / ETOD / taristuomanikud**: mõte on, et nad võivad lisada oma sensoreid (nt tehas Viljandis), aga siis peab olema standard/reegel, kuidas nad “ökosüsteemi” liidestuvad.
    Tannar 121225 Recording 355\_res…
*   **Sektori-andmeomanikud/loaregistrid** (mainitud kasutusloos): Maksu- ja Tolliamet (registreeritud droon), Transpordiamet (load/õigus lennata), lisaks Keskkonnaamet ja Kliimaministeerium kui “andmed, mida ette söödetakse”.
    Tannar 121225 Recording 355\_res…
    Tannar 121225 Recording 355\_res…
*   **Elering** näitena “anname kasutaja ja nad näevad oma ringi/ala” – ehk tuleb arvestada “vaatleja” tüüpi väliskasutajatega.
    Tannar 121225 Recording 355\_res…
*   **Partnerid/teostajad**: CGI on nimetatud partnerina, kes tunneb asutusi/inimesi ja kellega suhtlus peab jooksma nii, et PPA ei jää infost välja.
    Tannar 121225 Recording 355\_res…
    Samuti käib läbi SMIT kui võimalik teenuse/teostuse kanal, koos väga realistlike hanke-/hinna-ootustega.
    Tannar 121225 Recording 355\_res…

Liidestused ja andmeallikad, mida planeerida
--------------------------------------------

*   **Sensorid → platvorm**: mitme tootja RF/radar/akustika/kaamera + (potentsiaalselt) kaitseväe sensorid. Arhitektuuri kriitiline koht on, et kaitseväe andmeid tuleb **maskida/hägustada** ja kuvada pigem “mõjualana” kui “täpsete sensoripositsioonidena”.
    Tannar 121225 Recording 355\_res…
    Tannar 121225 Recording 355\_res…
*   **Registrid/loainfo → operatiivpilt**: kasutusloos on vajadus klikata droonile ja näha “kas on lubatud / kes vastutab / kontakt” (MTA reg, Transpordiamet või PPA luba jne).
    Tannar 121225 Recording 355\_res…
    Tannar 121225 Recording 355\_res…
    Samas mainitakse otse, et see võiks minna “X-teega”/riikliku liidestuse kaudu ja autentimine peaks olema tugev.
    Tannar 121225 Recording 355\_res…
*   **Patrullide asukoht**: loogika eeldab, et juhtimiskeskus teab patrullide asukohti (KILP/battle-management tüüpi lahendus “kilp” on mainitud) ja saab valida lähima ning saata välja.
    Tannar 121225 Recording 355\_res…
    Tannar 121225 Recording 355\_res…
*   **Teavitused/alert**: “piiksuma hakkab kui droon on lähedal” – seda nähakse kas veebivaate + SMS/alertina või ka eraldi kerge mobiilirakendusena, mis saadab keskserverile asukoha.
    Tannar 121225 Recording 355\_res…
    Tannar 121225 Recording 355\_res…
*   **Autentimine ja ligipääs**: rõhk on lihtsal kasutusel, aga tugeval sisselogimisel (ID-kaart jne) ning rollipõhistel õigustel (“kes mida näeb”).
    Tannar 121225 Recording 355\_res…
    Tannar 121225 Recording 355\_res…

“Varjatud” tehnilised riskid, mida transkriptsioon rõhutab
----------------------------------------------------------

*   **Kaardikihid võivad lekitada tundlikku infot**: kui joonistad katvusalad/sensorialad kaardile, võib see olla ise juba julgeolekurisk (“kõik politseinikud ei ole head politseinikud”).
    Tannar 121225 Recording 355\_res…
*   **Võrgu ja töökindluse erijuhtumid**: Piirissaar on toodud näiteks, kus andmeside on “läbi õhu” ja fiibri jaotus vajab topeltühendust / dubleerimist.
    Tannar 121225 Recording 355\_res…
*   **Keskne vs jaotatud juhtimine**: tõstatatakse küsimus, kas keskne Tallinn on ainus sõlm või peab Tartu/regionaalne sõlm suutma katkestuse korral oma tükki hallata.
    Tannar 121225 Recording 355\_res…

Juhtimine ja “kes otsustab” (mida kiputakse unustama)
-----------------------------------------------------

*   Tuleb defineerida **teenuse omanik / klient, kellel on viimane sõna**, sest huvigruppe on palju ja muidu jääb asi “kõik arvavad” sohu.
    Ppa\_resampled\_mono\_PRE180\_vadli…
*   Koostöö loogika: arvestada nende vajadustega, kes tulevad ja suudavad kommunikeerida, **aga mitte lasta põhikontseptsioonil laiali vajuda** (kohandused pigem kaardikihtide/ikonite tasemel).
    Tannar 121225 Recording 355\_res…
    Tannar 121225 Recording 355\_res…
*   Vajalik on **peakasutaja / vahelüli** (operatiiv + IT), kes hoiab nõuded, suhtluse ja arenduse “ühe mõistusega reas”.
    Tannar 121225 Recording 355\_res…
    Ppa\_resampled\_mono\_PRE180\_vadli…

Hanke- ja arendusstrateegia nüansid
-----------------------------------

*   Hange vajab ajajoont, sest hanketaotlused ja alusdokumendid tahavad varasemat sisendit, kui intuitiivselt tundub.
    Tannar yld\_resampled\_mono\_PRE18…
*   Korduvalt tuleb läbi **litsents vs koodi omamine** ja vältida “kinniseid” lahendusi/lock-ini.
    Tannar 121225 Recording 355\_res…
    H1\_resampled\_mono\_PRE180\_vadlig…
*   Üks (ideeline) suund, mida mainitakse: teha platvorm/standard nii avatud, et sellest võiks tekkida isegi laiem (Euroopa) korduskasutus — aga rõhk on, et “kinniseid asju” ei tohi sisse lubada.
    H1\_resampled\_mono\_PRE180\_vadlig…

Kui seda nüüd maandada praktiliseks tööks: transkriptsioonide järgi on kõige suurem “pimeala” tavaliselt **(1) kes on tegelik üleriigiline operaator/omanik, (2) millised registri- ja patrullisüsteemi liidestused on MVP-s kohustuslikud, (3) kuidas tundlikkust (KV andmed + katvusalad) kuvada nii, et sellest ei saaks vastasele kasutusjuhend.**

## Prompt:
create a requirements catalog based on all

## Response:
Thought for 9m 37s

Below is a normalized **Requirements Catalog** extracted from the attached transcript files. I’ve rewritten “meeting-speech” into **testable “shall/should” requirements**, and I’ve kept **traceability back to file + line ranges**. Where the transcripts contradict each other, I flag it as an **open issue** instead of inventing certainty.

### File legend (transcripts)

*   **PPA** = `Ppa_resampled_mono_PRE180_vadlight_20251214_013058.txt`
*   **SYS** = `Sys Recording 354_resampled_mono_PRE180_vadlight_20251214_014137.txt`
*   **TAN** = `Tannar 121225 Recording 355_resampled_mono_PRE180_vadlight_20251214_015542.txt`
*   **H1** = `H1_resampled_mono_PRE180_vadlight_20251214_012557.txt`
*   **H2** = `H2_resampled_mono_PRE180_vadlight_20251214_012858.txt`
*   **YLD** = `Tannar yld_resampled_mono_PRE180_vadlight_20251214_022214.txt`

* * *

Scope & Objectives
------------------

**CD-BG-REQ-001 (MUST)** — Provide a single integrated operational picture that can combine multiple counter-UAS / drone-detection systems into one common solution (avoid separate vendor UIs).

*   Verification: Demo: connect at least two distinct sensor/system feeds and show them in one common UI and common alerting/track list.
*   Source: PPA:142-147; SYS:108

**CD-BG-REQ-002 (MUST)** — Support nationwide / state-wide use (not just a local pilot) and enable cross-agency use where legally permitted (PPA + defence organisations).

*   Verification: Review: architecture + access model documents cover multi-organisation users; Demo: at least one external org role can be created and limited correctly.
*   Source: PPA:109-112

**CD-BG-REQ-003 (MUST)** — By end of 2027, enable coverage of the entire eastern border with sensors (system must be capable of ingesting and presenting that scale).

*   Verification: Planning verification: sensor onboarding + UI can represent full border segments; Load test / simulation shows system can handle planned sensor count.
*   Source: TAN:95-97

* * *

Operations & MVP
----------------

**CD-BG-REQ-048 (MUST)** — MVP/prototype priority: ensure end-to-end signal/data flow works reliably (sensor → network → server → UI) before optimising advanced features.

*   Verification: Prototype acceptance: at least one real/simulated sensor feed produces consistent events/tracks visible in UI with no manual intervention.
*   Source: TAN:95-96

* * *

Operations & Roles
------------------

**CD-BG-REQ-004 (MUST)** — Define and implement an 'over-Estonia' monitoring responsibility model (who watches/controls the national picture when major centres are unmanned).

*   Verification: Design review: documented CONOPS identifies the operator roles, duty stations and fallback arrangements; accepted by stakeholders.
*   Source: SYS:323-342

**CD-BG-REQ-005 (MUST)** — Enable handover for Defence Forces operational use when required, via the PPA system (avoid 'backdoor direct access to sensors' as the default).

*   Verification: Demo: a Defence role can log in and use an operational view; governance doc describes sensor access rules and handover triggers.
*   Source: TAN:148-153

**CD-BG-REQ-006 (SHOULD)** — Support external 'viewer' users for critical infrastructure operators (e.g., Elering duty officer) with restricted area view.

*   Verification: Demo: create an external viewer account restricted to a defined 'ring/area' and verify access boundaries.
*   Source: TAN:588-590

* * *

Sensing Capability
------------------

**CD-BG-REQ-007 (MUST)** — Support a multi-sensor stack at surveillance positions: RF + radar + acoustic + camera as first-class sensor types.

*   Verification: Demo: system data model and UI can represent each sensor type; prototype ingests at least one of each (or simulated feed) and fuses into one track list.
*   Source: TAN:32-36; H2:32-34

**CD-BG-REQ-008 (SHOULD)** — Cameras, when used, should support object tracking/identification (not only live viewing).

*   Verification: Demo: camera feed can be associated with a detected track and used to confirm/identify; operator workflow documented.
*   Source: TAN:35-36

**CD-BG-REQ-009 (MUST)** — Include Remote ID / Drone ID capability as part of the overall sensing set (especially as part of RF capability).

*   Verification: Demo: show Remote ID fields (where available) in UI and store them with events/tracks.
*   Source: SYS:25; H2:33

**CD-BG-REQ-010 (MUST)** — Explicitly define the target classes/sizes of drones the system must detect (e.g., nano vs larger) and reflect this in sensor requirements.

*   Verification: Requirements review: detection class taxonomy defined and used in technical specs; test plan includes representative targets.
*   Source: H2:24-26

* * *

Countermeasure / Effector
-------------------------

**CD-BG-REQ-011 (SHOULD)** — Prefer targeted/directional countermeasure concepts over omni-directional effects to reduce collateral impact.

*   Verification: Design review: effector integration spec supports directional targeting; if omni capability exists, it is constrained by policy and UI warns/limits usage.
*   Source: TAN:37-41

**CD-BG-REQ-012 (MUST)** — Avoid placing critical countermeasure/takeover capability directly at the border edge; it must be located so it is not lost during position abandonment.

*   Verification: Architecture review: takeover and critical nodes are not located at border edge; resilience plan includes relocation/fallback sites.
*   Source: SYS:358-364; TAN:38

* * *

Integration & Openness
----------------------

**CD-BG-REQ-013 (MUST)** — Procure/integrate only systems that can be integrated (avoid closed systems that are hard to integrate, e.g., AeroScope-type closed products).

*   Verification: Procurement verification: integration/API requirements included in technical specs; vendor provides tested integration method in prototype.
*   Source: H2:5; H1:12

**CD-BG-REQ-014 (MUST)** — Use standardised interfaces (standard requests/responses) and a modular approach so different sensors can plug into the same platform.

*   Verification: Design review: published internal API/data model; demo onboarding of at least two different sensor types through the same integration framework.
*   Source: H1:7-12; PPA:109-111

**CD-BG-REQ-015 (SHOULD)** — UI should surface only essential/operationally relevant information (avoid dumping every vendor detail).

*   Verification: UX review: operator screens show a curated set of fields; demo that advanced details are available but not forced.
*   Source: H2:2

* * *

Integration & Middleware
------------------------

**CD-BG-REQ-041 (MUST)** — Define and implement an integration/middleware layer ('vahetarkvara') where needed to connect sensors and external systems into the common platform.

*   Verification: Design review: middleware responsibilities documented; prototype includes at least one connector implemented through the middleware.
*   Source: H2:16-17; PPA:120

* * *

External Interfaces
-------------------

**CD-BG-REQ-022 (SHOULD)** — Integrate with location/dispatch systems used by patrols (e.g., KILP / patrol tablet systems) to support 'nearest patrol' response workflows.

*   Verification: Integration test: ingest patrol locations (even as simulated feed) and compute nearest patrol to an event; UI supports dispatch/notification.
*   Source: TAN:205-206; TAN:233-236

**CD-BG-REQ-023 (SHOULD)** — Support integration with national registries/authorisations relevant to drone legitimacy (e.g., Transport Administration, etc.) via standard gov integration (X-road).

*   Verification: Design review: data fields and query flows documented; demo stub calls via an integration layer; privacy review approves minimised data retrieval.
*   Source: TAN:581-585

* * *

Networking & Deployment
-----------------------

**CD-BG-REQ-016 (MUST)** — Sensors are assumed to be primarily connected via wired network (network cable/fiber); sensor-to-sensor radio mesh is not the baseline approach.

*   Verification: Architecture review: field connectivity plan uses wired links by default; exception cases documented.
*   Source: TAN:192-195

**CD-BG-REQ-017 (SHOULD)** — Handle special cases where wired connectivity is not available (e.g., Piirissaar uses over-the-air links) and plan redundant connectivity (double links) where needed.

*   Verification: Demo: a site can be configured for non-fiber backhaul; resilience test demonstrates failover between two links at a site.
*   Source: TAN:198-202

**CD-BG-REQ-018 (MUST)** — Support secure connectivity across different networks, including tunnelling/segmented network access to reach devices.

*   Verification: Security review: documented network segmentation + secure tunnels; demo connectivity to a sensor feed across separated networks.
*   Source: PPA:120

* * *

Architecture & Resilience
-------------------------

**CD-BG-REQ-019 (MUST)** — Provide a central base server / aggregation node on a closed network where sensor information is fused/aggregated.

*   Verification: Design review: architecture identifies base server(s) and closed network boundaries; prototype deploys central aggregation.
*   Source: TAN:154-156

**CD-BG-REQ-020 (MUST)** — Provide role-based visibility: local units (e.g., Narva) can see only their area; central users can see broader/all areas.

*   Verification: Demo: RBAC rules restrict visibility by geography and role; verification by test accounts in multiple roles.
*   Source: TAN:160-161

**CD-BG-REQ-021 (MUST)** — Provide continuity through backup/secondary server capability (varuserver) for crisis/war relocation scenarios.

*   Verification: Design review: documented backup server strategy; failover test shows continued operation using backup node.
*   Source: YLD:433; SYS:356-364

**CD-BG-REQ-022 (MUST)** — Support multi-radar systems that require fibre connectivity and shared compute (paired/clustered radars producing a combined output).

*   Verification: Prototype: demonstrate ingestion of either combined radar track output or multiple radar feeds with fusion; infrastructure plan includes fibre + compute.
*   Source: TAN:545-548

* * *

UX & Access
-----------

**CD-BG-REQ-023 (MUST)** — Provide a web-based user interface as the primary mode of use (avoid client installs as baseline).

*   Verification: Demo: operator can use the system via a browser without installing a thick client; deployment guide contains only browser prerequisites.
*   Source: TAN:217-218

**CD-BG-REQ-024 (SHOULD)** — Support strong authentication (prefer ID-card or equivalent) and minimise password-only access; integrate with national auth patterns where feasible.

*   Verification: Security review: authentication supports strong method; demo ID-card or equivalent flow in test environment (or documented integration plan).
*   Source: TAN:583-585

**CD-BG-REQ-025 (MUST)** — Support filtered map/coverage views such as showing 'detection areas' (e.g., green zones) for situational awareness and planning.

*   Verification: Demo: map view can display configurable coverage/detection polygons; users can toggle layers based on permission.
*   Source: TAN:236-242

**CD-BG-REQ-026 (MUST)** — Enable alerting workflows (e.g., notify a user/patrol when a drone is nearby) tied to operator roles and/or patrol locations.

*   Verification: Demo: create an alert rule and trigger it from simulated detection; verify notification delivered to configured user channel.
*   Source: TAN:233-236; TAN:246

* * *

Security & Data Sensitivity
---------------------------

**CD-BG-REQ-027 (MUST)** — Implement strict access controls and avoid leaking sensitive sensor details via map layers (coverage itself may be sensitive).

*   Verification: Security review: sensitivity classification of layers; demo: restricted layers not visible to unauthorised users; audit logs exist.
*   Source: TAN:236-240

**CD-BG-REQ-028 (MUST)** — Support masking/abstraction of Defence Forces sensor data for non-authorised users (e.g., show coverage area rather than sensor source/position).

*   Verification: Demo: KV-origin feeds can be presented as abstracted coverage; verify non-authorised users cannot infer sensor origin; authorised users can access more detail per policy.
*   Source: TAN:238-240

* * *

Legal & Compliance
------------------

**CD-BG-REQ-029 (MUST)** — Design for compliance with personal data processing requirements and 'infosüsteemi pidamise kord' (information system operation requirements).

*   Verification: Compliance review: DPIA/PIA prepared; operating procedure documents drafted and approved.
*   Source: TAN:554-556

**CD-BG-REQ-030 (MUST)** — Implement traceability/auditability: who accessed what and on what legal basis, especially for cross-organisation access.

*   Verification: Demo: audit log records user, time, action, and dataset; governance documents define legal basis per organisation/role.
*   Source: PPA:111-112

* * *

Data & Hosting
--------------

**CD-BG-REQ-036 (MUST)** — Sensor outputs (e.g., 'drooniradari pilt') should be ingested into PPA-owned infrastructure ('our server'), not only vendor-controlled endpoints.

*   Verification: Demo: data flows into a PPA-controlled environment; architecture documents show data residency and control boundaries.
*   Source: SYS:477-486

* * *

Network Security
----------------

**CD-BG-REQ-043 (MUST)** — Prefer operation in closed/internal networks; if any components must traverse public networks, the design must explicitly address security controls and approvals.

*   Verification: Security review: network diagrams show no unnecessary public exposure; penetration test or config review of any public-facing endpoints.
*   Source: SYS:477-478

* * *

Government IT Coordination
--------------------------

**CD-BG-REQ-044 (SHOULD)** — Coordinate addressing/connectivity with government network operators (e.g., MIG addressing / SMIT network connectivity) as part of deployment.

*   Verification: Implementation evidence: network request tickets and addressing plan exist; connectivity tested in target environment.
*   Source: SYS:488

* * *

Deployment Platform
-------------------

**CD-BG-REQ-042 (SHOULD)** — Support deployment on Linux-based infrastructure using containers/VMs (e.g., Docker, Ubuntu VMs) to align with existing practice.

*   Verification: Prototype deployment: components run on Linux VM(s) and/or Docker containers; operational runbook documents deployment steps.
*   Source: PPA:117-118

* * *

Procurement & Ownership
-----------------------

**CD-BG-REQ-031 (MUST)** — Avoid single-vendor dependency: ensure continuity if a supplier disappears; prefer arrangements where PPA/state can continue development/operations.

*   Verification: Procurement verification: contract includes source code access/escrow or ownership; operational runbooks enable third-party maintenance.
*   Source: TAN:452-456; H1:9

**CD-BG-REQ-032 (MUST)** — Account for licensing/overhead costs at scale (e.g., per-radar/per-module licenses can dominate) and capture this in TCO.

*   Verification: TCO review: licensing model documented with scaling scenarios; procurement decision includes costed 2027-scale scenario.
*   Source: SYS:28-31; SYS:485-486

**CD-BG-REQ-033 (SHOULD)** — Plan for implementation via appropriate national IT delivery channels (e.g., SMIT) and define a 'power user' / service owner role for ongoing operations.

*   Verification: Governance review: service owner + key user roles assigned; delivery model agreed; backlog management process defined.
*   Source: TAN:456-463

* * *

Delivery & Lifecycle
--------------------

**CD-BG-REQ-034 (MUST)** — Follow a staged delivery: analysis → prototype → production product (prototype proves connectivity and integration).

*   Verification: Project plan: milestones and acceptance gates defined; prototype acceptance demonstrates end-to-end feed ingestion + UI.
*   Source: PPA:122-123; PPA:140-143

**CD-BG-REQ-035 (MUST)** — Analysis phase must set the scope/scale precisely before building (avoid building without clear problem definition).

*   Verification: Deliverable: approved scope + scale document; requirements baseline established and versioned.
*   Source: PPA:142-143; H1:7

**CD-BG-REQ-047 (MUST)** — Provide a PPA-owned baseline platform to transition from current test versions / temporary setups to an owned solution suitable for production.

*   Verification: Prototype/production plan: migration path from test setup documented; production platform deployed in PPA environment.
*   Source: PPA:133-137

* * *

Requirements Engineering
------------------------

**CD-BG-REQ-045 (MUST)** — For procurement ('hange'), produce a technical description that includes rationale for each key requirement (why it is demanded) to avoid 'specs without purpose'.

*   Verification: Deliverable: technical specification includes requirement rationale section; review meeting confirms shared understanding.
*   Source: H2:22-24

* * *

Definitions
-----------

**CD-BG-REQ-046 (MUST)** — Define key domain terms (e.g., what counts as a 'drone' in this context) to avoid ambiguity in requirements and test cases.

*   Verification: Deliverable: glossary approved; test cases reference glossary categories.
*   Source: PPA:97

* * *

Scalability
-----------

**CD-BG-REQ-037 (SHOULD)** — Support the planned order-of-magnitude of devices discussed: ~90 mobile RF sensors, ~90 radar positions, and ~200+ Remote ID / Drone ID related elements.

*   Verification: Load test: simulate the planned device counts and demonstrate stable ingestion, storage, and UI responsiveness.
*   Source: SYS:12-26

* * *

Open Issues to Resolve
----------------------

**CD-BG-REQ-038 (SHOULD)** — Clarify whether stationary cameras are in scope (one thread states 'cameras will not be stationary'); reconcile with multi-sensor stack vision.

*   Verification: Decision record: stationary vs mobile camera policy agreed; requirements updated accordingly.
*   Source: SYS:129; TAN:32-36

* * *

If you want to operationalize this further, the next clean step is turning each requirement into: **(1) acceptance test cases**, **(2) a traceability matrix**, and **(3) an MVP cut** (what must be in prototype vs 2027 end-state).



---
Powered by [ChatGPT Exporter](https://www.chatgptexporter.com)