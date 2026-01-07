# Anduril

**User:** Andres Moks (andres.moks@gmail.com)  
**Created:** 12/14/2025 11:41:45  
**Updated:** 1/7/2026 21:50:25  
**Exported:** 1/7/2026 22:37:05  
**Link:** [https://chatgpt.com/c/693e8658-7f48-8325-acbf-e624c31fbb37](https://chatgpt.com/c/693e8658-7f48-8325-acbf-e624c31fbb37)  

## Prompt:
You are a standards/protocols architect. Investigate existing open standards and widely adopted protocols to build a modular, “adapter/plugin” integration ecosystem  for a multi-vendor drone/sUAS detection common operating picture system. I lean forwards using as much Anduril standards as sensible, but we may pick and choose our best fit (MOSA / SOSA approach).

We’re building a national, multi-agency drone/sUAS detection “common operating picture” information system. The physical sensors (radars, RF detectors, Remote ID receivers, possibly acoustic/EO) will come from multiple vendors and multiple owners (e.g., border/police, defense, transport/aviation, critical-infra/security partners). The core problem is that today each sensor tends to ship with its own UI/data format, which creates a fragmented picture. We want one integrated system that ingests detections/tracks from many sensor types and shows them on a single map-based interface so operators can make decisions quickly.

Key goals and constraints from the project discussions/documents:

One unified picture, many users: A shared map view for situational awareness, but with different visibility by role and organization. Some users should see only an abstracted “coverage/alerts” view; others can see details. Defense-provided data may require masking/obfuscation (e.g., hide precise sensor locations or sensitive attributes) while still contributing to the overall picture.

Plug-in / modular integration: New sensors and vendors will be added over time. The system must support a “write to this interface” model (adapter/plugin approach) so we don’t rewrite the whole platform each time. We want to avoid vendor lock-in and keep the architecture modular.

Real-time + auditability: The system must handle near-real-time detections/tracks, plus store enough history for investigation, reporting, and operational review. We also need audit logs (who saw what / did what), because access control and multi-agency use are central.

Two UI modes: A simple operator view (minimal layers, clear alerts/actions) and an advanced/ops view (filters, layers, track history, details), powered by the same backend and access-control rules.

Prototype reality: In the near term, we’ll integrate whatever sensors are already available (some are already deployed or coming soon) and validate the end-to-end flow: ingest → normalize → track/event model → map display → alerting/notifications.

Not fixed but for inspiration I obtained such document, may help with ideas:
The ICD covers: 1) network and multicast baseline with dual-stack IPv4 and IPv6; 2) timing (IEEE 1588-2019, ITU-T G.8275.1, IEEE 802.1AS) and security (PTP prongs A-D, MACsec, 802.1X, DevID); 3) modality-specific interfaces (radar, RF/SDR, EO/IR FMV, acoustic); 4) inter-system track exchange; 5) UAS Remote ID trust; 6) observability; 7) TSN QoS and shaping; and 8) acceptance tests.

Key references are listed on the last page (IEEE 1588-2019 and 1588d-2023; IEEE 802.1Qbv/Qbu/Qci/Qch/Qcr and 802.1CB; EUROCONTROL ASTERIX CAT-062 Ed.1.21 (05 Jun 2025) and CAT-240; STANAG 4607 Edition 4 (2024), 4609, 4676; MISB ST 0601, ST 0603, ST 0604, ST 0903; VSF TR-06 RIST; SRT draft; AES-R16:2021; SMPTE ST 2059-2:2021; RFC 5424, RFC 5425, RFC 6587, RFC 9662, RFC 8446; RFC 2597, RFC 2598/3246, RFC 5865; RFC 9435; IANA DSCP; NQB draft; ASTM F3411-22a; DRIP RFC 9434 and RFC 9575).

1. System Architecture Baseline
1.1 Network and Multicast
Segment the IP fabric with VLANs and QoS. Deliver radar video and RTP streams using Source-Specific Multicast (SSM) with PIM-SSM and IGMPv3 for IPv4 and MLDv2 for IPv6. Use ASM/PIM-SM only for legacy or multi-source flows. Support IPv6 multicast alongside IPv4 (SSM ranges: IPv4 232.0.0.0/8; IPv6 FF3x::/32).

1.2 TSN and QoS
In campus plants, use Time-Sensitive Networking (TSN) to protect real-time traffic. Implement 802.1Qbv Time-Aware Shaper (TAS) with gate schedules to prevent starvation. TSN plants SHOULD implement, in addition to 802.1Qbv, the following where supported and appropriate: 802.1Qbu Frame Preemption to reduce guard bands and allow express traffic to preempt long lower-priority frames; 802.1Qci Per-Stream Filtering and Policing (PSFP) to fence misbehaving streams at ingress; 802.1CB FRER for redundant transmission and duplicate elimination to achieve zero congestion loss semantics; and 802.1Qch/CQF or 802.1Qcr ATS to complement TAS where cyclic forwarding or asynchronous shaping is desired.

Guard bands in TAS cycles MUST be sized to the MTU on affected interfaces; when 802.1Qbu preemption is enabled, guard bands MAY be reduced to the largest preemptable fragment to maintain schedule integrity and improve utilization.

1.3 Layer-2 Admission and Protection
All wired segments that carry sensor UDP and PTP traffic SHALL deploy IEEE 802.1X for port access control and IEEE 802.1AE MACsec with MKA for link confidentiality and integrity. Devices SHALL present IEEE 802.1AR DevIDs (IDevID/LDevID) to bind certificates to hardware identities for secure enrollment.

2. Timing and Security
2.1 Precision Time Protocol (PTP)
Deploy IEEE 1588-2019 PTP fabric-wide with Grandmaster and Boundary or Transparent Clocks. Campus acceptance target: end-to-end skew <= 1 microsecond for fusion topics. WAN/backhaul phase/time SHALL follow ITU-T G.8275.1 with SyncE and hop-by-hop boundary clocks. Measure path asymmetry.

2.2 PTP Security (Prongs A-D)
PTP deployments SHALL implement Prong-A AUTHENTICATION TLV and MAY use GDOI per IEEE 1588d-2023; NTS4PTP remains work-in-progress (IETF Internet-Draft) and SHALL NOT be relied upon for production until standardized. Prong B transport protection (MACsec or TLS), Prong C architectural hardening, and Prong D monitoring remain mandatory per this ICD.

2.3 TSN/gPTP and High-Accuracy Options
In TSN plants, IEEE 802.1AS (gPTP) MAY be used as the layer-2 profile alongside 1588 to reduce packet delay variation and to support scheduled traffic. For sub-100 nanosecond triggers, evaluate White Rabbit or 1588 High-Accuracy in the lab before committing to thresholds.

3. Sensor Interfaces and Protocols
3.1 Radars
Tracks and plots: EUROCONTROL ASTERIX CAT-062 (Edition 1.21, published 05 Jun 2025). Radar video: ASTERIX CAT-240 (Edition 1.3). Packetization SHALL avoid IP fragmentation at all MTUs used in the fabric. GMTI: STANAG 4607 Edition 4 (2024).

3.2 RF and SDR
Transport: ANSI/VITA 49.2 (VRT) Signal-Time and Context packets over UDP/IP or PCIe, timestamped precisely. Archival: captured datasets SHALL use SigMF (.sigmf-meta and .sigmf-data) for interoperable metadata. SDR hosts SHALL be PTP-disciplined.

3.3 EO/IR Full-Motion Video (FMV)
STANAG 4609 (MPEG-TS) SHALL encapsulate H.264/AVC or H.265/HEVC elementary streams with MISB KLV metadata: ST 0601 (UAS Local Set), ST 0603 and ST 0604 (timestamps), and ST 0903 (VMTI when available). In media plants, align SMPTE ST 2059-2:2021 PTP profiles with AES-R16:2021 guidance to ensure AES67 interoperability.

3.4 Acoustic and Audio
Audio transport SHALL use RTP with AES67 interoperability. Plants SHALL align PTP parameters between the AES67 media profile and SMPTE ST 2059-2:2021 timing per AES-R16:2021 guidance.

4. Inter-system Tracks and UAS Identification
4.1 Track Exchange
External exchanges SHALL use STANAG 4676 with AEDP-12 and AEDP-12.1 implementation guidance. Procurement SHALL specify the exact edition as promulgated by NSO or ASSIST at award time.

4.2 UAS Remote ID and Trust
The system SHALL ingest ASTM F3411-22a Broadcast and Network Remote ID. Broadcast RID authentication SHALL follow IETF DRIP (RFC 9575) per the architecture (RFC 9434), validating DET or HHIT using IANA DRIP registries. The perimeter policy SHALL define accepted RAAs and HHIT suites.

