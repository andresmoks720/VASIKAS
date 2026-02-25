# Drooniseire infosüsteemi nõuded

**User:** Andres Moks (andres.moks@gmail.com)  
**Created:** 2/25/2026 23:26:24  
**Updated:** 2/25/2026 23:51:31  
**Exported:** 2/25/2026 23:51:50  
**Link:** [https://chatgpt.com/g/g-p-698b7a30d6848191bacb8cff5277cb17-intekad/c/699f68ff-aa24-8397-a156-d7eb6d49be31](https://chatgpt.com/g/g-p-698b7a30d6848191bacb8cff5277cb17-intekad/c/699f68ff-aa24-8397-a156-d7eb6d49be31)  

## Response:
Thought for 2m 18s

Allpool on **selle intervjuu** punktid, mis “lähevad nõueteks” drooniseire infosüsteemile, seotuna kontseptsioonidokumendis kirjeldatud sihtlahendusega (ühtne olukorrapilt, rollipõhisus, alarmid, ajalugu, sensorite koondamine).

Kontseptsioonidokument

* * *

### 1) “Ühes kuradi Ataki liideses” peab nägema nii droone kui ka oma ressursse (deconfliction / blue-on-blue vältimine)

**Intervjuu signaal:** tahetakse ühes Ataki liideses näha, kus on patrullid, et ei tekiks “plu-on-plu” olukorda.

N1 Recording 427

**Tuletuvad nõuded:**

*   Süsteem peab suutma **avaldata drooni-olukorrapilti välisesse C2/KAARDI-klienti** (Atak/ATAK vms) “kihina”, mitte ainult oma veebirakenduses.
*   **Rolli- ja asutusepõhine filtreerimine** peab toimima ka integratsiooniväljundis (mitte kõik ei näe kõike).
    Kontseptsioonidokument
*   Vajalik **objektide konfliktihaldus/deconfliction**: oma droonid/oma patrullid vs “võõrad” ning nähtavuse/klassifikatsiooni reeglid. (Seostub kontseptsioonis rollipõhise olukorrapildi ja staatusetega.)
    Kontseptsioonidokument

### 2) Ressursijuhtimine: “kus on lähim kiirabi” jms

**Intervjuu signaal:** vajadus näha lähimat kiirabi/ressurssi.

N1 Recording 427

**Tuletuvad nõuded:**

*   Süsteem peab toetama **teiste asutuste ressursside** (nt kiirabi/patrullid) kas:
    *   a) kuvamist oma COP-is (ühine olukorrapilt), või
    *   b) vähemalt drooniandmete push’i sinna keskkonda, kus ressursid juba nähtavad (Atak vms).
        N1 Recording 427
*   Vajadus **ligipääsu- ja jagamisreegliteks** (milline asutus näeb milliseid ressursse).
    Kontseptsioonidokument

### 3) “API või asi”, et “nende ekraani peal tekitada … droonid”

**Intervjuu signaal:** otsesõnu oodatakse API-t, millega saaks droone kuvada teise süsteemi ekraanil.

N1 Recording 427

**Tuletuvad nõuded:**

*   Süsteem peab pakkuma **masinliidest** (API / sündmusvoog), mis edastab:
    *   tuvastused (asukoht, aeg, usaldusväärsus),
    *   trajektoorid/track-id’d,
    *   alarmid ja olekumuutused.
*   Vajalikud **reaalaja kanalid** (nt WebSocket/SSE/MQ) + ajaloopäringud (forensika). (Seostub kontseptsioonis reaalaja + ajalooinfo koondamisega.)
    Kontseptsioonidokument

### 4) “Me ei hakka nende radaripilti sisse võtma”

**Intervjuu signaal:** integratsioon ei tohi eeldada “radaripildi” ingest’i; pigem standardne andmevahetus.

N1 Recording 427

**Tuletuvad nõuded:**

*   Andmevahetus peab toimuma **normaliseeritud track/event tasemel**, mitte UI/visual “screen scrape” ega “radaripildi” ülekandena.
*   Vajalik on **selge ühtne sündmuse/track’i skeem** (millele sensorid mapitakse) ja adapterid erinevatele sensoritele.
    Kontseptsioonidokument

### 5) “Sidustussüsteem … keskmine liim”, mis hakkab “kõike seda kokku” panema

**Intervjuu signaal:** olemas/planeeritakse keskne integratsioonikiht (“liim”).

N1 Recording 427

**Tuletuvad nõuded:**

*   Süsteem peab arvestama, et ta on **üks komponent suuremas integratsiooniökosüsteemis**:
    *   suutma nii tarbida kui ka publitseerida sündmusi läbi “liimi”,
    *   toetama standardseid integratsioonimustreid (subscribe/publish, backpressure, retry, audit).
*   Vajalik on **selge integratsioonikataloog** (mis süsteemidega, mis andmetega, mis sagedusega, mis SLA). (Kooskõlas kontseptsiooni “koondab eri tüüpi sensorid” sihiga.)
    Kontseptsioonidokument

### 6) Väljasõidukorraldused ja patrullsõiduki “elektrooniline süsteem”

**Intervjuu signaal:** väljasõidukorraldus liigub elektrooniliselt patrullsõiduki süsteemi.

N1 Recording 427

**Tuletuvad nõuded:**

*   Alarm/intsidendi info peab olema **edastatav välitöö süsteemidesse** (CAD/dispatch / patrulli terminal).
*   Vajalikud “välitöö” kasutusjuhtumid: **push-teavitus**, ülesande linkimine juhtumiga, “ack/assigned/on-scene” olekud (vähemalt integratsioonina).

### 7) Tuvastuse asukoha täpsus peab olema reageerimiseks piisav

**Intervjuu signaal:** “teil ei ole piisavalt täpset asukohta, kuhu midagi saatagi”.

N1 Recording 427

**Tuletuvad nõuded:**

*   Iga tuvastuse/track’i juures peab olema **asukoha kvaliteet**: täpsus/vea hinnang (nt radius/ellips), allikad, ajatempli kvaliteet.
*   UI-s ja API-s peab olema eristatav “täpne sihtimine” vs “umbkaudne indikatsioon”.

### 8) Kasutajaliidese töövood: ekraanide/töövaadete kiire vahetus, mitme kuva tugi

**Intervjuu signaal:** vajadus vahetada erinevaid ekraane/töövaateid.

N1 Recording 427

**Tuletuvad nõuded:**

*   Veebirakenduses peab olema **konfigureeritav töölaud** (dashboard), vaadete preset’id, kiire filter/kihtide lülitus.
*   Toetus **mitme kuvari/operatsioonikeskuse** tööstiilile (nt “map + list + incident detail”).

### 9) “Brauser on koht, kus pilti välja näidatakse” (õhuke klient, andmevoog serverist)

**Intervjuu signaal:** brauser kui kuvamiskoht.

N1 Recording 427

**Tuletuvad nõuded:**

*   Arhitektuuriliselt: serveripoolne koondamine/filtreerimine, klient on pigem **visualiseerija** (kooskõlas kontseptsiooni “filtreeritud ja rollipõhine olukorrapilt” ideega).
    Kontseptsioonidokument

### 10) Sensori vaade/katvus: “näitab väikest sektorit … käib ringiratast”

**Intervjuu signaal:** sensori kuvab väikest sektorit ja liigub/keerab.

N1 Recording 427

**Tuletuvad nõuded:**

*   Vajalik **sensori FOV/katvuse** (sektor, suund, ulatus) korrektne visualiseerimine + ajas muutuv olek.
*   Planeerimisvaates peab saama hinnata katvust (see on ka kontseptsioonis eraldi välja toodud).
    Kontseptsioonidokument

### 11) Heterogeenne kaamerapark: “suunatav kaamera … ei ole ühe sama tootja”

**Intervjuu signaal:** suunatavad kaamerad ja eri tootjad.

N1 Recording 427

**Tuletuvad nõuded:**

*   Video/EO-IR integratsioon peab olema **tootjaneutraalne** (adapterid, standardprotokollid), mitte ühe vendor’i “kinnine” lahendus.
*   Vajalik on **sensorite tervise** ja katkestuste teavitus (kontseptsioonis olemas).
    Kontseptsioonidokument

