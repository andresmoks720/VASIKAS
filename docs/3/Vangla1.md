# Intervjuu nõuded infosüsteemile

**User:** Andres Moks (andres.moks@gmail.com)  
**Created:** 2/25/2026 23:35:46  
**Updated:** 2/25/2026 23:56:10  
**Exported:** 2/25/2026 23:56:23  
**Link:** [https://chatgpt.com/g/g-p-698b7a30d6848191bacb8cff5277cb17-intekad/c/699f6b26-07cc-8387-a39f-3992d95c50ba](https://chatgpt.com/g/g-p-698b7a30d6848191bacb8cff5277cb17-intekad/c/699f6b26-07cc-8387-a39f-3992d95c50ba)  

## Response:
Thought for 8m 1s

### Intervjuu (vanglad) olulised punktid → tulevased nõuded infosüsteemile

Allpool on intervjuus kõlanud **vajadused/valukohad** ja neist tuletatud **nõuded**. Seon need ka kontseptsioonis kirjeldatud lahendusega (veeb + mobiil + rollipõhine pilt, sensorite koondamine, häired, ajalugu jne).

Kontseptsioonidokument

* * *

1) Riskid ja kasutusjuhtumid (mille vastu “päriselt” kaitstakse)
----------------------------------------------------------------

*   **Peamine oht:** keelatud esemete (sh narkootikumid) sissetoomine drooniga; lisaks võimalikud erijuhtumid (kõrge riskiga kinnipeetav, eskaleeruvad stsenaariumid).
    *   **Nõue:** süsteemis peab olema **intsidendi/ohu tüübi** mudel (kontraband vs “kõrgendatud oht”), mis mõjutab häire prioriteeti, töövoogu ja logimis-/säilitamisreegleid.
*   **Valmiduse tekitamine enne, kui “päris probleem” Eestis massiliseks muutub** (rõhk ennetusel).
    *   **Nõue:** toetada **valmisoleku taseme režiime** (tundlikkuse/filtreerimise profiilid) ning nende haldust. See haakub otseselt kontseptsioonis kirjeldatud valmisoleku/tundlikkuse režiimidega.
        Kontseptsioonidokument

* * *

2) Olemasolevate lahenduste kogemus → mida uues süsteemis vältida
-----------------------------------------------------------------

*   **Praegune “poolik” tuvastuslahendus** (RF + radar + C2), pikk arendus, töökindlus/valmidus probleemne, üksikud komponendid puudu (nt radar).
    *   **Nõue:** infosüsteem peab olema **sensoritootjast lahti seotud**: standardne ingest-liides, adapterite kiht, võimalus vahetada sensoreid ilma UI/andmemudelit ümber kirjutamata.
    *   **Nõue:** **komponentide tervise** (sensor up/down, andmevoo kvaliteet) jälgimine ja teavitused (see on kontseptsioonis otsesõnu: teavitus sensori rikke korral).
        Kontseptsioonidokument
*   **Vendor kasutab objekti sisuliselt oma toote arenduseks; vanglal vähe kontrolli** (sh seadistused “lukus”).
    *   **Nõue:** hankes ja arhitektuuris peab olema **kontrolli- ja omandimudel**: riigile jääv koodi/konfi omand või vähemalt escrow + dokumenteeritud API; adminõigused seadistamiseks; audit.

* * *

3) “Kihiline” sensoristrateegia ja järkjärguline võimekuse tõstmine
-------------------------------------------------------------------

*   **Soov minna etapiti:** alustada odavamast/kiiremast kihist (remote-ID), lisada hiljem (RF/radar/EO/akustika) vastavalt riskile ja eelarvele.
    *   **Nõue:** infosüsteem peab toetama **võimekuste järkjärgulist lisamist** (plug-in sensorid), ilma et kasutajakogemus või andmemudel laguneks.
