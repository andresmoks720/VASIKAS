# Intervjuu olulised punktid

**User:** Andres Moks (andres.moks@gmail.com)  
**Created:** 2/10/2026 20:55:30  
**Updated:** 2/11/2026 0:02:10  
**Exported:** 2/11/2026 0:04:51  
**Link:** [https://chatgpt.com/g/g-p-698b7a30d6848191bacb8cff5277cb17-intekad/c/698b7eff-9200-838e-b803-a284305fbef5](https://chatgpt.com/g/g-p-698b7a30d6848191bacb8cff5277cb17-intekad/c/698b7eff-9200-838e-b803-a284305fbef5)  

## Prompt:
Henry Recording 408\_16k\_mono\_PRE180\_vadlight\_20260210\_024512.txt

Document

kasutades lisatud kontseptsioonidokumenti, too välja kõik intervjuu olulised punktid - millest tulenevad (tulevased) nõuded infosüsteemile, muud olulised punkid

## Response:
Thought for 4m 6s

Allpool on intervjuust kooruvad **olulised punktid** ja neist tulenevad **(tulevased) infosüsteemi nõuded**. Olen sidunud kokku nii kontseptsioonidokumendi sisu kui ka intervjuu-transkripti rõhuasetused.

1) Eesmärk ja ulatus: “üks ühine pilt” reaalajas + ajalugu
----------------------------------------------------------

*   **Mitme sensori koondamine ühtseks olukorrapildiks** (Remote ID, RF, drooniradarid jne), sh reaalaja- ja ajalooandmed. → Nõue: ühtne andmemudel + ingest/adapterid eri sensoritüüpidelt, reaalajas kuvamine ja ajalooline päring/analüüs.
    Kontseptsioonidokument
*   **Valehäirete vähendamine sensor fusion’iga**. → Nõue: fusion/korrelatsiooni loogika + usaldusväärsuse skoorid + konfliktide lahendamine.
*   **Süsteem on “teadmisvajaduse” põhiselt asutustele**. → Nõue: rolli-/atribuutipõhine filtreerimine (mis objekt, milline kiht, milline detailsus).
    Kontseptsioonidokument

2) Häired ja töövood: süsteem “ütleb”, mitte kasutaja “otsib”
-------------------------------------------------------------

*   **Häire geopiiri rikkumisel** (kaitstav ala) + operaatori reageerimine. → Nõue: geofencing-mootor, sündmuste eskaleerimine, käsitlusvoog (ack, assigned, resolved).
    Kontseptsioonidokument
*   **Süsteem peab ise leidma ja eristama vale-positiivseid** (nt “tõenäoliselt lind”) ning teha seda sõltuvalt häire-/valmisolekutasemest. → Nõue: klassifikaatorid/heuristikad + režiimid, mis mõjutavad kuvamist ja alarmimist.
*   **Valmisoleku/tundlikkusrežiimid** (auto + manuaal). → Nõue: režiimi seadistamine (piirkond/asutus), režiimi audit, režiim mõjutab filtreid ja lävesid.
    Kontseptsioonidokument
*   **Teavituskanalid peavad töötama ka “halvemal päeval”**: backend genereerib häire ja saab edastada varukanalitel (nt SMS). → Nõue: alarmide “delivery pipeline”, mitme kanali tugi, lokaalsete konfiguratsioonide tugi.
    Henry Recording 408\_16k\_mono\_PR…
*   **Teavitus ühenduse katkemisel ja sensori rikkel**. → Nõue: heartbeat/health-check, andmevoo kvaliteedimonitooring, kasutajale nähtav “degraded mode”.
    Kontseptsioonidokument

3) Kaardirakendus: kihid, koordinaadid, aadress
-----------------------------------------------

*   **Kaardipõhine üldpilt + juhtumite ajalugu**. → Nõue: reaalaja kaart, ajaloo ajatelg/filtrid, sündmuste sirvimine.
    Kontseptsioonidokument
*   **Kaardikihid ja koordinaatsüsteemid**: Kaitseväel “veits erinev koordinaatsioon”, Maa-ametil oma; paljud tahavad _aadressi_ (Häirekeskus, Päästeamet, “meie süsteemid”). → Nõue: koordinaattransformatsioonid + reverse geocoding (koordinaat → aadress) + standardiseeritud asukohaväli API-des.
    Henry Recording 408\_16k\_mono\_PR…
*   **Katvusalade vaade planeerimiseks**, sh võimalus hägustada/varjata sensorite asukohti ja katvust. → Nõue: katvuse andmemudel (detailsusastmed), “hägustatud” renderdus, õiguste järgi peitmine.
    Kontseptsioonidokument
*   **Katvuse indikatsioon mobiilis**: kui patrull tahab “kas minu ümber lendab droone”, peab teadma ka “kas ma olen katvusalas”; samas osapooled võivad väita, et katvus pole avalik info. → Nõue: katvuse nähtavusreeglid (nt patrullile jah, avalikule ei), ning UI/loogika “katvus teadmata/puudub”.

4) Mobiilirakendus: Apollo + dünaamiline kaitstav ala
-----------------------------------------------------

*   **Kaasaskantav häirerakendus**; ideaalina politsei Apollo seadmesse; taustateavitus “Sinu lähedal on droon”. → Nõue: MDM/platvormi-integratsioon (Apollo), background-notifications, minimaalne UI kiireks tarbimiseks.
*   **Dünaamiline, kaasaliikuv kaitstav ala** (isikukaitse). → Nõue: geopiiri “follow-me” režiim, sagedane asukohauuendus, aku/andmeside optimeerimine.
    Kontseptsioonidokument

5) Ligipääs, turvalisus, salastatuse “tasemed”
----------------------------------------------

*   **Rolli- ja atribuudipõhine ligipääs + regionaalne piiramine + auditeeritavus**. → Nõue: ABAC/RBAC, geo-segmenteerimine, täielik auditlogi.
*   **Arutelu info klassifikatsiooni üle**: “disainida AK tasemele”, mitte automaatselt ERR/riigisaladuse alla; eriti katvuse ja sensorite asukohtade puhul võib olla “turvataktikaline”. → Nõue: klassifikatsioonimudel (AK/…)+ andmeelementide märgendamine + poliitikad, mis piiravad kuvamist/eksporti.

6) Alad ja reeglid: piiranguala vs kaitstav vs varjatud + geofencing “eelhäireks”
---------------------------------------------------------------------------------

*   **Alatüübid**: piiranguala (NOTAM/AIP), kaitstav ala (mitteavalik), varjatud ala (ei kuvata), õppuseala (dokumendis). → Nõue: ala-tüübi semantika + eri kuvamis-/häirereeglid + ajaline kehtivus (NOTAM).
*   **Geofencing mitte ainult “keeluala”, vaid ka “eelhäire puhver”** (nt KAPO soov laiemaks ümber, et saada varajane hoiatus). → Nõue: puhvervööndid (rings/offset polygons), mitmetasemeline häire (early warning vs breach).
    Henry Recording 408\_16k\_mono\_PR…