### 12) Operatiivne planeerimine: ressursid (nt jalgpatrull) ja perioodiline katmine

**Intervjuu signaal:** plaanitakse periooditi panna ressursse (jalgpatrull jne).

N1 Recording 427

**Tuletuvad nõuded:**

*   Süsteem peab toetama **planeerimist**: kus on risk, kus on katvus, kuhu paigutada ressursse (kontseptsioonis “Planeerimine – katvusalade vaade” olemas).
    Kontseptsioonidokument

### 13) Keskne seirekeskus / tsentraliseerimine

**Intervjuu signaal:** koliti seirekeskusesse; varem oli hajusam.

N1 Recording 427

**Tuletuvad nõuded:**

*   Rolli- ja piirkonnapõhine ligipääs, auditeeritavus, mitme asutuse töö ühes keskuses (kontseptsioonis ligipääsud/audit).
    Kontseptsioonidokument

### 14) Õiguslik raam: “inimestel on õigus drooni seaduslikult lennutada”

**Intervjuu signaal:** vaja eristada seaduslik/õiguslik tegevus.

N1 Recording 427

**Tuletuvad nõuded:**

*   Süsteem peab toetama **konteksti**: piirangualad/eriloaga lennud vs rikkumised (kontseptsioonis alade tüübid + staatused).
    Kontseptsioonidokument

### 15) “Menetluse” ja tõendamise vajadus

**Intervjuu signaal:** jutt menetlusest ning vajadusest, et seda “peaks saama …” (töövoog).

N1 Recording 427

**Tuletuvad nõuded:**

*   Vajalik **intsidendi elutsükli** tugi: juhtumi loomine, seotud tõendid (trackid, logid, videolõigud), otsused/tegevused, lõpptulemus.
*   Auditeeritavus (kontseptsioonis).
    Kontseptsioonidokument

### 16) Rahvusvaheline koondamine (Frontexi näide)

**Intervjuu signaal:** mainitakse Frontexi poolt peetavat välispiiri valvesüsteemi, kuhu koondub liikmesriikide info.

N1 Recording 427

**Tuletuvad nõuded:**

*   Pikas plaanis peab arvestama **andmejagamise** ja standardiseerimisega (mida saab, mida ei saa; millise detailsusega; kuidas pseudonümiseerida/klassifitseerida).

* * *

**Üks potentsiaalne komistuskivi / alternatiivvaade:** kui fookus läheb liiga “Ataki-integratsioonile”, võib süsteem muutuda sisuliselt ainult _andmefeed’i tootjaks_ ja oma veebirakenduse väärtus (juhtumihaldus, ajalugu, audit, planeerimine) jääb alakasutatuks. Praktiliselt tähendab see, et nõuetes tasub hoida kaks võrdselt tähtsat tarbimisviisi: **(1) täisfunktsionaalne veebirakendus** ja **(2) tugev API/integratsioonikiht**.

Kontseptsioonidokument

## Response:
Thought for 1m 4s

Siin on **lisapunktid** (varasematele lisaks) samast intervjuumaterjalist, millest tulevad **tulevased infosüsteemi nõuded**. Panin need selliselt, et iga punkt on _intervjuu signaal → nõue_.

* * *

1) Salastatus / juurdepääsupiirangud peavad kanduma ka väljunditesse (AK märgistus, alus, kuupäev)
--------------------------------------------------------------------------------------------------

**Signaal:** arutatakse lõppdokumendi “AK kasti”, kuupäeva ja seaduse aluse lisamist ning kuidas piiran­gud vormistada.

N1 Recording 392\_16k\_mono\_PRE18…

**Nõuded infosüsteemile:**

*   Ekspordid (raportid, väljavõtted, “incident pack”) peavad toetama **klassifikatsiooni/juurdepääsupiirangu metaandmeid** (nt AK tase, alus, kehtivusaeg).
*   Süsteemis endas peab olema **andmeklassifikatsiooni tugi** objektitasemel (track/intsident/sensor) + **audit**, kooskõlas kontseptsiooni “ligipääsud ja auditeeritavus” põhimõttega.
    Kontseptsioonidokument

2) “Vahelüli” sensori ja kuvapildi vahel peab olema selge (mida tehakse sensorite ja monitoring-IS vahel)
---------------------------------------------------------------------------------------------------------

**Signaal:** küsitakse otseselt: mis on plaan sensorite ja monitoringu infosüsteemi vahel; see mõjutab arhitektuurivalikuid.

N1 Recording 392\_16k\_mono\_PRE18…

**Nõuded:**

*   Vajalik on **selge integratsioonikiht** (adapterid/normaliseerimine/korrelatsioon), mitte “juhe otse kaardile”.
*   Süsteem peab toetama nii **sündmuspõhist** kui **voopõhist** integratsiooni (kontseptsioonis “reaalaja + ajalooinfo ühtseks pildiks”, sensor fusion).
    Kontseptsioonidokument

3) Tõendatavus (menetlus) ei ole “nice-to-have”: vaja pitserit, ahelat, usaldusväärsust
---------------------------------------------------------------------------------------

**Signaal:** “kust sa tead, et ta rikkus, kui allikaks on tuvastusseadmed, millele keegi pole pitserit külge pannud” + küsimus, millele peab sensoripilt tõendusena vastama.

Narva keskus Tx2 Recording 385\_…

**Nõuded:**

*   Kõik kriitilised sündmused/vaatlused peavad olema **tamper-evident** (muutmiskindel logi, ajatemplid, allikaviited).
*   Sensor- ja track-andmetel peab olema **kvaliteedi ja päritolu (provenance) meta**: allikas, kindlus, töörežiim, ajastuse täpsus.
*   Vajadus “menetluspaki” genereerimiseks (seotud logid, trajektoor, snapshotid/video viited), kooskõlas kontseptsiooni “ajalugu + auditeeritavus” teljega.
    Kontseptsioonidokument

4) Dünaamiline “valmisoleku / tundlikkuse” režiim (mitte ainult konstantne filter)
----------------------------------------------------------------------------------

**Signaal:** kirjeldatakse ideed, et sensor tuvastab anomaalia ja “tõstab häire taset” ning muidu agressiivselt filtreeritud “müra” tehakse ajutiselt nähtavamaks.

Narva keskus Tx2 Recording 385\_…

**Nõuded:**

*   Süsteemis peab olema **tundlikkuse režiim** (auto + manuaalne), mis mõjutab:
    *   mida kuvatakse vs peidetakse,
    *   millal tekib häire,
    *   kui palju toorandmeid/artefakte tuleb operaatorile.
*   See on otseselt kooskõlas kontseptsiooni “valmisoleku taseme režiimi” kirjeldusega (valealarmide vähendamine, automaatne tõstmine).
    Kontseptsioonidokument

5) “Keelualad + häire ainult rikkumise korral” kui töörežiim (mitte pidev ekraanivahtimine)
-------------------------------------------------------------------------------------------

**Signaal:** arutatakse varianti: märkida keelualad ja saada häire alles siis, kui objekt on alas sees; muul ajal ekraani ei vaadata.

Narva keskus Tx2 Recording 385\_…

**Nõuded:**

*   Tugev **geopiiri rikkumise tuvastus** + teavituskanalid (web + mobiil), mis on kontseptsioonis juba põhifunktsioon (“kaitstav ala”, “kaasaskantav häirerakendus”).
    Kontseptsioonidokument
*   Häire peab sisaldama **minimaalset reageerimisinfot** (kus, mis, kindlus, allikad, ajaline aken).

6) “Serverisse saadame / serverist võtavad välja” – andmejagamine peab töötama ka asutuste vahel
------------------------------------------------------------------------------------------------

**Signaal:** kirjeldatakse mudelit, kus üks pool saadab serverisse ja teine tarbib serverist; “see juurde ei käi”.

Narva keskus Tx2 Recording 385\_…

**Nõuded:**