*   **Arutelu remote-ID vs RF:** remote-ID võib teatud ründeprofiilide puhul olla piiratud väärtusega; RF-l on omakorda “müraga” ja seadistustega seotud probleemid.
    *   **Nõue:** süsteem peab kuvama **allika usaldusväärsuse/konfidentsi**, sensori “piirangud”, ning toetama **sensor fusion’i** (kontseptsioonis eesmärk valehäirete vähendamiseks).
        Kontseptsioonidokument

* * *

4) Häired, valehäired ja reageerimislogika (operatiivne töö päriselt)
---------------------------------------------------------------------

*   **Valepositiivsed häired koormavad**; kui info pole piisavalt täpne (asukoht), ei taheta seda üldse (operaatori ülekoormus).
    *   **Nõue:** häiretel peab olema **prioriteet + konfidents + lokaliseerimise kvaliteet**; võimalus filtreerida/vaigistada; “miinimuminfo” režiim.
*   **Reageerimine ei ole “iga häire peale brigaad kohale”**: kasutatakse raadiosidet ja kaamerapilti kinnituseks.
    *   **Nõue:** UI peab toetama **häire kinnitamise töövoogu** (triage): vaata seotud sensorid/kaamera, märgi “tõene/vale”, lisa kommentaar.
    *   **Nõue:** toetada **tagasisidepõhist õppimist** (intervjuus mainitud, et süsteem muutus ajas täpsemaks reageerimise käigus) → vaja “label” ja lihtne feedback-loop.
*   **Erinevate häirete prioriteetsus** on vanglas tuttav (isikukaitse vs madal prioriteet); droonihäired tuleb samasse mõttemudelisse sobitada.
    *   **Nõue:** ühtne **häire- ja intsidentide taksonoomia** + SLA-d/eskalatsioon (kes teavitada, mis ajaga).

Kontseptsiooni “asutus saab häire geopiiri rikkumisel” + “operaator reageerib” + “ajalugu” on siin otsetabamus, vangla vajab sama, ainult rangema prioriseerimise ja tõendamisloogikaga.

Kontseptsioonidokument

* * *

5) Organisatsioon ja töökorraldus (kes mida näeb ja teeb)
---------------------------------------------------------

*   **Igal vanglal on oma peavalve / kohalik juhtimine** (mitte üks keskne valvekeskus).
    *   **Nõue:** infosüsteem peab toetama **mitme objekti / “tenant’i” mudelit**: iga vangla saab lokaalset pilti ja adminni; keskne vaade on valikuline.
*   **Infovahetus reageeriva üksusega** võib olla lihtne (raadio/telefon), eraldi mobiilirakendust neil “võib-olla pole”.
    *   **Nõue:** toetada **mitut teavituse kanalit** (mobiil push / SMS / e-mail / integratsioon sisekommsiga), sh “minimaalne tekstiline teavitus”.
    *   Kontseptsiooni mobiilne häirerakendus + taustal teavitused sobitub siia hästi.
        Kontseptsioonidokument

* * *

6) Võrgu- ja käideldavusnõuded: on-prem “node” + katkestustaluvus
-----------------------------------------------------------------

*   **Selge nõue:** lahendus peab töötama **kohapeal (on-prem)** ka siis, kui side Tartu–Tallinn / keskusega katkeb; keskne server võib lisandväärtust teha, aga ei tohi olla SPOF.
    *   **Nõue:** arhitektuur: **lokaalne node** (andmete vastuvõtt, fusion, UI, häired) + **asünkroonne sünk** (logid/uuendused/poliitikad) kesksüsteemiga.
*   **Turvaline “äärevus” / gateway** andmete jagamiseks teiste asutustega.
    *   **Nõue:** standardne **andmevahetusliides** + turvaprofiil (mTLS, allowlist, audit), eraldi võrkudest andme väljastamine kontrollitud kujul.

See haakub kontseptsiooni ideega “ainult seda infot vajavatele asutustele ettenähtud ulatuses” ning rollipõhise pildi filtreerimisega.

Kontseptsioonidokument

* * *

7) Ligipääsud, rollid, audit, “peakasutaja”
-------------------------------------------

