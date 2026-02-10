# Intervjuu nõuded infosüsteemile

**User:** Andres Moks (andres.moks@gmail.com)  
**Created:** 2/10/2026 20:43:58  
**Updated:** 2/11/2026 0:02:06  
**Exported:** 2/11/2026 0:04:28  
**Link:** [https://chatgpt.com/g/g-p-698b7a30d6848191bacb8cff5277cb17-intekad/c/698b7c58-7c7c-8386-b164-438b73b3683d](https://chatgpt.com/g/g-p-698b7a30d6848191bacb8cff5277cb17-intekad/c/698b7c58-7c7c-8386-b164-438b73b3683d)  

## Prompt:
Raske Recording 406\_16k\_mono\_PRE180\_vadlight\_20260210\_043624.txt

Document

kasutades lisatud kontseptsioonidokumenti, too välja kõik intervjuu olulised punktid - millest tulenevad (tulevased) nõuded infosüsteemile.

## Response:
Thought for 1m 33s

Allpool on intervjuust välja tulevad **olulised punktid** ning **millised infosüsteemi nõuded** neist loogiliselt tekivad (koondatult ja “shall”-vaimus).

Raske Recording 406\_16k\_mono\_PR…

Kontseptsioonidokument

1) Ühtne olukorrapilt (COP) ja rollipõhine “üks kaart, mitu vaadet”
-------------------------------------------------------------------

**Intervjuu punkt:** eesmärk on üks kaardipilt, kus näeb droone, aga “erijuhud” ja info jagamine sõltub vajadusest/asutusest.

Raske Recording 406\_16k\_mono\_PR…

**Tulevased nõuded:**

*   Süsteem **peab** kuvama **reaalaja** olukorrapilti kaardil + **ajaloo** sirvimist.
    Kontseptsioonidokument
*   Süsteem **peab** võimaldama **rolli- ja atribuudipõhist** filtreerimist/vaateid (ABAC).
    Kontseptsioonidokument
*   Süsteem **peab** toetama “palju erijuhte”: eri droonitüübid, eri kasutajate nähtavus, eri režiimid.
    Raske Recording 406\_16k\_mono\_PR…

2) Sensorite mitmekesisus + katvuse piirangud (radar kui “ainus, mis tabab kõike”)
----------------------------------------------------------------------------------

**Intervjuu punkt:** vaja erinevaid sensoreid; “ainus, mis kõike tabab, on radar”, aga tervet Eestit ei kata.

Raske Recording 406\_16k\_mono\_PR…

**Tulevased nõuded:**

*   Süsteem **peab** koondama eri sensorite (Remote ID, RF, radar jne) andmed üheks pildiks.
    Kontseptsioonidokument
*   Süsteem **peab** kuvama/edastama **katvuse indikatsiooni** (kas piirkond on kaetud; mis kindlusega tuvastus).
    Raske Recording 406\_16k\_mono\_PR…
    Kontseptsioonidokument
*   Süsteem **peab** taluma olukorda, kus katvus on osaline ning andmete kvaliteet on ebaühtlane (nt maapiirkonnad).
    Raske Recording 406\_16k\_mono\_PR…

3) Geopiirid, alad ja teavitused (sisenemine/väljumine, “valveala”)
-------------------------------------------------------------------

**Intervjuu punkt:** vajadus luua kaardil alasid, jälgida sisse-välja liikumist ja saada teavitusi; ajutised kontrollpostid; ala võib olla “kaasus” ja kriminaalmenetlusega seotud.

Raske Recording 406\_16k\_mono\_PR…

**Tulevased nõuded:**

*   Süsteem **peab** võimaldama **kaitstavate alade** (geopiirid) loomist/haldust ja **häireid** geopiiri rikkumisel.
    Kontseptsioonidokument
*   Süsteem **peab** toetama **dünaamilist** (kasutajaga kaasaliikuvat) häireala mobiilis.
    Kontseptsioonidokument
*   Süsteem **peab** hoidma **häirete ajalugu** ja lubama hilisemat analüüsi/sirvimist.
    Kontseptsioonidokument

4) Varjatus ja “teadmisvajadus” (alad, droonid, sensorid)
---------------------------------------------------------

**Intervjuu punkt:** varjatud üksused tahavad alasid/huvisid, mida teised ei tohi näha; “asutuste vahel peab saama piirata”; sensorite asukohta ei taheta näidata (eriti ajutised sensorid).

Raske Recording 406\_16k\_mono\_PR…

**Tulevased nõuded:**

*   Süsteem **peab** toetama **Varjatud ala** tüüpi, kus tsoonis toimuvat tavakasutajale ei kuvata.
    Kontseptsioonidokument
*   Süsteem **peab** võimaldama **sensorite asukohti ja katvusalasid varjata** ning vajadusel kuvada “hägustatud” katvuskaarte.
    Raske Recording 406\_16k\_mono\_PR…
    Kontseptsioonidokument
*   Süsteem **peab** toetama “Nähtamatu” drooni staatust (droon, mille lendu kasutajatele ei kuvata).
    Kontseptsioonidokument
*   Süsteem **peab** võimaldama peenhäälestatud ligipääse: kellele on nähtavad millised varjatud alad/sensorid (roll + atribuudid + vajadusel piirkond).
    Raske Recording 406\_16k\_mono\_PR…
    Kontseptsioonidokument
*   Süsteem **peab** käsitlema **lekke riski** (nt kriminaalmenetlused võivad kesta aastaid; info ei tohi “välja paista”).
    Raske Recording 406\_16k\_mono\_PR…

5) Tõendiväärtus, toorandmed ja ahel (authenticity / chain-of-custody)
----------------------------------------------------------------------

**Intervjuu punkt:** drooni asukoha fakt võib olla tõend; kaitsjad küsivad ligipääsu algallikale; vaja säilitada töötlemata/originaalinfo kõrval, et tõendada muutmatus ja autentsus; radariandmed mahukad; operatiivinfo vs menetlusinfo reeglid erinevad.

Raske Recording 406\_16k\_mono\_PR…

**Tulevased nõuded:**

*   Süsteem **peab** säilitama **algandmed (toorandmed)** eraldatult töödeldud/agregeeritud vaadetest, et hiljem oleks võimalik “algallikani” minna.
    Raske Recording 406\_16k\_mono\_PR…
*   Süsteem **peab** tagama **muutmatus-tõendi** (nt räsi/ajatempli/digiallkirja põhimõte) ja **auditijälje** selle kohta, kuidas vaade/toode algandmetest tekkis.
    Raske Recording 406\_16k\_mono\_PR…
*   Süsteem **peab** toetama **erinevaid säilitustähtaegu ja -poliitikaid**: lühike operatiivvajadus vs pikk kriminaalmenetluse vajadus.
    Raske Recording 406\_16k\_mono\_PR…
*   Süsteem **peab** toetama **väljavõtte** loomist (nt menetluse jaoks), mis on verifitseeritav ja säilitatav.
    Raske Recording 406\_16k\_mono\_PR…

6) Integratsioonid olemasolevate töövahenditega (Skyri/VJT, ATAK)
-----------------------------------------------------------------

**Intervjuu punkt:** VJT kontekstis Skyri on koht, kuhu drooniinfo võiks ühel päeval jõuda; operatsioonideks kasutatakse ATAK-i, kus tahetakse näha “võõrad droonid” + eristada oma/Päästeameti droone.

Raske Recording 406\_16k\_mono\_PR…

**Tulevased nõuded:**

*   Süsteem **peab** pakkuma integratsioonivõimalust **Skyri/VJT** suunal (vähemalt arhitektuurne valmisolek; mitte “homne hädavajadus”).
    Raske Recording 406\_16k\_mono\_PR…
*   Süsteem **peab** pakkuma **ATAK**\-i jaoks sobivat andmeedastust/kihti (taktikaline kaart), sh “droonikiht” ja droonide usaldus-/sõbralikkuse eristused.
    Raske Recording 406\_16k\_mono\_PR…

7) Kasutajad, autentimine ja “kontrollitud anonüümsus”
------------------------------------------------------

**Intervjuu punkt:** kõik kasutajad ei saa autentida pärisnimega; osade politseiametnike andmeid ei tohi kuvada; SMIT-is on olemas lahendus kontrollitud anonüümsete kasutajate loomiseks; vaja jälgitavust (kes tegelikult oli).

Raske Recording 406\_16k\_mono\_PR…

**Tulevased nõuded:**

*   Süsteem **peab** toetama **isikustatud kasutajaid** (auditijälg) JA **kontrollitud anonüümseid kasutajaid** (pseudonüüm avalikult, pärisik tuvastatav järelevalves).
    Raske Recording 406\_16k\_mono\_PR…