*   Andmejagamine peab toetama **mitut tarbijat** (mitme asutuse COP/ekraanid) ja **õiguste pärimist** (kes mida näeb).
*   Vajalikud on **selged tarbija-vaated** (asutus/roll/piirkond), kooskõlas kontseptsiooni regionaalse piiramisega.
    Kontseptsioonidokument

7) “Üks ekraan kogu Narvale” + häireperimeetrid
-----------------------------------------------

**Signaal:** olemas “häirealade kaart”, liikumisega alad, “kogu Narva ühele ekraanile”.

Narva keskus Tx2 Recording 385\_…

**Nõuded:**

*   Kaardivaated peavad toetama **mitut perimeetrit / ala tüüpi** + kiiret ümberlülitust (operatiivne vaade vs planeerimine).
*   Häirete puhul peab süsteem suutma lisada **automaatseid “event snapshot’e”** (nt “spets pildid ette, kus on häire”) – vähemalt viited kaamera/andmeallika artefaktidele.
    Narva keskus Tx2 Recording 385\_…

8) Remote ID, radar, kaamera – “kolm tükki lehvivad eri värvi ja ei ristu” = vajadus korrelatsioonile
-----------------------------------------------------------------------------------------------------

**Signaal:** kirjeldatakse olukorda, kus erinevad allikad annavad “valgusfoori” moodi eraldi pilte ja kinnitust ei teki.

Narva keskus Tx2 Recording 385\_…

**Nõuded:**

*   Süsteem peab tegema **korrelatsiooni (track fusion)** ja näitama kasutajale _ühtset track’i_ koos allikate panustega (mitte 3 eraldi punkti).
*   Kui kinnitust ei saa, peab UI/API näitama **miks** (katvus puudub, allikad vastuolus, kvaliteet madal).

9) Sensorite füüsilised piirangud (kaamerad ei pööra üles; vaja katvuse ja “pimedate tsoonide” mudelit)
-------------------------------------------------------------------------------------------------------

**Signaal:** mainitakse, et paljud kaamerad ei pööra horisondist üles; idee “iga kaamera kõrvale radar” ja isegi mikrofoni lisamine.

Narva keskus Tx2 Recording 385\_…

**Nõuded:**

*   Sensoriregistris peab olema **FOV / tilt / töörežiimi** kirjeldus ning see peab kajastuma katvusvaates (kontseptsioonis “katvusalade vaade”).
    Kontseptsioonidokument
*   Süsteem peab olema **sensoritüüpide suhtes laiendatav** (EO/IR, radar, RF, Remote ID, akustika).
    Kontseptsioonidokument

10) Turvarežiim: “telefoni ei saa ruumi” → töövood peavad arvestama offline/secure keskkondi
--------------------------------------------------------------------------------------------

**Signaal:** mainitakse, et teatud ruumi ei saa telefoni sisse viia; vaja saada vähemalt meil/kanal kätte.

Narva keskus Tx2 Recording 385\_…

**Nõuded:**

*   Süsteemi kasutus- ja jagamisvood peavad toetama **turvalisi keskkondi** (piiratud seadmed, piiratud kanalid): kontrollitud eksport, ligipääsuregistrid, audit.
*   Praktiliselt: “väljavõte minimaalse infoga” vs “täispakett” (rollipõhiselt).

11) Kasutuslevi pudelikael: inimesed ei loe kontseptsioone → süsteem peab ise “selgitama ennast”
------------------------------------------------------------------------------------------------

**Signaal:** öeldakse otse, et inimesed tahavad 1–2 lauset, “10-aastasele selgitada”, muidu nad ei haagi.

Narva keskus Tx2 Recording 385\_…

**Nõuded:**

*   Vajalik on **lühike, rollipõhine selgitus/abitekst** (UI onboarding, “mis see süsteem on / mida ta ei ole”).
*   Häirete ja vaadete juures peab olema **semantika** (mida tähendab staatus, kindlus, miks häire tekkis) – toetab kontseptsiooni “staatused + filtreerimine”.
    Kontseptsioonidokument

12) Tarnijasõltuvuse ja “müüjad lubavad, aga …” risk → tervisejälgimine ja sõltumatuse nõue
-------------------------------------------------------------------------------------------

**Signaal:** kirjeldatakse kogemust, kus “müügimehed lubasid…”, tegelikkuses vaja käsitsi sekkuda (“koputada”).

Narva keskus Tx2 Recording 385\_…

**Nõuded:**

*   Süsteemis peab olema **sensorite ja andmevoogude tervise jälgimine** + teavitused (kontseptsioonis sensori rike / ühenduse katkemine).
    Kontseptsioonidokument
*   Arhitektuur peab toetama **moodulvahetust** (adapterid, standardid), et mitte jääda ühe tootja “nägude ja lubaduste” külge.

* * *

### Üks potentsiaalne komistuskivi / alternatiivvaade

Kui menetlus- ja tõendatavusnõudeid (pitser/ahel) võtta liiga “kõva” eeldusena juba MVP-s, võib see lükata kogu süsteemi ajaliselt ja tehniliselt üle võlli. Praktiline tee on teha **kaherežiimiline** lähenemine: operatiivne COP töötab kohe (kindlus+audit), ning “tõendirežiim” lisatakse etapiti (krüptosignatuurid/sertifitseerimine/formaalsed nõuded), nii et arhitektuur ei välista seda hiljem.

Narva keskus Tx2 Recording 385\_…

## Response:
Thought for 1m 30s

Jätkan **sama intervjuu** põhjal veel nende “nõudeks minevate” kohtadega, mis seni olid kas ainult riivamisi mainitud või üldse mitte.

* * *

1) Vertikaalne katvusauk (nt 80–300 m) ja “kes vastutab vahepealse õhuruumi eest”
---------------------------------------------------------------------------------

**Signaal:** piiril/merel nähakse teatud kõrguseni, kaitseväe sensorid “teisest kõrgusest”, tekib vahemik, mille omanik/katvus on ebaselge.

Narva keskus Tx2 Recording 385\_…

**Nõuded:**

*   Süsteem peab toetama **katvuse modelleerimist ka kõrguse lõikes** (mitte ainult 2D kaardil): “kus me päriselt näeme / kus ei näe”.
    Kontseptsioonidokument
*   Vajalik **sensorite panuse ja katvuse selgitus** track’i tasemel (miks see objekt on “nähtav” või “kahtlane”).
    Kontseptsioonidokument

2) Piiripealsed rikkumised: “alas sees vs mitte” vajab tolerantsi ja selget reeglit
-----------------------------------------------------------------------------------

**Signaal:** “täpselt piiri peal” ja operatiivne dilemma; kui küsid “kas võib”, saad “ei”.

Narva keskus Tx2 Recording 385\_…

**Nõuded:**

*   Geopiiri rikkumise tuvastusel peab olema **tolerants/hüsteeresis** (nt “3 sek järjest sees”, “X m puhvertsoon”), et vältida “piiri peal pendeldamist” valehäireks.
    Narva keskus Tx2 Recording 385\_…
*   Häire peab kandma **selget põhjendust** (millise ala reegel, milline täpsus) ja võimaldama kiiret operatiivset otsust.
    Kontseptsioonidokument

3) Keskus vs piirkond: “Tallinn ei näe, mis piiril toimub” + rollide jagamine admini poolt
------------------------------------------------------------------------------------------

**Signaal:** vajadus, et keskelt oleks nähtav piiriolukord, aga rollid ja vaated on jaotatud.

Narva keskus Tx2 Recording 385\_…

**Nõuded:**

*   Süsteem peab toetama **mitme taseme olukorrapilti** (kohalik/regionaalne/riiklik), kus detailid sõltuvad rollist ja piirkonnast.
    Kontseptsioonidokument
*   Vajalik **administreerimise töövoog**: rollid, atribuudid, piirkonnad, logitav muutmine (audit).
    Kontseptsioonidokument

4) “Visuaali olemasolevasse süsteemi sisse” ei ole sobiv tee → vaja korrektset integratsiooni (andmetasand)
-----------------------------------------------------------------------------------------------------------

**Signaal:** arutatakse “kas saaks olemasolevale süsteemile visuaali sisse”; vastus on sisuliselt “mitte nii”.

N1 Recording 427