*   **Vajadus:** vanglatel peab olema oma **peakasutaja**, kes loob kontosid, delegeerib õigusi ja näeb kasutajate tegevuslogisid.
    *   **Nõue:** RBAC/ABAC (roll + atribuudid) + delegatsioon + “tenant admin”.
    *   **Nõue:** detailsed **auditlogid** (kes vaatas/muutis/eksportis), koos otsingu ja säilitusega.  
        Kontseptsioon katab rolli/atribuutide põhise ligipääsu, regionaalse piirangu ja auditeeritavuse — vangla lisab siia “tenant admin” ja admin-toimingute detailsuse.
        Kontseptsioonidokument

* * *

8) Kaart, kihid, ekraanid (UI praktilised nõuded)
-------------------------------------------------

*   **Aluskaart pole “religioon”:** sobib ka OSM, kui kihid on arusaadavad; oluline on geograafiline täpsus.
    *   **Nõue:** geosüsteem peab olema **koordinaat-täpne**, kihihaldus (sensorid, geopiir, drooni trajektoor, “kuhu täpselt toimub”).
*   **Vajadus võimaliku “seinaekraani” jaoks** (operatiivpilt objekti ümber).
    *   **Nõue:** “wall display / kiosk view” (suured elemendid, automaatne refresh, piiratud interaktsioon).

See kattub kontseptsiooni veebirakenduse “Üldpilt” ja “Planeerimine/katvus” vaadetega.

Kontseptsioonidokument

* * *

9) Turvasüsteemide integratsioon: pigem eraldi, kontrollitult
-------------------------------------------------------------

*   **Praegu soov:** drooniseire jäägu olemasolevatest turvasüsteemidest lahku (turvariskid, muutuste keerukus); tulevikus võib kaaluda.
    *   **Nõue:** süsteem peab töötama **standalone** (eraldi monitor) ja toetama hilisemat integratsiooni ainult läbi dokumenteeritud liideste.
*   **Haldus/operatsioon:** turvasüsteemide hooldus/arendus käib läbi eraldi struktuuri/partnerite (oluline BA sisend RACI jaoks).
    *   **Nõue:** ops-mudel: kes on süsteemi omanik, kes hooldab, kuidas käivad muudatused, SLA/SLO.

* * *

10) Jagamine teiste asutustega ja “mida varjata”
------------------------------------------------

*   **Üldmulje:** drooniseire info ise ei pruugi olla ülideli­kaatne, aga osa asutusi tahab varjata sensoreid/alasid/asukohti.
    *   **Nõue:** **andmete jagamise poliitikad**: “mida jagan”, “kellele”, “millise detailsusega”.
    *   **Nõue:** sensori asukoha/katvuse **varjamine või hägustamine** (kontseptsioonis olemas).
        Kontseptsioonidokument

* * *

11) Tõendamine ja säilitus (kohtukõlblikkus pole põhikasutus, aga ei tohi välistada)
------------------------------------------------------------------------------------

*   **Intervjuu toon:** drooniintsident võib jääda väärteo tasemele, kohtusse tihti ei jõua; samas seostamine (isik↔tegu) on keeruline ja nõuab rohkem kui “pakend”.
    *   **Nõue:** siiski vaja **tõendipaketi eksporti**: ajajoon, sensorandmed, kasutajate tegevuslogid, tervikluse kontroll (hashid), ajatempli usaldus.
    *   **Nõue:** säilituspoliitika (retention) + juurdepääs ainult õigustatud rollidele.

* * *

12) Hankestrateegia, standardiseerimine ja vendor lock-in
---------------------------------------------------------

*   **Soov vältida “teenuse rentimist” ilma kontrollita; eelistus, et kood/omand jääks riigile (või open-source’i suunal).**
    *   **Nõue (hanke kvaliteedinõue):** lähtekoodi omand/escrow, avatud API-d, logiformaadid, dokumentatsioon; vahetatavus.
