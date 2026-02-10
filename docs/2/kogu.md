# Intervjuu nõuded infosüsteemile

**User:** Andres Moks (andres.moks@gmail.com)  
**Created:** 2/10/2026 21:47:02  
**Updated:** 2/11/2026 0:00:45  
**Exported:** 2/11/2026 0:05:40  
**Link:** [https://chatgpt.com/g/g-p-698b7a30d6848191bacb8cff5277cb17-intekad/c/698b8b2b-fd94-8395-a2f1-e18823a24566](https://chatgpt.com/g/g-p-698b7a30d6848191bacb8cff5277cb17-intekad/c/698b8b2b-fd94-8395-a2f1-e18823a24566)  

## Prompt:
Kogudus1 Recording 400\_16k\_mono\_PRE180\_vadlight\_20260210\_032359.txt

Document

kasutades lisatud kontseptsioonidokumenti, too välja kõik intervjuu olulised punktid - millest tulenevad (tulevased) nõuded infosüsteemile, muud olulised punktid

## Response:
Thought for 1m 3s

Intervjuu olulisemad punktid → tulevased nõuded infosüsteemile
--------------------------------------------------------------

### 1) Operatiivne fookus: “oma territooriumi” igapäevane lähiseire + hilisem menetlus

*   **Punkt:** Igapäevaselt on oluline näha ja kaitsta oma territooriumite lähiumbrust; menetlus (sh “ETOS/ETO” rikkumised) jääb pigem PPA-le ning reaalajas ei jälgi keegi “kogu aeg kõike”.
    Kogudus1 Recording 400\_16k\_mono…
*   **Nõuded:**
    *   **RQ-OPS-1:** Rollipõhine reaalaja olukorrapilt (COP) territooriumi / objekti / asutuse lõikes.
        Kontseptsioonidokument
    *   **RQ-OPS-2:** Sündmuse elutsükkel: tuvastus → häire → reageerimine → “juhtumiks” vormistamine → eksporditav menetluspakett (ajalugu, trajektoor, sensoritõendid).
        Kogudus1 Recording 400\_16k\_mono…
    *   **RQ-OPS-3:** “Kes vaatab pilti?” ebakindlus tähendab, et UI/teavitused peavad töötama ka minimaalsete inimressurssidega (prioritiseeritud, lühikesed, tegevusjuhisega).
        Kogudus1 Recording 400\_16k\_mono…

### 2) Häiretasemed ja valepositiivid: rahuajal filtreeri, äreval ajal näita rohkem

*   **Punkt:** Äreval ajal soovitakse näha ka “kahtlaseid” objekte (ka kui hiljem osutub kajakaks); rahuajal pole vaja iga “radar arvab, et midagi on” häiret.
    Kogudus1 Recording 400\_16k\_mono…
*   **Nõuded:**
    *   **RQ-ALERT-1:** Valmisoleku/tundlikkuse režiimid (manuaalne + automaatne tõstmine anomaalia põhjal).
        Kontseptsioonidokument
    *   **RQ-ALERT-2:** Sensor fusion + usaldusväärsuse skoor + režiimist sõltuv kuvamis-/häirelävi.
        Kontseptsioonidokument
    *   **RQ-ALERT-3:** Häirete prioritiseerimine ja ekraani “punktide hulga” vähendamine (aggregation/dedup, üks “objekt” mitte 5 sensoripunkti).
        Kogudus1 Recording 400\_16k\_mono…
    *   **RQ-ALERT-4:** Häire peab olema seostatav kaitstava ala rikkumisega (geofence) ja salvestuma ajaloosse.
        Kontseptsioonidokument

### 3) Sensorid ja valideerimine: optika kui lõplik tõend + “radarile reageeriv kaamera”

*   **Punkt:** Ilma optiliseta ei saa kunagi kindel olla (objekti hulk, parv/“pooldumine”, linnud vs droon); vajadus radarile reageeriva kaamera järele.
    Kogudus1 Recording 400\_16k\_mono…
*   **Nõuded:**
    *   **RQ-SENS-1:** Mitme sensori tugi (Remote ID, RF, drooniradarid jne) + fusion.
        Kontseptsioonidokument
    *   **RQ-SENS-2:** EO/IR kaamera integreerimine “cueing” loogikaga (radar/track → suuna/zoom/preset → salvestis).
    *   **RQ-SENS-3:** Tõendipakett: säilita toor-/metaandmed nii, et hiljem menetluses oleks objekti rada ja valideeriv sensoritõend olemas.
        Kogudus1 Recording 400\_16k\_mono…
    *   **RQ-SENS-4:** Sensori rike ja ühenduse katkemise teavitused (ops jälgib, kas “pilt/andmevoog vastab” ja kas kasutaja on online).

### 4) Konkreetne sensorplaan ja arhitektuuriline järeldus: “üks sensor võib teenida kahte”

*   **Punkt:** Mainitakse 4 Rateloni radari paigaldust Tallinna perimeetrisse; Rateloni puhul lihtne API polling (nt 1 Hz), mis võib teenida mitut tarbijat; “teenuse katkemise” korral tahetakse perimeeter “enda kätte” ja siis jagada edasi.
*   **Nõuded:**
    *   **RQ-ARCH-1:** Adapteripõhine ingest (poll + push), kus üks sensoriandmevoog saab teenindada mitut autoriseeritud tarbijat (sama toorandmestik, erinev filtreering).
    *   **RQ-ARCH-2:** Jagamise mudel: “kohapealne perimeeter” + kontrollitud andmeedastus teistele (policy/ABAC järgi).

### 5) Andmete segmenteerimine, varjamine ja “pimealad/pimedroonid”

*   **Punkt:** Tahetakse mõista, mida teised asutused ei peaks nägema; “pimeala/pimedroonide” idee (ajutine varjamine, sh õppustel, et mitte tekitada segadust). Samuti soov “nõuete omanikud” määrata.
*   **Nõuded:**
    *   **RQ-SEC-1:** Rolli- ja atribuudipõhine ligipääs, sh regionaalne piiramine + auditlogid.
    *   **RQ-SEC-2:** Alatüübid ja nähtavusreeglid: piiranguala / õppuseala / kaitstav ala / varjatud ala.
    *   **RQ-SEC-3:** Droonide “Nähtamatu” kuvamisloogika (objekt/ala võib olla filtreeritud teatud rollidele).
    *   **RQ-SEC-4:** Planeerimisvaade katvusele (sh hägustatud katvuskaart), kus sensorite asukohti/katvust saab varjata.

### 6) Droonide staatused, “lipuke” ja korduvate rikkujate muster

*   **Punkt:** Kasulik oleks “seire numbrile” lipuke/märkus panna (nt tuvastati KV poolt, kätte ei saadud; tulevikus aitab korduvuse tuvastamisel). Samas teadvustatakse GDPR/õigusliku aluse vajadus ja “kes annab loa / millised juristid”.
*   **Nõuded:**
    *   **RQ-DATA-1:** Objektikaart: seire-ID/track + märkused + “flag” + ajalugu (kelle poolt, millal, põhjendus, aegumine).
        Kogudus1 Recording 400\_16k\_mono…
    *   **RQ-DATA-2:** Õiguslik raamistik süsteemi sees: märgistuste tüüpide kaupa reeglid (kes tohib, kellele kuvatakse, säilitustähtaeg, audit).
    *   **RQ-AI-1 (hilisem etapp):** Reegli-/AI-põhine mustrituvastus (korduv “kummalistes asukohtades”, korduvad piirangute rikkumised) + soovitused, mitte automaatne “karistamine”.

### 7) “Vaenulik” vs “kahtlane”: klassifikatsioon, jagamine ja Remote ID eeldused

*   **Punkt:** Arutatakse, kas vaenulik droon üldse saadab Remote ID-d (tõenäoliselt mitte), ja kas/kunas märkida droon “vaenulikuks” nii, et kõik kasutajad näevad.
*   **Nõuded:**
    *   **RQ-CLASS-1:** Staatused (neutraalne/loaga/sõbralik/uus/kahtlane/vaenulikkuse kahtlus/vaenulik/nähtamatu) + selged õigused, kes saab staatust muuta ja mis levib üle asutuste.
    *   **RQ-CLASS-2:** Klassifikatsioon ei tohi eeldada Remote ID olemasolu; süsteem peab toetama “anonüümset” track’i ja ristseostamist sensorite abil.

### 8) Liidestused ja menetlussüsteemid (sh “Politseikilp”, “Krind”)

*   **Punkt:** Tõstatatakse vajadus liidestuda menetlussüsteemidega; algul võib olla copy-paste, hiljem automaatne. Samuti vajadus sisemise drooniseerianumbrite/“sõbralik/kahtlane” baasi hoidmiseks, mis ei pruugi väljapoole liikuda.
*   **Nõuded:**
    *   **RQ-INT-1:** Ekspordi-/API-liides juhtumi üleandmiseks (minimaalselt struktureeritud raport).
        Kogudus1 Recording 400\_16k\_mono…
    *   **RQ-INT-2:** Asutusesisene “registri” moodul (sõbralikud/kahtlased seerianumbrid, seosed juhtumitega) + andmete liikumise poliitika (jääb majja vs jagatakse).

### 9) Mobiilne kasutus (kontseptsioonist, intervjuu fooniga kooskõlas)

*   **Punkt (kontseptsioon):** Kaasaskantav häirerakendus; dünaamiline kaasaliikuv kaitstav ala; patrullil taustal töötav teavitus “Sinu lähedal on droon”.
*   **Nõuded:**
    *   **RQ-MOB-1:** Mobiilne “personal geofence” (GPS + raadius/koridor) + lähiobjekti hoiatus.
    *   **RQ-MOB-2:** Katvuse indikatsioon (“kas ma olen kaetud?”) kui otsustatakse vajalikuks.

### 10) Projektijuhtimise / nõuete halduse signaalid (mitte UI-feature, aga oluline)

*   **Punkt:** Rõhutatakse etapilisust/iteratiivsust; soovitakse nõuetele “omanikke” (kontaktisikud), et fantaasiast saaks kinnitatud vajadus.
*   **Nõuded (governance):**
    *   **RQ-GOV-1:** Nõuete register metaandmetega: omanik, prioriteet, staatus, õiguslik alus, jagamise tase, testkriteeriumid.

Muud olulised punktid (intervjuust)
-----------------------------------

*   **Koormus/ergonoomika:** “kõrge häiretaseme” ajal peab süsteem toetama füüsilist reageerimist (nt suunainfo/binokli loogika → sisuliselt “kuhu vaadata”).
    Kogudus1 Recording 400\_16k\_mono…
*   **Organisatsioonide piirid:** Osa kiiretest “kõrge mõjuga” õhuruumi intsidentidest võib olla teise osapoole (nt õhuväe) teema; süsteem peab toetama eskaleerimist ja hilisemat analüüsi, mitte eeldama ühtainsat menetlejat.
    Kogudus1 Recording 400\_16k\_mono…

* * *

### Üks võimalik pitfall / alternatiivvaade

Kui lisada liiga vara “lipukesed/kahtlased/vaenulikud” ja mustrituvastus, on risk, et süsteem muutub sisuliselt isikustatud jälgimise tööriistaks ilma selge õigusliku aluseta (ja operatiivses töös hakkavad inimesed “lipukest” üle usaldama). Praktiline vastumürk on teha 1) märgistused vaikimisi lokaalseks (asutusesiseseks), 2) levitamine eraldi otsusega ja 3) automaatika ainult soovituslikuks, koos auditiga.

