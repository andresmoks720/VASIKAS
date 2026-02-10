# Intervjuu punktid ja nõuded

**User:** Andres Moks (andres.moks@gmail.com)  
**Created:** 2/10/2026 21:08:54  
**Updated:** 2/11/2026 0:00:34  
**Exported:** 2/11/2026 0:03:16  
**Link:** [https://chatgpt.com/g/g-p-698b7a30d6848191bacb8cff5277cb17-intekad/c/698b8245-2258-8389-a891-507e38bd6019](https://chatgpt.com/g/g-p-698b7a30d6848191bacb8cff5277cb17-intekad/c/698b8245-2258-8389-a891-507e38bd6019)  

## Prompt:
Kv Recording 391\_16k\_mono\_PRE180\_vadlight\_20260210\_032915.txt

Document

kasutades lisatud kontseptsioonidokumenti, too välja kõik intervjuu olulised punktid - millest tulenevad (tulevased) nõuded infosüsteemile, muud olulised punktid

## Response:
Thought for 3m 31s

Allpool on **intervjuu sisulised punktid → neist tulenevad (tulevased) infosüsteemi nõuded**, ning lõpus **kontseptsioonidokumendi enda “nõuderikkad” kohad**, mis intervjuus otseselt ei avanud, aga tuleb nõueteks vormistada.

1) Intervjuu punktid → tulevased nõuded infosüsteemile
------------------------------------------------------

### A. Kaitsevägi / Anduril / “topeltsüsteemi” vältimine

*   **Punkt:** käib surve/soov, et Anduril oleks “põhitööriist” ja et ei tekiks _kaks paralleelset seiresüsteemi_; minimaalselt peavad lahendused olema ühilduvad.
    Kv Recording 391\_16k\_mono\_PRE18…
    **Nõuded:**
    *   defineeri **miinimum-ühilduvusprogramm** (ühine andmemudel + sündmusetüübid + identifikaatorid + ajatempli/koordinaadi reeglid) ja selle testid;
    *   **interoperability-first**: adapterid/konnektorid (sensorid, KV/PPA vahetus, võimalik Anduril-integratsioon) peavad olema eraldi kihis, mitte UI-s;
    *   “üks pilt, mitu tarbijat”: sama sündmus peab olema erineva detailsusega (rollipõhine).
*   **Punkt:** Andurili “hajali” olemus (igaüks peab oma osa oskama).
    Kv Recording 391\_16k\_mono\_PRE18…
    **Nõuded:**
    *   selge **liidestuslepingute** komplekt (API/stream skeemid, veakoodid, versioonimine, testvektorid);
    *   **operatiivne observability** (kui mõni osa “oma osa” ei tee, peab süsteem tuvastama ja raporteerima).

### B. Reaalaja andmevood vs X-tee

*   **Punkt:** X-tee on sobiv _infosüsteemide päring-vastus_ liidestuseks, kuid **ei sobi sensori/radaripildi reaalajavooks**; X-teed võib kasutada _striimi tellimise/auditeerimise_ kontrolltasandina, kuid andmevoog ise peab jooksma mujal.  
    **Nõuded:**
    *   **andmetasand**: pub-sub/streaming (nt message broker + WebSocket/SSE UI-le) sensori-toorandmete ja fused-trackide jaoks;
    *   **kontrolltasand**: X-tee (või samaväärse auditeeritavusega mehhanism) striimi _käivitamiseks_, õiguste kontrolliks ja logimiseks;
    *   eraldi **integreerimisliidesed** “klassikalisteks” päringuteks (nt lubade/registrite päringud) ning eraldi **madala latentsusega** vood sensori- ja kasutajavaadetele.

### C. Katvusalad, nende tundlikkus ja “ringikeste” probleem

*   **Punkt:** katvusalade täpne visualiseerimine võib “hakata oma elu elama”; eelistatakse mitte jagada täpseid ringe, vaid pigem _tihedus/“mitu sensorit piirkonnas”_ tüüpi infot; samas planeerijad vajavad teada, kas koht on kaetud.  
    **Nõuded:**
    *   katvuse kuvamiseks **mitu detailsusastet**:
        *   _täpne_ (ainult sisekasutus / piiratud rollid),
        *   _hägustatud/agregeeritud_ (soovituslikult ruudustik/heatmap/density, mitte ring),
        *   _binaarne indikaator_ (“kaetud / kahtlane / katmata”) rollipõhiselt;
    *   katvusaladel **ebakindluse märkimine** (mudel sõltub sensori tüübist ja paigaldusest; “planeerimisrežiim” peab toetama oletusi);
    *   katvuse andmetel **versioonihaldus + kehtivus** (et eilne “rõngas” ei muutuks vaikimisi “tõeallikaks”).

### D. Ajastus ja nõuete haldus (LBK / lisavajadused)

*   **Punkt:** LBK on esitatud; 26. märts on koht, kus uusi lisavajadusi tuleb hakata “kirjaga lisandima”.
    Kv Recording 391\_16k\_mono\_PRE18…
    **Nõuded (protsessilised, aga süsteemi mõjutavad):**
    *   nõuete kataloog peab toetama **traceability’t** (nõue → eelarve/tegevus → komponent);
    *   muudatuste haldus: “mis lisandus pärast eelanalüüsi” peab olema auditiga nähtav.

### E. Koostöörežiim tarnijaga / igapäevane töö

*   **Punkt:** vaja kiiresti käima saada **igapäevane koostöö**, mitte harvad kokkuvõtted; “asjad on muutunud” võrreldes eelanalüüsi algse küsimisega.
    Kv Recording 391\_16k\_mono\_PRE18…
    **Nõuded:**
    *   tehniline: backlog + otsuste logi + liideste versiooniplaan (muidu “igapäevane koostöö” = igapäevane segadus);
    *   kasutus: rollid/õigused ja “kes mida näeb” tuleb varakult fikseerida (muidu UI/katvus/varjatus triivib).

### F. AI teema liiga üldine → vaja konkretiseerida

*   **Punkt:** küsimus “mis koguses AI vajalik ja millist andmevoogu/kvaliteeti AI tahab” on liiga üldine, sest pole kirjas, _mis AI ja mida ta teeb_.
    Kv Recording 391\_16k\_mono\_PRE18…
    **Nõuded:**
    *   defineeri AI kasutusjuhtum(id): nt _anomaaaliatuvastus, klassifitseerimine, sensor fusion’i abistamine, valehäire filtreerimine_;
    *   iga kasutusjuhtumi jaoks **andmenõuded** (sagedus, latentsus, kvaliteedimärgendid, ground-truth).