*   Süsteem **peab** logima ja auditeerima kasutajate tegevused (sisselogimised, vaated, päringud, seadistused).
    Kontseptsioonidokument
*   Süsteem **peab** arvestama eri võrkude/asutustega (PPA, KV kinnine võrk, “lahtisemad” eraettevõtted) ja seega mitme identiteediallika/juurdepääsukanaliga.
    Raske Recording 406\_16k\_mono\_PR…

8) Teavitused töökindluse kohta (ühendus/sensoririke)
-----------------------------------------------------

**Intervjuu/konseptsioon:** operaator vajab töökindlat pilti; kontseptsioonis eraldi ühenduse katkemise ja sensori rikke teavitused.

Kontseptsioonidokument

**Tulevased nõuded:**

*   Süsteem **peab** teavitama kasutajat **ühenduse katkemisest** ja **sensori/andmevoo rikkest** (nt “pilt ei vasta”).
    Kontseptsioonidokument

9) Kaardikasutus: aluskaardid, 3D (eriti linnas), objektid/kihid
----------------------------------------------------------------

**Intervjuu punkt:** 3D pole hädavajalik, kuid linnas informatiivne otsustamiseks; aluskaardid/kihtide vajadus (tööstuskaart/topograafia “hea tava”).

Raske Recording 406\_16k\_mono\_PR…

**Tulevased nõuded:**

*   Süsteem **peab** toetama mitut **kaardikihti** (aluskaart + operatiivkihid + piirangualad jne).
    Raske Recording 406\_16k\_mono\_PR…
    Kontseptsioonidokument
*   Süsteem **võiks** toetada **3D vaadet**/kõrgusinfot vähemalt urbanistlikus kontekstis (mitte MVP-kriitiline).
    Raske Recording 406\_16k\_mono\_PR…

10) Koordinaatsüsteemide tugi (MGRS jpm)
----------------------------------------

**Intervjuu punkt:** eriüksus kasutab MGRS-i; “kõik ei kasuta sama”; vaja, et kõik saaks oma asukohad neile arusaadavas “keeles”; teisendus kaartidel on tehtav.

Raske Recording 406\_16k\_mono\_PR…

**Tulevased nõuded:**

*   Süsteem **peab** toetama vähemalt **WGS84 + MGRS** koordinaatide kuvamist ja sisestust (ja vajadusel teisendusi).
    Raske Recording 406\_16k\_mono\_PR…
*   Süsteem **peab** üheselt logima, mis koordinaatsüsteemis sisend anti (vältimaks operatiivseid vigu).
    Raske Recording 406\_16k\_mono\_PR…

11) Mobiilsed/ajutised sensorid ja “kiire kohapealne pilt”
----------------------------------------------------------

**Intervjuu punkt:** käsiseadmed/sensorid, mis tuvastavad mõnesaja meetri raadiuses; kiire kasutus piiril/metas; ajutiste sensorite asukoht võib olla ülisalajane; samas kasutajal on vaja teada, kas katvus üldse on.

Raske Recording 406\_16k\_mono\_PR…

**Tulevased nõuded:**

*   Süsteem **peab** võimaldama ajutiste sensorite (või nende toodangu) lisamist ning nende **asukoha varjamist** vastavalt teadmisvajadusele.
    Raske Recording 406\_16k\_mono\_PR…
*   Süsteem **peab** toetama planeerimisvaadet: “kas katvus on olemas” ilma, et asukoht paljastuks (hägustatud/agregeeritud).
    Raske Recording 406\_16k\_mono\_PR…
    Kontseptsioonidokument

12) Menetluste ja asutuste “piiripealne” tegelikkus (PPA vs MTA/toll jne)
-------------------------------------------------------------------------

**Intervjuu punkt:** piiriintsidendid (nt drooniga vedu) võivad olla PPA menetlus või MTA/toll, sõltub juhtumist; soovitus rääkida ka tolliga, sest neil võib olla oma vaade.

Raske Recording 406\_16k\_mono\_PR…

**Tulevased nõuded:**

*   Süsteem **peab** toetama mitme asutuse kasutusjuhtusid ja ligipääse, sh menetluslikud erisused (kes näeb mida ja millal).
    Raske Recording 406\_16k\_mono\_PR…
*   Süsteem **peab** võimaldama sama sündmuse kohta eri asutustele eri detailsust (operatiiv vs menetlus).
    Raske Recording 406\_16k\_mono\_PR…

13) Droonide klassid/staatused ja “tundlikkuse režiimid” (valealarmide surve)
-----------------------------------------------------------------------------

**Kontseptsioonist (intervjuu loogiline jätk):** droonidele staatused (sõbralik/kahtlane/vaenulik/nähtamatu jne) ja valmisoleku taseme režiimid valehäirete vähendamiseks.

Kontseptsioonidokument

**Tulevased nõuded:**

*   Süsteem **peab** toetama droonide **klassifitseerimist/staatusi** ja kuvamist värvikoodidega.
    Kontseptsioonidokument
*   Süsteem **peab** toetama **tundlikkuse režiime** (auto + manuaalne), mis mõjutavad filtreerimist/kuvamist ja alarmimist, et operaatorit mitte üle koormata.
    Kontseptsioonidokument

* * *

### Üks potentsiaalne komistuskoht / alternatiivvaade

Liiga peen “kõik on varjatud ja eraldi” mudel võib teha süsteemi operatiivselt kasutuks (keegi ei näe katvust ega saa koostööd teha), samas liiga “kõik näevad kõike” mudel tekitab lekke- ja menetlusriskid. Praktiliselt tähendab see, et ABAC/segmenteerimine + hägustatud katvuskaardid tuleb disainida nii, et _teadmisvajadus_ on täidetud ilma _asukohta/operatsiooni_ paljastamata.

Raske Recording 406\_16k\_mono\_PR…

Kontseptsioonidokument

## Prompt:
Raske Recording 406\_16k\_mono\_PRE180\_vadlight\_20260210\_043624.txt

Document

otsi veel! kasutades lisatud kontseptsioonidokumenti, too välja kõik intervjuu olulised punktid - millest tulenevad (tulevased) nõuded infosüsteemile.

## Response:
Thought for 1m 27s

Allpool on **intervjuust** välja tulnud olulised punktid (koos kontseptsioonidokumendis kinnitatud/struktureeritud kohtadega) ja **millised infosüsteemi nõuded** neist loogiliselt tulenevad.

* * *

1) Ühine olukorrapilt “üks kaart” ja rollipõhine nähtavus
---------------------------------------------------------

*   **Punkt:** eesmärk on “üks kaardipilt”, kus on droonid üle Eesti, aga kasutajad tahavad eri vaateid ning info jagamine on rolli/asutuse järgi piiratud.
    Raske Recording 406\_16k\_mono\_PR…
    *   **Nõuded:** rollipõhine filtreerimine (kes näeb mida), erinevad töövaated (operatiiv vs analüüs), “üks tõde” aga eri kasutajale eri detailsus.
        Kontseptsioonidokument

2) Mitme sensori koondamine + sensor-fusion valehäirete vähendamiseks
---------------------------------------------------------------------

*   **Punkt:** vaja eri sensoreid; praktikas “kõike tabab radar”, kuid katvus pole 100% ja süsteem peab seda arvestama.
    Raske Recording 406\_16k\_mono\_PR…
    *   **Nõuded:** mitme sensori adapterid (Remote ID, RF, radar jne) + fusiooniloogika ja usaldusväärsuse mudel (valepositiivsete vähendamine).
        Kontseptsioonidokument

3) Häired, ajalugu ja sündmuste sirvimine
-----------------------------------------

*   **Punkt:** vaja häireid geopiiri rikkumisel + hilisem sirvimine/ajalugu.
    Kontseptsioonidokument
    *   **Nõuded:** sündmuste/häirete register, otsing/filtrid, ajatelg, drill-down “mis, kus, millal, millise sensori alusel”.
        Kontseptsioonidokument

4) Teavitused töökindluse kohta (ühendus / sensori rike)
--------------------------------------------------------

*   **Punkt:** kasutaja peab teada saama, kui pole enam online või kui sensori pilt/andmevoog ei vasta.
    Kontseptsioonidokument
    *   **Nõuded:** tervisejälgimine (heartbeat), “data freshness” kontroll, häired katkestuste kohta, eraldi operaatori töövoog (“operaator reageerib häirele”).
        Kontseptsioonidokument

5) Alade haldus: kaitstav, varjatud, piiranguala, õppuseala
-----------------------------------------------------------

*   **Punkt:** süsteemis eristuvad alade tüübid (NOTAM/AIP piiranguala; õppuseala; kasutajapõhine kaitstav ala; varjatud ala, mida tavakasutajale ei kuvata).
    Kontseptsioonidokument
    *   **Nõuded:** alade elutsükkel (loomine/muutmine/aegumine), geofencing, alade tüübipõhised reeglid ja kuvamisloogika, ajastused (eriti NOTAM/AIP ja õppused).
        Kontseptsioonidokument