## Prompt:
Kogudus1 Recording 400\_16k\_mono\_PRE180\_vadlight\_20260210\_032359.txt

Document

kasutades lisatud kontseptsioonidokumenti, too välja veel kõik intervjuu olulised punktid - millest tulenevad (tulevased) nõuded infosüsteemile, muud olulised punktid

## Response:
Thought for 25s

Allpool on **lisapunktid**, mida eelmine kokkuvõte kas ei katnud või kattis liiga põgusalt — koos sellest tulenevate (tulevaste) infosüsteemi nõuetega ja mõne “muu olulise” tähelepanekuga. Allikad: kontseptsioonidokument ja intervjuu transkript .

* * *

1) “Miinimum homseks” / valupunkti-lahendus kui arendusstrateegia
-----------------------------------------------------------------

*   **Punkt:** Intervjuus rõhutatakse, et vaja on välja mõelda _miinimum_, mis “asendaks drooniradari ära” / lahendaks valupunkti; ülejäänu võib tulla hiljem etapiliselt.
*   **Nõuded:**
    *   **RQ-MVP-1:** Süsteem peab võimaldama defineerida _MVP kasutusjuht_ (nt “oma territooriumi lähiümbrus + geopiiri rikkumise häire + juhtumi logi”), ja eristada see järgmiste etappide backlog’ist.
    *   **RQ-MVP-2:** Nõuete/feature’ite “etapilisuse” tugi (prioriteet, sõltuvused, staatus, omanik) — muidu jääb kõik “fantaasia tasemele”.