*   **Harrastajate/mudellennu alad**: luua kohad/“mudellennualad”, kus Remote ID reegel ei kehti ja süsteem ei tohiks häiresse minna (10% non-Remote-ID). → Nõue: erand-alad + reeglimootor, mis suppressib alarmid vastavalt ala režiimile ja kasutajagrupile.

7) Droonide staatused ja käsitsi märgendamine
---------------------------------------------

*   **Staatused (neutraalne/loaga/sõbralik/uus/kahtlane/vaenulikkuse kahtlus/vaenulik/nähtamatu)**. → Nõue: objekti staatusmudel + visuaalkoodid + õigused “kes tohib märgistada mida” + logitavus.
    Kontseptsioonidokument

8) Asutustevaheline koostöö: PPA ↔ Õhuvägi + teised
---------------------------------------------------

*   **Eskalatsioon ja “mängu juhtimine”**: õhuvägi otsustab kiiresti, kas sõjaline oht; kui mitte, politsei viib lõpuni; mõlemad näevad sama pilti ja märgendeid reaalajas. → Nõue: reaalaja koostööfunktsioonid (shared track state, annotations), rollid/hand-off, SLA/latentsusnõuded.
*   **Võimalik ühine “õhuseire ruum” vs digitaalne koostöö** (JRCC analoog). → Nõue: süsteem peab toetama mõlemat töökorraldust (co-located vs distributed), sh vestlus/kommentaarid/vahetuslogi.
*   **Häirekeskus ja Päästeamet**: kasvav koormus “kahtlane droon” kõnede tõttu; vajadus prioriseerida (oht elule/tervisele/varale/julgeolekule) ning näha pilti ja siduda see väljakutsega. → Nõue: Häirekeskuse vaade + sündmuse sidumine (case/ticket), prioriseerimisväljad, minimaalne “triage” info.
*   **Mobiilne seirevõimekus sündmuskohal** (ka teistele asutustele). → Nõue: “deployable sensors” tugi + ajutiste sensorite elutsükkel süsteemis.

9) Integratsioonid ja registrid: Remote ID üksi ei piisa
--------------------------------------------------------

*   **Remote ID on “kõige paremini kaardistatav”**, aga isikutuvastus/menetlused nõuavad sidumist registritega (LOIS mainitud). → Nõue: integratsioon Remote ID ↔ register (LOIS) + päringud/õigused + andmekvaliteet.
*   **NOTAM/AIP andmed piirangualade jaoks**. → Nõue: NOTAM/AIP ingest, ajastatud kehtivus, konflikti/katvuse reeglid.
    Kontseptsioonidokument

10) Õigusruum, andmekogu ja tõendiväärtus
-----------------------------------------

*   **Drooniseire “andmekogu” vajadus + põhimäärus** isikuandmete töötlemise ja säilituse jaoks. → Nõue: eraldi andmekogu raamistik (andmeliigid, säilitustähtajad, ligipääsu alused, väljastamine).
*   **Tõendiväärtus / metroloogia**: küsimus, kas radari/triangulatsiooni tulem on “mõõtmine”; taadeldavus ja jälgitavus võivad kohtus üles tulla (mõõteseadus, DTÜ mainitud). → Nõue: tõendipakettide genereerimine (andmeallikas, ajatempli terviklus, veapiirid, jälgitavusahel), “chain-of-custody” logid.
*   **Visioon automaatmenetluseks / automaattrahv** geopiiri rikkumisel (analoogia kiiruskaamerale), kuid eeldab väga selget tõenditaset ja veaprotsente. → Nõue: rikkumise tuvastusloogika + veapiiride käsitlus + menetlusintegratsioon (või vähemalt ekspordivõtted).
    Henry Recording 408\_16k\_mono\_PR…

11) Hange, omand ja tulevikukindlus (vendor-risk)
-------------------------------------------------

*   **Mure “kontrolli” üle** (täna kellegi kolmanda käes): soov tulevikukindluse ja turvakontrolli/auditeeritavuse järele; arutelu IP/backup-koodi üle (nt escrow/SMIT “tagavara”). → Nõue: hanketingimused koodi/artefaktide üleandeks (escrow), turva-auditid, hooldatavuse tagatised.

12) “Ära mine liiga ulmeks”: etapilisus kui sisuline nõue
---------------------------------------------------------

*   **Esmane eesmärk: “et me ei oleks pimedad”** – lahendada baasvõimekus enne eksootilisi tulevikustsenaariume. → Nõue: etapiline teekaart (MVP: ühine pilt + põhihäired; järgmised: automatiseeritud menetlus, autonoomne tõrje juhtimine jne).
*   **Potentsiaalne uus sensoritüüp (akustiline võrk piiril)**, aga vaja viis “eskaleerida” see tõsiseltvõetavaks. → Nõue: sensori valideerimise/sertifitseerimise protsess ja plugina/adapteri raamistik.
    Henry Recording 408\_16k\_mono\_PR…

* * *

### Üks võimalik pitfall / alternatiivvaade

Kui panna varakult sihiks **automaatmenetlus/automaattrahv**, võib kogu projekt takerduda tõendiväärtuse, metroloogia ja õigusliku aluse taha; praktilisem on esmalt kindlustada **ühine operatiivpilt + auditeeritavad tõendiväljavõtted**, ning alles siis minna “automaatnupp-menetse” peale.

## Prompt:
Henry Recording 408\_16k\_mono\_PRE180\_vadlight\_20260210\_024512.txt

Document

kasutades lisatud kontseptsioonidokumenti, too välja kõik intervjuu olulised punktid - millest tulenevad (tulevased) nõuded infosüsteemile, muud olulised punkid

## Response:
Thought for 2m 5s

Allpool on intervjuust (ja kontseptsioonidokumendis peegeldatud teemadest) välja korjatud **olulised punktid** koos **tulevaste infosüsteemi nõuetega** ja “muude oluliste märkustega”.

1) Ühtne reaalaja olukorrapilt + asutusteülene otsustamine
----------------------------------------------------------

**Intervjuu punkt:** eri asutused peavad nägema _sama reaalaja pilti_ ja otsustama kiiresti; eskalatsioonis peab politsei suutma tegutseda ka siis, kui õhuvägi ei identifitseeri / ei tegele.

Henry Recording 408\_16k\_mono\_PR…

**Nõuded:**

*   Ühine COP (common operating picture) mitmele asutusele, rollipõhiselt filtreeritud.
    Kontseptsioonidokument
*   Juhtumi “state machine”: tuvastus → valideerimine → eskalatsioon → tegevus → lõpetamine (sh märkimine, kes mida teeb).
    Henry Recording 408\_16k\_mono\_PR…
*   Võime siduda visuaalne identifitseerimine ja sellele järgnevad otsused (nt “võimalusel visuaal”, “märgitud oht”, jne).
    Henry Recording 408\_16k\_mono\_PR…

