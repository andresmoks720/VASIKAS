# Infosüsteemi nõuded intervjuudest

**User:** Andres Moks (andres.moks@gmail.com)  
**Created:** 2/10/2026 22:07:54  
**Updated:** 2/11/2026 0:00:23  
**Exported:** 2/11/2026 0:05:56  
**Link:** [https://chatgpt.com/g/g-p-698b7a30d6848191bacb8cff5277cb17-intekad/c/698b9014-1e4c-8393-a85a-a0ffda5c2769](https://chatgpt.com/g/g-p-698b7a30d6848191bacb8cff5277cb17-intekad/c/698b9014-1e4c-8393-a85a-a0ffda5c2769)  

## Prompt:
Narva keskus Eerik Recording 386\_16k\_mono\_PRE180\_vadlight\_20260210\_034724.txt

Document

Narva keskus Tx2 Recording 385\_16k\_mono\_PRE180\_vadlight\_20260210\_035244.txt

Document

kasutades lisatud kontseptsioonidokumenti, too välja kõik intervjuu olulised punktid - millest tulenevad (tulevased) nõuded infosüsteemile, muud olulised punktid

## Response:
Thought for 2m 24s

Allpool on intervjuudest (Narva keskus Eerik + Tx2) välja tulnud sisulised punktid ja neist tulenevad infosüsteemi nõuded, joondatuna kontseptsioonidokumendi teemadega.

1) Ühtne olukorrapilt, rollid ja piirkonnad
-------------------------------------------

*   **Asutuse-/piirkonnapõhine vaade**: vajadus, et “Tallinn ei näe piiril toimuvat”, igal asutusel oma vaade + rollide jagamine admini poolt.
    Narva keskus Tx2 Recording 385\_…
    → **Nõue**: ABAC/rollipõhine ligipääs + regionaalne segmenteerimine (mis info, mis piirkond, mis sensorikiht).
    Kontseptsioonidokument
*   **Mitme osapoole sensorid ühele pildile** (nt KV radarid lisaks PPA võimele).
    Narva keskus Tx2 Recording 385\_…
    → **Nõue**: adapter-/plugin-arhitektuur sensorite lisamiseks ilma “kinnise kastita”.

2) Alad: piiranguala, kaitstav ala, puhver (eelhoiatus)
-------------------------------------------------------

*   **Puhvertsooni vajadus** piiranguala ümber: soov saada alarm juba enne, kui droon reaalselt keelualasse jõuab.
    Narva keskus Eerik Recording 38…
    → **Nõue**: “kaitstav ala” kasutus ka geofencing’u puhvrina + erinevad tsoonid (piiranguala vs kaitstav ala vs varjatud).
    Kontseptsioonidokument
*   **Häirealade kaart / perimeeter** kui keskne töövaade (soov “kogu Narva ühe ekraani peale”).
    Narva keskus Tx2 Recording 385\_…
    → **Nõue**: kaart kui “single pane of glass” + kiire zoom/filtrid asukoha järgi.

3) Häire → eskaleerimine → patrull
----------------------------------

*   **Kes eskaleerib ja kes saadab patrulli** peab olema selge (täna “tema otse saadab patrulli”, aga ahel vajab kirjeldust).
    Narva keskus Tx2 Recording 385\_…
    → **Nõue**: häire-juhtumi workflow: omanik/valveüksus, eskaleerimisreeglid, tegevuslogi (kes nägi, kes kinnitas, kes suunas).
*   **Operaatori töövoog** kontseptsioonis olemas (“operaator reageerib häirele”).
    Kontseptsioonidokument
    → **Nõue**: iga alarm peab looma _juhtumi_, millel on staatused + ülesanded + ajalugu.

4) Menetlus ja tõendus (kohtukindlus)
-------------------------------------

*   **Juriidiline mõõde on kriitiline**: kas sensoripilt/andmestik sobib menetluse alustamiseks; mis “pitser”/sertifitseerimine/kalibreerimine peab olema.
    Narva keskus Tx2 Recording 385\_…
    → **Nõue**: tõendus-audit: sündmuse ajajoon, allikate kirjeldus, seadme versioon/konf, logid, andmete tervikluse kaitse (hash, allkirjastus, säilituspoliitika).
*   **“Kas ta oli alas sees või mitte”** peab olema objektiivselt taastatav.
    Narva keskus Tx2 Recording 385\_…
    → **Nõue**: geopiiri rikkumise arvutus + reprodutseeritavus (millise geomeetria ja ajamudeli järgi otsustati).

5) Sensorid ja “sensor fusion” (vale- ja topelthäired)
------------------------------------------------------

*   **Praegu tekib “rohkem punkte ekraanile”, aga keegi ei lao kokku** (Rantelon + Remote ID jne).
    Narva keskus Eerik Recording 38…
    → **Nõue**: track correlation / dedupeerimine (sama objekti mitme sensori vaatlused üheks rajaks), koos usaldusväärsuse hinnanguga.
    Kontseptsioonidokument