**Nõuded:**

*   Integratsioon peab olema **andmete/sündmuste** tasemel (track’id, alarmid, meta), mitte “UI embed” või “pilt teise ekraani peale”.
    N1 Recording 427
*   Vajalik **ühine sündmuse/track’i skeem**, millele teised tarbijad saavad liidestuda (ATAK/C2/dispatch).
    Kontseptsioonidokument

5) “DJI-d track’in, aga …” = identifitseerimise ebaühtlus tuleb süsteemis nähtavaks teha
----------------------------------------------------------------------------------------

**Signaal:** mainitakse Aeroscope/DJI jälgimist; implitsiitselt kõiki droone sama hästi ei identifitseeri.

N1 Recording 427

**Nõuded:**

*   Track’i juures peab olema **identifitseerimise kvaliteet ja allikatüüp** (Remote ID / RF / “vendor-spetsiifiline” / EO/IR), et operaator ei teeks valesid järeldusi.
    Kontseptsioonidokument
*   Süsteem peab oskama kuvada ka “**ei saa tuvastada**” kui eraldi olekut, mitte vaikimisi “tundmatu = oht”.
    Kontseptsioonidokument

6) Operatiivlogi/juhtimistahvel: tegevused peavad “jõudma tahvlisse” (mitte jääma ainult raadioeetrisse)
--------------------------------------------------------------------------------------------------------

**Signaal:** kirjeldus stiilis “raadioeetrile… liigub ka siis sinna tahvlisse”.

N1 Recording 427

**Nõuded:**

*   Süsteem peab toetama **operatiivset sündmuslogi** (kes tegi mida, millal) ja selle edastust/kuvamist “juhtimistahvlis” (MES/dispatch/COP).
    N1 Recording 427
*   Logi peab olema **auditeeritav** ja seotud konkreetse juhtumi/track’iga.
    Kontseptsioonidokument

7) Sensorite “päris elu” probleem: lubatakse palju, aga paigalduses/katsetuses “ei edene nii hästi”
---------------------------------------------------------------------------------------------------

**Signaal:** F-SEC radarite test, “ei edene nii hästi, nagu lubati”; lisaks üldine hoiatus müügilubaduste kohta.

Narva keskus Tx2 Recording 385\_…

Narva keskus Tx2 Recording 385\_…

**Nõuded:**

*   Süsteemis peab olema **sensorite tervise/katkestuste** seire ja teavitused (sest “pilt ei vasta” juhtub päriselt).
    Kontseptsioonidokument
*   Hankes/nõuetes peab olema **vastuvõtutestide** raam (mis loetakse “töötab”: katvus, latentsus, valehäire määr, uptime), muidu jääbki “lubati vs tegelikkus”.
    Narva keskus Tx2 Recording 385\_…

8) Kaamera ei pööra üles + “iga kaamera kõrvale radar” = füüsilised piirangud tuleb mudeldada
---------------------------------------------------------------------------------------------

**Signaal:** paljud kaamerad ei pööra horisondist üles; soov siduda kaamera + radar + isegi mikrofon.

Narva keskus Tx2 Recording 385\_…

**Nõuded:**

*   Sensoriregistris peab olema **FOV/tilt/vertikaalne piirang**, et süsteem ei lubaks kasutajale “näeme kõike”.
    Narva keskus Tx2 Recording 385\_…
*   Süsteem peab olema **laiendatav uutele sensoritüüpidele** (sh akustika), adapteripõhiselt.
    Kontseptsioonidokument

* * *

**Üks potentsiaalne komistuskivi / alternatiivvaade:** kui “katvuseaukude” ja integratsioonide teema lahendada ainult organisatsioonilise kokkuleppena (“kelle vastutus”), siis tehniline süsteem jääb endiselt pimedaks. Parem on, et süsteem _ise_ suudab näidata katvuse puudujääke (2D+vertikaal), ning selle pealt saab alles mõistlikult vaielda, kas lahendus on sensor, integratsioon või protsess.

Kontseptsioonidokument

## Response:
Thought for 59s

Jätkan – **uued intervjuust tulenevad punktid**, mis lähevad päriselt “tulevaseks nõudeks” (või vähemalt arhitektuuriprintsiibiks) drooniseire infosüsteemile, sidudes need kontseptsiooniga.

* * *

1) Süsteem peab olema “riiklikult sobituv”, mitte ühe asutuse siseliides
------------------------------------------------------------------------

**Signaal:** rõhutatakse, et siht on üleriiklik vaade ja sobitumine teiste süsteemidega; eelanalüüs peab andma sisendi asutustevaheliseks infovahetuseks.

N1 Recording 392\_16k\_mono\_PRE18…

**Nõuded:**

*   **Mitme asutuse / mitme tarbija** tugi: roll + atribuudid + piirkond (kontseptsioonis).
    Kontseptsioonidokument
*   “Ühine olukorrapilt” peab olema **jagatav** (API/voog), mitte ainult ühe UI. (Sama suund kontseptsioonis “koondab… ühtseks pildiks”.)
    Kontseptsioonidokument

2) Arhitektuuriprintsiibid kui nõuded: modulaarne, skaleeritav, töökindel, turvaline, standardipõhine, tarnijast sõltumatu
--------------------------------------------------------------------------------------------------------------------------

**Signaal:** arhitektuurivisioonis loetletakse otsesõnu: komponentide eristatavus, hajusus/töökindlus, turvalisus, jõudlus/skaleeritavus, standardipõhine integratsioon, tarnijasõltumatus, tulevikukindlus.

N1 Recording 392\_16k\_mono\_PRE18…

**Nõuded:**

*   Süsteemi komponendid peavad olema **asendatavad/uuendatavad** (adapterid, korrelatsioon, visualiseerimine, mobiil).
*   Ei tohi olla “single point of failure” kriitilistes lülides (server, integratsioon, korrelatsioon).
*   Standardiseeritud liidesed (vähemalt “ühtne track/event skeem”), et vältida vendor lock-in’i.

3) Integratsiooniloogika: sündmuspõhine vs pidev voog + korrelatsiooni “kus ja millal”
--------------------------------------------------------------------------------------

**Signaal:** intervjuus tõstetakse eraldi, et eelanalüüsis kirjeldatakse integratsiooniloogikat: kas sündmuspõhine või voog; kes on allikad/tarbijad; mis tasemel toimub rikastamine ja korrelatsioon; kus pannakse olukorrapilt kokku.

N1 Recording 392\_16k\_mono\_PRE18…

**Nõuded:**

*   Süsteem peab toetama **kahte režiimi**:
    *   _Event_: alarmid, olekumuutused, “track created/updated/closed”
    *   _Stream_: tihe telemeetria/track update voog (kui sensorid seda annavad)
*   Korrelatsioon peab olema **konfigureeritav** (serveris vs “liimis” vs tarbijas), et sobituda riikliku integratsioonikihiga.

4) Valmisoleku / tundlikkuse režiim ei ole “mõte”, vaid nõue (auto + manuaalne)
-------------------------------------------------------------------------------

**Signaal:** kirjeldatakse ideed, et sensor “tõstab häire taset” ja muidu filtreeritud müra tehakse ajutiselt nähtavamaks.

Narva keskus Tx2 Recording 385\_…

**Nõuded (kontseptsioon annab väga konkreetse kuju):**

*   **Tundlikkusrežiimid**, mis mõjutavad:
    *   usalduslävesid,
    *   toorandmete filtreerimist,
    *   operaatori koormust,
    *   auto-režiimis anomaalia korral ajutist eskaleerimist.
        Kontseptsioonidokument

5) “Keelualad + häire ainult rikkumise korral” = geopiiri mootor + taustal töötav teavitus
------------------------------------------------------------------------------------------

**Signaal:** kirjeldatakse tööstiili, kus muul ajal ekraani ei vaadata; häire tuleb ainult siis, kui objekt on keelualas.

Narva keskus Tx2 Recording 385\_…

**Nõuded:**

*   Tugev **geofencing** (kaitstav ala / keeluala) + teavitused (web/mobiil).
    Kontseptsioonidokument