2) Valehäired ja operaatori koormus → “valmisoleku režiimid” + sensor fusion
----------------------------------------------------------------------------

**Intervjuu punkt:** valepositiivseid on palju; süsteem peab operaatori koormust vähendama ja lubama tundlikkust muuta.

Kontseptsioonidokument

**Nõuded:**

*   Sensor fusion + nutikad filtrid + tundlikkusrežiimid (auto/manuaalne, piirkonna/asutuse põhiselt).
    Kontseptsioonidokument
*   Droonide staatused (neutraalne/loaga/sõbralik/kahtlane/vaenulik jne) ja “nähtamatu” (filtreeritud) objekt.
    Kontseptsioonidokument

3) Katvusalade kuvamine on poliitilis-juriidiline miiniväli
-----------------------------------------------------------

**Intervjuu punkt:** patrull tahaks teada, kas ta on katvusalas; samas osad peavad katvust mitteavalikuks (AK vs RS vs ERR).

Henry Recording 408\_16k\_mono\_PR…

**Nõuded:**

*   Katvuse _indikatsioon_ kasutajale (kas olen kaetud / mis usaldus) ilma et peaks alati näitama täpset katvusgeomeetriat.
    Kontseptsioonidokument
*   Katvuskaardid peavad olema **varjatavad / hägustatavad** teadmisvajaduse alusel.
    Kontseptsioonidokument
*   Ligipääsud: ABAC/roll+atribuut + regionaalne piiramine + auditeeritavus.
    Kontseptsioonidokument

4) “Oma asi” vs Hekstek/Trooniradar → kontroll, audit, tulevikukindlus
----------------------------------------------------------------------

**Intervjuu punkt:** ei meeldi, et praegune võimekus on “Heksteki käes”; tahetakse kontrolli, auditit, turvariski vähendamist, tulevikukindlust.

Henry Recording 408\_16k\_mono\_PR…

**Nõuded:**

*   Arhitektuurilised nõuded: audititavus, turvakontroll, “escape hatch” (nt lähtekoodi escrow/IP tagatised või modulaarne asendatavus).
    Henry Recording 408\_16k\_mono\_PR…
*   Süsteem peab olema projekteeritud **piiratud ligipääsuga keskkonna** eeldusel (AK-taseme disainiloogika vs “ERR-solkimine”).
    Henry Recording 408\_16k\_mono\_PR…

5) Mobiilne seirevõimekus (sündmuskohad) + patrulli taustateavitused
--------------------------------------------------------------------

**Intervjuu punkt:** päästeamet/politsei tahavad sündmuskohal “pilti näha”; mobiilsed/ajutised sensorid on reaalsed vajadused.

Henry Recording 408\_16k\_mono\_PR…

**Nõuded:**

*   Mobiilirakendus: taustateavitus (“Sinu lähedal on droon”), dünaamiline liikuv kaitstav ala.
    Kontseptsioonidokument
*   Tugi ajutistele sensoritele ja nende kiirele liidestamisele (edge/vehicle kits).
    Henry Recording 408\_16k\_mono\_PR…

6) Kaardid, koordinaatsüsteemid, aadress – “üks koordinaat ei piisa”
--------------------------------------------------------------------

**Intervjuu punkt:** asutustel erinevad koordinaatsüsteemid; paljud tahavad _aadressi_ (Häirekeskus kindlasti).

Henry Recording 408\_16k\_mono\_PR…

**Nõuded:**

*   Mitme koordinaatsüsteemi tugi + geokodeerimine (koordinaat → aadress) ja ühtne kaardikihtide haldus.
    Henry Recording 408\_16k\_mono\_PR…

7) Häirete genereerimine back-end’is + regionaalne autonoomsus + varukanalid
----------------------------------------------------------------------------

**Intervjuu punkt:** häired on mõistlik genereerida serveripoolselt; piirkonnad võivad toimida autonoomselt; sõnumeid peab saama ka varukanalites (SMS jne).

Henry Recording 408\_16k\_mono\_PR…

**Nõuded:**

*   Back-end reeglimootor häireteks + lokaalne konfiguratsioon (nt piirkondlikud geopiirid/objektid).
    Henry Recording 408\_16k\_mono\_PR…
*   Sidekatkestuse korral jätkatav töö (degrade mode) ja mitmekanaliline teavitamine.
    Henry Recording 408\_16k\_mono\_PR…

8) Sensorite rollijaotus: radar “füüsiline tõde”, video identifitseerib, audio on kontekstis
--------------------------------------------------------------------------------------------

**Intervjuu punkt:** radar kinnitab, et objekt _päriselt lendab_; video on identifitseerimiseks; audio võib olla kasulik (eriti olemasoleva taristu peal).

Henry Recording 408\_16k\_mono\_PR…

**Nõuded:**

*   Mitme sensori andmemudel + sünkroniseeritud “evidence bundle” (radar track + video snippet + remoteID + RF).
    Henry Recording 408\_16k\_mono\_PR…
*   Võime kasutada olemasolevat taristut (kaamera+võrk+toide+edge compute) ja lisada mikrofonid/andurid modulaarse adapterina.
    Henry Recording 408\_16k\_mono\_PR…

9) “Mis on intsident?” – mitte iga droon ei tähenda reageerimist
----------------------------------------------------------------

**Intervjuu punkt:** rahuajal ei ole mõtet kõigele reageerida; intsident algab pigem kombinatsioonidest (nt remote ID puudub + mustrid + tundlik ala).

Henry Recording 408\_16k\_mono\_PR…

Henry Recording 408\_16k\_mono\_PR…

**Nõuded:**

*   Riskiskoor / reeglistik (remote ID puudub, korduvus, ebaharilik lennumuster, lähedus objektile, DIY droonid jne).
    Henry Recording 408\_16k\_mono\_PR…
*   Valmisoleku režiimid ja “tavaolukorras vähem, kriisis rohkem” kuvamise loogika.
    Kontseptsioonidokument

10) Geofencing ja “kaitstav ala” ei ole sama mis “piiranguala”
--------------------------------------------------------------

**Intervjuu punkt:** objektid tahavad tihti _laiemat eelhoiatust_ ümber oma territooriumi (geofence), sõltumata avalikust piirangualast.

Henry Recording 408\_16k\_mono\_PR…

**Nõuded:**

*   Alatüübid: piiranguala (NOTAM/AIP), kaitstav ala (mitteavalik), varjatud ala, õppuseala.
    Kontseptsioonidokument
*   Eelhoiatuse puhvrid ja mitteavalike alade haldus rollipõhiselt.
    Kontseptsioonidokument

11) Mudellennualad / FPV erandid (remote ID puudumise “sotsiaalne lahendus”)
----------------------------------------------------------------------------

**Intervjuu punkt:** ~10% jääb remote ID-ta (FPV, arhailised, mudellennundus); oleks kasu ametlikest mudellennualadest, mis vähendavad häireid.

Henry Recording 408\_16k\_mono\_PR…

**Nõuded:**