6) Varjatud operatsioonid: alad ja objektid ei tohi lekkida
-----------------------------------------------------------

*   **Punkt:** luua alasid, mille sisse-välja liikumisest saadakse teavitusi, aga **teised osapooled ei tohi neid alasid näha** (kriminaalmenetlused võivad kesta aastaid).
    Raske Recording 406\_16k\_mono\_PR…
    *   **Nõuded:** ABAC/roll+atribuut-põhine ligipääs (nt “näe varjatud alasid” + “ainult see kaasus/üksus”), rangem audit, andmete eraldus/tasemed (“tavakasutajale ei kuva”).
        Kontseptsioonidokument

7) Sensorite asukoht/katvus võib ise olla tundlik info (ja vahel peab seda peitma)
----------------------------------------------------------------------------------

*   **Punkt:** kui ajutine sensor pannakse “Viru rabasse”, siis selle asukoht/katvus paljastab operatsiooni; samas teatud rollidel on vaja teada, kas katvus üldse eksisteerib.
    Raske Recording 406\_16k\_mono\_PR…
    *   **Nõuded:** sensori asukoha/katvuse varjamine või hägustatud katvuskaart; “katvuse indikatsioon” kasutajale; vajaduspõhine ligipääs katvusele.
        Kontseptsioonidokument

8) Mobiilne teavitus ja “kaasaliikuv kaitstav ala”
--------------------------------------------------

*   **Punkt:** kaasaskantav häirerakendus; kasutaja saab luua enda ümber dünaamilise kaitstava ala; patrullidel taustal teavitus “Sinu lähedal on droon”.
    Kontseptsioonidokument
    *   **Nõuded:** geofence “follow-me” (GPS/asukohajagamine), push-teavitused, madala hõõrdumise UX (taustal töötav), akut/andmesidet säästev režiim.
        Kontseptsioonidokument

9) Droonide staatused ja käsitsi märgistus
------------------------------------------

*   **Punkt:** droonidel staatused (neutraalne/loaga/sõbralik/uus/kahtlane/vaenulik jne) ja ka “nähtamatu” (mida ei kuvata).
    Kontseptsioonidokument
    *   **Nõuded:** klassifitseerimisreeglid + käsitsi override, staatuse päritolu (milline asutus/roll võib mida panna), logitud muutused, kuvamisreeglid (“nähtamatu” rollipõhiselt).
        Kontseptsioonidokument

10) Valmisoleku/tundlikkuse režiimid (false positive’i juhtimine)
-----------------------------------------------------------------

*   **Punkt:** valehäireid tuleb palju (linnud, RF/Wi-Fi jne); tavaolukorras kuvada ainult kindlad tuvastused; režiim võib olla automaatne või manuaalne piirkonna/asutuse põhiselt.
    Kontseptsioonidokument
    *   **Nõuded:** tuvastuse “confidence” läved, režiimihaldus (kes tohib muuta), automaatne anomaaliapõhine ajutine tõstmine + audit.
        Kontseptsioonidokument

11) Operatiiv vs kriminaalmenetlus: erinev “huvi” ja erinevad reeglid
---------------------------------------------------------------------

*   **Punkt:** operatsiooni jaoks piisab hetkepildist; kui intsident tekib, siis “menetletakse teistmoodi”; krimmenetluses on teised säilitamis- ja tõendireeglid.
    Raske Recording 406\_16k\_mono\_PR…
    *   **Nõuded:** andmete elutsükkel ja retention poliitikad kasutusjuhtude kaupa (operatiivne lühike vs menetluslik pikk), sündmuse “eskaleerimine” menetluseks.
        Raske Recording 406\_16k\_mono\_PR…

12) Tõendiväärtus: toorandmete säilitamine + autentsuse tõendamine
------------------------------------------------------------------

*   **Punkt:** kaitsjad küsivad ligipääsu tõendi algallikale; peab olema võimalik näidata, et algandmeid pole muudetud; süsteem töötleb andmeid, seega vaja säilitada ka originaal “kõrvale”.
    Raske Recording 406\_16k\_mono\_PR…
    *   **Nõuded:** toorandmete eraldi säilitus (WORM/immutability loogika), tervikluse kontroll (hash-chain vms), kindel auditijälg “kes nägi/ekspordis/muutis”, tõendiekspordi protsess (nt digiallkiri väljavõttel).
        Raske Recording 406\_16k\_mono\_PR…

13) Integratsioonid: Skyri/VJT ja ATAK kaardikihid
--------------------------------------------------

*   **Punkt:** Skyri (jälitustoimingute digitaalne pidamine) võiks kunagi integreeruda; ATAK-is on vaja näha droonikihti (võõrad/oma/partneri droonid).
    Raske Recording 406\_16k\_mono\_PR…
    *   **Nõuded:** standardne väljastus/integreerimisliides (layer feed), õiguste pärandamine integratsioonidesse, “operatiivkiht” ATAK-ile, pikema plaani sidumine VJT kontekstiga.
        Raske Recording 406\_16k\_mono\_PR…

14) Koordinaatsüsteemid: MGRS (eriüksus) + kaartide “tõlkimine”
---------------------------------------------------------------

*   **Punkt:** eriüksus kasutab MGRS-i; risk on, et vale koordinaatsüsteemiga pannakse “Geni asemel Saaremaale”; vaja, et eri osapooled näeksid asukohti neile arusaadavas keeles.
    Raske Recording 406\_16k\_mono\_PR…
    *   **Nõuded:** koordinaatide kuvamine/otsing mitmes süsteemis (WGS84/ETRS/L-EST97/MGRS), kasutajapõhine eelistus, ekspordid samas formaadis, testitud ümberarvutused.
        Raske Recording 406\_16k\_mono\_PR…

15) Kaardikihid ja 3D (mitte “must have”, aga linnas kasulik)
-------------------------------------------------------------

*   **Punkt:** 3D vaade ja maapinna kõrgus pole igapäevas hädavajalik, aga linnas otsustamisel võib olla väga informatiivne (nurgad/varjestus).
    Raske Recording 406\_16k\_mono\_PR…
    *   **Nõuded:** 2D aluskaart + valikulised 3D kihid, kihihaldus, jõudluse/ligipääsu arvestus (3D pigem “advanced view”).
        Raske Recording 406\_16k\_mono\_PR…

16) Ligipääs ja turvalisus: ABAC, regionaalne segmenteerimine, auditeeritavus
-----------------------------------------------------------------------------

*   **Punkt:** õigused rolli ja atribuutide alusel; piirkondlik piiramine; kõik tegevused logitud ja auditeeritavad.
    Kontseptsioonidokument
    *   **Nõuded:** ABAC poliitikamootor, geograafiline scoping, täielik auditlogi (ka admin-tegevused), raporteeritav järelevalvevaade.
        Kontseptsioonidokument

17) Isikustatud kasutajad vs varjunimed (kontrollitud anonüümsus)
-----------------------------------------------------------------

*   **Punkt:** osa kasutajaid ei saa autentida päris nimega; lahendus on “kontrollitud anonüümsed kasutajad”, kus järelevalve saab hiljem päris kasutaja tuvastada; vältida olukorda “operatiivbüroo kasutaja1”.
    Raske Recording 406\_16k\_mono\_PR…
    *   **Nõuded:** pseudokontode haldus (admin-keskkond), tugev audit + “de-anonümiseerimise” protseduur ainult volitusega, toetada mitut identiteediallikat.
        Raske Recording 406\_16k\_mono\_PR…

18) Võrgud ja asutused: kinnised võrgud + “lahtised” partnerid
--------------------------------------------------------------

*   **Punkt:** ligipääs erinevatest võrkudest (SMITi võrk, turvavõrk, KV kinnine võrk, eraettevõtted/partnerid).
    Raske Recording 406\_16k\_mono\_PR…
    *   **Nõuded:** mitme turvadomeeni arhitektuur (väravad/DMZ, eraldi instantsid või tugev tenant-erisus), minimaalne andmelekke pind, eri autentimisvood.
        Raske Recording 406\_16k\_mono\_PR…

19) Ajutised/kaasaskantavad sensorid ja “kiire field use”
---------------------------------------------------------

*   **Punkt:** käsiseadmed, mis tuvastavad mõnesaja meetri raadiuses; huvi kiire kasutuse vastu metsas/piiril.
    Raske Recording 406\_16k\_mono\_PR…
    *   **Nõuded:** lihtne sensori lisamine (plug-in), ajutise sensori nähtavus/peitmine reeglitega, katkestustaluvus (väliolud), minimaalne seadistamine.
        Raske Recording 406\_16k\_mono\_PR…