2) Kontseptsioonidokumendi enda “nõuderikkad” kohad (mis tuleb formaliseerida)
------------------------------------------------------------------------------

Need punktid on dokumendis juba sees, aga intervjuu kontekstis tasub need kohe nõuete keelde tõsta:

*   **Reaalaja olukorrapilt + ajalugu + sensor fusion** (valealarmide vähendamiseks; rollipõhine filtreerimine).
*   **Häired geopiiri rikkumisel**, häirete ajalugu, ning teavitused _ühenduse katkemisel_ ja _sensori rikke korral_.
    Kontseptsioonidokument
*   **Planeerimisvaade katvusaladega (hägustatud?)** ja võimalus sensori asukohti/katvust varjata teadmisvajaduse põhiselt.
    Kontseptsioonidokument
*   **Mobiilirakendus**: kaasaliikuv kaitstav ala + “Sinu lähedal on droon” taustateavitus + võimalik “kas olen kaetud?” indikaator.
    Kontseptsioonidokument
*   **Turvalisus**: rolli- ja atribuudipõhised õigused, regionaalne piiramine, auditeeritavad tegevuslogid.
    Kontseptsioonidokument
*   **Alatüübid** (piiranguala/õppuseala/kaitstav ala/varjatud ala) ja **droonide staatused** (neutraalne, loaga, sõbralik, uus, kahtlane, vaenulik jne) – need on sisuliselt klassifitseerimis- ja filtreerimisnõuded.
*   **Valmisoleku/tundlikkusrežiimid** (automaatne/manuaalne) – see on otseselt “kui palju näitame ja millal” poliitika, mitte ainult UI-lipp.
    Kontseptsioonidokument

Potentsiaalne lõks / alternatiivvaade
-------------------------------------

Kui “minimaalne ühilduvus Anduriliga” kirjutatakse liiga varakult _konkreetse toote kuju järgi_, tekib vendor-lock ja arhitektuur hakkab elama kellegi teise roadmap’i järgi. Alternatiiv: kinnista esmalt **tooteneutraalne miinimumandmemudel + striimi/SLA nõuded + adapterikihi piir**, ja lase alles siis konkreetsetel toodetel sinna “pistiku” kaudu sobituda.

## Prompt:
Kv Recording 396\_16k\_mono\_PRE180\_vadlight\_20260210\_033117.txt

Document

kasutades lisatud kontseptsioonidokumenti, too välja kõik intervjuu olulised punktid - millest tulenevad (tulevased) nõuded infosüsteemile, muud olulised punktid

## Response:
Thought for 57s

Allpool on **intervjuude (391 + 396) olulised punktid** ja neist tulenevad **tulevased nõuded infosüsteemile**, joondatuna sinu **kontseptsioonidokumendi** teemadega.

* * *

1) Arhitektuur ja andmevahetus (kontseptsioon: reaalaja + ajalugu, sensor fusion)
---------------------------------------------------------------------------------

### 1.1 X-tee ei sobi reaalaja sensori-/radaripildiks

**Intervjuu punkt:** X-tee on päring-vastus; reaalaja radaripilt ja sensori vood peavad käima voogedastusena. X-teed saab kasutada pigem _striimide tellimise/autoriseerimise/auditi_ “kontrolltasandina”, mitte andmekandjana.  
**Nõuded:**

*   **REQ: Reaalaja andmetasand** (pub/sub, message broker, WS/SSE) sensori-toorandmetele + fused-trackidele.
*   **REQ: Kontrolltasand** (X-tee või sarnane) striimi tellimuse, kasutaja/asutuse õiguste ja auditi jaoks.
*   **REQ: Latentsusnõuded** (UI “olukorrapilt” vs analüütika vs arhiiv) tuleb eristada juba skeemides.

### 1.2 “Üks ühine pilt” peab olema rollipõhiselt filtreeritud

**Kontseptsioon:** “Kasutajale näidatakse filtreeritud ja rollipõhist olukorrapilti”, sensor fusion valehäirete vähendamiseks.  
**Intervjuu rõhuasetus:** eri asutustel on eri töörežiimid (monitooring vs kohe reageerimine) ning süsteem peab seda toetama.

Kv Recording 396\_16k\_mono\_PRE18…

**Nõuded:**

*   **REQ: Kasutajaprofiilid/rollid** (monitoorija, operaator, planeerija, patrull, juhtimistasand) + igaühe “default-vaated”.
*   **REQ: Sama sündmus mitmes detailsusastmes** (nt tavakasutaja vs erikasutaja).

* * *

2) Sensorid, fusion ja track’i kvaliteet (kontseptsioon: “sensor fusion”, drooni staatused)
-------------------------------------------------------------------------------------------

### 2.1 “Detect–classify–correlate” on tuum (akustika + radar + RF jne)

**Intervjuu punkt:** Digital Shield raames demonstreeriti drooni tuvastust, klassifitseerimist ja korrelatsiooni; eesmärk on jõuda samale track’ile (mitte “käsitsi kokku viimine”).

Kv Recording 396\_16k\_mono\_PRE18…

**Nõuded:**

*   **REQ: Ühtne track-mudel** (track\_id, allikad, confidence, klass, ajalugu).
*   **REQ: Sensorite panus track’i** (source attribution, fusion rules, kvaliteedimõõdikud).
*   **REQ: Drooni staatused** (neutraalne/loaga/sõbralik/uus/kahtlane/vaenulik/nähtamatu) peavad olema sidustatud reeglite ja auditiga (kes, millal, miks muutis).

### 2.2 Valmisoleku/tundlikkusrežiimid on päris operatiivfunktsioon, mitte UI-lipp

**Kontseptsioon:** automaatne/manuaalne tundlikkus, valehäirete filtreerimine, operaatori koormuse vähendamine.

Kontseptsioonidokument

**Nõuded:**

*   **REQ: Režiim mõjutab filtreid ja alarmilävesid** (piirkond/asutus/patrull).
*   **REQ: Automaatse tõstmise põhjenduslogi** (miks süsteem “tõstis tundlikkust”).

* * *

3) Häired, ajalugu, töökindlus (kontseptsioon: häired, ajalugu, rikke-teavitused)
---------------------------------------------------------------------------------

**Kontseptsioon:** geopiiri rikkumise alarm, häirete ajalugu, serveri ühenduse katkemine, sensori rikke teavitus.  
**Intervjuu lisamõõde:** harjutustes tahetakse teha kogu “detect–decide–impact” otsustusahelat ning mõõta võimekust.  
**Nõuded:**

