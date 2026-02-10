# Infosüsteemi nõuded ja punktid

**User:** Andres Moks (andres.moks@gmail.com)  
**Created:** 2/10/2026 21:53:41  
**Updated:** 2/11/2026 0:05:07  
**Exported:** 2/11/2026 0:06:35  
**Link:** [https://chatgpt.com/g/g-p-698b7a30d6848191bacb8cff5277cb17-intekad/c/698b8cb7-56a8-8388-8ecb-73a90a88ec19](https://chatgpt.com/g/g-p-698b7a30d6848191bacb8cff5277cb17-intekad/c/698b8cb7-56a8-8388-8ecb-73a90a88ec19)  

## Prompt:
Piiratud seireseadmed Recording 381\_16k\_mono\_PRE180\_vadlight\_20260210\_043347.txt

Document

kasutades lisatud kontseptsioonidokumenti, too välja kõik transkriptsiooni olulised punktid - millest tulenevad (tulevased) nõuded infosüsteemile, muud olulised punktid

## Response:
Thought for 1m 0s

Allpool on transkriptsioonist välja tulevad **olulised punktid** ja neist tulenevad **(tulevased) nõuded infosüsteemile**, seostades need kontseptsioonidokumendi põhimõtetega (rollipõhisus, varjamine/hägustamine, auditeerimine jne).

Kontseptsioonidokument

1) Andmete salastustase (AK vs “piiratud”) peab olema süsteemi esimese klassi omadus
------------------------------------------------------------------------------------

**Transkriptsiooni punkt:** “Avalikult ei tohi”, praktikas üritatakse hoida asju **AK** nii kaua kui võimalik, aga teatud sisu läheb vältimatult **piiratud** tasemele; kui analüüs on “piiratud”, siis vaatamiseks peab inimesel olema vastav luba.

Piiratud seireseadmed Recording…

Piiratud seireseadmed Recording…

**Nõuded infosüsteemile:**

*   Igal andmeobjektil (sensorivoog, katvuskaart, raport, algoritmi reeglid, manused) peab olema **salastustaseme märgend** + reeglid, kes mida näeb (mitte ainult “kasutajaroll”, vaid ka asutuse/ala/atribuutide põhine). See haakub kontseptsiooni **ABAC/rolli- ja atribuudipõhise ligipääsuga** ning auditeeritavusega.
    Kontseptsioonidokument
*   “Downgraded view”: sama sündmus peab olema kuvatav ka **madalama ligipääsuga** keskkondades (nt juhtimiskeskus “ei ole piiratud”), kuid **sensitiivsed kihid** (positsioonid/katvus/meetodid) peidetud või hägustatud. See haakub kontseptsiooni katvuste **varjamise/hägustamise** ideega.
    Piiratud seireseadmed Recording…
    Kontseptsioonidokument

2) Sensorite asukohad ja katvused on tõenäoliselt “piiratud” (ja see lööb kohe kasutusloogikat)
-----------------------------------------------------------------------------------------------

**Transkriptsiooni punkt:** “katvusanalüüsid peavad olema piiratud”; arutelu, kas panna “kõik positsioonid” piiratud alla; “radari katusepiirkonnad” jne.

Piiratud seireseadmed Recording…

Piiratud seireseadmed Recording…

**Nõuded infosüsteemile:**

*   Katvuse/positsiooniandmete haldus peab toetama 3 režiimi: **täpne**, **hägustatud**, **täielikult peidetud** (kasutaja/asutus/ala järgi). Kontseptsioon kirjeldab seda otsesõnu.
    Kontseptsioonidokument
*   Planeerimisvaade (katvus/katvuse kvaliteet) peab olema **teadmisvajaduse põhine**: nt patrull näeb “kas kaetus on olemas”, mitte sensoripunkti koordinaate. (Kontseptsioonis on see küsimus eraldi välja toodud.)
    Kontseptsioonidokument

3) “AI komponent” / taktikalised reeglid on julgeoleku mõttes piiratud
----------------------------------------------------------------------

**Transkriptsiooni punkt:** AI-le antavad käitumisreeglid (“kui objekt ees, siis keera nii”) kvalifitseeritakse “piiratud”, sest vastane saab mustrist õppida.

Piiratud seireseadmed Recording…

Piiratud seireseadmed Recording…

**Nõuded infosüsteemile:**

*   Reeglimootori/AI otsustusloogika konfiguratsioonid peavad olema **eraldi turbekihis** (salastustase, ligipääs, audit, versioonihaldus).
*   Võimekus pakkuda “explainability’t” ainult vastava loaga (muidu näita vaid tulemit, mitte põhjendusi/reegleid).

4) Hanked ja dokumentide käitlemine mõjutavad süsteemi (mitte ainult paberimajandust)
-------------------------------------------------------------------------------------

**Transkriptsiooni punktid:** läbirääkimistega hange, 2-etapiline loogika (kvalifikatsioon → konfidentsiaalsus/“konfliktlepingud” → ligipääs), ning nõue panna juba kvalifitseerimistingimustesse, et pakkujal oleks “sama töötlussüsteem” piiratud dokumentide jaoks.

Piiratud seireseadmed Recording…

Piiratud seireseadmed Recording…