*   **RF valehäired (nt Wi-Fi)** ja “müra” kasv mitme sensoriga.
    Narva keskus Eerik Recording 38…
    → **Nõue**: tundlikkusrežiimid + filtrid + “näita ainult kindlalt tuvastatud” tavaolekus.
    Kontseptsioonidokument
*   **Remote ID (Hextech) = drooni enda väidetav asukoht**: enamasti õige, aga manipuleeritav/spoofitav risk.
    Narva keskus Eerik Recording 38…
    → **Nõue**: allika-tüüp ja usaldusmärgis (self-reported vs mõõdetud) + fusion reeglid, mis ei “usu pimesi”.

6) Kaamerad, radar, akustika (praktilised piirangud)
----------------------------------------------------

*   **Kaamerad ei pööra üles / on statsionaarsed; võib vajada kalibreerimist**.
    Narva keskus Tx2 Recording 385\_…
    → **Nõue**: kaamera-integratsioon peab arvestama piiranguid (PTZ-võimekus, elevatsioon); “suuna kaamera sinna” ei tohi olla eeldus.
*   **“Iga kaamera kõrvale radar” idee** (radar tuvastab, kaamera kinnitab).
    Narva keskus Tx2 Recording 385\_…
    → **Nõue**: sensorite sidumine (radar→lähim kaamera, vaatesektorid, automaatne “cueing” kui võimalik, muidu soovitus/kiirlingid).
*   **Mikrofonid / akustiline tuvastus**: olemasolev infrastruktuur (kaameravõrk) võimaldaks “odavamalt” akustikat; rõhk detsentraliseerimisel ja täpsel sünkroonil.
    Narva keskus Eerik Recording 38…
    Narva keskus Tx2 Recording 385\_…
    → **Nõue**: edge-töötlus (sündmuspõhine), ajasünk (nt NTP/PTP), privaatsus/retentsioon (enamasti “ei saada midagi”).

7) Katvus ja “tühimikud” (ka kõrgusvahemik)
-------------------------------------------

*   **Katvuse auk 80 m ↔ 300 m**: piirivalve näeb ~80 m, KV alates ~300 m; kes seirab vahemiku?
    Narva keskus Tx2 Recording 385\_…
    → **Nõue**: katvuse/altitude-lünkade nähtavus planeerimisvaates + vastutuse/eskaleerimise reeglid.
    Kontseptsioonidokument
*   **Merepiir**: radarid olemas, aga kõrgus sama suurusjärk; droonid võivad tulla ka “üle lahe”.
    Narva keskus Tx2 Recording 385\_…
    → **Nõue**: mereseire ja maismaaseire vaadete ühtlustus + marsruudi/potentsiaalsete lähenemissuundade käsitlemine.

8) UI/ergonoomika ja alarmimine
-------------------------------

*   **Ergonoomika**: operaator ei peaks “ise otsima”; ekraan võib olla väljas ja süsteem peab “karjuma”; ei tohi tekkida 7 ekraani olukorda.
    Narva keskus Eerik Recording 38…
    Narva keskus Eerik Recording 38…
    → **Nõue**: tugev teavitussüsteem (heli/visuaal), prioriteedid, minimaalne kognitiivne koormus; üks peavaade + drill-down.
    Kontseptsioonidokument
*   **“Kogu Narva ühe ekraani peale”** – operatiivne kaardifookus.
    Narva keskus Tx2 Recording 385\_…
    → **Nõue**: ekraanikujundus “ops-room” kasutuseks (suured markerid, lihtsad filtrid, kiire kinnitamine).

9) NOTAM/AIP keerukus ja ajaloovaade
------------------------------------

*   **NOTAM-id võivad olla “peaaegu legaalne notar”** (keerulised ajareeglid).
    Narva keskus Eerik Recording 38…
    → **Nõue**: tugev NOTAM/AIP normaliseerimine: ajareeglite parser, “kehtib praegu?” otsus, versioonihaldus, auditeeritav ajalugu.
    Kontseptsioonidokument
*   **Ajalugu + sirvimine** on kontseptsioonis; intervjuu rõhutab menetluslikku väärtust.
    Kontseptsioonidokument
    Narva keskus Tx2 Recording 385\_…
    → **Nõue**: sündmuste ajaloo otsing (aeg/ala/sensor/usaldus/staatus).

10) Arendus- ja testimiskeskkond (turvavõrgud, sensoritele ligipääs)
--------------------------------------------------------------------

*   **Arendaja/prototüüp “mul ei ole sensorit”, sensorid istuvad turvavõrgus; vaja tööriistu/AI’d väljaspool politseivõrku**.
    Narva keskus Eerik Recording 38…
    → **Nõue**: offline/sanitized arenduskeskkond: salvestatud sensorivoogude replay, simulaator, testandmete pakett + selge andmete klassifitseerimine.