*   **Soov vähendada “loomaaeda”:** raamhangete/standardite abil vähendada integratsioonikulu (palju eri seadmeid = palju adaptereid).
    *   **Nõue:** defineerida **toetatud sensoriklassid + miinimum-API** (RF/radar/Remote-ID/EO jne), ning nõuda ühtlustatud telemeetria skeemi.

* * *

13) Seadistused ja kalibreerimine (praktiline “miks RF on niru” teema)
----------------------------------------------------------------------

*   **RF võimekus sõltub seadistustest; kohapealsetel kasutajatel pole ligipääsu; võimalikud kalibreerimisvead (kompass/suunad).**
    *   **Nõue:** süsteemis peab olema **konfigureeritavus** (rollipõhiselt), diagnostika (kalibreerimise olek), ning “safeguard” (muudatused auditeeritavad, rollback).

* * *

14) Vastumeetmed / tõrje (võrk, püüdurdroon, segamine)
------------------------------------------------------

*   Arutati segamist ja alternatiive (võrk/püüdur), kuid see pole veel “esimene prioriteet”.
    *   **Nõue:** infosüsteem peab suutma **eristada tuvastus vs tõrje** ning hiljem liidestuda tõrjeseadmetega (C2 tasking, käsud, protseduurid), aga MVP-s piisab “detekt + töövoog + teavitus + logi”.

* * *

Potentsiaalne lõks / alternatiivne vaade
========================================

On-prem “node” igas objekti asukohas annab väga hea katkestustaluvuse, aga **tõstab ops-koormust ja versioonide killustatust** (uuendused, turvapaigad, konfiguratsioonid). Hea vastukaal on hübriid: lokaalne töö jätkub alati, kuid **poliitikad/konfidentsi mudelid/uuendused** tulevad keskselt ja on maksimaalselt automatiseeritud (asünkroonne, kontrollitud sünk).

## Response:
Thought for 7m 24s

Allpool on **intervjuu sisust** (vanglad) välja nopitud **kõik sisulised punktid**, millest tekivad **tulevased nõuded infosüsteemile**, ja igale punktile lisan:

*   **Tuletatud nõue(d)**
*   **Kaetus kontseptsioonis**: _Jah / Osaline / Puudu_ (st kas kontseptsioon juba ütleb selle välja või vajab täiendust)

Kontseptsiooni “baasvõimekus” (sensorite koondamine, rollipõhine pilt, geopiirihäired, ajalugu, sensor-fusion, mobiilne häire, auditeeritus jne) on dokumendis olemas.

Kontseptsioonidokument

Kontseptsioonidokument

Kontseptsioonidokument

* * *

1) Ärioht ja siht: mida vangla “päriselt” tahab ära hoida
---------------------------------------------------------

**Intervjuu punktid**

*   Peamine risk on **keelatud esemete sissetoomine drooniga** (kontraband / narkootikumid).
*   Vangla objekt on **kompaktne** (väike perimeeter) → mõni “ebatäpsem” tuvastusinfo on ikkagi kasulik valmisoleku tõstmiseks.
*   **Konvoi / liikumise kaitse** on mainitud, aga **mitte 1. prioriteet**.

**Tuletatud nõuded**

*   REQ-01: Süsteemis peab olema **ohu/intsidendi tüüp** (nt “kontraband”, “luure”, “isikukaitse/erikord”, “konvoi”), mis mõjutab prioriteeti, töövoogu, teavitusi ja säilitust.
*   REQ-02: Süsteem peab toetama **objekti-perimeetri fookust** (mitte “kogu Eesti droonipilt”) – UI ja filtrid peavad töötama “objektikeskselt”.
*   REQ-03: “Konvoi” tuleb disainida kui **hilisem laiendus** (liikuv kaitseala, mobiilne kasutus), mitte MVP eeldus.

**Kaetus kontseptsioonis**

*   Otsene ohu-tüpoloogia + töövoo eristamine: **Puudu** (kontseptsioonis on küll alad/staatused, aga vangla spetsiifiline “kontraband/konvoi” mudel pole kirjeldatud).
    Kontseptsioonidokument
*   Liikuv kaitseala (mobiil): **Jah** (dünaamiline kaitstav ala).
    Kontseptsioonidokument

