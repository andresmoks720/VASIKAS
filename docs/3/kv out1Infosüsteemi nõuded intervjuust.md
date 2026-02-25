# Infosüsteemi nõuded intervjuust

**User:** Andres Moks (andres.moks@gmail.com)  
**Created:** 2/25/2026 22:48:01  
**Updated:** 2/25/2026 23:24:10  
**Exported:** 2/25/2026 23:25:31  
**Link:** [https://chatgpt.com/g/g-p-698b7a30d6848191bacb8cff5277cb17-intekad/c/699f5fef-1d8c-8387-869e-8f40770af2d6](https://chatgpt.com/g/g-p-698b7a30d6848191bacb8cff5277cb17-intekad/c/699f5fef-1d8c-8387-869e-8f40770af2d6)  

## Prompt:
kv1.wav.trs

File

kasutades lisatud kontseptsioonidokumenti, too välja kõik SELLE intervjuu olulised punktid - millest tulenevad (tulevased) nõuded infosüsteemile.

## Response:
Thought for 12m 39s

Allpool on selle intervjuu sisulised “ankurpunktid” ja neist tulenevad (tulevased) infosüsteemi nõuded, seotuna kontseptsioonis kirjeldatud suunaga (rollipõhine olukorrapilt, sensor-fusion, häired, audit jne).

Kontseptsioonidokument

1) Ligipääs, salastatus, audit ja “kill-switch”
-----------------------------------------------

*   Intervjuus rõhutati, et sama situatsioonipilti ei tohi kõik näha: erinevad asutused/üksused (sh KAPO-laadsed) tahavad teha alasid/vaateid, mida teised ei näe; info ei ole avalik (nt “ERR-is ei näita”), ning lekkimise korral peab saama kiiresti ahela “kinni keerata” ja tuvastada, kes infot tarbis.
    *   **Nõue:** peeneteraline õiguste mudel (ABAC/RBAC + geograafiline segmenteerimine + “need-to-know”), sh varjatud alad/objektid/andmeväljad, ning rollipõhised vaated (nt patrull näeb vaid oma “mulli”).
        Kontseptsioonidokument
    *   **Nõue:** täielik auditirada: kes nägi millist intsidenti, millal, mis seadmest/sessioonist; sidumine vahetuse/valvekorra ja kasutajaga (mitte tingimata isikukoodiga, aga üheselt seostatav).
        Kontseptsioonidokument
    *   **Nõue:** kiire õiguste revokatsioon / ligipääsu katkestamine (ahela “kill-switch”), sh tarbija tasemel (kui lekkekoht on lõpus).
*   Intervjuus tuli selgelt välja, et **salajase info töötlemine ei saa toimuda “avalikus” kihis**; räägiti füüsiliselt eraldatud süsteemidest ning cross-domain lahendusest, mis laseb protokolli tasemel läbi ainult lubatud väljad.
    *   **Nõue:** arhitektuuriline eraldus avaliku vs piiratud/salajase töötluse vahel (eraldi tsoonid/keskkonnad; selge “trust boundary”).
        Kontseptsioonidokument
    *   **Nõue:** cross-domain gateway/guard: protokollipõhine filtreerimine (lubatud väljad/teated), et “kõrgelt madalamale” ei lekiks salajast.

2) Andmetooted (raw vs töödeldud), kvaliteedimetad, latentsusklassid
--------------------------------------------------------------------

*   Intervjuus kirjeldati, et “kogu ahel” (sensor → töötlus → C2/relvasüsteem) toimib **kvaliteedilävendite** peal: sensoril track quality, lõpus relvasüsteemil miinimumlävend; tihti kinnitatakse oma radariga üle.
    *   **Nõue:** igale jäljele/objektile kvaliteedi- ja usaldusväärsuse metainfo (track quality, confidence, allikad, vanus/staleness).
    *   **Nõue:** otsustus- ja töövoogudes tuleb toetada “kinnitamise” samme (nt enne kui info jõuab reageerijale).
