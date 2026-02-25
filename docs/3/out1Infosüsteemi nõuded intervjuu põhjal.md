# Infosüsteemi nõuded intervjuu põhjal

**User:** Andres Moks (andres.moks@gmail.com)  
**Created:** 2/25/2026 22:33:15  
**Updated:** 2/25/2026 23:43:03  
**Exported:** 2/25/2026 23:44:13  
**Link:** [https://chatgpt.com/g/g-p-698b7a30d6848191bacb8cff5277cb17-intekad/c/699f5c7e-a724-838f-9f1b-e3698799f4eb](https://chatgpt.com/g/g-p-698b7a30d6848191bacb8cff5277cb17-intekad/c/699f5c7e-a724-838f-9f1b-e3698799f4eb)  

## Response:
Thought for 1m 16s

Allpool on **intervjuust koondatud olulised punktid (kontseptsioonidokumendi põhjal)** ja nende põhjal tekkivad **tulevased infosüsteemi nõuded**.

1) Süsteemi eesmärk ja “mida ta kokku liidab”
---------------------------------------------

**Punkt:** Ühtne olukorrapilt eri drooniseire sensoritest (Remote ID, RF, drooniradarid jne), nii reaalajas kui ajaloos; sensor fusion valehäirete vähendamiseks; rollipõhine filtreeritud pilt.

Kontseptsioonidokument

**Nõuded:**

*   Sissetulevate sensorivoogude standardiseeritud ingest (eri tootjad/formaadid), ajastamine ja normaliseerimine ühtseks sündmuste/track’i mudeliks.
*   Track/objekti “fusion” loogika (korrelatsioon, usaldusväärsus, duplikaatide ühendamine, valehäirete vähendamine).
*   Rolli- ja vajaduspõhine andmete filtreerimine (mis, kui täpselt ja kellele kuvatakse).

2) Reaalaja häired ja operaatori töövoog
----------------------------------------

**Punkt:** Häire geopiiri rikkumisel; operaator reageerib; mineviku häirete ajalugu ja sirvimine.

Kontseptsioonidokument

**Nõuded:**

*   Geofencing mootor (kaitstavate aladega ristumine, puhvrid, reeglid).
*   Häire elutsükkel (tekkimine, kinnitamine, käsitlemine, sulgemine, kommentaarid/otsused) + otsitav ajalugu.
*   Sündmuste taasesitus / “incident review” võimekus (minimaalselt ajajoon + kaardil replay).

3) Töökindlus ja seire tervis (health)
--------------------------------------

**Punkt:** Teavitus ühenduse katkemise korral (kasutaja offline) ja sensori rikke korral (pilt/andmevoog ei vasta).

Kontseptsioonidokument

**Nõuded:**

*   Süsteemi ja sensorite tervisemonitooring (heartbeat, kvaliteedimõõdikud, “data stale”, stream error).
*   Teavituste reeglid (kellele, mis prioriteediga, millal eskaleerida).
*   Selge eristus: “sensor maas” vs “võrk maas” vs “andmete kvaliteet halb”.

4) Veebirakenduse põhivaated
----------------------------

**Punkt:** Üldpilt kaardil (hetk + ajalugu + loendurid), kaitstava ala seadistamine, planeerimine katvusaladega.

Kontseptsioonidokument

**Nõuded:**

*   Kaardivaade mitme kihiga (reaalaja track’id, alad, ajalugu) + kokkuvõtuloendurid.
*   Kaitstavate alade (geopiiride) CRUD + versioonihaldus/audit (kes muutis, millal).
*   Planeerimisvaade: katvusalade kuvamine ja analüüs (nt isikukaitse teekonnad, uute sensorite asukoha analüüs).

5) Sensorite asukohtade/katvuse varjamine ja “hägustamine”
----------------------------------------------------------

**Punkt:** Sensorite asukohti ja katvust saab varjata; vajadusel kasutada hägustatud katvuskaarte (teadmisvajaduse põhiselt).