2) Töökorraldus: “kriisis ülesanded ei muutu”, aga nähtavus peab olema
----------------------------------------------------------------------

*   **Punkt:** Kriisiolukorras tööülesanded “jäävad samaks”; infosüsteemi mõte on pigem olukorrapildi olemasolu (kui keegi seda parasjagu vaatab, on lahtine).
*   **Nõuded:**
    *   **RQ-OPS-4:** COP peab olema _pidevalt genereeritav_ ja taastatav (ajalugu, sündmused, sensorite tervis), isegi kui aktiivne jälgimine pole püsiv.
    *   **RQ-OPS-5:** “Kes vaatab?” ebaselgus → süsteem peab toetama _pull_ (keegi avab) ja _push_ (häired, eskalatsioon) töörežiimi sama andmemudeli pealt.

3) “Binokli-loogika”: inimene vajab suunda/ajamärki, mitte lihtsalt punkti kaardil
----------------------------------------------------------------------------------

*   **Punkt:** Reageerimisel mainitakse praktilist vajadust: “kuhu poole vaadata”, ajamärk kõrvale; ning pikemas vaates radarile reageeriv kaamera.
*   **Nõuded:**
    *   **RQ-UX-1:** Häire vaates kuvada _bearing/azimuth + kaugus + viimase tuvastuse aeg_ (ja ideaalis “vaata sinna” suunanool kasutaja positsiooni suhtes, sh mobiilis).
    *   **RQ-UX-2:** Kaamera “cueing” liides (track → preset/lock/record) peab olema disainitud kui operatiivne tööriist, mitte ainult videoaken.

4) Integratsioonide realistlik teekond: algul copy-paste, hiljem API/automaatika
--------------------------------------------------------------------------------

*   **Punkt:** Liidestuste osas eeldatakse, et alguses tehakse käsitsi (copy-paste) ja hiljem automatiseeritakse; mainitakse Politseikilp + Krind menetlusvoogu.
    Kogudus1 Recording 400\_16k\_mono…
*   **Nõuded:**
    *   **RQ-INT-3:** “Juhtumi raport” peab olema eksporditav _inimloetava kokkuvõttena_ (copy-paste/print) ja _masinloetava paketina_ (API/JSON) sama sisuga.
    *   **RQ-INT-4:** Integratsioonide küpsusastmed: **M0** (käsitsi), **M1** (fail/templated report), **M2** (API), **M3** (kahepoolne olek/ID sünk).
        Kogudus1 Recording 400\_16k\_mono…

5) Asutusesisene andmebaas “sõbralikud/kahtlased seerianumbrid” + jagamise poliitika
------------------------------------------------------------------------------------

*   **Punkt:** Vajadus hoida enda majas droonide seerianumbreid/infot (sõbralik/kahtlane), mida ei pea välja jagama; teisal võib osa märgistusest liikuda kogu süsteemi.
*   **Nõuded:**
    *   **RQ-DATA-3:** Andmemudel peab toetama “lokaatset annotatsiooni” (asutusesisene) vs “globaalset annotatsiooni” (jagatud), koos poliitikaga, mis millal ja kellele levib.
    *   **RQ-SEC-5:** Annotatsioonidel peab olema audit + põhjendus + aegumine (eriti “kahtlane/vaenulikkuse kahtlus”).

6) Droonide staatused: detailne taksonoomia ja “kelle määrata?”
---------------------------------------------------------------

*   **Punkt (kontseptsioon):** Staatused (neutraalne/loaga/sõbralik/uus/kahtlane/vaenulikkuse kahtlus/vaenulik/nähtamatu) ja küsimus “kelle määrata?”.
    Kontseptsioonidokument
*   **Intervjuu lisamõte:** Vaenuliku märgise “kõigile nähtavaks” tegemine on õiguslikult/praktiliselt keeruline; Remote ID eeldus vaenuliku puhul võib olla vale.
*   **Nõuded:**
    *   **RQ-CLASS-3:** Staatusel peab olema: allikas (inimene/süsteem), kindlus, põhjus, ulatus (lokaalne/globaalne), otsustaja roll.
    *   **RQ-CLASS-4:** “Uus droon” kui heuristika (esmakordne/lühiajaliselt nähtud) peab töötama ka juhul, kui ID on osaline/ebastabiilne (sensor fusion).

7) Valmisoleku/tundlikkuse režiimid: automaatne tõstmine anomaalia põhjal + manuaalne
-------------------------------------------------------------------------------------

*   **Punkt (kontseptsioon):** Valepositiivseid on palju; tavaolukorras kuvada kindlamaid objekte, ärevas režiimis tõsta tundlikkust; automaatne anomaalia-põhine tõstmine ja manuaalne seadmine piirkonna/asutuse põhjal.
    Kontseptsioonidokument