* * *

2) Etapiline tee: “töötav eile” vs “täiuslik kunagi”
----------------------------------------------------

**Intervjuu punktid**

*   Eelarve/sõnastus: alustada **lihtsamast kihist** (remote-ID), lisada kihte (RF/radar/EO/akustika) kui vaja.
*   Valukogemus: **5+ aastat arendust** ja tulemus “pole töökindel / pole valmis” → pikk “toorlahendus” on vangla jaoks no-go.

**Tuletatud nõuded**

*   REQ-04: Süsteemi arhitektuur peab olema **plug-in / adapterikiht** sensoritele (et lisada/vahetada sensoreid ilma tuumikku lõhkumata).
*   REQ-05: Nõuda **MVP-tee** (remote-ID / üks sensoriklass) + hilisem sensorfusion – aga UI/andmemudel peab juba algusest olema “multi-sensor ready”.
*   NFR-01: Hanke ja valmimise mõõdikud peavad olema **verifitseeritavad** (nt: tuvastuse latentsus, valehäire määr, uptime), et vältida “arendame 5 aastat” lõksu.

**Kaetus kontseptsioonis**

*   Multi-sensor koondamine + fusion: **Jah**.
    Kontseptsioonidokument
*   Etapilisus/roadmap kui nõue: **Puudu** (kontseptsioon kirjeldab lõpp-pilti, mitte tarnestrateegiat).

* * *

3) Sensorikihid ja reaalsed tehnilised tähelepanekud (vangla ütleb, mis “päriselus” valus on)
---------------------------------------------------------------------------------------------

**Intervjuu punktid**

*   Tallinnas kirjeldatakse terviklahendust: **RF + radar + C2 (Deep Track)**; lisaks mainitakse **kaameraid** ja **akustikat**.
*   Akustika: “üks akustiline sensor” on mõttetu; reaalselt vaja **~6–10** (ja hinnad on ajas tõusnud).
*   RF: võib anda **palju valepositiivseid** (RF-müra asulate ümber); oluline on **seadistamine**.
*   Seadistused on “lukus”; kohalikul kasutajal pole kontrolli; mainiti ka **kalibreerimise/kompassi** probleemi (vale suund).

**Tuletatud nõuded**

*   REQ-06: Süsteemi sensorimudel peab toetama vähemalt: **Remote-ID, RF, radar, EO/kaamera track, akustika** (igaühel oma kvaliteedi/ebakindluse parameetrid).
*   REQ-07: Süsteem peab igale tuvastusele lisama **ebakindluse/akuutsuse**: asukoha täpsus, suuna täpsus, allika usaldus.
*   REQ-08: Vajalik **konfiguratsiooni haldus** (rollipõhine): sensori parameetrid, filtrid, profiilid; + audit trail iga muudatuse kohta.
*   NFR-02: **Kohapealne kalibreerimise/diagnoosi** vaade: “kompass OK?”, “RF noise floor”, “sensor health”.

**Kaetus kontseptsioonis**

*   Sensorfusion + valehäirete vähendamine: **Jah**.
    Kontseptsioonidokument
*   Tundlikkusrežiimid (valehäirete koormus): **Jah**.
    Kontseptsioonidokument
*   Sensorite konfiguratsiooni-/kalibreerimismudel (lukus seadistused, adminõigused, rollback): **Puudu**.

* * *

4) Häired, valehäired ja “kui info pole täpne, ära tülita mind”
---------------------------------------------------------------

**Intervjuu punktid**

*   Operaatorid ei taha “müra”: kui asukoht pole piisavalt konkreetne, info võib olla **kahjulik** (ülekoormus).
*   Reageerimine: sageli **raadioside + kaamera pilt** enne kui brigaad liigub.
*   Häired on prioriteetidega (analogia: isikukaitse vs madala prioriteediga tehnilised häired).

**Tuletatud nõuded**