Piiratud seireseadmed Recording…

**Nõuded infosüsteemile (ja ökosüsteemile):**

*   Süsteem peab toetama “väliste osapoolte” (nt arendaja/integraator) ligipääsumudelit, kus ligipääs on **ajaliselt ja sisuliselt piiratud**, auditiga ja vajadusel eraldi keskkonnas.
*   Dokumentide/artefaktide komplektid peavad olema **jagatud avalik/AK vs piiratud lisadeks** (annexid), et mitte “tappa hanget” ülemäärase piiranguga, mida transkriptsioonis kardetakse.
    Piiratud seireseadmed Recording…

5) “Nortalile pole vaja detaile” → nõuded selgele turvapiirile ja terminoloogiale
---------------------------------------------------------------------------------

**Transkriptsiooni punkt:** arutelu, et partnerile piisab teadmisest “kinnine võrk”, ei pea lahti kirjutama krüpto/andmete liikumist; terminid “SMIT sisevõrk / seirevõrk / turvavõrk” vajavad ühtlustamist.

Piiratud seireseadmed Recording…

**Nõuded infosüsteemile:**

*   Süsteemi arhitektuuris peab olema **selge võrgu- ja tsoonimudel** (kinnine seirevõrk, liidestused, logimine), mida saab kirjeldada ka “madalama detailsusega” versioonina.
*   Ühtne terminoloogia (nt “seirevõrk” kui ametlik mõiste) peab minema ka UI-sse, dokumentatsiooni ja rollimudelisse.

6) Püsianalüütika / “muutuse tuvastus” (mitte ainult droonid) on lisavajadus
----------------------------------------------------------------------------

**Transkriptsiooni punkt:** soov “järeleandmeanalüüsiks” – kaamera/andmeanalüüs, mis järjepidevalt “pildistab üle” ja järeldab, kas objekt ilmus/ kadus (näide veealusest osast).

Piiratud seireseadmed Recording…

**Nõuded infosüsteemile:**

*   Vajadus **ajaloopõhisele võrdlusanalüüsile** (change detection), sündmuste sidumisele “enne/pärast” ja tulemuste talletusele koos auditiga.
*   See haakub kontseptsiooni “reaalaja + ajalooinfo” ja sündmuste hilisema analüüsiga, kuigi siinses transkriptsioonis fookus laieneb droonidest laiemaks seireanalüütikaks.
    Kontseptsioonidokument

7) Nõuete sõnastamise praktika: “vähemalt / parem või samaväärne” + mõõdetavad KPI-d
------------------------------------------------------------------------------------

**Transkriptsiooni punkt:** soovitus panna igale poole “vähemalt / parem või samaväärne”; mainitakse ka “vähemalt …” ja “vähemalt seitse päeva peab nägema” kui tüüpi mõõdik.

Piiratud seireseadmed Recording…

**Nõuded infosüsteemile:**

*   Mittefunktsionaalsed nõuded (retentsioon, nähtavus/saadavus, logi säilitus, katvusindikaatorid) peavad olema **mõõdetavad KPI-dena**, sõnastatud “at least” põhimõttel.
*   Süsteem peab toetama **ajaloo sirvimist** ja häirete ajalugu (kontseptsioonis olemas).
    Kontseptsioonidokument

* * *

### Võimalik komistuskivi / alternatiivne vaade

Suurim risk on **üle-klassifitseerimine**: kui katvused/positsioonid/analüüsiloogika lähevad liiga vara “piiratud”, siis kukub ära kasutus “mittepiiratud” juhtimiskeskustes ja hangetel väheneb konkurents (transkriptsioonis see hirm käib läbi). Lahendus kipub olema **mitmekihiline pilt** (täpne vs hägustatud vs peidetud) + rangelt auditeeritud ligipääs, mitte “kõik või mitte midagi”.

Piiratud seireseadmed Recording…

Kontseptsioonidokument

## Prompt:
Egert Recording 371\_16k\_mono\_PRE180\_vadlight\_20260210\_022258.txt

Document

kasutades lisatud kontseptsioonidokumenti, too välja kõik transkriptsiooni olulised punktid - millest tulenevad (tulevased) nõuded infosüsteemile, muud olulised punktid

## Response:
Thought for 2m 55s

1) Infosüsteemi siht ja kasutusloogika (kontsept + intervjuu kooskõla)
----------------------------------------------------------------------

*   Infosüsteem koondab eri drooniseire sensorite (Remote ID, RF, radar jne) reaalaja- ja ajalooinfo ühtseks pildiks ning kasutab sensor fusion’it valehäirete vähendamiseks; kasutajale kuvatakse filtreeritud, rollipõhine olukorrapilt.
*   Häireloogika on geopiiridel/kaitstavatel aladel (asutus saab häire geopiiri rikkumisel), lisaks ajalugu ja offline/rikke teavitused.
*   Ligipääs peab olema rolli+atribuutide põhine, piirkondlikult piiratud ja auditeeritav; lisaks “varjatud ala”/“nähtamatu” objektide kontseptsioon.

2) Transkriptsioonist tulenevad tulevased nõuded infosüsteemile
---------------------------------------------------------------

### A. Integratsioonimuster: reaalaja vood vs päringud + adapterid