*   Erand-alade haldus (mudellennuala) + reeglid, mille korral süsteem ei lähe häiresse (või läheb teise klassiga).
    Henry Recording 408\_16k\_mono\_PR…
*   Governance: kooskõlastus hobi katusorganisatsioonidega (protsessinõue, mitte ainult UI).
    Henry Recording 408\_16k\_mono\_PR…

12) Integratsioonid: LOIS, NOTAM/AIP, DigiNOTAM, X-tee automaatpäringud
-----------------------------------------------------------------------

**Intervjuu punkt:** Remote ID + LOIS seob isikuga; NOTAM/AIP peab taga olema; DigiNOTAM tuleb; vaja ABP andmevahetuslepingut ja õiguslikku alust automaatpäringuteks üle X-tee.

Henry Recording 408\_16k\_mono\_PR…

**Nõuded:**

*   Integratsioonikiht (LOIS, NOTAM/AIP/DigiNOTAM) + logimine + päringute auditeeritavus.
    Henry Recording 408\_16k\_mono\_PR…
*   Andmekaitse ja õiguslik raamistik: isikustamine, päringuõigused, andmete väljavõtted.
    Henry Recording 408\_16k\_mono\_PR…

13) GDPR / isikuandmed: “pilt” muutub delikaatseks siis, kui lisandub identiteet
--------------------------------------------------------------------------------

**Intervjuu punkt:** niipea kui LOIS taha pannakse, muutub info isikustatuks; peab saama teha väljavõtteid isiku kohta.

Henry Recording 408\_16k\_mono\_PR…

**Nõuded:**

*   Privacy-by-design: minimaalne nähtavus, põhjendatud ligipääs, säilitustähtajad, pseudonüümimine/anonymiseerimine, auditlogid.
    Kontseptsioonidokument
    Henry Recording 408\_16k\_mono\_PR…

14) Häirekeskuse (112) koormus ja töövoog
-----------------------------------------

**Intervjuu punkt:** droonide lisandumine kasvatab Häirekeskuse koormust; neil võib olla vajadus pilti näha ja siduda teade/asukohaga ning edasi saata.

Henry Recording 408\_16k\_mono\_PR…

**Nõuded:**

*   Häirekeskuse vaade: kiire otsing/asukohasidu, “märgin ära ja saadan edasi” töövoog, aadressipõhine kasutus.
    Henry Recording 408\_16k\_mono\_PR…
    Henry Recording 408\_16k\_mono\_PR…

15) Tüüpilised vs ebatõenäolised ohud (Päästeamet, politsei, julgeolekuasutused)
--------------------------------------------------------------------------------

**Intervjuu punkt:** tüüpilised ohud on “segamine” päästesündmusel; ebatõenäolisemad on FPV rünnakud; vaja parameetreid, mille alusel risk hinnatakse.

Henry Recording 408\_16k\_mono\_PR…

Henry Recording 408\_16k\_mono\_PR…

**Nõuded:**

*   Stsenaariumipõhine riskimudel (operatiivne “mis loeb ohuks” eri asutustele) ja selle pealt häirepoliitikad.
    Henry Recording 408\_16k\_mono\_PR…

16) “Üks õhuruumiseire”, mitte rahuaja vs sõjaaja eraldi süsteem
----------------------------------------------------------------

**Intervjuu punkt:** rollijaotus erineb, aga sisuliselt on üks seire; sõja/rahu eristus arhitektuuris on ohtlik lihtsustus; üksused peavad sidekatkestusega edasi toimima.

Henry Recording 408\_16k\_mono\_PR…

Henry Recording 408\_16k\_mono\_PR…

**Nõuded:**

*   Vastupidavus: lokaalne jätkamine, katkestustaluvus, piirkondlik segmenteerimine.
    Henry Recording 408\_16k\_mono\_PR…
    Kontseptsioonidokument

17) Tarnijaökosüsteem (nt Anduril) ja kuluskaala risk
-----------------------------------------------------

**Intervjuu punkt:** Anduril on testimises; kui pilti peab näitama paljudele osapooltele, võib hinnasilt kasvada; pigem vajadus integreeruva süsteemi järele.

Henry Recording 408\_16k\_mono\_PR…

**Nõuded / strateegiline järeldus:**

*   Selge integratsioonipiir (standardne API / adapterid) ja “meie COP” kui orkestreeriv kiht, mis saab vahetada all-lahendusi.
    Henry Recording 408\_16k\_mono\_PR…
    Kontseptsioonidokument

* * *

### Üks potentsiaalne karikoht (devil’s advocate)

Kõige suurem risk pole tehnika, vaid **scope creep + õiguslik võlg**: kui samasse MVP-sse üritada panna (a) tõendiväärtus, (b) isikuandmete päringud LOIS-ist, (c) AK/RS klassifikatsioonipoliitika, (d) mitme asutuse operatiivprotsessid, siis projekt võib hanguda “kes tohib mida näha” vaidlustesse enne, kui elementaarne “me ei ole pimedad” võimekus töötab. Intervjuus käib see mõte ka läbi (“lahendame esimese probleemi ära – et me ei oleks pimedad”).

Henry Recording 408\_16k\_mono\_PR…

## Prompt:
kasutades lisatud kontseptsioonidokumenti, too välja kõik intervjuu olulised punktid - millest tulenevad (tulevased) nõuded infosüsteemile, muud olulised puntkid

## Response:
Thought for 1m 28s

Allpool on koondatud **intervjuu(+kontseptsioonidokumendi) olulised punktid** ja neist tuletatavad **tulevased infosüsteemi nõuded** (dubleeruvad mõtted on kokku tõstetud).

1) Üldine eesmärk ja ulatus (mis süsteem “on”)
----------------------------------------------

*   **Ühtne drooniseire olukorrapilt**: koondada eri sensoritüübid (Remote ID, RF, drooniradarid jne) reaalajas + ajaloos, teha **sensor-fusion** valehäirete vähendamiseks ja näidata kasutajale **filtreeritud, rollipõhist pilti**.
    Kontseptsioonidokument
    **Nõuded:** multi-sensor ingest + normaliseerimine; fusion/filtreerimiskiht; rollipõhine “COP” (common operating picture); ajaloosirvimine/analüütika.
*   **“Üks Eesti õhuruumiseire” lähenemine, mitte eraldi rahuaja/sõjaaja süsteemid**: eri asutustel on erinevad ülesanded, aga andmebaas/pilt peaks olema sama; hanked/sensorid ei tohiks dubleerida kattuvuskohtades.
    Henry Recording 408\_16k\_mono\_PR…
    **Nõuded:** asutustevaheline jagatud pilt + eristatud vaated; kattuvuste haldus (kes hangib mida kuhu); ühised andmemudelid ja integratsioonilepped.

2) Operatiivtöövood, kasutajarollid ja osapooled
------------------------------------------------