*   Intervjuus rõhutati, et sama infot tuleb eri tarbijatele anda **eri töötlusega**: toor (mürane) vs identifitseeritud/valideeritud pilt.
    *   **Nõue:** mitu andmevoogu/“toru” (raw vs filtered vs validated), sh samast sündmusest erineva detailsuse/latentsusega väljund.
        Kontseptsioonidokument
*   Intervjuus toodi eraldi välja **latentsuse juhtimine**: patrullile antakse teadlikult töödeldum (ja seetõttu viitega) info, et vältida infouputust; Narva näites “ei näita enne, kui on komplekt infot, millele saab reageerida”.
    *   **Nõue:** latentsusklassid ja infolävendid tarbija rolli järgi (nt “häire ainult siis, kui reageeritav”).
    *   **Nõue:** UI/teavituste poolel “info-overload” kaitse (summariseerimine, prioriteedid, vaikimisi filtrid).
        Kontseptsioonidokument

3) Standardid, formaadid ja olemasolevate tööriistadega ühilduvus
-----------------------------------------------------------------

*   Intervjuus räägiti formaatidest ja infovahetusnõuetest, sh mainiti **ASTERIX** (toor/standardne radarijälg) ning identifitseeritud pildis lisanduvaid “Link 16 track” tüüpi elemente.
    *   **Nõue:** liidestuskiht, mis suudab vastu võtta/väljastada standardformaate (vähemalt ASTERIX-laadne “toorvoog” + identifitseeritud pilt).
    *   **Nõue:** formaadiversioonide ja semantika haldus (et “sama keel” oleks mõlemas otsas).
*   Intervjuus rõhutati “ära ehita 20M eest kehvemat koopiat”: vaadata olemasolevaid tööriistu (mainiti TAK/ATAK-laadset maailma) ja panna “lisaasjad” nendega rääkima.
    *   **Nõue:** integreerumine olemasolevate taktikaliste/operatiivsete klientidega (nt TAK-ökosüsteem), või vähemalt eksport/import, et mitte lukustuda ühe UI külge.
*   Intervjuus mainiti, et osa “torusid” on juba SMITi kaudu teostamisel/lepete tegemisel.
    *   **Nõue:** arvestada olemasolevate riigisiseste integratsioonikanalitega (mitte dubleerida; liidestus peab sobituma).

4) Sensor-fusion, signaalitöötlus, AI abimehena (mitte “üksainus tõde”)
-----------------------------------------------------------------------

*   Intervjuus rõhutati, et päris väärtus tuleb tarkvaralisest signaalitöötlusest/mürafiltrist: osa sensoreid on “liiga tuimad” (vähe valepositiivseid, aga ka vähe kasulikku), osa ujutab operaatori üle.
    *   **Nõue:** keskne “fusion + filtering” pipeline, mis vähendab valepositiivseid ja tõstab reageeritavaid jälgi esile.
        Kontseptsioonidokument
    *   **Nõue:** tundlikkuse/valmisoleku režiimid (automaatne + manuaalne), et kriisis tõsta tundlikkust ning tavaolukorras operaatorit säästa.
        Kontseptsioonidokument
*   Intervjuus kirjeldati AI rolli väga konkreetselt: AI aitab prioriseerida ja klassifitseerida (“see on müra” vs “tuleb kolmest kohast”), aga **ainult AI väitest ei piisa** – vaja ristkinnitust.
    *   **Nõue:** AI/ML moodul on “decision support”, mitte otsustaja: väljund peab kandma confidence’i, allikaid ja põhjenduse/feature-tüüpi indikaatoreid; C2 otsus vajab kinnitusi.
    *   **Nõue:** multi-sensor kinnituse loogika (nt N-of-M reegel / kvalitatiivne konsensus).
*   Intervjuus tehti vahe aktiiv- ja passiivsensoritel: nende jäljed ei ole “kunagi sama”, kokkuviimine on teoreetiline, kuid sageli ebaotstarbekas; Remote ID/passiivne info pigem identifitseerimiseks, mitte leidmiseks.
    *   **Nõue:** fusion peab säilitama allikaliigid ja mitte “sunniviisiliselt” liitma ebakõlaliselt; UI peab näitama, mis on tuvastus vs identifitseeriv lisainfo.