*   Süsteem peab toetama kahte klassi andmeid: (1) “staatilised/päringuga” andmed (nt piirangualad/NOTAM/AIP), (2) reaalaja/voo-andmed sensoritelt (track’id, sündmused, telemeetria).
*   Vajalik on standardne integratsioonikiht/adaptrite loogika: tänane pilt sisaldab Hextechi (Remote ID) ja teisi (Ranteleon, EXTEC jt), kus eri allikad annavad eri tüüpi andmeid ja eri tarneviise.
*   Hextechi “lennuajaloo play” kasutusviis vihjab nõudele: süsteem peab oskama sama kanalit pidi nii live’i kui ka ajaloo “tagasimängu” serveerida (nt websocket/event-stream), koos autoriseerimisega.

### B. NOTAM/AIP “piiranguala” andmete ingest on eraldi töövoog

*   Intervjuus rõhutatakse, et NOTAM-ite parsimine/normaliseerimine on “päriselt peavalu” (mitte triviaalne ETL); seega on vaja eraldi ingest-teenust, valideerimist ja robustset ajagraafikute käsitlust (tööpäevad/pühad/kehtivus).
    Egert Recording 371\_16k\_mono\_PR…
*   Kontsept seob piirangualad otseselt NOTAM/AIP-ga, st sellest saab süsteemi “põhiandmestik”, mitte lisavidin.
    Kontseptsioonidokument

### C. X-tee: juriidiline “must”, tehniliselt mitte reaalaja-voog

*   Intervjuu toob konflikti: asutuste vaheline andmevahetus on juriidiliselt surutud X-tee raamile, kuid reaalaja “striim” ei sobitu X-tee päring-vastus mustriga.
    Egert Recording 371\_16k\_mono\_PR…
*   Seega tuleb nõudena lahendada **kaherajaline arhitektuur**:
    1.  X-tee kaudu “asutuste vaheline jagatav” (kokkuvõtted, päringud, metaandmed, väljavõtted),
    2.  reaalaja voo jaoks eraldi turvakanal (nt websocket/queue), kus X-tee võib olla ainult ligipääsu- ja auditraami osa (või mitte sedagi).

### D. Kõrge käideldavus: active-active + failover + “mitte üks server”

*   Nõue: keskne komponent ei tohi olla SPOF; ideaalis sensor või vahekiht saadab paralleelselt vähemalt kahte keskserverisse (active-active), et uuendused/rikked ei katkestaks seiret.
*   DB-kihi failoverit käsitletakse “mitte kas, vaid millal” teemana; järelikult nõue on disainida HA nii rakenduse kui andmekihi tasemel (replikatsioon, automaatne failover, taastetestid).
*   Taristu-eelistus: keskne server kui VM (nt Proxmox), et saaks hostide vahel liigutada; suurte andmemahtude korral tuleb arvestada ka füüsilise serveri variandiga.

### E. Andmemahud ja säilitamine: “DB-s ainult viide”, eraldi salvestuskiht

*   Nõue: suured failid/toorandmed (eriti radariga seotud) ei tohiks elada andmebaasis; vaja on eraldi salvestuskihti (objektstore/NAS/arhiiviserver), DB-s viidad+meta.
*   Nõue: otsustada, **mis tasemel** salvestatakse (toorandmed vs töödeldud track’id vs “radari pilt”), sest see mõjutab nii mahtu kui hilisemat tõendusväärtust ja taasesitamist.

### F. Tõendusmaterjal / “taatlus” ja ahela terviklus

*   Intervjuu tõstab lauale, et kui andmeid hakatakse kasutama tõendusmaterjalina, võib tekkida vajadus taatlemise/laadse juriidilise sertimise järele (paralleel numbrituvastuse/kiiruskaameratega).
*   Järelikult nõuded: täpne ajasünk (NTP/PTP poliitika), muutmiskindlad auditlogid, andmete tervikluse kontroll (hash/immutability), ekspordi “chain-of-custody” ning selge retention-poliitika (“palju tohib hoida”).

### G. Turvavõrk ja ühenduvus: kinnine sisevõrk, ruuteripõhine ligipääs, kaug-haldus

*   Nõue: sensorid/servrid peavad töötama kinnises turvavõrgus; ligipääs piirkondadest käib turvavõrgu ruuteri kaudu.
*   Välipaigaldised: osal objektidel optika, osal 4G/5G; ruuteri valik on seotud sellega, et ei nõutaks fikseeritud IP-d ja et töökindlus oleks parem kui “odavatel ruuteritel”.
*   Nõue: seadmed peavad olema “meie sides”, et saaks kaugelt restartida, monitoorida ja turvaliselt hallata (mitte “paned üles ja unustad”).
    Egert Recording 371\_16k\_mono\_PR…

### H. Ligipääsude tegelik valupunkt: tänased tööriistad ei piira piisavalt

*   Intervjuus on otsene kriitika õiguste süsteemide piiratuse kohta (“õiguste süsteem… kasutajaid õigustega piirata” on nõrk/vaevaline). See teeb kontseptsiooni ABAC/RBAC ja auditi nõude “mitte nice-to-have”, vaid põhifunktsiooni.

### I. Operatiivne omaniklus ja “kes kellele mida pakub”