*   **Häirekeskus kui kriitiline osapool**: droonijuhtumite sagenedes tekib kõnede koormus; Häirekeskusel (ja päästekorraldajal) on vajadus “pilti näha” ning **siduda drooniinfo konkreetse sündmusega**, märkida/edastada edasi.
    Henry Recording 408\_16k\_mono\_PR…
    **Nõuded:** Häirekeskuse vaade/roll; sündmuse objekt (incident) + seosed (asukoht, droon, märgised, staatus); “märgi ja edasta” töövoog; auditlogi.
*   **Reaalajas ühine eskalatsioonipilt (PPA ↔ ÕV/KV jm)**: kui oht eskaleerub, peavad eri asutused nägema sama pilti, nägema ka teise asutuse märgistusi/tegevusi ning otsustamine toimub kiiresti.
    Henry Recording 408\_16k\_mono\_PR…
    **Nõuded:** “shared situational awareness” koos asutustevahelise märgistuse ja staatusmuudatuste sünkrooniga; ajaliselt järjekindlad sündmuslogid (timeline).

3) Häired ja teavitused (delivery vs “genereerimine”)
-----------------------------------------------------

*   **Häire geopiiri rikkumisel** (kaitstav ala / geofence): asutus saab häire, kui objekt siseneb kaitstavasse alasse; häirete ajalugu; operaator reageerib.  
    **Nõuded:** geofencing engine; reeglid/tingimused (tüüp, kindlustase, puhvrid); häirete logi ja sirvimine.
*   **Backend-poolne häirete genereerimine + varukanalid**: eesmärk hoida keskne loogika “genereeri ja toimetada”, vajadusel SMS/varukanalid; regionaalsed üksused võivad vajada autonoomiat (nt “Võrus defineeritud ala”).  
    **Nõuded:** teavituste teenus (policy → notification); kanalite pluginad (push/SMS/e-mail jm); “regionaalne segmenteerimine” mitte ainult õigustes, vaid ka teavitusloogika paiknevuses/konfis.

4) Kaardid, alusandmed, koordinaadid, aadress
---------------------------------------------

*   **Koordinaatsüsteemide ja kaardikihtide päriselu**: eri asutused kasutavad eri koordinaatsüsteeme; Maa-ametil oma; lisaks “paljud tahavad aadressi” (Häirekeskus ja Päästeamet kindlasti).  
    **Nõuded:** mitme CRS tugi (transformatsioonid); aluskaardi/kihtide haldus; reverse-geocoding (koordinaat → aadress) ja aadressi kuvamine.
*   **Planeerimise vaade katvusega**: katvusalad (võimalusel hägustatud), sh teekonna planeerimiseks/isikukaitseks ja uute sensorite asukoha analüüsiks; sensorite asukohti/katvust saab varjata.  
    **Nõuded:** katvuse arvutus/kiht; “blurred coverage” režiim; planeerimistööriistad (route + coverage confidence).

5) Mobiilne kasutus (patrull, isikukaitse, sündmuskohad)
--------------------------------------------------------

*   **Mobiilirakendus kui häirerakendus**: kasutaja saab luua enda ümber dünaamilise kaasaliikuva kaitstava ala; isikukaitsel hoiatus teekonnal/vahetus läheduses; Apollos taustal töötav “Sinu lähedal on droon” teavitus; võimalik katvuse-indikaator.  
    **Nõuded:** geofence “liikuv” objekt; taustateavitused; offline/katvuse-indikaator; lihtne “patrulli režiim”.
*   **Mobiilne seirevõimekus sündmusel**: arutelu, kas üksustel peaks olema (või hangitakse) mobiilseid seireseadmeid; vajadus näha pilti sündmuskohal.  
    **Nõuded:** ajutised/mobiilsed sensorid kui 1. klassi allikas; kiire “deploy & join” (registreeri sensor, kuva, katvus).

6) Latentsus ja “mis on ajakriitiline”
--------------------------------------

*   **Ajakriitilisus sõltub kasutusest**: mainitakse alla-sekundi kuni mõne sekundi taset; “inimene reageerib” vs “kaamera/interseptori juhtimine” on eri klass.  
    **Nõuded:** QoS/latentsusnõuded kasutusjuhtumi kaupa; reaalaja voog (stream) vs sündmuste logi; vajadusel eraldi “taktikaline” integratsioonikiht (kui kunagi juhitakse sensoreid/efektoreid).

7) Ligipääs, turve, salastatus, auditeerimine
---------------------------------------------

*   **Rolli- ja atribuudipõhine ligipääs + regionaalne piiramine + audit**.  
    **Nõuded:** ABAC/RBAC; geograafilised piirangud; auditeeritavad tegevused (kes vaatas/muutis/eksportis).
*   **AK-tasemele disainimise mõte**: eelistus disainida “AK tasemele”; kui KV ei taha AK tasemel anda, siis pigem ei kasutata sama süsteemi.  
    **Nõuded:** turbeklassi eeldus arhitektuuris (logid, kasutajahaldus, eraldus, andmekandjate/vaadete piirangud); “multi-domain” lahendus (tsiviil + KV) või selge piir (kui KV ei liitu).

8) Alatüübid, staatused, valmisoleku režiimid (filtreerimine ja müra)
---------------------------------------------------------------------

*   **Alatüübid**: piirangualad (NOTAM/AIP), õppusealad, kaitstavad alad (mitteavalikud; puhvrid), varjatud alad (operatsioonid).  
    **Nõuded:** alaandmemudel (tüüp, nähtavus, omanik, klassifikatsioon); reeglid “keda häirida millal”.
*   **Droonistaatused (neutraalne/loaga/sõbralik/uus/kahtlane/vaenulikkuse kahtlus/vaenulik/nähtamatu)**.
    Kontseptsioonidokument
    **Nõuded:** staatusmasin + käsitsi/automaatne märgistus; kuvareeglid rolliti; “nähatamatu” kui filtrireegel.
*   **Valmisoleku/tundlikkuse režiim** (valealarmid: linnud, RF-müra): automaatne anomaalia korral ja manuaalne piirkonna/asutuse põhiselt.
    Kontseptsioonidokument
    **Nõuded:** režiimi konfiguratsioon; dünaamiline lävi; operaatori koormuse kontroll (suppress/aggregate).

9) Andmeallikad ja integratsioonid (LOIS, NOTAM, diginotam, X-tee)
------------------------------------------------------------------

*   **Remote ID + LOIS + lennundusandmed**: vajadus siduda Remote ID “taha” LOIS; NOTAM/AIP alad; “diginotam” ajahorisont; lisaks GDPR kuna LOIS/Remote ID teeb info isikustatavaks; jutt automaatpäringutest üle X-tee ja vajadusest õiguslik alus määrustesse/seadustesse.
    Henry Recording 408\_16k\_mono\_PR…
    **Nõuded:** integratsioonikiht (X-tee/automaatpäringud); isikuandmete töötlusmudel (minimeerimine, logid, väljavõtted); õigusaluse/andmevahetuslepingute jälgimine (konfiguratsioon + audit).

10) “Eraisiku” droonid ja erandid (mudellennu alad)
---------------------------------------------------