*   REQ-09: Häires peab olema **miinimumandmestik**: _kus? kui kindel? mis allikad?_ (ja kui kindlus/täpsus alla läve → vaikimisi ei häiri).
*   REQ-10: Häire töövoog peab olema **triage**: “ack → kontroll (kaamera/teised sensorid) → märgi tõene/vale → sulge”.
*   REQ-11: Häiretel peab olema **prioriteet + eskalatsioonireegel** (kellele, mis kanaliga, mis ajaga).
*   REQ-12: Vajalik **operaatori tagasiside (labeling)** valehäirete vähendamiseks (feedback loop).

**Kaetus kontseptsioonis**

*   Häire geopiiri rikkumisel + operaator reageerib + ajalugu: **Jah**.
    Kontseptsioonidokument
*   Valehäirete koormuse käsitlus (tundlikkusrežiimid): **Jah**.
    Kontseptsioonidokument
*   Triage/ack/closure/labeling kui selge töövoog: **Puudu** (kontseptsioon ütleb “reageerib”, aga mitte töövoo detaile).
    Kontseptsioonidokument

* * *

5) Ajalugu, analüüs ja “mis droon oli / kus lendas”
---------------------------------------------------

**Intervjuu punktid**

*   Soov näha “ajaloolist infot: kus droon lendas, mis droon oli”.
*   Drooniradarilaadne UI analoogiana tundus sobiv: “näeb pilti, saab häireid, näeb ajalugu”.

**Tuletatud nõuded**

*   REQ-13: **Ajaloo vaade** peab toetama ajajoont, trajektoori, seotud sensoriallikaid, filtreid.
*   REQ-14: **Intsidentide register** (võimalus koondada mitu häiret üheks intsidendiks, lisada märkmeid/tõendeid).
*   REQ-15: Ekspordi miinimum: **intsidendi kokkuvõte** (hilisem uurimine / siseanalüüs).

**Kaetus kontseptsioonis**

*   Ajalugu koos sirvimisega: **Jah**.
    Kontseptsioonidokument
*   Intsidendi-objekt (koondamine, tõendipakett): **Puudu**.

* * *

6) Organisatsioonimudel: “iga vangla on omaette”
------------------------------------------------

**Intervjuu punktid**

*   Pole üht keskset “peavalvekeskust”; **igas vanglas oma peavalve** (kohalik üksus).
*   Väljapoole territooriumi reageerimine on pigem **PPA patrulli** teema (vangla valve ei lähe “aia taha”).

**Tuletatud nõuded**

*   REQ-16: Süsteemis peab olema **multi-tenant / objektipõhine eraldus**: iga vangla näeb oma pilti ja haldab oma kasutajaid.
*   REQ-17: Vaja modelleerida **jurisdiktsiooni**: “territooriumis sees” vs “väljas” (ja teavituse/eskalatsiooni loogika vastavalt).
*   REQ-18: Rollid: “kohalik operaator”, “kohalik admin”, “keskne vaatleja” (kui tekib), “audit”.

**Kaetus kontseptsioonis**

*   Roll + atribuudid + regionaalne piiramine + audit: **Osaline** (rollid/atribuut olemas, kuid multi-tenant “vangla admin” ja jurisdiktsioon pole lahti kirjutatud).
    Kontseptsioonidokument

* * *

7) Peakasutaja, kasutajahaldus ja audit (vangla sõnastas otse)
--------------------------------------------------------------

**Intervjuu punktid**

*   Vanglate kontekstis peab olema **peakasutaja**, kes loob kontosid ja näeb kasutajate logisid.

**Tuletatud nõuded**

*   REQ-19: “Tenant admin” võimekus: kasutajate loomine, rollid/atribuutid, õiguste delegeerimine.
*   REQ-20: **Auditlogid** (kasutaja tegevus + adminitegevus), otsing ja eksport.
*   REQ-21: Vajalik “least privilege” + ligipääsudoktriin (kes mida näeb).

**Kaetus kontseptsioonis**

*   Auditeeritavus: **Jah** (kontseptsioon ütleb “kõik tegevused logitud”).
    Kontseptsioonidokument