Kontseptsioonidokument

**Nõuded:**

*   Ligipääsutasemete järgi erinev detailsus (täpne vs hägustatud vs peidetud).
*   Obfuskatsioonirežiim katvusandmetele (nt resolutsioon, geomeetria generaliseerimine) + poliitikad, millal mida näidatakse.
*   Sensorimetainfo eraldi kaitseklass (asukoht, võimekus, olek) vs avalik “katvus-indikatsioon”.

6) Mobiilirakendus: kaasaskantav häire ja liikuv kaitseala
----------------------------------------------------------

**Punkt:** Mobiilne häirerakendus; kasutaja saab luua enda ümber kaasaliikuva kaitstava ala; isikukaitsel hoiatus teekonnal/läheduses; taustal töötav teavitus; võimalik katvuse indikatsioon.

Kontseptsioonidokument

**Nõuded:**

*   Mobiili geofencing ümber kasutaja GPS-i (dünaamiline geopiir) + taustateavitused.
*   “Lähedal on droon” loogika (kaugus/aja aknad, filtrid, prioriteedid).
*   Katvuse indikatsioon (“olen kaetud/katmata”) vähemalt lihtsustatud kujul.

7) Ligipääsud, segmenteerimine, audit
-------------------------------------

**Punkt:** Rolli- ja atribuudipõhine ligipääs; regionaalne piiramine; kõik tegevused auditeeritavad.

Kontseptsioonidokument

**Nõuded:**

*   ABAC/RBAC poliitikad (roll + atribuudid + geo-segmenteerimine).
*   Auditlogi: kes vaatas/muutis/märgistas (sh režiimimuudatused ja staatused) + säilituspoliitika.

8) Alade tüpoloogia ja välisandmete kasutus
-------------------------------------------

**Punkt:** Piirangualad NOTAM/AIP põhjal (avalik); õppusealad (NOTAM); kaitstav ala (mitteavalik, ka puhvrina geofencing’uks); varjatud ala (tavakasutajale ei kuva).

Kontseptsioonidokument

**Nõuded:**

*   NOTAM/AIP ingest + ühtne “ala” andmemudel (tüüp, kehtivusaeg, kõrgusvahemik, allikas, usaldus).
*   Kasutajapõhised kaitstavad alad (mitteavalik) + puhveralad.
*   Varjatud alade mehhanism (süsteemne “suppress/omit” kuvamisel) koos rangete õiguste ja auditiga.

9) Droonide staatused ja nähtavuse kontroll
-------------------------------------------

**Punkt:** Staatused (neutraalne, loaga, sõbralik, uus, kahtlane, vaenulikkuse kahtlus, vaenulik, nähtamatu).

Kontseptsioonidokument

**Nõuded:**

*   Reeglid + käsitsi märgistamine (kes võib millist staatust panna; mis on “uus droon” definitsioon).
*   Staatusel põhinev filtreerimine/visualiseerimine ja häireprioriteet.
*   “Nähtamatu” staatus kui ligipääsukontrolli erijuht (mitte lihtsalt UI filter) + audit.

10) Valmisoleku / tundlikkuse režiimid (valealarmide juhtimine)
---------------------------------------------------------------

**Punkt:** Tavaolukorras näidata ainult kindlalt tuvastatut; režiimid mõjutavad filtreerimist ja kuvamist; automaatne anomaaliapõhine tundlikkuse tõstmine; manuaalne valmisoleku tase piirkonna/asutuse põhiselt.

Kontseptsioonidokument

**Nõuded:**

*   Konfigureeritavad tundlikkuse profiilid (lävendid, “confidence” tasemed, filtrid) vähemalt piirkonna- või asutuse kaupa.
*   Automaatne režiimitõstmine anomaalia korral (reeglid + põhjendus + tagasi pöördumine).
*   Kõik režiimimuudatused auditeeritavad; operaatorile selgelt nähtav “mis režiim praegu peal”.