*   **REQ: Alarmide elutsükkel** (new → triage → assigned → resolved) + kes tegi mis otsuse.
*   **REQ: Ajaloo taasesitus** (timeline + kaardireplay) harjutuste ja intsidentide järelanalüüsiks.
*   **REQ: Mõõdikud** (latentsus, valehäirete määr, katvuse/kättesaadavuse % sensori lõikes).

* * *

4) Pilv, võrgud ja rahvusvaheline koostöö (kontseptsioon: “ühtne pilt osapooltele”)
-----------------------------------------------------------------------------------

### 4.1 Kaasatakse “kommertspilv” ja mitme riigi sensorid

**Intervjuu punkt:** Digital Shield 2.0 sihib mitme riigi (sh Läti/Leedu) sensoreid ühte pilve; pilveplatvormina mainitakse Google/Microsoft; pilt jagatakse ka CRC/NATO konteksti.  
**Nõuded:**

*   **REQ: Multi-tenant / multi-agency eraldus** (andmete segregatsioon, õigused, auditeerimine).
*   **REQ: Cross-domain jagamine** (mis on “unclassified” vs mis läheb NPA/NATO võrkudesse; selged ekspordireeglid ja filtrid).
    Kv Recording 396\_16k\_mono\_PRE18…
*   **REQ: Liidestusstandardid** (skeemid, versioonihaldus, testvektorid) sensorite ja C2-de ühendamiseks.

* * *

5) Katvusalad, planeerimine ja “varjamine” (kontseptsioon: “katvusalad (hägustatud?)”, varjatud ala)
----------------------------------------------------------------------------------------------------

**Kontseptsioon:** planeerimisvaade katvusaladega (hägustatud?), sensorite asukohti/katvust saab varjata; varjatud ala ei kuva tavakasutajale.  
**Nõuded:**

*   **REQ: Katvuse kuvamise tasemed** (täpne / hägustatud / binaarne “kaetud?”).
*   **REQ: Varjatud ala semantika** (mida täpselt varjatakse: sensorid, trackid, häired, ajalugu; kellele mis jääb nähtavaks).
*   **REQ: Planeerimisrežiim** (teekonnad/isikukaitse, uute sensorite asukoha analüüs).

* * *

6) Mobiil ja “patrullirežiim” (kontseptsioon: mobiilne häirerakendus)
---------------------------------------------------------------------

**Kontseptsioon:** kaasaliikuv kaitstav ala, “Sinu lähedal on droon” taustateavitus, võimalik “kas olen kaetud?” indikaator.  
**Nõuded:**

*   **REQ: Asukohapõhine alarmipoliitika** (taustal töötav, aku/andmeside piirangud, offline-käitumine).
*   **REQ: “Kaetud/katmata” otsus** peab arvestama katvuse ebakindlust ja õiguseid (mitte lekitada sensorite geomeetriat).

* * *

7) Hanked, testperiood ja vendor-lock risk (intervjuu “muud olulised punktid”, aga mõjutab nõudeid)
---------------------------------------------------------------------------------------------------

### 7.1 Vajadus vältida “mitut C2-te” ja sõltuvust ühe tootja tahtest

**Intervjuu punkt:** praktikas on juba mitu C2-te ja see on koormav; lõppeesmärk on oma platvorm, mis ei sõltu ühe eraettevõtte “võtmetest”.  
**Nõuded:**

*   **REQ: Adapterikiht + tooteneutraalne sisemine andmemudel** (tootja vahetus ilma UI/tuuma ümberkirjutuseta).
*   **REQ: Andmete omandi ja ekspordi nõuded** (raw + fused + audit log; masinloetav eksport; “exit plan”).

### 7.2 Testimine “põllul” paralleelselt eelanalüüsiga

**Intervjuu punkt:** rõhutatakse keskkonda, kus eri osapooled saavad proovida ja näha miinuskohti; see aitab hiljem hankesse puudujäägid õigesti kirjeldada.  
**Nõuded:**

*   **REQ: Testkeskkond / harjutusrežiim** (simuleeritud sensorid, replay, logide kogumine, “scenario packid”).
*   **REQ: Nõuete jälgitavus** (testitulemus → puudujääk → hankenõue).

* * *

8) Digital Shield / harjutuse ajastus ja praktilised piirangud (muud olulised punktid)
--------------------------------------------------------------------------------------

*   Harjutus on faasiline (“existing procedures” → “what to buy” jne) ja live-shooting päev sõltub edenemisest (märtsi algus, 4–6).
*   “Kõige keerulisem” on osalevate ettevõtete/komponentide täpne teadmine (kes tuleb, mida vajab, kuidas liidestub).
    Kv Recording 396\_16k\_mono\_PRE18…
*   Sky Fortress’i puhul mainitakse ulatuslikku sensorite paigaldust (hangitakse suur kogus; tahetakse valideerida paigaldus ja tegelik töö).  
    **Nõuete mõttes:** see surub peale “onboarding” protsessi ja liidestuse miinimumkomplekti (andmevormingud, ühenduse tervisekontroll, seadme identiteet, ajastuse sünk).

* * *

Üks potentsiaalne lõks / alternatiivvaade
-----------------------------------------

Kui “ühine pilt” tehakse liiga kiiresti **ühe konkreetse C2 (nt Lattis/Anduril) kuju järgi**, tekib disainivõlg: iga uus sensor/asutus hakkab maksma “erandite” hinnaga. Tugevam tee on lukustada varakult **tooteneutraalne sisemine track-/alarmimudel + adapterikiht + testvektorid**, ja alles siis sobitada konkreetsed C2-d sinna otsa.

## Prompt:
N1 Recording 392\_16k\_mono\_PRE180\_vadlight\_20260210\_034110.txt

Document

kasutades lisatud kontseptsioonidokumenti, too välja kõik intervjuu olulised punktid - millest tulenevad (tulevased) nõuded infosüsteemile, muud olulised punktid

## Response:
Thought for 1m 27s

Allpool on intervjuudes kõlanud olulised punktid ja neist tuletatavad (tulevased) infosüsteemi nõuded, sidudes need kontseptsioonidokumendi loogikaga.

1) Üleriiklik “üks ühine vaade” ja sidusrühmad
----------------------------------------------

*   **Punkt:** riigis on “segadust, kellele ülesanded maanduvad”, eri asutused nokitsevad eraldi, aga ootus on **üleriiklik ühtne vaade**; Riigikantselei rolli mainitakse eestvedajana ning sidusrühmade kaasamine on võtmetähtsusega.
    N1 Recording 392\_16k\_mono\_PRE18…
    **Nõue:** infosüsteem peab toetama **multi-asutuse ühist COP-i** (common operational picture) rolli-/atribuudipõhiselt, sh erinevad andmetarbijad (PPA, KV, ministeeriumid, jt) ja erinev detailitase.