*   Peakasutaja/tenant-admin funktsionaalsus: **Puudu**.

* * *

8) On-prem “node” + katkestustaluvus + sünk keskserveriga
---------------------------------------------------------

**Intervjuu punktid**

*   Selgelt nõutud: süsteem peab **kohapeal edasi töötama**, kui Tartu–Tallinn ühendus katkeb.
*   Keskne server võib teha lisandväärtust: **logide sünk, uuendused**, jagamine.

**Tuletatud nõuded**

*   NFR-03: Arhitektuur: **lokaalne node** (ingest, fusion, UI, häired, ajalugu vähemalt lühiajaliselt) + **asünkroonne sünk** kesksüsteemi.
*   NFR-04: **Offline-first** kasutus: katkestuse korral selge indikaator + backlog sünkroniseerub hiljem.
*   NFR-05: Võimalusel lokaalne **redundants** (nt 2-node või varukoopia) – intervjuus käis läbi “dubleeritud”.

**Kaetus kontseptsioonis**

*   Ühenduse katkemise teavitus: **Jah**.
    Kontseptsioonidokument
*   “On-prem node” kui arhitektuurinõue + offline töö: **Puudu** (kontseptsioon mainib ainult teavitust, mitte jaotusarhitektuuri).
    Kontseptsioonidokument

* * *

9) Võrgud ja turvaeraldus (kinnine valvevõrk vs SMIT/välisvõrk)
---------------------------------------------------------------

**Intervjuu punktid**

*   Arutati, kus seadmed “võrgus asuvad” ja kuidas infot edastada (kinnine valvevõrk).
*   Hinnang: drooniseire info ise ei pruugi olla ülideli­kaatne, kuid see sõltub osapoolest (KAPO jne).

**Tuletatud nõuded**

*   NFR-06: Defineerida **võrgutopoloogia mustrid**: sensorivõrk (kinnine), node, keskserver, DMZ/gateway.
*   REQ-22: Standardne **turvaline liides** andmevahetuseks (mTLS, allowlist, audit), sh “read-only feed” teisele asutusele.
*   REQ-23: Andmete **jagamise poliitikad**: kes näeb mida (detail vs hägustatud vs mitte midagi).

**Kaetus kontseptsioonis**

*   “Ainult infot vajavatele asutustele” + rollipõhine pilt: **Jah**.
    Kontseptsioonidokument
*   Sensorite asukoha/katvuse varjamine/hägustamine: **Jah**.
    Kontseptsioonidokument
*   Võrguarhitektuur ja gateway nõuded: **Puudu**.

* * *

10) Integratsioon turvasüsteemidega: praegu eraldi, hiljem võib-olla
--------------------------------------------------------------------

**Intervjuu punktid**

*   Soov: droonipilt jäägu **turvasüsteemidest lahku** (turvalisuse põhjusel).
*   Operatsioon: “eraldi monitor” on praegu piisav.
*   Kui tulevikus integreerida, siis protsess käib läbi **Riigi Kinnisvara** ja partnerite (hooldus/arendus).

**Tuletatud nõuded**

*   REQ-24: Süsteem peab töötama **standalone** (eraldi UI) ilma sõltuvuseta turvasüsteemidest.
*   REQ-25: Hilisemaks integratsiooniks: dokumenteeritud **API/stream** + turvakontrollid + kooskõlastusprotsess.
*   NFR-07: Haldus-/omanikumudel (kes hooldab, kes lubab muudatusi, kes annab ligipääsu).

**Kaetus kontseptsioonis**

*   Standalone veeb + mobiil: **Jah** (implitsiitselt).
    Kontseptsioonidokument
*   Turvasüsteemide integratsiooni nõuded/protsess: **Puudu**.

* * *

11) Kaart, “seinaekraan” ja operatiivpilt
-----------------------------------------

**Intervjuu punktid**

*   Mainiti “seina peal suur ekraan” ja küsimust, kas droonipilt peaks kunagi sinna jooksma.
*   Drooniradarilaadne kaart+häired analoogiana sobib.