*   Teavitus peab töötama ka “taustal” (nt patrullis) – kontseptsioonis sama mõte.
    Kontseptsioonidokument

6) Rollid, õigused ja “kes mida näeb/tohib” on keskne teema (mitte hilisem kosmeetika)
--------------------------------------------------------------------------------------

**Signaal:** “mind huvitab… mida kes näha tahab, kes tohib, kes ei tohi” + vajadus, et “ülevalt otsustatakse, mida teha võib”.

Narva keskus Tx2 Recording 385\_…

**Nõuded:**

*   RBAC/ABAC (roll + atribuudid) ja regionaalne piiramine, auditeeritavus (kontseptsioonis).
    Kontseptsioonidokument
*   Võime kuvada/varjata sensorite asukohti ja katvust teadmisvajaduse järgi (kontseptsioonis).
    Kontseptsioonidokument

7) “Inimesed saavad infosüsteemist seinast seina aru” → vaja 1–2 lauselisi selgitusi + ühtset sõnavara
------------------------------------------------------------------------------------------------------

**Signaal:** intervjuus otse: inimesed tahavad 1–2 lauset; “kaheaastasele selgitada”; muidu tekib väärarusaam (“miks vaja politseidroone vaadata”).

N1 Recording 392\_16k\_mono\_PRE18…

**Nõuded:**

*   UI-s ja dokumentatsioonis peab olema **selge, lühike definitsioon** (mida süsteem teeb / ei tee).
*   Staatuste/teavituste juures peab olema **miks** (miks häire, mis kindlus, mis allikad), muidu otsused lagunevad.

8) Operatiivne mõõtmine ja aruandlus: lennuaeg vs tööaeg, ülesanded, järeltegevused
-----------------------------------------------------------------------------------

**Signaal:** räägitakse teenistuslehe loogikast: ei tohiks olla “tühje auke”; lennu eel-/järeltegevused, hooldus, raport; vajadus saada ülevaadet “mida tegi”.

Narva keskus Tx2 Recording 385\_…

**Nõuded infosüsteemile (või vähemalt integratsioonile):**

*   Süsteem peab suutma toota **kasutus- ja efektiivsuse mõõdikuid** (alerts, incident resolution, sensor uptime, keskmine reageerimisaeg jms) – see on sisend eelarveks/juhtimiseks.
*   Kui eesmärk on siduda päris tööaja arvestusega, siis vajab **liidestust teenistuslehe/operatiivlogi süsteemidega** (või vähemalt eksporditavat sündmuslogi).

9) Koolitus/kompetents kui võimekuse “pudelikael”: A1/A3 + tüübikoolitus + sisekoolitajate koormus
--------------------------------------------------------------------------------------------------

**Signaal:** droonide laialijaotamisel tekib “kes kasutab ja kes on pädev”; mainitakse A1/A3 miinimum ja tüübikoolitust; samal ajal ei saa võtmeisikud “aasta otsa ainult koolitada” (piiriseire nõue).

Narva keskus Tx2 Recording 385\_…

**Nõuded (kaudselt infosüsteemile):**

*   Kui süsteem hakkab olema riiklik “droonivõimekuse” keskne kiht, siis on vaja **kasutajate pädevusmeta** (kes on väljaõppega; mis õigused).
*   Vähemalt rollimudel peab arvestama “operaator / vaatleja / admin / välireageerija”.

10) Eelanalüüs ei anna detailset nõuete dokumenti → aga süsteem peab võimaldama etapiviisilist MVP-d
----------------------------------------------------------------------------------------------------

**Signaal:** “eelanalüüs ei ole detailne BA… ei tee arendusvalmis user story’sid… ei tee prototüüpi… ei tee tootjavõrdlusi”.

N1 Recording 392\_16k\_mono\_PRE18…

**Nõuded / järeldus süsteemile:**

*   Arhitektuur peab lubama **MVP-d** (geopiir + häire + audit + API) ja hiljem lisada sügavama korrelatsiooni, tõendirežiimi, täpsemad integratsioonid – ilma ümberkirjutuseta.

* * *

### Üks potentsiaalne komistuskivi / alternatiivvaade

Kui “mõõtmise ja aruandluse” teema (tööaeg/lennuaeg/teenistusleht) tõmmata liiga sügavale drooniseire infosüsteemi sisse, võib COP/track-fusion põhifookus ära uppuda “HR/operatiiv-admini” alla. Praktiline kompromiss: infosüsteem toodab **puhast sündmuslogi + standardseid operatiivmõõdikuid**, ja teenistuslehe täitmine jääb eraldi süsteemi (integreeritud, aga mitte dubleeritud).

Narva keskus Tx2 Recording 385\_…

## Response:
Thought for 1m 50s

Jätkan – järgmised “päris nõudeks” minevad kohad sellest samast intervjuumassist.

* * *

17) Turvaline töövõrk ja piiratud keskkond (VPN, salvestuspiirangud, “save” ei tööta)
-------------------------------------------------------------------------------------

**Signaal:** jutt, et dokumenti ei saa “save’ida”, “turvakaalutlus”, “VPN” jne.

Narva keskus Tx2 Recording 385\_…

**Nõuded:**

*   Süsteem peab toetama **paigaldust piiratud võrkudesse** (segmenteeritud LAN/VPN), kus kõik funktsioonid ei saa eeldada “avalikku internetti”.
*   Vajalik **kontrollitud eksport/print/alla laadimine** rolli ja turvarežiimi järgi (kes saab “täislaksu”, kes ainult meta).
    Narva keskus Tx2 Recording 385\_…

18) “Näita relevantset, mitte kõike” – filtrid + sensor fusion kui kasutusrežiim, mitte reklaam
-----------------------------------------------------------------------------------------------

**Signaal:** soov panna sensorid koos tööle nii, et nad ei näitaks “kõike”, vaid relevantsemat, ja eskaleeriks kui vaja.

Narva keskus Tx2 Recording 385\_…

**Nõuded:**

*   **Relevantsus-/filtripoliitikad** (tava vs eskaleeritud valmisolek), mis määravad, mida kuvatakse ja millal tekib häire.
    Kontseptsioonidokument
*   Filtreerimise loogika peab olema **selgitatav** (“miks see jäi nähtamatuks / miks nüüd tuli välja”).
    Kontseptsioonidokument

19) Alarmiga peab tulema “pakett” (pildid/snapshotid + kontekst), muidu ei saa reageerida
-----------------------------------------------------------------------------------------

**Signaal:** häire korral “viskab … spetsial pildid ette, kus on häire”.

Narva keskus Tx2 Recording 385\_…

**Nõuded:**

*   Häire peab genereerima **automaatse “incident snapshot’i”** (kaardi väljavõte, track’i viimased punktid, seotud sensorite artefaktide viited).
*   See peab minema nii veebivaatesse kui ka tarbitavaks integratsiooniga (dispatch/ATAK/C2).
    Kontseptsioonidokument

20) Alarm → “kes saadab patrulli?” peab olema töövoog, mitte suuline kokkulepe
------------------------------------------------------------------------------

**Signaal:** küsitakse, kellele süsteem ütleb ja kes saadab patrulli; vastus: “tema otse saadab patrulli”.

Narva keskus Tx2 Recording 385\_…

**Nõuded:**

*   Süsteemis peab olema vähemalt **tasking/assignment** minimaalne tugi: “võetud menetlusse / edastatud / assigned / lõpetatud” + audit.
    Kontseptsioonidokument
*   Integratsioon väljasõidukorralduse/juhtimistahvli suunas peab olema esmaklassiline (mitte “copy-paste”).
    N1 Recording 427

21) “Usaldusväärsus” on esmane meta – kindlus, allikad ja vastuolud peavad olema nähtavad
-----------------------------------------------------------------------------------------

**Signaal:** otse sõnastatakse, et küsimus on usaldusväärsuses.

N1 Recording 427

**Nõuded:**

*   Iga track/objekti juures peab olema **confidence + provenance** (millised sensorid panustasid, millal, kui tugev).
*   UI-s peab olema kiire “valgusfoori” olukorra lahtiharutamine (miks 3 allikat ei ristu / mis puudu). (Seostub ka staatuste ja valmisoleku režiimiga.)
    Kontseptsioonidokument
    Narva keskus Tx2 Recording 385\_…