* * *

### Üks potentsiaalne lõks / alternatiivvaade

Kui “sensor fusion + filtrid” muutub liiga agressiivseks, võib süsteem anda **liiga puhta, aga eksitava pildi** (oluline toorinfo kaob). Praktiline vastumeede on “privilegeeritud” kasutajatele **forensika-režiim** (toorem jälg/andmekvaliteedi näitajad, miks fusion midagi maha surus) koos rangema auditi ja juurdepääsuga.

## Response:
Thought for 1m 35s

Siin on **veel intervjuust/kontseptsioonist nähtuvad punktid** (detailsemaks lahti pakitud) ja neist tulenevad **täpsemad nõuded infosüsteemile**.

1) Mitme asutuse kasutus ja andmete “segmenteerimine”
-----------------------------------------------------

**Punkt:** süsteem on “ainult seda infot vajavatele asutustele” ning kuvab “rollipõhist olukorrapilti”.

Kontseptsioonidokument

**Nõuded:**

*   Asutuse/organisatsiooni kontekst (kasutaja kuulub asutusse; reeglid sõltuvad asutusest).
*   Andmete eristamine vähemalt **(a)** asutus (tenant), **(b)** piirkond (geo-segment), **(c)** objekti klass (nt “varjatud ala / nähtamatu droon”).
*   Üks ja sama sündmus/track peab suutma olla **eri kasutajatele eri detailsusega** (nt sensorikatvus hägustatud vs täpne vs üldse peidetud).
    Kontseptsioonidokument

2) “Üldpilt” ei ole ainult kaart — see on ka statistika ja agregeeringud
------------------------------------------------------------------------

**Punkt:** üldpildis loendatakse “mitu drooni on Eesti õhuruumis kokku / konkreetses alas jne”.

Kontseptsioonidokument

**Nõuded:**

*   Reaalajas ja ajaloos **agregatsioonipäringud** (count by area, count by time-window, count by status).
*   Kiire georuumi päringumootor + vahemälud (muidu muutub “mitu drooni…” kalliks, eriti ajaloos).
*   Agregeeringute puhul peab kehtima sama ligipääsuloogika (et “varjatud” infot ei lekiks statistika kaudu).
    Kontseptsioonidokument

3) Geopiirid ja “puhvrid” kui esimese taseme kaitse
---------------------------------------------------

**Punkt:** kaitstav ala võib olla mitteavalik ja seda saab kasutada ka “eelhoiatusena piirangualade ümber puhvrina”.

Kontseptsioonidokument

**Nõuded:**

*   Puhvri tekitamine (buffer geometry) ja reeglid: _millal_ tekitatakse, _kui suur_ on, _kellele_ kuvatakse.
*   Geofencing reeglimootor peab toetama erinevaid tsoonitüüpe (piiranguala/õppuseala/kaitstav/varjatud) ning eri tüübi mõju häirele.
    Kontseptsioonidokument

4) Õppuseala = reeglite erand, mitte lihtsalt “ala kaardil”
-----------------------------------------------------------

**Punkt:** õppusealas “MÕS võivad ala sees lennata” (NOTAMi alusel).

Kontseptsioonidokument

**Nõuded:**

*   Erandireeglid: teatud staatustega (nt “sõbralik”, “loaga”) droonid ei tekita häiret õppusealas, teised tekitavad (või tekitavad teise prioriteediga).
    Kontseptsioonidokument
*   Seos drooni staatustega: “loaga” peab olema **tõendatav** (kirje, kehtivusaeg, mille ala jaoks luba kehtib).
    Kontseptsioonidokument

5) Varjatud ala ja “nähtamatu droon” nõuab päris punaseks värvitud reegleid
---------------------------------------------------------------------------

**Punkt:** “varjatud ala” ja “nähtamatu droon” tähendavad, et süsteem _ei kuva_ teatud asju tavakasutajale.

Kontseptsioonidokument

**Nõuded:**