*   **Punkt:** kaitseväel on oma lahingujuhtimise/olukorrateadlikkuse süsteemid, kuhu see info peaks sobituma (eriti kriisi/konflikti kontekstis).
    N1 Recording 392\_16k\_mono\_PRE18…
    **Nõue:** süsteemil peab olema **standardipõhine integratsioonikiht** “andmetarbijatele”, et eksportida jälgi/juhtumeid teistesse C2/COP süsteemidesse (mitte ainult “ühes UI-s näitamine”).

2) Arhitektuursed põhimõtted (modulaarsus, töökindlus, tarnijasõltumatus)
-------------------------------------------------------------------------

*   **Punkt:** arhitektuuriline visioon rõhutab modulaarsust, hajusust, töökindlust (ei tohi olla single point of failure), turvalisust, skaleeritavust, standardipõhist integratsiooni, **tarnijasõltumatust** ja tulevikukindlust.
    N1 Recording 392\_16k\_mono\_PRE18…
    **Nõue:** pluggable/adapter-arhitektuur sensoritele ja tarbijatele; komponendid peavad olema eraldi vahetatavad/uuendatavad; töökindluse eesmärgid (HA, degrade modes) peavad olema nõuetes.
*   **Punkt:** “meil on neli erinevat C2-te… igaüks kannab eri asju” ning vajadused erinevad (monitooring vs reageerimine).
    Kv Recording 396\_16k\_mono\_PRE18…
    **Nõue:** süsteem peab toetama **mitut töörežiimi ja kasutajaprofiili** (monitoorija, reageerija, planeerija), sh erinevad vaated/filtrid/teavitused.

3) Integratsiooniloogika ja andmevood (päring vs voog)
------------------------------------------------------

*   **Punkt:** arutelus tuuakse selgelt välja, et **reaalaja radaripilti ei tohi “toppida X-tee päringutesse”**; X-tee sobib pigem infosüsteemidevahelisteks päringuteks, mitte sensorivoogudeks; kasutajale peab info tulema voona.
    Kv Recording 391\_16k\_mono\_PRE18…
    **Nõue:** nõuetes eristada:
    *   **sensorite ingest = stream/event** (madal latentsus, push, message bus),
    *   **päringuliidesed = query** (nt registrid, metaandmed),
    *   **kasutajaliidese reaalaja feed = stream** (WebSocket/SSE vms).
*   **Punkt:** arhitektuuris tuleb otsustada, kas integratsioon on sündmuspõhine või pidev voog; kus toimub rikastamine/korrelatsioon ja kus pannakse kokku olukorrapilt.
    N1 Recording 392\_16k\_mono\_PRE18…
    **Nõue:** nõuetes määrata **korrelatsioonikihi asukoht** (edge vs keskne), **jälje elutsükkel** (track ID, merge/split), ja “rikastamise” reeglid (nt RemoteID/RF/radar/EO-IR).

4) Põhifunktsioonid: ühtne reaalaja + ajalugu, häired, planeerimine
-------------------------------------------------------------------

Kontseptsioonidokument seab baasi: eri sensorite reaalaja- ja ajalooinfo ühte pilti, sensor fusion valehäirete vähendamiseks, rollipõhine olukorrapilt.

Kontseptsioonidokument

Tuletatud nõuete “tuumplokk”:

*   **Reaalaja olukorrapilt + ajalugu:** juhtumite ajalugu ja sirvimine, sh hilisem analüüs.
    Kontseptsioonidokument
*   **Häired geopiiri rikkumisel:** “asutus saab häire, kui objekt siseneb kaitstavasse alasse”.
    Kontseptsioonidokument
*   **Töökindluse teavitused:** ühenduse katkemine (kasutaja offline) ja sensori rike/andmevoo kvaliteedihäire.
    Kontseptsioonidokument
*   **Planeerimisvaade:** sensorite katvusalade vaade (sh vajadusel hägustatud) teekondade planeerimiseks ja uute sensorite asukohtade analüüsiks.
    Kontseptsioonidokument
*   **Mobiilne häirerakendus:** dünaamiline “kaasaliikuv kaitstav ala”, patrullile taustteavitus (“sinu lähedal on droon”).
    Kontseptsioonidokument

Lisaks sinu intervjuu-notest (julgestusteenus = VIP/isikukaitse + objekti valve + suurüritused) tuleneb praktiline nõue: **kaitstavate alade, teekondade ja suurürituse tsoonide haldus** peab olema kiirelt konfigureeritav ning toetama “operatiivset” kasutust (mitte ainult analüütika).

5) “Varjatud/avalik” ja rollipõhine nähtavus (ABAC)
---------------------------------------------------

*   **Punkt (kontseptsioon):** õigused rolli ja atribuutide alusel, võimalik regionaalne piiramine, kõik tegevused auditeeritavad.
    Kontseptsioonidokument
    **Nõue:** ABAC/role+attribute mudel peab olema nõuetes “esimese klassi” teema (asutus, piirkond, ülesanne, sündmus, andmeklass).
*   **Punkt (kontseptsioon):** alade tüübid: piiranguala (NOTAM/AIP), õppuseala, kaitstav ala (mitteavalik), varjatud ala (tavakasutajale ei kuva).
    Kontseptsioonidokument
    **Nõue:** nõuetes peab olema **multi-class visibility** (avalik/asutuse-sisene/varjatud), sh katvuse ja sensorite asukohtade varjamine või hägustamine.
    Kontseptsioonidokument
*   **Punkt (kontseptsioon):** drooni staatused (neutraalne/loaga/sõbralik/uus/kahtlane/vaenulik/nähtamatu).
    Kontseptsioonidokument
    **Nõue:** nõuetes määrata **klassifitseerimise skeem** + kes/ kuidas staatusi paneb (automaat vs manuaal) + audittrail.

6) Valehäired, koormus ja “valmisoleku režiimid”
------------------------------------------------

*   **Punkt (kontseptsioon):** sensorid toodavad palju valepositiive; vaja filtreid; tundlikkuse režiimid (automaatne anomaalia korral vs manuaalne tõstmine).
    Kontseptsioonidokument
    **Nõue:** nõuetes peab olema:
    *   **fusion/filtreerimise pipeline** (mis allikad, mis reeglid, mis ML/heuristikad),
    *   **operaatori koormuse kaitse** (suppression, confidence thresholdid),
    *   **režiimide juhtimine** (piirkonna/asutusepõhine, automaat/manuaal).