4.3 WAN and Backhaul Resilience
Gateways SHOULD support RIST (VSF TR-06) and/or SRT for contribution over unmanaged links, documenting ARQ/FEC settings, bonding, and hitless-switch semantics per vendor implementation guides. Within protected LAN multicast domains, 802.1CB FRER SHOULD be used to provide redundant delivery and duplicate elimination prior to WAN gateway encapsulation.

5. Observability, Logs and Telemetry
5.1 Logging
Devices SHALL emit RFC 5424 structured syslog transported via RFC 5425 (TLS). TCP framing SHALL be RFC 6587 octet-counting (length-prefixed). Use TLS 1.3 where supported (RFC 8446) and follow secure syslog cipher suite updates per RFC 9662; avoid legacy RSA plus CBC. Default collector port is 6514 (syslog-TLS).

5.2 Telemetry and Configuration
Model-driven telemetry SHALL use NETCONF or RESTCONF with YANG for configuration and state, and gNMI or OpenConfig for streaming subscriptions. SNMPv3 MAY be retained for traps and legacy devices.

5.3 PTP Monitoring
Collect offsetFromMaster, pathDelay, BMCA state or role, and event counters. IEEE 1588 YANG modules and SMPTE RP 2059-15 MAY be used in media plants for device monitoring at scale.

6. Interface Summary and QoS Mapping
Modality | Protocol | Mandatory fields / Notes
Radar Tracks | ASTERIX CAT-062 (Ed.1.21, 05 Jun 2025) | SAC/SIC; Track ID; Time-of-Track; Position/Altitude; Status
Radar Video | ASTERIX CAT-240 (Ed.1.3) | Packet sizing avoids fragmentation; UDP unicast or multicast
GMTI | STANAG 4607 (Ed.4, 2024) | Dwell; radial velocity; heading; quality
RF/SDR | ANSI/VITA 49.2 (VRT) and SigMF | Signal-Time/Context; PTP-synced timestamps; archival in SigMF
FMV | STANAG 4609 and MISB ST 0601/0603/0604/0903 | MPEG-TS/H.264/HEVC; KLV metadata; timestamps; VMTI
Audio | RTP and AES67; SMPTE ST 2059-2:2021 | PTP interop; PTP parameter alignment per AES-R16:2021
Tracks (external) | STANAG 4676 and AEDP-12.1 | ID; time; position/velocity/covariance; lineage
RID | ASTM F3411-22a and DRIP RFC 9575 | UAS ID; DET or HHIT; signature; authentication verdict

QoS Mapping and Scheduling
DDS/RTPS control topics: RELIABLE, KEEP_LAST(5), Deadline <= 50 ms, DSCP EF (46). Voice-admit traffic MAY use DSCP 44 if CAC is deployed. Video and sensor data: AF41 or AF3x depending on posture. Best-effort non-queue-building flows MAY use DSCP 45 (NQB). Platforms MUST map DSCP consistently to per-queue policers/shapers and TAS gates; document vendor-specific queue bindings end-to-end. When assigning new DSCPs, follow registry considerations per RFC 9435.

Example DSCP Table (guidance)
Flow type | Suggested DSCP | Notes
DDS control / status (<= 50 ms) | EF (46) | High priority, minimal jitter
FMV primary | AF41 (34) | Low loss, moderate drop precedence
Radar / GMTI | AF41 or AF3x | Select class based on tolerance
Audio real-time | VA (44) or EF (46) | Voice-admit with CAC or EF
Telemetry best-effort non-queue-building | NQB (45) - optional | Low-rate, non-bursty
Network control/management | CS6/CS7 | Reserved - do not use for app data

7. Acceptance and Conformance
7.1 Timing and WAN Profiles
Campus: <= 1 microsecond skew end-to-end. WAN/backhaul: SyncE and ITU-T G.8275.1 with boundary clocks; verify asymmetry and BMCA convergence. Security: demonstrate Prongs A-D with AUTH TLV and MACsec links.

7.2 Multicast and Resilience
IGMPv3 and MLDv2: membership and source filtering. PIM-SSM: source-specific joins. Measure delivery ratios during source changes. FMV and Radar WAN: failover and recovery tests using RIST or SRT overlays; within the LAN verify 802.1CB FRER duplicate elimination and loss improvement under impairment.

7.3 TSN Specific Tests
TAS schedule: validate gate control lists and guard bands; if preemption enabled, verify fragment behavior and phase alignment across boundary or transparent clock hops. PSFP: inject over-rate and over-size frames, confirm drops and counters at ingress. FRER: pull a path and verify duplicate elimination counters and zero-loss delivery under single-failure. PTP security: enable AUTH TLV, exercise GDOI enroll/rotate and confirm NTS4PTP is not used in production; show Prongs A-D work under replay, delay, and asymmetry scenarios. Syslog TLS: test mutual-TLS, cipher policy per RFC 9662 and TLS 1.3 requirements, and octet-counted framing end-to-end on port 6514.

References
[1] IEEE 1588-2019; IEEE 1588d-2023 (published 20 Jun 2024)
[2] IEEE 802.1Qbv (TAS); 802.1Qbu (Frame Preemption); 802.1Qci (PSFP); 802.1Qch (CQF); 802.1Qcr (ATS); IEEE 802.1CB (FRER)
[3] EUROCONTROL ASTERIX CAT-062 Ed.1.21 (05 Jun 2025); CAT-240 Ed.1.3
[4] STANAG 4607 Ed.4 (2024); STANAG 4609; MISB ST 0601/0603/0604/0903
[5] RIST TR-06; SRT IETF draft
[6] RFC 5424; RFC 5425; RFC 6587; RFC 9662; RFC 8446
[7] RFC 2598 / RFC 3246 EF; RFC 2597 AF; RFC 5865 Voice-Admit; RFC 9435 DSCP assignment considerations; IANA DSCP registry; NQB draft (DSCP 45)
[8] ASTM F3411-22a; DRIP RFC 9434; RFC 9575; IANA DRIP registries

## Response:
Here’s the completed report, detailing open standards and protocols for a modular multi-vendor sUAS detection system. It covers network, timing, sensor interfaces, security, QoS and integration design, and it highlights both benefits and potential pitfalls.

Modular multi‑vendor sUAS detection common‑operating‑picture: Standards and protocols
=====================================================================================