*   **Välitestimised ja “ämbrisse astumise” vältimine**: F-SEC testid, paigaldus ei edene nagu lubati.
    Narva keskus Tx2 Recording 385\_…
    Narva keskus Tx2 Recording 385\_…
    → **Nõue**: pilootrežiim + KPI’d (uptime, valehäire määr, tuvastuskaugus) ja “must kast” logid hangete valideerimiseks.

11) Tarnijariski, lukustuse ja avatud koodi teema
-------------------------------------------------

*   **Õigus ise arendada + võimalusel avatud kood**; vältida, et “ostame nägemuse, mis 6 kuu pärast aegub”.
    Narva keskus Eerik Recording 38…
    Narva keskus Eerik Recording 38…
    → **Nõue**: lepinguline ja tehniline “vendor exit”: dokumenteeritud liidesed, andmete omand, adapterid, versioonikontroll, asendatavus.
*   **Kinnised kastid / turvaaugud / firmware riskid** (eriti Hiina tarneahel).
    Narva keskus Tx2 Recording 385\_…
    → **Nõue**: tarneahela nõuded (SBOM, haavatavuste protsess, eraldusvõrgud, turvauuenduste poliitika).

12) Muud olulised (organisatsioon, mõõdikud, standardiseerimine)
----------------------------------------------------------------

*   **Ühtse kontseptsiooni puudujääk**: eri piirkonnad/üksused katsetavad, hangivad, aga “miks/milleks/kes käitleb?”
    Narva keskus Tx2 Recording 385\_…
    → **Nõue**: rollid ja vastutusmudel (omanik, operaator, menetleja, hooldus) + standardne protseduur.
*   **Raporteerimine ja tööaja/lennuaja mõõdikud** (Excel “hea näitena”).
    Narva keskus Tx2 Recording 385\_…
    → **Nõue**: (kui scope’i sisse jääb) aruandluse moodul või vähemalt sündmuste ekspordid/standardraportid.

* * *

### Üks potentsiaalne lõks / alternatiivvaade

Kui süsteem üritab **esimesest päevast** olla “kohtus 100% tõendikindel”, võib see **pidurdada** operatiivset väärtust (sensorid, integratsioonid, kasutajakogemus) ja viia üle-inseneerimiseni; praktiline tee on sageli _kahekihiline_: operatiivne “situational awareness” kiht + eraldi “evidence mode” ainult nende juhtumite jaoks, mis lähevad menetlusse.

Narva keskus Tx2 Recording 385\_…

## Prompt:
Narva keskus Eerik Recording 386\_16k\_mono\_PRE180\_vadlight\_20260210\_034724.txt

Document

Narva keskus Tx2 Recording 385\_16k\_mono\_PRE180\_vadlight\_20260210\_035244.txt

Document

## Response:
Thought for 1m 22s

Intervjuust välja tulnud olulised punktid → tulevased nõuded infosüsteemile
---------------------------------------------------------------------------

### 1) Eesmärk, ulatus, “mis on päriselt süsteemi töö”

*   Süsteemi mõte on koondada eri sensorite reaalaja- ja ajalooinfo ühtseks (rollipõhiseks) olukorrapildiks ja toetada hilisemat analüüsi.
    Kontseptsioonidokument
*   Lõppkasutaja ootab pigem **häirepõhist** töörežiimi (ekraan ei pea kogu aeg “valvel” olema; huvi on “kui midagi on, siis karjub”). See haakub kontseptsioonis oleva kaitstava ala + häire loogikaga.

**Nõue:** süsteem peab toetama “vaikimisi passiivne, sündmuse korral aktiivne” operaatormudelit (häired, teavitused, töövood), mitte eeldama pidevat manuaalset jälgimist.

* * *

### 2) Sensorite paljusus + liidestatavus (RF, Remote ID, radar, kaamera, akustika)

*   Kontseptsioon eeldab eri tüüpi sensorite koondamist (Remote ID, RF, drooniradarid jne).
    Kontseptsioonidokument
*   Intervjuus käib läbi väga konkreetne reaalsus: Remote ID on sageli “parim tõde”, kuid on vaja arvestada ka pettuse/ebakindlusega; RF tuvastus võib anda müra ja valepositiivseid (nt Wi-Fi).
*   Kaamerate integreerimine: kaamera “peab silmaga tuvastama mis asi see on”, aga reaalsed kaamerad ei pruugi üles pöörata; droonid/helikopterid on “üle horisondi”.
    Narva keskus Tx2 Recording 385\_…
*   Mõte akustikast (mikrofonivõrk, mustrituvastus) ja rõhk sünkroonimisel + detsentraliseeritusel (kohalik server, sündmusepõhine saatmine).
    Narva keskus Eerik Recording 38…

**Nõuded:**