20) “Varjatud droonid” ja operatiivsed erandid
----------------------------------------------

*   **Punkt:** vajadus “varjatud droonide” järele süsteemis; lisaks operatsioonil võib olla põhjendatud vajadus tõsta seade/droon kõrgemale kui tavaliselt lubatud.
    Raske Recording 406\_16k\_mono\_PR…
    *   **Nõuded:** drooni nähtavuse poliitika (kes/ millal näeb), “luba/erand” metaandmed tegevustele (vähemalt logitasemel), selge omanik/asutus “kes nõude omanik on”.
        Raske Recording 406\_16k\_mono\_PR…

* * *

### Üks potentsiaalne komistuskivi / alternatiivvaade

Liiga agressiivne “varjamine” (alad, sensorid, droonid) võib muuta ühise olukorrapildi praktiliselt kasutuks ja tekitada olukorra, kus asutused **ei usalda** enam, et “mida ma ei näe, seda pole olemas”. Seepärast tasub juba varakult disainida vähemalt “indikatiivne katvus/ohuteavitus” (nt _katvus olemas/puudub_ ilma asukohta paljastamata) ja väga selged reeglid, millal mille varjamine on õigustatud.

## Prompt:
otsi veel! kasutades lisatud kontseptsioonidokumenti, too välja kõik intervjuu olulised punktid - millest tulenevad (tulevased) nõuded infosüsteemile.

## Response:
Thought for 1m 22s

Allpool on **lisapunktid**, mis eelmistest kokkuvõtetest veel selgemalt välja tulevad (intervjuu + kontseptsioon) ja millised **tulevased nõuded** neist tekivad.

* * *

1) “Üldpilt” vaade peab andma ka mõõdikud, mitte ainult kaardi
--------------------------------------------------------------

**Punkt:** üldpildi vaates tahetakse kiiret ülevaadet (nt mitu drooni Eestis / seirealas / konkreetses alas).

Kontseptsioonidokument

**Nõuded:**

*   Süsteem **peab** kuvama reaalajas **loendurid/KPI-d** (riik/ala/asutuse vaade) ja lubama drill-down’i detaili.
    Kontseptsioonidokument
*   Süsteem **peab** toetama “juhtumite ajalugu” samas vaates (operatiiv + hilisem analüüs).
    Kontseptsioonidokument

2) Planeerimine on eraldi kasutusjuht: teekonnad + uute sensorite asukoha analüüs
---------------------------------------------------------------------------------

**Punkt:** planeerimisvaade sensori katvusele, sh isikukaitse teekondade planeerimine ja uute sensorite asukohtade analüüs.

Kontseptsioonidokument

**Nõuded:**

*   Süsteem **peab** pakkuma **planeerimisrežiimi**, kus kuvatakse katvus (vajadusel hägustatult) ja saab hinnata marsruudi/ala riski.
    Kontseptsioonidokument
*   Süsteem **peab** toetama “katvuse indikatsiooni” (kas kasutaja/ala on kaetud või mitte).
    Kontseptsioonidokument

3) Taustal töötav “near-me” teavitus patrullidele (Apollo)
----------------------------------------------------------

**Punkt:** patrullidel on vaja taustal töötavat teavitust “Sinu lähedal on droon”.

Kontseptsioonidokument

**Nõuded:**

*   Mobiilirakendus **peab** toetama taustal töötavaid teavitusi + kasutaja lüliti (opt-in) + asukohapõhine päästik.
    Kontseptsioonidokument
*   Süsteem **peab** rakendama rollipõhist “mida teavitada” loogikat (mitte uputada valehäirega).
    Kontseptsioonidokument

4) Persona-põhine “lihtsustatud pilt” vs toorandmed
---------------------------------------------------

**Punkt:** operatiivis tahetakse “oluliselt lihtsustatumat pilti”; toorandmed on mahukad ja pole igale kasutajale.

Raske Recording 406\_16k\_mono\_PR…

**Nõuded:**

*   Süsteem **peab** eristama vähemalt 2 andmekihti: **fuseeritud/filtreeritud COP** ja **toorandmete** kiht (ainult volitatud analüütik/menetlus).
*   Süsteem **peab** logima, millist kihti kasutaja vaatas/eksportis (audit).
    Kontseptsioonidokument

5) Andmemahud + menetluste pikkus => elutsükli- ja arhiveerimisnõuded
---------------------------------------------------------------------

**Punkt:** radariandmed on väga mahukad; suured menetlused võivad kesta aastaid.

Raske Recording 406\_16k\_mono\_PR…

**Nõuded:**

*   Süsteem **peab** toetama **talletuspoliitikaid** (operatiivne lühike vs menetluslik pikk) ja tõhusat arhiveerimist/tiered storage’i.
    Raske Recording 406\_16k\_mono\_PR…
*   Süsteem **peab** toetama sündmuse “eskaleerimist” menetluseks (muutub säilitus/ligipääs).
    Raske Recording 406\_16k\_mono\_PR…

6) Tõendiväärtus: mitte “logidest protokolli”, vaid kontrollitav algallikas
---------------------------------------------------------------------------

**Punkt:** kaitsjad küsivad ligipääsu tõendi algallikale; vaja näidata, et algandmeid pole muudetud; töödeldud pilt ei asenda originaali.

Raske Recording 406\_16k\_mono\_PR…

**Nõuded:**

*   Süsteem **peab** säilitama **töötlemata algandmed** ja siduma need fuseeritud vaatega (traceability).
    Raske Recording 406\_16k\_mono\_PR…
*   Süsteem **peab** võimaldama **verifitseeritavat väljavõtet** (case export) koos tervikluskontrolli/auditijäljega.
    Raske Recording 406\_16k\_mono\_PR…

7) Väga erinevad kasutajad, sh “lahtised” eraettevõtted + pseudokasutajad
-------------------------------------------------------------------------

**Punkt:** on eraettevõtteid, kellele peab ligipääsu andma; kõiki ei saa autentida pärisnimega; SMIT-il on “kontrollitud anonüümsete kasutajate” lahendus admin-keskkonnaga.  
**Nõuded:**

*   Süsteem **peab** toetama **kontrollitud pseudonüüme** (avalik pseudonüüm, järelevalvele pärisik tuvastatav) ja vältima jagatud kontosid.
*   Süsteem **peab** pakkuma tenant-/asutusepõhist kasutajahalduse mudelit (adminid “oma” kasutajatele).

8) Katvuse reaalsus: maapiirkondades piirdub tihti õhuseire radaritega; fookus “piir + linnad”
----------------------------------------------------------------------------------------------

**Punkt:** reaalses katvuses maapiirkondades “peale õhuseire radarite ei tule”; eesmärk pigem piir ja linnad.

Raske Recording 406\_16k\_mono\_PR…

**Nõuded:**

*   Süsteem **peab** kuvama katvuse/andmekvaliteedi piiranguid, et vältida “kõik on kaetud” valet ootust.
*   Süsteem **peab** taluma osalist katvust ja tegema selle kasutajale nähtavaks (indikatsioon).
    Kontseptsioonidokument

9) Ajutiste sensorite “kiire püsti” kasutusjuht käivitub riskihinnangust
------------------------------------------------------------------------

**Punkt:** kui riskihinnang näitab droonirünnaku ohtu, tahetakse panna ajutiselt sensoreid isiku/asukoha juurde; samas sensori asukohta ei taheta paljastada.  
**Nõuded:**

*   Süsteem **peab** toetama ajutiste sensorite kiiret liidestamist (plug-in/adapter) ja nende nähtavuse/katvuse varjamist vastavalt rollile.
*   Süsteem **peab** võimaldama riskihinnangust tulenevat “kaitstava ala” ja teavituste automaatset ülesseadmist (vähemalt töövoo tasemel).

10) Tulevased “efektorid” ja erandid: tõstmine / maha laskmine / kõrguspiirangud
--------------------------------------------------------------------------------

**Punkt:** jutt tuleb operatsioonides “tõstmisest ja maha laskmisest”; ning põhjendatud vajadusest tõsta seade kõrgemale kui lubatud (eriüksuste kontekst).  
**Nõuded:**

*   Süsteem **peab** logima ja ajastama “tegevused”/otsused (nt häirele reageerimine, võimalik tõrje/efektori kasutus) koos volitaja ja põhjendusega.
*   Süsteem **peaks** olema laiendatav efektorite/mitigatsiooni integratsiooniks (vähemalt sündmuse ja tegevuslogi tasemel), isegi kui MVP-s veel ei rakendata.
    Raske Recording 406\_16k\_mono\_PR…

* * *

### Üks potentsiaalne komistuskoht / alternatiivvaade

