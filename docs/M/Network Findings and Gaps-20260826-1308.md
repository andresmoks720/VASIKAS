# Network Findings and Gaps

**User:** Anonymous  
**Created:** 8/6/2026 13:20:57  
**Updated:** 8/14/2026 15:12:20  
**Exported:** 8/26/2026 13:08:04  
**Link:** [https://chatgpt.com/g/g-p-6a796fe178f08191965b7cfdbb567889/c/6a745fe5-3b88-83eb-90a6-41c135438546](https://chatgpt.com/g/g-p-6a796fe178f08191965b7cfdbb567889/c/6a745fe5-3b88-83eb-90a6-41c135438546)  

## Prompt:
8/6/2026, 1:20:55 PM

based on this, figure out what we know about networks, what is unknown, what needs to be found out.

[Attachment: Raudsepp k6rvalt Recording 571.docx]

[Attachment: Erik vork Recording 572.docx]

[Attachment: Smit1 Recording 567.docx]

## Response:
8/6/2026, 1:20:56 PM

> **Analüüsides Wordi dokumentide sisu ja märksõnu**
>
>
> **Analüüsis Wordi dokumentide sisu ja märksõnu**
>
> 
>
> Juurdles 24s

Across the three transcripts, a reasonably consistent picture emerges. There are also a number of contradictions and "I think" statements, so I've separated **known**, **probable**, and **unknown**.

## What we know with reasonable confidence

### 1. There are multiple distinct operational networks

This is probably the single biggest finding.

The discussions consistently refer to several separate environments rather than one unified network:

| Network | Purpose | Status |
|---------|---------|--------|
| **SMIT network** | General IT / user access / infrastructure | Exists |
| **Idaseire network** | Eastern border surveillance (radars + surveillance cameras) | Exists |
| **Turvavõrk** | Security network used by Milestone and other security systems | Exists |
| **Smartech network** | Appears dedicated mainly to battery/portable cameras | Exists |
| **Bosch / Kuivajõe environment** | Separate Bosch VMS deployment | Exists |

A recurring theme is that people initially assume "everything is SMIT", but during the discussions it becomes clear there are several operational networks that only partially overlap.

---

### 2. SMIT is **not** the owner of everything

Initially the assumption is:

> "SMIT manages everything."

During the interviews this becomes:

- SMIT manages infrastructure in many places.
- Some operational systems belong elsewhere.
- Different groups own different pieces.
- Deployment responsibility depends on which network the system joins.

This changes the deployment model significantly.

---

### 3. Narva surveillance today is fragmented

Current picture appears roughly like:

```
Radar system
      │
      ▼
Idaseire network
      │
      ▼
Mustvee server
      │
      ▼
Narva operators

Camera system
      │
      ▼
Bosch / Kuivajõe
      │
      ▼
Separate operator workstation
```

The operators often work across multiple systems rather than one unified operational picture. This is discussed repeatedly. `Erik vork Recording 572.docx`

---

### 4. Mustvee is an important aggregation point

Mustvee repeatedly appears as:

- central VM/server
- aggregation point
- eastern surveillance infrastructure component

Questions repeatedly revolve around:

- who owns it
- who administers it
- whether Narva traffic flows through it
- what exactly is connected to it

So Mustvee appears to be a major architectural component.

---

### 5. Bosch system is still largely independent

Current understanding:

- Bosch VMS still exists.
- Migration has been discussed for years.
- It is expected to move toward Milestone/turvavõrk.
- But operational integration still appears incomplete.

One interview even says this migration has effectively been "coming next year" for years. `Erik vork Recording 572.docx`

---

### 6. Operator experience is fragmented

Several places mention operators using:

- multiple computers
- multiple programs
- multiple networks

The desired end state is:

> one operator window
> one integrated operational picture

This aligns well with the Anduril/Lattice concept.

---

### 7. Initial Lattice deployment assumptions

For the pilot:

- sensor data first comes mainly from **turvavõrk**
- adapters bridge existing systems
- no immediate sensor replacement
- first deployment is VM-based
- later deployments may move closer to Narva/Luhamaa

---

# What is probable but not yet confirmed

## Smartech network

Appears to contain mostly:

- portable cameras
- battery cameras

But this is never stated authoritatively.

---

## Idaseire network

Likely contains:

- radars
- thermal cameras
- surveillance cameras

Possibly:

- PTZ control

Not fully confirmed.

---

## Turvavõrk

Appears to be:

- security platform
- Milestone
- camera systems
- alarms

But exact boundaries remain fuzzy.

---

## What "Mustsaare" / "Mustajõe" actually is

Several names appear:

- Mustvee
- Mustsaare
- Mustajõe

They are likely different things:

- one server
- one protocol
- one company
- one integration platform

Nobody seems completely certain.

---

# Unknowns that still need answers

These are the biggest architectural gaps.

---

## 1. Complete network topology

Nobody draws:

```
Network A
    |
Firewall
    |
Network B
    |
Router
    |
VPN
```

Need:

- Layer 3 topology
- routing
- trust boundaries
- firewall ownership

---

## 2. IP ownership

Need:

- IP ranges
- VLANs
- routing domains
- VPNs
- NAT

---

## 3. Firewall ownership

Who owns firewall changes?

Possible candidates mentioned:

- SMIT
- Plato
- local administrators

Still unclear.

---

## 4. Server ownership matrix

Need table like:

| Server | Owner | Admin | VM owner | Hardware owner |
|---------|-------|--------|-----------|----------------|

Currently nobody can answer confidently.

---

## 5. Authentication domains

Unknown:

- AD?
- LDAP?
- separate accounts?
- SSO?
- local users?

---

## 6. How traffic actually flows

Need data-flow diagrams:

```
Radar
 ↓
Server
 ↓
Integration
 ↓
Operator
```

and

```
Camera
 ↓
Bosch
 ↓
Operator
```

Currently inferred only.

---

## 7. Bandwidth

Discussed several times:

- today small
- future potentially huge
- video dominates bandwidth

No measurements.

Need:

- Mbps today
- projected growth
- WAN bottlenecks

---

## 8. Latency requirements

Unknown:

- acceptable delay
- operator requirements
- replication timing

---

## 9. Network segmentation policy

Unknown:

Can a new VM be placed in:

- SMIT network?
- turvavõrk?
- idaseire?
- separate subnet?

Very important.

---

## 10. Security classification

Need:

- what may cross between

```
AK
SMIT
turvavõrk
idaseire
KV
```

and under what rules.

---

## 11. Existing integration interfaces

Need inventory:

- REST
- MQTT
- ONVIF
- Bosch SDK
- Milestone SDK
- custom protocols

---

## 12. Network ownership map

Repeatedly people ask:

> "Who do I actually talk to?"

This suggests organizational ownership is not documented.

Need matrix:

| Area | Owner | Technical contact |
|-------|--------------------|----------------|
| SMIT network | ? | ? |
| Turvavõrk | ? | ? |
| Idaseire | ? | ? |
| Bosch | ? | ? |
| Smartech | ? | ? |
| Mustvee | ? | ? |

---

# Questions that should be answered next

I would treat these as the highest-value discovery questions:

1. Draw every network involved and how they interconnect.
2. Which systems are routable between each network?
3. Where are the firewall boundaries?
4. Which servers exist in each network?
5. Who owns/administers each server?
6. Which protocols are used between systems?
7. Where can new Anduril Nodes legally be deployed?
8. What network changes are required for the pilot?
9. Which sensor systems already expose usable APIs/streams?
10. Which integrations already exist between Bosch, Milestone, Mustvee, idaseire and turvavõrk-and which are purely manual/operator-level?

### One alternative view

The transcripts reflect exploratory conversations rather than authoritative design reviews. Several statements are explicitly speculative ("I think", "as I understand it"), so this should be treated as a hypothesis map. The next step should be validating it against network diagrams, CMDB/documentation, and the actual network owners before making architectural decisions.

## Prompt:
8/6/2026, 8:26:53 PM

No. KV (kaitseväe) võrk would be connected to SMIT over internet (some vpn i guess)
Turvavõrk is a vpn under PPA control.  has some holes to access from regular SMIT netwrok.
regular smit network - the regular network people at PPA work at, all the local intranet + seemless connection to outside internet.

Mustassaare is currently independent but will be switched to Turvavõrk and Milestone in the future (so we put it under that bucket on graph). 

Idaseirevõrk I think is under smit control (check the sources) but a secure subnet, different from smit network.
Smartek net - (was it under smit?)

look what you can find out

[Attachment: Mihkel smit liiga palju vasikas Recording 574.docx]

[Attachment: Esko Recording 573.docx]

## Response:
8/6/2026, 8:26:57 PM

I’ll verify the ownership and routing claims against all five transcripts, then separate confirmed facts from still-ambiguous points.

> **Täpsustades võrgu pilti**
>
> Eristan kindlad faktid oletustest: allikad toetavad eraldi KV- ja Smarteki-võrku, KV ühendust Ida seirega ning Smarteki seadmete võimalikku SMITi haldust. VPN-i, serveriomandi ja Plado rolli kohta jääb tõendus praegu ebapiisavaks.
>
> **Täpsustas võrgu pilti**
>
> 
>
> **Täpsustav allikakontroll Smarteki ja seirevõrgu kohta**
>
> 
>
> Juurdles 47s

Your model is mostly right, with one important correction: **the standalone system planned for migration to Turvavõrk/Milestone is Kuivajõe/Bosch, not Mustassaare.**

## Revised network model

```text
Public Internet
│
├── Regular SMIT / PPA network
│   ├── User workstations
│   ├── PPA intranet and ordinary IT services
│   ├── Internet access
│   ├── Proposed central Lattice Node / web UI
│   └── Controlled connections to other networks
│
├── PPA Turvavõrk
│   ├── PPA-controlled virtual/security network
│   ├── Milestone
│   ├── Access-control and security systems
│   ├── Drone-detection sensors
│   └── Selected firewall/routing openings from SMIT network
│
├── SMIT Idaseirevõrk
│   ├── Separate secure SMIT network/VPN
│   ├── Border-surveillance radars
│   ├── Large surveillance/thermal cameras
│   ├── Mustvee infrastructure
│   └── Mustassaare radar-integration software
│
├── Smartek network
│   ├── Separate network
│   └── Mainly battery-powered / portable cameras
│
└── Kuivajõe / Bosch network - current state
    ├── Independent local network and Bosch VMS
    └── Planned migration:
        └── Turvavõrk + Milestone
```

Separately:

```text
Kaitseväe network
        │
        │ protected inter-agency connection
        │ exact VPN/router/Internet implementation TBD
        ▼
PPA / SMIT-side infrastructure or Lattice Node
```

## 1. Regular SMIT network

Your description is consistent with the material:

- this is the network ordinary PPA users work from;
- the proposed Lattice user interface would be opened to users here;
- data from Turvavõrk would be bridged or forwarded to a Node hosted on the SMIT side.

The transcripts explicitly discuss data arriving from Turvavõrk through routing and firewall openings, while users access the web UI from the SMIT network. `Smit1 Recording 567.docx`

Therefore, on the diagram this should be the **ordinary user and central-services network**, not a security sensor network.

## 2. Turvavõrk

This is strongly supported as:

- a **PPA internal virtual network**;
- separate from regular SMIT;
- reachable only through selected routing/firewall openings;
- the location of Milestone and several security-related systems.

The pilot plan explicitly says Turvavõrk data would be sent through an adapter to a Node on the SMIT side, while C2 access would be opened from the SMIT/PPA network. `Mihkel smit liiga palju vasikas Recording 574.docx`

The Esko conversation adds that Turvavõrk includes or is expected to include:

- Milestone;
- access-control/security systems;
- newer drone sensors;
- some mobile systems or “carts”.

`Esko Recording 573.docx`

So your interpretation is good:

> **Turvavõrk is a PPA-controlled security VPN/network with controlled holes toward regular SMIT.**

Exact division between **PPA ownership** and **SMIT infrastructure operation** is still not fully established.

## 3. Idaseirevõrk

The strongest source wording is:

- “SMIT-i idaseirevõrk”;
- a network separate from ordinary SMIT;
- a separate system or gateway is required to access it from regular SMIT.

`Esko Recording 573.docx`

Another conversation describes the surveillance network as an **“eraldi SMIT-i all VPN”**-a separate VPN under SMIT-and confirms that a dedicated surveillance-network administrator exists. `Smit1 Recording 567.docx`

Therefore, the best-supported conclusion is:

> **Idaseirevõrk is a separate secure network/VPN under SMIT’s infrastructure or network-management domain.**

However, management is layered:

- SMIT probably manages network infrastructure, connectivity and hosting;
- PPA may own or administer some application servers;
- Mustvee servers were described as possibly PPA-owned and PPA-managed, although this statement was itself second-hand. `Mihkel smit liiga palju vasikas Recording 574.docx`

So avoid labeling the whole thing simply “SMIT-owned.” Better:

```text
Idaseirevõrk
Network/infrastructure administration: probably SMIT
Operational systems and some servers: PPA / mixed responsibility
```

## 4. Mustassaare versus Kuivajõe

This needs correction in the graph.

### Mustassaare

The Esko interview explicitly identifies Mustassaare as:

- a company;
- the developer of software running the radar system;
- the contractor currently modifying that platform;
- primarily responsible for radar integration.

`Esko Recording 573.docx`

Later it is stated more directly:

> Mustassaare is purely radar integration, while the other system contains cameras and motion sensors.

`Esko Recording 573.docx`

Therefore **Mustassaare belongs logically under the Idaseire/radar-system bucket**, even though people informally call the whole environment “Mustassaare.”

### Kuivajõe/Bosch

Kuivajõe is the system currently running:

- in an independent local environment;
- using Bosch VMS;
- on separate operator workstations;
- with a long-planned move to Turvavõrk and Milestone.

The transcripts explicitly call Kuivajõe a completely separate network. `Esko Recording 573.docx`

The migration discussion says Bosch functionality is intended to move to Milestone, including camera-control commands. `Esko Recording 573.docx`

Therefore the graph should show:

```text
Current:
Kuivajõe/Bosch standalone network

Future:
Kuivajõe devices → Turvavõrk → Milestone
```

Not:

```text
Mustassaare → Turvavõrk
```

There may still be some cameras associated with the broader Mustassaare/Narva operator environment, but the **Mustassaare radar integration itself is not shown as being migrated to Milestone**.

## 5. Smartek network

What the sources support:

- it is a separate network;
- it is not Idaseirevõrk;
- it mostly or exclusively contains battery-powered/portable cameras;
- Plado appears to be the relevant operational or technical contact;
- the servers were described as SMIT-owned.

`Raudsepp k6rvalt Recording 571.docx`

Therefore:

> **Smartek is probably hosted or infrastructure-managed by SMIT, but the transcripts do not establish that SMIT fully controls the service.**

Confidence assessment:

| Claim | Confidence |
|---|---:|
| Smartek is separate from regular SMIT | High |
| Smartek is separate from Idaseire | High |
| It contains portable/battery cameras | High |
| Its servers are SMIT-owned | Medium |
| SMIT administers the entire network | Low-medium |
| Plado is the responsible operational contact | Medium-high |

The ambiguity exists because the recording mostly captures one side of a telephone conversation. The sentence about SMIT-owned servers appears to refer to Smartek, but the missing answers make the reference less than definitive.

For the diagram, use:

```text
Smartek camera network
Infrastructure/servers: probably SMIT
Operational owner/contact: PPA / Plado
Exact governance: confirm
```

## 6. Kaitseväe network connection

The recordings establish that:

- Kaitsevägi has its own network and its own Node;
- PPA and Kaitsevägi intend to exchange AK-level surveillance information;
- PPA radar data already appears to be sent from Idaseire toward the Kaitsevägi network;
- some router/terminal arrangement exists on the SMIT side.

`Smit1 Recording 567.docx`

The source mentions a router and terminal but also says there is no normal access from the Tallinn SMIT network into that environment. `Raudsepp k6rvalt Recording 571.docx`

What the recordings **do not establish** is whether the underlying transport is:

- public Internet plus site-to-site VPN;
- Riigivõrk or another government WAN;
- a dedicated encrypted tunnel;
- a dedicated line with VPN layered over it.

Therefore, on the graph I would currently write:

```text
KV network
   │
   └── Existing protected inter-agency link
       Transport: likely routed VPN/router connection, confirm
```

Your Internet/VPN interpretation may be correct, but it should remain an assumption until the actual network owner confirms it.

## Current conclusions

| Network | Administrative conclusion |
|---|---|
| Regular SMIT | SMIT-operated ordinary PPA user/service network |
| Turvavõrk | PPA-controlled security network/VPN; selected SMIT access |
| Idaseirevõrk | Separate secure SMIT-managed VPN/subnet; application responsibility mixed |
| Smartek | Separate portable-camera network; probably SMIT-hosted, governance unclear |
| Kuivajõe/Bosch | Currently standalone; planned migration to Turvavõrk/Milestone |
| Mustassaare | Vendor/software and radar-integration environment within the Idaseire context |
| Kaitseväe | Separate external network connected through a protected inter-agency link |

## Remaining questions worth asking directly

1. Is Idaseirevõrk formally a VLAN, VRF, site-to-site VPN, or independent routed network?
2. Who owns its firewalls and authorizes new hosts?
3. Are Mustvee servers PPA-owned but hosted in SMIT infrastructure?
4. Who owns the Smartek IP space, routers, servers and firewall rules?
5. Is the KV connection public-Internet VPN, government WAN, or dedicated transport?
6. Does regular SMIT have routed access to Idaseire, or only dedicated terminals/proxies?
7. Will Mustassaare radar integration remain independent after Kuivajõe moves to Milestone?

**Potential pitfall:** grouping systems only by their future VMS platform can hide the actual network boundary. Kuivajõe may move to Milestone while radar integration remains in Idaseire/Mustassaare, leaving operators with two networks even after the migration.

## Prompt:
8/10/2026, 9:31:26 AM

Mille all on Mustvee võrk? Kui lahus see kõigest?

## Response:
8/10/2026, 9:31:27 AM

Praeguste allikate põhjal **ei paista “Mustvee võrk” olevat eraldi võrk**. Mustvee näib olevat **Idaseirevõrgu üks oluline füüsiline/serveripoolne sõlm või asukoht**.

Kõige tõenäolisem mudel on:

```text
SMIT
└── Idaseirevõrk
    ├── Mustvee serverid / backend
    │   └── Mustassaare radar-integratsiooni tarkvara
    ├── Narva radarid
    ├── muud radarid / seirekaamerad
    └── operaatorite ligipääsud
```

### Miks ma nii järeldan

Ühes vestluses kirjeldatakse **Idaseirevõrku kui eraldi SMIT-i all olevat VPN-i/seirevõrku**. See ei ole tavaline SMIT-i kasutajavõrk. `Smit1 Recording 567.docx`

Teises vestluses räägitakse Idaseirevõrgust ja Mustveest ühe süsteemi kontekstis: **Narva pilt jookseb läbi Mustvee ja tagasi Narva**, mitte nii, et Mustvee oleks veel eraldi kuues võrk. `Raudsepp k6rvalt Recording 571.docx`

Mihkli vestluses öeldakse Mustvee kohta, et seal on serverid ja **“seal võrgus on radarid”**; samas eelnev jutt käib konkreetselt Idaseirevõrgust. `Mihkel smit liiga palju vasikas Recording 574.docx`

Kõige otsesem võrkude loetelu Esko vestluses on:

> tavaline SMIT-i võrk → **SMIT-i idaseirevõrk** → Kuivajõe eraldi võrk jne.

Seal ei teki eraldi “Mustvee võrku”. `Esko Recording 573.docx`

### Kui eraldatud see on?

**Tavalisest SMIT-i võrgust üsna tugevalt eraldatud.**

Allikate järgi:

```text
Regular SMIT
     │
     │  EI OLE tavaline routed/pingitav ühendus
     │
     ├── eraldi gateway / terminal / kontrollitud ühendus
     ▼
Idaseirevõrk
     │
     └── Mustvee
```

Esko ütleb üsna selgelt, et tavalisest SMIT-i võrgust Idaseiresse vaatamiseks on vaja **eraldi süsteemi** ja et need ei ole sama võrk. `Esko Recording 573.docx`

Raudsepa vestluses tuleb isegi välja, et Tallinnast tavalisest SMIT-i võrgust **ei paista olevat otsest ligipääsu**, ning räägitakse eraldi ruuterist/terminalist. `Raudsepp k6rvalt Recording 571.docx`

Seega paneksin graafikul praegu:

```text
SMIT infrastructure
│
├── Regular SMIT/PPA network
│
└── Idaseirevõrk  [SECURE / SEPARATE]
    │
    ├── Mustvee server infrastructure
    │   └── Mustassaare radar integration
    │
    └── Border surveillance sensors
```

**Mitte:**

```text
SMIT
├── Idaseirevõrk
└── Mustvee võrk
```

### Üks oluline teadmata asi

Me ei tea veel, kas Idaseirevõrk on tehniliselt:

- VRF,
- site-to-site VPN,
- eraldi VLANide kogum,
- MPLS/riigivõrgu segment,
- või midagi muud.

“SMIT-i all eraldi VPN” on inimese kirjeldus, mitte võrguarhitektuuri dokumentatsioon. Aga **loogilise arhitektuuri jaoks on üsna tugev alus käsitleda Mustveed Idaseirevõrgu sees, mitte eraldi võrguna.**

**Potentsiaalne lõks:** Mustvee serverite **haldus/omand** võib olla PPA käes isegi siis, kui võrk ise on SMIT-i hallatav Idaseirevõrk. Neid kahte ei tasu graafikul üheks “owner” mõisteks kokku tõmmata.

## Prompt:
8/12/2026, 4:18:46 PM

analüüsi, kas nende põhjal saad uut infot või eeldusi, mida kontrollida

[Attachment: Mihkel smit liiga palju vasikas Recording 574.docx]

[Attachment: Erik vork Recording 572.docx]

[Attachment: Teet Recording 578.docx]

[Attachment: Teet2 ja rainer mula Recording 579.docx]

[Attachment: Esko Recording 573.docx]

[Attachment: Raudsepp k6rvalt Recording 571.docx]

## Response:
8/12/2026, 4:18:48 PM

Nendes uutes vestlustes on päris palju uut. Kõige olulisem on, et **Idaseirevõrgu ja Mustvee roll muutub palju konkreetsemaks**: see paistab pigem hajutatud krüpteeritud seirevõrk keskse Mustvee koondumispunktiga, mitte lihtsalt “üks eraldi VPN”.

> **Esitades uusi tõendeid**
>
> Ma keskendun võrgumudelile ning Mustvee, Idasire, Turvavõrgu, Smarteki, Kuivajõe ja K. V. seostele. Kontrollin uusi väiteid eraldi, sest proto­kolli tekstis võib olla kõnetuvastuse ebatäpsusi.
>
> **Esitas uusi tõendeid**
>
> 
>
> **Täpsustades võrgumudelit**
>
> Uus info viitab vastutuse jagunemisele: kohalik IP-võrk kuulub PPA-le, krüpteeritud ühendused ja põhivõrk SMIT-ile. Mustvee serveri haldus näib olevat PPA-l, kuid füüsiline taristu vajab eraldi kinnitamist.
>
> **Täpsustati võrgumudelit**
>
> 
>
> Juurdles 43s

Jah. Nendest uutest vestlustest tuleb mitu olulist täpsustust ja paar varasemat eeldust tuleks nüüd nõrgemaks muuta.

## 1. Mustvee on tõenäoliselt **Idaseire süsteemi keskne koondumispunkt**, mitte lihtsalt üks server

Kõige tugevam uus lause on Teet2 vestluses sisuliselt:

> Mustvee on koht, kuhu „kõik seirepositsioonid saadavad“.

Samuti öeldakse, et just seetõttu oleks Lattice Node'i loogiline alustada Mustveest: seal saab radarivoogu kohapeal peegeldada/multicast'ida, selle asemel et transportida toorvoogu Tallinna. `Teet2 ja rainer mula Recording 579.docx`

Seega praegune hüpotees:

```text
Seirepositsioon A ─┐
Seirepositsioon B ─┤
Seirepositsioon C ─┤
                  ▼
               Mustvee
          keskne backend /
          integratsioonikiht
                  │
          Narva operaatorid
```

**Kontrollida:** kas *kõik* Idaseire positsioonid koonduvad Mustveesse või ainult radarite/Mustassaare süsteemi omad.

---

## 2. Aga võrgu enda topoloogia ei pruugi olla hub-and-spoke

See on oluline vahe.

Teet kirjeldab, et igal radar-/seirepositsioonil on krüptoseade („Uniper“ transkriptsioonis), mis krüpteerib liikluse, kui see läheb kohalikust võrgust välja. Ka vastuvõtvas otsas on vastav seade, mis liikluse lahti teeb. `Teet2 ja rainer mula Recording 579.docx`

See tähendab, et:

```text
Application topology:
sensorid → Mustvee → kasutajad
```

võib olla tõsi, aga:

```text
Network topology:
sensor → Mustvee → kõik muu
```

**ei pruugi olla tõsi.**

Võrk võib tehniliselt olla hajutatud krüpteeritud WAN/overlay, kus Mustvee on ainult rakenduse koondumispunkt.

Seda tasub graafikul eraldi näidata.

---

## 3. Idaseire haldusjaotus muutus palju selgemaks

Teet ütleb sisuliselt:

- krüptitud ühendus / backbone on **SMIT-i käes**;
- seirepositsiooni kohalikku subnetti „majandame ise“;
- kohaliku IP-vahemiku piires saavad nad ise seadmeid paigutada;
- iga kohalik subnet on krüptoseadmega eraldatud. `Teet2 ja rainer mula Recording 579.docx`

See viitab üsna konkreetselt sellisele vastutuse jaotusele:

```text
SMIT
└── WAN / transport / crypto boundary / connectivity

PPA seiretehnika
└── local site subnet
    ├── radar
    ├── cameras
    ├── local equipment
    └── local IP management
```

See on **palju parem mudel** kui lihtsalt „Idaseirevõrk = SMIT-i võrk“.

### Kontrollida

Kes täpselt:

1. annab Mustvees uuele hostile IP;
2. lubab hosti subnetti;
3. teeb firewall/routing muudatused;
4. konfigureerib krüptoseadmed/tunneli;
5. adminnib VM-i või füüsilist serverit.

Need võivad olla kolm eri inimest/organisatsiooni.

---

## 4. Mustvee serverite haldus paistab olevat PPA poolel

Siin on nüüd vähemalt kaks sõltumatut vihjet.

Raudsepa kõnes küsitakse Mustvee serveri kohta „kelle oma, kes haldab?“ ja vastuseks saadakse sisuliselt **„meie haldame“**. `Raudsepp k6rvalt Recording 571.docx`

Mihkli vestluses öeldakse samuti, et talle on väidetud, et Mustvee servereid haldab PPA, kuigi omandi küsimuses pole ta kindel. `Mihkel smit liiga palju vasikas Recording 574.docx`

Seega paneks praegu:

| Asi | Tõenäoline vastutaja |
|---|---|
| Idaseire WAN/backbone | SMIT |
| Krüptoühendus | SMIT |
| Mustvee serverite OS/application administration | **PPA, üsna tõenäoline** |
| Füüsilise serveri/virtualiseerimise omanik | ? |
| Mustvee kohalik subnet | PPA / seiretehnika? |
| Interneti-/WAN-ühendus | SMIT |

See seletab ka, miks PPA pool arvab, et sinna võiks Node'i panna, aga SMIT-i inimene ütleb ikkagi „seda peab küsima“.

---

# 5. Idaseire on tõenäoliselt palju vähem „isolated island“, kui alguses tundus

Teet ütleb kaks olulist asja:

> SMIT saab seda hallata.

ja:

> Idaseire radarite õhumärgid lähevad juba teise süsteemi / õhupilti.

`Teet Recording 578.docx`

See tähendab, et Idaseire ei ole arhitektuuriliselt õhukindel saar. **Kontrollitud outbound/integration paths juba eksisteerivad.**

See on Lattice projekti jaoks oluline, sest täiesti uue võrguühenduse asemel võib tegelikult vaja olla olemasoleva mustri kordamist.

### Väga kõrge väärtusega küsimus

> Kuidas täpselt liigub täna Idaseire radarite õhumärk Kaitseväe/õhupildi süsteemi?

Tahaks teada:

```text
source IP/subnet
→ gateway?
→ crypto device?
→ tunnel?
→ network?
→ destination?
→ protocol?
→ firewall rules?
```

See võib olla **praktiliselt valmis referentsarhitektuur Lattice ühendusele.**

---

# 6. Ma ei paneks enam graafikule „KV ↔ Internet VPN ↔ SMIT“ kui fakti

Uus info teeb selle varasema oletuse nõrgemaks.

Teet räägib:

- tunnelist;
- krüptoseadmetest;
- olemasolevast Idaseire → õhupilt andmeedastusest;
- SMIT-i hallatavast transportkihist.

`Teet Recording 578.docx` `Teet2 ja rainer mula Recording 579.docx`

Seega graafikul praegu:

```text
KV network
    │
    │ protected inter-agency transport
    │ exact transport TBD
    │
SMIT / PPA networks
```

mitte veel:

```text
KV -- Internet -- VPN -- SMIT
```

Internet võib olla underlying carrier, aga selle kinnitamiseks meil materjali ei ole.

---

# 7. Smarteki kohta tekkis nüüd oluline vastuolu

See on üks asi, mida ma kindlasti kontrolliks.

Raudsepa vestlus jätab mulje:

> Smartek on **eraldi võrk**.

`Raudsepp k6rvalt Recording 571.docx`

Aga Erik ütleb:

> Turvavõrgus jooksevad nii **Smartek kui Milestone**.

`Erik vork Recording 572.docx`

Need saavad mõlemad olla tõsi ainult juhul, kui me segame kolme mõistet:

```text
Smartek product/application
Smartek backend network
Smartek-connected field devices/network
```

Näiteks võib tegelikkus olla:

```text
mobile/battery cameras
       │
 separate access network
       │
       ▼
Smartek backend
       │
       ▼
Turvavõrk
```

Seega ma **ei nimetaks hetkel Smarteki kindlalt eraldi võrgu bucketiks**.

Kontrollküsimus:

> Kui öeldakse „Smarteki võrk“, kas see on päriselt eraldi L3 network/VRF/VPN või lihtsalt Smarteki seadmete mobiilne ühendus turvavõrgus oleva Smarteki serveriga?

See võib meie graafikut oluliselt lihtsustada.

---

# 8. Kuivajõe on nüüd väga tugevalt kinnitatud kui päris „saar“

Teet ütleb üsna otseselt:

> „üks saarekene ... Kuivajõe ... täiesti eraldi“.

`Teet Recording 578.docx`

Ja plaan on see viia asutuse standardplatvormile:

```text
Kuivajõe standalone
Bosch
        ↓
Turvavõrk
Milestone
```

See on nüüd üks kõige kindlamaid võrguarhitektuuri osi.

---

# 9. Mustassaare kohta tuleb üks oluline parandus

Ma ei kasutaks enam terminit **„Mustassaare protokoll = Idaseire protokoll“**.

Vestlustes seda hüpoteesi küsitakse, aga seda ei kinnitata.

Teet selgitab hoopis:

- osad kaamerad kasutavad standardseid liideseid;
- umbes mingi osa kasutab tootjaspetsiifilisi käske;
- Mustassaare on teinud neile oma driver'eid;
- radarite integratsioon on Mustassaare lahenduse oluline osa.

`Teet Recording 578.docx`

Seega parem mudel:

```text
Idaseirevõrk
│
├── standard protocols
│
├── radar feeds
│
├── camera protocols / ONVIF-like standards
│
└── proprietary device protocols
        │
        └── Mustassaare-developed drivers/integration
```

Mitte:

```text
Idaseirevõrk
└── Mustassaare proprietary protocol everywhere
```

---

# 10. Mustassaare ise võib olla rohkem kui ainult radariserver

Siin on allikates kerge vastuolu.

Esko ütleb väga jõuliselt, et Mustassaare on „puhtalt radari integratsioon“. `Esko Recording 573.docx`

Teet aga kirjeldab, kuidas Mustassaare tarkvara/driver'id suhtlevad ka osade pöördkaameratega. `Teet Recording 578.docx`

Minu tõlgendus:

**Mustassaare on radarikeskne integratsiooniplatvorm, mitte lihtsalt radariserver.** Ta võib radari track'i põhjal juhtida või siduda kaamerat.

Kontrollida täpselt:

```text
Does Mustassaare:
A) ingest radar only?
B) ingest radar + video?
C) control PTZ?
D) act as VMS?
E) expose radar tracks to other applications?
F) expose an API?
```

See on Lattice liidestuse seisukohast väga oluline.

---

# Uuendatud kõige tõenäolisem arhitektuur

```text
                         ┌─────────────────────┐
                         │ Regular SMIT / PPA  │
                         │ user network        │
                         └─────────┬───────────┘
                                   │ controlled access
                ┌──────────────────┼─────────────────┐
                │                  │                 │
                ▼                  ▼                 ▼

        PPA Turvavõrk        Idaseire network    future Lattice
        ─────────────        ────────────────
        Milestone            SMIT transport
        access control       encrypted WAN
        drone sensors             │
        Smartek?                  │
                                  ▼
                         individual surveillance
                              positions
                           ┌──────┼──────┐
                           ▼      ▼      ▼
                         radar  camera  radar
                           │
                           └──────────────┐
                                          ▼
                                      Mustvee
                               application aggregation
                               Mustassaare integration
                                          │
                                    Narva operators
```

ja eraldi:

```text
Kuivajõe / Bosch
   standalone today
        │
        └──── future → Turvavõrk / Milestone
```

---

# Küsimused, mida ma nüüd kõigepealt kontrolliks

**P0 - muudavad otseselt arhitektuuri:**

1. **Kas kõik Idaseire seirepositsioonid saadavad Mustveesse või ainult radarid?**
2. **Kas Mustvee on võrgu keskpunkt või ainult rakenduse keskpunkt?**
3. **Mis täpselt on „Uniper“ ja millise võrgu/krüptolahenduse osa see on?**
4. **Kes haldab Mustvee local subnetti ja kes saab sinna uue IP/hosti lisada?**
5. **Kuidas täpselt liigub tänane Idaseire → Kaitsevägi/õhupilt radarivoog?**
6. **Kas Smarteki „võrk“ on päriselt eraldi L3 võrk või Smarteki rakenduse/device connectivity?**
7. **Kas Mustassaare väljastab standardset radar-track feed'i või proprietary API/protokolli?**

**P1 - vajalik enne päris deploy'd:**

8. Mustvee: physical host, VM cluster või mitu serverit?
9. Mis OS/virtualiseerimine seal töötab?
10. Kas sinna saab panna uue VM-i või peab tooma füüsilise serveri?
11. Kuidas tehakse remote admin access?
12. Kas tunnelid terminates Mustvees, SMIT-is või krüptoseadmel?
13. Millised subnetid/VLANid/VRF-id seal tegelikult eksisteerivad?

Minu jaoks on **kõige väärtuslikum uus avastus punkt 5**: meil võib juba olemas olla praktiliselt täpselt see **Idaseire → Kaitsevägi turvalise sensoriandme jagamise tee**, mida Lattice jaoks uuesti leiutada üritame. Seda olemasolevat ühendust tasub nüüd esimesena lahti võtta.  

**Alternatiivne vaade:** Mustvee võib näida intervjuude põhjal „keskusena“ lihtsalt seetõttu, et Mustassaare rakendus on seal. Võrgutasandil võib Idaseire olla täiesti hajutatud ja Mustvee eemaldamine ei katkestaks kogu võrku, vaid ainult konkreetse seirerakenduse. Seda tasub graafikul seni mitte üle väita.

## Prompt:
8/12/2026, 4:21:38 PM

kas sa leiad mis seadmed võiks olla mida viidatud (uniper jne)

## Response:
8/12/2026, 4:21:40 PM

Kõige tõenäolisemalt on transkriptsiooni „Uniper” tegelikult **Juniper**. Kontrollin nüüd, kas SMIT/PPA kontekstis leidub viiteid Juniperi ruuteritele, VPN-idele või krüptoseadmetele ning kas mudeliperekonda saab kitsendada.

Leidsin veel ühe olulise ASR-paranduse: Teedu lause „one / LËN” on peaaegu kindlasti **WAN / LAN**. Terve lõik hakkab siis tehniliselt väga loogiliselt kokku jooksma: SMIT haldab WAN-i, kohalik seiremeeskond LAN/subnetti ning nende piiril on Juniper.

> **Otsin päringut SMIT Juniper SRX PPA võrk**
>
> [SRX Series Firewalls | HPE Juniper Networking UK&I](https://www.juniper.net/gb/en/products/security/srx-series.html)
> [Juniper SRX Series Firewalls](https://www.hpe.com/us/en/juniper-srx-firewall.html)
> [Do any orgs use Juniper SRX as their “real” firewall?](https://www.reddit.com/r/networking/comments/1c3zf1y/do_any_orgs_use_juniper_srx_as_their_real_firewall/)
> [Juniper SRX Firewall - Documentation](https://docs.taegis.secureworks.com/integration/connectNetwork/juniper_srx_connect/)
> [Juniper (JunOS) SRX Firewall](https://sc1.checkpoint.com/documents/Infinity_Portal/WebAdminGuides/EN/SASE-Admin-Guide/Content/Topics-SASE-IPsec-VPN/On-premises/Juniper-JunOS-SRX.htm)
> [Juniper Networks SRX Firewalls](https://www.nomios.co.uk/partners/juniper-networks/security/srx-firewalls/)
> [System Services for Management Access - Juniper SRX Firewall](https://www.youtube.com/watch?v=i_jgkH5Z0cA)
> [Juniper SRX](https://docs.logz.io/docs/shipping/network/juniper-srx-network/)
> [JUNIPR: a Framework for Unsupervised Machine Learning in Particle Physics](https://arxiv.org/abs/1804.09720)
>
> **Otsiti 9 veebisaidilt**
>
> 
>
> **Veebist otsimine**
>
> [Hanked: Siseministeeriumi infotehnoloogia- ja arenduskeskus | Riigihanked Eestis](https://ee.openprocurements.com/buyer/siseministeeriumi-infotehnoloogia-ja-arenduskeskus/)
>
> **Tuvastan seadme**
>
> Arvan, et ärakirjas mõeldakse Juniperi seadet, tõenäoliselt SRX-seeria turvaväravat. Selle roll sobib kirjeldatud kohtvõrgu, tulemüüri, marsruutimise ja krüpteeritud saidivahelise ühendusega, kuid täpset mudelit ei saa kinnitada.
>
> **Tuvastasin seadme**
>
> 
>
> **Otsiti 1 veebisaidilt**
>
> 
>
> Juurdles 2m 3s

Jah. Mõned transkriptsiooni tehnilised nimed saab üsna suure kindlusega ära parandada.

| Transkriptsioon | Tõenäoline tegelik asi | Kindlus | Mis roll |
|---|---|---:|---|
| **Uniper** | **Juniper** | ~98% | ruuter / security gateway / VPN |
| **one / WAN-iks** | **WAN** | ~95% | SMIT-i hallatav laivõrk |
| **LËN / LEN** | **LAN** | ~95% | lokaalne seirepositsiooni subnet |
| **on wifi / on wif** | **ONVIF** | ~99% | IP-kaamerate video + PTZ standard |
| **Mystone / Mindstone / Malstone** | **Milestone XProtect** | ~99% | VMS |
| **Boschi VMS** | **Bosch BVMS** | ~99% | praegune Kuivajõe VMS |
| **Smartek** | **Smartec** | ~90% | kaamerasüsteem / kaamerad |
| **Mustassaare** | **Mustasaare Tarkvarabüroo OÜ** | ~99% | radarite/kaamerate integratsioonitarkvara |

### „Uniper” = peaaegu kindlasti Juniper

See on kõige huvitavam. Teedu jutt ütleb sisuliselt:

> seirepositsioonil on kohalik subnet → kui liiklus läheb välja, krüpteeritakse → teises otsas võetakse lahti → seda haldab SMIT.

`Teet2 ja rainer mula Recording 579.docx`

Täpselt samas vestluses kutsutakse seadet „Uniperiks“. Avalikest hangetest tuleb väga tugev sõltumatu kinnitus: **SMIT ostab Juniperi võrguseadmeid**. 2022. aasta hankeplaanis oli selleks eraldi miljonieurone hange ning 2026. aastal sõlmiti uus nelja-aastane kuni 5 miljoni euro suurune Juniperi raamleping. ([Siseministeerium IT ja Arendus](https://www.smit.ee/files/2022-08/smit-hankeplaan-2022-2.pdf?1ed289a13d=&utm_source=chatgpt.com))

### Milline Juniper?

Minu esimene kandidaat oleks **Juniper SRX seeria security gateway**, mitte tavaline switch.

Põhjus on funktsioonide kombinatsioon:

```text
seirepositsiooni LAN
       │
       ▼
 Juniper SRX ?
 ├─ routing
 ├─ firewall
 ├─ IPsec encryption
 └─ WAN
       │
       ▼
   SMIT WAN
```

Juniperi SRX ongi ühe seadme sees router + firewall + IPsec VPN gateway. Juniperi enda dokumentatsioon kirjeldab SRX-i IPsec VPN funktsionaalsust ja SRX300 perekonda just hajutatud branch/WAN ühenduste jaoks. ([Juniper Networks](https://www.juniper.net/documentation/us/en/software/junos/vpn-ipsec/topics/topic-map/security-ipsecvpn-overview.html?utm_source=chatgpt.com))

Kui seirepunktid pole suure andmemahuga, võiks ajalooliselt sobida näiteks:

- SRX300 / SRX320;
- suuremas punktis SRX340 / SRX345;
- vanema süsteemi korral mõni varasem SRX/SSG põlvkond.

**Aga täpset mudelit ei saa allikatest tuvastada.** Võimalik on ka Juniper router + eraldi krüptolahendus.

---

## Veel olulisem: WAN/LAN lause sai tõenäoliselt valesti transkribeeritud

See lõik:

> „seda me kutsume ... one'iks. LËN on siis meil mastis. ... LËN on SMIT ... tornis me majandame ise selles kohalikus subletis“

on minu arvates tegelikult umbes:

> **„Seda me kutsume WAN-iks. LAN on meil mastis. WAN on SMIT-i hallata. LAN-i tornis majandame ise selles kohalikus subnetis.”**

`Teet2 ja rainer mula Recording 579.docx`

Ja see annab meile üsna olulise arhitektuurilise pildi:

```text
               SMIT vastutus
          ┌────────────────────┐
          │        WAN         │
          └─────────┬──────────┘
                    │
               Juniper ?
             VPN / crypto edge
                    │
────────────────────┼──────────── trust boundary
                    │
                   LAN
            local site subnet
                    │
        ┌───────────┼───────────┐
      radar       camera      server
        └───────────────────────┘
              PPA/seiretehnika
                 haldus
```

See on palju konkreetsem mudel kui meie varasem „Idaseirevõrk on SMIT-i VPN“.

---

## „on wifi” = ONVIF

See on samuti praktiliselt kindel.

Vestluses küsitakse:

> kui ma tahan pöördkaamerat juhtida, kas räägin „on wifi” või Milestone'i protokolli?

`Teet Recording 578.docx`

See pole Wi-Fi, vaid **ONVIF**. ONVIF Profile S kirjeldab IP-videot ning PTZ juhtimist; Profile T samuti streamingut, metadata't ja PTZ-d. ([ONVIF](https://www.onvif.org/profiles/profile-s/?utm_source=chatgpt.com))

Seega Teedu tegelik tehniline mõte oli tõenäoliselt:

```text
Lattice
   │
   ├── direct → ONVIF → camera
   │
   OR
   │
   └── VMS API → Milestone
                    │
                    └── ONVIF/vendor driver → camera
```

See vahe on teie tulevase integratsiooni jaoks päris oluline.

---

## „Mystone / Malstone / Mindstone” = Milestone XProtect

See on samuti selge. Milestone XProtect on VMS, mis integreerib IP-kaameraid ja muid seadmeid; Milestone'il on ka ONVIF Bridge. ([Milestone Systems](https://www.milestonesys.com/support/software/supported-devices/?srsltid=AfmBOopzmEBRkFYLlnvX26bizxjhom-j0Ve9LEWPVsU3qPklpyc3Wtde&utm_source=chatgpt.com))

Seega:

```text
Turvavõrk
└── Milestone XProtect
    ├── cameras
    ├── PTZ
    ├── alarms
    └── access/security integration
```

---

## Bosch = tõenäoliselt BVMS

Kuivajõe puhul räägitav „Boschi VMS” on väga tõenäoliselt **Bosch Video Management System (BVMS)**. Bosch kirjeldab BVMS-i IP-video haldussüsteemina, kuhu saab integreerida ka kolmandate osapoolte kaameraid ja muid süsteeme. ([Bosch Building Technologies](https://commerce.boschsecurity.com/au/en/BVMS-Plus-11-0/p/80997810571/?utm_source=chatgpt.com))

See sobib täpselt intervjuus kirjeldatuga:

```text
Kuivajõe today:
camera/sensor
     │
    BVMS
     │
operator workstation
```

---

## „Smartek” on tõenäoliselt päriselt **Smartec**

See ei näi olevat lihtsalt ASR väljamõeldis.

Avalikus Eesti riigieelarve dokumendis on lausa termin **„Smartec-kaameratega seotud litsentsikulu“**, sh piirihalduse kontekstis. ([Adr Docs](https://adr-docs.karlerss.com/J1kaIAA3Gcbh4F2yh4HqpWH4LSeCVzYq/Lisa%202.%20Seletuskiri%202025.%20aasta%20riigieelarve%20piirmaaraga%20vahendite%20%28liik%2020%29%20kasutamata%20eelarve%20ulekandmise%20kohta.pdf?utm_source=chatgpt.com))

Samuti leidub Eestis NKK Smarteco Ltd / Smartec kui CCTV tootja. ([Security Informed](https://www.securityinformed.com/companies/manufacturers-estonia/directory.html?utm_source=chatgpt.com))

Seega kirjutaks graafikule praegu:

**Smartec camera system**

mitte „Smartek network“, kuni saame teada, kas sellel on päriselt eraldi L3 võrk.

---

## „Mustassaare” = tegelikult Mustasaare Tarkvarabüroo

Siin saame samuti nüüd nime parandada.

Eksisteerib **Mustasaare Tarkvarabüroo OÜ**, IT-firma, ja avalikes PPA kuludes on samale ettevõttele makseid. ([Radar](https://radar.aripaev.ee/ettevote/152096/mustasaare-tarkvaraburoo-ou?utm_source=chatgpt.com))

Seega intervjuude:

- Mustassaare;
- Mustasaare;
- Mustassaare protokoll;
- Mustassaare VMS;

viitavad väga tõenäoliselt **Mustasaare Tarkvarabüroo loodud integratsioonitarkvarale**, mitte võrguseadme tootjale.

---

## Mida ma graafikul nüüd nimetaks

```text
IDASEIRE

SMIT-managed WAN
      │
      │ encrypted/routed
      │
  Juniper [?SRX]
      │
      ▼
local site LAN/subnet
      │
      ├── radar
      ├── IP/PTZ cameras
      └── other surveillance devices

             ↓ aggregation

          MUSTVEE
      Mustasaare software
      / integration servers
```

Ja eraldi:

```text
TURVAVÕRK

Milestone XProtect
├── Smartec cameras/system
├── security cameras
├── PTZ
├── access control
└── drone sensors
```

### Kõige kasulikumad asjad nüüd füüsiliselt kontrollida

Kui keegi pääseb ühe seirepositsiooni või Mustvee rack'i juurde, on kolme foto/CLI-väljundiga võimalik suur osa sellest lõplikult kinnitada:

1. Juniperi seadme **esipaneel ja model number**.
2. `show version` / `show chassis hardware` väljund, kui võrguadmin saab selle anda.
3. lihtne võrgujoonis: **LAN interface → Juniper → WAN interface**.

**Potentsiaalne lõks:** ma ei nimetaks Juniperit veel diagrammil „IPsec VPN“-iks kui fakti. Funktsionaalselt kirjeldatakse krüpteeritud WAN-i täpselt niimoodi ja SRX on väga tugev kandidaat, kuid SMIT võib kasutada Juniperit routing/firewall rollis ning krüpto võib toimuda mõne muu mehhanismi või eraldi seadmega.

---

**Sources:**

- [III kvartal 2022](https://www.smit.ee/files/2022-08/smit-hankeplaan-2022-2.pdf?1ed289a13d=&utm_source=chatgpt.com)
- [IPsec VPN Overview | Junos OS](https://www.juniper.net/documentation/us/en/software/junos/vpn-ipsec/topics/topic-map/security-ipsecvpn-overview.html?utm_source=chatgpt.com)
- [Profile S](https://www.onvif.org/profiles/profile-s/?utm_source=chatgpt.com)
- [Supported devices for Milestone Systems software & ...](https://www.milestonesys.com/support/software/supported-devices/?srsltid=AfmBOopzmEBRkFYLlnvX26bizxjhom-j0Ve9LEWPVsU3qPklpyc3Wtde&utm_source=chatgpt.com)
- [BVMS Plus 11.0 | Video Software - Keenfinity Group](https://commerce.boschsecurity.com/au/en/BVMS-Plus-11-0/p/80997810571/?utm_source=chatgpt.com)
- [1 Vahendite tagastamine riigieelarvesse](https://adr-docs.karlerss.com/J1kaIAA3Gcbh4F2yh4HqpWH4LSeCVzYq/Lisa%202.%20Seletuskiri%202025.%20aasta%20riigieelarve%20piirmaaraga%20vahendite%20%28liik%2020%29%20kasutamata%20eelarve%20ulekandmise%20kohta.pdf?utm_source=chatgpt.com)
- [Estonia Security product manufacturers | Security companies](https://www.securityinformed.com/companies/manufacturers-estonia/directory.html?utm_source=chatgpt.com)
- [MUSTASAARE TARKVARABÜROO OÜ (10380334) | Radar](https://radar.aripaev.ee/ettevote/152096/mustasaare-tarkvaraburoo-ou?utm_source=chatgpt.com)

## Prompt:
8/12/2026, 4:25:37 PM

mida selle põhjal saame edasi järeldada / spekuleerida?

## Response:
8/12/2026, 4:25:49 PM

Nende vestluste põhjal saab juba üsna palju rohkem järeldada kui lihtsalt „mis võrgud olemas on“. Mõned asjad hakkavad moodustama päris selget arhitektuurilist mustrit.

### 1. Idaseire ei paista olevat üks keskne LAN, vaid hajutatud turvatud WAN

Allikate järgi on igal seirepositsioonil oma lokaalne subnet/LAN, mille ees on krüpto-/võrguseade, ning SMIT haldab üle selle WAN-poolset ühendust. Kohalikus subnetis majandatakse seadmeid eraldi. `Teet2 ja rainer mula Recording 579.docx`

Kõige tõenäolisem loogiline mudel on:

```text
[site LAN]
 radar
 cameras
 local devices
     |
 [Juniper?]
     |
 encrypted WAN
     |
 [Juniper?]
     |
 central / operator side
```

See tähendab, et **Idaseire „võrk“ on pigem turvatud overlay/WAN koos paljude kohalike LAN-idega**, mitte üks tasane subnet.

See on oluline, sest Lattice Node ei pea tingimata „saama Idaseirevõrku sisse“ üldises mõttes. Ta võib vajada ainult üht lokaalset LAN-i ja üht kontrollitud outbound/tunnel ühendust.

---

### 2. Mustvee on tõenäoliselt rakenduslik hub, mitte võrgu füüsiline choke point

Teet2 vestluses on Mustvee kirjeldatud kohana, kuhu seirepositsioonid kokku tulevad ja kus on mõistlik radarivoogu peegeldada. `Teet2 ja rainer mula Recording 579.docx`

Samas krüptoseadmete/WAN-i kirjeldus viitab, et transport ise ei pruugi Mustveest läbi minna.

Seega oleks mõistlik eristada:

```text
NETWORK TOPOLOGY
sites <-> SMIT WAN <-> sites

APPLICATION TOPOLOGY
radars -> Mustvee integration/backend -> operators
```

See on oluline ka töökindluse jaoks: Mustvee serveri rike võib lõhkuda radarisüsteemi rakenduspildi, aga mitte tingimata kogu seire-WAN-i.

---

### 3. Mustvee võib olla Lattice'i jaoks ideaalne esimene edge-node asukoht

See pole ainult mugavus.

Seal on tõenäoliselt korraga olemas:

- ligipääs radarivoogudele;
- olemasolev seirevõrk;
- serveritaristu;
- Mustasaare integratsioon;
- olemasolevad ühendused operaatorite suunas;
- tõenäoliselt vähemalt mingi kontrollitud tee SMIT-i WAN-i.

Vestlustes räägitakse otse sellest, et Mustvees saaks radarivoogu kohapeal multicast'ida/peegeldada ja panna Lattice Node tööle ilma kogu toorvoogu Tallinna vedamata. `Mihkel smit liiga palju vasikas Recording 574.docx` `Teet2 ja rainer mula Recording 579.docx`

Seega hakkab tekkima üsna tugev arhitektuuriline põhjendus:

```text
radar
  |
existing feed
  +----> Mustasaare/current system
  |
  +----> Lattice adapter/node
```

See on palju puhtam kui:

```text
radar -> Tallinn adapter -> Lattice
```

---

### 4. Tõenäoliselt on võimalik radarivoogu dubleerida ilma olemasolevat süsteemi muutmata

Teet räägib pigem multicast'ist ja olemasolevast õhumärkide jagamisest. `Teet Recording 578.docx`

See tähendab, et Lattice pilot võiks olla **passiivne kõrvaltarbija**, mitte inline süsteem.

See on väga väärtuslik:

```text
existing radar stream
       |
       +--> existing Mustasaare system
       |
       +--> Lattice adapter
```

Selline arhitektuur vähendab:

- sertifitseerimisriski;
- rollback'i vajadust;
- operational impact'i;
- vendor lock-in probleemi;
- vajadust Mustasaare süsteemi muuta.

Kõige esimene tehniline küsimus radarimeeskonnale peakski olema:

> kas radarite andmevoog on UDP unicast, multicast või mõlemat ning kas ühe täiendava subscriber'i lisamine on võimalik?

---

### 5. Idaseire → Kaitsevägi andmevahetus võib juba olla väga oluline precedent

Teet ütleb, et Idaseire radarite õhumärki juba jagatakse teise süsteemi/õhupilti. `Teet Recording 578.docx`

See tähendab, et organisatsiooniliselt ja tehniliselt on juba olemas vähemalt üks:

```text
PPA sensor network
     |
controlled data export
     |
Kaitsevägi / military system
```

See on võib-olla kogu projekti kõige väärtuslikum leid.

Kui see tee on AK tasemel juba aktsepteeritud, võib Lattice'i puhul olla võimalik öelda:

> me ei loo uut klassi andmevahetust; me kasutame sama tüüpi juba olemasolevat kontrollitud sensorandmete eksporti.

See võib lihtsustada nii küber-, juriidika- kui võrguarutelu.

---

### 6. „SMIT peab lubama“ ei tähenda tingimata „SMIT peab Lattice'i haldama“

Vestlustest paistab üsna selgelt eraldumine:

- SMIT: WAN, transport, krüpto, routing, võib-olla hosting;
- PPA/seiretehnika: lokaalsed subnetid, sensorid, mõned serverid;
- vendor/Mustasaare: rakendustarkvara/integratsioon;
- Lattice admin: võiks olla PPA/KV koolitatud administraator.

Mustvee serverite puhul öeldakse isegi, et neid haldab „meie“ pool. `Raudsepp k6rvalt Recording 571.docx`

Seega võib probleem „SMIT ei ole veel otsustanud, mis teenus Lattice on“ olla **ainult Tallinna kesk-node'i hostinguprobleem**, mitte kogu piloodi blocker.

Praktiline järeldus:

```text
Mustvee Node:
PPA operational ownership
SMIT network connectivity
Anduril install/support

Tallinn Node:
SMIT-hosted VM
SMIT service onboarding
```

Need kaks ei pea olema sama governance-mudeli all.

---

### 7. Juniperite olemasolu viitab sellele, et uusi site'e saab tõenäoliselt lisada standardmustri järgi

Kui „Uniper“ = Juniper ja kirjeldus on täpne, siis SMIT-il on tõenäoliselt standardne seirepositsiooni ühendusmuster:

```text
site LAN
   |
security gateway
   |
SMIT WAN
```

See tähendab, et hilisemad Lattice Node'id Narvas/Luhamaal võivad olla pigem **uue hosti lisamine olemasolevasse site LAN-i**, mitte iga kord uue erivõrgu ehitamine.

See on oluline skaala mõttes.

---

### 8. Lattice'i node-to-node liiklus võiks olla väikese mahu tõttu palju lihtsam kui olemasolev sensorivõrk

Idaseire võrk kannab tõenäoliselt:

- radarivooge;
- kaamerapilti;
- juhtsignaale;
- võib-olla muid suuremahulisi vooge.

Lattice Node'id peaksid põhimõtteliselt jagama juba normaliseeritud objekte/träkke, mitte kogu raw sensor feed'i.

Seega ideaalne arhitektuur võiks olla:

```text
RADAR SITE
raw/high-volume
   |
Mustvee Lattice Node
   |
small semantic track updates
   |
Tallinn Lattice Node
   |
KV Lattice Node
```

See sobib väga hästi Andurili edge-compute loogikaga.

---

### 9. Turvavõrk ja Idaseire ei ole tõenäoliselt vaja omavahel otse kokku ühendada

See on üks hea arhitektuuriline järeldus.

Praegu võib tekkida kiusatus teha:

```text
Turvavõrk <--> Idaseire
```

Aga parem mudel on tõenäoliselt:

```text
Turvavõrk sensors
      |
    adapter
      |
   Lattice

Idaseire sensors
      |
    adapter
      |
   Lattice
```

ehk Lattice on **loogiline integratsioonikiht**, mitte võrkude bridge.

See hoiab segmentation'i puhtana.

---

### 10. Mustasaare ei pruugi olla parim koht, kust Lattice radarid kätte saab

Alguses tundus loogiline:

```text
radar -> Mustasaare -> Lattice
```

Aga uute vestluste järgi võiks olla parem:

```text
radar feed
    ├── Mustasaare
    └── Lattice adapter
```

Sest Mustasaare:

- võib kasutada proprietary integratsioonikihti;
- sisaldab vendor-specific driver'eid;
- ei pruugi omada head dokumenteeritud API-t;
- on lepinguliselt vendor-sõltuv.

`Teet Recording 578.docx`

Kui radar ise väljastab standardset UDP/multicast voogu, on see palju parem integration seam.

---

### 11. Sama põhimõte kehtib kaamerate puhul vastupidiselt

Radarite puhul võib otse sensorifeedi lugemine olla mõistlik.

Kaamerate puhul ei pruugi.

Teet kirjeldab, et osade PTZ-kaamerate juhtimine toimub standardi/driver'i kaudu ning Mustasaare või VMS tegeleb seadmespetsiifilise abstraktsiooniga. `Teet Recording 578.docx`

Seega:

```text
Radar:
prefer sensor feed

Camera:
prefer VMS/integration API
```

See on üsna oluline arhitektuuriline piir.

---

### 12. Kuivajõe migration ei lahenda tegelikku integratsiooniprobleemi

Kui Kuivajõe läheb Boschist Milestone'i, saab see:

- standardsema platformi;
- Turvavõrgu ühenduse;
- kesksema halduse.

Aga see **ei ühenda automaatselt Turvavõrku Idaseirega**.

Seda on intervjuudes juba tunnetatud: operaatoril võib pärast migratsiooni ikkagi olla radar ühes süsteemis ja kaamera teises. `Erik vork Recording 572.docx`

Seega Lattice võib lahendada palju suurema probleemi kui lihtsalt „uus C2“:

> cross-network operational fusion.

---

## Kõige tõenäolisem sihtarhitektuur hakkab nüüd välja nägema nii

```text
                         ┌──────────────┐
                         │ KV Lattice   │
                         │ Node(s)      │
                         └──────┬───────┘
                                │
                       secure node transport
                                │
                     ┌──────────▼──────────┐
                     │ Tallinn Lattice Node │
                     └──────────┬──────────┘
                                │
             ┌──────────────────┼──────────────────┐
             │                                     │
             │                                     │
    Turvavõrk adapter                       Idaseire / Mustvee
             │                                     │
       drone sensors                         Lattice edge node
       Milestone/etc                              │
                                                   ├── radar A
                                                   ├── radar B
                                                   └── Mustasaare/current system
```

Ja hiljem:

```text
Narva Node
Luhamaa Node
Mustvee Node
Tallinn Node
KV Nodes
```

võivad rääkida omavahel ainult normaliseeritud Lattice andmeid.

---

## Mida ma kontrolliks nüüd enne, kui midagi suuremat joonistada

Kõrgeima väärtusega küsimused on:

1. **Kas Mustvee on kõigi Idaseire radarite aggregation point?**
2. **Kas radarite UDP on multicast?**
3. **Kas Lattice saab olla lihtsalt teine subscriber?**
4. **Kas Mustvee local LAN-is võib PPA ise uue hosti/IP lisada?**
5. **Kas Juniper lõpetab IPsec/VPN-i või on krüpto eraldi seadmes?**
6. **Kuidas täpselt liigub praegune Idaseire õhumärk Kaitseväkke?**
7. **Kas Mustvee → Tallinn on sama WAN, mida kasutavad teised seirepositsioonid?**
8. **Kas Tallinnas on Idaseire WAN termination juba olemas?**
9. **Kas Node võib Mustveest outbound ühenduse ise algatada, ilma inbound firewall hole'ita?**
10. **Kas Mustasaare integratsiooni on üldse vaja radarite MVP jaoks?**

Kui punktid 2, 3, 4 ja 9 osutuvad jah-ks, siis **Mustvee Lattice MVP võib olla üllatavalt lihtne**: üks VM/host lokaalses seire-LAN-is, radar multicast'i kõrvaltarbija, outbound turvaline Lattice ühendus, olemasolevat tootmissüsteemi ei puuduta.

## Prompt:
8/12/2026, 4:54:57 PM

Vaata kas see info aitab täpsustada: (taustainfo - pilootprogrammina Lattice nodede paigaldamine. Olemasolevatele süsteemidele lisaks, ei asenda esialgu)

öeldi et idaseire jaoks "võrk on WAN, LAN on see mis positsioonil (radar, kaamerad)"
*Juniper on korrektne jah.
Saan aru et Mustvees oleks tarvis võimalusel radarist Latticesse ka radari raw voogu.
Saiin aru et ka SMITil läbi Juniperi juurdepääs Ida võrgule (too välja kui mu arusaam  millegagi vastuolus). Idaseire võrk ei ole seesama võrk, mis ülejäänud PPA SMITi võrk. (nagu pole ka Smartechi võrk)

Turvavõrk ja Idaseire võiks rääkida omavahel läbi SMITi võrgu. Minu nägemuses üks lattice node Tallinnas SMITis, ühendatud ka Turvavõrguga. Teine Mustvees. Narva seireinfo nagunii läbi Mustvee serveri. Lattice noded vahetavad omavahel ise infot, luues mesh võrgu.

Kasutajad ühenduvad mõlema C2 külge. SMIT võrgu kasutajad (PPA) saaksid kasutada sealtkaudu. Narva piiriseire kasutaks Mustvee C2.

Mustassaare on firma, mis on arendanud tarkvara (nn "mustassaare VMS" ) ning kelle tarkvara jaoks on loodud Mustvee server.

Mustajõe on viga kui sooviti öelda "Kuivajõe".

Ma sain aru et Smartech on mingis SMITi võrgus. Mobiililevi kaudu edastatakse rajakaamerate pilti. (neil kaameral oli mingi hüüdnimi veel)

KV connection hetkel puudub (kui kusagil olemas, on seda hea teada, aga antud juhul ei puutu meisse)
Esialgses plaanis ühendaks SMITi Tallinna node KV nodede külge. Esialgne lihtsustus (ei ühendaks kõiki otse)

Kuivajõe liigub tulevikus Milestone võrku, nii et kohtleme neid nagu nad oleks juba seal. Esialgu ei integreeri eraldi.

{lisainfo: PPA haldusalas kasutusel SMIT võrk. samal ajal kinnine asutuse vpn, aga ka juurdepääsuga välisinternetile. selle see saab avada juurdepääse teenustele, mis pole väljast kättesaadavad (siseveebist erinevate veebiliidesteni). nii nagu plaanis Lattice C2 avada}

Idaseire kuulub Plado grupi alla. Tehnik kellega rääkida radaritest on Viljar Unt.
Uurin temalt kuidas saaks Mustvees suunata serveris radarivoog lisaks olemasolevale ka Lattice node.

## Response:
8/12/2026, 4:55:10 PM

See lisainfo teeb pildi palju puhtamaks. Ma käsitleks nüüd eraldi **füüsilist/logilist võrku**, **rakenduse asukohta** ja **Lattice’i integratsiooniteed** — just Smartechi ja Mustvee puhul olid need varem läbisegi.

> **Täpsustades arhitektuuri**
>
> Jah, uus info täpsustab mudelit. Allikad toetavad Juniperi kaudu Ida-võrgu ligipääsu ja Smarteciga seotud juurdepääsu, kuid Lattice’i omavaheline mesh ning Mustvee radarist toores UDP-voog vajavad veel Viljari kinnitust.
>
> **Täpsustas arhitektuuri**
>
> 
>
> **Võrreldes allikatega**
>
> Minu hinnangul ei ole Juniperi kaudu SMITi haldusligipääs Ida-võrgule vastuolus. Täpsustan siiski, et see ei tähenda automaatselt üldist kasutajate marsruutimist. Smarteci liikluskanal, Mustasaare rakenduse roll ja Lattice’i-toorevoo siht vajavad eraldi kinnitamist.
>
> Juurdles 48s

Jah - selle lisainfo põhjal saab nüüd teha **oluliselt kindlama ja lihtsama mudeli**. Su arusaam Idaseire WAN/LAN-ist on allikatega kooskõlas. Kõige olulisem täpsustus on, et **SMIT-i juurdepääs Idaseirele ei tähenda sama asja mis tavalise SMIT/PPA kasutajavõrgu juurdepääs Idaseirele**.

## 1. Idaseire: sinu mudel on nüüd üsna tugev

Teedu kirjeldus sobib väga hästi sellise arhitektuuriga:

```text
             SMIT-managed WAN
        =========================
           |                  |
        Juniper            Juniper
           |                  |
      site LAN            site LAN
       radar                radar
       camera               camera
       devices              devices
```

Ta ütleb sisuliselt, et **WAN on SMIT-i hallata**, samas kui seirepositsiooni lokaalses LAN/subnetis majandatakse ise ning Juniper eraldab positsiooni sellest WAN-ist. `Teet2 ja rainer mula Recording 579.docx`

Seega sinu:

> „võrk on WAN, LAN on see mis positsioonil“

on minu hinnangul õige terminoloogia.

### Kas SMIT pääseb Juniperite kaudu Idaseire võrku?

**Jah, aga sõnastaksin täpsemalt: SMIT haldab ja omab tehnilist reachability't Idaseire WAN-i tasandil.**

Allikas ütleb otseselt:

> „SMIT saab seda hallata“

ning Juniper/WAN kirjeldus ütleb sama arhitektuuriliselt. `Teet Recording 578.docx` `Teet2 ja rainer mula Recording 579.docx`

Aga see **ei tähenda**, et:

```text
ordinary PPA workstation
        ↓
regular SMIT LAN
        ↓
any Idaseire IP
```

oleks vabalt routitav.

Varasem vestlus rõhutas vastupidi, et tavaline SMIT-võrk ja Idaseire pole sama võrk. `Esko Recording 573.docx`

Seega graafikul:

```text
SMIT administration / WAN infrastructure
              │
              ├──── controls/reaches ─── Idaseire WAN
              │
Regular SMIT/PPA user network
              │
              └──── NOT equivalent to Idaseire
```

See vahe on väga oluline.

---

# 2. Mustvee roll on nüüd üsna hästi defineeritav

Ma kirjutaks praegu:

> **Mustvee is an Idaseire application aggregation location, containing servers used by the Mustasaare-developed surveillance/radar integration system. Narva radar/surveillance information is aggregated through this environment.**

Seda toetavad mitu vestlust: Narva pildi kirjeldatakse liikuvat Mustvee kaudu ning Mustvee serverit seostatakse Idaseire tarkvara ja radaritega. `Raudsepp k6rvalt Recording 571.docx`

Aga väldiksin veel väidet:

> „kogu Narva sensoriliiklus läheb füüsiliselt Mustveest läbi.“

Tõenäolisemalt:

```text
NETWORK:
distributed Idaseire WAN

APPLICATION:
sensor feeds
      ↓
Mustvee servers
      ↓
Mustasaare application
      ↓
Narva operators
```

See distinction on tähtis.

---

# 3. Mustvee Lattice Node tundub nüüd väga loogiline

Sinu sihtarhitektuur võiks olla:

```text
IDASEIRE WAN
│
├── Radar position A LAN
├── Radar position B LAN
├── Camera positions
│
└── Mustvee LAN
     │
     ├── existing Mustasaare server(s)
     │        ↑
     │        │ existing radar feed
     │
     └── Lattice Node
              ↑
              │ duplicate/raw radar feed
              │
          radar stream
```

See on täpselt pilootprogrammi jaoks hea lähenemine, sest **olemasolevat süsteemi ei asendata ega panda Lattice'ist sõltuma**.

Ideaal:

```text
RADAR
  │
  ├──── existing → Mustasaare
  │
  └──── copy ───→ Lattice adapter
```

mitte:

```text
RADAR → Lattice → Mustasaare
```

See esimene on palju väiksema operatsiooniriskiga.

---

# 4. „Raw radar stream“ tuleb Viljariga väga täpselt defineerida

See on üks koht, kus terminoloogiline lõks võib hiljem palju segadust tekitada.

„Raw radar“ võib tähendada vähemalt kolme väga erinevat asja:

```text
A. true radar raw
   I/Q samples / sensor-level signal data

B. plots / detections
   individual radar detections before tracking

C. vendor-native track/datagram stream
   already processed radar objects,
   but still "raw" relative to Mustasaare
```

Vestlustest tundub **C või B palju tõenäolisem kui A**. Räägitakse UDP voost ja selle split'imisest/multicast'ist. `Mihkel smit liiga palju vasikas Recording 574.docx` `Teet Recording 578.docx`

Viljarilt küsiks esimese asjana:

> Kui me räägime radari „raw UDP voost“, siis mis taseme andmed need tegelikult on - sensor detections/plots, radar tracks või midagi veel madalama taseme?

See mõjutab absoluutselt kõike.

---

# 5. Tallinna Node + Mustvee Node mudel tundub hea

Sinu kirjeldatud MVP-d visualiseeriksin nüüd nii:

```text
                    KV Lattice Nodes
                          ▲
                          │
                 future Lattice link
                          │
                 ┌────────┴────────┐
                 │ Tallinn Node    │
                 │ Lattice + C2    │
                 └────────┬────────┘
                          │
                 Regular SMIT/PPA
                    user network
                          │
              ┌───────────┴────────────┐
              │                        │
      controlled interface      Lattice node link
              │                        │
        Turvavõrk                     ▼
              │                    Mustvee
       sensors/Milestone          Lattice Node
                                      │
                                      │
                                Idaseire LAN/WAN
                                      │
                                   radars
```

Ja Lattice'i vaates:

```text
Turvavõrk
    ↓
Tallinn Node
    ⇅
Lattice node-to-node
    ⇅
Mustvee Node
    ↓
Idaseire
```

See väldib täielikult vajadust:

```text
Turvavõrk ↔ Idaseire
```

otseselt kokku bridge'ida.

**Nad „räägivad“ operatsioonitasemel Lattice'i kaudu.**

See on arhitektuuriliselt palju parem.

---

# 6. Üks asi, mida sinu mudelis ma veel kontrolliks: C2 kummagi Node'i peal

Sinu soov:

```text
Tallinn C2
→ PPA users from SMIT network

Mustvee C2
→ Narva surveillance users
```

on väga loogiline.

Aga transcriptid kinnitavad selgelt ainult Tallinna poole mõtet: C2 veebiliides avatakse SMIT/PPA kasutajatele. `Mihkel smit liiga palju vasikas Recording 574.docx`

**Mustvee Node'i kohaliku C2 kasutamine Narva operaatoritele on praegu sinu arhitektuuriline otsus/eeldus**, mitte nendest intervjuudest kinnitatud omadus.

Seda tasub Anduriliga kontrollida:

> kas iga Lattice Node võib pakkuda täielikku lokaalset C2 kasutajaliidest ja kas Node'idelt mesh'i kaudu saadud objektid on lokaalses C2-s transparentselt nähtavad?

Kui vastus on jah, on sinu arhitektuur väga tugev.

---

# 7. KV osa saab nüüd puhtalt kõrvale tõsta

Sul on siin õigus teha oluline eristus:

### olemasolev legacy data-sharing

Allikates on juttu, et Idaseire radarite andmeid/õhumärke juba kuhugi KV/õhupildi suunas jagatakse. `Teet Recording 578.docx`

### Lattice'i ühendus KV-ga

```text
Tallinn PPA Lattice Node
        ↓
     NOT YET
        ↓
KV Lattice Nodes
```

See on uus ühendus ja **hetkel puudub**.

Seega olemasolev ühendus on meile huvitav ainult kui precedent:

> kuidas PPA sensoriandmeid on varem turvaliselt asutuste vahel liigutatud?

MVP võrgugraafikul ei pea seda legacy rada üldse näitama.

---

# 8. Smartechi uus seletus võib vana vastuolu ära lahendada

Sinu:

> Smartech on mingis SMIT-i võrgus, aga rajakaamerad edastavad mobiililevi kaudu

sobib väga hästi mõlema vastuolulise intervjuuga.

Üks inimene nimetab **Smartechi eraldi võrguks**, teine ütleb, et Smartec „jookseb Turvavõrgus“. `Erik vork Recording 572.docx` `Raudsepp k6rvalt Recording 571.docx`

Võimalik tegelik arhitektuur:

```text
battery / trail camera
        │
        │ cellular network
        ▼
 mobile connectivity
 / access network
        │
        ▼
 Smartec backend
        │
  SMIT/PPA environment
```

Nii võib:

- kaamerate transport olla eraldatud;
- backend olla SMIT/PPA võrgus;
- inimesed rääkida kord „Smartechi võrgust“, kord „Smartec Turvavõrgus“.

### Üks väga konkreetne asi kontrollida

Kas kaamera SIM kasutab:

```text
public mobile Internet
```

või

```text
private APN / operator VPN
```

Kui see on private APN, siis „Smartechi võrk“ muutub väga arusaadavaks terminiks.

---

# 9. Kuivajõe osas sinu simplification on mõistlik

Piloodi jaoks:

```text
Kuivajõe/Bosch
      ↓ future migration
Turvavõrk/Milestone
```

ja **mitte eraldi Lattice integration praegu**.

See vähendab ühe terve legacy saar-süsteemi scope'ist.

Ma paneks arhitektuurijoonisel isegi:

```text
Kuivajõe
[future: Turvavõrk / Milestone]
[not integrated during initial pilot]
```

mitte eraldi network bubble'ina.

---

# 10. Mustasaare kohta teeksin ainult ühe terminimuudatuse

Sinu:

> „Mustassaare firma, kes arendas nn Mustassaare VMS-i“

on praktiliselt kasutatav, aga tehnilises dokumendis ma nimetaks seda pigem:

> **Mustasaare surveillance/radar integration system**

mitte kindlalt VMS.

Põhjus: allikates öeldakse ühelt poolt „radari integratsioon“, aga teisalt paistab see juhtivat/siduvat ka mõningaid kaameraid ja operaatorivaadet. `Teet Recording 578.docx` `Esko Recording 573.docx`

Seega:

```text
Mustasaare-developed
radar/surveillance integration platform
```

on ohutum kui:

```text
Mustasaare VMS
```

kuni Viljar või Teet täpsustab.

---

# Viljar Unt - mida ma küsiks

Sinu põhiküsimus on õige, aga ma võtaks ühe vestlusega kohe kogu vajaliku info.

1. **Mis rada pidi radari andmed täna radarist Mustvee serverisse jõuavad?**
2. Kas see on **UDP unicast või multicast**?
3. Mis on source/destination IP ja port?
4. Mis on protokoll / radaritootja formaat?
5. Kas radar saab ise saata sama stream'i **kahte destination'i**?
6. Kui ei, kas Mustvee switch/server saab olemasoleva stream'i **teisele subscriber'ile kopeerida**?
7. Kas Lattice hosti saab panna samasse Mustvee LAN/subnetti?
8. Kas selleks on vaja uut VLAN-i, firewall rule'i või Juniperi muudatust?
9. Kas voog sisaldab ainult data plane'i või on samas ühenduses ka **radari juhtkäsud**?
10. Kui suur on ühe radari bandwidth / packets per second?
11. Kas erinevatel radarimudelitel on erinev protokoll?
12. Mis täpselt tähendab nende terminoloogias „raw radar data“ - plots, tracks või midagi madalamat?
13. Kas Mustasaare server teeb vooga enne kuvamist/tracking'ut mingi olulise transformatsiooni?
14. Kas radarivoogu juba **splititakse mõnele teisele süsteemile**? Kui jah, siis kuidas?

Kõige olulisem küsimus on tegelikult väga lihtne:

> **„Kas me saame olemasolevat radar → Mustvee voogu puutumata jätta ja teha sellest Mustvees read-only koopia teisele serverile?“**

Kui vastus on **jah**, siis Lattice radar-MVP arhitektuur on sisuliselt paigas.

### Minu praegune confidence-map

**Kõrge kindlus:** Idaseire = SMIT-managed WAN + lokaalsed site LAN-id; Juniper piiril; Mustvee on radar/integratsiooni oluline keskpunkt; regular SMIT != Idaseire; Kuivajõe võib MVP-st välja jätta.

**Keskmine/kõrge:** Mustvee on parim esimese Idaseire Lattice Node'i koht; radarivoogu saab tõenäoliselt passiivselt dubleerida.

**Veel kontrollida:** Smartechi täpne võrguarhitektuur, Mustasaare täpne roll/API, Mustvee C2 kasutamine Narva jaoks ning Lattice Node'ide mesh/C2 käitumine teie konkreetses deployment'is.

## Prompt:
8/12/2026, 5:33:59 PM

See SMITis olev C2 oleks Tallinnas serveris VMis. See teenindaks enamust PPA haldusala (kõik kes selles SMITi võrgus) {me peaks seda kutsuma PPA võrguks või PPA Domeeni võrguks, kuni saame parema nime teada, et eristada SMITi võrke. peaks neile kõigile siin analüüsis nimed panema }

Me ei tõsta KV kõrvale. me kaardistame kogu plaanitava võrgu, ning pordid mida teame. ilmselt saame leida suhtluspordid, isegi kui muus osas veel jääb kaardile küsimärk. 

Smiti mobiililahendus ei peaks mõjutama meie nägemust Smartechist. Smartech EI OLE turvavõrgus, see info on vale. 

need radarid on Terma (2000 ja 5000) radarid. Paku ise mida nad kasutada võivad võrgu ja protokollina. Võid eeldada ka et mis siis bandwith ja packets.

Eesmärk on panna Lattice Mustvee subnetti. Kasuta oma arvamust headest tavadest võrgunduses, et pakkuda mida vaja teha.

Praegu liigub radar läbi Mustasaare süsteemi. eesmärk on et jätta see puutumata ja teha read only Latticele.

## Response:
8/12/2026, 5:34:01 PM

Panen nüüd nimed paika ja teen võrgujoonise **AS-IS + piloodi TO-BE** kujul. Samal ajal kontrollin kahte tehnilist osa välisallikatest: Terma SCANTER 2000/5000 tüüpiline võrguliides/protokoll ning Lattice Node↔Node/C2 jaoks teadaolevad pordid.

> **Veebist otsimine**
>
> [Objects overview | Lattice Developers | Documentation](https://developer.anduril.com/guides/objects/overview)
> [What is Discovery & Routing](https://libp2p.io/docs/discovery-routing-overview/)
> [Lattice Mesh](https://www.anduril.com/lattice/lattice-mesh)
> [SCANTER Radars - Proven, Reliable, and Mission-Ready](https://www.terma.com/capabilities/radar-systems/)
> [Ethereum Peer Discovery Protocol](https://www.emergentmind.com/topics/ethereum-peer-discovery-protocol)
> [Lattice mesh - US10506436B1](https://patents.google.com/patent/US10506436B1/en)
> [DHT and P2P swarm peers discovery + Yggdrasil mesh ...](https://discuss.ipfs.tech/t/dht-and-p2p-swarm-peers-discovery-yggdrasil-mesh-networks/6549)
> [What are the peer discovery mechanisms involved in ...](https://ethereum.stackexchange.com/questions/7743/what-are-the-peer-discovery-mechanisms-involved-in-ethereum)
> [scanter](https://en.wiktionary.org/wiki/scanter)
>
> **Koostan tehnilise hinnangu**
>
> Ma eristan kinnitatud infot ja oletusi. Võrgu poolel pakun tõenäolise arhitektuuri: UDP-põhine radarivideo, ASTERIX-laadsed plotid või rajad ning TCP/HTTPS halduseks. Hindan ka ribalaiust, pakettide suurust ja võimalikke porte.
>
> **Koostasin tehnilise hinnangu**
>
> 
>
> **Veebist otsimine**
>
>
> **Täpsustan võrgumudelit**
>
> Ma nimetaksin võrgud nii: **PPA domeenivõrk**, **PPA turvavõrk**, **SMITi hallatav idaseire WAN**, **Mustvee seire-LAN**, **kaugseire objekti LAN**, **Smarteci eraldi võrk** ja **KV eraldiseisev võrk**. Lattice paikneb Mustvee seire-LAN-is, mitte üldises PPA domeenivõrgus.
>
> **Täpsustasin võrgumudelit**
>
> 
>
> **Veebist otsimine**
>
>
> **Otsiti 9 veebisaidilt**
>
> 
>
> Juurdles 4m 59s

Jah. Selle info põhjal paneksin nüüd **võrgumudeli esimese versiooni üsna kindlalt lukku** ning eristaks kolm asja: võrgu nimi, selle haldaja ja Lattice’i roll. Suurem osa varasemast segadusest tuli sellest, et “SMIT-i võrk” tähendas eri vestlustes täiesti erinevaid asju.

## 1. Nimed, mida edaspidi kasutaksin

**“PPA Domeenivõrk”** on parem kui “PPA võrk”. “PPA võrk” oleks liiga lai, sest Turvavõrk, Idaseire ja Smartec on samuti PPA kasutuses.

| Meie töötermin | Mida tähendab | Haldus / omanik |
|---|---|---|
| **PPA Domeenivõrk** | Tavakasutajate töövõrk, PPA intranet, tööjaamad, internet, siseveebid ja avatud siseteenused | SMIT |
| **PPA Turvavõrk** | PPA turva-/sensorisüsteemide eraldatud VPN/võrk, Milestone jne | PPA + SMIT infrastruktuur |
| **Idaseire WAN** | Hajutatud seirepositsioone ühendav turvatud WAN | WAN: SMIT; operatiivne süsteem: Plado grupp |
| **Seirepositsiooni LAN** | Konkreetse radari/kaamera asukoha lokaalne subnet | PPA seiretehnika / lokaalne haldus |
| **Mustvee Seire-LAN** | Mustvee lokaalne Idaseire subnet; Mustasaare serverid ja kavandatav Lattice Node | PPA/Plado grupp + SMIT WAN |
| **Smartec kaameravõrk** | Eraldi mobiilse side kaudu töötav rajakaamerate/kännukaamerate võrk | täpne võrguomanik veel TBD |
| **KV võrk** | Kaitseväe eraldi võrgukeskkond ja KV Lattice Node'id | KV |
| **Lattice Mesh** | Node'ide peal töötav overlay; **ei ole veel üks füüsiline PPA võrk** | Lattice/Anduril |

Idaseire puhul on WAN/LAN tõlgendus nüüd väga tugev. Teedu kirjeldus ütleb sisuliselt, et WAN on SMIT-i käes ja iga positsiooni LAN/subnet on lokaalne; nende piiril on Juniper. `Teet2 ja rainer mula Recording 579.docx`

---

# 2. TO-BE arhitektuur hakkab minu meelest välja nägema nii

```text
                                  ┌────────────────────────┐
                                  │      KV VÕRK           │
                                  │                        │
                                  │   KV Lattice Node(s)   │
                                  └───────────┬────────────┘
                                              │
                                     Lattice Mesh
                                protected link / ports TBD
                                              │
                                              ▼
┌─────────────────────────────────────────────────────────────────────┐
│                         PPA DOMEENIVÕRK                             │
│                                                                     │
│  PPA users ──HTTPS──►  Tallinn Lattice Node / C2                   │
│                       [VM in SMIT infrastructure]                   │
│                                │                                    │
│                                │ Lattice Mesh                       │
└────────────────────────────────┼────────────────────────────────────┘
                                 │
                ┌────────────────┴─────────────────┐
                │                                  │
                ▼                                  ▼
        PPA TURVAVÕRK                       IDASEIRE WAN
        ─────────────                       ─────────────
        Milestone                          SMIT-managed WAN
        drone sensors                            │
        other security systems                   │
                │                              Juniper
                │                                  │
        controlled flow                            ▼
        to Tallinn Node                    MUSTVEE SEIRE-LAN
                                                   │
                                         ┌─────────┴─────────┐
                                         │                   │
                                  Mustasaare server      Lattice Node
                                  existing production      + C2
                                         ▲                   ▲
                                         │                   │
                                         └──── Terma radar ──┘
                                              feed copy
```

Smartec paneks praegu eraldi küljele:

```text
Smartec kaameravõrk
    │
    ├── cellular-connected trail/"kännu" cameras
    │
    └── backend / integration point TBD
```

**Mitte Turvavõrgu sisse.** Võtan sinu paranduse siin tööfaktiks.

---

# 3. Üks arhitektuuriline muudatus sinu sõnastuses

Ma ei kirjutaks:

> Turvavõrk ja Idaseire räägivad omavahel läbi SMIT-i võrgu.

Võrgutehniku jaoks kõlab see nagu tahaksime teha:

```text
Turvavõrk <---- routed access ----> Idaseire
```

Seda pole tegelikult vaja.

Kirjutaks:

> **Turvavõrgust ja Idaseirest avatakse ainult vajalikud teenusevood Lattice Node'idele üle SMIT-i hallatavate võrgupiiride.**

Ehk:

```text
Turvavõrk ──► Tallinn Lattice
                    ⇅
              Lattice Mesh
                    ⇅
             Mustvee Lattice ◄── Idaseire
```

See on turvalisem ja teeb firewall matrix'i oluliselt lihtsamaks.

---

# 4. Tallinn Node: ma väldiks dual-homed VM-i, kui võimalik

Kui ütled:

> Tallinn Node SMIT-is, ühendatud ka Turvavõrguga

siis on kaks võimalikku arhitektuuri.

Halvem variant:

```text
              NIC1
PPA Domeen ─────┤
                │ Lattice VM
Turvavõrk ──────┤
              NIC2
```

See teeb Lattice VM-ist masina, mis istub **kahe security zone'i sees korraga**. Selline host on potentsiaalne bridge.

Parem variant:

```text
Turvavõrk
    │
    │ explicit firewall rule
    │ only required destination/port
    ▼
PPA Domeenivõrk
    │
Tallinn Lattice Node
```

Veel parem, kui Turvavõrgu adapter **algatab outbound ühenduse** Lattice'i suunas.

Kui SMIT ütleb, et routing/security policy tõttu on kaks vNIC-i vajalikud, siis saab seda teha, aga:

```text
ip_forward = OFF
no bridging
strict host firewall
no generic Turvavõrk <-> Domeen routing
```

---

# 5. Mustvee Node: siin teeksin vastupidi võimalikult kohaliku integratsiooni

Mustvee Node'i eesmärk on väga selge:

```text
Terma radar
     │
     ├──── existing feed ───► Mustasaare system
     │
     └──── READ-ONLY copy ──► Lattice radar adapter
```

Mustasaare tootmissüsteem jääb täielikult puutumata.

See ei ole ainult meie soovmõtlemine. Terma ametlikud andmed ütlevad, et nii SCANTER 2000 kui 5000 perekond väljastavad **radar video, plots, tracks, control ja BITE** andmeid LAN-liidese kaudu. SCANTER 2000 toetab isegi kahte paralleelset signal-processing kanalit ja teise data feed'i loomist; SCANTER 5000 dokumentatsioon ütleb otseselt “radar video distribution on LAN”. ([terma.com](https://www.terma.com/media/iz1demgs/product_sheet_sms_radar_full_situational_awareness_for-offshore_rigs_and_platforms_letter.pdf?utm_source=chatgpt.com))

Veel huvitavam: Terma enda värske 2000-seeria referentsiloend nimetab konkreetselt **Estonian Border Guard - 3 × SCANTER 2202**. ([terma.com](https://www.terma.com/media/ysdhgvml/scanter-2000-radar-series-data-sheet-a4.pdf))

See tähendab, et Viljarilt saad tõenäoliselt väga konkreetse vastuse, mitte ei pea Mustasaare tarkvara kaudu voogu “välja kaevama”.

---

# 6. Mida Terma radarivoo kohta praegu mõistlikult eeldada

Terma ise ütleb, et nende radarid on IP-võrgus ja VTS-integratsioonides kasutatakse muu hulgas **ASTERIX-i radar video, plots ja tracks edastamiseks**. Terma uuemates SCANTER mudelites on dokumenteeritud Ethernet UDP/TCP IP ning näiteks ASTERIX CAT 010/034/048/240. ([Terma Blog](https://blog.terma.com/how-the-maritime-sector-can-cut-accidents?utm_source=chatgpt.com))

Seega paneks tööeeldused:

| Feed | Kõige tõenäolisem | Kindlus |
|---|---|---:|
| Physical network | Ethernet/IP | väga kõrge |
| Radar video | UDP | kõrge |
| Distribution | multicast **või** configured unicast destination | keskmine |
| Radar video format | ASTERIX CAT 240 **või Terma/vendor format** | keskmine-madal |
| Plot/track feed | ASTERIX CAT 10/48 või vendor format | keskmine |
| Control/BITE | eraldi TCP/UDP/IP teenus | kõrge |
| Lattice pilot | **video/data only, control blocked** | meie arhitektuuriotsus |

Ma **ei kirjutaks veel ASTERIX CAT 240 faktina**. See on väga usutav, kuid meil pole tõendit, et just PPA 2202/5000 installatsioon on nii seadistatud.

Kõige suurema väärtusega asi on Viljarilt saada üks olemasoleva radari konfiguratsioon või 30-60 sekundi PCAP.

---

# 7. “Raw radar” saab nüüd palju täpsemalt defineerida

Terma ise eristab vähemalt:

```text
radar video
plots
tracks
control
BITE/status
```

([terma.com](https://www.terma.com/media/jdgfqhqc/costal-surveillance-and-vts-scanter-5000-radar-series-a4.pdf))

Seetõttu kasutaks meie dokumentatsioonis praegu terminit:

> **Terma radar-video / native radar feed**

mitte veel “raw RF”.

Sest SCANTER 5000 sisemine ADC töötab näiteks 14-bit @ 400 MHz, aga seda ADC-toorvoogu ei saadeta tavaliselt LAN-i lihtsalt välja; LAN-i läheb töödeldud radar video / plots / tracks. ([terma.com](https://www.terma.com/media/jdgfqhqc/costal-surveillance-and-vts-scanter-5000-radar-series-a4.pdf))

Ehk meie eesmärk on tõenäoliselt:

```text
native processed radar video
BEFORE Mustasaare interpretation/fusion
```

See on Lattice jaoks väga väärtuslik feed.

---

# 8. Bandwidth: paneks praegu planeerimiseks sellise envelope'i

Need **ei ole Terma avaldatud throughput-numbrid**, vaid minu engineering budget kuni saame PCAP-i.

| Feed | Planeerimisvahemik |
|---|---:|
| Tracks only | ~0.05-1 Mbps |
| Plots | ~0.1-5 Mbps |
| Radar video | **20-200 Mbps / radar** |
| Conservative upper reservation | **500 Mbps / radar** |
| 2 radarit Mustvee Node'i | arvesta esialgu kuni **1 Gbps aggregate** |

1500-byte packetite puhul tähendab see suurusjärku:

| Data rate | ~packet rate |
|---:|---:|
| 20 Mbps | ~1.7k pps |
| 50 Mbps | ~4.2k pps |
| 100 Mbps | ~8.3k pps |
| 200 Mbps | ~16.7k pps |
| 500 Mbps | ~41.7k pps |

Seetõttu paneks Mustvee Lattice hostile **vähemalt 1 GbE**, aga kui server/switching võimaldab, siis **10 GbE on väga mõistlik**, eriti kui tahame korraga 2000- ja 5000-seeria radarivideot.

Päris number tuleb hiljem PCAP-ist paari minutiga.

---

# 9. Kuidas radarivoogu read-only kopeerida

Eelistusjärjekord oleks minu meelest selline:

| Variant | Hinnang |
|---|---|
| **Existing multicast → Lattice joins same group** | ideaalne |
| **Terma supported second destination/feed** | väga hea |
| **Switch SPAN/TAP → dedicated Lattice ingest NIC** | väga hea täiesti passiivse piloodi jaoks |
| Mustasaare server re-broadcastib feed'i | ainult siis, kui muud variandid ei tööta |

SCANTER 2000 ametlik dual-channel/second-feed capability teeb teise variandi eriti huvitavaks. ([terma.com](https://www.terma.com/media/iz1demgs/product_sheet_sms_radar_full_situational_awareness_for-offshore_rigs_and_platforms_letter.pdf?utm_source=chatgpt.com))

Kui kasutatakse SPAN/TAP-i, saab ingest NIC olla isegi **ilma IP-aadressita** ning adapter loeb pakette promiscuous/pcap tasemel. See annab kõige tugevama võimaliku “read-only” garantii. Kas Andurili olemasolev Terma integration oskab sellist feed'i võtta või tahab tavalist UDP socket destination'i, tuleb nendelt küsida.

---

# 10. Mustvee Node'i võrgukonfiguratsioon

Kui Lattice integratsioon tahab tavalist UDP socket'it, paneks:

```text
Mustvee Seire-LAN

Terma / Mustasaare subnet
        │
        ├── Mustasaare server
        ├── Terma feeds
        │
        └── Lattice Node
             ├── ingest IP
             └── default route → Juniper → Idaseire WAN
```

Host firewall:

```text
ALLOW radar IPs → Lattice : UDP <RADAR_PORT>
DENY  Lattice → radar control interfaces
ALLOW Lattice → Tallinn Lattice : <MESH_PORTS>
ALLOW admin network → Lattice : <ADMIN_PORTS>
ALLOW DNS/NTP as required
DENY everything else by default
```

Kui multicast:

```text
ALLOW IGMP
ALLOW UDP <multicast group>:<port>
```

**Juniper ei peaks siin radarifeedi transportima Tallinna.** Radarivideo jääb Mustvee LAN-i. Üle WAN-i läheb Lattice'i poolt normaliseeritud palju väiksem info.

See on kogu Mustvee edge-node'i mõte.

---

# 11. Esialgne port matrix

Praegu eristaks **KNOWN / EXPECTED / UNKNOWN**.

| Source | Destination | Protocol | Port | Staatus |
|---|---|---|---:|---|
| PPA Domeen users | Tallinn C2 | HTTPS | TCP **443** | expected/high confidence |
| Idaseire/Narva users | Mustvee C2 | HTTPS | TCP **443** | expected |
| Turvavõrk adapter | Tallinn Lattice API | gRPC/HTTP2 TLS või REST HTTPS | TCP **443*** | provisional |
| Terma radar | Mustasaare | UDP/IP | **TBD** | existing |
| Terma radar/feed copy | Mustvee Lattice | UDP unicast/multicast | **TBD** | must discover |
| Mustvee Node | Tallinn Node | Lattice Mesh / gRPC+Protobuf | **TBD** | Anduril matrix needed |
| Tallinn Node | KV Node(s) | Lattice Mesh / gRPC+Protobuf | **TBD** | Anduril matrix needed |
| Nodes | internal DNS | DNS | UDP/TCP **53** | if hostname resolution used |
| Nodes | internal NTP | NTP | UDP **123** | recommended |
| Admin/jump host | Nodes | SSH / management | TCP **22?** | confirm with Anduril |

\* Andurili avalik SDK kasutab HTTPS Lattice endpoint'e ning REST ja gRPC on mõlemad ametlikud protokollid; Lattice kasutab node'ide vahel sisemiselt gRPC/Protobuf-i. Avalik dokumentatsioon **ei anna on-prem Node Mesh firewall portide tabelit**, seega mesh'i puhul ei avaks ma lihtsalt oletuse põhjal 443. ([developer.anduril.com](https://developer.anduril.com/guides/getting-started/set-up?utm_source=chatgpt.com))

See on Andurililt praegu üks konkreetne dokument, mida küsida:

> **Lattice Node deployment network / firewall / port requirements, including Node-to-Node Mesh, C2 client access, administration, DNS/NTP, authentication, updates and any outbound Internet dependencies.**

---

# 12. KV jääb kindlasti joonisele

Ja su lihtsustus on hea:

```text
                     ┌── Mustvee Node
                     │
                     │
KV Node(s) ⇄ Tallinn Node
                     │
                     └── Turvavõrk integrations
```

MVP-s ei pea tegema:

```text
KV ⇄ Mustvee
KV ⇄ every future PPA Node
```

võrgutaseme otselinke.

Lattice Mesh võib hiljem topoloogiat laiendada. Anduril kirjeldab Mesh'i detsentraliseeritud andmejaotusena, kus node'id vahetavad ja route'ivad infot; sisemiselt kasutatakse gRPC/Protobuf-i. ([Anduril](https://www.anduril.com/lattice/lattice-mesh?utm_source=chatgpt.com))

---

## Kõige tähtsam uus praktiline samm

Viljar Unt võib praegu ühe kõne või ühe PCAP-iga lahendada suure osa Mustvee arhitektuurist. Mina tahaks temalt saada vähemalt:

1. Terma mudelid täpselt: **2202? 5102/5202?**
2. radar → Mustasaare **source/destination IP, UDP port**
3. multicast vs unicast
4. feed type: **video / plots / tracks**
5. protocol/format nimi
6. bitrate + pps
7. kas radar toetab teist destination'i
8. kas olemasolevat multicast'i võib teine subscriber kuulata
9. kas Mustvee switch võimaldab SPAN-i
10. millises VLAN/subnetis Mustasaare server ja radarifeed on.

Kui sa saad need vastused, saame järgmise iteratsiooniga teha juba **päris võrguarhitektuuri tabeli: zone → subnet → host → flow → protocol → port → owner → firewall action → known/unknown**, mitte enam ainult kontseptuaalse pildi.

---

**Sources:**

- [FULL SITUATIONAL AWARENESS](https://www.terma.com/media/iz1demgs/product_sheet_sms_radar_full_situational_awareness_for-offshore_rigs_and_platforms_letter.pdf?utm_source=chatgpt.com)
- [How the Maritime Sector can Cut Accidents, Reduce Emissions, and Raise Efficiency](https://blog.terma.com/how-the-maritime-sector-can-cut-accidents?utm_source=chatgpt.com)
- [Install | Lattice Developers | Documentation - Anduril](https://developer.anduril.com/guides/getting-started/set-up?utm_source=chatgpt.com)
- [Lattice Mesh](https://www.anduril.com/lattice/lattice-mesh?utm_source=chatgpt.com)

## Prompt:
8/12/2026, 6:21:05 PM

Minu jaoks paikneb Lattice node (node nr 1) SMITi turvaserveris. Mulle tundub et see on eraldi ühik, mis siis ühendatakse vajadusele vastavalt Domeenivõrgu külge, Idaseire võrgu külge. PPA Turvavõrgu ühendus võib toimuda läbi PPA domeenivõrgu nodega. 

Lihtsalt Lattice noded vahetavad infot OMAVAHEL. sisuliselt uus võrgutasand teiste peal. nii et Idaseire räägib minu visioonis nodega otse (läbi juniperi), Turvavõrk läbi Domeenivõrgu.

vaidle või küsi lisaküsimusi. aita jõuda arusaamale, kuidas seda võrgutehnikutele mõistlik serveerida. 

Võime küsida Viljarilt kas meil bandwithi Kui meil õnnestuks Mustvees serveris voogu splittida või otse radarist 2 paraleelset signaali. (peab küsima kas nii mahuks)

Lattice kaudu liiguks esialgu vaid trackid jne, mitte raw. võid hinnata et mis infomahust radari kohta me umbes räägime (vb SMITil tarvis hinnangut, Mustvee-Tallinn ühendus on ka mingis SMITi võrgus [pakun et teenusepakkujatelt renditud ühendus, mitte füüsiline]) kas 1MBps 1 radari kohta või võime nt 15 radari kohta mingit muud numbrit oletada.

## Response:
8/12/2026, 6:21:22 PM

Su visioon on minu meelest põhimõtteliselt õige, aga võrguinseneridele serveerides muudaksin ühe asja: **Lattice Node ei “ühendu võrkude külge” tingimata füüsiliste NIC-idega; parem on mõelda talle eraldi serveritsoon/subnet ja vajalik routed reachability igasse võrku.** See väldib muljet, et teeme ühest VM-ist bridge’i.

Üks asi, millele ma vaidleksin terminoloogiliselt vastu: **“Lattice mesh on uus võrgutasand”** on kontseptuaalselt hea, aga võrgutehnikule võib see kõlada nagu VXLAN/VPN/L3 overlay. Turvalisem on öelda **“Lattice application/data mesh over existing IP connectivity”** — Anduril kinnitab, et node’ide vahel kasutatakse sisemiselt gRPC + Protobuf’i, kuid avalik dokumentatsioon ei ütle, et see looks oma IP-tunneli või virtuaalvõrgu.

> **Arhitektuuri täpsustamine**
>
> Ma eristaksin Lattice'i keskse serveri, radarisegmendid ja operatiivklientide võrgud. Turvaserver võiks olla kontrollitud tsoon, mitte tingimata läbipääsupunkt. Hindan ribalaiust pigem radari voo, jälgede ja varunduse põhjal kui taksode arvu järgi.
>
> **Täpsustas arhitektuuri**
>
> 
>
> **Veebist otsimine**
>
> [Building with Lattice | Lattice Developers | Documentation](https://developer.anduril.com/guides/concepts/overview)
>
> **Ribalaiuse hindamine**
>
> Ma võtaksin 1 MB/s radari kohta konservatiivse planeerimisvaruna, mitte eeldatava liiklusena. 15 radari korral tähendaks see 120 Mbps; jäljepõhises süsteemis võib tegelik koormus jääda oluliselt väiksemaks.
>
> **Hinnati riba laiust**
>
> 
>
> **Otsiti 1 veebisaidilt**
>
> 
>
> Juurdles 1m 27s

Jah. Selle versiooniga hakkab arhitektuur minu jaoks juba üsna hästi paika loksuma. Ma vaid muudaksin selle esitamise viisi, et võrguinsener ei kuuleks sõnu „Node ühendatakse kolme võrku“ ja ei kujutaks kohe ette kolme NIC-iga VM-i, mis kogemata security-zone'e bridge'ib.

## 1. Minu soovitatud põhimudel

Node 1 nimetaksin näiteks:

**Lattice Tallinn Node - VM SMIT Secure Server Zone'is**

mitte „PPA Domeenivõrgus olev Node“.

```text
                    KV VÕRK
                 ┌────────────┐
                 │ KV Node(s) │
                 └─────┬──────┘
                       │
                 Lattice mesh
                       │
                       ▼

               SMIT SECURE SERVER ZONE
             ┌──────────────────────┐
             │ LATTICE TALLINN NODE│
             │       + C2           │
             └───┬────────┬─────────┘
                 │        │
        routed / │        │ routed /
       firewalled│        │ firewalled
                 │        │
                 ▼        ▼
        PPA DOMEENIVÕRK   IDASEIRE WAN
                 ▲              │
                 │              │ Juniper
                 │              │
            existing            ▼
        routed/firewalled    MUSTVEE LAN
          interconnect       ┌─────────────┐
                 │           │ Lattice     │
                 │           │ Mustvee Node│
                 │           └──────┬──────┘
                 │                  │ local
                 ▼                  │ radar feed
           PPA TURVAVÕRK            ▼
                              Terma radars /
                              Mustasaare system
```

See vastab minu meelest su ideele, aga **ei eelda, et Tallinn Node ise on PPA Domeenivõrgu liige või Idaseire LAN-i liige**.

Pigem:

> Node'il on vajalik IP reachability nendesse security domain'idesse läbi SMIT-i routing/firewall infrastruktuuri.

---

# 2. PPA Turvavõrgu kohta täpsustaks sinu sõnastust

Sinu:

> Turvavõrk läbi Domeenivõrgu

võib olla sisuliselt õige, aga kirjutaks võrguinsenerile:

> **PPA Turvavõrgust kasutatakse olemasolevat kontrollitud Turvavõrk ↔ PPA Domeenivõrk/SMIT serverikeskkond ühendust, et lubada ainult vajalikud vood Tallinn Lattice Node'i.**

Mitte:

> „Turvavõrgu liiklus sõidab läbi kasutajate Domeenivõrgu.“

Need on kaks üsna erinevat asja.

Me juba teame intervjuudest, et Turvavõrgu ja tavalise SMIT/PPA keskkonna vahel kasutatakse kontrollitud routing/firewall avasid. `Mihkel smit liiga palju vasikas Recording 574.docx`

Seega ilmselt pole vaja Lattice Node'ile Turvavõrgu NIC-i.

---

# 3. Idaseire puhul sinu mudel mulle meeldib

Siin on teine olukord.

Idaseire:

```text
position LAN
   │
Juniper
   │
Idaseire WAN
   │
Juniper / SMIT routing
   │
Tallinn Lattice Node
```

on täiesti loogiline.

Teedu kirjeldus toetab tugevalt mudelit, kus seirepositsiooni **LAN** on lokaalne ja **WAN** SMIT-i hallatav, Juniper nende piiril. `Teet2 ja rainer mula Recording 579.docx`

See tähendab, et Tallinn Node'i ja Mustvee Node'i vahel võib transpordikiht väga lihtsalt olla:

```text
Mustvee Node
    │
Mustvee LAN
    │
Juniper
    │
Idaseire WAN
    │
SMIT
    │
Tallinn Node
```

Ja selle peal:

```text
Lattice Node
      ⇅
Lattice data mesh
      ⇅
Lattice Node
```

See on minu meelest praegu **kõige loomulikum variant**.

---

# 4. „Lattice mesh“ - jah, aga nimetaks seda application overlay'ks

Sinu mõtteline mudel:

> „uus võrgutasand teiste võrkude peal“

on väga hea.

Aga võrguarhitektuuri dokumendis nimetaks:

> **Lattice application/data mesh overlay over existing IP transport**

mitte lihtsalt „Lattice network“.

Anduril ütleb avalikus dokumentatsioonis, et Lattice kasutab node'ide vahel sisemiselt **gRPC-d ja Protobuf'i**, et Lattice'i andmeid efektiivselt hajutatud node'ide vahel edasi anda. ([Anduril Developer](https://developer.anduril.com/guides/concepts/overview?utm_source=chatgpt.com))

Ehk:

```text
┌───────────────────────────────┐
│        LATTICE DATA MESH      │
│ entity / track / state data   │
└───────────────────────────────┘
              ↓
┌───────────────────────────────┐
│   Existing routed IP networks │
│ SMIT / Idaseire / KV transport│
└───────────────────────────────┘
```

Oluline: me **ei tea veel**, kas Andurili konkreetne on-prem deployment loob täiendava tunnel/overlay võrgu. Avalik SDK dokumentatsioon seda ei kinnita. Selle peab Andurililt deployment/firewall matrix'ist saama.

---

# 5. Mustvee puhul eraldaks täiesti kaks andmevoogu

See on väga oluline SMIT-ile seletada.

### A. Radar raw/native feed

**Jääb Mustveesse.**

```text
Terma radar
     │
     ├────► existing Mustasaare
     │
     └────► Lattice ingest
```

### B. Lattice track/entity data

**Läheb Mustvee → Tallinn.**

```text
Terma native radar feed
        │
        ▼
Mustvee Lattice
   detection/
   track/entity
        │
        │ LOW BANDWIDTH
        ▼
Tallinn Lattice
```

Seega Mustvee-Tallinn WAN-i sizing'u puhul **ei huvita meid raw radar video bandwidth**, kui arhitektuur töötab plaanipäraselt.

See on võrguinimesele väga oluline kohe alguses ära öelda.

---

# 6. Kui suur võib track-liiklus olla?

Siin saab juba teha üsna kasuliku engineering estimate'i.

Anduril kasutab node'ide vahel Protobuf'i, mis on kompaktsem kui JSON. ([Anduril Developer](https://developer.anduril.com/guides/concepts/overview?utm_source=chatgpt.com))

Aga me ei tea veel tegelikku:

- trackide arvu;
- update rate'i;
- Lattice entity suurust;
- correlation/fusion käitumist.

Seetõttu arvutaks envelope'i nii:

> **bandwidth ≈ track count × updates/sec × serialized update size**

### Mõistlik keskstsenaarium

Oletame ühe radari kohta:

- 100 aktiivset track'i;
- 1 update/s;
- ~1 kB ühe track update'i kohta koos metadata/transport overhead'i ligikaudse suurusjärguga.

Saame:

**~0.8 Mbit/s radarile.**

15 radarit:

**~12 Mbit/s.**

### Väiksema koormusega

50 track'i × 1 Hz × 1 kB:

**~0.4 Mbit/s/radar**

15 radarit:

**~6 Mbit/s.**

### Üsna agressiivne konservatiivne stsenaarium

200 track'i × 2 Hz × 1.5 kB:

**~4.8 Mbit/s/radar**

15 radarit:

**~72 Mbit/s.**

Need on arvutuslikud envelope'id, mitte Terma ega Andurili avaldatud tegelikud numbrid.

---

# 7. Kas sinu pakutud **1 MB/s ühe radari kohta** on mõistlik?

Jah - **planeerimisnumbrina isegi väga hea**.

1 MB/s ≈ **8 Mbit/s/radar**.

15 radarit:

> **15 MB/s ≈ 120 Mbit/s**

See oleks track-only liikluse jaoks minu hinnangul juba **üsna konservatiivne upper planning allowance**.

Ma esitaks SMIT-ile esialgu nii:

| Hinnang | 1 radar | 15 radarit |
|---|---:|---:|
| Expected order of magnitude | 0.5-1 Mbps | 8-15 Mbps |
| Conservative busy case | 3-5 Mbps | 45-75 Mbps |
| **Initial sizing ceiling** | **8 Mbps / 1 MB/s** | **120 Mbps / 15 MB/s** |

Ja lisaks:

> **Raw radar/video is explicitly excluded from Mustvee-Tallinn Lattice mesh traffic.**

See on kõige tähtsam lause.

---

# 8. Mina küsiks SMIT-ilt praegu mitte „kas bandwidthi jätkub?“, vaid kaks numbrit

Mustvee ↔ Tallinn:

1. **Nominal link capacity**
2. **Current peak utilisation / available headroom**

Näiteks kui tuleb vastus:

```text
1 Gbps leased circuit
peak utilisation 150 Mbps
```

siis trackide jaoks pole praktiliselt küsimustki.

Kui:

```text
100 Mbps circuit
peak 60-80 Mbps
```

siis tahame enne deploy'd päris mõõtmise teha.

Kui:

```text
10 Mbps
```

siis hakkab see juba Lattice track-only puhul arhitektuuri mõjutama.

Ja jah, sinu spekulatsioon, et füüsiliselt ei pruugi see olla PPA enda kaabel, vaid operaatorilt ostetud/renditud WAN-teenus, on täiesti realistlik - aga **seda ma veel meie diagrammile faktina ei kirjutaks**. Teame ainult, et WAN on SMIT-i hallatav. `Teet2 ja rainer mula Recording 579.docx`

---

# 9. Terma → Mustvee bandwidth on hoopis teine küsimus

Viljarilt küsiks tõesti:

> **Kui olemasolevat Terma feed'i Mustvees split'ida või panna radar väljastama teist paralleelset feed'i, kas olemasolev radar-Mustvee LAN/WAN ja radar ise toetavad seda ilma tootmissüsteemi mõjutamata?**

Aga siin on kaks väga erinevat varianti.

### Variant A - split Mustvees

```text
radar ───────────────► Mustvee
                         │
                         ├── Mustasaare
                         └── Lattice
```

Kui sama pakett tuleb Mustveesse ainult **ühe korra** ja kopeeritakse lokaalselt, siis seirepositsioon → Mustvee WAN bandwidth **ei suurene sisuliselt üldse**.

See oleks ideaalne.

### Variant B - radar saadab kaks eraldi unicast feed'i

```text
radar
  ├────────► Mustasaare
  └────────► Lattice
```

Siis radaripositsioon → Mustvee transport võib saada **ligikaudu ühe täiendava radarifeedi jagu koormust**.

Just seepärast on Viljari küsimus bandwidthist oluline.

---

# 10. Kui radar toetab multicast'i, on olukord veel parem

Terma SCANTER süsteemid on IP-võrgupõhised ja Terma kirjeldab standardseid digitaalseid radariväljundeid ning LAN-integratsiooni; täpne PPA installatsiooni konfiguratsioon tuleb siiski Viljarilt kinnitada. ([terma.com](https://www.terma.com/products/radars/surface-movement-radar/?utm_source=chatgpt.com))

Kui olemasolev voog on multicast:

```text
             multicast group
                  │
            ┌─────┴─────┐
            ▼           ▼
       Mustasaare     Lattice
```

siis Lattice'i lisamine võib olla võrgu mõttes väga odav.

Aga seda ei tasu eeldada enne, kui Viljar ütleb:

- multicast/unicast;
- destination;
- port;
- feed type.

---

# 11. Võrgutehnikutele annaksin mitte ühe suure pildi, vaid **flow matrix'i**

Praegune esimene versioon:

| # | Source | Destination | Purpose | Proto/port | Expected BW |
|---|---|---|---|---|---:|
| F1 | PPA Domeenivõrgu kasutajad | Tallinn Lattice C2 | C2 access | HTTPS/TCP 443? | väike |
| F2 | Turvavõrk adapterid | Tallinn Lattice Node | sensor data | TBD | väike-keskmine |
| F3 | Mustvee Node | Tallinn Node | Lattice mesh | gRPC/Protobuf, **port TBD** | ~<10-100 Mbps planning |
| F4 | Tallinn Node | Mustvee Node | Lattice mesh | gRPC/Protobuf, **port TBD** | ~<10-100 Mbps |
| F5 | Tallinn Node | KV Node(s) | Lattice mesh | **TBD** | TBD |
| F6 | KV Node(s) | Tallinn Node | Lattice mesh | **TBD** | TBD |
| F7 | Terma radar/feed | Mustasaare | existing production | UDP/etc TBD | existing |
| F8 | Terma/feed copy | Mustvee Lattice | passive radar ingest | UDP/multicast TBD | potentially high, **local** |
| F9 | Narva/Idaseire users | Mustvee C2 | local C2 | HTTPS/TCP 443? | small |
| F10 | Admin network | Node(s) | administration | TBD | small |

**Ära lase veel võrguinimestel F3/F4 jaoks porti välja mõelda.** Avalikust Andurili dokumentatsioonist saame teada gRPC/Protobuf'i, aga deployment-specific node-to-node porti ma ei leidnud. ([Anduril Developer](https://developer.anduril.com/guides/concepts/overview?utm_source=chatgpt.com))

---

# 12. Väike vastuväide Mustvee „subnetti panemisele“

Üldine eesmärk on õige, aga küsiks Viljarilt/SMIT-ilt:

> Kas Mustvee serverid ja radari feed ise on tõesti **samas L2/L3 subnetis**?

Võimalik on näiteks:

```text
Mustvee site
├── server VLAN
├── radar/data VLAN
├── management VLAN
└── Juniper/WAN
```

Sellisel juhul ei tahaks me öelda:

> „pange Lattice samasse subnetti“

vaid:

> **„paigutame Lattice Mustvee serverikeskkonda ning võimaldame radar-data VLAN-ist ainult vajaliku read-only feed'i ja Idaseire WAN-i kaudu node-to-node liikluse.“**

See oleks security mõttes isegi parem.

---

## Minu soovituslik sõnastus esimesele võrguarhitektuuri koosolekule

> **Lattice pilot does not replace or bridge the existing PPA networks. Tallinn and Mustvee Lattice Nodes form a Lattice application/data mesh over existing SMIT-managed IP connectivity. Tallinn Node is hosted as a VM in the SMIT secure server environment and receives explicitly permitted routed connectivity from PPA Domain, Turvavõrk, Idaseire and later the KV side as required. Mustvee Node is placed in the Mustvee Idaseire server environment. Existing Terma→Mustasaare production flows remain unchanged; Lattice receives a passive duplicate of the radar feed locally in Mustvee. Only Lattice-derived tracks/entities, not native radar video/raw feeds, are transported from Mustvee to Tallinn.**

See sõnastus minu meelest kõrvaldab kolm kõige ohtlikumat arusaamatust: **me ei bridge'i võrke, me ei pane Lattice'i olemasoleva süsteemi vahele ja me ei plaani raw radarivoogu Mustvee-Tallinn WAN-i kaudu vedada.**

---

**Sources:**

- [Building with Lattice | Lattice Developers | Documentation](https://developer.anduril.com/guides/concepts/overview?utm_source=chatgpt.com)
- [Outstanding SCANTER 5502/5602 Surface Movement Radar | Terma](https://www.terma.com/products/radars/surface-movement-radar/?utm_source=chatgpt.com)

## Prompt:
8/12/2026, 6:36:04 PM

vaata Andurili dokumentatsiooni, aga mulle tundub Lattice nagu omaette vpn teiste võrkude peal, mis töötleb ja vahendab oma sees reeglite järgi infot. ei tea kuidas seda sõnastada bridge-st erinevalt. uuri selle struktuuri kohta

mis võiks olla hea nimetus "SMIT SECURE SERVER ZONE" kohale? Node ei pea olema domeenivõrgu liige aga vajab juurdepääsu. tuleviku joonistel peame näitama ka kasutajaid selle küljes. (samuti sensoreid ja asju teiste võrkude küljes. mitte igal joonisel küll)

Kas radari multicastile seadmine vajaks olemasolevas Mustasaare serveris seadistamist? või saaksime ilma selleta?

Idaseire osas - ma ei kujuta kus Juniperid selles võrgus paiknevad. Võid oletada info põhjal, aga kuidas Idaseire WAN ja Juniperid täpselt Tallinna SMITi jõuavad, ei tea. 

(muuda et me ei kasutaks seda WAN nimetust tulevikus. Idaseire võrk parem)

(kas kusagil tekstidest nägid, mis võrgus võiks olla piiriseadmed Kagus, nagu Piusa ja Saatse?)

mõtlemiskohaks jätame meelde küsimuse, et kui palju on kaameraid Idaseire võrgus. Saan aru et Lattice ei võta kaamerastriimi automaatselt vaid seda küsitakse (et kõik kaamerad ei striimita automaatselt meie Lattice võrku nodede vahel)

## Response:
8/12/2026, 6:36:06 PM

Uurin kahte asja paralleelselt: **mida Anduril ise Lattice Mesh’i ja Node’ide vahelise võrgu kohta ütleb**, ning **mida meie intervjuudes Piusa/Saatse/Kagu seadmete võrkude kohta tegelikult öeldakse**. Samuti jätan eraldi kontrollpunktina meelde Idaseire kaamerate arvu ja selle, et kaameravideo ei tohiks vaikimisi mesh’i kaudu voolata.

Jah - Andurili dokumentatsioon teeb su „VPN teiste võrkude peal” intuitsiooni **kontseptuaalselt üsna heaks**, aga võrguarhitektuuri dokumendis ma sõna **VPN** ei kasutaks. VPN loob eelkõige IP-reachability/tunneli ja kannab seal sees suvalist võrgu-liiklust. Lattice Mesh seevastu kirjeldab ennast kui **detsentraliseeritud andmevõrku**, mis integreerib ja normaliseerib andmeid ning klassifitseerib, prioriseerib ja levitab neid node'ide vahel. Node'ide sisemine andmevahetus kasutab gRPC-d ja Protobuf'i. ([anduril.com](https://www.anduril.com/lattice/lattice-mesh?utm_source=chatgpt.com))

Minu soovitatud termin oleks:

> **Lattice Data Mesh - policy-aware application/data overlay over existing IP networks**

või joonisel lühemalt:

> **Lattice Mesh - data overlay**

See annab edasi täpselt selle, mida sa mõtled, ilma bridge'i või VPN-i eksitava tähenduseta.

### Bridge vs VPN vs Lattice

| Mehhanism | Mida ta sisuliselt vahendab |
|---|---|
| L2 bridge | Ethernet frame'e / broadcast domain'i |
| Router | IP-pakette võrkude vahel |
| VPN | IP-liiklust läbi turvatud tunneli |
| **Lattice Mesh** | **Lattice'i semantilisi andmeid: entity'd, track'id, task'id, objektid jne** |

Anduril ütleb isegi, et Mesh „dynamically prioritizes and distributes data“ ning teeb seda üle erinevate teenuste, domain'ide ja platvormide; ehk ta on teadlik sellest, **mis andmed liiguvad**, mitte lihtsalt sellest, millise IP-aadressi poole pakett läheb. ([Anduril](https://www.anduril.com/lattice/lattice-mesh?utm_source=chatgpt.com))

Seega sinu arhitektuuri võiks mõtteliselt kujutada nii:

```text
         LATTICE DATA MESH
   ─────────────────────────────
     Tallinn Node ⇄ Mustvee Node ⇄ KV Nodes
   ─────────────────────────────
               │
       existing IP connectivity
               │
 ─────────────────────────────────────
 PPA Domeenivõrk / Idaseire võrk /
 Turvavõrk / KV transport / etc.
 ─────────────────────────────────────
```

**Oluline piir:** avalik Andurili dokumentatsioon ei kinnita, et Mesh ise tekitab L3 tunnel-interface'i või VPN-taolise virtuaalse IP-võrgu. Seega ma ei kirjutaks võrguinsenerile „Lattice VPN“. Kirjutaks **„secure Lattice data-mesh overlay requiring IP reachability between Lattice nodes“**.

---

## Tallinna Node'i keskkonna nimi

„SMIT Secure Server Zone“ on liiga konkreetne, sest me veel ei tea, kas SMIT seda päriselt zone'iks, serverivõrguks, turvavõrguks, platformivõrguks vms nimetab.

Praeguseks kasutaksin:

> **SMIT Tallinna serverikeskkond**

Joonisel:

```text
┌──────────────────────────────────┐
│ SMIT Tallinna serverikeskkond    │
│ [täpne võrgu/zone nimi TBD]      │
│                                  │
│      Tallinn Lattice Node        │
│          VM + C2                 │
└──────────────────────────────────┘
```

See ei väida:

- et Node kuulub PPA Domeenivõrku;
- et see serverikeskkond on Idaseire osa;
- et see on Turvavõrk;
- ega isegi seda, kas Node'il on üks või mitu interface'i.

Seejärel näitame **reachability**, mitte liikmelisust:

```text
PPA Domeenivõrgu kasutajad
          │
          │ HTTPS / C2
          ▼
┌──────────────────────────┐
│ SMIT Tallinna            │
│ serverikeskkond          │
│                          │
│ Tallinn Lattice Node     │
└──────────┬───────────────┘
           │
           │ permitted routed connectivity
           ▼
     Idaseire võrk
```

See on minu meelest väga hea graafiline keel ka tulevaste jooniste jaoks: **kast näitab, kus süsteem paikneb; nool näitab, kellel/millel on sinna juurdepääs.**

Siis saame hilisemal „suurel“ joonisel lisada:

```text
PPA Domeenivõrgu kasutajad ─────► Tallinn C2

Turvavõrgu sensorid ────────────► Tallinn Node

Idaseire võrk ──────────────────► Tallinn Node
                                   ⇅
                              Lattice Mesh
                                   ⇅
                             Mustvee Node
                                   ▲
                                   │
                               Terma radarid

KV Nodes ────────────────────────⇄ Tallinn Node
```

---

# Multicast: kas Mustasaare serverit tuleb muuta?

**Mitte tingimata. Tegelikult sooviksin vältida selle muutmist.**

On neli põhimõtteliselt erinevat olukorda.

### 1. Radar juba saadab multicast'i

Siis ideaaljuhul:

```text
              existing multicast
Terma ─────────────┬─────────────
                   │
             ┌─────┴──────┐
             ▼            ▼
       Mustasaare       Lattice
```

Mustasaare serveris **ei ole vaja midagi muuta**. Lattice liitub sama multicast grupiga.

---

### 2. Radar saadab praegu unicast'i ainult Mustasaarele, kuid toetab teist väljundit

See on SCANTER 2000 puhul eriti huvitav, sest Terma dokumenteerib **dual-channel processing'u ja samaaegse teise data feed'i** ning ütleb, et radar video, plots, tracks, control ja BITE on LAN-interface'i kaudu saadaval. ([terma.com](https://www.terma.com/media/iz1demgs/product_sheet_sms_radar_full_situational_awareness_for-offshore_rigs_and_platforms_letter.pdf?utm_source=chatgpt.com))

Siis:

```text
Terma
 ├────► Mustasaare IP:port     EXISTING
 │
 └────► Lattice IP:port        NEW
```

Mustasaare serverisse **jällegi ei puutu**.

See oleks minu esimene eelistus juhul, kui radar seda konfiguratsiooni toetab.

---

### 3. Radar saab saata ainult ühe unicast voo

Siis kõige puhtam täiesti passiivne variant võib olla:

```text
Terma ─────► switch ─────► Mustasaare
              │
              │ SPAN / mirror
              ▼
           Lattice
```

Ka sel juhul **Mustasaare serveris ei muuda midagi**.

Puudus: Lattice integration peab oskama peegeldatud pakette vastu võtta. Kui Andurili Terma adapter ootab UDP-d enda IP-le, võib olla vaja väikest lokaalselt packet capture → UDP replay/adapter komponenti.

---

### 4. Mustasaare server ise dubleerib voogu

```text
Terma ──► Mustasaare server
               ├── current processing
               └── UDP copy → Lattice
```

See töötab, kuid **on minu viimane valik**, sest siis hakkame tootmisserverit muutma.

Seega Viljarilt ei küsiks esimesena „kas saame Mustasaare serveris stream'i split'ida?“, vaid:

> **Mis kujul radarivoog täna Mustveesse jõuab ja kas Terma saab olemasolevat väljundit puutumata jättes anda sama radar-video/plot/track feed'i teisele destination'ile või multicast group'i? Kui mitte, kas Mustvee võrgus saab voogu switch SPAN/TAP või muu passiivse meetodiga kopeerida?**

See säilitab õige prioriteedi: **radar → võrk → Lattice**, mitte Mustasaare → Lattice.

---

# Idaseire Juniperid: mida me praegu tegelikult teame

Ma muudaksin siin meie mudelit natuke.

Edaspidi kasutame ainult:

> **Idaseire võrk**

mitte „Idaseire WAN“.

Intervjuu järgi on siiski selle sees kaks mõistet:

```text
Idaseire võrk
│
├── seirepositsiooni LAN
│   ├── radar
│   ├── camera
│   └── local equipment
│
└── positsioonidevaheline transport
```

Juniperi kohta saan allikatest teha **üsna tugeva, kuid mitte täielikult kinnitatud** oletuse:

```text
RADAR / SEIREPOSITSIOON

radar + cameras
       │
       │ site LAN
       ▼
    Juniper
       │
       │ encrypted / protected
       │ Idaseire transport
       │
       ▼
      ????
       │
       ├────► Mustvee
       │
       ├────► Narva
       │
       └────► SMIT Tallinn
```

Teet kirjeldas, et seirepositsioonidel on Juniper ning kui ühendus liigub „omast maast välja“, see krüpteeritakse; vastuvõtvas punktis võetakse teise Juniperiga lahti. Samuti ütles ta sisuliselt, et see pool on SMIT-i hallatav. `Teet2 ja rainer mula Recording 579.docx`

**Mida me ei tea:** kas keskel on näiteks operaatori MPLS/L3VPN, SMIT-i oma routed backbone, site-to-site tunnelid, Riigivõrk või midagi muud.

Samuti pole teada, kas:

```text
Mustvee Juniper → Tallinn Juniper
```

on füüsiliselt otsene loogiline tunnel või:

```text
Mustvee Juniper
      ↓
SMIT/private carrier network
      ↓
central Idaseire routing/security
      ↓
Tallinn Juniper
```

Ma joonistaks selle praegu teadlikult abstraktsena:

```text
Mustvee Seire-LAN
      │
    Juniper
      │
      ▼
┌─────────────────────────────┐
│       IDASEIRE VÕRK         │
│ inter-site transport        │
│ exact topology TBD          │
└─────────────┬───────────────┘
              │
          SMIT Tallinn
```

See on võrguinimesele hea, sest **ei valeta topoloogiat ette**.

---

# Piusa / Saatse / Kagu

Siin on intervjuudes tegelikult natuke rohkem infot, kui esialgu arvasime.

Esko vestluses öeldakse üsna tugevalt, et **termaradarid on selles SMIT-i seirevõrgus**, mille kontekst on Idaseire. `Esko Recording 573.docx`

Raudsepa vestluses küsitakse konkreetselt Värska/Koidula/Saatse piirkonna termopositsioonide ja vaatamise kohta ning vestluse loogika jõuab selleni, et neid vaadatakse Idaseire/Mustasaare poole kaudu. Samas muude Kagu seadmete kohta jõutakse järelduseni, et need võivad olla **Smarteci või Turvavõrgu** süsteemid. `Raudsepp k6rvalt Recording 571.docx`

Seega pakuks praegu Kagu jaoks sellise klassifikatsiooni:

```text
KAGU

Terma / termoradar
large border-surveillance camera
        ↓
   IDASEIRE VÕRK
        ↓
   Mustasaare system

trail / battery camera
        ↓
   SMARTEC VÕRK

perimeter / object security /
access-control / Milestone cameras
        ↓
   TURVAVÕRK
```

**Piusa ja Saatse nime järgi ei saa ma veel öelda „kõik seal = Idaseire“.**

Aga kui räägime seal olevast **termaradarist või radariga seotud suurest seirepositsioonist**, siis Idaseire on praegu kõige tugevam oletus.

See on hea asi Viljarilt või Plado grupilt ühe küsimusega kontrollida:

> „Kas Kagu Terma/termopositsioonid - sh Saatse/Piusa/Värska/Koidula suund - on samas Idaseire võrgus nagu Narva/Peipsi radarid?“

---

# Kaameravideo ja Lattice Mesh

Siin su intuitsioon on minu arvates väga oluline.

Andurili avalikus dokumentatsioonis **ei leidnud ma live camera video kohta piisavalt detaili**, et öelda täpselt, millise protokolliga või milliste node'ide vahel stream liigub.

Aga Lattice'i **Objects** arhitektuur ütleb midagi väga huvitavat: igal mesh node'il on kohalik CDN-instance ning kui objekti kohapeal pole, küsitakse seda esmalt peer'idelt; alles siis objekt **streamitakse ja cache'itakse lokaalselt**. Ehk suuri binary object'e ei kirjeldata kui kõigile node'idele automaatselt replikeeritavat sisu. ([Anduril Developer](https://developer.anduril.com/guides/objects/overview))

Samuti kirjeldab Mesh ise intelligentset prioriseerimist ja „right data to the right persons“ põhimõtet piiratud bandwidthiga keskkonnas. ([Anduril](https://www.anduril.com/lattice/lattice-mesh?utm_source=chatgpt.com))

Seetõttu oleks minu **tööeeldus**:

```text
TRACKS / ENTITIES
      ↓
automatically distributed according
to Lattice mesh policies/subscriptions

CAMERA VIDEO
      ↓
NOT continuously replicated everywhere
      ↓
requested / subscribed / routed when needed
```

Aga rõhutan: **Objects CDN dokumentatsioon ei ole sama asi mis live video pipeline**. Live video käitumise peame Andurililt kinnitama.

Meie võrgudimensioneerimise jaoks on siiski väga oluline mitte eeldada:

```text
20 cameras × 5 Mbps
      ↓
100 Mbps permanently across Mesh
```

ainult sellepärast, et kaamerad on Lattice'iga integreeritud.

Pigem peaks olema kaks eraldi küsimust:

> kui palju **track/entity telemetry't** liigub pidevalt?

ja

> kui palju **video stream'e võib samaaegselt on-demand üle node'ide vahelise ühenduse liikuda?**

See teine võib hiljem osutuda Mustvee-Tallinn bandwidthi puhul **palju tähtsamaks kui radar track'id**.

Kaamerate arv Idaseire võrgus ja video on-demand/replication käitumine on meil nüüd eraldi kontrollpunktina meeles.

---

**Sources:**

- [Lattice Mesh](https://www.anduril.com/lattice/lattice-mesh?utm_source=chatgpt.com)
- [FULL SITUATIONAL AWARENESS](https://www.terma.com/media/iz1demgs/product_sheet_sms_radar_full_situational_awareness_for-offshore_rigs_and_platforms_letter.pdf?utm_source=chatgpt.com)
- [Objects overview | Lattice Developers | Documentation](https://developer.anduril.com/guides/objects/overview)

## Prompt:
8/12/2026, 6:42:22 PM

Idaseire puhul ära kasuta WAN ja Mustvee puhul ma ei tea kas võime eeldada et serveri sees või kohapeal on LAN? Teada et proxmox server.

Idaseire puhul ära kasuta WAN ja Mustvee puhul ma ei tea kas võime eeldada et serveri sees või kohapeal on LAN? Teada et proxmox server.

## Response:
8/12/2026, 6:42:31 PM

Jah — siin tasub olla konservatiivne.

**Idaseire puhul kasutame edaspidi ainult nime „Idaseire võrk“**, mitte WAN-i. WAN/LAN oli kasulik Teedu lause tõlgendamiseks, aga meil pole piisavalt infot, et kogu Idaseire topoloogiat nii nimetada.

Mustvee puhul **ei eeldaks ma praegu „Mustvee LAN-i“ olemasolu**. Teame ainult, et seal on Proxmox-server/virtualiseerimiskeskkond ja et olemasolev Mustasaare süsteem saab sealt radarivoogu.

Parem termin oleks praegu:

```text
Mustvee Proxmox serverikeskkond
```

või joonisel veidi üldisemalt:

```text
Mustvee serverikeskkond
[Proxmox]
```

Selle sees:

```text
Mustvee serverikeskkond
┌─────────────────────────────┐
│ Proxmox host                │
│                             │
│ ├─ Mustasaare VM/server     │
│ └─ planned Lattice Node VM  │
└──────────────┬──────────────┘
               │
          Idaseire võrk
               │
             radarid
```

### Miks mitte veel „LAN“

Proxmox ise võib sisaldada näiteks:

```text
physical NIC
   │
Linux bridge vmbr0
   ├── Mustasaare VM
   └── Lattice VM
```

või:

```text
physical NIC
   │
802.1Q trunk
   │
Proxmox
├── VLAN A → serverid
├── VLAN B → radar data
└── VLAN C → management
```

või isegi mitut füüsilist NIC-i.

Proxmoxi `vmbr0` on küll tehniliselt L2 bridge, aga **seda ei tohiks meie arhitektuurijoonisel automaatselt nimetada „Mustvee LAN-iks“**. See võib olla ainult virtuaalne ühendus olemasoleva võrgu/VLAN-i külge.

Seega praegu kirjutaks:

> **Lattice Mustvee Node paigaldatakse olemasolevasse Mustvee Proxmox serverikeskkonda ning sellele antakse vajalik võrgupääs Idaseire võrku ja Terma radarifeedile. Täpne VLAN/subnet/bridge topoloogia TBD.**

See jätab võrgutehnikule õiged küsimused.

### Tõenäoline tehniline lahendus

Kui Mustasaare VM juba saab Terma feed'i, siis esimene asi, mida tahaks näha, on Proxmoxi network config:

```bash
cat /etc/network/interfaces
```

ja:

```bash
ip addr
ip route
bridge link
bridge vlan show
```

Sealt saame tavaliselt kohe teada:

- mitu füüsilist NIC-i;
- millised `vmbrX` bridge'id;
- kas kasutatakse VLAN-e;
- millise bridge/VLAN-i küljes Mustasaare VM on;
- millise võrgu kaudu radarifeed tuleb;
- kas Lattice VM-i saab panna sama feed'i nägema ilma olemasolevat VM-i muutmata.

Praegusel joonisel kasutaksin seega:

```text
Idaseire võrk
      │
      ├──── Terma radarid
      │
      └──── Mustvee serverikeskkond [Proxmox]
                    │
                    ├── Mustasaare
                    └── Lattice Mustvee Node
```

ja **ei joonistaks veel Mustvee LAN-i, subnetti ega Juniperit Mustvee kõrvale**, kuni keegi kinnitab nende tegeliku paigutuse. See on praegu täpsem kui detailsema, aga spekulatiivse topoloogia joonistamine.

## Prompt:
8/12/2026, 6:44:09 PM

Idaseire võrk Margus Plado grupi all. Turvavõrku administreerib Egert Haan (kontaktiks). mida veel?

## Response:
8/12/2026, 6:44:11 PM

Paneksin selle nüüd eraldi **“võrk / süsteem / kontakt / otsustaja”** tabeliks, sest sama inimene ei pruugi olla nii tehniline kontakt kui ka formaalne omanik. Vaatan failidest, millised nimed ja rollid veel piisava kindlusega välja tulevad.

> **Täiendades kontaktikaarti**
>
> Minu hinnangul tasub lisada Peep Põder võrgu- ja SMITi-siseste ühenduste jaoks, Teet Otsap tehniliste hangete ning Mustvee serveritaristu tõttu, samuti Jaanek Ubleja ja Margus Plado Kuivajõe migratsiooni ja Milestone’i teemadel. Helena roll vajab veel täpsustamist.
>
> **Täiendati kontaktikaarti**
>
> 
>
> Juurdles 29s

Jah. Ma paneks praegu kontaktid mitte ainult võrgu, vaid **otsustusvaldkonna** järgi. Siis näeme kohe, kus meil on auk.

| Ala / süsteem | Kontakt | Mida temalt küsida / roll | Kindlus |
|---|---|---|---|
| **Idaseire võrk** | **Margus Plado** | süsteemi/grupi vastutus, ligipääsud, kes võib uusi seadmeid/VM-e lisada | sinu kinnitatud |
| **Terma radarid / Mustvee radarivoog** | **Viljar Unt** | SCANTER 2000/5000 feed, UDP/multicast/unicast, parallel output, bandwidth, ports | sinu kinnitatud |
| **PPA Turvavõrk** | **Egert Haan** | Turvavõrgu routing/firewall, Tallinn Lattice Node'ile vajalikud vood | sinu kinnitatud |
| **Milestone** | **Egert Haan?** | Milestone/Turvavõrgu integratsioon, API/kaamera ligipääs | üsna tõenäoline, aga kinnitada |
| **SMIT võrgutransport / Idaseire ühendused / Juniper** | **Peep Põder** | kuidas Idaseire Tallinnasse jõuab, routing/firewall/Juniper, kuidas Node 1 saab reachability | **väga oluline kontakt**, täpne vastutus TBD |
| **Mustasaare süsteem / tehniline ajalugu** | **Teet Otsap** | Mustasaare integratsioon, protokollid, varasemad hanked, kaamera/radari driver'id | kõrge |
| **Kuivajõe → Milestone** | **Margus Plado + Jaanek Ubleja** | migratsioon ja tehniline lahendus | allikates otseselt seostatud `Teet Recording 578.docx` |
| **Mustvee Proxmox** | **TBD** | host/cluster admin, bridge'id, VLAN-id, VM loomine, CPU/RAM/storage | **oluline teadmata** |
| **PPA Domeenivõrk** | **TBD** | firewall, kasutajate C2 juurdepääs, DNS/FQDN, TLS, routing | **oluline teadmata** |
| **Smartec kaameravõrk** | **TBD** | backend, SIM/APN, serverite asukoht, routing, admin | **teadmata** |
| **KV võrk / KV Lattice Nodes** | **TBD** | Tallinn Node ↔ KV Node connectivity, firewall/ports | **teadmata** |
| **Lattice enda admin / deployment** | **TBD PPA/SMIT admin + Anduril** | Node deploy, upgrades, admin access, certificates, mesh configuration | **teadmata** |

Peep Põder tõuseb minu jaoks järjest tähtsamaks. SMIT-i vestluses öeldi tema kohta, et ta tegeleb väga palju nende teemadega ja tunneb ka PPA sisemist poolt; Mustvee/Idaseire ühenduste küsimused suunati samuti tema poole. `Mihkel smit liiga palju vasikas Recording 574.docx` `Raudsepp k6rvalt Recording 571.docx` Seega nimetaksin ta praegu **SMIT network/infrastructure coordination contact**, mitte konkreetse võrgu administraatoriks.

Teet Otsap on teistsugune kontakt: pigem **legacy surveillance technical SME**. Esko vestluses öeldakse, et ta on varasemaid hankeid teinud ja tehniliselt süsteemi tunneb. `Esko Recording 573.docx` Tema käest küsiks Mustasaare protokolli, driver'ite, kaamerate ja süsteemi ajaloo kohta, mitte tingimata firewall rule'i.

### Kõige olulisemad kontaktiaugud

Minu meelest peaksime nüüd leidma neli nime:

1. **Mustvee Proxmoxi administraator** - see inimene saab öelda, kuhu Lattice VM päriselt panna.
2. **PPA Domeenivõrgu firewall/routing admin** - Node 1 C2 kasutajate ja Turvavõrgu ühenduse jaoks.
3. **SMIT Idaseire network engineer / Juniperi admin** - võib olla Peep Põder või tema inimene.
4. **Smarteci tehniline admin** - sest Plado võib küll teada süsteemi, kuid me ei tea veel, kes päriselt võrgu/APN/backend'i haldab.

Ja ma teeks ühe kasuliku eristuse:

```text
Margus Plado
= Idaseire süsteemi/valdkonna omanik-kontakt

Viljar Unt
= radarite tehniline SME

Peep Põder
= SMIT võrgustiku/infrastruktuuri koordinatsioon

Egert Haan
= Turvavõrgu admin

TBD
= Mustvee Proxmox admin
```

See on juba päris hea „who-to-call“ kaart.

Veel üks huvitav vihje: intervjuudes öeldakse, et **PPA Milestone'i otsad on väga tugevalt ühe Egerti käes**. `Teet Recording 578.docx` Kui see on sama Egert Haan, siis Turvavõrgu + Milestone'i kontakt on meil tõenäoliselt ühe inimese näol juba olemas. Seda tasub temalt lihtsalt kinnitada.

## Prompt:
8/12/2026, 6:51:47 PM

kas olemasoleva info põhjal leiame nendest vestlustest veel olulisi vihjeid? Otsi teadaoleva põhjal vihjeid ja sisemist loogikat. (keeruline sest mõni rääkija pädevam kui teine, aga me teame et olemasolev on õige, saad oletada)
(parandus, mitte Teet Otsap  vaid Teet Raudsepp)

[Attachment: Mihkel smit liiga palju vasikas Recording 574(1).docx]

[Attachment: Erik vork Recording 572(1).docx]

[Attachment: Teet Recording 578(1).docx]

[Attachment: Teet2 ja rainer mula Recording 579(1).docx]

[Attachment: Esko Recording 573(1).docx]

[Attachment: Raudsepp k6rvalt Recording 571(1).docx]

[Attachment: Smit1 Recording 567.docx]

## Response:
8/12/2026, 6:51:49 PM

Jah. Võtan nüüd lähtekohaks, et sinu hiljem kinnitatud faktid on tugevamad kui mõne rääkija ebakindel sõnastus, ning kasutan vestlusi pigem **varjatud struktuuri leidmiseks**: kes päriselt teab mida, kus jooksevad halduspiirid ja milliseid tehnilisi mustreid saab korduvate vihjete põhjal järeldada. Ja parandus vastu võetud: **Teet Raudsepp**, mitte Otsap.

Üks selge muster juba paistab: **Teet Raudsepp on nendes vestlustes võrgu- ja seiretehnika detailides kõige kõrgema kaaluga allikas**. Erik ise ütleb mitu korda, et tehnika on talle „hall“ ja ta pole õige inimene; seega tema Smarteci/Turvavõrgu väide on hea näide infost, mida tuleks teadlikult alla kaaluda.  Teedu kirjeldused Juniperitest, lokaalsetest subnettidest, multicastist ja kaameraprotokollidest on seevastu väga konkreetsed ning sisemiselt kooskõlalised.

> **Koostan analüüsi**
>
> Ma eristan allikate kindlad väited, oletused ja vastuolud. Keskendun tehnilisele võrgupildile, kasutades kõige suurema kindlusega praktilisi kirjeldusi ning jätan kinnitamata detailid selgelt lahtiseks.
>
> **Koostasin analüüsi**
>
> 
>
> **Täpsustan arhitektuuri**
>
> Ma käsitlen keskset serverit SMITi hallatava keskkonna virtuaalmasinana, mis vahetab andmeid eraldatud võrkudega. Eraldi toon välja tõenäolised, kuid kinnitamist vajavad ühendused, näiteks mobiilne erivõrk, Turvavõrk ja piirkondlik radarivõrk.
>
> Juurdles 1m 34s

Jah. Kui võtta sinu hiljem kinnitatud faktid „ankruteks“ ja kaaluda rääkijaid pädevuse järgi, siis saab vestlustest veel päris palju välja pigistada. Ja parandus: käsitlen nime **Teet Raudsepp**; transkriptsiooni „Teetra Otsap“ on selles kontekstis vigane.

## Kõigepealt: kelle juttu kui palju usaldada

Minu praegune kaalumine oleks umbes selline:

| Allikas | Mille kohta tugev | Kaal |
|---|---|---:|
| **Teet Raudsepp** | Idaseire tehniline ehitus, Juniper, radarid, kaamerad, protokollid, Mustasaare | **väga kõrge** |
| **Margus Plado kaudu saadud info** | Idaseire süsteemi omand/korraldus, inimesed, süsteemid | **väga kõrge** |
| **SMIT tehnilised inimesed / Peep Põdra suunas viitavad vastused** | SMIT transport, serverikeskkond, routing, teenuse piirid | kõrge |
| **Esko** | operatiivne kasutus, milliseid süsteeme operaatorid kasutavad, võrgu-/süsteemipiirid | keskmine-kõrge |
| **Erik** | operatiivne üldpilt | keskmine-madal tehnilistes detailides |
| **Mihkli enda küsimused transkriptides** | hüpoteesid, mida parasjagu kontrollitakse | **ei ole tõend** |

Erik ütleb ise üsna otseselt, et tehnika osas pole ta õige inimene ja osa sellest on talle hall. See seletab hästi ka vale „Smartec on Turvavõrgus“ väidet. `Erik vork Recording 572.docx`

---

# 1. Idaseire paistab olevat **hierarhiliselt hallatud, aga mitte tingimata keskse topoloogiaga**

Teedu kõige väärtuslikum vihje on:

- igal **seirepositsioonil** on lokaalne subnet;
- positsioon on Juniperiga eraldatud;
- kui liiklus lahkub lokaalsest keskkonnast, on see krüpteeritud;
- võrguülene osa on SMIT-i hallata;
- lokaalses subnetis saavad seiretehnikud ise IP-sid/seadmeid majandada. `Teet2 ja rainer mula Recording 579.docx`

Seega sisemine loogika on tõenäoliselt:

```text
Idaseire võrk
│
├─ Seirepositsioon A
│   ├─ radar
│   ├─ kaamerad
│   ├─ muud seadmed
│   └─ Juniper ──┐
│
├─ Seirepositsioon B
│   └─ Juniper ──┤
│
├─ Mustvee ──────┤
│
├─ Narva ────────┤
│
└─ Tallinn? ─────┘
       │
   SMIT-managed
   protected transport
```

**Oluline uus järeldus:** Juniper pole ilmselt „Mustvee ruuter“. Juniper on pigem **Idaseire security/routing boundary standard**.

See tähendab, et diagrammil ei tasu Juniperit ainult Mustvee kõrvale joonistada.

---

# 2. Juniperid on tõenäoliselt ka kaamera-only positsioonidel

Teet parandab konkreetselt:

> igal radaripositsioonil - tegelikult igal **seirepositsioonil**, sest igal pool radarit pole, kus kaamera on.

`Teet2 ja rainer mula Recording 579.docx`

See on väga oluline vihje.

Järelikult:

- Idaseire ≠ radarivõrk;
- Idaseires on omaette kaamera-only seirepunkte;
- Idaseire kaamerate arv võib olla radarite arvust märgatavalt suurem.

See tugevdab ka meie varasemat küsimust: **kui palju kaameraid tegelikult Idaseires on?**

---

# 3. Radareid paistab olevat suurusjärgus „paarkümmend“

Raudsepa kõnes meenutatakse:

> Hanna ütles, et meil on mingi **paarkümmend termaradareid**.

`Raudsepp k6rvalt Recording 571.docx`

See pole inventarinumber, aga planeerimiseks on kasulik.

Ma kasutaks praegu:

> **Terma radar count: order of magnitude ~20, exact count TBD.**

Seega sinu 15-radari bandwidth-stsenaarium pole üldse ebarealistlik; kogu süsteemi upper planning case võiks olla pigem **20-25 radarit**.

---

# 4. Mustvee on järjest tugevamalt **rakenduslik keskpunkt**

Teet2 ütleb Mustvee kohta sisuliselt:

> see on koht, kuhu seirepositsioonid juba saadavad.

Ja räägib sellest kui „keskkohast“. `Teet2 ja rainer mula Recording 579.docx`

Raudsepa vestluses on veel konkreetsem:

> Narva operaatorite pilt käib Mustvee virtuaalmasina kaudu. `Raudsepp k6rvalt Recording 571.docx`

Arvestades sinu lisainfot Proxmoxi kohta, kõige tõenäolisem mudel on:

```text
Idaseire seirepositsioonid
          │
          ▼
  Mustvee serverikeskkond
       [Proxmox]
          │
     Mustasaare VM
          │
          ▼
   Narva operaatorid
```

Aga see **ei tõesta**, et kõik IP-paketid Idaseire võrgus käivad Mustvee kaudu.

Pigem:

> **Mustvee = application/data aggregation hub, mitte tingimata network hub.**

See distinction tasub dokumentatsiooni sisse panna.

---

# 5. Mustasaare server on väga tõenäoliselt VM, mitte eraldiseisev appliance

Raudsepa vestluses kasutatakse Mustvee süsteemi kohta otseselt sõna **virtuaalmasin**. `Raudsepp k6rvalt Recording 571.docx`

Koos sinu Proxmox-infoga:

```text
Mustvee Proxmox
├─ Mustasaare VM
├─ possibly other surveillance VMs
└─ planned Lattice VM
```

on praegu väga tugev oletus.

See annab ühe **väga kõrge väärtusega tehnilise päringu**:

```bash
/etc/network/interfaces
qm config <mustasaare-vmid>
ip route
bridge vlan show
```

Proxmoxi topoloogia võib korraga lahendada:

- millise bridge/VLAN-i kaudu radar tuleb;
- millisesse võrku Mustasaare VM kuulub;
- kas Lattice VM saab sama feed'i näha;
- kas üldse on vaja Mustasaare serverit puudutada.

---

# 6. Multicast-vihje on tugevam, kui varem arvasime

Kui küsitakse Terma UDP signaali split'i kohta, vastab Teet:

> **„Pigem on siuke multicast.“**

ja kohe põhjendab, et Idaseire radarite õhumärke juba jagatakse mujale. `Teet Recording 578.docx`

Ma ei kirjutaks veel:

> Terma feed = multicast

faktina.

Aga kirjutaks:

> **Existing radar distribution architecture likely already supports one-to-many distribution; multicast is a strong hypothesis.**

Viljarilt küsitav järjekord võiks olla:

1. kas radar → Mustvee feed on multicast või unicast;
2. kui multicast, milline group/port;
3. kas Lattice VM võib sama gruppi join'ida;
4. kas multicast läbib Juniperi/Idaseire võrku end-to-end;
5. kas Mustvee switch/Proxmox bridge edastab IGMP/multicast'i Lattice VM-ile.

---

# 7. Kui multicast on juba olemas, võib Lattice lisamine olla peaaegu tasuta

See on sisemise loogika põhjal oluline.

Kui praegu:

```text
Terma
  │
  └── multicast → Idaseire → Mustvee
                         └─ Mustasaare
```

siis:

```text
                         ├─ Mustasaare
                         └─ Lattice
```

ei pruugi radaripositsioon → Mustvee ühendusele **üldse uut täisfeed'i lisada**.

Ainult viimases segmendis toimub täiendav koopia.

See oleks võrgu seisukohalt ideaalne.

Aga kui praegu on:

```text
Terma ──unicast──► Mustasaare
```

ja radarile lisatakse teine unicast destination, siis kaugühenduse koormus tõenäoliselt kahekordistub selle feed'i osas.

Seega bandwidth-küsimuse vastus sõltub täielikult sellest ühest detailist.

---

# 8. Mustasaare süsteemi roll on veidi laiem kui „ainult radar“

Siin on huvitav sisemine vastuolu.

Esko ütleb:

> Mustasaare on „puhtalt radari integratsioon“. `Esko Recording 573.docx`

Teet aga kirjeldab väga konkreetselt:

- Idaseires on pöördkaamerad;
- umbes **10% kaameratest** kasutab oma/proprietary protokolle;
- Mustasaare on nende jaoks ise driver'eid teinud;
- need driver'id võimaldavad näiteks PTZ juhtimist. `Teet Recording 578.docx`

Minu süntees:

> **Mustasaare süsteemi põhifunktsioon on radaripõhine seire/integratsioon, kuid sellel on ka kaameraintegratsiooni ja PTZ-driverite funktsionaalsus.**

Ehk „Mustasaare VMS“ pole päris õige, aga „ainult radar“ on samuti liiga kitsas.

Hea töötermin:

> **Mustasaare radar and surveillance integration system**

---

# 9. ~90% Idaseire kaameratest võivad olla standardselt integreeritavad

Teet ütleb, et umbes **10%** kaameratest on oma protokollidega; ülejäänute puhul räägitakse standardsetest VMS/ONVIF-laadsetest lahendustest. `Teet Recording 578.docx`

See on Lattice'i jaoks päris suur vihje.

Võimalik tulevane jaotus:

```text
~90% Idaseire cameras
    → standard integration / ONVIF-like

~10%
    → proprietary protocol / vendor driver
    → perhaps Mustasaare integration required
```

Protsendid on Teedu hinnang, mitte inventar, aga arhitektuuriliselt väga kasulik.

---

# 10. Kagu võrke ei saa joonistada geograafia järgi - neid peab joonistama **seadmeklassi järgi**

Vestlused hakkavad siin väga hästi kokku sobima.

Kagus:

```text
Terma / termopositsioon
        → Idaseire võrk

suured piiriseirekaamerad
        → tõenäoliselt Idaseire võrk

"kännukaamerad" / rajakaamerad
        → Smartec kaameravõrk

perimeeter / läbipääs / häired /
Milestone kaamerad
        → Turvavõrk
```

Raudsepa vestluses jõutakse konkreetselt Saatse/Koidula/Värska termopositsioonide juures Idaseire/Mustasaare süsteemini. `Raudsepp k6rvalt Recording 571.docx`

Esko lisab, et geograafiline overlap on näiteks Värska kandis: veepoolne radariseire ja maismaapoolne Turvavõrgu/Milestone süsteem võivad füüsiliselt kõrvuti olla. `Esko Recording 573.docx`

See on väga kasulik joonistamisreegel:

> **Network membership follows system/function, not geography.**

Piusa kohta ma veel kindlat väidet ei teeks.

---

# 11. Smarteci arhitektuuri saab nüüd üsna hästi spekuleerida

Sinu paranduse järgi Smartec **ei ole Turvavõrgus**.

Raudsepa vestlus ütleb samuti:

- Smartec on eraldi võrk;
- seal on ainult „kännukaamerad“;
- seadmed on mobiilsed/akukaamerad;
- võrgu serverid paistavad olevat SMIT-i omad. `Raudsepp k6rvalt Recording 571.docx`

SMIT1 kinnitab eraldi, et Smartec tähendab mobiilkaameraid, mida liigutatakse metsas/piiril. `Smit1 Recording 567.docx`

Kõige loogilisem arhitektuuriline oletus oleks:

```text
Smartec camera
    │
 cellular
    │
 private APN / operator VPN ?      ← tugev hüpotees
    │
 Smartec backend
    │
 SMIT-hosted server environment ?
```

See seletaks korraga:

- miks räägitakse „eraldi võrgust“;
- miks transport on mobiilside;
- miks serverid võivad olla SMIT-i omad;
- miks see pole Turvavõrk.

**Private APN** on praegu hüpotees, mida tasub konkreetselt kontrollida.

---

# 12. PPA Domeenivõrk on ilmselt õige töötermin

SMIT1 on siin päris selge:

- kasutajad on tavalisest SMIT/PPA võrgust;
- C2 on veebiliides;
- sellele tehakse vajalik juurdepääs;
- Turvavõrgu andmed tuuakse adapteri/firewall-hole'ide kaudu Node'i juurde. `Smit1 Recording 567.docx`

See toetab meie praegust mudelit:

```text
PPA Domeenivõrgu users
          │ HTTPS
          ▼
SMIT Tallinna serverikeskkond
          │
    Lattice Node 1
```

Node **ei pea olema Domeenivõrgu liige**.

Vaja on ainult kontrollitud reachability't.

---

# 13. Node 1 arhitektuur on tegelikult juba algses SMIT vestluses peaaegu välja öeldud

Mihkli vestluses kirjeldatakse:

- VM SMIT serveris;
- Turvavõrgu adapter suunab sinna andmed;
- C2 avatakse PPA/SMIT kasutajavõrku;
- sama Node peab rääkima Idaseirega;
- sama Node peab hiljem rääkima KV-ga. `Mihkel smit liiga palju vasikas Recording 574.docx`

Ehk meie tänane arhitektuur pole tagantjärele välja mõeldud. See oli juba algse piloodi **implicit design**:

```text
                   KV
                    │
                    ▼
              Tallinn Node
             /      │       \
            /       │        \
Domain users   Turvavõrk   Idaseire
```

Ainult nüüd oskame network membership'i ja reachability't õigesti eristada.

---

# 14. Idaseire → KV olemasolev ühendus on oluline just Juniperi/topoloogia mõistmiseks

Kuigi see pole Lattice MVP flow, ütleb Teet, et Idaseire radarite õhumärki juba jagatakse. `Teet Recording 578.docx`

SMIT1-s öeldakse samuti:

> Idaseirest lähevad PPA radarid Kaitseväe võrku ja „Anna oskab täpsemalt rääkida“. `Smit1 Recording 567.docx`

See annab meile uue **kontakti/uurimisobjekti**:

**Anna - olemasoleva Idaseire ↔ KV radarandmevahetuse tehniline/korralduslik teadmine.**

Miks see väärtuslik on: temalt võib saada vastuse, kuidas SMIT täna teeb:

```text
Idaseire
   ↓
security boundary
   ↓
other organisation network
```

See võib paljastada:

- Juniperi tegeliku rolli;
- tunneli/topoloogia;
- firewall-põhimõtted;
- kes annab loa;
- kes konfigureerib.

---

# 15. Peep Põder ei pruugi olla administraator - ta paistab olevat **võtme-arhitekt / koordinatsioonipunkt**

Raudsepa kõnes, kui tekib küsimus:

> kuidas Tallinnas Idaseire külge saada?

vastus viib Peep Põdra juurde. `Raudsepp k6rvalt Recording 571.docx`

Mihkli SMIT vestlus ütleb, et Peep:

> teab väga palju neid teemasid ja PPA sisemisi süsteeme. `Mihkel smit liiga palju vasikas Recording 574.docx`

Seega ma muudaks kontaktitabelis tema rolli:

> **Peep Põder - SMIT infrastructure/network architecture & cross-domain coordination**

mitte „Juniperi admin“.

Ta tõenäoliselt teab **kes** päris Juniperi admin on.

---

# 16. Egert Haan on tõenäoliselt ka Milestone'i väga oluline tehniline kontakt

Teet ütleb, et PPA Milestone'i „otsad“ on väga suures osas ühe **Egerti käes**. `Teet Recording 578.docx`

Kuna sina tead, et Egert Haan administreerib Turvavõrku, on üsna tugev sisemine järeldus:

> **Egert Haan = Turvavõrgu + tõenäoliselt Milestone'i keskne tehniline kontakt.**

Seda tasub ainult temalt kinnitada, aga ma paneks juba kaardile küsimärgiga.

---

# 17. Operatiivne tähtsus: Narvas on Idaseire/Mustasaare põhisüsteem

Esko kirjeldab umbes:

> kui on viis operaatoritöökohta, siis neljal tehakse põhitööd Mustasaare/Narva süsteemiga ja üks võib olla Turvavõrgu jaoks. `Esko Recording 573.docx`

Numbrid pole ilmselt täpsed inventariandmed, aga see näitab **prioriteeti**:

```text
Narva operational primary
    = Idaseire / Mustasaare

secondary/object security
    = Turvavõrk
```

See toetab väga tugevalt Mustvee Lattice C2 mõtet Narva operaatoritele.

---

# 18. Üks potentsiaalselt väga oluline võrgu-risk tuleb SMIT1-st

SMIT-i inimene ütleb, et mõnedes piirkondades on võrk **juba üle satureeritud** ning video ja uute sensorite lisandumine võib seda kasvatada. `Smit1 Recording 567.docx`

See tähendab, et meie:

> raw radar jääb Mustveesse, mesh'is liiguvad track'id

pole ainult elegantne arhitektuur - see võib olla **reaalne nõue**.

Tulevase joonise juurde võiks panna põhimõtte:

> **Process high-volume sensor data locally; distribute derived tactical data through Lattice Mesh.**

See on täpselt see edge-compute argument, millega võrgutehnikutele Mustvee Node'i põhjendada.

---

## Praeguseks tekib päris hea „varjatud arhitektuur“

```text
                             KV võrk
                                │
                                │ Lattice
                                ▼
                    ┌─────────────────────┐
PPA Domeenivõrk ──► │ Tallinn Lattice Node│
     users           │ SMIT server env.   │
                    └──────┬──────────────┘
                           │
                 Lattice Data Mesh
                           │
                           ▼
                    ┌─────────────────┐
                    │ Mustvee Lattice │
                    │ Node / Proxmox  │
                    └────────┬────────┘
                             │
                      local radar ingest
                             │
──────────────────────── IDASEIRE VÕRK ──────────────────────
       │                        │                      │
    Juniper                  Juniper                Juniper
       │                        │                      │
 radar/camera site        camera-only site      radar/camera site
       │                                               │
       └────────────► Mustvee Mustasaare ◄────────────┘

PPA Turvavõrk ── controlled flow ──► Tallinn Node
   │
   └─ Milestone / security / drone sensors

Smartec kaameravõrk
   │
   └─ cellular trail/"kännu" cameras
```

### Kõige väärtuslikumad järgmised teadmata asjad

Nüüd küsiksin inimestelt **mitte enam üldisi arhitektuuriküsimusi**, vaid just neid:

1. **Viljar Unt:** kas Terma → Mustvee on multicast; group/port/feed type.
2. **Viljar:** mitu Terma radarit päriselt Idaseires on.
3. **Plado/Viljar:** mitu seirepositsiooni ja mitu Idaseire kaamerat.
4. **Mustvee Proxmox admin:** `vmbr`, VLAN-id, Mustasaare VM NIC-id ja radarifeedi tee.
5. **Peep Põder:** kuidas Idaseire Tallinna serverikeskkonda tehniliselt terminate/reach'itakse ja kes Junipereid haldab.
6. **Anna:** kuidas olemasolev Idaseire radar → KV andmevahetus tehniliselt tehtud on.
7. **Egert Haan:** Turvavõrk → Tallinn Node võimalik flow + kas ta on ka Milestone'i põhiadmin.
8. **Smartec kontakt:** kas mobiilikaamerad kasutavad private APN-i ja kus backend füüsiliselt/võrguliselt asub.

Kui need kaheksa vastust saame, siis minu hinnangul saab **80-90% PPA-poolsest päris võrguarhitektuurist** juba joonistada ilma spekulatiivsete joontega.



---
Powered by [ChatGPT Exporter](https://www.chatgptexporter.com)