*   Standardne **adapteri-/plugina-liidestuse** mudel sensoritele (lisanduvad sensorid ei tohi nõuda kogu süsteemi ümberkirjutamist).
*   Igal “vaatluselemendil” peab olema **provenients + usaldusväärsus/konfidents** (Remote ID vs RF vs radar vs kaamera vs akustika), et kasutaja teaks, _millele ta otsust rajab_.
*   Kaameratele peab olema eraldi “cueing” loogika (nt sündmus → soovitus kuhu vaadata; hiljem potentsiaalselt automaatne suunamine), arvestades, et paljud kaamerad ei kata vertikaali.

* * *

### 3) Valehäired, müra ja “valmisoleku režiimid”

*   Kontseptsioon kirjeldab valehäirete probleemi ja valmisoleku taseme režiime (automaatne tundlikkuse tõstmine anomaalia korral; manuaalne režiim).
    Kontseptsioonidokument
*   Intervjuus kinnitatakse sama valu: RF/AI tuvastus võib tekitada rohkem müra; Wi-Fi valepositiivid; seade “annab suuna ja asukoha, aga suund võib samal ajal ringi käia”.

**Nõuded:**

*   Peab olema **tundlikkus-/filtrirežiimide** süsteem (asutuse/pädevuse/ala kaupa) + automaatne eskalatsioon sündmuse ümbruses.
*   UI peab näitama, kas kasutaja vaatab **filtreeritud COP-i** või “tooremat” vaadet (vältimaks olukorda, kus süsteem “vaikib” ja kasutaja ei saa aru miks).
    Kontseptsioonidokument

* * *

### 4) Kaardipõhine töö: keelualad, kaitstavad alad, perimeetrid, “üks ekraan”

*   Kontseptsioonis: alade tüübid (piiranguala NOTAM/AIP, õppuseala, kaitstav ala, varjatud ala) ning geopiiride haldus.
    Kontseptsioonidokument
*   Intervjuus: praktiline soov, et “kogu Narva jookseks ühe ekraani peale” ja kasutaja saaks **häire** siis, kui objekt on keelualas; muul ajal keegi ekraani ei vaata.

**Nõuded:**

*   Kaitstavate/keelualade haldus peab olema **kiire ja operatiivne** (joonista ala → vali teavitused → töötab).
*   Peavaade peab toetama **“üks ekraan / üks kaart”** operaatormudelit (olukord + häirete ajalugu + kontekst samas vaates, minimaalse klõpsimisega).

* * *

### 5) Ligipääsud, varjamine, audit

*   Kontseptsioon: rolli-/atribuudipõhised õigused, regionaalne piiramine, auditeeritavus; sensorite asukohtade/katvuse varjamine või hägustamine; “varjatud ala” kontseptsioon.
*   Intervjuu annab reaalse “miks”: sensorid istuvad turvavõrgus; arendaja/katsetaja ei saa sensoriandmeid kätte; nõusolek/juurdepääs on valus teema.
    Narva keskus Eerik Recording 38…

**Nõuded:**

*   ABAC/RBAC + geopiirangud + auditlogid (kes vaatas, mida eksportis, mis alasid muutis) on kohustuslik baas.
*   Vajalik on **test-/arenduskeskkonna** lahendus: anonüümistatud/sünteetilised andmed või kontrollitud replika (muidu ei saa iteratiivselt arendada ega valideerida).
    Narva keskus Eerik Recording 38…

* * *

### 6) Elutsükkel ja hankerisk: “ära lukusta end 6 kuuks vanasse tulevikku”

*   Intervjuus tugev riskisõnum: droonitehnoloogia areneb kiiresti; hangitud lahendus võib saabumise hetkeks olla väärtusetu; vaja “juurdepääsuõigust ise arendada” ja isegi avatud koodi arutelu.

**Nõuded:**

*   Hanketingimustesse: **õigus ise arendada**, dokumenteeritud API-d, andmemudeli kontroll, väljavahetatavus (vendor lock-in’i vastane arhitektuur).
*   Süsteemi komponendid peavad olema **asendatavad** (sensoradapterid, reeglimootor, teavitused, UI) ja konfigureeritavad, mitte “kivisse valatud”.

* * *

### 7) Teavitused, töökindlus, rikkeinfo

*   Kontseptsioonis: teavitus ühenduse katkemisel; teavitus sensori rikke korral; häirete ajalugu; operaatori reageerimine.

**Nõuded:**

*   Teavituste kanalid ja prioriteedid (UI, push/mobiil, e-post/SMS vms), sh “kasutaja pole enam online” ja “sensori voog ei vasta”.
*   Häirete ajalugu peab olema sirvitav ja filtreeritav (ala, aeg, usaldus, sensoritüüp).
    Kontseptsioonidokument

* * *

### 8) “Lisainfo” (segamine/jamming, ilm jms) ja nõude omaniku põhimõte