7) Katsetused, skaleerumine ja “päris elu” sensorimassiivid
-----------------------------------------------------------

*   **Punkt (Digital Shield / demo):** demonstreeriti võimet tuvastada/klassifitseerida/korreleerida (akustika + radar + RF), eesmärk tuua mitme riigi sensorid “single cloud” ja panna samale track’ile, rohkem fidelity.
    Kv Recording 396\_16k\_mono\_PRE18…
    **Nõue:** süsteem peab toetama **multi-sensor track correlation’i** ja potentsiaalselt **cross-border/coalition** andmestikku (vähemalt arhitektuurselt), sh kõrge andmemahu ingest ja standardiseeritud track-mudel.
*   **Punkt:** räägitakse suurest sensori-hulgast (nt “two thousand sensors…”) ja valideerimisest, kuidas paigaldatakse ja kas töötavad.
    Kv Recording 396\_16k\_mono\_PRE18…
    **Nõue:** nõuetes peab olema **seire tervise monitooring**, inventari/paigalduse meta, ning skaleeruvus (N sensorit, M samaaegset track’i, latentsus).

8) Töökorraldus, väljundid ja “muud olulised punktid”
-----------------------------------------------------

Need pole otseselt funktsionaalsed nõuded, aga mõjutavad nõuete vormi ja projekti õnnestumist.

*   **Eelanalüüsi ulatus / ootuste juhtimine:** eelanalüüs ei tee arendusvalmis user story’sid, detailset lahendusarhitektuuri, liideste andmemudeleid ega tootepõhiseid võrdlusi.
    N1 Recording 392\_16k\_mono\_PRE18…
    → **Praktiline järeldus:** nõuded tuleb formuleerida **võimekustena + arhitektuuripiirangutena** (NFR-id, integratsioonimustrid), mitte “täpse ekraanipildi” tasemel.
*   **Dokumentide juurdepääsupiirang (AK) märgistus:** lõpparuandele tuleb lisada AK märge ja õiguslik alus; vajadusel antakse tellija poolt sisu/abi.
    N1 Recording 392\_16k\_mono\_PRE18…
    → **Nõue protsessile:** kõik artefaktid (nõuded, arhitektuuri kirjeldus, logid) peavad toetama **klassifikatsiooni/juurdepääsupiirangu käsitlust**.
*   **Koostöökanal ja töövoog:** vajadus luua ühis-chat / meiliaadresside ring, et jagada kommenteeritud dokke ja kokku leppida järgmised sammud.
    N1 Recording 392\_16k\_mono\_PRE18…
    → **Nõue projektihügieenile:** nõuete haldus + otsuste logi + sidusrühmade register (kes, mis õigusega, mis vajadus).
*   **Kontseptsiooni “lihtne seletus” probleem:** inimesed mõistavad “infosüsteemi” seinast seina ja kontseptsioone ei loeta; vaja 1–2 lausega selgitust.
    N1 Recording 392\_16k\_mono\_PRE18…
    → **Nõue kommunikatsioonile:** lisaks tehnilisele kontseptsioonile peab olema “executive summary / elevator pitch” ja visuaalne ülevaade (mida süsteem teeb / ei tee).
*   **Ajaraamid ja sisendiaken:** mainitakse, et uued lisavajadused tuleb teatud kuupäevaks “kirjaga lisandima” (LBK kontekst).
    Kv Recording 391\_16k\_mono\_PRE18…
    → **Nõue nõuete protsessile:** muutmistaotluste/ridade prioriseerimine (backlog), versioonimine ja “cut-off” aknad.

* * *

### Üks potentsiaalne komistuskivi / alternatiivne vaade

“Üks üleriiklik süsteem kõigile” kipub muutuma **liiga jäigaks kompromissiks**: kui püüad ühe UI ja ühe töövooga katta VIP-kaitset, objekti valvet, suurüritusi ja (potentsiaalselt) militaarset COP-i, saad lõpuks lahenduse, mis sobib kõigile “natuke kehvasti”. Hea kaitse on panna nõuetesse **tugev platvorm + eraldi rollipõhised töövood/klientrakendused** (ja vajadusel mitu tarbijaliidest), mitte üks monoliitne kasutusloogika.

## Prompt:
Recording 393\_16k\_mono\_PRE180\_vadlight\_20260210\_045902.txt

Document

kasutades lisatud kontseptsioonidokumenti, too välja kõik intervjuu olulised punktid - millest tulenevad (tulevased) nõuded infosüsteemile, muud olulised punktid

## Response:
Thought for 1m 44s

Intervjuust ja kontseptsioonidokumendist kooruvad olulised punktid → tulevased infosüsteemi nõuded
--------------------------------------------------------------------------------------------------

### 1) Eesmärk, kasutusulatus, kasutajarollid

*   **Koondatud “drooniseirepilt”**: eri tüüpi sensorite (Remote ID, RF, drooniradarid jne) reaalaja- ja ajalooinfo koondatakse ühtseks pildiks + hilisem analüüs.
    Kontseptsioonidokument
    → Nõue: ühine andmemudel “track/objekt + ajalugu”, otsing/filtreerimine ajas.
*   **Rollipõhine/teadmisvajadusepõhine kuvamine** (filtreeritud olukorrapilt, varjatud alad, sensori asukohtade/katvuse varjamine või hägustamine).  
    → Nõue: peenhäälestatud ligipääsud (ABAC/RBAC), sh geograafilised piirangud ja “varjatud/invisible” objektid.
*   **Erinevatel asutustel erinev vajadus (monitooring vs kiire reageerimine)**.
    Kv Recording 396\_16k\_mono\_PRE18…
    → Nõue: kasutajaliideses eristatavad töörežiimid/vaated + rollipõhised töövood.

### 2) Häired, teavitused, töövoog

*   **Häire geopiiri rikkumisel** (objekt siseneb kaitstavasse alasse).  
    → Nõue: reaalajas geofencing + häire prioriteet/olekud (uus/aktiivne/suletud), eskaleerimisreeglid.
*   **Häirete ajalugu ja sirvimine**.  
    → Nõue: juhtumihaldus + auditeeritav sündmuste ajajoon.
*   **Teavitused töökindlusest**: serveri ühenduse katkemine (kasutaja offline), sensori rike / andmevoo ebakõla.  
    → Nõue: “health/heartbeat” sensori ja kliendi tasemel + nähtav “degraded mode”.