5) Operatiivne töövoog: kinnitamine → otsus → tasking → järelanalüüs
--------------------------------------------------------------------

*   Intervjuus kirjeldati C2 sisulist definitsiooni: geo-interface, kuhu tuleb usaldusväärne info, see kinnitatakse, tehakse otsus ning antakse ülesanne mõjutus-/relvasüsteemile.
    *   **Nõue:** töövood/olekud “track → kinnitatud → otsustatud → taskitud → lõpetatud”, sh rollid (kes kinnitab, kes käsib).
*   Intervjuus tuli sisse ka järelanalüüs: relvasüsteemide kasutuse analüüs (kus/kunas droon “alla võeti”, mis meetmega).
    *   **Nõue:** sündmuste ajalugu + after-action review (AAR): ajajoon, logid, otsused, kasutatud meetmed, tulemus.
        Kontseptsioonidokument

6) Mitme domeeni ja “common operational picture” (mitte ainult droonid)
-----------------------------------------------------------------------

*   Intervjuus toodi riskina välja, et poliitiline/juhtkonna vaade võib olla “ilus droonipilt”, aga tegelikuks juhtimiseks on vaja näha ka maapealseid üksusi, laevu, koptereid, PPA/kiirabi/pääste asukohti – vähemalt lähima abi leidmiseks.
    *   **Nõue:** laiendatav andmemudel (mitte hardcode “ainult droon”), mis toetab teiste objektitüüpide kihte ja ühispilti (mõnes rollis/vaates).
    *   **Nõue:** “lokaalne mull” vs “koondülevaade”: strateegiline pilt on kõrgema taseme/klassiga; üksik võitleja/patrull näeb ainult oma ümbrust.
        Kontseptsioonidokument

7) Väline ökosüsteem: tsiviilsektor, infrastruktuur ja custom-integratsioonid
-----------------------------------------------------------------------------

*   Intervjuus rõhutati, et siht ei ole ainult jõuametid: eesmärk katab tsiviilsektori ja ministeeriumid; näiteks Elering tahab panna oma seireseadmed ja ligi pääseda oma pildile läbi selle süsteemi; “tramm” tahab andmeid edasi töödelda; sadam/Elering/tramm võivad vajada erilahendusi (nt trahvimine).
    *   **Nõue:** “partnerite integratsiooniplatvorm”: välistele osapooltele eraldatud ja rangelt piiritletud API/andmeekspordi mudel + lepinguline/tehniline governance.
    *   **Nõue:** plugin-/connector-arhitektuur, et custom-arendused ei sunniks kogu salajase kihi ümberakrediteerimist iga muutusega (selge eraldus, mis kuulub auditeeritava/sertifitseeritava “core” alla).
*   Intervjuus oli fookus ka osapoolte kaasamisel (häirekeskus, Päästeamet jne) ja sellel, et paljud ei saa veel aru, et nad “tahavad seda”.
    *   **Nõue:** kasutajagruppide ja kasutusjuhtude kaardistus + vajaduste prioriseerimine (MVP vs hilisemad liidestused).
        Kontseptsioonidokument

8) Sertifitseerimine/akrediteerimine ja arendusstrateegia (reaalsuskontroll)
----------------------------------------------------------------------------

*   Intervjuus rõhutati NATO security baseline’i: kui C2/platvorm ei vasta, siis tundlikumat pilti ei saa jagada isegi geograafiliselt filtreeritult; “põlve otsas” lahendusi Eesti hindamisvõimekus ei pruugi sertifitseerida (pikk protsess).
    *   **Nõue:** turvanõuete ja akrediteerimise käsitlus juba arhitektuuris (klassifikatsioonitsoonid, admin-kontrollid, turvaruumid, tööprotsessid).
    *   **Nõue:** ajakava- ja riskiplaan akrediteerimise jaoks (sest see mõjutab, mida saab kellele näidata).