Kui “lihtsustatud pilt” ja “toorandmed” lahutatakse liiga karmilt, tekib kaks paralleelset tõde: operatiiv COP ütleb üht, menetluslik toorandmevaade teist. See sööb usaldust. Minimaalne vastumeede on range jälgitav seos (traceability) fuseeritud objekti ja algallika vahel + selge märgistus, millal kasutaja näeb filtritega “tõenäosuslikku” vaadet.

## Prompt:
mis on antud transkriptsiooni juures kõige olulisemad faktid või nõuded infosüsteemile, mille kontsept on lisa dokumentides?

## Response:
Thought for 1m 9s

Siin on transkriptsiooni “kõvatuum” (faktid) ja neist tulenevad **nõuded**, mis on kontseptsioonidokumendis ka sisuliselt ära kirjeldatud.

1.  **Rolli- ja atribuudipõhine ligipääs (asutuste vahel piiramine)**
    *   Fakt: asutuste vahel peab saama infot piirata; mõni ala/tegevus ei tohi teistele “välja paista”.
    Raske Recording 406\_16k\_mono\_PR…
*   Nõue: ABAC/rollipõhised õigused + regionaalne segmenteerimine + täielik audit.
    Kontseptsioonidokument
    2.  **Varjatud alad / varjatud operatsioonid**
    *   Fakt: vaja alasid, kus süsteem annab häireid (sisse-välja), kuid teised osapooled ei tohi ala olemasolustki teada (sh pikad kriminaalmenetlused).
    Raske Recording 406\_16k\_mono\_PR…
*   Nõue: “Varjatud ala” tüüp ja kuvamisloogika (“tavakasutajale ei kuva”), ligipääs ainult määratud rollidele.
    3.  **Sensorite asukoha/katvuse varjamine + katvuse indikatsioon**
    *   Fakt: ajutise sensori asukoht võib paljastada operatsiooni (nt “Viru raba”), kuid osadel rollidel on vaja teada, kas katvus üldse on.
    Raske Recording 406\_16k\_mono\_PR…
*   Nõue: sensori asukohti/katvusalasid saab varjata ning vajadusel näidata hägustatud katvust; lisaks “katvuse indikatsioon” kasutajale.
    4.  **Toorandmete säilitamine ja tõendiväärtus (autentsus/immutability)**
    *   Fakt: kaitsjad küsivad ligipääsu tõendi algallikale; süsteem töötleb andmeid → originaal/toorinfo peab alles olema ning peab olema tuvastatav, et pole muudetud.
    Raske Recording 406\_16k\_mono\_PR…
*   Nõue: toorandmete kõrvaltallete ja auditeeritav “traceability” (töödeldud vaade ↔ algandmed), sh säilituspoliitikad.
    5.  **Operatiiv “lihtsustatud pilt” vs analüütiline detail**
    *   Fakt: operatiivkasutaja tahab “relevantset kokku pandud pilti”, mitte kõiki toorandmeid; aga vajadusel peab saama minna algtõendini.
    Raske Recording 406\_16k\_mono\_PR…
*   Nõue: eri vaated/andmekihid (filtreeritud COP vs toorandmed), õigustega piiratud ligipääs.
    6.  **Häired geopiiri rikkumisel + häirete ajalugu**
    *   Fakt: tahetakse alasid, kuhu sisenemise/väljumise kohta tuleb teavitus; ning hiljem peab saama uurida.
    Raske Recording 406\_16k\_mono\_PR…
*   Nõue: kaitstavate alade/geopiiride haldus, häired ja häirete ajalugu koos sirvimisega.
    7.  **Mobiilne teavitus ja “kaasaliikuv häireala”**
    *   Fakt: vajadus teavitada lähidroonidest (nt patrullil taustal).
    Kontseptsioonidokument
*   Nõue: mobiilirakendus, mis lubab kasutajal luua dünaamilise kaasaliikuva häireala + taustal teavitused.
    8.  **Kontrollitud anonüümsed kasutajad (pseudonüümid) + järelevalve**
    *   Fakt: kõik kasutajad ei saa autentida päris nimega; vaja vältida “operatiivbüroo kasutaja1”; SMIT-il on olemas kontrollitud anonüümsete kasutajate lahendus koos admin-keskkonnaga.
    Raske Recording 406\_16k\_mono\_PR…
*   Nõue: isikustatud audit + pseudonüümi kuvamine (vajadusel), ning deanonüümimine ainult järelevalve protsessis.
    9.  **Mitme võrgu/asutuse reaalsus (kinnised võrgud + “lahtised” partnerid)**
    *   Fakt: ligipääs tuleb erinevatest võrkudest (SMIT/turvavõrk, KV kinnine võrk) ja ka eraettevõtetelt.
*   Nõue: arhitektuur peab toetama turvadomeenide erisust (ligipääsukontroll, autentimine, logimine).
    10.  **Droonide staatused + “nähtamatu droon”**
    *   Fakt: vaja olukordi, kus drooni ei kuvata kasutajatele (varjatud).
    Raske Recording 406\_16k\_mono\_PR…
*   Nõue: droonide staatuste mudel (sh “Nähtamatu”) ja rollipõhine kuvamine.
    11.  **Valmisoleku/tundlikkuse režiimid ja sensor fusion valehäirete vastu**
    *   Fakt/raam: eesmärk on vältida operaatori ülekoormust valehäiretega.
    Kontseptsioonidokument
*   Nõue: sensor fusion + automaatne/manuaalne tundlikkuse režiim piirkonna/asutuse põhiselt.
    12.  **“Pikema plaani” integratsioonid (ATAK + Skyri/VJT)**
    *   Fakt: Skyri/VJT integratsioon on “pikas plaanis”; operatsioonideks kasutatakse ATAK-i ja sinna tahetakse droonikihti (võõrad/oma/partnerid).
    Raske Recording 406\_16k\_mono\_PR…
*   Nõue: väljastusliides kaardikihtideks (taktikaline klient) + sihtintegratsioonid backlog’i (mitte MVP-kohustus).
    13.  **Koordinaatsüsteemide tugi (MGRS)**
    *   Fakt: eriüksus kasutab MGRS-i; vale koordinaadisüsteem tekitab operatiivseid vigu.
    Raske Recording 406\_16k\_mono\_PR…
*   Nõue: koordinaatide sisestus/kuvamine vähemalt üheselt hallatud formaatides (sh MGRS) ja selge märgistus, mis süsteemis formaati kasutati.
    Raske Recording 406\_16k\_mono\_PR…
    14.  **(Nice-to-have) 3D vaade linnas**
    *   Fakt: 3D ei ole hädavajalik, aga linnas otsustamisel informatiivne.
    Raske Recording 406\_16k\_mono\_PR…
*   Nõue: 3D vaade pigem hilisemaks etapiks (või “advanced mode”).
    Raske Recording 406\_16k\_mono\_PR…

**Komistuskivi / alternatiivvaade:** kui “varjamine” (alad, sensorid, droonid) lahendada liiga jäigalt, tekib koostöö asemel pimeala-usk (“kui ma ei näe, siis pole olemas”) ja süsteemi usaldus kukub. Praktiline kompromiss on katvuse **indikatsioon** ja hägustatud katvuskaart, mis ei leki asukohti, kuid annab operatiivse kindlustunde.

## Prompt:
Raske Recording 406\_16k\_mono\_PRE180\_vadlight\_20260210\_043624.txt

Document

kasutades lisatud kontseptsioonidokumenti, too välja kõik intervjuu olulised punktid - millest tulenevad (tulevased) nõuded infosüsteemile.

## Response:
Thought for 2m 21s

Allpool on transkriptsioonist välja tulevad **olulised intervjuu punktid** ja neist tulenevad **tulevased infosüsteemi nõuded**, seotuna kontseptsioonidokumendi lahenduskirjeldusega.

1) Kasutusjuhud ja “milleks süsteem üldse”
------------------------------------------

*   **Kaks põhikasutusjuhtu**: (1) _operatiivne hetkeolukord_ (lihtsustatud pilt “mis mu lähedal lendab”), (2) _kriminaalmenetluse/uurimise raam_ (pikad menetlused, rangemad reeglid). Süsteem peab toetama mõlemat vaadet/voogu eraldi.
    Raske Recording 406\_16k\_mono\_PR…
    Raske Recording 406\_16k\_mono\_PR…
    Kontseptsioonidokument
*   **Lisaks “tugitegevused”** ning **piiriintsidendid/salakaubavedu** (mõnikord PPA menetleb lõpuni, mõnikord MTA). Vajadus rollipõhisele koostööle ja juhtumite/andmete “üleandmise” loogikale.
    Raske Recording 406\_16k\_mono\_PR…
    Kontseptsioonidokument

2) Kaardivaade, kihid ja ruumiandmed
------------------------------------