*   **Intervjuu haakuv:** “äreval ajal tahaks ka kahtlaseid näha”, rahuajal mitte.
    Kogudus1 Recording 400\_16k\_mono…
*   **Nõuded:**
    *   **RQ-ALERT-5:** Režiimi parameetrid peavad mõjutama nii kuvamist (filter), häirete teket (threshold), kui ka fusion’i agressiivsust (dedup/merge).
    *   **RQ-ALERT-6:** Režiim peab olema _piirkondlik_ (nt Tallinna perimeeter vs mujal) ja auditeeritav (“kes pani kõrgemale tundlikkuse”).

8) Alade tüübid ja nende seosed (NOTAM/AIP vs mitteavalik kaitseala vs varjamine)
---------------------------------------------------------------------------------

*   **Punkt (kontseptsioon):** Piiranguala (NOTAM/AIP, avalik), õppuseala, kaitstav ala (mitteavalik, kasutajapõhine häireala), varjatud ala (tavakasutajale ei kuva).
*   **Intervjuu lisamõte:** õppuste “liigne tegevus” võib tekitada segadust — mõistlik on ala tüübiga seda summutada.
    Kogudus1 Recording 400\_16k\_mono…
*   **Nõuded:**
    *   **RQ-AREA-1:** Ala tüüp määrab vaikimisi: nähtavus, häire loogika, säilituse/jagamise reeglid.
    *   **RQ-AREA-2:** “Kaitstav ala kui puhver” piirangualade ümber (eelhoiatus geofencing’uga) peab olema lihtsasti seadistatav.
        Kontseptsioonidokument

9) Katvusvaade ja katvuse varjamine/hägustamine
-----------------------------------------------

*   **Punkt (kontseptsioon):** Planeerimise vaade sensorite katvusele (võib olla hägustatud), sensorite asukohti ja katvusi saab varjata; teadmisvajaduse põhine katvuskaart.
*   **Nõuded:**
    *   **RQ-PLAN-1:** Katvus “planeerimise” moodul (isikukaitse teekondade planeerimine, uute sensorite asukoha analüüs) eraldi rollipõhine vaade.
    *   **RQ-PLAN-2:** Katvusandmed peavad toetama tasemeid: täpne / hägustatud / peidetud, sõltuvalt rollist ja kontekstist.

10) Mobiilirakendus: dünaamiline kaasaliikuv kaitstav ala + taustteavitused
---------------------------------------------------------------------------

*   **Punkt (kontseptsioon):** Kaasaskantav häirerakendus; kasutaja loob enda ümber kaasaliikuva häireala; taustal töötav “Sinu lähedal on droon”; võimalik katvuse indikatsioon.
*   **Nõuded:**
    *   **RQ-MOB-3:** Mobiilil “dünaamiline geofence” (GPS → ala uuendub) + energiasäästlik taustteavituste pipeline.
        Kontseptsioonidokument
    *   **RQ-MOB-4:** (Soovi korral) katvuse indikatsioon “kas ma olen kaetud” peab arvestama rolli ja hägustamise reegleid.

11) “Süsteemi tervis” kui esmaklassiline funktsioon
---------------------------------------------------

*   **Punkt (kontseptsioon):** Teavitus ühenduse katkemisel (kasutaja offline), teavitus sensori rikke/andmevoo mittevastavuse korral.
*   **Nõuded:**
    *   **RQ-HEALTH-1:** Sensorite ja ingest’i health (heartbeat, viimane sõnum, quality flags) + kasutaja sessiooni online/offline.
    *   **RQ-HEALTH-2:** “Pilt/andmevoog ei vasta” tähendab, et peab olema definitsioon: eeldatav vs tegelik (nt radari track count järsk null, “stale data”, anomaalne latency).

* * *

Muud olulised punktid (mitte-funktsionaalsed/tehnilised signaalid)
------------------------------------------------------------------

*   **Arendus kui prototüübist kasvav süsteem:** intervjuus mainitakse prototüübi olemasolu (“Vasikas”) ja iteratiivset koostööd — see on signaal, et nõuded peavad olema “elavad” ja testitavad, mitte ainult Wordis.
*   **“Kõik rikuvad seni, kuni…”:** vihje, et signaalimüra on suur ja täiuslikku “täituvust” ei tule; süsteem peab toetama riskipõhist prioriteeti, mitte üritama kõike ühtemoodi menetleda.

* * *

### Üks pitfall / alternatiivvaade

Kõige suurem tehniline lõks on üritada kohe alguses teha “täiuslik klassifikatsioon + AI riskianalüüs” ja samal ajal lahendada operatiivne “binokli suund + häire + juhtumi logi”. Praktikas kipub see lõppema keerulise UX-i ja vaidlustega õigusaluse üle. Tõenäoliselt annab kõige rohkem väärtust: **MVP häiretoru + juhtumi pakett + tervise/katkestuste nähtavus**, ning alles siis keerukamad staatused ja automaatika.

## Prompt:
kasutades lisatud kontseptsioonidokumenti, too välja kõik intervjuu olulised punktid - millest tulenevad (tulevased) nõuded infosüsteemile, muud olulised punktid.

kirjelda pikemalt varem toodud nõuete tausta lahti

## Response:
Thought for 53s

Allpool on **kõik intervjuust välja joonistuvad “miks-id”** (taust) ja **millisteks infosüsteemi nõueteks need muutuvad**, seotuna kontseptsioonidokumendi detailidega. Fookus on teadlikult “mida ja miks” (mitte ainult “mis nupp kus on”).

* * *

1) Põhikasutus: igapäevane “oma territooriumi” seire + hilisem menetlus
-----------------------------------------------------------------------

**Taust intervjuust.** Igapäevane vajadus on **näha oma territooriumite lähiumbrust** ja tekitada häireid rikkumistele, aga samas eeldus on, et **keegi ei jälgi neid häireid kogu aeg** ning menetlus liigub lõpuks PPA-le (ETO/ETOS kontekstis).  
Lisaks eristub “tüüpiline oht” vs “kõige suure mõjuga oht” – viimase puhul on mängus terrori/“plahvatuse” dimensioon ja reageerimisloogika on teistsugune (ja sageli teise asutuse/komponendi teema).