*   Intervjuus anti ka hoiatus AI ambitsiooni kohta: “päris produktini jõudmine” võib võtta 10–25 aastat.
    *   **Nõue:** AI osa tuleb piiritleda (otsustustoetus konkreetsetes kohtades), mõõdikud ja etapiline kasutuselevõtt (mitte “täisautonoomne tuvastus”).

9) Töökindlus ja võrgu katkestused
----------------------------------

*   Intervjuus küsiti otseselt, kuidas mõelda arhitektuurist nii, et võrgu katkestuse korral “segmenteeritud osa töötaks omaette”.
    *   **Nõue:** degradeerunud režiimid ja lokaalne jätkusuutlikkus (cache, store-and-forward, “viimane teadaolev pilt”, hilisem sünk).
    *   **Nõue:** monitooring + teavitused ühenduse/süsteemiosa katkemisest.
        Kontseptsioonidokument

* * *

### Üks komistuskivi / alternatiivvaade

Kõige riskantsem tee on proovida ehitada “üks monoliit”, mis korraga teenindab tsiviili, salajast, välispartnereid ja pidevalt muutuvaid custom-integreerimisi: akrediteerimise ulatus paisub, muutuste kiirus kukub ja lõpuks saad kas aeglase arenduse või turvaaukudega kompromissi. Praktilisem on defineerida väike, stabiilne ja sertifitseeritav “core” (fusion + õigused + audit + standardväljundid) ning hoida partneri-/avaliku-/eksperimenteeriva AI kihi muutused sellest rangelt eraldatuna.

Kontseptsioonidokument

## Prompt:
kv1.wav.trs

File

jätka!

## Response:
Thought for 5m 13s

Jätkan intervjuust välja tulevate **lisapunktidega**, mis tõlgituna annavad üsna konkreetsed süsteeminõuded.

10) “Toru” vs “üks ja sama süsteem” – kaks kasutusmudelit korraga
-----------------------------------------------------------------

Intervjuus eristati:

*   **otse-andmevoog (“toru”)** teise süsteemi/C2 jaoks (nt kui keegi tahab oma UI/loogika peale ehitada),
*   **sama tarkvara kasutamine** rollipõhiste vaadetega (üks “COP”, erinevad õigused).

**Nõue:** sama andmestik peab olema tarbitav nii **API/stream** kujul kui ka **valmis operatiiv-UI** kujul (ja need ei tohi teineteist lõhkuda). See sobitub kontsepti “üks pilt, rollipõhine filtreerimine” loogikaga.

Kontseptsioonidokument

11) Formaadi kihid: toor (mürane) vs identifitseeritud (valideeritud) pilt
--------------------------------------------------------------------------

Intervjuus öeldi otse, et **toorvoog** sisaldab palju müra (kõik “kured ja varesed”), samas **identifitseeritud jälg** on juba valideeritud (nt “vaenulik jälg”).

**Nõue:** andmeproduktide kihistus:

*   **raw stream** (maksimaalne detailsus, müra sees),
*   **filtered/curated stream** (operaatori säästmiseks),
*   **validated/identified stream** (reageerijale / mõjutajale).

Kontseptis on see mõte juba sees “sensor fusion vähendab valepositiivseid” ja “kasutajale filtreeritud rollipilt”.

12) Ühine “track ID” ja kahepoolne suhtlus (sh tasking/mõjutajad)
-----------------------------------------------------------------

Intervjuus rõhutati, et kui mitu osapoolt räägivad “samast jäljest”, peab olema:

*   ühtne jälje identiteet/number,
*   **kahepoolne** infovahetus (mitte ainult “me anname teile pildi”).

**Nõue:** standardiseeritud **track identity** (unikaalne ID, ajalugu, allikad) + liidesed, mis võimaldavad:

*   anda jälg edasi,
*   **tagasi raporteerida** (kinnitatud / mõjutatud / tulem).

13) Lõppkliendid (TAK/ATAK/Apollo jne) kui “ahela lõpp” ja lekkekontroll
------------------------------------------------------------------------