*   **~90% Remote ID, ~10% ilma**: need “10%” on tihti mudellennundus/hobi; mõistlik luua mudellennualad, kus reeglid/häired ei käivitu, et vältida tarbetut reageerimist ja lubada hobitegevust.  
    **Nõuded:** “erand-alad” (model flight areas) + häirete supressioon; suhtlus/koordineerimine hobi-katusorganisatsioonidega (vähemalt protsessina); riskipõhine reageerimisloogika “Remote ID puudub ≠ automaatselt intsident”.

11) Tõendiväärtus, väljavõtted ja mõõtemääramatus
-------------------------------------------------

*   **Tõendi teema on päriselt laual**: vajadus teha “tõendeväärtusega väljavõtteid”; küsimus, kas radar/triangulatsioon loetakse “mõõtmiseks” ja kas nõuab taatlust/mõõteseaduse järgimist; võimalik kaasata Metrosert/TTJA/DTÜ (jutt mõõtemääramatusest, veaprotsentidest, jälgitavusest).  
    **Nõuded:** tõendipakettide eksport (ajavahemik, allikad, metaandmed); ahel (chain-of-custody) logidega; mõõtemääramatuse/kalibreerimise metaandmed sensoritele (kui hiljem nõutakse); “kohtukõlbulikkuse” nõuete eristamine tavavaatest.

12) Litsentsid ja sõltuvused (praktiline piirang)
-------------------------------------------------

*   **Hextech/VLA litsentsi piirang**: tööriista ligipääs on “läbi VLA litsentsi” ning laiem kasutus võib olla piiratud → mõjutab, mida saab süsteemi sisse ehitada või kellele kuvada.  
    **Nõuded:** litsentsi- ja kasutusõiguste kaardistus enne integratsiooni; vajadusel alternatiivne komponent või “adapter” nii, et vahetus oleks võimalik.

13) Eelarve-realism ja scope’i juhtimine
----------------------------------------

*   **Lubaduste vs eelarve ebakõla risk**: näide, kus “lubati palju, eelarve ei läinud kokku”.  
    **Nõuded (protsessi tasand):** nõuete prioriseerimine (MVP vs hilisemad lained); kulukomponentide läbipaistvus (sensorid vs integratsioon vs turve vs 24/7 ops).

* * *

### Üks potentsiaalne pitfall / alternatiivvaade

Tõendiväärtuse “maksimaalseks” ehitamine (taatlus, mõõtemääramatus, export-chain) võib kiiresti paisutada scope’i ja pidurdada operatiivse “töötab täna” COP-i valmimist; pragmaatiline tee on hoida **operatiivpilt ja tõendipakett** eraldi küpsusastmetena (MVP: usaldusväärne audit + export, V2: mõõtemääramatus/taatluse tugi), et mitte teha kogu süsteemi algusest peale “kohtulaboriks”.

## Prompt:
kasutades lisatud kontseptsioonidokumenti, too välja kõik intervjuu olulised punktid - millest tulenevad (tulevased) nõuded infosüsteemile, muud olulised punktid.

kirjelda pikemalt varem toodud nõuete tausta lahti

## Response:
Thought for 1m 38s

Allpool on intervjuust + kontseptsioonidokumendist koondatud _olulised punktid_, mis “suruvad” tulevasi infosüsteemi nõudeid, ning iga teema juures pikem taust (miks see tegelikus töös oluline on).

* * *

1) Kes peab “pilti” nägema ja miks
----------------------------------

**Intervjuu mõte:** Häirekeskusel tekib droonidega seoses koormus (kõned “kahtlane droon”), ning neil on päriselt vajadus näha olukorrapilti, siduda see asukohaga ning märkida/edasi suunata.

Henry Recording 408\_16k\_mono\_PR…

Lisaks Päästeamet (päästesündmuse juhtimine/ohutus) ja SMIT (keskne majutus/käit).

**Taust (miks nõue tekib):**

*   Häirekeskus on “esimene filter” – kui kodanik helistab, peab operaator suutma kiiresti kinnitada/ümber lükata ja vajadusel sündmusele sildi külge panna (vale- vs tõsihäire).
*   Päästesündmusel droon on sageli _ohutuse_ teema (nt kopter, redelioperatsioon, evakuatsioon). Piloot ei loe äppi, aga keegi staabis/juhtimispunktis peab pilti jälgima.
*   SMIT-i roll ilmub siis, kui jõuad “kuhu see asi päriselt parkida ja käitada” tasemele.
    Henry Recording 408\_16k\_mono\_PR…

**Tulevased nõuded:**

*   Mitme asutuse rollipõhine vaade (Häirekeskus vs PPA vs Päästeamet vs KV).
*   Võime siduda “kõne/sündmus” konkreetse asukoha ja objektiga (märge, staatus, edasisuunamine).
    Henry Recording 408\_16k\_mono\_PR…

* * *

2) Kaardid, aluskaardid, koordinaatsüsteemid ja “aadress”
---------------------------------------------------------

**Intervjuu mõte:** asutustel on erinevad koordinaatsüsteemid; Maa-ametil oma; _paljud tahavad aadressi_ (Häirekeskus kindlasti).

Henry Recording 408\_16k\_mono\_PR…

**Taust:**

*   Operatiivtöö ei toimu “EPSG-iga”, vaid _aadressiga_ (“Mine X tänav 5”), eriti Häirekeskuse ja Päästeameti torudes. Kui kaart näitab ainult koordinaate, kaob väärtus kriitilisel hetkel.
*   KV võib töötada teistes koordinaatruumides; kui sama sündmus rändab asutuste vahel, tekib “tõlkevigade” risk.

**Tulevased nõuded:**

*   Mitme koordinaatsüsteemi tugi (vähemalt sisend/kuva), + usaldusväärne reverse-geocode (aadress).
    Henry Recording 408\_16k\_mono\_PR…
*   Kaardikihid/aluskaardid asutuse vajaduse järgi (Maa-amet kihid jms).
    Henry Recording 408\_16k\_mono\_PR…

* * *

3) Häired: genereerimine, kohaletoimetamine ja varukanalid
----------------------------------------------------------

**Intervjuu mõte:** häired on mõistlik genereerida back-end’is; siis tegeled “defineeritud häirete kohaletoimetamisega” ja saad kasutada SMS-i jm varukanaleid. Samuti idee, et piirkondlikult (nt Võru) saab lokaalselt defineerida.

Henry Recording 408\_16k\_mono\_PR…

Kontseptsioon: geopiiri rikkumise häired, ühenduse katkemise teavitus, sensori rikke teavitus.

**Taust:**

*   Häire väärtus = _õige inimene saab õige asja õigel ajal_. Kui keskserver või võrguühendus logiseb, ei tohi kogu teavitus kaduda.
*   Kui häireloogika on ainult UI-s, saad “ilusad kaartid”, aga mitte töökindlat operatiivvõimekust.

**Tulevased nõuded:**