*   Seadmed/teenused on segamini: osa ostetakse (nt seadmed), osa tarbitakse teenusena; lisaks SKA-lt seadmete üleandmise/teenuse vastu ligipääsu skeem (paberimajandus, rahastus, kontod). Nõue: infosüsteem peab toetama multi-tenant/asutusepõhist omandit, arveldus-/ligipääsuloogikat ja seadmete elutsüklit.
*   Lisaks on “valvebüroo” kui reaalne kasutaja/klient; vaja on eraldi kontosid/ajutisi ligipääse (mitte “külakonto”) ja selgeid rolle välistele partneritele.

### J. Tehnoloogiavalikud peavad arvestama haldusvõimekust (mitte ainult “ideaalstack”)

*   DB eelistus MS SQL on põhjendatud olemasoleva know-how ja admin-kulu argumendiga; open-source alternatiiv võib olla teoreetiliselt ahvatlev, aga ilma haldusvõimekuseta riskantne. Nõue: arhitektuur peab sisaldama realistlikku operatsioonimudelit (kes haldab, millise SLA-ga).

### K. Arendus- ja testkeskkond: eraldi, segmenteeritud, simulaatoritega

*   Intervjuu kirjeldab, et “kinnises” arvutis/arenduskeskkonnas ei saa praktiliselt midagi teha; vaja on eraldi dev masinat ja segmenteeritud keskkondi, et prototüübid ei segaks turvavõrku.
*   Väga konkreetne nõue: luua “füüsilise sensori”/API endpoint’iga simulaator (mock-sensor), et arendust teha ilma pärisseadmeteta ja ilma kohe turvavõrku ronimata.

### L. Hangete/äririskide õppetund: vältida karbitoote “karpe kuhjav” integratsioonipõrgut

*   Intervjuu sõnastab otse: eesmärk on “rätsepaülikond”, mitte karbitoode; muidu tekib järjest “veel üks karp” ja lõpuks klapitakse integraatoreid pool aastat ning süsteem läheb peenrasse. Nõue: hanke-eelanalüüs peab tooma probleemid välja enne hanget (sh “kirjutame teadlikult välja, millega hetkel ei tegele”).

### M. Vendor lock-in / API hinnastamine kui arhitektuuri nõue

*   Intervjuus on väga konkreetne risk: API ligipääs võib olla kallis (nt “40k aastas”) ja tekitada kinnise süsteemi; varasemad litsentsipoliitika muutused on juba sundinud ümber ehitama “ilma litsentsita” lahenduse poole. Nõue: lepingud+liidesed peavad garanteerima andmete väljavõetavuse ja integraatori sõltumatuse.

3) Üks potentsiaalne karukoht / alternatiivvaade
------------------------------------------------

Kui “päris reaalaja” jaoks X-tee kõrvale ehitatakse teine kanal, võib hiljem tekkida surve põhjendada, miks osa infot ei liigu X-tee kaudu (audit/juriidika/standardid). Praktiline kompromiss on hoida X-tee-s **ametlik** päringuvõimeline “tõde” (juhtumid, väljavõtted, metaandmed, õiguspärane eksport) ja reaalaja kanal “operaatori tööriistana”, mille väljundid (häired/juhtumid) materialiseeritakse X-tee maailma.

## Prompt:
H geoinfo Recording 407\_16k\_mono\_PRE180\_vadlight\_20260210\_023856.txt

Document

H krllega raakida Recording 397\_16k\_mono\_PRE180\_vadlight\_20260210\_024004.txt

Document

H osapooled kutsuda Recording 404\_16k\_mono\_PRE180\_vadlight\_20260210\_024152.txt

Document

kasutades lisatud kontseptsioonidokumenti, too välja kõik transkriptsiooni olulised punktid - millest tulenevad (tulevased) nõuded infosüsteemile, muud olulised punktid

## Response:
Thought for 57s

Allpool on **H-seeria transkriptsioonide** (geoinfo / kellega rääkida / osapooled kutsuda) olulisemad punktid, mis kontseptsioonidokumendi valguses muutuvad **infosüsteemi nõueteks** või on muul moel kriitilised sisendid.

1) Sensorid, kihid ja prioriteedid (operatiiv + planeerimine)
-------------------------------------------------------------

*   Kaardikihtidel eristatakse seadmetüüpe / objekte (nt “kollased” radarid, “roosad” RF, “oranžid” positsioonid) ja räägitakse prioriteetidest (1. prioriteet vs järgmine prioriteet / “teenijate app”, millele pole veel raha). Süsteem peab toetama **kihilist vaadet + prioriteedimärgistust + staatuseid** nii olemasolevatele kui planeeritavatele sensoritele.
    H geoinfo Recording 407\_16k\_mon…
*   Sisend vihjab, et “tulevik on väga muutuv” ja seadmeid tuleb sinna, “kuhu kiiresti vaja” → nõue: **kiire lisatavus / ümbertõstetavus** (asset lifecycle: planned→installed→inactive) ning UI/andmemudel, mis ei eelda püsivat sensorivõrku.
*   Planeerimisvaates peab saama vaadata katvust ja planeeritavaid paigaldisi; kontseptsioonis on see otseselt sees (“Planeerimine – sensorite katvusalade vaade”, sh vajadusel hägustatult).
    Kontseptsioonidokument