Intervjuus toodi välja, et ahela lõpus võivad olla välised kliendid (TAK/ATAK-tüüpi kasutajad, patrulliplatvorm “Apollo” jms) ning kui sealt lekib, peab saama kiiresti:

*   tuvastada kes/vahetus/sessioon,
*   ligipääs sulgeda.

**Nõue:** “chain-of-custody” kuni lõppkliendini:

*   sessioonipõhine audit (kes oli konsooli taga / mis vahetus),
*   tarbija-põhine revokatsioon (lõikad maha konkreetse kliendi/instantsi),
*   minimaalne “field view” (patrullile ainult vajalik mull, mitte kogu COP).

Kontseptsioonis on rollipõhisus + auditeeritavus juba kirjas.

Kontseptsioonidokument

Kontseptsioonis on ka patrulli/“Apollo” teavituse mõte (taustal hoiatus).

Kontseptsioonidokument

14) Ohuteavitus (elanikkonnale) kui eraldi väljund
--------------------------------------------------

Intervjuus käis läbi kasutusjuht: “riiki sisenevad droonid” ja õhuväe käivitatav elanikkonna ohuteavitus.

**Nõue:** süsteemil peab olema **teavitus-triiger** (tingimused + kinnitustase), mida saab suunata:

*   ohuteavituse kanalisse,
*   kriisijuhtimise töövoogu,
*   (vajadusel) ainult teatud klassifikatsioonitasemel.

15) “Allakukutamise alad” ja vastumeetmete geopiirangud (eriti linnas)
----------------------------------------------------------------------

Intervjuus tuli praktiline teema: eri osapooled (nt kriitilise infra omanik) võivad tahta “midagi alla kukutada”, aga **Tallinna kesklinnas** see pole niisama lubatav.

**Nõue:** georuumiline mudel **mõjutus-/neutraliseerimispiirangutele**:

*   lubatud/keelatud mõjutusalad,
*   ohutsooni arvestus (tiheasustus, kriitiline infra, rahvamass),
*   osapoolte kaupa erinevad reeglid/õigused (kes üldse tohib, millal, mis meetmega).

16) Mitme domeeni laienemine (maa/meri/õhk) ja uued sensorid
------------------------------------------------------------

Intervjuus kirjeldati paralleelset suunda: maadomeen/meredomeen/õhudomeen, lisaks sensorvõrk (kaamerad, mikrofonid jne) ja AI kui operaatori abimees.

**Nõue:** andmemudel + ingestikiht peab olema laiendatav:

*   uus sensoritüüp = uus connector + ühtne event/track skeem,
*   domeenikihtide kuvamine (nt mereobjektid, maapealsed üksused) ilma et “ainult droon” oleks hardcode.

17) “Ära ehita 20M eest kehvemat koopiat” → integratsioon esimesena, mitte custom UI
------------------------------------------------------------------------------------

Intervjuus anti üsna karm õppetund: suured projektid võivad minna “prügikasti”, ning mõistlik on kasutada olemasolevaid tööriistu ja lisada sinna puuduolevad tükid.

**Nõue:** eelistada **konfiguratsiooni ja integratsioone** (andmelepingud, adapterid, õigused, audit) vs “kõik nullist UI-s”.  
See klapib kontsepti mõttega, et süsteem koondab ja vahendab, mitte ei ole ainus tarbimisviis.

Kontseptsioonidokument

18) Võrgu katkestus ja segmenteeritud töö
-----------------------------------------

Intervjuus küsiti otse: kuidas mõelda nii, et võrgu katkemisel “segmenteeritud osa” töötaks edasi (eriti tsiviilpoolel).

**Nõue:** partition-tolerant disain:

*   lokaalne cache + store-and-forward,
*   selge “degraded mode” UI-s,
*   sündmuste hilisem sünkroniseerimine.

Kontseptsioonis on juba teavitused ühenduse/sensori rikke korral.

* * *

### Üks komistuskivi / alternatiivvaade