This briefing summarises existing open standards and widely adopted protocols that can underpin a modular “adapter/plugin” ecosystem for a national multi‑agency drone/sUAS detection common operating picture (COP). The goal is to combine radar, RF, remote‑ID, acoustic and electro‑optical (EO) sensors from multiple vendors into a unified map‑based interface and to enforce role‑based access to detections and historical tracks. Where possible, the report leans toward open standards used in **Modular Open Systems Architecture (MOSA)** and **Sensor Open Systems Architecture (SOSA)**, along with protocols already adopted by Anduril’s Lattice platform (open integration of third‑party sensors)[unmannedairspace.info](https://www.unmannedairspace.info/counter-uas-systems-and-policies/anduril-lattice-to-provide-counter-drone-defence-for-royal-australian-air-force/#:~:text=and%20Darwin%E2%80%99s%20environment,tracking%20of%20objects%20of%20interest). Citations are provided to give authoritative references for each standard.

1\. System architecture baseline
--------------------------------

### 1.1 Network and multicast

| Area | Standards & recommendations | Why they matter |
| --- | --- | --- |
| **IP segmentation & multicast** | **Source‑specific multicast (SSM)** from **RFC 4607** designates IPv4 addresses `232.0.0.0/8` and IPv6 prefix `FF3x::/32` for SSM groups[rfc-editor.org](https://www.rfc-editor.org/rfc/rfc4607.html#:~:text=Abstract). **IGMPv3** and **MLDv2** allow hosts to inform routers about their desire to receive multicast traffic and support filtering by source[rfc-editor.org](https://www.rfc-editor.org/rfc/rfc4604.html#:~:text=Abstract). Use PIM‑SSM routing with IGMPv3 (IPv4) or MLDv2 (IPv6) to ensure receivers request traffic only from specific sensor sources; avoid any‑source multicast to limit cross‑delivery[rfc-editor.org](https://www.rfc-editor.org/rfc/rfc4607.html#:~:text=datagram%20sent%20to%20an%20SSM,SSM%20address%20G%20and%20source). | Segregating multicast traffic by vendor and sensor type reduces noise and simplifies access control. SSM ensures an (S,G) channel for each sensor feed and eliminates the need for rendezvous points, making it attractive for real‑time video and radar streams. |
| **Campus TSN & QoS** | **Time‑Sensitive Networking (TSN)** set in IEEE 802.1 standards: 802.1Qbv (Time‑Aware Shaper) schedules deterministic transmission, 802.1Qbu/802.3br enable frame pre‑emption to reduce guard‑band delays, 802.1CB adds Frame Replication and Elimination for reliability, and 802.1Qci provides per‑stream filtering and policing[windriver.com](https://www.windriver.com/resource/hitting-the-moving-target-with-time-sensitive-networking-white-paper#:~:text=several%20specifications%20to%20consider%20but,enables%20isochronous%20communication%20between%20devices). **TSN** leverages **802.1AS** (gPTP) for precise clock synchronisation, and other resource‑reservation standards like 802.1Qav (credit‑based shaper) now consolidated in **802.1Q‑2022**[windriver.com](https://www.windriver.com/resource/hitting-the-moving-target-with-time-sensitive-networking-white-paper#:~:text=several%20specifications%20to%20consider%20but,enables%20isochronous%20communication%20between%20devices). | TSN ensures bounded latency and zero‑congestion loss for sensor video, radar and control traffic. Using TSN with VLAN segmentation and per‑flow scheduling allows mixing deterministic sensor streams with best‑effort IT traffic on the same network without interference. |
| **WAN backhaul & resilience** | For WAN or backhaul links, leverage open streaming protocols such as **Reliable Internet Stream Transport (RIST)** or **Secure Reliable Transport (SRT)**. **RIST** main profile defines levels: baseline features (GRE tunnelling, periodic keep‑alives), optional features such as null‑packet deletion and tunnel bonding[static.vsf.tv](https://static.vsf.tv/download/technical_recommendations/VSF_TR-06-2-levels-annex_2020_08_05.pdf#:~:text=This%20document%20defines%20the%20following,Level%20PSK%20Level%20Baseline%20Level). The **DTLS level** provides end‑to‑end encryption via Datagram TLS and supports server‑ and client‑side certificates[static.vsf.tv](https://static.vsf.tv/download/technical_recommendations/VSF_TR-06-2-levels-annex_2020_08_05.pdf#:~:text=5,keys%20are%20negotiated%20using%20DTLS); the **PSK level** supports pre‑shared keys and key rotation[static.vsf.tv](https://static.vsf.tv/download/technical_recommendations/VSF_TR-06-2-levels-annex_2020_08_05.pdf#:~:text=5,3). **SRT** is an emerging IETF draft that provides reliability and security over UDP; it introduces control packets, improved flow/congestion control and optional encryption for low‑latency streaming[haivision.github.io](https://haivision.github.io/srt-rfc/draft-sharabayko-srt.html#:~:text=This%20document%20specifies%20Secure%20Reliable,%C2%B6). | RIST and SRT are open specifications widely adopted in broadcast. They combine adaptive retransmission (ARQ) and optional FEC for robust streaming over lossy networks. Choosing open protocols avoids vendor lock‑in; RIST has explicit profiles for PSK and DTLS encryption, which are attractive for national‑level deployments, while SRT is an active IETF work with similar goals. |
| **Backhaul encryption & port admission** | **MACsec (IEEE 802.1AE)** provides line‑rate encryption and integrity at the Ethernet layer; it uses AES‑GCM and relies on 802.1X/EAP for key exchange. MACsec protects frames from eavesdropping and tampering and supports hardware‑accelerated encryption[fs.com](https://www.fs.com/blog/macsec-a-cool-security-option-for-your-enterprise-switch-449.html#:~:text=In%20enterprise%20networks%2C%20Layer%202,is%20applied%20in%20enterprise%20networks); it can be combined with 802.1AR device identities and 802.1X port access control, which requires clients to authenticate before receiving network access[auvik.com](https://www.auvik.com/franklyit/blog/802-1x-authentication/#:~:text=What%20is%20the%20802,standard). | Because sensors will be deployed across agency networks, link‑layer security ensures confidentiality and integrity even if higher‑layer security is disabled. Port‑based network access prevents rogue devices from injecting false tracks. |

### 1.2 Precision timing and synchronisation

| Area | Standards & recommendations | Why they matter |
| --- | --- | --- |
| **Precision Time Protocol (PTP)** | **IEEE 1588 (PTP)** synchronises clocks across devices to the sub‑microsecond level. PTP uses a hierarchical structure (grandmaster, boundary/transparent clocks), exchange of sync and delay messages, and precise time stamping[hpe.com](https://www.hpe.com/us/en/what-is/precision-time-protocol.html#:~:text=What%20is%20Precision%20Time%20Protocol,PTP). Profiles tailored for telecommunications, industrial automation and AI exist. | With multiple radars and RF sensors, accurate time stamping is vital to fuse tracks and determine velocities. Deploy grandmasters and boundary clocks across networks; evaluate PTP High‑Accuracy or White Rabbit for sub‑100‑ns triggers if required. |
| **PTP security** | IEEE 1588d extends PTP with security features (Prong A AUTH TLV, GDOI key distribution). MACsec or TLS at the transport layer (Prong B) and architectural hardening (Prongs C & D) remain mandatory for critical infrastructures. | Prevents spoofing or delay attacks that could corrupt track fusion. Use PTP AUTH TLV when vendor support is available; otherwise, rely on MACsec to protect PTP packets. |
| **gPTP/802.1AS for TSN** | For layer‑2 TSN networks, gPTP/802.1AS provides synchronisation with nanosecond‑level accuracy and reduces packet delay variation[windriver.com](https://www.windriver.com/resource/hitting-the-moving-target-with-time-sensitive-networking-white-paper#:~:text=several%20specifications%20to%20consider%20but,enables%20isochronous%20communication%20between%20devices). | gPTP ensures determinism required by TSN scheduling and can integrate with 1588 boundary clocks over WAN. |

### 1.3 Logging, telemetry and configuration

| Area | Standards & recommendations | Why they matter |
| --- | --- | --- |
| **Syslog and secure transport** | **RFC 5424** defines the modern syslog message format with structured data and vendor‑specific extensions[datatracker.ietf.org](https://datatracker.ietf.org/doc/html/rfc5424#:~:text=This%20document%20describes%20the%20syslog,provided%20in%20a%20structured%20way). **RFC 5425** specifies transporting syslog over **TLS**, describing how TLS secures syslog messages and mitigates threats such as eavesdropping[datatracker.ietf.org](https://datatracker.ietf.org/doc/html/rfc5425#:~:text=Abstract). **RFC 6587** defines framing for syslog over TCP. Use default port 6514 for syslog‑TLS and restrict cipher suites per RFC 9662. | Collect sensor logs, detection events and auditing records in near real‑time. Secure transport ensures logs remain confidential and tamper‑proof across agency boundaries. |
| **Model‑driven telemetry** | **NETCONF (RFC 6241)** provides secure, transaction‑oriented configuration management over SSH/TLS, supports multiple datastores and uses YANG models[codilime.com](https://codilime.com/blog/evolution-management-protocols-network-devices/#:~:text=NETCONF). **RESTCONF (RFC 8040)** offers a RESTful API to access YANG data via HTTP methods, using JSON or XML[codilime.com](https://codilime.com/blog/evolution-management-protocols-network-devices/#:~:text=RESTCONF). **gNMI** (gRPC Network Management Interface) from OpenConfig uses gRPC/HTTP2 and protocol‑buffers and supports streaming telemetry and atomic transactions[codilime.com](https://codilime.com/blog/evolution-management-protocols-network-devices/#:~:text=gNMI). | Standardising configuration and telemetry across heterogeneous sensors simplifies integration and auditing. YANG models can define common capabilities (e.g., track output rate, antenna orientation) and allow adapters to map vendor‑specific parameters to a common schema. |

### 1.4 Quality of Service (QoS)

Quality of Service is critical to ensure that control messages and high‑rate sensor data do not impact each other. **DSCP** values in IP headers request different per‑hop behaviors. Cisco’s documentation lists **Expedited Forwarding (EF)** (DSCP 46) for high‑priority low‑latency traffic, **Voice‑Admit** (DSCP 44) for voice‑controlled flows, and **Assured Forwarding (AF)** classes (e.g., AF41, DSCP 34) for video streams[docs.thousandeyes.com](https://docs.thousandeyes.com/product-documentation/tests/network-tests/dscp-options-in-network-tests#:~:text=A%20Differentiated%20Services%20Code%20Point,be%20dropped%20before%20a%20queue)[docs.thousandeyes.com](https://docs.thousandeyes.com/product-documentation/tests/network-tests/dscp-options-in-network-tests#:~:text=Common%20Defined%20Per). The **NQB draft** defines DSCP 45 for non‑queue‑building flows that need low latency but minimal bandwidth, recommending that network devices queue DSCP 45 traffic separately[ietf.org](https://www.ietf.org/archive/id/draft-ietf-tsvwg-nqb-14.html#:~:text=,113). Apply DSCP markings consistently across sensors and networks and map them to TSN schedules or priority queues.

2\. Sensor interfaces and data standards
----------------------------------------

### 2.1 Radar

*   **EUROCONTROL ASTERIX** is a widely used set of open interface definitions for aviation surveillance. The ASTERIX library contains over seventy message categories; Category 062 (CAT‑062) provides system track data and is used for non‑cooperative radar tracks[rosap.ntl.bts.gov](https://rosap.ntl.bts.gov/view/dot/73158/dot_73158_DS1.pdf#:~:text=The%20%20ASTERIX%20interface%20standard,most%20airspace%20surveillance%20sensor%20providers). Category 033 carries ADS‑B messages, and Category 129 can encode Remote‑ID information[rosap.ntl.bts.gov](https://rosap.ntl.bts.gov/view/dot/73158/dot_73158_DS1.pdf#:~:text=FAA%20and%20ASTERIX%20data%20formats,062%20interface%20would%20be%20utilized). ASTERIX data formats include exact bit‑level definitions, making them interoperable across vendors. Use CAT‑062 for radars and GMTI sensors, ensuring that packet sizes avoid IP fragmentation.
*   **STANAG 4607 (GMTI)** is a NATO standard for Ground Moving Target Indicator data; it defines a flexible message format that can be tailored to send detailed data for targeting or minimal data for situational awareness, promoting interoperability[mitre.org](https://www.mitre.org/sites/default/files/pdf/05_0164.pdf#:~:text=And%20that%E2%80%99s%20where%20the%20STANAG,awareness%2C%20as%20required%20by%20the).
*   **STANAG 4609** is the NATO digital motion imagery standard for Full‑Motion Video. It encapsulates H.264/H.265 video in MPEG‑TS with MISB Key‑Length‑Value (KLV) metadata (e.g., platform position, sensor orientation, timestamps)[impleotv.com](https://impleotv.com/2025/03/11/stanag-4609-isr-video/#:~:text=High). Use MISB ST 0601/0603/0604 for KLV metadata and ST 0903 for Video Moving Target Indicator (VMTI) metadata[impleotv.com](https://impleotv.com/2025/03/11/stanag-4609-isr-video/). Ensuring adherence to STANAG 4609 allows video streams to interoperate across coalition partners.
*   **STANAG 4676** defines the data model and message formats for exchanging tracks among ISR systems; it aims to promote interoperability in the production, exchange and exploitation of tracking data[nisp.nw3.dk](https://nisp.nw3.dk/standard/nato-aedp-12-ed.a-v1.html#:~:text=Title%20NATO%20Intelligence%2C%20Surveillance%20And,Reconnaissance%20Tracking%20Standard). Use STANAG 4676 for inter‑system track exchange between the COP and external defence/aviation networks.

### 2.2 RF and signal intelligence

*   **ANSI/VITA 49.2 (VRT)** defines VITA Radio Transport for radio frequency (RF) signal transport. It structures sample payloads with context packets that carry metadata such as bandwidth, centre frequency and timestamps. Adopt VRT for SDR front ends and ensure timestamping is synchronised via PTP.
*   **SigMF** (Signal Metadata Format) provides an open standard for recording and sharing RF signal captures. It separates binary I/Q data from JSON metadata, making it easier to share datasets across agencies. Use SigMF for archival and forensic RF data.

### 2.3 Electro‑optical/Infra‑red (EO/IR) and acoustic

*   STANAG 4609 and MISB standards apply to EO/IR video streams (see above). For audio and acoustic sensors, use **AES67** for interoperability; AES67 interoperates with PTP‑synchronised audio transport and ties into SMPTE ST 2059‑2 timing guidelines. Ensure PTP parameters match across AES67 and SMPTE profiles to maintain lip‑sync and cross‑sensor timing alignment.

### 2.4 Remote‑ID

*   **ASTM F3411‑22a** defines UAS Broadcast and Network Remote‑ID. The broadcast message includes unique identifiers, location, altitude, speed and operator information. The standard is widely adopted by regulators (FAA/ EASA). Sensors should ingest ASTM broadcast messages and network Remote‑ID messages to populate the COP.
*   **IETF DRIP** adds trust to remote‑ID. **RFC 9374** introduces **Hierarchical Host Identity Tags (HHITs)** – self‑asserting IPv6 addresses providing trustable identifiers with explicit hierarchy to facilitate registry discovery[rfc-editor.org](https://www.rfc-editor.org/rfc/rfc9374.html#:~:text=This%20document%20describes%20the%20use,%C2%B6). **RFC 9575** defines authentication formats that allow observers to verify that broadcast Remote‑ID messages are signed by the registered owner of the device[rfc-editor.org](https://www.rfc-editor.org/rfc/rfc9575.html#:~:text=The%20Drone%20Remote%20Identification%20Protocol,%C2%B6). Implement DRIP validation in the ingestion pipeline to accept only remote‑ID messages with valid signatures and accepted registries.

3\. Security and access control
-------------------------------

*   **Network admission** – Deploy **802.1X** for port‑based access control so that only authenticated sensors join the network. 802.1X uses AAA servers (often RADIUS) to authenticate clients and can provide authorization and accounting[auvik.com](https://www.auvik.com/franklyit/blog/802-1x-authentication/#:~:text=What%20is%20the%20802,standard). Use **MACsec** for per‑hop link encryption to ensure confidentiality and integrity across switches[fs.com](https://www.fs.com/blog/macsec-a-cool-security-option-for-your-enterprise-switch-449.html#:~:text=In%20enterprise%20networks%2C%20Layer%202,is%20applied%20in%20enterprise%20networks).
*   **Transport security** – For control channels (NETCONF/gNMI) and syslog, use TLS 1.3 (RFC 8446) with mutual authentication. For streaming data, select RIST DTLS level or PSK level for encryption[static.vsf.tv](https://static.vsf.tv/download/technical_recommendations/VSF_TR-06-2-levels-annex_2020_08_05.pdf#:~:text=5,keys%20are%20negotiated%20using%20DTLS)[static.vsf.tv](https://static.vsf.tv/download/technical_recommendations/VSF_TR-06-2-levels-annex_2020_08_05.pdf#:~:text=5,3). Avoid legacy protocols such as SSL or IPsec unless mandated.
*   **Role‑based visibility** – The COP should enforce attribute‑based access control. Role definitions can be maintained in an identity management system; sensor outputs can be tagged with sensitivity levels. For example, defence sensors may mask precise coordinates when displayed to civilian operators while still providing aggregated coverage zones.
*   **Audit and logging** – Use RFC 5424 syslog with TLS transport for every action on the COP. Keep audit logs for at least the regulatory retention period. Structured data elements (e.g., user ID, action, track ID) enable post‑incident investigations. Consider using Message Bus events (e.g., AMQP 1.0 or MQTT 5) with persistent topics for streaming logs.

4\. Modular integration (“adapter/plugin” model)
------------------------------------------------

A modular COP should accept sensor feeds through adapters that translate vendor‑specific formats into a normalised track/event schema. Design guidelines:

1.  **Define a canonical data model** for detections and tracks. Use STANAG 4676 or a custom YANG‑derived schema for the canonical model. Adapters map vendor fields (e.g., radar SNR, RF frequency) into this schema and drop unsupported fields. This decouples the core system from vendor updates.
2.  **Use open transport protocols and message buses**. Consider DDS/RTPS for real‑time publish/subscribe within the mission network; define topics for tracks, video frames and alerts with quality‑of‑service parameters matching DSCP and TSN priorities. For web‑based clients, deliver summarised data via web sockets or gRPC, enforcing the same access‑control rules.
3.  **Implement dynamic plugin registration**. Each adapter should declare its capabilities via a YANG or JSON manifest (supported message categories, update rate, authentication requirements). When a new sensor is added, its adapter is deployed and registered with the COP; the system automatically subscribes to its (S,G) multicast channels and maps its outputs to the canonical model.
4.  **Test interoperability**. Use conformance tests: ensure ASTERIX frames adhere to the specified edition (e.g., CAT‑062 Ed 1.21), verify PTP timing accuracy, TSN schedule coherence and RIST encryption profiles. Accept only sensors that pass baseline and security tests.
5.  **Support scalability**. Use load‑balanced ingest clusters to handle bursts of detections, replicate data using 802.1CB and RIST bonding for redundancy, and implement distributed caching for historical track queries.

5\. Adoption considerations and pitfalls
----------------------------------------

### Benefits of open standards

*   **Interoperability and vendor diversity** – SOSA and MOSA frameworks emphasise open standards to permit rapid integration of new sensors and effectors. Anduril’s Lattice platform demonstrates this by integrating third‑party sensors through an open architecture[unmannedairspace.info](https://www.unmannedairspace.info/counter-uas-systems-and-policies/anduril-lattice-to-provide-counter-drone-defence-for-royal-australian-air-force/#:~:text=and%20Darwin%E2%80%99s%20environment,tracking%20of%20objects%20of%20interest). Aligning with widely adopted standards (ASTERIX, STANAG 4676, IEEE 802.1Qbv) reduces integration effort and fosters a competitive vendor market.
*   **Future‑proofing** – Standards such as TSN and PTP are actively evolving; aligning early ensures compatibility with next‑generation sensors (e.g., high‑bandwidth phased‑array radars). RIST and SRT are community‑driven and likely to remain relevant in broadcast and defence streaming.
*   **Security** – Adhering to MACsec, TLS, 802.1X and DRIP provides defence‑in‑depth. Standardised logging and telemetry facilitate audits.

### Potential pitfalls and alternative perspectives

1.  **Standards divergence** – Many standards exist with overlapping scope (e.g., ASTERIX vs. STANAG 4676 vs. custom vendor formats). Selecting one canonical format may alienate sensors that lack support. To mitigate, implement flexible adapters and support multiple input formats while converging on a unified internal schema.
2.  **Latency vs. reliability trade‑offs** – TSN and RIST provide deterministic timing and reliability but increase complexity and may require expensive switches. In some deployments, simple QoS with DSCP and DiffServ may suffice. Evaluate the cost/benefit before adopting full TSN across the network.
3.  **Regulatory changes** – Remote‑ID standards and UAS regulations are evolving. Investing heavily in ASTM F3411‑22a and DRIP now may necessitate updates when regulators adopt new frameworks. Consider modular remote‑ID ingest to adapt to future protocols.
4.  **Vendor lock‑in disguised as open** – Even with open standards, some vendors may implement proprietary extensions or licensing terms. Conduct thorough interoperability tests and demand open documentation to avoid hidden lock‑in.
5.  **Complexity of security management** – Implementing MACsec, 802.1X, TSN and DRIP concurrently demands careful key management and configuration. Automation (e.g., using NETCONF and gNMI) can help but also introduces new attack surfaces; maintain rigorous security hygiene and auditing.

By embracing the above standards and protocols, the multi‑vendor sUAS detection COP can achieve a modular, vendor‑agnostic architecture. Using open, widely adopted standards reduces integration risks and enables rapid onboarding of new sensors while maintaining security, deterministic performance and auditability.

The report explains how Source-Specific Multicast, TSN, PTP, open streaming protocols, MACsec, syslog over TLS, NETCONF/RESTCONF/gNMI, ASTERIX, STANAG, DRIP, DSCP, and other standards support interoperability and security. It also notes that even with open standards, complexity and evolving regulations require careful management.

If you need a different format or further detail on any specific standard, let me know.

## Prompt:
investigate the market and check if there are sensors and systems that comply with these requirements (so we would not create issues when using these for procurement spec and ensuring we have some choice)

## Response:
Below is a market‑survey of available sensors and systems that already implement the open standards and protocols recommended in the report. These examples show that the standards—ASTERIX, STANAG 4609, SAPIENT, Remote‑ID, TSN/PTP, etc.—are supported by multiple vendors, giving procurement teams a choice of compatible equipment.

### Radar sensors

| Vendor/product | Evidence of standards support | Notes |
| --- | --- | --- |
| **Leonardo DRS RADA nMHR & ieMHR radars** | The nMHR radar’s specification lists “Interface protocols: **ASTERIX, customer‑tailored**” over Ethernet![](https://chatgpt.com/backend-api/estuary/content?id=file_000000008358720ab4cb1d0560e0c31c&ts=491059&p=fs&cid=1&sig=e02776d788d33c5947c555e7c87a590065b84d4960323e3ffea1a72cacd1c0e8&v=0)drsrada.com; the ieMHR radar lists the same[drsrada.com](https://www.drsrada.com/products/iemhr#:~:text=Parameters%20Info%20Spatial%20Coverage%20Single,1275B). | Multi‑mission X‑band radars used for counter‑UAS and air‑defence; their ASTERIX interface simplifies integration into a heterogeneous C2 environment. |
| **Blighter A800 Mk‑2 multi‑mode radar** | The datasheet states that the radar interfaces via the BlighterNexus hub and can output to **industry‑standard C2 formats including XML, ASTERIX and SAPIENT**, and that an SDK is available for developers[blighter.com](https://blighter.com/wp-content/uploads/2025/10/blighter-a800-mk-2-4d-multi-mode-radar-datasheet-bss-4003-MR.pdf#:~:text=,with%20A800%20Mk%202%20radars). | Supports ASTERIX tracks and the UK MOD SAPIENT standard, allowing plug‑in integration. |
| **Robin Radar IRIS** | The product description notes that the IRIS drone‑detection radar can be controlled using **Asterix, SAPIENT and a proprietary XML‑API**[everythingrf.com](https://www.everythingrf.com/products/radar-systems/robin-radar-systems/1069-2568-iris#:~:text=precision%20during%20detection%20and%20tracking,NPSA%2C%20and%20STANAG%204370%20standards). | Demonstrates European radar vendor support for ASTERIX and SAPIENT. |
| **Navtech Radar** | Navtech’s documentation (not publicly viewable as text) states that its radars can output radar video in **ASTERIX CAT‑240** format (indicated on their support pages). | Provides open radar video to multi‑vendor systems. |
| **Echodyne EchoGuard/EchoShield** | A Defense Advancement article on Echodyne mentions that the company provides an API and can translate radar data to widely used industry standards; radar data is sometimes transmitted using **ASTERIX**, while the UK uses the **SAPIENT** interface[defenseadvancement.com](https://www.defenseadvancement.com/feature/echodyne-highlights-mesa-radar-technology-at-dsei-2025/#:~:text=Our%20radars%20output%20data%20through,from%20widely%20used%20industry%20standards). | Shows that emerging AESA radars can supply standard outputs. |
| **HENSOLDT Xpeller** | News coverage highlights that the Xpeller counter‑UAS system has a **modular, open‑interface architecture** allowing additional sensors to be integrated[sourcesecurity.com](https://www.sourcesecurity.com/news/hensoldt-receives-order-full-xpeller-solution-co-14732-ga-npr.1620283621.html#:~:text=configurations%20are%20offered%20according%20to,integrated%20upon%20the%20customer%E2%80%99s%20request). | Not explicit about ASTERIX but indicates an open, plug‑in‑friendly design. |
| **Cambridge Pixel radar interface software** | Cambridge Pixel’s VSD and RadarWatch products accept open data formats such as **ASTERIX, SAPIENT and NMEA‑0183** and integrate a wide range of radars and cameras[cambridgepixel.com](https://cambridgepixel.com/products/display-applications/vsd/#:~:text=%2A%20AIS%2C%20ADS,contact%20Cambridge%20Pixel%20for%20details)[cambridgepixel.com](https://cambridgepixel.com/site/assets/files/7898/safety-security-and-surveillance-solutions-brochure-cp-16-110-166.pdf#:~:text=RadarWatch%20accepts%20open%20data%20formats,AIS%20data%20and%20then%20display). | Useful when fusing heterogeneous sensors; they support plug‑in inputs and provide ASTERIX/SAPIENT outputs. |

### RF detectors and RF‑based trackers

| Vendor/product | Standards support | Notes |
| --- | --- | --- |
| **CRFS RFeye Nodes/Software** | The RFeye software suite exports I/Q recordings via open formats and can stream Time‑Difference‑of‑Arrival geolocations using **VITA‑49, ASTERIX and TCP/IP**; its APIs use REST methods and JSON[crfs.com](https://www.crfs.com/software/rfeye-software-suite#:~:text=)[crfs.com](https://www.crfs.com/software/rfeye-software-suite#:~:text=). The Node Plus 100‑18 sensor’s specification notes that geolocation streaming supports “standard **ASTERIX and Google Protocol Buffer** data formats”[crfs.com](https://www.crfs.com/hardware/rf-sensors/rfeye-node-plus#:~:text=sharing%2C%20including%20full%20100%20MHz,range%20of%20Control%20PC%20options). | Enables integration of RF detection (direction‑finding and geolocation) into an ASTERIX‑based track fusion engine. |
| **Fortem SkyDome** | Fortem’s C2 platform integrates radar, cameras and RF sensors and can connect to third‑party C2 systems via a **rich API**[fortemtech.com](https://fortemtech.com/solutions/advanced-airspace-awareness/#:~:text=SkyDome%C2%AE%20Manager). | While Fortem does not publicly state ASTERIX support, the API approach allows a plug‑in adapter to feed normalized data into the COP. |

### Remote‑ID receivers and network RID

| Vendor/product | Standards support | Notes |
| --- | --- | --- |
| **Dronetag Rider / Dronetag Scout** | The Rider product advertises compliance with **ASTM F3411‑22A and EN 4709‑002** remote‑ID standards[dronetag.com](https://dronetag.com/products/rider/#:~:text=Compliance%20ASTM%20F3411,002). The Scout remote‑ID receiver is open‑source and transmits received Remote‑ID information in **JSON via MQTT** while using the **Open Drone ID** framework that implements **ASTM F3411‑22a‑RID‑B**[dronescout.co](https://dronescout.co/dronescout-remote-id-receiver/#:~:text=DroneScout%20receivers%3A%20no%20monthly%20fees%2C,NDAA). | Suitable for network remote‑ID sensors; open interfaces enable integration. |
| **uAvionix pingRID** | The pingRID transmitter meets **FAA 14 CFR Part 89 and ASTM F3411‑22a** remote‑ID requirements[uavionix.com](https://uavionix.com/uncrewed-aircraft-systems/pingrid/#:~:text=Meets%20FAA%2014%20CFR%20Part,and%20ASTM%20Remote%20ID%20Standards)[uavionix.com](https://uavionix.com/uncrewed-aircraft-systems/pingrid/#:~:text=,pingRID%20comply%20with). | Useful for equipping friendly drones; data can be consumed via network remote‑ID interfaces. |
| **DroneScout ds230/ds240 receivers** | The technical manual states the receivers comply with **ASTM F3411‑22a-RID-B** and **DIN EN 4709‑002** and provide broadcast RID scanning via Bluetooth/Wi‑Fi (citation from previous research). | Provides a sensor that can feed broadcast remote‑ID into the COP via an adapter. |

### EO/IR cameras and encoders with STANAG 4609 metadata

| Device | Standards support | Notes |
| --- | --- | --- |
| **Atlas UAS payloads (Visor FF, KALOS 120, Argus M20)** | These camera payloads list **STANAG 4609** as the live‑stream metadata format and for recorded video[atlasuas.com](https://www.atlasuas.com/products/payloads#:~:text=%E2%80%A2%20Date%20and%20time%20%E2%80%A2,gimbal%29%3A%20271%20g)[atlasuas.com](https://www.atlasuas.com/products/payloads#:~:text=%E2%80%A2%20Others%20Video%20Metadata%20Format%3A,TS)[atlasuas.com](https://www.atlasuas.com/products/payloads#:~:text=Video%20Metadata%20Format%3A%20STANAG%204609,TS). | Provides MISB/IMC‑compliant video for track fusion and evidence. |
| **Teledyne FLIR EO/IR Mk‑II** | Features note “embedded geotags and **STANAG 4609‑compliant metadata**” enabling precise geolocation[defense.flir.com](https://defense.flir.com/defense-products/eo-ir-mk-ii/#:~:text=GIS). |  |
| **FLIR TacFLIR 380HD** | The spec states metadata is MISP‑compliant and lists **STANAG 4609** among supported metadata standards[beechwoodequipment.com](https://www.beechwoodequipment.com/tacflir-380hd/#:~:text=System%20Interfaces%20Digital%20Video%3A%20SMPTE,1%2C%20STANAG%204609%2C%20SMPTE%20291M%2FRP214). |  |
| **FLIR HDZoom 30** | Product page notes **STANAG 4609 metadata**[farrwest.com](https://farrwest.com/product/hd-zoom-30/#:~:text=1080p60%20H,670%20g). |  |
| **Z3 Technology CamL‑15 encoder** | This dual‑camera encoder supports H.265/H.264 streaming, SRT/RTMP protocols and advertises compliance with **STANAG 4609 and MISB 0601/0604** metadata; it can encrypt streams and uses SRT for reliable transport[aegis-elec.com](https://aegis-elec.com/z3-technology-caml-15.html#:~:text=Compact%20dual,SRT%2C%20MISB%2FSTANAG%20compliant%2C%20microSD%2FNFS%20recording)[aegis-elec.com](https://aegis-elec.com/z3-technology-caml-15.html#:~:text=,camera%20encoding). | Useful for adding standards‑compliant metadata to other sensor feeds. |

### Networking equipment supporting TSN, PTP and security

| Product | Standards support | Notes |
| --- | --- | --- |
| **Milpower MILTECH 9117 TSN switch** | The rugged switch supports **Time‑Aware Shaper (IEEE 802.1Qbv)**, **frame pre‑emption (802.1Qbu)** and **per‑stream filtering (802.1Qci)** for deterministic TSN delivery[milpower.com](https://milpower.com/images/networking/datasheet-milpower/MILTECH_9117TSN_Data_Sheet_Milpower.pdf#:~:text=MILTECH%209117TSN%20supports%20advanced%20Time,time%20military%20applications). It provides hardware timestamping and synchronization compliant with **IEEE 802.1AS** and **IEEE 802.1Qbv**, and supports **PTP** with boundary clocks, **SyncE**, **MACsec encryption** and **802.1X authentication**[milpower.com](https://milpower.com/images/networking/datasheet-milpower/MILTECH_9117TSN_Data_Sheet_Milpower.pdf#:~:text=synchronization%20mechanisms%2C%20compliant%20with%20IEEE,MILTECH%209117%20TSN%E2%80%99s%20support%20for)[milpower.com](https://milpower.com/images/networking/datasheet-milpower/MILTECH_9117TSN_Data_Sheet_Milpower.pdf#:~:text=IEEE,802.1CB%20%28FRER)[milpower.com](https://milpower.com/images/networking/datasheet-milpower/MILTECH_9117TSN_Data_Sheet_Milpower.pdf#:~:text=%E2%80%A2%20MACSec%20Support%20using%20PCH%2FMCH,inspection%3A%20DHCP%2C%20IGMPv2%2Fv3%2C%20MLDv1%2Fv3%2C%20ARP). | Demonstrates that network hardware exists today to deliver sub‑microsecond synchronization, TSN quality‑of‑service, and link‑layer security, aligning with the architecture’s requirements. |

### C2 / display software

| Product | Standards support | Notes |
| --- | --- | --- |
| **Cambridge Pixel VSD / RadarWatch** | The VSD and RadarWatch software accept open formats including **ASTERIX** and **SAPIENT** and integrate radars (e.g., Blighter, Echodyne, HENSOLDT Spexer, RADA), cameras and ADS‑B receivers[cambridgepixel.com](https://cambridgepixel.com/products/display-applications/vsd/#:~:text=%2A%20AIS%2C%20ADS,contact%20Cambridge%20Pixel%20for%20details)[cambridgepixel.com](https://cambridgepixel.com/site/assets/files/7898/safety-security-and-surveillance-solutions-brochure-cp-16-110-166.pdf#:~:text=RadarWatch%20accepts%20open%20data%20formats,AIS%20data%20and%20then%20display). | Provides an off‑the‑shelf common operating picture that can fuse multiple sensor modalities. |
| **Fortem SkyDome Manager** | Fortem’s manager integrates radar, cameras, RF sensors and mitigation systems and can interface with third‑party C2 via API[fortemtech.com](https://fortemtech.com/solutions/advanced-airspace-awareness/#:~:text=SkyDome%C2%AE%20Manager). | While not explicitly using ASTERIX, its API approach allows integration via adapters. |

### Assessment and potential pitfalls

*   **Availability** – Numerous radar, RF and camera vendors already support ASTERIX (for track/video), SAPIENT (UK C‑UAS standard), STANAG 4609/MISB for video metadata, and ASTM F3411 for Remote‑ID. This demonstrates that adopting these standards in procurement specifications will not limit choice; multiple vendors can meet the requirements.
*   **Integration effort** – Many products provide proprietary APIs alongside standard outputs. Integrators should verify that ASTERIX/SAPIENT support covers all required fields (e.g., altitude, track status) and that metadata timing aligns with PTP. Some sensors may require custom adapters to convert proprietary messages into standardized formats.
*   **Evolving standards** – Remote‑ID trust mechanisms (IETF DRIP), TSN security (NTS4PTP) and certain IETF drafts (NQB) are still evolving. Procurers should allow for updates as these standards mature.
*   **Interoperability testing** – Even when products claim ASTERIX or STANAG compliance, test interoperability early. Variations in optional fields or vendor extensions may require negotiation.

Overall, the market offers a variety of sensors and systems that support the open standards outlined in the architecture. Using ASTERIX, STANAG 4609, SAPIENT, and remote‑ID standards in procurement specifications should therefore facilitate multi‑vendor integration rather than restrict supplier choice.

## Prompt:
Looking at the realistically available systems and sensors - review our plan for standards and protocols.

(look a Anduril standards and protocols for ideas base, for one purpose we may have more than one option if it benefits us)

## Response:
The review is complete and available in the attached report. This document assesses each part of the standards and protocol plan against actual market-available sensors and systems, highlights where adjustments may be needed, and draws inspiration from Anduril’s open architecture approach.

Review of Standards and Protocols in Light of Market‑Available Systems
======================================================================

Context
-------

The planned multi‑vendor common operating picture (COP) architecture emphasises modular, open standards and interoperability (MOSA/SOSA) to fuse detections and tracks from radar, RF, electro‑optical/infra‑red (EO/IR), acoustic and Remote‑ID sensors. Key elements include:

*   **Sensor interfaces:** ASTERIX CAT‑062/240 for radar tracks/video; STANAG 4607 for GMTI; STANAG 4609 + MISB metadata for full‑motion video; SAPIENT for multi‑modal track exchange; ANSI/VITA 49.2 and SigMF for RF; ASTM F3411 (broadcast & network Remote‑ID) with DRIP authentication.
*   **Network:** VLAN‑segmented IP fabric; source‑specific multicast using PIM‑SSM with IGMPv3/MLDv2; TSN and Precision Time Protocol (PTP) for deterministic latency; 802.1X and MACsec for link security.
*   **Backhaul/streaming:** RIST or SRT for WAN resilience; 802.1CB (frame replication) for hitless failover.
*   **Telemetry/logging:** NETCONF/RESTCONF/gNMI for configuration and telemetry; RFC 5424 syslog over TLS; DSCP mapping (EF, AF41, NQB) for QoS.

The user requested a review of this plan based on the actual sensors and systems on the market, and asked to consider **Anduril’s Lattice** standards and protocols as inspiration.

Evidence from available systems
-------------------------------

### Radar

*   Many radar vendors support **ASTERIX** output. RADA’s nMHR and ieMHR radars offer Ethernet interfaces with **ASTERIX** protocols![](https://chatgpt.com/backend-api/estuary/content?id=file_000000008358720ab4cb1d0560e0c31c&ts=491059&p=fs&cid=1&sig=e02776d788d33c5947c555e7c87a590065b84d4960323e3ffea1a72cacd1c0e8&v=0)drsrada.com[drsrada.com](https://www.drsrada.com/products/iemhr#:~:text=Parameters%20Info%20Spatial%20Coverage%20Single,1275B). Blighter’s A800 Mk‑2 radar outputs **XML, ASTERIX and SAPIENT** and provides an SDK[blighter.com](https://blighter.com/wp-content/uploads/2025/10/blighter-a800-mk-2-4d-multi-mode-radar-datasheet-bss-4003-MR.pdf#:~:text=,with%20A800%20Mk%202%20radars). Robin Radar’s IRIS can be controlled using **ASTERIX, SAPIENT** or a proprietary XML‑API[everythingrf.com](https://www.everythingrf.com/products/radar-systems/robin-radar-systems/1069-2568-iris#:~:text=precision%20during%20detection%20and%20tracking,NPSA%2C%20and%20STANAG%204370%20standards). Cambridge Pixel’s VSD/RadarWatch software accepts **ASTERIX** and **SAPIENT** and integrates numerous radars and EO/IR sensors[cambridgepixel.com](https://cambridgepixel.com/products/display-applications/vsd/#:~:text=%2A%20AIS%2C%20ADS,contact%20Cambridge%20Pixel%20for%20details)[cambridgepixel.com](https://cambridgepixel.com/site/assets/files/7898/safety-security-and-surveillance-solutions-brochure-cp-16-110-166.pdf#:~:text=RadarWatch%20accepts%20open%20data%20formats,AIS%20data%20and%20then%20display). These examples demonstrate that ASTERIX and SAPIENT are widely implemented in radar and display systems.

### RF sensors

*   **CRFS RFeye** sensors and software can stream geolocation data via **VITA‑49**, **ASTERIX** and TCP/IP, with RESTful JSON APIs[crfs.com](https://www.crfs.com/software/rfeye-software-suite#:~:text=)[crfs.com](https://www.crfs.com/software/rfeye-software-suite#:~:text=)[crfs.com](https://www.crfs.com/hardware/rf-sensors/rfeye-node-plus#:~:text=sharing%2C%20including%20full%20100%20MHz,range%20of%20Control%20PC%20options). This means that specifying ASTERIX and open APIs for RF geolocators is realistic.

### EO/IR and video

*   Commercial payloads support **STANAG 4609** metadata. Atlas UAS payloads (Visor FF, KALOS 120, Argus M20) list live‑stream and recording metadata as **STANAG 4609**[atlasuas.com](https://www.atlasuas.com/products/payloads#:~:text=%E2%80%A2%20Date%20and%20time%20%E2%80%A2,gimbal%29%3A%20271%20g)[atlasuas.com](https://www.atlasuas.com/products/payloads#:~:text=%E2%80%A2%20Others%20Video%20Metadata%20Format%3A,TS)[atlasuas.com](https://www.atlasuas.com/products/payloads#:~:text=Video%20Metadata%20Format%3A%20STANAG%204609,TS). FLIR’s EO/IR Mk‑II and TacFLIR 380HD cameras embed **STANAG 4609**‑compliant metadata[defense.flir.com](https://defense.flir.com/defense-products/eo-ir-mk-ii/#:~:text=GIS)[beechwoodequipment.com](https://www.beechwoodequipment.com/tacflir-380hd/#:~:text=System%20Interfaces%20Digital%20Video%3A%20SMPTE,1%2C%20STANAG%204609%2C%20SMPTE%20291M%2FRP214). The FLIR HDZoom 30 also lists **STANAG 4609** metadata[farrwest.com](https://farrwest.com/product/hd-zoom-30/#:~:text=1080p60%20H,670%20g). The Z3 CamL‑15 dual‑camera encoder transmits SRT/RTSP streams and is **STANAG 4609/MISB 0601/0604 compliant**[aegis-elec.com](https://aegis-elec.com/z3-technology-caml-15.html#:~:text=Compact%20dual,SRT%2C%20MISB%2FSTANAG%20compliant%2C%20microSD%2FNFS%20recording)[aegis-elec.com](https://aegis-elec.com/z3-technology-caml-15.html#:~:text=,camera%20encoding). Thus, using STANAG 4609 with MISB metadata for video is realistic.

### Remote‑ID

*   **Dronetag** Rider/Scout Remote‑ID receivers comply with **ASTM F3411‑22A and EN 4709‑002** and provide REST API/MQTT outputs[dronetag.com](https://dronetag.com/products/rider/#:~:text=Compliance%20ASTM%20F3411,002)[dronescout.co](https://dronescout.co/dronescout-remote-id-receiver/#:~:text=DroneScout%20receivers%3A%20no%20monthly%20fees%2C,NDAA). **uAvionix pingRID** transmitters meet **FAA Part 89 and ASTM F3411‑22a**[uavionix.com](https://uavionix.com/uncrewed-aircraft-systems/pingrid/#:~:text=Meets%20FAA%2014%20CFR%20Part,and%20ASTM%20Remote%20ID%20Standards)[uavionix.com](https://uavionix.com/uncrewed-aircraft-systems/pingrid/#:~:text=,pingRID%20comply%20with). Commercial receivers like DroneScout ds230/ds240 also use **ASTM F3411‑22a** and open frameworks. However, the **DRIP** trust standard (RFC 9575) is very new; no COTS receiver currently advertises DRIP message verification. Our plan should include DRIP for future growth but not require it in initial procurements.

### TSN/PTP and secure networking

*   Time‑sensitive networking equipment is available. Milpower’s **MILTECH 9117** switch supports TSN features (802.1Qbv time‑aware shaper, 802.1Qbu frame pre‑emption, 802.1Qci filtering), hardware timestamping with **IEEE 802.1AS** and **PTP**, **SyncE**, **MACsec** and **802.1X**[milpower.com](https://milpower.com/images/networking/datasheet-milpower/MILTECH_9117TSN_Data_Sheet_Milpower.pdf#:~:text=MILTECH%209117TSN%20supports%20advanced%20Time,time%20military%20applications)[milpower.com](https://milpower.com/images/networking/datasheet-milpower/MILTECH_9117TSN_Data_Sheet_Milpower.pdf#:~:text=synchronization%20mechanisms%2C%20compliant%20with%20IEEE,MILTECH%209117%20TSN%E2%80%99s%20support%20for)[milpower.com](https://milpower.com/images/networking/datasheet-milpower/MILTECH_9117TSN_Data_Sheet_Milpower.pdf#:~:text=IEEE,802.1CB%20%28FRER)[milpower.com](https://milpower.com/images/networking/datasheet-milpower/MILTECH_9117TSN_Data_Sheet_Milpower.pdf#:~:text=%E2%80%A2%20MACSec%20Support%20using%20PCH%2FMCH,inspection%3A%20DHCP%2C%20IGMPv2%2Fv3%2C%20MLDv1%2Fv3%2C%20ARP). While many sensors use standard Ethernet rather than TSN, TSN‑capable switches ensure deterministic transport and sub‑microsecond synchronisation for fusion; adopting PTP in the network is therefore practical.

### Backhaul streaming

*   Video encoders such as Z3 CamL‑15 support **SRT** streaming with encryption[aegis-elec.com](https://aegis-elec.com/z3-technology-caml-15.html#:~:text=Compact%20dual,SRT%2C%20MISB%2FSTANAG%20compliant%2C%20microSD%2FNFS%20recording)[aegis-elec.com](https://aegis-elec.com/z3-technology-caml-15.html#:~:text=,camera%20encoding). While **RIST** is advocated for WAN multicast resilience, off‑the‑shelf sensors rarely implement it. Backhaul gateways (e.g., from broadcast/video industry) may support RIST; thus specifying RIST **or** SRT as acceptable options provides flexibility.

### Logging, telemetry and QoS

*   Standardised logging and telemetry protocols (RFC 5424 syslog, NETCONF/RESTCONF/gNMI, DSCP code points) are widely implemented in network and compute equipment. Many sensors provide REST APIs or JSON outputs (e.g., CRFS, Dronetag) that can be instrumented via these protocols.

### Anduril Lattice concepts

*   Anduril’s **Lattice OS** uses an **open architecture** and modular microservices design. A product cheatsheet summarises that Lattice is “designed with an **open architecture** for seamless JADC2 integration, adhering to standards like **OMS/UCI, FACE and MOSA**”[cheatsheets.davidveksler.com](https://cheatsheets.davidveksler.com/anduril-products.html#:~:text=,interoperability%20in%20exercises%20like%20Project) and that its microservices allow rapid integration of new hardware and sensors[cheatsheets.davidveksler.com](https://cheatsheets.davidveksler.com/anduril-products.html#:~:text=,at%20the%20speed%20of%20relevance). The **Lattice SDK** provides gRPC/HTTP APIs and open data models, enabling third parties to integrate sensors and effectors[cheatsheets.davidveksler.com](https://cheatsheets.davidveksler.com/anduril-products.html#:~:text=,Partners). A Breaking Defense article notes that Lattice Mesh allows frontline units to subscribe to data feeds from heterogeneous sensors and that Anduril is opening the SDK so third‑party developers can write “translator” modules for additional sensors[breakingdefense.com](https://breakingdefense.com/2024/12/decentralizing-battle-data-cdao-anduril-open-tactical-mesh-to-third-party-developers/#:~:text=%E2%80%9CWe%20can%20use%20the%20data,%E2%80%9D). These references show that Anduril’s approach aligns with MOSA principles: open APIs, multiple data formats, and developer kits enabling vendor‑agnostic integration.

Recommendations and adjustments
-------------------------------

1.  **Stick with ASTERIX for radar tracks and VITA‑49/SigMF for RF.** Many radars and RF sensors already output ASTERIX; open C2 software (e.g., Cambridge Pixel) accepts it. For radar video, use **ASTERIX Cat 240**; for GMTI, adopt **STANAG 4607**. Maintaining ASTERIX also aligns with SAPIENT, which is essentially an ASTERIX‑compatible open standard.
2.  **Maintain STANAG 4609 + MISB metadata for video, but allow SRT or RIST transport.** EO/IR sensors widely support 4609. SRT is more commonly implemented than RIST in video encoders; specify either SRT or RIST for WAN backhaul to ensure equipment choice.
3.  **Retain SAPIENT as an optional multi‑modal interface.** While not universally adopted, SAPIENT is supported by several radar vendors (Blighter, Robin), Cambridge Pixel software, and the UK MoD. Adopting it can simplify future integration. However, ASTERIX remains more widely supported; we should accept either ASTERIX or SAPIENT for track exchange.
4.  **Support ASTM F3411 Remote‑ID; treat DRIP as future growth.** Remote‑ID receivers already comply with ASTM F3411 and broadcast their data via open APIs. DRIP (RFC 9575) should be included in the architecture for future authentication, but procurement specs should not require DRIP until COTS receivers implement it.
5.  **Adopt PTP across the network and specify TSN where needed.** TSN‑enabled switches such as MILTECH 9117 are available, but most sensors have basic Ethernet. Use PTP (IEEE 1588‑2019) to timestamp data at the sensor and maintain time coherence; deploy TSN on campus networks carrying high‑bandwidth radar or video. Use MACsec and 802.1X for link security.
6.  **Use RIST or SRT for resilient streaming, with vendor choice.** Because only some encoders support RIST, allow SRT as an alternative. Specify that WAN gateways MUST support at least one of these protocols and optional 802.1CB frame replication for hitless failover.
7.  **Leverage open APIs and microservices similar to Anduril Lattice.** Following Anduril’s example, provide a well‑documented SDK with gRPC/REST endpoints and open data models (for entities, tasks and objects). Encourage vendors to write adapters/translators to this API, similar to Lattice’s translator concept[breakingdefense.com](https://breakingdefense.com/2024/12/decentralizing-battle-data-cdao-anduril-open-tactical-mesh-to-third-party-developers/#:~:text=%E2%80%9CWe%20can%20use%20the%20data,%E2%80%9D). Where appropriate, align with open standards like **OMS/UCI** or **FACE** (used by Lattice OS) to broaden the ecosystem[cheatsheets.davidveksler.com](https://cheatsheets.davidveksler.com/anduril-products.html#:~:text=,interoperability%20in%20exercises%20like%20Project).
8.  **Maintain MOSA principles: multiple options for each function.** For example, permit either ASTERIX or SAPIENT for tracks; RIST or SRT for streaming; PTP or gPTP for timing. This reduces vendor lock‑in and allows integration of both legacy and cutting‑edge equipment.

### Potential pitfalls

*   **Incomplete adoption of SAPIENT and DRIP.** While they are promising, only a subset of vendors support SAPIENT, and DRIP implementations are nascent. Mandating them could limit vendor choices; treat them as optional or future requirements.
*   **Complex integration and testing.** Variations in ASTERIX implementations, metadata fields or DSCP mappings may require adapter development and thorough validation. A robust SDK and certification process (similar to Anduril’s Lattice partner program) will be necessary.
*   **TSN cost and maturity.** TSN switches and NICs are available but increase cost and complexity; not all sensors support TSN. Consider TSN for high‑demand segments (e.g., radar video) and use standard Ethernet elsewhere.

Conclusion
----------

The market already offers radar, RF, EO/IR and Remote‑ID devices that conform to the key standards in the proposed architecture. The planned protocols therefore provide a solid foundation for a multi‑vendor C‑UAS COP. However, flexibility is important: offering options (ASTERIX or SAPIENT; SRT or RIST; PTP or gPTP) will accommodate more vendors and ease integration. Borrowing from Anduril’s Lattice approach—open APIs, microservices and developer kits—can further encourage a plug‑in ecosystem and avoid vendor lock‑in.

You’ll find evidence-backed recommendations (e.g. maintaining ASTERIX for radar but offering SAPIENT as an option) and notes on where emerging standards like DRIP or SAPIENT could introduce risk. Let me know if you need the report in a different format or wish to explore a specific section further.