**Mida see nõuab infosüsteemilt.**

*   COP (reaalaja olukorrapilt) peab olema **püsivalt genereeritav**, isegi kui aktiivne jälgimine on katkendlik (ehk “push” häired + “pull” vaade hiljem).
*   Vajad **juhtumi elutsüklit**: tuvastus → häire → reageerimine → “juhtum” → hilisem analüüs/menetluspakk. Kontseptsioonis on see juba sõnastatud (reaalaja + ajalugu + hilisem analüüs).

* * *

2) Operaatori koormus ja valepositiivid: “ära uputa mind kajakatega”
--------------------------------------------------------------------

**Taust intervjuust.** Rõhutatakse, et “me hakkame tegelema droonidega, mida ei ole päriselt olemas”: häired, linnud jne; eesmärk on **vähendada ekraanil punktide hulka** ja prioritiseerida.  
Samal ajal öeldakse väga selgelt: **äreval ajal** tahad näha ka “kahtlaseid” (isegi kui hiljem osutub linnuks), **rahu ajal** pole vaja häiret iga kord, kui radar “arvab midagi”.

**Mida see nõuab infosüsteemilt.**

*   “Tundlikkusrežiimid” ei ole kosmeetika, vaid **töökoormuse juhtimine**: filtrid/threshold’id/sensor fusion’i agressiivsus peavad muutuma režiimi järgi. Kontseptsioon kirjeldab seda otsesõnu (valepositiivid → nutikad filtrid; automaatne + manuaalne režiim).
*   UI peab toetama **dedup/aggregation** loogikat: üks “objekt/track” mitme sensori asemel; muidu muutub pilt kirjuks ja kasutamiskõlbmatuks.

* * *

3) “Binokli-loogika” ja optiline valideerimine: kaart üksi ei päästa
--------------------------------------------------------------------

**Taust intervjuust.** Häirele reageerimisel on praktiline nõue: **“sul on ka aeg kõrval, kuhu poole vaadata”** (mitte lihtsalt kaart). Ja tugev seisukoht: **ilma optiliseta ei saa kunagi kindel olla**, mitu objekti tegelikult on (parv, “pooldumine”, sensor ei tee vahet).  
Sealt kasvab soov **radarile reageeriva kaamera** järele (cueing).

**Mida see nõuab infosüsteemilt.**

*   Häire peab sisaldama **reageerimiseks piisavat konteksti** (suund/bearing kasutaja või objekti suhtes, kaugus, “viimane nägemine”, trend). See on operatiivne UX-nõue, mitte “nice-to-have”.
*   Kaamera integreerimine peab toetama **cueing workflow’d** (track → suuna/preset → salvesta) ning siduma salvestise juhtumiga (tõend).

* * *

4) Sensoriplaan ja “perimeeter enda kätte”: Ratelonid + jagamise arhitektuur
----------------------------------------------------------------------------

**Taust intervjuust.** On konkreetne plaan: **4 Rateloni radarit**, paigaldus Tallinnas “enda maja perimeetrisse”; praegu loetakse “remote’i ja signaali” ning soovitakse lisada ka kaamera.  
Kriitiline arhitektuuriline motivatsioon: **kui teenus katkeb**, tahetakse võimekus **enda perimeetril** üles ehitada ja siis “kuidagi jagada edasi”. Samas Ratelon on “nii lihtne”, et **võib korraga teenida kahte** – ehk toorandme kättesaadavus ja dubleerimine on realistlik.

**Mida see nõuab infosüsteemilt.**

*   Ingest peab toetama “lihtsat sensorit” (Ratelon) nii, et sama sensorivoog saab teenindada mitut tarbijat (erinevad filtrid/rollid), ning katkestuse korral saab perimeetri lokaalselt käima.
*   Vajad selget “andme jagamise” kihti (policy), mitte “üks keskne ekraan”: muidu ei saa korraga lahendada nii lokaalset sõltumatust kui jagamist.

* * *

5) Märgistused (“lipuke”) ja korduvate mustrite väärtus – aga õiguslikult miiniväli
-----------------------------------------------------------------------------------

**Taust intervjuust.** Väga konkreetne kasutusjuht: kui KV tuvastab drooni, ei saa kätte, aga **seire number on teada**, siis võiks sellele panna **lipukese/märkuse**, et kui kuskil hiljem jälle ilmub, osatakse rohkem tähelepanu pöörata. Kohe tekib küsimus: **GDPR/õiguslik alus** ja “milliste juristidega”.  
Lisaks AI/analüütika teema: tulevikus võiks riskianalüüs olla pigem “korduv kummalistes kohtades” jne, kuid intervjueeritav ise ütleb, et **reaalajas riskianalüüs pole teema**, oluline on “pärast menetluse jaoks”.

**Mida see nõuab infosüsteemilt.**

*   Märgistused peavad olema **auditiga, põhjendusega, aegumisega** ja eristatavad “asutusesisene” vs “kõigile nähtav” (just seda intervjuus arutatakse: segmenteerite ja “omaette võite märkida”, aga millal muutub globaalseteks).
*   “AI liidestus” (või reeglianalüütika) peab olema kavandatav kui **hilisem kiht** (batch/pärast-sündmust), mitte MVP keskne sõltuvus.

* * *

6) Droonide staatused ja “vaenulik”: definitsioon, otsustaja, levik
-------------------------------------------------------------------

**Taust (kontseptsioon + intervjuu).** Kontseptsioon pakub staatuseid (neutraalne/loaga/sõbralik/uus/kahtlane/vaenulikkuse kahtlus/vaenulik/nähtamatu) ja küsib sisuliselt: **“kelle määrata?”**  
Intervjuus tõusetub lisaks: kui “vaenulik” peaks olema kõigile nähtav, siis on vaja selget õiguslikku ja praktilist raamistikku; lisaks kahtlus, kas vaenulik üldse saadab Remote ID-d.