*   Serveripoolne redaktsioon (mitte ainult UI filter): sama päring eri rollile annab eri tulemuse.
*   Audit: iga kord, kui kasutaja vaatab varjatud infot (või proovib), peab see olema logitav.
    Kontseptsioonidokument
*   Kaitse “kaudse lekke” vastu: kaardiloendurid, ajalugu, heatmap’id jne ei tohi paljastada varjatud sündmust olemasolu kaudu.
    Kontseptsioonidokument

6) Staatused = tööprotsess, mitte pelgalt värvikood
---------------------------------------------------

**Punkt:** droonide staatused (neutraalne/loaga/sõbralik/uus/kahtlane/vaenulikkuse kahtlus/vaenulik/nähtamatu) ja küsimus “kelle määrata?”.

Kontseptsioonidokument

**Nõuded:**

*   Staatuse muutmise õigused (kes tohib mis tasemeid panna) + põhjendus/kommentaar.
*   Staatuse ajaloo säilitamine (millal muutus, kes muutis, mille alusel).
*   “Uus droon” eeldab reeglit “first seen in EE / first seen in system” + ajapiir (nt X päeva jooksul).
    Kontseptsioonidokument

7) Tundlikkusrežiimid: “tavaolukord vs kriis” peab olema konfigureeritav
------------------------------------------------------------------------

**Punkt:** režiimid mõjutavad usalduslävendeid ja filtreerimist; automaatne anomaalia korral tõstmine; manuaalne seadmine piirkonna/asutuse kaupa.

Kontseptsioonidokument

**Nõuded:**

*   Konfiguratsiooniprofiilid (lävendid, filtrid, prioriteedid) vähemalt **piirkond × asutus** lõikes.
*   Automaatse tõstmise loogika (anomaalia definitsioon, kestus, tagasipöördumine, logimine).
*   Operaatorile nähtav “miks mul nüüd rohkem objekte tuleb” (põhjenduse jälg).
    Kontseptsioonidokument

8) Teavitused: mitte ainult “üks alarm”, vaid kanalid ja taustatöö
------------------------------------------------------------------

**Punkt:** teavitused geopiiri rikkumisel, kasutaja offline, sensori rike; mobiilis taustal töötav “Sinu lähedal on droon”.

Kontseptsioonidokument

**Nõuded:**

*   Teavituste kanalid: veeb UI (in-app), mobiili push, (vajadusel) e-post/SMS/integreeritud kanal — koos seadistustega.
*   Prioriteedid ja eskalatsioon (kui offline/sensori rike kestab X min, teavita teist rolli).
*   Mobiilis taustateavituste töökindlus (lubade haldus, geolocation taustal, aku-säästu erandid).
    Kontseptsioonidokument

9) Planeerimine: teekond + katvus = georuumi analüüs
----------------------------------------------------

**Punkt:** planeerimisvaade isikukaitse teekondade planeerimiseks ja katvuse/andmete hägustatud kuvamiseks; võimalik katvuse indikatsioon “kas kaetud alas”.

Kontseptsioonidokument

**Nõuded:**

*   Teekonna objekt (route) + ajastus (millal liigutakse) + riskihinnang (kas teekond läbib katmata osi).
*   Katvuse andmemudel (millise sensori katvus, millise detailsusega, millal kehtib).
*   “Kaetus” kui lihtne boolean/klass (kaetud/katmata/ebakindel) kasutajale, kellel ei tohi näha sensori detaile.
    Kontseptsioonidokument

* * *

### Üks potentsiaalne lõks / alternatiivvaade

“Varjatud/nähtamatu” ja “hägustatud katvus” tunduvad intuitiivselt lihtsad, aga kõige sagedasem läbikukkumine on **lekke teke kaudsete signaalide kaudu** (nt loendurid, ajaloograafikud, “anomaalia tõttu režiim tõusis” jms). Kui see kontrollimata jääb, saavad tavakasutajad “tõde” ära arvata isegi siis, kui kaart on tühi.