### 3) Alad (geomeetria) ja nende tüübid

*   **Alade tüübid**: piirangualad (NOTAM/AIP), õppusealad, kaitstavad alad (mitteavalik), varjatud alad.  
    → Nõue: eraldi “area registry” koos metaandmetega (tüüp, omanik, nähtavusklass, aktiivsusajad).
*   **Kaitstava ala seadistamine + geopiiri haldus**.  
    → Nõue: geomeetria loomine/muutmine, versioonihaldus, õigused alade lõikes.

### 4) Planeerimine ja katvuse käsitlus

*   **Planeerimisvaade sensorite katvusaladega** (sh “hägustatud” katvus, sensori asukoha/katvuse varjamine), nt isikukaitse teekondade planeerimiseks ja uute sensorite asukoha analüüsiks.  
    → Nõue: katvuskihid (raw vs blurred), marsruudi/teekonna analüütika, “kas olen kaetud alas?” indikatsioon.
    Kontseptsioonidokument

### 5) Mobiilne kasutus

*   **Kaasaskantav häirerakendus** + **dünaamiline kaasaliikuv kaitstav ala** + **hoiatus isikukaitsel teekonnal/läheduses**.  
    → Nõue: mobiilne taustal töötav teavitusteenus, asukohapõhine geofencing, madal latentsus.

### 6) Droonide staatused ja otsustusloogika

*   **Staatused** (neutraalne/loaga/sõbralik/uus/kahtlane/vaenulikkuse kahtlus/vaenulik/nähtamatu).  
    → Nõue: staatuse andmemudel + reeglid (automaatne tuletus vs käsitsi märge) + õigused, kes tohib mida muuta.
*   **“Valmisoleku taseme režiim” (tundlikkusrežiimid)** valepositiivsete vähendamiseks; automaatne ja manuaalne seadmine.
    Kontseptsioonidokument
    → Nõue: režiimide haldus (asutus-/piirkonnapõhiselt), nähtav mõju (mida filtreeritakse), audit.

### 7) Sensor fusion, korrelatsioon ja andmerikastus

*   Kontseptsioonis: **sensor fusion valehäirete vähendamiseks**.
*   Intervjuust/taustast: **korrelatsioon eri sensorite vahel (akustika + radar + RF), “sametrack” fidelity**.  
    → Nõue: korrelatsioonimootor (režiimid, tõenäosused), andmerikastuse toru (kus/millal tekib “ühine pilt”).
    N1 Recording 392\_16k\_mono\_PRE18…

### 8) Integratsiooniloogika: päring vs voog (X-tee teema)

*   Intervjuu: **X-tee sobib infosüsteemidevaheliseks päring-vastus suhtluseks, aga mitte radari/reaalaja pildi veoks; timeoutid jne**; X-teed võib kasutada “striimide alustamiseks ja tellimiseks”, mitte andme enda kandmiseks.  
    → Nõue: kaks tasandit
    1.  _control plane_ (tellimine/õigused/meta; vajadusel X-tee),
    2.  _data plane_ (pidev voog: pub/sub, WS, gRPC, Kafka vms).
*   Eelanalüüsi arhitektuuripunkt: **sündmuspõhine vs pidev voog**, andmeallikad vs tarbijad, korrelatsiooni koht ajas/ruumis.
    N1 Recording 392\_16k\_mono\_PRE18…

### 9) Turvalisus, auditeeritavus, klassifikatsioon

*   **Ligipääsud**: rolli- ja atribuudipõhine, regionaalne piiramine, tegevuste logimine/audit.  
    → Nõue: ABAC + geo-scope + täielik auditlogi (kes vaatas/muutis/märgis).
*   Intervjuu: **õiguslik pool, andmete klassifikatsioon, ligipääsud ja logimise jälgitavus**.
    N1 Recording 392\_16k\_mono\_PRE18…
*   Intervjuu: viide **AK-märgistusele / juurdepääsupiiranguga dokumentide märgistamisele** (praktiline käsitlus).
    N1 Recording 392\_16k\_mono\_PRE18…
    → Nõue: andmete/vaadete klassifikatsioonitasemed + ekspordi/raporti reeglid.

### 10) Mittefunktsionaalsed nõuded (NFR) ja arhitektuuri printsiibid

*   Intervjuu: **modulaarsus, hajusus, töökindlus; vältida komponente, mille rike halvaks kogu süsteemi; standardipõhisus; tarnijasõltumatus; tulevikukindlus**.  
    → Nõue: plugin/adaptrikiht sensoritele, selge teenuste piiritlemine, HA, skaleeruv ingest ja query.

* * *

Muud olulised punktid (mis mõjutavad nõudeid ja elluviimist)
------------------------------------------------------------

1.  **Terminoloogia/selgitusprobleem sidusrühmadega**: “infosüsteemi” ja “seire” mõistetakse väga erinevalt; inimesed tahavad 1–2 lausega aru saada, mida tehakse.  
    → Praktiline nõue: süsteem vajab väga selget “onboarding’ut” (rolli järgi) ja üheselt mõistetavaid mõisteid UI-s (mitte ainult kontseptsioonidokis).
2.  **Sidusrühmade ja ligipääsuvajaduste kaardistus**: intervjuude vastused kogutakse ja sealt “saab välja võtta” kes vajavad IS-juurdepääsu.  
    → Nõue: kasutajate/asutuste register + ligipääsutaotluse protsess (kes, milleks, mis piirkonnas).
3.  **Rahvusvaheline/mitme võrgu ja pilve kontekst** (Digital Shield): kommertspilv, mitut tüüpi sensorite integratsioon, info jagamine eri domeenidesse, vajadus siduda “unclassified commercial network” NATO NPA võrguga.  
    → Nõue: arhitektuur peab arvestama domeenide/klassifikatsiooni piiridega ja võimaliku “gateway”/replication mudeliga.
4.  **Salvestus 393 sisu on valdavalt teemaväline** (kirjandus/poliitika/NATO üldarutelu), sealt ei kooru konkreetseid drooniseire-IS nõudeid.  
    → Kvaliteedipunkt: transkriptsioonide failinimed/etiketid ja “mis intervjuu see on” vajavad kontrolli, muidu läheb nõuete kaardistus müraseks.

* * *

**Üks võimalik komistuskivi / alternatiivvaade:** X-tee “täielik vältimine” võib olla liiga jäik järeldus — intervjuu loogika järgi võib X-tee sobida hästi _control plane’iks_ (tellimused/õigused/meta), samal ajal kui reaalaja sensorivoog peab jooksma eraldi _data plane’is_.