Kui püüad sama tuuma sisse mahutada **nii tsiviiltrahvid, ohuteavituse, salajase C2, partnerite custom-integratsioonid kui ka AI eksperimendid**, siis akrediteerimis- ja muutmistsükkel muutub ise süsteemi suurimaks vaenlaseks. Praktilisem on hoida “core” kitsas (track+õigused+audit+väljastuslepingud) ning kõik erilahendused plugin- või eraldatud tarbijakihtides.

## Prompt:
kv1.wav (1).trs

File

jätka

## Response:
Thought for 1m 56s

19) Alade haldus kui “operatiivse tõe” kiht (mitte ainult taustakaart)
----------------------------------------------------------------------

Kontseptsioonis on alad jagatud eri tähendustega tüüpideks (piiranguala/õppuseala/kaitstav ala/varjatud ala). Sellest tuleneb, et “ala” pole lihtsalt polygon, vaid reeglite ja nähtavuse kandja.

Kontseptsioonidokument

**Nõuded:**

*   Ala tüübi järgi erinev päritolu:
    *   **Piiranguala** tuleb automaatselt NOTAM/AIP-ist ja on avalik teadmus.
        Kontseptsioonidokument
    *   **Kaitstav ala** on kasutajapõhine häireala ja võib olla mitteavalik (nt VIP/objektikaitse).
        Kontseptsioonidokument
    *   **Varjatud ala** on “tsoon, mida tavakasutajale ei kuvata” (mitte ainult peidetud polygon, vaid peidetud sündmused).
        Kontseptsioonidokument
*   Alal peab olema **nähtavus- ja jagamisreeglid** (kellele kuvatakse geomeetria, kellele ainult häire/indikaator).
*   Kaitstava ala puhul peab olema toetatud **puhver/geofencing eelhoiatus** piirangualade ümber (kontseptsioonis mainitud).
    Kontseptsioonidokument

20) Droonide staatused = otsustusloogika ja auditit vajav olekumasin
--------------------------------------------------------------------

Kontseptsioon loetleb staatuste komplekti (“neutraalne”, “loaga”, “sõbralik”, “uus droon”, “kahtlane”, “vaenulikkuse kahtlus”, “vaenulik”, “nähtamatu”). See tähendab, et infosüsteem peab toetama olekumuutuste reegleid ja käsitsi märgistamist, mitte ainult “track”-e kuvada.

Kontseptsioonidokument

**Nõuded:**

*   Staatuse päritolu peab olema eristatav:
    *   automaatne (reeglid/AI/heuristikad) vs käsitsi (volitatud kasutaja).
*   Iga olekumuutus peab jätma **põhjenduse/kommentaari + auditlogi** (kes pani “vaenulikuks”, mis alusel).
    Kontseptsioonidokument
*   “Nähtamatu” staatus tähendab sisuliselt **filtreerimisreeglit** (“süsteem kasutajatele ei kuva”), seega peab olema rollipõhine filter, mitte “kustutamine”.
    Kontseptsioonidokument

21) Valmisoleku režiimid (tundlikkuse juhtimine) piirkonna/asutuse lõikes
-------------------------------------------------------------------------

Kontseptsioon kirjeldab, et valehäireid on palju ja vaja on tundlikkuse režiime (automaatne + manuaalne), mis muudavad kuvamist, filtreid ja usalduslävendeid.

Kontseptsioonidokument

**Nõuded:**

*   Režiim peab mõjutama vähemalt:
    *   mis lävendist objekt “läheb nähtavaks”,
    *   kui agressiivselt toorandmeid filtreeritakse,
    *   häirete tihedust (operaatori koormuse juhtimine).
        Kontseptsioonidokument
*   Režiimi ulatus peab olema seadistatav **piirkonna või asutuse põhiselt** (kontseptsioon jätab selle lahtiseks, aga see on nõude sisuline haru).
    Kontseptsioonidokument
*   Automaatrežiimis peab olema “anomaalia → ajutine tõstmine” loogika (ja selle audit).
    Kontseptsioonidokument

22) Sensorikatvuse planeerimine ja “hägustatud katvus”
------------------------------------------------------