Kontseptsioonidokument

## Response:
Thought for 1m 5s

Jätkan sama kontseptsioonidokumendi põhjal – siit tulevad **veel “varjatud” nõuded**, mis on tekstis pigem _implitsiitsed_ (st ilma nendeta kirjeldatud funktsioonid ei tööta või jäävad ohtlikult udusteks).

11) Ajalugu + hilisem analüüs = säilitus, otsing, taasesitus
------------------------------------------------------------

**Punkt:** süsteem koondab reaalaja- ja ajalooinfo ning peab toetama “sündmuste hilisemat analüüsi” ja “mineviku häirete ajalugu koos info sirvimise võimalusega”.

Kontseptsioonidokument

**Nõuded:**

*   Andmete säilituspoliitika (kui kaua hoitakse: toorandmeid / fuse’itud track’e / häireid / auditit).
*   Ajaloo “sirvimine” tähendab praktikas: ajaakna filter, otsing, sündmuste drill-down, eksport (raport/juhtumi kokkuvõte).
*   Taasesitus (“replay”) vähemalt kaardil ajaliuguriga: mida operaator nägi häire hetkel.

12) Häirete käsitlus = päris “incident workflow”
------------------------------------------------

**Punkt:** “Operaator reageerib häirele.”

Kontseptsioonidokument

**Nõuded:**

*   Häire/intsidendi olekumasin: _uus → töös → eskaleeritud → suletud_ + põhjendus/kommentaar.
*   Ülesande/omaniku määramine (kes tegeleb), tegevuste logi, manused/viited (nt väliraport, pildid).
*   “Miks see häire tekkis?” selgitus: milline reegel/geopiir, milline usalduslävi/režiim, millised sensorid panustasid.

13) Online/offline teavitus = kohaloleku- ja ühendusemõõdikud
-------------------------------------------------------------

**Punkt:** “Teavitus ühenduse katkemise korral serveriga (kasutaja ei ole enam online).”

Kontseptsioonidokument

**Nõuded:**

*   Presence/heartbeat mehhanism (kasutaja sessioon elus, viimase kontakti aeg).
*   Offline teavituse sihtimine (kellele teavitatakse, kui konkreetne kasutaja/roll kaob).
*   UI-s “degrade gracefully”: kui ühendus halb, siis selge indikaator + piiratud funktsionaalsus.

14) Sensori rike = kvaliteedihaldus, mitte ainult “on/off”
----------------------------------------------------------

**Punkt:** “Teavitus sensori rikke korral (pilt/andmevoog ei vasta).”

Kontseptsioonidokument

**Nõuded:**

*   Sensorite kvaliteedimõõdikud: viivitus, kaadrisagedus/sõnumisagedus, kaotus, valepositiivsete määr, “stale data”.
*   Rikke klassid (maas / degrade / valeandmed) ja eri käsitlus (häire vs hoiatus vs ainult logi).
*   Hooldus-/admin-vaade sensorite tervisest ja ajaloost.

15) “Varjamine” ja “hägustamine” tähendab andmeklassi poliitikat
----------------------------------------------------------------

**Punkt:** sensorite asukohti/katvust saab varjata; erivajadustel hägustatud katvuskaardid teadmisvajaduse põhiselt.

Kontseptsioonidokument

**Nõuded:**

*   Andmeobjektidel klassifikatsioon/metasildid (nt _avalik / piiratud / salastatud_ või sisemine ekvivalent).
*   Sama objektist mitu representatsiooni (täpne vs generaliseeritud geomeetria), valik serveripoolel rolli/atribuutide järgi.
*   Testid “lekkekanalite” vastu: loendurid, heatmap’id, ekspordid, API vastused ei tohi kaudselt reeta varjatut.

16) NOTAM/AIP + kasutaja-alad = ühtne “Area” mudel ja prioriteedid
------------------------------------------------------------------