## Prompt:
kasutades lisatud kontseptsioonidokumenti, too välja kõik intervjuu olulised punktid - millest tulenevad (tulevased) nõuded infosüsteemile, muud olulised punktid.

kirjelda pikemalt varem toodud nõuete tausta lahti

## Response:
Thought for 27s

All “nõuded” hakkavad intervjuudes välja joonistuma ühe väga lihtsa pingevälja pealt: **reaalne operatiivtöö** (reaalaja pilt, häired, patrull, VIP/objekt/suurüritus) vs **infosüsteemide maailm** (päringud, registrid, audit, õigused) vs **julgeoleku-reaalsus** (mida ja kellele tohib näidata, vendor-lock, liitlaste domeenid). Kontseptsioonidokument paneb sellele raami ette.

Kontseptsioonidokument

Allpool kirjeldan pikemalt, _miks_ varem nimetatud nõuded loogiliselt tekivad.

1) Reaalaja “data plane” vs X-tee “control plane”
-------------------------------------------------

Intervjuus öeldakse sisuliselt: **reaalaja radaripilt / sensori voog ei kuulu X-tee päringutesse**, sest X-tee vaikimisi päring-vastus loogika ja timeoutid teevad selle tehniliselt vale kanaliks. Samas X-tee võib olla kasulik “striimide alustamiseks ja tellimiseks” – ehk mitte andme kandmiseks, vaid juurdepääsu/autoriseerimise/auditi kontrolliks.

Kv Recording 391\_16k\_mono\_PRE18…

Sealt tulevad kaks arhitektuurset nõuet:

*   **Data plane:** pidev voog (pub/sub, message bus, WS/SSE UI-le) sensori- ja track-andmetele, et “olukorrapilt” oleks päriselt reaalajas.
*   **Control plane:** eraldi mehhanism (X-tee või samaväärse auditeeritavusega kiht) õiguste kontrolliks, tellimuste halduseks, logimiseks.  
    See jaotus on praktiliselt vältimatu, kui eesmärk on “reaalajas olukorrapilt” nagu kontseptsioon kirjeldab.

**Taust:** kui sa segad need kaks kokku (nt teed reaalaja pildi päringutega), saad kas latentsuse, katkestuste või “tehnilise võla” spiraali, kus kõik erandid hakkavad arhitektuuri ümber kirjutama.

2) “Üks ühine pilt”, aga erinevate töörežiimidega
-------------------------------------------------

Intervjuus käib läbi, et asutustel on **erinevad vajadused**: osa on monitooringus, osa tahab kohe reageerida; lisaks on juba mitu C2/juhtimissüsteemi paralleelselt ning see tekitab koormuse ja killustatuse.

Kontseptsioon vastab sellele rollipõhise olukorrapildi ideega (“filtreeritud ja rollipõhine”).

Kontseptsioonidokument

Sellest tulenevad nõuded:

*   **Rollid + vaated + töövood** (monitoorija vs reageerija vs planeerija vs patrull) peavad olema süsteemi “esimese klassi” mõisted, mitte lihtsalt filtrid.
*   Sama sündmus/track peab olema **mitme detailsusastmega**, sest kõik ei tohi ega peagi nägema sama infot (vt järgmine punkt).

**Taust:** “üks pilt kõigile” ilma rollimudeli ja töövoogudeta muutub kiiresti “üks liiga üldine UI”, mis ei tööta kellelegi hästi.

3) Katvus ja sensorite asukohad: planeerija vajab, aga lekkida ei tohi
----------------------------------------------------------------------

Kontseptsioon ütleb otse: planeerimisvaates on katvusalad “hägustatud?”, ning sensorite asukohti ja katvust saab varjata; isegi eraldi mainitakse katvusindikatsiooni (“kas kasutaja on sensoritega kaetud alas või mitte?”).

Miks see nõudeks muutub:

*   Operatiivtöö (VIP, objekt, suurüritus) vajab **planeerimist**: kas marsruut/ala on kaetud, kuhu panna sensor, kus on “pime nurk”.
*   Samal ajal on sensorivõrk ja katvus ise sageli tundlik info. Seepärast peab katvuse kuvamine olema **astmeline**: täpne (piiratud roll), hägustatud/agregeeritud (laiem ring), binaarne “kaetud/katmata” (patrull/field).

**Taust:** kui katvusalad joonistatakse “ilusate ringidena” ja need satuvad valesse kohta, tekib nii turvarisk kui ka “vale kindlustunne” planeerimisel. Hägustamine on sisuliselt kompromiss: planeerimine jääb võimalikuks, lekke oht väheneb.

4) Häired pole lihtsalt pop-up: vaja juhtumielutsüklit ja ajalugu
-----------------------------------------------------------------

Kontseptsioonis on konkreetselt: häire geopiiri rikkumisel, häirete ajalugu, teavitus ühenduse katkemisel, teavitus sensori rikke korral ja “operaator reageerib häirele”.

Taust lahti:

*   Kui häire on ainult “teade”, siis reaalelus tekib kohe küsimus: **kes võttis, kes kinnitas, mis otsus tehti, mis oli tulemus**.
*   Seega muutub häire **juhtumiks**: tal on olekud (uus → käsitlemisel → lahendatud), omanik, ajajoon, seotud trackid, seotud alad.
*   “Teavitused ühenduse katkemisest” ja “sensori rike” pole kosmeetika: kui sul on olukorrapilt, siis **süsteemi tervis on osa olukorrapildist** (muidu ei tea, kas “vaikus” on päriselt vaikus või “pilt kadus”).

**Taust:** operatiivne juhtimine nõuab tagantjärele taastatavat narratiivi (“mis juhtus ja miks me nii reageerisime”). Häirete ajalugu on sisuliselt kohtueelse/operatiivse tõenduspõhja algus.

5) Mobiil ja “patrull taustal”: miks see on eraldi nõuete plokk
---------------------------------------------------------------

Kontseptsioon kirjeldab mobiilirakendust kui kaasaskantavat häirerakendust, dünaamilist kaasaliikuvat kaitstavat ala ning isikukaitsel hoiatust marsruudil või läheduses; lisaks näide: patrull lülitab sisse taustateavituse “Sinu lähedal on droon”.

Taust:

*   Väliüksus ei istu “juhtimiskeskuse ekraani” taga. Vajadus on **push**, mitte pull: teavitus peab tulema ise, vähese käsitööga.
*   Taustal töötamine toob tehnilised nõuded: akukasutus, võrgu katkestused, offline-käitumine, asukohapõhised reeglid (geofencing), ning rollipõhine piirang, et “lähedal” teavitus ei lekitaks sensorite täpset geomeetriat.