*   **Kaardikihid + aluskaart on vältimatud** (objektid, tsoonid, “topograafia hea tava”; vajadus kvaliteetseks aluskaardiks ja kihtideks, mida saab ATAK-i jms viia).
    Raske Recording 406\_16k\_mono\_PR…
*   **3D vaade**: mitte igapäevaselt kriitiline, aga **linnas otsustustoeks** (tulemisnurk, varjed, hooned). Nõue: valikuline 3D/maapinna kõrgus (vähemalt linnapiirkondades).
    Raske Recording 406\_16k\_mono\_PR…
*   **Koordinaatsüsteemide tugi**: soovitus MGRS (“MGS”), lisaks erinevad asutused/andmeallikad (Maa-amet, SMIT, ajalooline L-EST). Nõue: mitme CRS-i sisend/väljund + selge konverteerimine “asutusele arusaadavas keeles”.
    Raske Recording 406\_16k\_mono\_PR…

3) Alad, geofencing, nähtavus ja “kellele mida näidata”
-------------------------------------------------------

*   **Kasutaja loodud alad + sisse/välja teavitused** (nii lühi- kui pikaajalised operatsioonialad). Nõue: ala loomine, geopiiri rikkumise sündmused, alade haldus.
    Raske Recording 406\_16k\_mono\_PR…
    Kontseptsioonidokument
*   **Alade nähtavuse “poliitika” pole üheselt mustvalge**: mõne ala puhul tahetakse, et _teised teaksid, et ala eksisteerib_; teisel juhul peab ala olema varjatud. Nõue: ala nähtavuse tase (avalik/asutustele/ainult mulle/varjatud) + rollipõhised filtrid.
    Raske Recording 406\_16k\_mono\_PR…
    Kontseptsioonidokument
*   **Varjatud info kui “nice-to-have”, mitte showstopper**: kui tehniliselt ei saa kõike eraldada, aktsepteeritakse riski ja kasutaja peab teadma, et teised võivad näha; vajadusel “siis me ei kasuta”. Nõue: _läbipaistev riskimärge UI-s_ + konfiguratsioon “ära kasuta/ära jaga” (mitte hard-block).
    Raske Recording 406\_16k\_mono\_PR…

4) Droonide nähtamatus ja operatiivne vajadus
---------------------------------------------

*   **“Varjatud droonid süsteemis vajalikud”** ja “Rasked on nõude omanik”. Nõue: drooni/track’i filtreerimine rolli/operatsiooni alusel (“nähtamatu”), samuti varjatud alade kontseptsioon.
    Raske Recording 406\_16k\_mono\_PR…
    Kontseptsioonidokument
*   **Asutustevaheline piiramine**: vajadus piirata, kes milliseid üksuseid/operatsioone näeb. Nõue: rolli+atribuutide põhine ligipääs ja auditeeritavus.
    Raske Recording 406\_16k\_mono\_PR…
    Kontseptsioonidokument

5) Sensorid, katvus ja ajutised/teisaldatavad sensorid
------------------------------------------------------

*   **Katvus ei ole “terve Eesti”**: maapiirkonnas reaalselt vaid õhuseire radarid; eesmärgiks pigem piir + linnad. Nõue: UI-s katvuse/katuse indikatsioon ja planeerimise vaade.
    Raske Recording 406\_16k\_mono\_PR…
    Kontseptsioonidokument
*   **Ajutised sensorid isiku/objekti kaitseks** (oht hinnang → “püsti sensorid” hetkeasukohta). Nõue: ajutise sensori lisamine, selle katvuse arvestamine, vajadusel varjamine/hägustamine.
    Raske Recording 406\_16k\_mono\_PR…
    Kontseptsioonidokument
*   **Vajadus “tõsta seade kõrgemale” operatsiooni läbiviimisel** (line-of-sight praktiline probleem). Nõue: sensorite paigutuse/konfi haldus (sh ajutine kõrgus/asukoht) ja selle mõjude kuvamine (katvuse muutus).
    Raske Recording 406\_16k\_mono\_PR…
    Kontseptsioonidokument
*   **Käsiseadmed/handheld tuvastus eriüksustele** (mõnesaja meetri raadiuses, kiire kontroll “metsatukas”). Nõue: võime lisada/integreerida lähimaa sensoritüüpe (RF/handheld) ning kuvada nende tulemusi kontekstipõhiselt.
    Raske Recording 406\_16k\_mono\_PR…
    Kontseptsioonidokument

6) Operatiivpilt vs tõendipilt (säilitamine, väljavõtted, chain-of-custody)
---------------------------------------------------------------------------

*   **Tõendini välja jõudmine**: peab saama minna “algtõendini” ükskõik mis hilisemal ajahetkel; radaripildid on mahukad; menetlused võivad kesta kaua. Nõue: tõendite elutsükkel + arhiveerimine/retentsioon, sh suured toorandmed.
    Raske Recording 406\_16k\_mono\_PR…
*   **Töödeldud vs töötlemata**: operatiivseks kuvamiseks tehakse lihtsustatud/filtreeritud pilt (“relevantne pilt”), aga menetluse jaoks on vaja kontrollitavat alginfot. Nõue: eraldi “operatiivvaade” ja “tõendivaade”, kus tõendivaade viitab muutmata allikale.
    Raske Recording 406\_16k\_mono\_PR…
    Kontseptsioonidokument
*   **Digiallkirjastatud väljavõtted**: vajadus teha väljavõte, digiallkirjastada, säilitada kindlas kohas; samas tuleb defineerida vorming ja maht. Nõue: eksport + signeerimine + metaandmed (aeg, allikas, ahel), ning säilituse reeglid.
    Raske Recording 406\_16k\_mono\_PR…

7) Integratsioonid (pika plaani “must have”, mitte homne)
---------------------------------------------------------

*   **Skyri (VJT/jälitustoimingud)**: droonid peaksid jõudma samasse konteksti nagu muud üksused/ressursid; loa alusel väljavõtetest tekib protokoll. Nõue: integratsioonipunkt sündmuste/objektide sünkroniseerimiseks Skyri-sse (või vähemalt ekspordivorming).
    Raske Recording 406\_16k\_mono\_PR…
*   **ATAK**: kasutatakse operatsioonide planeerimisel ja läbiviimisel; vaja “droonikihti” ja kaardikihte ATAK-is. Nõue: standardiseeritud kihtide eksport/voog ATAK-i (ja kontroll, milliseid kihte kellele).
    Raske Recording 406\_16k\_mono\_PR…

8) Ligipääs, identiteedid ja võrgud
-----------------------------------

*   **Ligipääs erinevatest võrkudest**: SMITi võrk, “turvavõrk”, KV kinnine võrk. Nõue: mitme võrgu/deploy-skeemi tugi ja segmenteerimine.
    Raske Recording 406\_16k\_mono\_PR…
*   **Eraettevõtete kasutajad + mitte-isikustatud autentimine**: kõigil ei ole võimalik autentida “päris nimega”; ei saa tugineda ainult SMIT auth / “tala” lahendusele. Nõue: mitme identiteedimeetodi tugi (asutusepõhine), sh piiratud teenusekontod.
    Raske Recording 406\_16k\_mono\_PR…
*   **Kontrollitud anonüümsed kasutajad** (SMITiga olemasolev lahendus, admin-keskkond, järelevalveks seos päris kasutajaga). Nõue: pseudonüümi kuvamine UI-s + tugev audit trail ja admin haldus.
    Raske Recording 406\_16k\_mono\_PR…
    Kontseptsioonidokument

* * *

### Üks praktiline “devil’s advocate” risk

**“Varjatud droonid / varjatud alad”** on operatiivselt vajalik, aga see lõhub väga kiiresti “ühise olukorrapildi” lubaduse: kui kasutajad õpivad, et nad _võivadki näha ainult osa tõde_, kipub usaldus süsteemi vastu kukkuma. Seda saab leevendada ainult siis, kui UI räägib ausalt “sul võib olla piiratud pilt” (mitte ei jäta muljet, et “kõik on näha”), ja kui alade/nähtavuse reeglid on asutuste vahel formaalselt kokku lepitud.

Raske Recording 406\_16k\_mono\_PR…

Kontseptsioonidokument

## Prompt:
kasutades lisatud kontseptsioonidokumenti, too välja kõik intervjuu olulised punktid - millest tulenevad (tulevased) nõuded infosüsteemile, muud olulised punktid.

kirjelda pikemalt varem toodud nõuete tausta lahti

## Response:
Thought for 1m 41s

Allpool on intervjuu + kontseptsioonidokumendi põhjal “kõvad” punktid, millest päriselt tekivad infosüsteemi nõuded (ja miks). Panin need nii, et iga teema all on **(a) intervjuu/fakt**, **(b) tuletatud nõue**, **(c) taust**.