*   Intervjuus: segamise jälgimiseks on eraldi platvorm; drooniseiresse toomise väärtus on vaieldav, aga võib anda konteksti (nt miks tsiviildroon “ära läks”).
*   Samas rõhk: kui midagi kuvatakse (nt ilm), peab olema **nõude omanik**, muidu tekib “miks see siin on?” probleem.
    Narva keskus Eerik Recording 38…

**Nõuded:**

*   “Nice-to-have” infokihid peavad olema **konfigureeritavad** ja seotud konkreetse kasutuslooga/omanikuga (kes vastutab, mis otsust see toetab).

* * *

Üks potentsiaalne karikoht (devil’s advocate)
---------------------------------------------

Kui süsteem disainitakse liiga häirekeskseks (“muul ajal keegi ei vaata”), tekib oht, et **pikaaegne luure-/mustriinfo** (nt aeglane harjumuspäratu lend, korduvad trajektoorid, RF-anomaaliad) jääb pealt nägemata, sest see ei ületa ühte kindlat geopiiri korraga. See tähendab: lisaks geopiirihäiretele on vaja vähemalt üht “anomaaliate” kanalit või perioodilist kokkuvõtet, muidu püüad ainult kõige labasemaid rikkumisi.

## Prompt:
Narva keskus Eerik Recording 386\_16k\_mono\_PRE180\_vadlight\_20260210\_034724.txt

Document

Narva keskus Tx2 Recording 385\_16k\_mono\_PRE180\_vadlight\_20260210\_035244.txt

Document

kasutades lisatud kontseptsioonidokumenti, too välja kõik intervjuu olulised punktid - millest tulenevad (tulevased) nõuded infosüsteemile, muud olulised punktid

## Response:
Thought for 2m 34s

Allpool on intervjuudest välja kooritud **olulised punktid** ja neist tulenevad **(tulevased) infosüsteemi nõuded** (joondatud ka kontseptsioonidokumendi loogikaga).

1) Kasutajad, rollid, “kes mida näeb”
-------------------------------------

*   **Rolli- ja piirkonnapõhine olukorrapilt**: eri asutustel/üksustel on erinev “vaade”; vajadus, et nt keskuse “Tallinn” ei jääks pimedaks piiril toimuva osas, samas õigused on administreeritavad.
*   **“Need-to-know” + auditeeritavus**: tegevuslogid peavad olema auditeeritavad, õigused rolli+atribuutide alusel, sh geograafiline segmenteerimine.
*   **Varjatud vaated / varjatud operatsioonid**: süsteem peab toetama tsoone ja objekte, mida tavakasutaja ei näe (“Varjatud ala”, “Nähtamatu droon”).

2) Sensorid ja katvuse probleemid (ning miks “ühest sensorist ei piisa”)
------------------------------------------------------------------------

*   **Mitme sensori koondamine ühte pilti** (Remote ID, RF, radarid, optika jm) + reaalaja ja ajalugu ühes süsteemis.
*   **Katvuse lüngad ja vastutuse küsimus**: intervjuus tuuakse välja kõrgusvahemiku “auk” (nt ~80 m kuni ~300 m) ning vajadus siduda pilti ka KV sensorid/andmed (ja laiemalt “kes seirab mida”).
    Narva keskus Tx2 Recording 385\_…
*   **Merepiiri aspekt**: droon ei pea tulema “otse üle jõe”, võib tulla ka üle lahe → vaadete/katvuse planeerimine peab arvestama meresuunaga.
    Narva keskus Tx2 Recording 385\_…
*   **Akustilise sensori võimalus olemasoleva taristu otsas**: piiril “tuleb ~3000 kaamerat” ja “mikrofoni pistik” → odav sensori-võrk, kui lisada analüütika.
    Narva keskus Eerik Recording 38…

**Nõue süsteemile:** “katvuse/katmata ala” peab olema nähtav (või vajadusel hägustatud), et kasutaja teaks, kas üldse on mõtet midagi loota.

3) Andmete usaldus, Remote ID eripära, müra ja sensor fusion
------------------------------------------------------------

*   **Remote ID on “droonilt endalt väidetav asukoht”**: enamasti õige, aga mitte absoluutne tõde → süsteem peab kuvama _allika_, _usaldusväärsuse_ ja võimaldama ristkontrolli teiste sensoritega.
    Narva keskus Eerik Recording 38…
*   **RF tuvastus tekitab müra (Wi-Fi valepositiivsed jne)** ja teatud seadmete kombinatsioon (RF + RID ühes) võib “tekitada veel rohkem müra”.
    Narva keskus Eerik Recording 38…
*   **Sensor fusion kui tööpõhimõte**: üksik sensor ei erista hästi (droon vs mootor/saag), kuid mitme sensori koosmõjus saab piirkonnas “tõsta teised kõrgemale häiresse”.
*   **Valmisoleku/tundlikkuse režiimid** (automaatne anomaalia korral, manuaalne piirkonna/asutuse lõikes): vaja hallata filtreerimise tugevust ja kuvamislävesid, et operaator ei upuks valehäiretesse.