6) Valehäired ja “valmisoleku taseme režiimid”: miks see on suur teema
----------------------------------------------------------------------

Kontseptsioonis on valmisoleku režiim väga selgelt lahti kirjutatud: droonituvastus tekitab palju valepositiive (linnud, RF-müra), eesmärk on vältida operaatori ülekoormust; režiimid mõjutavad lävesid ja filtreid; režiim võib olla automaatne (anomaalia tõstab tundlikkust) või manuaalne (piirkonna/asutusepõhiselt).

Kontseptsioonidokument

Taust:

*   Kui sul pole tundlikkus-/filtrirežiime, siis kaks halba varianti: kas näitad liiga palju (operaator upub) või filtreerid liiga agressiivselt (päris intsident jääb nägemata).
*   Režiimid on sisuliselt **operatiivpoliitika**, mitte UI. Seega nõue: režiim peab olema auditeeritav (miks tõsteti), piirangutega (kes tohib), ja mõõdetav (mis muutus alarmimääras).
    Kontseptsioonidokument

7) Alade tüübid ja droonide staatused: miks need pole lihtsalt “värvid kaardil”
-------------------------------------------------------------------------------

Kontseptsioon defineerib alade tüübid (piiranguala NOTAM/AIP, õppuseala, kaitstav ala, varjatud ala) ja droonide staatused (neutraalne, loaga, sõbralik, uus, kahtlane, vaenulikkuse kahtlus, vaenulik, nähtamatu).

Kontseptsioonidokument

Taust:

*   Need mõisted on see, millega süsteem “räägib” kasutajaga: mida näen, mida ignoreerin, mille peale reageerin.
*   Kui “varjatud ala” on olemas, peab süsteem oskama _tõesti_ varjata: mitte ainult UI-s, vaid ka API-s, logides, otsingus, raportites – vastavalt ABAC/RBAC reeglitele.
*   Staatused vajavad omanikku ja reegleid: kes paneb “vaenulikkuse kahtluse”, mis alusel, mis auditiga (“kelle määrata?” on dokis ise küsimärgina sees).
    Kontseptsioonidokument

8) Turvalisus ja audit: miks ABAC on vältimatu, mitte “nice to have”
--------------------------------------------------------------------

Kontseptsioon ütleb: õigused rolli ja atribuutide alusel, regionaalne piiramine, kõik tegevused logitud ja auditeeritavad.

Kontseptsioonidokument

Taust:

*   Kui süsteem on mitme asutuse ühine, siis “lihtne RBAC” jääb kiiresti lühikeseks, sest reaalsed piirangud on kontekstipõhised: asutus, piirkond, missioon, andmeklass, varjatud ala, jms.
*   Audit pole ainult “turvanõue” – see on ka **vastutuse** ja **hilisema analüüsi** eeldus (vt häirete ajalugu ja otsused).

9) Modulaarsus, töökindlus, standardid ja tarnijasõltumatus: miks see tuleb intervjuudes üles
---------------------------------------------------------------------------------------------

Intervjuus kirjeldatakse arhitektuurilist visiooni: modulaarsus, hajusus, ei tohi olla komponente, mille rike halvataks kogu süsteemi; standardipõhine integratsioon; tarnijasõltumatus ja tulevikukindlus; lisaks küsimus “sündmuspõhine või pidev voog” ja kus toimub rikastamine/korrelatsioon.

N1 Recording 392\_16k\_mono\_PRE18…

Samal ajal mure: “ei taha jätta võtmeid eraettevõtte kätte”, ning mitu paralleelset C2-te on koormavad.

Taust:

*   See pole filosoofia, vaid operatiiv- ja hankepraktika: kui tuum on tootjaspetsiifiline, siis iga uus sensor/riik/asutus tähendab uut “erandit”.
*   Nõuetes peab seetõttu olema tugev **adapterikiht + sisemine tooteneutraalne andmemudel**, ning “exit” (andmete eksport, logid, track history) peab olema selgelt kirjeldatud.

10) Harjutused ja liitlaste domeenid: miks “multi-domain cloud COP” mõjutab nõudeid
-----------------------------------------------------------------------------------

Digital Shield kirjeldab eesmärki: mitut tüüpi sensorid (akustika, radar, RF) ühte pilve, parem korrelatsioon “sametrack’i” peale; info jagamine eri domeenidesse ja isegi kommertsvõrgust NATO NPA võrku; COP jagati CRC ja radartiimidega.

Taust:

*   Kui juba harjutustes on multi-domain jagamine, siis nõuetes peab olema: andmeklassid, filtrid, replikatsioon/gateway mustrid, ning “mis läheb üle piiri / teise domeeni / teise tarbija”.
*   Samuti tekib nõue **korrelatsioonimudelile** (kuidas akustika “queue’b” RF sensori, kuidas manuaalne korrelatsioon muutub automaatseks, jne).

11) “Inimesed ei loe” → nõue: ühelauseline selgitus + onboardingu loogika
-------------------------------------------------------------------------

Intervjuus öeldakse otse, et inimesed mõistavad “infosüsteemi” seinast seina ja tahavad 1–2 lausega aru saada, mis asi see on; kontseptsioonidokki üksi ei loeta.

Taust:

*   See on mittefunktsionaalne nõue, mis mõjutab adoption’it: kui kasutajad ja sidusrühmad ei saa aru “mida see teeb”, ei tule ka kvaliteetset sisendit (õigused, kasutusjuhud, töövood).
*   Praktiline nõue: süsteemi juurde peab tekkima **selge mõistestik + rollipõhine onboarding + lihtne “elevator pitch”**, muidu läheb nõuete kogumine ja hilisem kasutuselevõtt viltu.

* * *

### Üks potentsiaalne komistuskivi / alternatiivvaade

Liiga vara “külmutatud” detailne nõuete komplekt võib osutuda illusiooniks, sest intervjuus rõhutatakse, et eelanalüüs ei anna arendusvalmis user story’sid ning osa teemasid selgub jooksvalt.  
Alternatiivne lähenemine, mis tavaliselt töötab paremini: lukustada varakult **(1) andmemudel + (2) õiguste/klassifikatsiooni raam + (3) data/control plane eristus + (4) häire/juhtumi elutsükkel**, ja jätta UI-detailid ning “ilusad vaated” teadlikult hilisemaks, kui päris töövood on testkeskkonnas läbi proovitud.



---
Powered by [ChatGPT Exporter](https://www.chatgptexporter.com)