**Mida see nõuab infosüsteemilt.**

*   Staatus ei ole lihtsalt värv. Staatus vajab metaandmeid: **allikas, kindlus, põhjus, ulatus (lokaalne/globaalne), otsustaja roll**.
*   Süsteem peab töötama ka “ID-vaeses” maailmas (fusion/track-id), sest Remote ID ei ole garantii.

* * *

7) Alade tüübid, varjamine ja katvus: eri maailmad eri kasutajatele
-------------------------------------------------------------------

**Taust (kontseptsioon).** Alatüübid: piiranguala (NOTAM/AIP, avalik), õppuseala, kaitstav ala (mitteavalik, geofencing), varjatud ala (tavakasutajale ei kuva).  
Lisaks planeerimisvaade: sensorite katvus (võib olla hägustatud), sensorite asukohti/katvusi saab varjata “teadmisvajaduse” alusel.

**Mida see nõuab infosüsteemilt.**

*   “Ala tüüp” peab mõjutama vaikimisi: nähtavust, häireloogikat ja jagamist (muidu on varjatud ala lihtsalt käsitsi kokkulepe).
*   Katvuse kuvamine peab toetama täpset vs hägustatud vs peidetud taset.

* * *

8) Mobiil: taustal töötav lähihoiatus ja “dünaamiline kaitstav ala”
-------------------------------------------------------------------

**Taust (kontseptsioon).** Mobiilirakendus on kirjeldatud kui kaasaskantav häirerakendus: kasutaja loob enda ümber dünaamiliselt kaasaliikuva häireala; patrullil võimalus taustteavituseks “Sinu lähedal on droon”.  
Lisaküsimus: kas kuvada katvuse indikatsiooni (“kas ma olen kaetud?”).

**Mida see nõuab infosüsteemilt.**

*   Sama andmemudel peab teenindama nii veeb-COPi kui mobiili “push”-häireid; mobiil vajab eriti agressiivset mürafiltrit (vastasel juhul lülitatakse see lihtsalt välja).

* * *

9) Integratsioonid: Politseikilp + Krind, MVP-s käsitsi, hiljem automatiseeritav
--------------------------------------------------------------------------------

**Taust intervjuust.** Väga konkreetne: tulevikus peaks olema liidestus **Politseikilbiga** (piir alustab juhtumit) ja **Krindiga** (menetleb), aga alguses võivad nad **copy-paste** teha.  
Sama lõik sisaldab ka vajadust, et “teie majas sees” võib olla seerianumbrite DB, mida ei jagata välja, aga süsteem peab teadma.

**Mida see nõuab infosüsteemilt.**

*   Juhtumi “ekspordi” teekond peab olema etapiline: **M0** (inimloetav raport copy-paste’iks) → **M2** (API/masinloetav).
*   Vajad “jagamise poliitikat” ka integratsioonide puhul: mis jääb majja, mis läheb välja (eriti märgistused/registrid).

* * *

10) Süsteemi tervis: katkestused peavad olema nähtavad (muidu on COP illusioon)
-------------------------------------------------------------------------------

**Taust (kontseptsioon).** Kirjas on kaks olulist teavitust: ühenduse katkemine (kasutaja pole online) ja sensori rike / “pilt/andmevoog ei vasta”.

**Mida see nõuab infosüsteemilt.**

*   Health/heartbeat peab olema “first-class”: sensorite ja ingest’i seisund, viimase andme saabumise aeg, anomaaliad (stale/latency). Muidu ei tea keegi, kas “vaikus” tähendab “ohtu pole” või “süsteem on maas”.

* * *

11) MVP mõtteviis: “mis oleks miinimum, mida te homseks tahaksite?”
-------------------------------------------------------------------

**Taust intervjuust.** Otse küsitakse: **mis on miinimum**, mis asendaks “trooniraja” ja lahendaks valupunkti; ülejäänu “tuleb kunagi”.  
Kontseptsioon ise ütleb, et see on esmane dokument “ühise arusaama loomiseks” ja varjatud vastuolude välja toomiseks.

**Mida see nõuab infosüsteemilt.**

*   Nõuete register / backlog ei ole formaalsus: see on mehhanism, millega “miinimum homseks” eraldatakse “kunagi” ideedest ja vastuolud tuuakse varakult välja.

* * *

### Üks pitfall / alternatiivvaade

Suurim risk on, et “staatuste, lipukeste ja AI” kihid muutuvad kiiresti _sotsiaalseks tõe-masinaks_ (“kui lipuke, siis järelikult oht”), kuigi sisendandmed on mürased ja õiguslik alus võib olla piiripealne. Intervjuu ise vihjab sellele ettevaatusele (juristid, millal ja kuidas “kõik näevad vaenulikku”).

## Prompt:
kasutades lisatud kontseptsioonidokumenti, too välja kõik intervjuu olulised punktid - millest tulenevad (tulevased) nõuded infosüsteemile, muud olulised punktid.

kirjelda pikemalt varem toodud nõuete tausta lahti

## Response:
Thought for 1m 30s

Intervjuu olulised punktid (millest nõuded tekivad)
---------------------------------------------------

### 1) Mälumängu asemel „MVP, mis asendab praeguse tööriista”

Intervjuus rõhutati, et vaja on leida **miinimumfunktsionaalsus**, mis oleks „homseks” piisav, et olemasolevat lahendust (“troonirada”) sisuliselt asendama hakata, ja ülejäänu saab tulla etapiti.

Kogudus1 Recording 400\_16k\_mono…

**Nõude taust:** see seab kogu arendusele fookuse _operatiivsele väärtusele_ (häire + kontekst + lihtne edastamine) enne “ilusaid” lisasid.

* * *

### 2) Süsteem peab liidestuma menetluse/juhtumihaldusega (algul ka käsitsi)

Tuli välja ootamatu, kuid väga konkreetne liidestusvajadus: **Politseikilp** (juhtumi algatamine) ja **Krind** (menetlus). Algfaasis võib olla lubatud ka “copy-paste”, aga siht on ikkagi korrektne liidestus.