*   Transkriptsioonis on näiteid “kellegi teise kihist” ja eraldiseisvatest kihtidest (nt avaliku ruumi kaamerad, “Itaalia kiht”) → nõue: **andmeallikate/kihtide metaandmestik** (omanik, nähtavus, klassifitseeritus, renderdusreeglid, usaldus).

2) Geoinfo alus ja jälgitavus (“mille järgi ma panin selle nõude”)
------------------------------------------------------------------

*   Viidatakse Maa-ameti joonistele/andmetele kui “tõenduslikule alusele”, mille järgi otsuseid/mahtusid pandi → nõue: süsteemis peab olema **geoinfo allika viitamine/versioonimine** (millise alusandmestiku järgi arvutus/otsus tehti).
    H krllega raakida Recording 397…
*   Arutatakse alasid ja pindalasid (ehitatav ala, metsaala jms) → nõue: **ruumiarvutused** (pindalad, lõiked, katvuse statistika) ning nende eksport raportisse/hanke lisasse.
    H krllega raakida Recording 397…

3) Hankemenetlus ja tööjärjekord (mõjutab süsteemi tarnet ja scope’i)
---------------------------------------------------------------------

*   Räägitakse, kas teema peaks üldse olema “ehitustööde hange” vs “muu menetlus / hübriid”, ning et **süsteem peaks enne valmis olema, kui seadmeid saab paigaldama hakata** → nõue: projektis peab olema **selge etappide ja sõltuvuste mudel** (software readiness enne field-install) ja võimekus tõendada seda ajakavas.
*   Tuuakse välja, et paigaldus sisaldab “kaabli puhumist”, “telemeetria paigaldamist”, “gaasikustutussüsteemi paigaldamist” jne → see on sisend, et süsteemi poolelt on vaja **paigalduse/objekti taristu meta** (mast, side, toide, keskkonnatingimused, valmidus), muidu jääb sensorite rollout “pimedaks”.

4) Õiguslik raam (mitte ainult IT)
----------------------------------

*   Arutelu “patrull vs liiklusseadused” analoogiana drooniteemal → ootus, et tekivad **riiklikule käitlejale/tegutsemisele erandid** (lennundusseaduse revisjon). Süsteemile tähendab see: vaja on **rollid/õigused + tegevuslogi** nii, et hiljem saab tõendada, kes mida nägi/tegi ja mis volituse alusel.

5) Osapooled, juhtimine ja “kes kuhu pilti tahab”
-------------------------------------------------

*   Väga praktiline teema: keda kokku kutsuda ja kellega eraldi rääkida (KV, Elering, sadamad, vanglad/Justiits, Kliimaministeerium/raudtee jne), sh et ministeerium “oskab öelda, kellel allasutustes on vajadus” → nõue: **asutuste/objektide/omanike mudel** (kes on tarbija, kes on omanik, kes on kontakt) ning kasutajahalduse protsess “ministeerium → allasutus” suunal.
*   ETOde (nt sadamad, Elering) motivatsioon: droonid lendasid üle ja “nad ei saanud midagi teha” → süsteem peab toetama **kriitilise taristu vaadet** (objektipõhised kaitstavad alad, häired, ajalugu) täpselt nii nagu kontseptsioonis “kaitstava ala” ja häireloogika ette näeb.
*   “Juhtimiskeskused” ja “kuhu info kokku jookseb” → nõue: süsteemis peab olema **mitme keskuse töörežiim** (mitu operatiivkeskust/vaatamisõigustega üksust, erinevad ekraanid/rollid) ja selge “single source of truth” sündmuste jaoks.

6) Ligipääs, nähtavus ja info eraldamine (kontseptsioon + intervjuu kooskõla)
-----------------------------------------------------------------------------

*   Osapoolte rohkus ja “kes vajab mida näha” kinnitab kontseptsiooni nõuet: **rolli- ja atribuudipõhine ligipääs, regionaalne piiramine, auditeeritavus**.
*   Sensorite asukohtade/katvuse varjamine ja “hägustatud katvuskaardid” muutuvad praktiliseks (kui laua taga on KV, ETOd, era jne) → nõue: **nähtavusfiltrid andmetasandil** (mitte ainult UI-s).
    Kontseptsioonidokument

Üks potentsiaalne karukoht / alternatiivvaade
---------------------------------------------

Kui ehitad süsteemi “osapoolte/menetluse” järgi, tekib oht, et lahendus muutub **projektijuhtimise registriks**, mitte seire-COPiks. Hoia rangelt lahus: _operatiivne seire-andmevoog_ vs _organisatsioon/objektid/rollid_ (viimane on vajalik, aga ei tohi hakata esimest dikteerima).

## Prompt:
Hanna arh Recording 403\_16k\_mono\_PRE180\_vadlight\_20260210\_024237.txt

Document

kasutades lisatud kontseptsioonidokumenti, too välja kõik transkriptsiooni olulised punktid - millest tulenevad (tulevased) nõuded infosüsteemile, muud olulised punktid

## Response:
Thought for 46s

1) Mahud, kasv ja regionaalne jaotus (planeerimisnõuded)
--------------------------------------------------------