4) Häired, alad ja kasutajakogemus (UI “ei pea ise otsima”)
-----------------------------------------------------------

*   **Häirepõhine töö**: kasutaja ei peaks “aktiivselt otsima”, vaid süsteem “karjub”/teavitab ainult siis, kui päriselt vaja (sh võimalus, et ekraan on muidu “väljas”).
*   **Ala tüübid ja geopiirid**:
    *   _Piiranguala_ (NOTAM/AIP, avalik),
    *   _Kaitstav ala_ (mitteavalik, kasutajapõhine häireala),
    *   _Õppuseala_,
    *   _Varjatud ala_.
*   **Puhver piirangualade ümber** (varajaseks eelhoiatuseks): intervjuus eraldi mainitud, kontseptsioonis sama mõte “geofencing” kaitstava ala kontekstis.
*   **Mobiilne häirerakendus** + “dünaamiliselt kaasaliikuv kaitstav ala” (isikukaitse/patrullid).

5) Objekti staatused ja käsitsi riskihaldus
-------------------------------------------

*   Vajadus eristada objekte **staatusloogikaga** (neutraalne/loaga/sõbralik/uus/kahtlane/vaenulikkuse kahtlus/vaenulik/nähtamatu) + küsimus “kelle määrata?” käsitsi eskalatsioon.
    Kontseptsioonidokument

6) Operatiivne protsess ja organisatsiooniline koordineerimine
--------------------------------------------------------------

*   **Kes reageerib ja kuidas**: operaator reageerib häirele; intervjuus jookseb läbi ka mõte, kas saata kaugseiregrupi inimene vs “tavaline piirivalvur” jne → süsteemil on vaja toetada sündmuse käsitlust (kes võttis, kellele suunati, mis otsus).
*   **Koostöö ja ühtne kontseptsioon**: intervjuus kriitika “katsetatakse/hangitakse siit-sealt, aga miks/milleks, kes käitleb” → vajadus keskse nähtavuse järele (inventar, kasutusstsenaariumid, rollid, protsessid, dokumentatsioon).
    Narva keskus Tx2 Recording 385\_…
*   **Ajalugu ja hilisem analüüs**: juhtumite/häirete ajalugu ja sirvimine on “first-class” nõue (mitte ainult live-pilt).
    Kontseptsioonidokument

7) Juriidika ja tõendusmaterjal (väga konkreetne “nõuete liivakast”)
--------------------------------------------------------------------

*   Intervjuus rõhutatakse, et on vaja aru saada **kas ja kuidas sensorandmeid saab kasutada menetluse alustamiseks**; mure, et tuvastusseadmetel pole “pitserit küljes” (sertifitseerimise/usalduse teema).

**Nõue süsteemile (praktiline järeldus):**

*   tõenduspakett peab siduma **allika seadme**, **ajatemplid**, **andmete tervikluse** (hash/chain-of-custody), **auditi** ja **ekspordi** nii, et see oleks hiljem kaitstav. (Intervjuu ei ütle vormi ette, aga “kui suur see liivakast on” vajab varakult vastust.)

8) Võrk, ligipääs ja töökindlus
-------------------------------

*   **Kaugjuurdepääs sensoritele väljaspool PPA võrku** (vähemalt mõne mobiilse sensori puhul) on intervjuus eraldi mõttena laual.
    Narva keskus Eerik Recording 38…
*   **Ühenduse- ja sensori tervise teavitused**: “kasutaja ei ole enam online”, “sensori rike / pilt-andmevoog ei vasta” – see peab olema tootes sees, mitte käsitsi avastatav.
    Kontseptsioonidokument
*   **Turberežiimi reaalsus**: tööruumid, kuhu “telefoni sisse ei saa” jne → protsessid/kanalid (nt kontaktid, töökorraldus) peavad arvestama piirangutega.
    Narva keskus Tx2 Recording 385\_…

9) Hankestrateegia ja tehnoloogia kiire vananemise risk (mõjutab arhitektuuri nõudeid)
--------------------------------------------------------------------------------------

*   Intervjuus tugev mure, et valdkond areneb nii kiiresti, et lahendus võib “poole aasta pärast” olla väärtusetu; kogemus, et hangitakse asju, mis kohale jõudes enam ei väärtusta.

**Nõue süsteemile:** eelistada modulaarset sensoriliidestust ja vahetatavaid komponente (et mitte jääda ühe konkreetse seadme/softi külge kinni).

* * *

### Üks võimalik komistuskivi / alternatiivvaade

Juriidilise “tõendusmaterjali” taseme sisse-ehitamine algusest võib teha süsteemi oluliselt raskemaks ja kallimaks (sertifitseerimine, protsessid, auditi rangus); realistlikum võib olla **2-astmeline tee**: alguses operatiivne olukorrapilt + logid, ning eraldi “evidence mode / evidence pipeline” lisandina siis, kui nõuded ja vastutajad (sh “pitseri” teema) on päriselt paigas.