Kogudus1 Recording 400\_16k\_mono…

**Nõude taust:** kui häirest ei teki sujuvalt “juhtumit”, jääb süsteem ainult vaatlusmonitoriks ja väärtus langeb.

* * *

### 3) “Lipuke seire numbri külge” – korduvate objektide jälgitavus + juriidiline alus

Intervjuus käidi välja väga praktiline idee: kui drooni kätte ei saada, aga **seire number** on teada, siis peaks saama panna sellele “lipukese”, et järgmine kord osataks tähelepanu pöörata (näide: sama objekt varem Ämari kandis, hiljem teises kohas). Samas tõusetus kohe küsimus: **GDPR/õiguslik alus** ja kes annab loa / milliste juristidega see ära raamida.

Kogudus1 Recording 400\_16k\_mono…

**Nõude taust:** see on klassikaline “operatiivluure-light” funktsioon: väärtuslik, aga õiguslikult tundlik.

* * *

### 4) Häirete “tundlikkus” sõltub ohutasemest

Intervjuus öeldi üsna otse: rahuajal pole vaja saada häiret iga kord, kui radar “arvab midagi”; äreval/kõrge ohutaseme ajal tahetakse näha rohkem ja reageerida kiiremini.

Kogudus1 Recording 400\_16k\_mono…

Kontseptsioonis on sama teema formaliseeritud kui **valmisoleku taseme režiimid** (filtrite tugevus, kuvamise lävi, automaatne/manuelne tõstmine).

Kontseptsioonidokument

**Nõude taust:** valepositiivid tekitavad “alarm fatigue’i” – süsteem, mis karjub pidevalt, lülitatakse lõpuks välja.

* * *

### 5) Optiline kinnitus on “viimane tõde”; vaja cueing’ut

Intervjuus rõhutati, et ilma optikata ei saa kunagi päriselt kindel olla (nt kas üks objekt, mitu, parv, üksteise all lendamine). Vajalik on:

*   operaatorile “aeg + suund kuhu vaadata” (binokli/vaatluse toetamiseks),
*   tulevikus “radarile reageeriv kaamera” (cueing / automaatne suunamine).

**Nõude taust:** sensorifusioon võib vähendada müra, aga kinnituse/klassifikatsiooni lõppastmes jääb EO/IR sageli otsustavaks.

* * *

### 6) Sensorid: lähiajal 4 Rateloni suunaga radarit Tallinna perimeetris

Mainiti, et **4 Rateloni radarit** (seenekujulised, suunaga) on olemas ja paigaldus algamas, esialgu Tallinna majaperimeetrisse; regionaalne laienemine “hiljem”.

Kogudus1 Recording 400\_16k\_mono…

**Nõude taust:** see seab arhitektuurile reaalse “esimese sensori” ja katvuse geomeetria (perimeeter, sektorid, suunad).

* * *

### 7) Igapäevane kasutus: “oma territooriumi lähiumbrus”, mitte 24/7 kõike

Öeldi, et igapäevaselt tahetakse näha **oma territooriumi lähiumbrust**, aga “keegi ei jälgiks neid kogu aeg”; menetlus läheb nagunii PPA-le ja pole selge, mis alusel/menetluses täpselt.

Kogudus1 Recording 400\_16k\_mono…

**Nõude taust:** UI ja teavitused peavad töötama nii, et inimene ei pea ekraani valvama.

* * *

### 8) Varjatud/pimealad ja õppused: kaks motiivi (turve + müra vähendamine)

Tõstatus, et süsteemis võiks olla alasid/droone, mida **ajutiselt ei kuvata** (pimeala / pimedroonid) ning et õppused võiksid minna sellesse loogikasse ka lihtsalt seetõttu, et muidu tekib liiga palju tegevust ja segadust. Samuti kõlas vajadus “nõuete omanike” järele: mitte lihtsalt “võiks”, vaid konkreetne inimene, kes ütleb “mul on vaja”.  
Kontseptsioonis on see formaliseeritud kui **Varjatud ala** ja võimalus sensorite/katvuse varjamiseks/hägustamiseks “teadmisvajaduse põhiselt”.

**Nõude taust:** sama funktsioon teenib kahte eri eesmärki: (a) operatsioonide salastatus, (b) operatiivmüra vähendamine.

* * *

### 9) Drooni “staatuse” ja märgistamise reeglid vajavad juhtimist (kes määrab, kes näeb)

Räägiti, et droonide liigitamine/vaenulikkuse märkimine vajab sisendit ja juriidilist selgust: kas asutusesisesed märked vs “kogu süsteemis nähtav vaenulik droon”.

Kogudus1 Recording 400\_16k\_mono…

Kontseptsioonis on ette pakutud staatused (neutraalne, loaga, sõbralik, uus, kahtlane, vaenulikkuse kahtlus, vaenulik, nähtamatu).

Kontseptsioonidokument

**Nõude taust:** staatuse mõju ei ole ainult “värv kaardil”; see mõjutab alarmimist, ressursi suunamist ja hilisemat menetlust.

* * *

Tulevased infosüsteemi nõuded + pikem taust (miks see nõue tekib)
-----------------------------------------------------------------

### N1) Ühtne rollipõhine olukorrapilt (reaalaja + ajalugu) mitmest sensorist

Süsteem peab koondama eri sensorid ühte pilti ja näitama kasutajale filtritud, rollipõhist vaadet; lisaks ajalugu hilisemaks analüüsiks.

Kontseptsioonidokument

**Taust:** intervjuu “igapäevaselt oma territooriumi lähiumbrus” eeldab, et kasutaja näeb just talle asjakohast pilti, mitte kõike.

Kogudus1 Recording 400\_16k\_mono…

* * *

### N2) Häired kaitstavasse alasse sisenemisel + kaitstavate alade haldus (ka mobiilis dünaamiliselt)