*   Intervjuus tuuakse sisse **indikaativne maht**: kogu piiril suurusjärk “~15 radarit ja ~60 seirepositsiooni/punkti” 2027 lõpuks, ning “tulevikus võib veel kahekordistuda”. Sellest järeldub, et infosüsteem peab skaleeruma **positsioonide/sensorite arvus** ja toetama piirkondlikku planeerimist (nt Narva lõik kui alamjaotus).
    Hanna arh Recording 403\_16k\_mon…
*   Kontseptsioonis on vastav planeerimisvaade (katvused, asukohtade analüüs, hägustamine) – siit tuleb nõue, et planeerimine ei ole “lisavaade”, vaid põhifunktsioon, mis peab töötama ka osalise info ja prognoosidega.

**Nõuded süsteemile:**

*   andmemudel “sensor/positsioon/punkt” peab toetama _planned → installed → active/inactive_ elutsüklit ja _regionaalset jaotust_;
*   katvuse/valmiduse indikaator kasutajale (ka siis, kui täpset sensoriasukohta ei tohi näidata).

2) Hajus arhitektuur + “ülevõtmine” (resilience ja töökorraldus)
----------------------------------------------------------------

*   Korduvalt kerkib “**kui üks kordon/juhtimispunkt läheb maas** (blackout, põleng, rünne), kas ja kuidas teine saab üle võtta” ja mis eeldused selleks on (võrk, läbilaskevõime, füüsilised ühendused).
*   Intervjuus on selge vajadus, et selle kohta oleks “**paber / reeglid / skeem**” (ja et see skeem on tõenäoliselt **piiratud**).

**Nõuded süsteemile:**

*   defineerida arhitektuuris “**operatsioonikeskuse takeover**” režiim: millised vaated/andmed peavad jätkuma, milline on degradeeritud režiim madalal ribalaiusel (nt “kümme inimest korraga” ei tohi süsteemi ära lämmatada).
    Hanna arh Recording 403\_16k\_mon…
*   keskne logimine/audit + sündmuste ajalugu peab olema säiliv ka osalise katkestuse korral (kontseptsiooni auditeeritavuse nõue + operatiivsed häired).

3) Võrgusegmentatsioon ja “üks pilt” eri võrkudest
--------------------------------------------------

*   Tähtis praktiline fakt: **radaripildid** ja **maismaa-kaamerad** jooksevad **eri võrkudes** (SMIT vs DTA sisevõrk) ning osadel juhtudel käib liiklus **läbi Tallinna**, mis tekitab viidet. Milestone’i puhul “näevad kõik”, aga teekond/latentsus on piirang.

**Nõuded süsteemile:**

*   infosüsteem peab toetama **mitme turvadomeeni/segmendi** andmeplaneerimist: ingest/adapterid ja õigused peavad arvestama, et sama “sündmus” võib olla eri võrkudes ja eri kvaliteediga (viide, kaadrisagedus, katkestused);
*   kasutajale tuleb anda “**ühtne olukorrapilt**”, kuid tehniliselt peab süsteem oskama teha _proxy/caching/transcoding_ ja kuvada kvaliteedi-metadata (nt “viitega”, “piiratud läbilase”).

4) Edge/“serv” igasse kohta + keskhaldus
----------------------------------------

*   Intervjuus jookseb läbi, et “kõikidesse kohtadesse, kuhu planeerime, on vaja **vastav serv/edge server**”, kuid täpsed nõuded pole veel selged; hinnasuurusjärk “10–20k” per punkt kõlab realistliku eelarveridadena.
*   Kõrvuti mainitakse alternatiive: oma riistvara vs kallis “ratastel server” (Anduril), ja ebakindlus, mida üldse edge peal jooksutama hakatakse.
    Hanna arh Recording 403\_16k\_mon…

**Nõuded süsteemile:**

*   defineerida **standardne edge-node roll** (mida ta teeb: sensorite ühendamine, lokaalne puhver, minim. fusion/filtreerimine, turvaline edastus, kaug-haldus);
*   keskne konfiguratsiooni- ja monitooringukiht (kontseptsiooni “sensori rike / ühenduse katkemine” teavitused).

5) Litsentsid, TCO ja vendor lock-in kui arhitektuursed nõuded
--------------------------------------------------------------

*   Tuuakse sisse “**10k/aasta**?” tüüpi litsentsikulu (Nõud/Nortal/“kogu kupatus” – transkriptsioonis on see lahtine, aga valupunkt on selge: ei taheta ootamatuid püsikulusid).
    Hanna arh Recording 403\_16k\_mon…
*   Väga otseselt räägitakse **ülalpidamisest ja inimressursist**: “pärast on vaja raha ja inimesi juurde”, ning “karbitoode”/mitme karbi kuhjamine on halb stsenaarium.

**Nõuded süsteemile:**

*   eelistada avatud liideseid ja litsentsimudelit, mis ei muutu “per site/per sensor” lõksuks;
*   ops-kulu minimeerimine: automatiseeritud deploy/uuendused, self-healing, standardne logi/audit, selge monitooring.

6) Turve ja ligipääs: “skeemid on piiratud” + ABAC/regionaalne piiramine
------------------------------------------------------------------------