## Prompt:
kasutades lisatud kontseptsioonidokumenti, too välja kõik intervjuu olulised punktid - millest tulenevad (tulevased) nõuded infosüsteemile, muud olulised punktid.

kirjelda pikemalt varem toodud nõuete tausta lahti

## Response:
Thought for 1m 13s

Allpool on **varem toodud nõuete “miks”** ehk taust lahti kirjutatud (intervjuu + kontseptsioonidokk koos).

1) “Süsteem peab ise karjuma” – operaatori töövoog ja ergonoomika
-----------------------------------------------------------------

Intervjuus jookseb läbi väga praktiline mure: piirivalves/operatiivis **ei ole aega “otsida ja tõestada”**, vaid tööloogika on pigem see, et **kui midagi on, siis süsteem annab märku**, mitte ei eelda, et kasutaja jõllitab kaarti. Sealt tuleneb nõue selgele alarmimudelile (heli/visuaal), “taustal töötamisele”, ning sellele, et UI ei oleks pelgalt kaart, vaid **häirejuhtimise tööriist**.  
Kontseptsioonis on sama mõte formaliseeritud teavitustena (häire geopiiri rikkumisel, sensori rike, ühenduse katkemine) ja operaatori reageerimisrollina.

2) Ühine olukorrapilt + ajalugu: “reaalaeg + hilisem analüüs”
-------------------------------------------------------------

Kontseptsioon rõhutab, et süsteem koondab eri sensorite reaalaja- ja ajalooinfo “ühtseks pildiks”, et oleks nii **olukorrateadlikkus** kui **hilisem sündmuse analüüs** (juhtumite ajalugu, sirvimine). See pole “nice-to-have”, vaid operatiivse otsuse ja järeltegevuste alus (kes, kus, millal, mis sensor ütles, mis kindlusega).

3) Mitme sensori paratamatus: Remote ID + RF + radar + optika + (odav) akustika
-------------------------------------------------------------------------------

Intervjuu taust on selge: üks sensor üksi on kas kallis, katkendlik või mürane. Räägitakse, et **Remote ID on odav ja “tuleb igale poole panna”**, RF ja radar on “kindlasti teema”, ning lisaks kerkib idee kasutada olemasolevat taristut: **piiril “tuhanded kaamerad”, millel on mikrofonipesa**, millest saaks odava akustilise sensori-võrgu (tarkvara teeb analüüsi). See tekitab otsese nõude: süsteem peab suutma ingestida väga eri tüüpi signaale ja lubama neid koos kasutada.  
Lisataust: optika üksi võib olla problemaatiline (nt kaamerad ei pruugi üles horisondi kohale pöörata), seega “ainult kaameraga” lähenemine ei kata drooniprofiile.

Narva keskus Eerik Recording 38…

4) Sensor fusion + “valmisoleku režiimid” – valehäirete juhtimine, mitte ignoreerimine
--------------------------------------------------------------------------------------

Kontseptsioon ütleb otse: droonisensorid annavad palju valepositiivseid (linnud, RF nagu Wi-Fi), eesmärk on operaatorit mitte üle koormata ning selleks on **filtrid + tundlikkusrežiimid (automaatne/manuaalne)**. See on sisuliselt poliitika: _mida näidata, mida peita, millal eskaleerida_.  
Intervjuu lisab “päris elu” detaili: RF-seadmetel võib Wi-Fi anda valehäireid; Remote ID on enamasti hea tõde, aga seda saab potentsiaalselt mõjutada/kuritarvitada — järelikult peab süsteem käsitlema allikate **usaldusväärsust** ja kombineerima signaale, mitte “uskuma ühte”.  
Ja veel: intervjuus kõlab fusion’i taktikaline kasutus—kui üks sensor vihjab, siis “tõmban alas teised kõrgemale häiresse”. See tähendab nõuet **reeglitele/eskalatsiooniloogikale** sensoriüleselt.

5) Alad: piiranguala vs kaitstav ala vs varjatud ala + puhvertsoon (eelhoiatus)
-------------------------------------------------------------------------------

Kontseptsioon eristab mitu “ala tüüpi”, sest üks geopolügoon ei tähenda ühte eesmärki:

*   **Piiranguala** (NOTAM/AIP, avalik)
*   **Kaitstav ala** (asutuse/objekti/ISIKUkaitse häireala, mitteavalik; võib olla ka geofencing/puhver)
*   **Varjatud ala** (operatiivinfo peitmine tavakasutajale)

Intervjuus tekib konkreetne vajadus: lisaks “päris” piirangualale tahetakse **puhverala**, mis annab alarmi juba enne, kui rikkumine toimub—et oleks reageerimisaega, eriti piiril ja objektide ümbruses (“ER1 ala ees” jne). See on sisuliselt nõue **mitmetasemelisele geopiirile** (warning ring vs violation ring) ning vastavale teavituse prioriteedile.