*   Häire mootor (reeglid: ala, objekt, kindlus, staatus) serveripoolselt.
*   Häirete kohaletoimetamise kanalid (push/SMS/e-post/jne) + kasutaja “offline”/ühenduse katkemise teavitused.
    Kontseptsioonidokument
*   Võime lokaalselt (piirkonnas) jätkata häirete teket ja vähemalt edastust, kui keskne osa häiritud (edge-mõtlemine).
    Henry Recording 408\_16k\_mono\_PR…

* * *

4) Ajakriitilisus ja “alla sekundi” klass
-----------------------------------------

**Intervjuu mõte:** reaalaja leidmine ja ajakriitilisus – sageli “alla sekundi”, eriti kui hakatakse kaameraid/interseptoreid juhtima.

Henry Recording 408\_16k\_mono\_PR…

**Taust:**

*   Inimene reageerib sekunditega; masinjuhtimine nõuab stabiilset latentsust, ajatempleid ja kvaliteedimõõdikuid (hilinemine, jitter).
*   Kui hiljem tahad “sama süsteem juhib ka sensorit/kaamerat”, on arhitektuuri lukud vaja varakult läbi mõelda.

**Tulevased nõuded:**

*   Reaalaja toru (streaming) + SLA mõõdikud (latentsus, katkestused).
    Henry Recording 408\_16k\_mono\_PR…
*   Ajatempli käsitlus (server vs sensor vs klient) ja sünk (hiljem ka tõendiväärtuse jaoks).

* * *

5) Sensor fusion, valehäired ja “valmisoleku režiimid”
------------------------------------------------------

**Kontseptsioon:** sensor fusion valehäirete vähendamiseks; valmisoleku/tundlikkuse režiimid (auto + manuaalne), et vältida operaatori ülekoormust.  
**Intervjuu lisab:** süsteem peaks suutma valepositiive eristada ja isegi pakkuda “see on tõenäoliselt lind”.

Henry Recording 408\_16k\_mono\_PR…

**Taust:**

*   Kui süsteem karjub iga RF-anomaalia peale, tapab see usalduse kiiremini kui ükski tehniline viga.
*   Režiimid on operatiivjuhtimise tööriist: tavarežiim (vaikne, kindel) vs kõrgendatud (tundlikum, rohkem toorandmeid).

**Tulevased nõuded:**

*   Objekti “kindluse” skoor ja filtreerimine per asutus/ala/režiim.
*   Režiimi seadmine (manuaal/auto) + audit, kes ja miks muutis.

* * *

6) Droonide staatused ja klassifikatsioon
-----------------------------------------

**Kontseptsioon:** droonidele staatused (neutraalne/loaga/sõbralik/uus/kahtlane/vaenulikkuse kahtlus/vaenulik/nähtamatu).

Kontseptsioonidokument

**Taust:**

*   Operatiivotsus vajab “lihtsat värvi” (mida ma teen), mitte ainult telemeetria rida.
*   Suurim oht on “kelle määrata?” – kui staatused mõjutavad häireid või kuvamist, muutub see võimu- ja vastutuse küsimuseks.

**Tulevased nõuded:**

*   Staatusmudel + õigused, kes saab millist staatust panna; muutuste ajalugu.

* * *

7) Alad: piirangualad, kaitstavad alad, varjatud alad, katvuse varjamine
------------------------------------------------------------------------

**Kontseptsioon:** alade tüübid (NOTAM/AIP piirangualad; kaitstavad alad geofencinguks; varjatud alad); sensorite asukohad/katvused saab varjata või hägustada teadmisvajaduse järgi.

**Taust:**

*   Samal kaardil on avalik (NOTAM/AIP) ja mitteavalik (kaitse/operatsioon). Kui neid ei erista, lekib “kaitstav ala” ise juba infot.
*   Katvuse varjamine pole “ilus lisafunktsioon”, vaid reaalne julgeoleku nõue (mida vastane ei tohi järeldada).

**Tulevased nõuded:**

*   Alade elutsükkel (loomine, kehtivusaeg, omanik-asutus, nähtavus, puhver/geofence).
*   Katvuse kuvamine rollipõhiselt (täpne vs hägustatud vs peidetud).

* * *

8) Remote ID puudumine ja “mudellennualad”
------------------------------------------

**Intervjuu mõte:** ~90% on Remote ID-ga; ~10% ilma (tihti mudellennundus). Mõistlik oleks võimaldada eraisikutel/kommuunil “mudellennualad”, kus reeglid/häired ei rakendu, et hobitegevus ei tekitaks süsteemi ülekoormust.

Henry Recording 408\_16k\_mono\_PR…

**Taust:**

*   Kui iga Remote ID-ta lend = intsident, muutub süsteem praktiliselt kasutuskõlbmatuks (valeintsidente liiga palju).
*   See on sotsio-tehniline probleem: osa lahendusest on kokkulepped/ala-märgistus, mitte ainult “rohkem sensoreid”.

**Tulevased nõuded:**

*   “Lubatud / erirežiimiga” alad või load, mis vähendavad häireid kindlas ruumis/ajal.
*   Võime siduda ala “reeglite paketiga” (millal häiret tekitab, millal mitte).
    Henry Recording 408\_16k\_mono\_PR…

* * *

9) Mobiilirakendus ja Apollo-sse integreerimine
-----------------------------------------------

**Kontseptsioon:** mobiilne häirerakendus, dünaamiline “kaasaliikuv” kaitstav ala, Apollo taustateavitus patrullile (“Sinu lähedal on droon”).

Kontseptsioonidokument

**Intervjuu lisab:** ideaal ongi Apollo seade, mitte eraldi äpp.

Henry Recording 408\_16k\_mono\_PR…

**Taust:**

*   Patrull ei taha 5. äppi. Ta tahab _ühte_ kanalit, mis juba töötab ja mida usaldatakse.
*   Taustateavitus tähendab: energiatõhusus, privaatsus (asukoht), katkestuste taluvus.

**Tulevased nõuded:**

*   Integratsioon Apollo-sse (või vähemalt samale seadmele/kanalile) + taustateavitused.
*   “Kas ma olen kaetud alas?” indikatsioon (katvuse UX).
    Kontseptsioonidokument

* * *

10) Tõendiväärtus, mõõteseadus, taadeldavus ja “vaidlustamiskindlus”
--------------------------------------------------------------------

**Intervjuu mõte:** tõendiväärtus on teema; tuleb läbi mõelda mõõteseaduse ja “mõõtetulemuse jälgitavuse” raam. Arutelu: kas radari tuvastus on “mõõtmine”, mis nõuab taadeldavust.

Henry Recording 408\_16k\_mono\_PR…

Lisaks Metrosert (mõõtemääramatus/füüsikaline analüüs) ja eesmärk: saada salvestis/väljavõte, mida on raske vaidlustada (“vähem protokolli, vähem vaidlustamist”).

Henry Recording 408\_16k\_mono\_PR…

**Taust:**