*   Võrguskeemide ja resilientsi skeemide kohta öeldakse otseselt, et see on **piiratud**. See tähendab, et infosüsteemi dokumentide/artefaktide (skeemid, konfiguratsioonid) käitlemine peab ise olema rolli- ja atribuudipõhine.
*   Kontseptsioon nõuab rolli+atribuutide põhist ligipääsu, regionaalset piirangut ja auditeeritavust, samuti sensorite asukohtade/katvuste varjamist/hägustamist.

**Nõuded süsteemile:**

*   ABAC (asutus/roll/piirkond/salastustase) peab kehtima nii reaalaja vaadetele, ajaloo ekspordile kui ka admin/planeerimisandmetele (sh katvuskaardid).

7) Sidusrühmad ja rollid (mõjutab õiguste mudelit)
--------------------------------------------------

*   Lõpus joondatakse, kellega rääkida ja kes on “teenuse omanik” vs “juht” vs “ground” inimene (Ago, Peep, Toomas jne). See ei ole ainult projektijuhtimine: sellest tuleb **rollikaart** (nt isikukaitse kasutusjuhtum, erivarustuse/procurement vaade).
    Hanna arh Recording 403\_16k\_mon…
*   Kontseptsioonis on isikukaitse ja mobiilne/dünaamiline kaitstav ala kui otsene kasutusjuhtum.

* * *

### Potentsiaalne komistuskivi / alternatiivvaade

“Edge igasse punkti” võib muutuda _hooldusraskeks ja kulukaks_ (palju väikseid servereid = palju rikkeid + palju uuendusi). Alternatiiv on hoida edge roll võimalikult õhuke (puhver + turvaline edastus) ja teha “nutikus” rohkem keskuses—aga ainult siis, kui takeover/degradeeritud režiim (madal ribalaius, katkestused) on päriselt läbi testitud.

## Prompt:
Narva keskus Eerik Recording 386\_16k\_mono\_PRE180\_vadlight\_20260210\_034724.txt

Document

Narva keskus Tx2 Recording 385\_16k\_mono\_PRE180\_vadlight\_20260210\_035244.txt

Document

kasutades lisatud kontseptsioonidokumenti, too välja kõik transkriptsiooni olulised punktid - millest tulenevad (tulevased) nõuded infosüsteemile, muud olulised punktid

## Response:
Thought for 4m 6s

1) Ligipääs, turvalisus ja “piiratud” info käsitlus
---------------------------------------------------

*   **“Kes mida näha tahab / tohib / ei tohi” on keskne** → infosüsteemis peab olema _range rolli- ja atribuudipõhine ligipääs_ (ABAC/RBAC), sh piirkondlik segmenteerimine ja auditeeritavus.
*   **Osapoolte ligipääsu vajadus on lai (sadamad, vanglad, ministeeriumid, võimalik raudtee jne)** → ligipääs peab olema _organisatsiooni + allasutuse + kasutusjuhtumi + geograafia_ põhiselt juhitav (mitte “kõik näevad kõike”).
*   **Katvusanalüüsid ja skeemid kipuvad minema “piiratud” alla** → süsteem peab toetama _mitme turbetaseme andmemudeleid_ (nt sama objekti “täpne” vs “hägustatud” vaade), muidu jääb suur osa kasutajaid reaalselt infota.
*   **AI/reaktsiooniloogika (nt “kui juhtub X, tee Y”) käsitletakse julgeoleku vaates kinnise mustrina** → vajadus _eraldada ja kaitsta_ taktikad/reeglid/soovitused (nt eraldi teenus, eraldi ligipääs, eraldi logimine).
    Piiratud seireseadmed Recording…
*   **Sensorite asukoht/katvus võib olla varjatav** → infosüsteemis peab olema esimese klassi funktsioon “varja / hägusta / näita ainult teadmisvajaduse alusel”.

2) Andmevahetus, võrguarhitektuur ja töökindlus
-----------------------------------------------

*   **X-tee kontekst: striim vs päring-vastus** → arhitektuur peab toetama _kahte režiimi_: (a) X-tee/teenuspõhised päringud-jagamised ja (b) reaalaja sündmusvood/striim (tõenäoliselt X-teest eraldi kanaliga), kuid juriidiliselt “X-tee raamistikus” või selgelt põhjendatult sellest väljaspool.
    Egert Recording 371\_16k\_mono\_PR…
*   **Erinevad sensorid/videod on eri võrkudes (SMIT vs DTA sisevõrk), Milestone’i näevad “kõik”, Narva võib tulla viitega läbi keskse turvavõrgu** → vaja _adapterikihti_ ja selgelt kirjeldatud _võrguületuse mustreid_ (latentsus, ribalaius, turvatsoonid, logimine).
*   **Blackout / kordon “lendab õhku” / üle-võtmise loogika** → süsteem peab toetama _hajusat toimimist ja talitlusvõimet katkestustes_ (kohalik töö + hilisem sünk; vähemalt “degrade mode”). Nõue: defineerida “hajus arhitektuur” mõõdetavalt (mis jääb tööle, kui link/üksus kukub).
*   **“Kõik info ühes keskkonnas, et ei peaks mitut asja lahti hoidma”** → tugev nõue ühtsele olukorrapildile ja ühele UI-le, mis koondab erinevate sensorite vaated vastavalt õigustele.
*   **Seadmete side/haldus: praegu 4G, aga tahetakse “meie sides”, et saaks kaugelt restartida/monitoorida/turvaliselt hallata** → infosüsteemil peab olema _seadmehaldus/health_ (ühendus, restart, telemeetria, alarmid).