Kontseptsioonis on eraldi planeerimisvaade: katvusalad (vajadusel hägustatud), sensorite asukohti/katvusi saab varjata ning isegi “kas kasutaja on katvuses” indikaator on ideena sees.

**Nõuded:**

*   Kaardil peab olema katvuse visualiseerimine vähemalt 2 režiimis:
    *   täpne (volitatud rollidele),
    *   hägustatud/abstraktne (teadmisvajaduse põhiselt).
        Kontseptsioonidokument
*   Katvuse indikaator kasutajale (“olen kaetud / pole kaetud”) ilma, et avaldaks sensori täpset asukohta.
    Kontseptsioonidokument

23) Mobiilne häirerakendus ja “kaasaliikuv kaitstav ala”
--------------------------------------------------------

Kontseptsioonis on mobiilne osa: kasutaja saab luua enda ümber dünaamilise kaitstava ala, ning isikukaitsel hoiatatakse nii lähedal oleva drooni kui ka planeeritud teekonna riskide eest; eraldi on toodud patrullide taustateavitus (Apollo).

**Nõuded:**

*   Mobiilikasutaja “kaitstav ala” peab liikuma (geofencing reaalajas).
*   Toetada kahte häireloogikat:
    *   “droon minu lähedal”,
    *   “droon minu planeeritud teekonnal”.
*   Teavitused peavad töötama **taustal** (patrulli/field-use case).
    Kontseptsioonidokument

24) Töökindluse teavitused: server offline ja sensori rike
----------------------------------------------------------

Kontseptsioonis on kaks konkreetset teavitust: serveri ühenduse katkemine ja sensori rike (pilt/voog ei vasta), lisaks häirete ajalugu ja operaatori reageerimine.

**Nõuded:**

*   Health/heartbeat mehhanism:
    *   serveri “online/offline” seis (kasutajale teavitus),
    *   sensori voogude kvaliteedikontroll (rikke teavitus).
        Kontseptsioonidokument
*   Häirete ajalugu peab säilitama nii sündmused kui ka reageerimise jälje (kes reageeris, mis otsus).
    Kontseptsioonidokument

* * *

### Üks komistuskivi / alternatiivvaade

Kui “staatused”, “valmisolekurežiimid” ja “nähtamatus” tehakse ainult UI-filtritena (ilma formaalse olekumasinata, põhjendusteta ja auditita), siis tekib väga kiiresti olukord, kus kaks asutust näevad sama track’i eri tähendusega ja hiljem pole võimalik tõendada, miks otsus sündis. Kontseptsioon ise juba vihjab, et auditeeritavus on tuum-nõue, mitte “nice-to-have”.

Kontseptsioonidokument

## Prompt:
kv2.wav.trs

File

siin veel midagi olulist täiendama?

## Response:
Thought for 1m 22s

Jah — praeguse “pildi” kõrvale tasub lisada mõned **päris-kriitilised**, aga kontseptsioonis veel implicit/õrnalt mainitud (või intervjuust loogiliselt järgnevad) nõuded. Need on need kohad, kus projektid tavaliselt “komistavad”.

1) Häire vs intsident vs juhtum ja olekumasin
---------------------------------------------

Kontseptsioon ütleb “asutus saab häire”, “operaator reageerib”, ning “häirete ajalugu” , aga tasub ära fikseerida:

*   **häire** (trigger) ≠ **intsident/juhtum** (kestab, uuritakse, seotakse artefaktid) ≠ **ülesanne** (tasking).
*   intsidentide olekud (uus → kinnitamisel → aktiivne → lahendatud → suletud) + kes tohib mida muuta (auditiga).
    Kontseptsioonidokument

2) Andmete päritolu, “tõendipakk” ja hilisem analüüs
----------------------------------------------------

Kontseptsioon lubab “ajalooinfo” ja “sündmuste hilisem analüüs”

Kontseptsioonidokument

— see eeldab:

*   igale track’ile/otsusele **provenance**: millised sensorid, mis ajaaknas, mis filtritega.
*   AAR (“after-action review”) vaade: timeline + otsused + olekumuutused + seotud failid (pildid, logid, rapordid).
*   ekspordi nõue (PDF/JSON) ja “case package” allkirjastatav/immutav, kui see läheb menetlusse.

3) Säilituspoliitika ja kustutamine (retention)
-----------------------------------------------

Kui salvestad “reaalaja- ja ajalooinfo”

Kontseptsioonidokument

, pead enne arendust lukku panema:

*   säilitustähtajad (raw vs töödeldud vs auditlogid vs teavitused),
*   kustutamise reeglid ja “legal hold” (juhtumi puhul peatad kustutamise),
*   logide tervikluse nõuded (immutability/WORM vs tavaline log).
    Kontseptsioonidokument

4) Identiteet ja kasutajahaldus: roll + atribuudid + geosegmendid
-----------------------------------------------------------------

Kontseptsioon ütleb: rolli/atribuutide alusel, regionaalne piiramine, auditeeritavus

Kontseptsioonidokument

— aga lisa veel:

*   SSO/IDP integratsioon (riiklikud identiteedid / organisatsiooni AD) + sessioonihaldus.
*   “Break-glass” roll (hädaolukord) koos eraldi auditiga.
*   volituste delegatsioon (vahetuse ülem annab ajutise ligipääsu).

5) Sensorite elutsükkel ja konfiguratsioonihaldus
-------------------------------------------------

Kontseptsioon mainib sensorikatvuse planeerimist, sensori asukohtade varjamist, rikke teavitust — lisa nõuded:

*   sensor “onboarding” (registreerimine, sertifikaadid/võtmed, tervisekontroll),
*   sensorite konfiguratsiooni versioonid (mis firmware/settingud olid, kui intsident toimus),
*   simulatsiooni/testrežiim (et treenida operaatorit ja testida reegleid ilma “päris” andmeid segamata).

6) Reeglimootor häiretele ja valmisolekurežiimidele
---------------------------------------------------

Valmisolekurežiim on kontseptsioonis olemas

Kontseptsioonidokument

, aga BA jaoks tasub konkretiseerida:

*   reeglite prioriteedid ja konfliktid (nt “varjatud ala” vs “kaitstav ala”),
*   reeglite muutmise protsess (kes, mis kinnitusega, mis logiga),
*   eraldi “tundlikkuse profiilid” kasutajagrupi kaupa (operaator vs patrull vs partner).

7) Partnerite/kolmandate osapoolte API ja “multi-tenant” piirid
---------------------------------------------------------------

Kui süsteem on “asutustele” ja potentsiaalselt ka välistele tarbijatele, siis rollipõhine pilt vajab API tasemel sama rangust:

*   API “scope’id” + rate-limit + auditeeritav päringulogi,
*   andmeväljade “field-level” filter (partner ei saa isegi kogemata rohkem),
*   lepinguline versioonihaldus (breaking change’i reeglid).

8) Mittefunktsionaalsed: latentsus, kättesaadavus, offline, skaleerumine
------------------------------------------------------------------------

Kontseptsioonis on online/offline teavitus ja sensori rikke teavitus , aga lisa:

*   SLA/SLO: maks latentsus häirele, maks “stale” aeg track’ile,
*   degradeerunud režiim (kui osa sensoreid/kanaleid maas),
*   koormusstsenaariumid (suur üritus vs rutiin) ja logi/andmemahu hinnangud.

* * *

### Üks komistuskivi / alternatiivvaade

Kui need “ops” teemad (retention, provenance, reeglimuutuste governance, partner-API scoping) jäävad alguses udusteks, siis need tulevad hiljem tagasi **kõige kallima** muudatusena — sest need lõikuvad korraga andmemudelisse, õigustesse, auditisse ja UI-sse. Kontseptsioonil on tugev tuum (rollipõhine pilt + häired + katvus)

Kontseptsioonidokument

, aga just need 8 punkti teevad sellest “päriselt kasutatava ja auditeeritava” süsteemi, mitte demo.



---
Powered by [ChatGPT Exporter](https://www.chatgptexporter.com)