* * *

1) Süsteemi põhifunktsioon: ühtne olukorrapilt + ajalugu
--------------------------------------------------------

**Fakt / intervjuu:** kasutusjuhtude tuum jaguneb kaheks: _ala seire uurimise raames_ + _kaitse enda turvalisuse eesmärgil_; lisaks “tugitegevused” ja piiriintsidendid/salakaubavedu kontekst.

Raske Recording 406\_16k\_mono\_PR…

Raske Recording 406\_16k\_mono\_PR…

**Nõue:** infosüsteem peab toetama nii **reaalaja olukorrapilti** kui **ajaloo/juhtumite sirvimist** ning lubama töövoogusid, mis on erineva “eluajaga” (operatiivne hetk vs menetluslik pikk).

Raske Recording 406\_16k\_mono\_PR…

Kontseptsioonidokument

**Taust:** operatiivtöös on eesmärk “kas praegu on droon lähedal ja kus?”, pärast operatsiooni huvi lõpeb; menetluses (kriminaal/protokollid) on vaja minna _algtõendini_ ka kaua hiljem. Need kaks maailma vajavad erinevat andmemahukust, säilitust ja õiguseid.

Raske Recording 406\_16k\_mono\_PR…

* * *

2) Multi-sensor sisend + sensor fusion valehäirete vastu
--------------------------------------------------------

**Fakt / dok:** süsteem koondab eri tüüpi sensorid (Remote ID, RF, drooniradarid jne) ning kasutab sensor fusion’it valepositiivsete vähendamiseks.

Kontseptsioonidokument

**Nõue:** peab olema **sensorite adapterkiht** (erinevad sensoritüübid, erinev kvaliteet), ning **ühistatud “track/objekt” mudel** (mitu allikat -> üks pilt).  
**Taust:** ilma fuse’ita uputavad linnud/Wi-Fi/RF müra operaatori alarmidesse; fuse + filtrid on otseselt tööjõu ja reageerimisvõime küsimus, mitte “nice-to-have”.

Kontseptsioonidokument

* * *

3) Tundlikkusrežiimid (valmisoleku tase) + automaatne/manuaalne eskalatsioon
----------------------------------------------------------------------------

**Fakt / dok:** režiimid mõjutavad usaldusläve, filtreerimise tugevust ja operaatori koormust; režiimi saab tõsta automaatselt anomaalia korral või manuaalselt piirkonna/asutuse põhiselt.

Kontseptsioonidokument

**Nõue:** süsteemis peab olema **konfigureeritav detection policy** (per piirkond/asutus), koos auditiga: kes muutis, millal, miks.  
**Taust:** “tavaolukord” ja “kõrge risk” ei saa olla sama seadistusega, muidu kas a) näed liiga vähe või b) upud häiretesse. Režiim peab olema operatiivjuhtimise tööriist.

* * *

4) Alad, geopiirid ja häired: piirang, õppus, kaitstav, varjatud
----------------------------------------------------------------

**Fakt / dok:** alade tüübid: Piiranguala (NOTAM/AIP, avalik), Õppuseala (MÕS, NOTAM või varjatud), Kaitstav ala (mitteavalik, geofencing/puhver), Varjatud ala (tavakasutajale ei kuvata).

Kontseptsioonidokument

**Nõue:** geopiiride mootor peab toetama **mitut alaliiki**, **puhvreid**, **õiguspõhist nähtavust**, ning **häire reegleid** (“objekt siseneb kaitstavasse alasse”).

Kontseptsioonidokument

**Taust:** “ala” pole lihtsalt polygon kaardil: piiranguala on avalik, kaitstav/varjatud on ise juba tundlik info. Sama geomeetria võib olla ühele asutusele nähtav, teisele mitte.

* * *

5) Droonide staatused + “Nähtamatu/Varjatud droon”
--------------------------------------------------

**Fakt / dok:** staatused (neutraalne, loaga, sõbralik, uus, kahtlane, vaenulikkuse kahtlus, vaenulik, nähtamatu) ja varjatud ala kontseptsioon.

Kontseptsioonidokument

**Fakt / intervjuu:** “varjatud droonid süsteemis vajalikud”.

Raske Recording 406\_16k\_mono\_PR…

**Nõue:** vaja on **klassifitseerimis- ja märgistamisloogikat** (kes tohib mis staatust panna, mis reeglite alusel, kuidas see logitakse) + **filtreeritud kuvamine** rolli/atribuudi alusel.

Kontseptsioonidokument

**Taust:** operatiivüksused võivad ise teha lende/vaatlusi, mida ei saa laiale ringile kuvada (taktika, seadmete asukoht, operatsiooni paljastamine). See nõue on sisuliselt “need-to-know” infosüsteemi sees, mitte ainult võrgu tasemel.

* * *

6) Katvuse reaalsus: “kogu Eestit ei kata” + katvuse indikatsioon
-----------------------------------------------------------------

**Fakt / intervjuu:** reaalkatvus maapiirkondades on piiratud (peale õhuseire radarite “ei tule”); eesmärk pigem piir + linnad.

Raske Recording 406\_16k\_mono\_PR…

**Fakt / dok:** mobiilis küsitakse otseselt: kas näidata, kas kasutaja on sensoritega kaetud alas.

Kontseptsioonidokument

**Nõue:** süsteem peab näitama **katvuse/ebakindluse meta-infot** (nt “kaetud / osaliselt / katmata”, või confidence), sh planeerimisvaates.

Kontseptsioonidokument

**Taust:** kui kasutaja eeldab “katus on igal pool”, tehakse valesid otsuseid. Katvuse läbipaistev näitamine on riskijuhtimine.

* * *

7) Sensorite asukoht ja katvusalad on ise tundlikud: varjamine + hägustus
-------------------------------------------------------------------------

**Fakt / dok:** sensorite asukohti ja katvusalasid saab varjata; hägustatud katvuskaardid teadmisvajaduse põhiselt.

Kontseptsioonidokument

**Fakt / intervjuu:** ajutisi sensoreid tahetakse panna riskihinnangu põhjal “keset Viru raba” jne; sellise sensori asukoha näitamine paljastab operatsiooni.

Raske Recording 406\_16k\_mono\_PR…

Raske Recording 406\_16k\_mono\_PR…

**Nõue:** peab olema **sensorite nähtavusklass** (peida täielikult / näita ligikaudselt / näita täpselt), ning sama loogika katvuse kohta (täpne vs hägustatud).  
**Taust:** vastasel juhul muutub infosüsteem luurelekke masinaks: “sensor keset metsa” = “seal toimub midagi”.

* * *

8) Mobiilne kasutus: dünaamiline kaasaliikuv kaitseala + taustateavitused
-------------------------------------------------------------------------

**Fakt / dok:** mobiilirakendus: kaasaskantav häirerakendus; kasutaja loob enda ümber dünaamilise kaitstava ala; isikukaitsel hoiatus planeeritud teekonnal; patrullil taustateavitus “Sinu lähedal on droon”.

Kontseptsioonidokument

**Nõue:** mobiilis peab olema **geofencing reaalajas**, **asukoha-põhine teavituste reegel**, ja töörežiim “taustal”.  
**Taust:** isikukaitse/patrull ei vaata pidevalt kaarti. Süsteem peab ise “näksama varrukast”, kui risk lähedale tuleb.

* * *

9) Teavitused ja töökindlus: ühenduse katkemine, sensori rike, operaatori reageerimine
--------------------------------------------------------------------------------------

**Fakt / dok:** teavitus ühenduse katkemisel serveriga; teavitus sensori rikke korral; operaator reageerib häirele.

Kontseptsioonidokument

**Nõue:** vaja on **tervise/heartbeat** jälgimist (server, sensorid, andmevood), **alarmeerimist** ja “ack/triage” töövoogu.  
**Taust:** kui sensor sureb, “0 häiret” võib olla kas “kõik rahulik” või “pimedus”. Need peavad olema süsteemis eristatavad.

* * *

10) Ligipääsud: roll + atribuudid + regionaalne segmenteerimine + audit
-----------------------------------------------------------------------

**Fakt / dok:** õigused rolli ja atribuutide alusel; piirkondade kaupa piiramine; kõik tegevused logitud/auditeeritavad.

Kontseptsioonidokument

**Fakt / intervjuu:** asutuste vahelist infot peab saama piirata; mõnikord aktsepteeritakse riski, kui tehniliselt ei saa 100% eraldada, aga peab teadma, mida teised näevad.

Raske Recording 406\_16k\_mono\_PR…

Raske Recording 406\_16k\_mono\_PR…

**Nõue:** ABAC-laadne ligipääs (role+attributes) + “data-sharing policy” nähtavuse tasemete jaoks (sh riskide märgistamine).  
**Taust:** päris maailmas on “täiuslik eraldamine” kallis või võimatu; süsteem peab toetama kontrollitud kompromisse, mitte ainult “jah/ei”.