Veebis: häire geopiiri rikkumisel, kaitstava ala seadistamine, häirete ajalugu. Mobiilis: “kaasaliikuv kaitstav ala” ja taustal toimiv teavitus (nt patrull).  
**Taust:** kui keegi ei vaata ekraani kogu aeg, peab süsteem “torkima varrukast” õigel ajal, õigetele inimestele.

Kogudus1 Recording 400\_16k\_mono…

* * *

### N3) Valmisolekutasemed / tundlikkusrežiimid (manuelne + automaatne)

Peab saama muuta, kui agressiivselt toorandmeid filtreeritakse ja millise kindlusega objekte kuvatakse/häiritakse.

Kontseptsioonidokument

**Taust:** intervjuus kirjeldatud “rahuajal mitte iga radaripiiks, äreval ajal rohkem” on täpselt sama probleem – süsteem peab skaleerima operaatori koormust ohutasemega.

Kogudus1 Recording 400\_16k\_mono…

* * *

### N4) Optilise kinnituse töövoog: cueing, suund, aeg, kaamera integratsioon

Süsteem peab andma operaatorile praktilise “kuhu vaadata” info ning toetama tulevikus radarist käivitatavat/suunatavat kaamerat.  
**Taust:** intervjuus toodi esile keerulised juhtumid (pooldumine, parved, “mitu vs üks”), kus sensorid võivad segadusse minna ja optika on ainus lõplik kvalifikatsioon.

Kogudus1 Recording 400\_16k\_mono…

* * *

### N5) Sensorite inventar + katvuse visualiseerimine (sh hägustamine/varjamine)

Peab olema vaade sensorite katvusele planeerimiseks (nt teekondade planeerimine, uute sensorite asukoha analüüs) ning võimalus katvust/sensorite asukohti varjata või hägustada rolli järgi.  
**Taust:** intervjuus tuli välja vajadus pimealade/õppuse “müra summutamise” järele; katvuse info on sama tundlik kui operatsiooni asukoht.

Kogudus1 Recording 400\_16k\_mono…

* * *

### N6) Alade tüübid: piiranguala / õppuseala / kaitstav ala / varjatud ala

Süsteem peab eristama avalikke (NOTAM/AIP) piiranguid ning mitteavalikke alasid (kaitstav, varjatud, õppused).  
**Taust:** intervjuu “õppused võiksid pimealasse minna, et mitte segadust tekitada” tähendab, et “kõik tuvastused” ei ole operatiivkasutajale alati väärtus.

Kogudus1 Recording 400\_16k\_mono…

* * *

### N7) Droonide staatused + “lipukesed” + nähtavuse/levitamise reeglid

Peab toetama drooni staatuseid ja märkmeid (sh korduvate seire-numbrite “lipukesed”), selgete reeglitega:

*   kas märge on asutusesisene või süsteemiülene,
*   kes saab määrata “vaenuliku”,
*   kuidas käsitletakse “nähtamatut”.  
    **Taust:** intervjuu tõi välja nii operatiivse kasu (muster korduvusest) kui ka kohese juriidilise küsimuse (GDPR/õiguslik alus).
    Kogudus1 Recording 400\_16k\_mono…

* * *

### N8) Andmekaitse, ligipääsud, audit

Vaja on rolli- ja atribuudipõhist ligipääsu, piirkondlikku piirangut ja täielikku auditeeritavust.  
**Taust:** intervjuus käis läbi mõte, et mõni andmebaas (nt “kahtlased/sõbralikud seerianumbrid”) võib jääda asutuse sisse ja mitte liikuda välja; see tähendab, et arhitektuur peab toetama “lokaatset teadmist” ja kontrollitud jagamist.

Kogudus1 Recording 400\_16k\_mono…

* * *

### N9) Integratsioonid: Politseikilp + Krind + (vajadusel) muud menetluskanalid

Alguses võib olla “copy-paste”, aga siht peab olema masinliidestus (juhtumi algatamine + menetluse andmed).

Kogudus1 Recording 400\_16k\_mono…

**Taust:** intervjuus kahtlustati, et kui intsidente tuleb piisavalt, muutub käsitöö talumatuks – ja see ongi koht, kus süsteem kas võidab või kaotab kasutaja.

Kogudus1 Recording 400\_16k\_mono…

* * *

### N10) Töökindluse teavitused: ühenduse katkemine ja sensori rike

Kontseptsioon nõuab teavitusi nii serveriühenduse kadumise kui sensori rikke/andmevoo “mittevastamise” korral.  
**Taust:** kui kasutajad ei “valva ekraani”, peab süsteem ütlema ka seda, kui süsteem ise on pime.

* * *

Muud olulised punktid (mitte-funktsionaalsed / protsess)
--------------------------------------------------------

*   **Etapilisus ja iteratiivsus**: “enne peame saama arusaama, see on etapiline” – ootused on, et arendatakse sammudena, mitte ühe suure “valmis” projektina.
    Kogudus1 Recording 400\_16k\_mono…
*   **Nõuete omanikud**: soov on seada igale “fantaasia-lahendusele” konkreetne vastutaja/asutus, kes kinnitab vajaduse ja aitab reeglid ära otsustada.
*   **Prototüüp “vasikas”**: mainiti olemasolevat prototüüpi GitHubis, mis toetab kiiret katsetamist ja varast valideerimist.
    Kogudus1 Recording 400\_16k\_mono…

* * *

Üks potentsiaalne pitfall / alternatiivne vaade
-----------------------------------------------

“Lipukeste”, staatuste ja “vaenuliku” märgistuse süsteem on operatiivselt magus, aga võib muutuda kiiresti **õiguslikult ja organisatsiooniliselt plahvatusohtlikuks** (kes vastutab vale märgistuse eest, kui info levib teistesse asutustesse). Praktiline maandus on disainida alguses nii, et märked on vaikimisi **asutusesisesed**, ning süsteemiülene levik on eraldi, rangelt auditeeritud otsus/voog.



---
Powered by [ChatGPT Exporter](https://www.chatgptexporter.com)