**Tuletatud nõuded**

*   REQ-26: “Wallboard view”: suurte elementidega reaalajapilt, automaatne refresh, piiratud interaktsioon.
*   REQ-27: Kaardikihid: perimeeter/objekt, droonijälg, häired, sensoriallika indikatsioon.
*   REQ-28: Katvuse indikaator (kas kasutaja on kaetud alas) – see on isegi kontseptsioonis küsimusena sees.
    Kontseptsioonidokument

**Kaetus kontseptsioonis**

*   Põhivaated (Üldpilt / Planeerimine / Kaitstav ala): **Jah**.
    Kontseptsioonidokument
*   Wallboard: **Puudu**.

* * *

12) Nõuded sensorite tervisele ja töökindlusele (pika “maas olemise” kogemus)
-----------------------------------------------------------------------------

**Intervjuu punktid**

*   Süsteem oli pikalt maas; hoolduspartnerid; “tuli välja, et süsteemi polegi”.
*   Vajadus “tarkvaralised uuendused üle vaadata”.

**Tuletatud nõuded**

*   NFR-08: **Health/heartbeat** igale sensorile ja node’ile + teavitus katkestusel.
*   NFR-09: **Operatiivne jälgitavus**: logid, veamäärad, sensorite kvaliteedimõõdikud, versioonid.
*   NFR-10: Uuendused peavad olema **kontrollitud ja taastatavad** (rollback).

**Kaetus kontseptsioonis**

*   Teavitus sensori rikke korral + ühenduse katkemine: **Jah**.
    Kontseptsioonidokument
*   Versioonihaldus/rollback/observability detailid: **Puudu**.

* * *

13) Standardiseerimine ja “loomaaia” vältimine (hanke kvaliteedinõue)
---------------------------------------------------------------------

**Intervjuu punktid**

*   Soov vältida olukorda, kus iga asutus hangib “sama asja erinevalt” → integratsioon muutub põrguks.
*   Mainiti raamhangete mõtet integratsioonikulu vähendamiseks.

**Tuletatud nõuded**

*   REQ-29: Nõuda **ühildatavuse miinimumstandardeid**: sensoriklassi adapterid + ühtne sündmuse skeem.
*   NFR-11: Hanke nõuetes peab olema “vahetatavus”: dokumenteeritud API, eksporditavad logid/andmed, vendor lock-in’i pidurid.

**Kaetus kontseptsioonis**

*   Sensorite koondamise eesmärk: **Jah**.
    Kontseptsioonidokument
*   Hankenõuded/standardid: **Puudu**.

* * *

14) Droonide staatused ja kasutus
---------------------------------

**Intervjuu punktid**

*   Mainiti vajadust näha ajaloos “mis droon” ning implicit “sõbralik/vaenulik” loogika (drooniradari analoogia).
*   Vangla kontekstis on vaja eristada “tavaline” vs “risk”.

**Tuletatud nõuded**

*   REQ-30: Droonil peab olema **staatus + põhjus + kes määras** (manual override, anomaaliad).
*   REQ-31: Staatus peab mõjutama häirekäitumist (nt “sõbralik” ei häiri, “kahtlane” tõstab valmisolekut).

**Kaetus kontseptsioonis**

*   Staatused on detailselt kirjeldatud: **Jah**.
    Kontseptsioonidokument

* * *

Üks potentsiaalne lõks (devil’s advocate)
=========================================

“Alustame remote-ID-st” võib vangla kontekstis tekitada **näilise turvatunde**: ründaja (kontraband) ei pea kasutama remote-ID-ga “korralikku” drooni ja RF/radar/EO kihid muutuvad reaalselt määravaks. Praktiline vastumeede on: defineeri MVP nii, et UI/andmemudel ja häire-töövoog on kohe “multi-sensor ready”, isegi kui esimeses etapis tuleb ainult 1–2 andmeallikat.

Kontseptsioonidokument



---
Powered by [ChatGPT Exporter](https://www.chatgptexporter.com)