* * *

11) Anonüümsed/pseudokasutajad (isikustatud kasutaja ei tohi nähtav olla)
-------------------------------------------------------------------------

**Fakt / intervjuu:** politseiametnike pärisnime/isikukoodi ei saa mõnes kontekstis kuvada; olemas on SMITiga lahendus “kontrollitud anonüümsed kasutajad” + adminikeskkond; järelevalves saab tuvastada päris isiku.

Raske Recording 406\_16k\_mono\_PR…

**Nõue:** autentimine/autoriseerimine peab toetama **pseudonüümi** (kuvatav identiteet) vs **päris identiteet** (audit/järelevalve), koos eraldi admin-haldusega.  
**Taust:** see pole kosmeetika—see on otseselt operatiivohutus. Samas peab järelkontroll säilima, muidu on “pime konto” risk.

* * *

12) Võrgud ja ligipääsukohad: SMITi võrk, turvavõrk, KV kinnised võrgud
-----------------------------------------------------------------------

**Fakt / intervjuu:** ligipääsuvõrgud on erinevad (SMITi võrk, turvavõrk, KV oma kinnine võrk); see on eraldi disainiteema.

Raske Recording 406\_16k\_mono\_PR…

**Nõue:** arhitektuur peab arvestama **mitme turvadomeeni / võrgu** reaalsusega (nt eraldi deploy, replikatsioon, vaheserverid, API-väravad).  
**Taust:** kui eeldada “kõik on ühes sisevõrgus”, kukub integratsioon päriselus kokku.

* * *

13) Kaardikihid, aluskaardid, koordinaatsüsteemid (MGRS jne)
------------------------------------------------------------

**Fakt / intervjuu:** eriüksus kasutab MGRS; “kõik saaksid asukohad neile arusaadavas keeles”; mainitakse Maa-ameti jm süsteeme ja L-Eesti teemat.

Raske Recording 406\_16k\_mono\_PR…

**Nõue:** kaart peab toetama **koordinaatide kuvamist/vahetust** (vähemalt WGS84/L-EST/MGRS, või plugina kaudu), ning kihte (topo/ortofoto jm).

Raske Recording 406\_16k\_mono\_PR…

**Taust:** koordinaadiviga = “Saaremaale sattumine” tüüpi operatiivapsakas. Kui süsteem teenindab eri asutusi, peab ta rääkima mitut “koordinaadikeelt”.

* * *

14) Integratsioonid: Skyri (VJT/jälitustoimingud), ATAK (operatsiooniplaneerimine), Apollo-teavitused
-----------------------------------------------------------------------------------------------------

**Fakt / intervjuu:** Skyri on koht, kus hoitakse jälitustoiminguid; drooniteave võiks sinna ühel päeval jõuda (pole homne “must-have”, pigem pikk plaan) ja protokoll võiks tekkida sinna; ATAK-i kasutatakse operatsioonide planeerimisel ja sinna soovitakse kaardikihte.

Raske Recording 406\_16k\_mono\_PR…

**Fakt / dok:** Apollo taustateavitused patrullidele.

Kontseptsioonidokument

**Nõue:** vaja on **eksporditavaid/integreeritavaid liideseid**:

*   Skyri suunal: sündmuse/protokolli kirjed + lingid algandmetele,
*   ATAK suunal: kaardikihid/objektid/tsoonid droonipildist,
*   patrullisüsteemide suunal: teavitused/alert feed.  
    **Taust:** operatiivplatvormid on juba olemas; droonisüsteem peab “liituma orkestriga”, mitte tegema järjekordset saart.

* * *

15) Operatiivpilt vs algtõend: lihtsustatud vaade, aga tõendini peab jõudma
---------------------------------------------------------------------------

**Fakt / intervjuu:** operatiivtöös tahetakse lihtsustatud pilti (mitte iga sensori raw), see on juba töötlemine; samas menetluses peab saama minna algtõendini; radarandmed on mahukad; menetlused võivad kesta aasta.

Raske Recording 406\_16k\_mono\_PR…

**Nõue:** andmehalduses peab olema **kaks tasandit**:

1.  “operatiivne fuse/track” (kiire, kerge),
2.  “toorandmed + chain-of-custody” (mahukas, kaitstud).  
    **Taust:** kui hoiad ainult fuse-tulemit, võib menetluses puudu jääda; kui hoiad alati toorandmeid kõikjal, läheb süsteem kalliks ja aeglaseks. Vajad poliitikat + tehnilist lahutust.

* * *

16) Väljavõtted, digiallkiri, säilitustähtajad ja arhiiv
--------------------------------------------------------

**Fakt / intervjuu:** saab teha väljavõtteid; küsimus on säilitamises ja vormingus/mahus; mainitakse digiallkirjastatud väljavõtet ja “algtõendini jõudmist”.

Raske Recording 406\_16k\_mono\_PR…

**Nõue:** süsteem peab toetama **case-paketi** loomist (väljavõte + meta + logid), **digitaalset allkirjastamist**, ning **säilitustähtaegade klassifikatsiooni** (operatiiv vs menetlus).  
**Taust:** see on klassikaline “tõendikett”: kes kogus, millal, mis kujul, kuidas muutmatus tagati. Drooniseire lisab siia lihtsalt mahuprobleemi (radar/EO/RF).

* * *

17) Ajutised ja käsiseadmed: kiire deploy “metsatukka”
------------------------------------------------------

**Fakt / intervjuu:** eriüksusel huvi käsiseadmete vastu (mõnesaja meetri raadius), “kiirelt samas piiri ääres metsatukas” vaatamine; ajutiste sensorite püstitamine riskihinnangu põhjal.

Raske Recording 406\_16k\_mono\_PR…

Raske Recording 406\_16k\_mono\_PR…

**Nõue:** süsteem peab lubama **ajutiste sensorite elutsüklit** (registreerimine, nähtavusklass, eemaldamine), ja toetama **madala latentsusega “nearby” vaadet**.  
**Taust:** püsiv infrastruktuur ei kata kõiki olukordi; ajutine sensor on operatsiooni osa ning selle “jälg” infosüsteemis peab olema kontrollitav ja vajadusel peidetav.

* * *

18) Tuleviku võimekasv: tõrje (jammer/interceptor) + drooniparved (praegu mitte)
--------------------------------------------------------------------------------

**Fakt / intervjuu:** arutatakse tulevikus piiril tõrjevõimekust (jammer/interceptorid, autonoomne “pesa”); drooniparved pole hetkel Eesti teema, tõrje on pigem inim-põhine.

Raske Recording 406\_16k\_mono\_PR…

**Nõue:** andmemudel ja sündmused peaksid olema laiendatavad **“effectors / counter-actions”** logimisele (nt “häire -> sekkumine -> tulemus”), isegi kui esimeses etapis ei tehta.  
**Taust:** kui hiljem lisandub tõrje, on vaja samasse juhtumilukku siduda “mida nägime” + “mida tegime” + “mis juhtus”.

* * *

Muud olulised punktid (mida tasub nõueteks vormistada)
======================================================

*   **Planeerimisvaade** peab toetama nii teekonna planeerimist (isikukaitse) kui sensorite asukohtade analüüsi, koos katvuse ja (vajadusel) hägustusega.
    Kontseptsioonidokument
*   **Juhtumite ajalugu** ja “mitu drooni kokku / alas / Eesti õhuruumis” tüüpi koondnäitajad on eraldi UX/nõue (operatiivjuhi töölaud).
    Kontseptsioonidokument
*   **Tolli ja sõjaväepolitsei**: intervjuus käib läbi, et tollil võib olla “oma nurk”; KV kaasab ise SP vajadused, aga seda peaks kontrollima, et keegi ei jääks välja. See tähendab, et stakeholder’ite kaart + rollid + andmevajadused vajavad eraldi läbikirjutust.
    Raske Recording 406\_16k\_mono\_PR…

* * *

Üks potentsiaalne komistuskivi / alternatiivvaade
-------------------------------------------------

“**Nähtamatu/varjatud droon**” ja sensorite varjamine on operatiivselt vajalik, aga infosüsteemi mõttes on see ka **kuritarvituse supervõime**: kui governance (kes, mis tingimustel, mis logiga, mis järelkontrolliga) jääb udune, siis tekib “süsteemis toimuv, mida keegi ei näe” hall ala. Minimaalne vastumürk on karm audit + selged volitused + põhjenduskohustus iga varjamise/klassifikatsiooni muutuse puhul.

Kontseptsioonidokument

Raske Recording 406\_16k\_mono\_PR…



---
Powered by [ChatGPT Exporter](https://www.chatgptexporter.com)