22) Õppus- ja treeningrežiim (simulaator, replay, turvaline “harjutamine”)
--------------------------------------------------------------------------

**Signaal:** mainitakse droonisimulaatorit; kirjeldatakse ühisõppusi ja kogemuse kasvatamist.

N1 Recording 392\_16k\_mono\_PRE18…

Narva keskus Tx2 Recording 385\_…

**Nõuded:**

*   Süsteem vajab **treening/sandbox režiimi**: sünteetiliste track’ide sisseandmine, “replay minevikust”, rolliharjutused.
*   See peab töötama ka piiratud võrgus (vt turvavõrk/VPN teema).
    Narva keskus Tx2 Recording 385\_…

23) “Sõbralik/loaga” droonide ja oma võimekuse register + kadumise vältimine (varahaldus vähemalt minimaalselt)
---------------------------------------------------------------------------------------------------------------

**Signaal:** droonid “haihtusid”, keegi ei teadnud kuhu; küsimus “kes hakkab käitlema?”.

Narva keskus Tx2 Recording 385\_…

**Nõuded:**

*   Süsteemis (või liideses teise registriga) peab olema **oma droonide/ID-de register**: mis on “sõbralik”, mis on “loaga” (kontseptsiooni staatused), et vältida blue-on-blue ja valesid häireid.
    Kontseptsioonidokument
*   Minimaalne **vastutuse jälg**: kes lisas/muutis staatust, kes võttis seadme kasutusse (audit).
    Kontseptsioonidokument

24) Mõõdikud eelarveks ja juhtimiseks (mitte ainult “ilus kaart”)
-----------------------------------------------------------------

**Signaal:** tehakse eelarve osi ja otsitakse “aluspunkti”, mille üle vaielda; tööaja/teenuse mõõtmine eraldi teemana.

Narva keskus Tx2 Recording 385\_…

Narva keskus Tx2 Recording 385\_…

**Nõuded:**

*   Süsteem peab tootma **KPI-d ja aruandlust** (häirete arv, kinnitatud intsidentide osakaal, reageerimisajad, sensori uptime, valehäire määr, kasutusaktiivsus).
*   Vajalik ekspordi-/raportiformaat, mis sobib juhtimise ja hankenõuete põhjendamiseks.
    Kontseptsioonidokument

25) Katvuse indikaator kasutajale + mobiilne taustateavitus
-----------------------------------------------------------

**Signaal/konseptsiooniline lukustus:** küsimus “kas kasutaja on sensoritega kaetud alas või mitte?” + mobiilirakendus, mis töötab taustal ja annab hoiatusi.

Kontseptsioonidokument

Kontseptsioonidokument

**Nõuded:**

*   UI-s peab olema **katvuse/“covered vs not covered”** indikaator (2D + vajadusel kõrgus).
*   Mobiilis peab teavitus toimima **taustal** ning toetama dünaamilist kaasaliikuvat kaitstavat ala.
    Kontseptsioonidokument

* * *

**Komistuskivi / alternatiivvaade:** intervjuu “droonid haihtusid / kes käitleb” teema võib väga kiiresti paisuda “droonipargi haldussüsteemiks” (inventar, hooldus, meeskonnad, teenistuslehed). See on päriselt vajalik, aga Counter-UAS seire COP võib selle alla ära uppuda. Praktiline kompromiss: hoida seiresüsteemis **minimaalne register + staatused + audit** ning ülejäänu lahendada eraldi varahaldus/teenistuslehe süsteemis integratsiooni kaudu.

Narva keskus Tx2 Recording 385\_…

## Response:
Thought for 2m 3s

Allpool on **uued (või sügavamalt lahti kirjutatud) aspektid**, mis nendest dokumentidest välja paistavad ja milleks tasub teha **konkreetsed nõuded**.

* * *

1) “Kooskõlastatud lend” vs “kooskõlastamata lend” peab olema masinloetav reegel, mitte telefonikõne
----------------------------------------------------------------------------------------------------

Intervjuus kirjeldatakse tööpraktikat: kooskõlastatud lennud “on kirjas” ja helistatakse üle; kooskõlastamata puhul saadetakse patrull.

Narva keskus Tx2 Recording 385\_…

**Nõue:** süsteem peab suutma **automaatse vastendusega** märgistada tuvastuse:

*   _kooskõlastatud_ (seotud loaga / plaaniga / õppuseala reegliga),
*   _potentsiaalselt rikkumine_ (geopiir/keeluala + luba puudub),
*   _vajab kontrolli_ (andmekvaliteet madal / vastendus ebakindel).  
    See seob otse kontseptsiooni “Piiranguala/Õppuseala/Kaitstav ala/Varjatud ala” reeglistikuga.
    Kontseptsioonidokument

* * *

2) Tõendatavus = sensorite “metroloogia”: pitser, versioonid, kalibreerimine, ahel
----------------------------------------------------------------------------------

Intervjuu kasutab analoogiat politsei mõõteseadmetega (kiirusmõõtjad jms) ja “tõhususkaamera” näidet – st usaldus ei tule “kaarditäpist”, vaid sellest, et seadme kasutus on kontrollitav/sertifitseeritav.

N1 Recording 427

N1 Recording 427

**Nõue:** süsteemil peab olema **sensoriregister + tõendiahela meta**:

*   seadme identiteet, firmware/konf, kalibreerimise/sertifikaadi info,
*   sündmuste **märkamatult muutmiskindel** logi (kes muutis reegleid/staatusi/alasid),
*   “incident pack” ekspordina koos viidetega (milline sensor, mis seadistus, mis ajaraam).  
    Kontseptsiooni auditeeritavuse osa annab sellele vundamendi, aga “tõendiahel” vajab eraldi nõuet.
    Kontseptsioonidokument

* * *

3) MLS päris maailmas: “Varjatud ala” + “Nähtamatu droon” + “hägustatud katvuskaart”
------------------------------------------------------------------------------------

Kontseptsioonis on korraga:

*   _Varjatud ala_ (tavakasutajale ei kuva),
    Kontseptsioonidokument
*   _Nähtamatu_ staatus (droon, mille lendu ei kuvata),
    Kontseptsioonidokument
*   sensorite asukohtade/katvuse varjamine ja “hägustatud” katvuskaart teadmisvajaduse järgi.
    Kontseptsioonidokument
    **Uus aspekt:** see pole lihtsalt “filtrid UI-s”, vaid **mitmetasemeline ligipääs** (praksis: eri täpsus / eri kihid / eri objektid).  
    **Nõuded:**
*   objektitasemel turvamärgistus + “downgrade” reeglid (nt täpsus 10 m → 500 m),
*   varjamise otsused peavad jääma auditisse (et “Nähtamatu” ei muutuks vaikseks manipuleerimiseks),
*   tarbija-väljundites (API/ATAK) peavad samad piirangud kehtima.
    Kontseptsioonidokument

* * *

4) Staatused ei ole ainult värvid – need on otsustusõigus ja vastutus (“kelle määrata?”)
----------------------------------------------------------------------------------------

Kontseptsioon küsib otse, nt “Vaenulikkuse kahtlus … (kelle määrata?)”.

Kontseptsioonidokument

**Nõue:** defineeri staatusetele:

*   **autoriteedimudel** (kes saab seada _vaenulik/kahtlus/loaga/sõbralik_),
*   kas nõuab 2-inimese kinnitust / eskalatsiooni,
*   **aegumine** (nt _Uus droon_ või _Kahtlane_ ei tohiks jääda igaveseks).
    Kontseptsioonidokument

* * *

5) “Me ei hakka radaripilti sisse võtma” → nõue eristada “toorpilt” vs “track/event”
------------------------------------------------------------------------------------

Intervjuus on selge “ei hakka radaripilti sisse võtma” seisukoht.

N1 Recording 427

**Uus aspekt:** see peaks lukustuma arhitektuurinõudena:

*   süsteem integreerib **track’id / tuvastused / meta**, mitte “ekraanipilti”,
*   sensorite tootjad/adapterid vastutavad toorandme → track konversiooni eest (või tehakse eraldi “liimi” kihis).  
    See sobitub ka “integratsiooniloogika: event vs voog; kus toimub rikastamine ja korrelatsioon” raamiga.
    N1 Recording 392\_16k\_mono\_PRE18…

* * *

6) “Track’ida DJI droone” ≠ päris trackimine: terminoloogia ja andmekvaliteet peab UI-s selge olema
---------------------------------------------------------------------------------------------------

Intervjuus mainitakse Aeroscope’i loogikat ja et “saate track’ida DJI droone, aga see tegelikult ei ole track’imine…”.

N1 Recording 427

N1 Recording 427

**Nõue:** süsteemis peab olema **andmeallika tüübi semantika**:

*   kas on Remote ID / RF / vendor-spetsiifiline / EO kinnitus,
*   mis on “track’i” definitsioon (trajektoor vs viimase nähtuse punkt),
*   kuidas kuvatakse vastuolusid (“valgusfoor: 3 allikat ei ristu”).
    Narva keskus Tx2 Recording 385\_…

* * *

7) Operatiivkeskuse “üks ekraan” ja häire “pildid ette” = vaikimisi ootustase
-----------------------------------------------------------------------------

Narva materjalis kirjeldatakse olemasolevat perimeetri-/häiresüsteemi loogikat: ala läheb häiresse ja “viskab … spetsial pildid ette”.

Narva keskus Tx2 Recording 385\_…

Kontseptsioonis on “Üldpilt” (hetkeolukord + ajalugu) ning “mineviku häirete ajalugu”.

Kontseptsioonidokument

**Uus aspekt:** kasutajad võrdlevad uut lahendust **praeguse baasootusega**: _häire = kontekst + artefaktid_.  
**Nõue:** alarm peab tekitama “incident snapshot’i” (kaart + track’i viimased punktid + seotud sensori artefaktide viited) ja see peab olema sirvitav ajaloos.

* * *

8) Droonid “haihtuvad” ja puudub “kontseptsioon, liikumine, käitlemine” → süsteemi ümber on vaja valitsemist
------------------------------------------------------------------------------------------------------------

Narva tekstis: droonid jaoskonnas “haihtusid”, keegi ei teadnud kuhu; küsitakse “mis kontseptsioon on… kes hakkab käitlema?”.

Narva keskus Tx2 Recording 385\_…

**Nõue (minimaalselt):**

*   “oma droonide” register (ID, üksus, vastutaja, staatus),
*   sidumine “sõbralik/loaga” loogikaga (et oma droon ei tekitaks valepaanikast intsidendi).
    Kontseptsioonidokument
    See võib olla eraldi süsteem, aga seiresüsteem peab vähemalt tarbima seda infot.

* * *

9) Vendor lock-in ja kohaliku kompetentsi puudus: “Ukraina häkk”, litsentsid, “PPA on probleemne klient”
--------------------------------------------------------------------------------------------------------

Narva materjal kirjeldab spetsiifilist “häkki” (Ukrainast), suuri litsentsitasusid ja et Eestis puudub kompetents seda modifitseerida; hinnasoodustust “PPA-le ei saa”.

Narva keskus Tx2 Recording 385\_…

**Uus aspekt:** see on _reaalne_ lukustusriski juhtum, mitte teoreetiline.  
**Nõuded hankesse / arhitektuuri:**

*   adapteripõhine disain + standardiseeritud andmemudel (et üks sensor/vendor ei dikteeri kogu süsteemi),
    N1 Recording 392\_16k\_mono\_PRE18…
*   nõue “kohalikult hooldatav” (dokumentatsioon, administreeritavus, integratsioonid testitavad),
*   selged vastuvõtutestid (latentsus, valehäire määr, katvus, uptime) – muidu kordub “lubati vs tegelikkus”.
    Narva keskus Tx2 Recording 385\_…

* * *

### Üks komistuskivi / alternatiivvaade

Kontseptsiooni staatus _“Uus droon”_ on põhjendatud lausega “enamik intsidente seotud välismaalastega”.

Kontseptsioonidokument

Kui see läheb nõudesse ilma täpsustamata, võib see tekitada **halba heuristikat** (bias) ja valesid operatiivotsuseid. Mõistlikum on siduda “uudsus” _objektiivsete signaalidega_ (nt “esmakordselt nähtud ID/RemoteID selles piirkonnas” + “käitumismuster”), mitte oletustega.

Kui tahad, saan järgmise sammuna teha sellest samast materjalist **“Nõuete backlog’i”**: iga ülaltoodud aspekt → konkreetne FR/NFR lause + testkriteerium (acceptance).

## Response:
Thought for 1m 42s

Allpool on **uued ja sügavamad aspektid**, mis nendest samadest dokumentidest üsna selgelt välja kooruvad (ja mida varem polnud või polnud nii konkreetselt lahti võetud). Iga punkt on _signaal → nõue_.

* * *

1) “Tegelik töölaud” on KILP + Apollo (mitte ainult veebikaart)
---------------------------------------------------------------

**Signaal:** piirivalve kirjeldab, et operatiivtöö käib läbi **KILP-i** (töölaud) ja patrullide maailm on **Apollo**; kui “drooniteadet” Apollosse ei jõua, siis patrull “ei reageeri kuhugi”.

Piir rain Recording 405\_16k\_mon…

Kontseptsioonis on sama mõte: patrullidel Apollos taustateavitus “Sinu lähedal on droon”.

Kontseptsioonidokument

**Nõuded:**

*   Süsteemil peab olema **teavituskanal Apollosse** (või Apolloga seotud teenusesse), mitte ainult veeb UI/mobiili push.
    Piir rain Recording 405\_16k\_mon…
*   Teavitused peavad olema **sihtotstarbelised** (lähipatrullid / trajektooriala) – mitte “kõigile korraga”.
    Piir rain Recording 405\_16k\_mon…
*   Vajalik on **sündmuse vormistus** (koordinaat, aeg, lühikirjeldus + link detailvaatesse), mis sobitub olemasoleva “mull + kategooria” loogikaga.
    Piir rain Recording 405\_16k\_mon…

* * *

2) Patrulli automaatne selektsioon: raadius ei ole piisav, vaja “ennustuslikku trajektoori”
-------------------------------------------------------------------------------------------

**Signaal:** droon on kiire ja liikuv; käsitsi “vaatan, täpsustan, siis saadan” ei tööta. Vajalik on automaatne patrulli valik ning teavitus pigem **ennustusliku trajektoori** sisse jäävatele patrullidele.

Piir rain Recording 405\_16k\_mon…

**Nõuded:**

*   **Reageerijate valiku mootor**: valib patrullid (nt 1 km → 5 km → 10 km) ja välistab absurdi “Otepää puudub, saadame Tartusse” ilma täiendava loogikata.
    Piir rain Recording 405\_16k\_mon…
*   Teavituse “sihtala” peab lähtuma **trajektoori prognoosist** (mitte ainult lähim geokoordinaat).
    Piir rain Recording 405\_16k\_mon…
*   Süsteem peab oskama _prioritiseerida_ risti piiriga liikuvaid objekte võrreldes paralleelsetega (info vs alarm).
    Piir rain Recording 405\_16k\_mon…

* * *

3) Operaatori asukoht on sageli tähtsam kui drooni punkt
--------------------------------------------------------

**Signaal:** praktiline eesmärk on jõuda **operaatorini** (nii menetluseks kui ka tegevuse lõpetamiseks); drooni “püüdmine” on tihti sekundaarne.

Piir rain Recording 405\_16k\_mon…

**Nõuded:**

*   Track’i mudel peab toetama **kahte seotud objekti**: _aircraft track_ + _pilot/operator estimate_ (tõenäosusala/triangulatsioon).
*   UI ja teavitus peavad näitama **kumb on hetkel parem siht**: “vaata õhku siin” vs “mine võimaliku operaatori alasse”.
    Piir rain Recording 405\_16k\_mon…