3) Häired, geopiirid ja operatiivtöö voog
-----------------------------------------

*   **Puhvertsooni vajadus ümber NOTAMi/keeluala (“anna juba enne alarmi”)** → “kaitstava ala” kõrval peab toetama _puhvreid/varajasi hoiatusalasid_ (geofencing + buffer).
*   **Ergonoomika: operaator ei taha “ise otsida ja tõestada”, vaid süsteem peab “karjuma”** → häiresüsteem peab toetama _aktiivseid teavitusi_, prioriteete ja vähendama käsitööd; see haakub kontseptsiooni tundlikkusrežiimidega (vale-positiivsete koormus).
*   **Mobiilne “taustal teavitav” kasutus (patrullid)** → mobiilirakenduse nõuded “taustal häire” ja “dünaamiline kaitstav ala” on otse kontseptsioonis; transkriptsioon kinnitab operatiivvajadust.

4) Skaalautuvus, maht ja ressurssid
-----------------------------------

*   **Sensorite maht: “15 radarit ja ~60 … 2027 lõpuks”, keskmiselt ~20 positsiooni / kordon, võimalik kordistamine** → nõuded: skaleeruv ingest, indeksid/ajalooladu, mitme sensori tüübi normaliseerimine, koormusmudelid (prefill: reaalaja vs ajalugu).
*   **Ülalpidamine ja inimressurss** → nõue: elutsükli kulumudel (ops, hooldus, litsentsid, seire), mitte ainult “hange ja valmis”; süsteemi logimine/monitooring peab olema disaini osa.
*   **Edge serverid igasse planeeritavasse punkti, serveri suurusjärk 10–20k, Andurili “ratastel server” liiga kallis, oma tarkvara vähendaks litsentse** → nõue: toetada _edge-deployment’i_ ja kirjeldada miinimumnõuded (CPU/RAM/storage/network) + update/rollback + keskne haldus.

5) Õiguslik raam ja “erandid”
-----------------------------

*   **Lennundusseaduse revisjon / “riiklik käitleja” ja erandid** → infosüsteemis peab olema võime käsitleda _rollidest tulenevaid erandeid_ (nt loaga/asutuse droonid), koos auditi ja põhjendustega. Kontseptsioonis on droonistaatused (nt “Loaga”, “Sõbralik”).

6) Hankimine, IP ja konfidentsiaalsus (infosüsteemi nõueteks tõlgituna)
-----------------------------------------------------------------------

*   **NDA / kvalifitseerimine / “ettevõtte konfidentsiaalne”** → infosüsteemi vaates: (a) dokumentide/artefaktide turbetasemed ja jagamine (b) tarnija andmete eraldi käsitlus (c) vajadus tagada, et tarnija lahendus sobitub “töötlussüsteemi” ja turbereeglitega.
*   **“Avatud kood / vähemalt õigus ise arendada” + teised riigid teevad sama** → nõue hankele: lähtekoodi escrow/omandiõigus või piisav arendusõigus, et vältida lukustumist ja lubada adapterite/loogika edasiarendust.
    Narva keskus Eerik Recording 38…

7) Arendus- ja testkeskkond (praktiline takistus, mis muutub nõudeks)
---------------------------------------------------------------------

*   **Vajadus prototüüpida väljaspool PPA kinnist võrku; soov “plangumasin/VM” avalike tööriistadega** → nõue: _dev/test keskkond_ (synthetic/sanitized data, demo-sensorid), mis ei nõua kohe turvavõrgu täiskoormust, kuid mille tulemused on hiljem ülekantavad.

8) Muud olulised punktid (mitte otsene funktsionaalnõue, aga mõjutab)
---------------------------------------------------------------------

*   **“Sadam oli karjuja” (droonid üleval, “ei saanud midagi teha”)** → kasutusjuhtum “kriitiline taristu/era- või poolriiklikud objektid” tuleb nõuete kataloogi (kes näeb, mis ajaga reageerib, mis tõend).
    H krllega raakida Recording 397…
*   **Koolituse ja rollijaotuse kvaliteet (kaugseiregrupp vs kohalik piirivalvur, ebakõlad koolitustel)** → süsteemi kasutuselevõtu nõue: rollid + töövood peavad sobima nii “keskne” kui “kohalik” kasutusmudeliga.
    Narva keskus Tx2 Recording 385\_…

* * *

### Üks võimalik pitfall / alternatiivvaade

Kui “piiratud” tase rakendub liiga laiale andmehulgale (nt katvuskaardid, skeemid, analüüsid), siis süsteem võib muutuda _operatiivselt kasutamatuks_ enamikule päris kasutajatest; praktiline lahendus on juba algusest disainida “täpne vs hägustatud” vaated ja teadmispõhine redaktsioon, mitte loota, et “hiljem piirame ära”.



---
Powered by [ChatGPT Exporter](https://www.chatgptexporter.com)