*   Menetluses lüüakse esimesena: “teie sensor pole taadeldud / triangulatsioon vale / ajatempli päritolu küsitav”.
*   Kui sa tahad, et menetleja saaks teha “in-office menetlust” standardiseeritud väljavõtte põhjal, peab andmete autentsus ja ahel (chain-of-custody) olema sisseehitatud.
    Henry Recording 408\_16k\_mono\_PR…

**Tulevased nõuded:**

*   Tõendi-eksport (ajastatud väljavõte + metaandmed + allkirjastus/hash + auditeeritav logi).
*   Mõõtemääramatuse/kalibreerimise info haldus (vähemalt “mida saab tõendina väita”, isegi kui kõik ei ole mõõteseaduse all).

* * *

11) Üks ühine õhuruumiseire (mitte “rahuaja” vs “sõjaaja”) + võrguarhitektuur
-----------------------------------------------------------------------------

**Intervjuu mõte:** pole mõtet eristada “rahuaja seiresüsteem” ja “sõjaaja seiresüsteem” – räägime ühest Eesti õhuruumiseirest; erinevad osapooled lisavad oma kihid.  
Samas: KV poolelt on vaja sisendit, millisele võrguarhitektuurile peab vastama (haavatavus).

**Taust:**

*   Kui arhitektuur ehitatakse ainult tsiviilvõrkude loogikaga, võib kriisis katkeda just see osa, mida kõige rohkem vaja.
*   “Ühine pilt” eeldab tugevat segmentimist (kes mida näeb) ja samal ajal suutlikkust infot jagada.

**Tulevased nõuded:**

*   Võrgusegmenteerimine + regionaalne piiramine + audit (ABAC/rollid/atribuut).
*   Taluvus katkestustele (osaline autonoomia) ja selge “operatsioonirežiimide” mudel.

* * *

12) Vendor lock-in, litsentsid ja “kontrolli” nõue (Hextech/Anduril)
--------------------------------------------------------------------

**Intervjuu mõtted:**

*   Hextech / “trooniradar” on kellegi teise käes; KAPO näeb selles kontrolli- ja tulevikukindluse riski; mainitakse auditeeritavust, turvaaukude kartust ning mõtet koodi/IP “backup’i” (lepinguline).
    Henry Recording 408\_16k\_mono\_PR…
*   Hextech ligipääs on läbi VLA litsentsi, mistõttu laiem kasutus võib olla piiratud (litsentsi ulatus ebaselge).
    Henry Recording 408\_16k\_mono\_PR…
*   Anduril: KV katsetab; aga kui pilti näidata paljudele osapooltele, hinnasilt võib “ulmeliseks” kasvada.
    Henry Recording 408\_16k\_mono\_PR…

**Taust:**

*   See on klassikaline “riigi kriitilise võime” probleem: mitte ainult funktsioonid, vaid _valitsemine_ (kes kontrollib, kes auditeerib, mis saab kui tarnija muutub).
*   Samas intervjuus kõlab ka skeptiline noot: “riik ei pea kõike ise omama, saab lepingusse kirjutada”.
    Henry Recording 408\_16k\_mono\_PR…

**Tulevased nõuded (hanget mõjutavad):**

*   Avatud liidestused / eksport + lepingulised kaitsed (koodi escrow, auditõigused, turvatestimine, andmete omandiõigus).
*   Kulumudel: kasutajate/asutuste lisandumine ei tohi plahvatada OPEX’iks.
    Henry Recording 408\_16k\_mono\_PR…

* * *

13) Seirevahendite “inventar”, dubleerimise vältimine ja ühine pilt
-------------------------------------------------------------------

**Intervjuu mõte:** ühishanked → igaüks hangib midagi; kus mullid ühtivad, seal vältida dubleerimist; lõpuks kuhjatakse seireseadmete pilt ühte infosüsteemi.  
Kontseptsioon rõhutab samuti erinevate sensorite koondamist ühtseks pildiks ja ajalooanalüüsiks.

Kontseptsioonidokument

**Taust:**

*   Kui igal asutusel on oma “väike pilt”, tekivad piiriolukorras koordineerimisaugud (“kes saadab silmad”, kes näeb mida).
    Henry Recording 408\_16k\_mono\_PR…
*   Keskne inventar/katvus on ka planeerimisvahend (kuhu panna uusi sensoreid, kus ollakse “pimedad”).

**Tulevased nõuded:**

*   Sensoriregister + katvuse/tervise seire (rikked, andmevoo kvaliteet).
*   Planeerimisvaade (katvuskaardid, sh hägustatud).

* * *

14) Mobiilne seirevõimekus (sündmuskoht)
----------------------------------------

**Intervjuu mõte:** arutatakse, et hangitakse ka “mobiilset seirevõimekust” ja tahetakse näha pilti sündmuskohal.

Henry Recording 408\_16k\_mono\_PR…

**Taust:**

*   Statsionaarne võrk ei kata kõiki üritusi/intsidente; drooniprobleem on “sündmuslik”.
*   Mobiilsed sensorid tekitavad uue klassi nõudeid: kiire liidestus, ajutine katvus, lokaalne töö.

**Tulevased nõuded:**

*   “Ajutise sensori” onboarding (registreerimine, võtmed, andmevoo kvaliteet, nähtavusreeglid).

* * *

15) Projektijuhtimise / analüüsi olulised kõrvalpunktid
-------------------------------------------------------

**Intervjuu mõtted:** Nortali eelanalüüs, Elering/Eesti Energia jms sidusrühmad, ning kriitika “lubaduste vs eelarve” lahknevusele (vajadus realistlikult raamida).

Henry Recording 408\_16k\_mono\_PR…

**Taust:**

*   Nõuded korduvad asutuste vahel; “vähe osapooli korraga” on strateegia, aga lõpuks tuleb skaleerida erinevateks kasutusjuhtudeks.
    Henry Recording 408\_16k\_mono\_PR…
*   Kui scope läheb liiga ulmeliseks enne “pimeduse” probleemi lahendamist, kukub projekt oma raskuse all kokku.
    Henry Recording 408\_16k\_mono\_PR…

**Tulevased nõuded (meta-nõuded):**

*   Faasistus: esmalt “pilt + häired + ligipääsud”, siis automatiseeritud juhtimine/tõendiplokk sügavamalt.

* * *

### Üks pitfall / alternatiivne vaade

Kui “tõendiväärtus” võtta kohe algusest _täies mahus_ (mõõtemääramatus, taadeldavus, protokollid), võib see teha MVP ebareaalselt raskeks ja aeglaseks; samas kui see üldse välja jätta, jääb menetluspoole väärtus kesiseks. Praktiline kompromiss on ehitada alguses _autentsus- ja audit-ahel_ (hashid, ajatempli distsipliin, ekspordivormid) ning kalibreerimise/mõõteseaduse “täis-kompliance” viia järgmisse faasi, kui on selge, millised sensorid ja milline menetlusmudel päriselt kinnitust saavad.



---
Powered by [ChatGPT Exporter](https://www.chatgptexporter.com)