*   Kui operaator on teisel pool piiri, peab süsteem suutma seda _selgelt väljendada_ (st “püüdmine Eestis pole realistlik”), et vältida ressursside põletamist.
    Piir rain Recording 405\_16k\_mon…

* * *

4) Menetlusahel: PPA piir ei menetle, toll/krimka menetleb → vaja “handover” töövoogu
-------------------------------------------------------------------------------------

**Signaal:** salakaubavedu pole PPA pädevus; PPA fikseerib/tõkestab ja annab **tollile** üle aktiga; valesti käsitlemine võib rikkuda kriminaalmenetluse (nt droonile pealeastumine, mälu kahjustamine).

Piir rain Recording 405\_16k\_mon…

Lisaks mainitakse, et “kriminaalmenetluse pädevust piiri pealt meil ei ole” ja tõendiväärtuse/andmete säilituse nõuded tulevad teisest otsast.

Piir rain Recording 405\_16k\_mon…

**Nõuded:**

*   Süsteem peab toetama **intsidendi üleandmise paketti**: sündmuslogi, sensoriviited, failid/fotod, “chain-of-custody” meta (kes kogus, millal, mis seisund).
    Piir rain Recording 405\_16k\_mon…
*   Vajalik on **rollipõhine juurdepääs** menetluspakile (piiriüksus vs krimka vs toll) + audit. (Kontseptsioon rõhutab auditeeritavust.)
    Kontseptsioonidokument
*   Süsteem võiks sisaldada **SOP/checklist** tüüpi juhist, et vältida “füüsilise tõendi” rikkumist (praktiline risk on otsesõnu välja toodud).
    Piir rain Recording 405\_16k\_mon…

* * *

5) Vastumeetmete (nt “tapab signaali ära”) kõrvalmõjud: keskkonnapõhine piirangumootor
--------------------------------------------------------------------------------------

**Signaal:** isegi kui tulevikus “vajutad nuppu ja tapab signaali”, võib see keskkonnast sõltuvalt “tappa midagi muud” (wifi, südamestimulaator jne).

Piir rain Recording 405\_16k\_mon…

**Nõuded:**

*   Süsteem peab käsitlema vastumeetmeid kui **policy-otsust**, mitte kui “üks nupp kõigile”: reeglid sõltuvad asukohast (Narva linn vs hõre ala), kõrvalriskidest ja volitustest.
    Piir rain Recording 405\_16k\_mon…
*   UI-s peab eristuma: “tuvastus/hoiatus/juhtimine” vs “vastumeede” (erinevad õigus- ja ohuprofiilid).
    Piir rain Recording 405\_16k\_mon…

* * *

6) “Kõik punased” kriisirežiim: dünaamiline ühisoperatsioon + sensorite “äratus”
--------------------------------------------------------------------------------

**Signaal:** soov, et ohu korral “tuleb alarm kõikidele, kõik on punased” ning ideaalis käivitub laiem andmekogumine (sh teiste osapoolte sensorid/objektid).

Piir rain Recording 405\_16k\_mon…

Piir rain Recording 405\_16k\_mon…

**Nõuded:**

*   Süsteemis peab olema **kriisirežiim / eskalatsioonitase**, mis muudab:
    *   teavituste levikut (kellele ja mis lävendiga),
    *   kasutatavate andmeallikate hulka,
    *   logimise ja säilituse režiimi.
        Piir rain Recording 405\_16k\_mon…
*   Vajalik “policy override” raam: rahuajal pädevus/rollid rangemad, kriisis ajutiselt laiem pilt (hilisem audit, miks laiendati).
    Piir rain Recording 405\_16k\_mon…

* * *

7) Õhupiiri pädevus on “hall ala” → reeglid peavad olema konfigureeritavad, mitte hardcode
------------------------------------------------------------------------------------------

**Signaal:** pole selgelt kokku lepitud, “kust kõrgusest keegi vaatab”; suusõnalised kokkulepped; isegi 300 m vastutusala ei lahenda “sõjalise eesmärgiga rootormasin” dilemmasid.

Piir rain Recording 405\_16k\_mon…

**Nõuded:**

*   **Reeglimootor** peab olema poliitika/õigusruumi muutustega kohandatav: kõrguse-, kiiruse-, objekti- ja kontekstipõhine eskalatsioon.
    Piir rain Recording 405\_16k\_mon…
*   Süsteem peab taluma, et “tööjaotus” muutub: sama track võib olla nähtav mitmele asutusele, aga tegevus/teavitus sõltub konfiguratsioonist.
    Piir rain Recording 405\_16k\_mon…

* * *

8) Hajus arhitektuur piirivõrgus: lokaalne töö jätkub ka siis, kui “Tallinn ära kukub”
--------------------------------------------------------------------------------------

**Signaal:** jutt “üks kaabel mööda piiri”, võrgusegmenteerimine, rikke taluvus, ja mõte, et Narva/Peipsi/Kagu võivad olla eraldi “lõigud” oma töötlusega.

Piir rain Recording 405\_16k\_mon…

**Nõuded:**

*   Arhitektuur peab toetama **edge/region servereid** (lokaalne ingest+korrelatsioon minimaalselt), mis sünkivad keskusega kui ühendus olemas.
    Piir rain Recording 405\_16k\_mon…
*   Rikke korral peab jääma tööle “kohalik COP + teavitus” (vähemalt oma lõigus).
    Piir rain Recording 405\_16k\_mon…

* * *

9) Radar üksi ei klassifitseeri: “droon vs lind” verifitseeritakse optikaga → kaamera “cueing” ja viite-nõue
------------------------------------------------------------------------------------------------------------

**Signaal:** öeldakse otse, et radarile “droon vs lind” analüütika pidavat olema võimatu; Peipsil manuaalselt suunati kaamera ja “õnn oli”; see peaks olema automaatne, eriti kui kiirus suur ja ristipiiriga.

Piir rain Recording 405\_16k\_mon…

Piir rain Recording 405\_16k\_mon…

**Nõuded:**

*   Vajalik **sensor-to-tasking** liides: track → kaamera suunamine (PTZ), et saada visuaalne kinnitus.
    Piir rain Recording 405\_16k\_mon…
*   Siin tekib **range reaalaja nõue**: kui lendab sadu km/h, peab cueing tööle alla-sekundilises tempos (muidu “pole enam midagi teha”).
    Piir rain Recording 405\_16k\_mon…
*   Süsteem peab toetama “piisav zoom” praktikat (mitte ideaalne lähivõte, vaid kiire sektor/kinnitus).
    Piir rain Recording 405\_16k\_mon…

* * *

10) “One single window” on eesmärk, aga päris elu on multi-süsteem → vaja linkimist, mitte monoliiti
----------------------------------------------------------------------------------------------------

**Signaal:** soov “one single window”, aga reaalsus: juba täna 3–4 IS-i, uute lisamine vanadesse on raske.

Piir rain Recording 405\_16k\_mon…

**Nõuded:**

*   MVP-s tasub disainida nii, et COP annab **keskse tõe** (track/intsident), ja teised süsteemid saavad _linkide ja sündmuste_ kaudu kätte vajaliku, mitte et üritad kogu maailma ümber ehitada.
    Piir rain Recording 405\_16k\_mon…
*   “Ühes aknas” võib tähendada ka _ühte sündmuse ID-d_ ja “drill-down linke” (KILP/Apollo/menetlus), mitte tingimata ühte UI-d.

* * *

### Üks potentsiaalne komistuskivi / alternatiivvaade

Kui minna liiga vara “täis automaatika” (trajektoor + patrulli valik + kaamera cueing + kriisirežiimi reeglid) peale, siis ebausaldusväärne sensoripilt muudab kogu ahela müraseks ja patrullid õpivad teavitusi ignoreerima. Praktiline kaitse: alusta **väga konservatiivse häirelävendiga** + “info-only” teavitused, ning lase “punase režiimi”/agressiivse eskalatsiooni loogika sisse ainult siis, kui kvaliteedimõõdikud (valealarmid, latentsus, kinnituse määr) on päriselt mõõdetud.

Piir rain Recording 405\_16k\_mon…



---
Powered by [ChatGPT Exporter](https://www.chatgptexporter.com)