**Punkt:** alade tüübid (piiranguala NOTAM/AIP, õppuseala NOTAMi alusel, kaitstav ala, varjatud ala).

Kontseptsioonidokument

**Nõuded:**

*   Ühtne alade skeem: geomeetria + kehtivusaeg + kõrgusvahemik + allikas + omanik/asutus.
*   Prioriteedireeglid kattuvatel aladel (nt varjatud ala > kaitstav ala > piiranguala).
*   Õppuseala kui erandiloogika (kes/ mis staatused on lubatud sees).
    Kontseptsioonidokument

17) “Loaga” staatus eeldab loahaldust, muidu on see lihtsalt tunne
------------------------------------------------------------------

**Punkt:** “Loaga: droon, millel on registreeritud eriluba piirangualas lendamiseks.”

Kontseptsioonidokument

**Nõuded:**

*   Loa kirje: kellele (droon/omanik), kus (ala), millal (kehtivus), mis tingimustel.
*   Seos reeglimootoriga: loa olemasolu mõjutab häire tekkimist/priority’t, eriti piirangualas.
    Kontseptsioonidokument
*   Audit: kes sisestas/ kinnitas loa.

18) Staatuste süsteem = õigused + jälgitav otsus
------------------------------------------------

**Punkt:** staatused sh “vaenulikkuse kahtlus (kelle määrata?)”, “vaenulik (kinnitatud)”, “nähtamatu (ei kuvata)”.

Kontseptsioonidokument

**Nõuded:**

*   Staatuse muutmise õigused ja protsess (kinnitamised, 4-silma printsiip kriitilistel staatustel).
*   Staatuse muutmise põhjendus + ajalugu + võimalus vaidlustada/rollback.
*   “Nähtamatu” peab olema ligipääsureegel, mitte UI filter (muidu lekib API kaudu).

19) Valmisolekurežiimid = “operatiivne konfiguratsioon” koos põhjendusega
-------------------------------------------------------------------------

**Punkt:** režiimid reguleerivad usaldusläve, filtreerimise tugevust; automaatne anomaaliapõhine tõstmine; manuaalne seadmine piirkonna/asutuse põhiselt.

Kontseptsioonidokument

**Nõuded:**

*   Režiimiprofiilide haldus (kes tohib muuta; millised parameetrid; millal jõustub).
*   Automaatse tõstmise logi: anomaalia signaal, kestus, millal taastati, mis mõju oli.
*   Operaatori nähtav “miks nüüd pilt muutus” (vastasel juhul tekib usalduskriis).

20) Mobiil “taustal” + dünaamiline kaitseala = energiapoliitika ja reeglid
--------------------------------------------------------------------------

**Punkt:** mobiilirakendus, kaasaliikuv kaitstav ala; patrullidel taustal teavitus “Sinu lähedal on droon”; võimalik katvuse indikatsioon.

Kontseptsioonidokument

Kontseptsioonidokument

**Nõuded:**

*   Taustateavituste töökindlus (lubade/OS piirangute arvestus, aku-säästurežiimid).
*   “Lähedal” definitsioon (kaugus, ajaline aken, staatuste filtrid, prioriteedid).
*   Katvuse indikatsioon peab austama hägustamist/varjamist (näita “kaetud/katmata/ebakindel”, mitte “millise sensoriga”).

* * *

### Üks potentsiaalne lõks / alternatiivvaade

Kontseptsioon rõhutab tugevalt “filtreeritud ja rollipõhist pilti” ning “valehäirete vähendamist”.

Kontseptsioonidokument

Kontseptsioonidokument

Devil’s advocate: liiga agressiivne filtreerimine + automaatne režiimivahetus võib muuta süsteemi “liiga targaks omaenda heaks” — operaator ei saa aru, mis kadus ja miks. Praktiline vasturohi on _forensika-režiim_ (toorem vaade + põhjenduslogi) rangete õigustega ja auditeeritult.



---
Powered by [ChatGPT Exporter](https://www.chatgptexporter.com)