6) Rolli- ja piirkonnapõhine vaade: “Tallinn ei pea nägema piiri detaile” (ja vastupidi)
----------------------------------------------------------------------------------------

Kontseptsioonis on see vormistatud: **õigused rolli+atribuutide alusel**, piirkondlik segmenteerimine, auditeeritavus; lisaks saab varjata sensorite asukohti ja katvust (sh “hägustatud katvuskaart”).  
Intervjuu annab väga konkreetse motivatsiooni: süsteem peab olema “suurem”, kuid **igal asutusel oma vaade**, ja isegi riigisiseselt ei ole alati soov/õigus näha teise regiooni detaile (“Tallinn ei näe, mis piiril toimub…”). See tähendab nõuet mitte ainult UI filtrile, vaid ka serveripoolsele **andmepoliitikale** (ABAC/regionaalne piiramine, varjatud alad).

7) Teavitused ja mobiil: patrullile “lähedal on droon”
------------------------------------------------------

Kontseptsioonis on mobiilirakendus kui “kaasaskantav häirerakendus”: kasutaja saab teha **liikuva kaitstava ala** enda ümber ning saada hoiatusi teekonna/asukohapõhiselt (“Sinu lähedal on droon”), lisaks küsimus “kas kasutaja on sensoritega kaetud?”. Siin taust on selgelt operatiiv: patrull ei vaata kaarti, patrull vajab _push_ märguannet ja katvuse tunnetust.

8) Juriidika/menetlus: kas andmestik on “päriselt kasutatav” või ainult situatsiooniteadlikkus?
-----------------------------------------------------------------------------------------------

Intervjuus tõuseb otse küsimus: kui droonid rikuvad reegleid, **kes hakkab menetlema** ja kas seadmed/andmed on sellised, et saab “reaalset menetlust alustada” — see on “järgmine juriidiline osa”. Nõue siit: sündmuste logi peab olema **tõendikõlbulikkuse suunas disainitud** (ajastus, terviklus, jälgitavus, eksporditavus, audit).  
Kontseptsioon toetab seda kaudselt “auditeeritavuse” nõudega (kõik tegevused logitud/auditeeritavad).

Kontseptsioonidokument

9) NOTAM/AIP “päris elu”: masinloetavaks arvutamine, mitte ainult kaart
-----------------------------------------------------------------------

Intervjuus on hea näide, miks “NOTAMi parsimine” ei ole triviaalne: ajareeglid võivad sõltuda pühadest, päikesetõusust/-loojangust jne — et teada, kas “keeluala töötab”, on vaja infosüsteemi, mis suudab need reeglid **reaalajas arvutada**. Nõue: piirangualade mootor peab olema ajaloogikaga (scheduling), mitte lihtsalt käsitsi joonistatud polügoonid.

10) Kooselu teiste platvormidega (nt segamise seire): “ei pruugi olla core, aga kontekst on”
--------------------------------------------------------------------------------------------

Intervjuus mainitakse eraldi platvormi, kus jälgitakse segamist (jamming) eeskätt oma/partnerite lendude kooskõlastamiseks; drooniseire vaates lisandväärtus võib olla piiratud, kuid intsidentide korral vaadatakse seda niikuinii kontekstiks. Siit nõue: süsteem peab suutma **linkida/viidata** välisele allikale või integreerida minimaalsel kujul, et operaatoril oleks “üks juhtumipilt”.

11) Arhitektuuri taust: hange vs kiiresti arenev valdkond (lock-in’i allergia)
------------------------------------------------------------------------------

Intervjuus on üsna karm kogemus: droonitehnoloogia areneb kiiresti ja on risk, et hangitud lahendus “poole aasta pärast” enam ei sobi; räägitakse varasematest hangetest, mis kohale jõudes enam väärtust ei omanud. See on otsene põhjendus nõudele: **modulaarsus, vahetatavad sensoradapterid, standardiseeritud liidesed**, et süsteem ei kivistuks ühe müüja või ühe sensori ümber.

* * *

### Üks potentsiaalne komistuskivi / alternatiivvaade

Kui sa üritad **kohe** ehitada “menetluskõlbulikku tõendiplatvormi” ja samal ajal “kõik sensorid + fusion + mobiil”, siis kipub scope minema kontrolli alt: menetlusnõuded (terviklus, sertifitseerimine, protsessid) võivad neelata kogu energia enne, kui operatiivne väärtus tekib. Praktiline vastukäik on faasida: _esmalt situatsiooniteadlikkus + häired + ajalugu_, ja tõendikõlbulikkus üles ehitada selgelt eraldi “evidence pipeline’ina” (sama andmebaas ei pea alguses kõike kandma).



---
Powered by [ChatGPT Exporter](https://www.chatgptexporter.com)