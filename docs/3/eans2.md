# Infosüsteemi nõuded intervjuust

**User:** Andres Moks (andres.moks@gmail.com)  
**Created:** 2/25/2026 22:46:14  
**Updated:** 2/25/2026 23:22:29  
**Exported:** 2/26/2026 0:03:59  
**Link:** [https://chatgpt.com/g/g-p-698b7a30d6848191bacb8cff5277cb17/c/699f5f78-6a9c-838e-8611-6029e4f7e851](https://chatgpt.com/g/g-p-698b7a30d6848191bacb8cff5277cb17/c/699f5f78-6a9c-838e-8611-6029e4f7e851)  

## Response:
Thought for 1m 45s

Allpool on **EANS/TLL intervjuu** sisulised punktid, mis _kontseptsioonidokumendi kontekstis_ muutuvad infosüsteemi nõueteks.

* * *

1) Asutustevaheline andmejagamine ja “piiride tõmbamine”
--------------------------------------------------------

**Intervjuu signaal:** arutatakse, kuidas “asutuste vahel piire tõmmata” nii arhitektuuriliselt kui geograafiliselt (kes mida näeb, kus jookseb vastutuspiir).

Eans tll Recording 432

**Tulevased nõuded:**

*   Süsteem peab toetama **rolli- ja atribuuditõhist ligipääsu (ABAC)** ning **geograafilist segmenteerimist** (piirkonniti õigused).
    Kontseptsioonidokument
*   Iga andmeobjekt (drooniträkk, häire, sensor, ala) peab kandma **klassifitseerimis- ja jagamisreegleid** (asutus, piirkond, vajaduspõhisus), et sama “operatiivpilt” saaks olla erinevatele osapooltele erinev.
    Kontseptsioonidokument
*   Vaja on **andmejagamise poliitikaid**: milline info on _toor_, milline _kinnitatud/valideeritud_, milline _ainult meta_ (nt “on intsident”, ilma detailideta). (Toorinfo vs edasiandmine ilmub protsessikirjeldustes.)
    Eans tll Recording 432

2) Vastutusalad lennujaama ümbruses on “segased” → 3D/vertikaalne geopiir
-------------------------------------------------------------------------

**Intervjuu signaal:** Tallinna lennujaama piirkonnas “jooksevad piirid natuke segaselt” ja jaguneb, kes mille eest vastutab.

Eans tll Recording 432

**Tulevased nõuded:**

*   “Kaitstav ala”/piirangualad ei tohi olla ainult 2D polügoonid: vaja on **kõrgustasemeid/vertikaalseid kihte** (3D geopiir / volume-of-airspace). Intervjuus tuuakse välja, et lennujaama ümbruses on eri “kõrgustasemete” loogika.
    Eans tll Recording 432
*   Süsteem peab võimaldama **vastutuse modelleerimist**: nt lennujaam “objekti kaitse” vs EANS “õhuruum” (erinevad rollid/vaated/teavitused sama sündmuse peale).
    Eans tll Recording 432

3) UTM / kontrollruumide loogika ja lennuplaanid (kaart + torni töö)
--------------------------------------------------------------------

**Intervjuu signaalid:**

*   viidatakse UTM-le ja kontrollruumi loogikale (“täiskontrolli” ruum, admin tasemed jms).
    Eans tll Recording 432
*   kirjeldatakse lennuplaani sisestamist/haldust **kaardi peal** ja selle jõudmist süsteemidesse.
    Eans tll Recording 432
*   kirjeldatakse “torni lennujuhi kasutajaliidest”, kus lennuplaanid vastu võetakse.  
    **Tulevased nõuded:**
*   Süsteem peab toetama **lennuplaanide ingestimist, kuvamist ja seostamist**: lennuplaan ↔ tuvastatud drooniträkk ↔ häire/intsident.
*   Vajalik **integreerimisliides torni/ATC töövoogudega** (nt lennuplaanide vastuvõtu ja kuvamise standardiseeritud API/andmevorming).
*   Kaardil peab olema võimalik **planeerida** ja näha (a) kontrollruumi režiimi loogikat, (b) lennuplaani trajektoori, (c) piirangualasid; see haakub kontseptsioonis toodud “Planeerimise” vaatega.
    Kontseptsioonidokument

4) “Kes mida kasutab/kellele mida” on puudu → sihipärane infojaotus + audit
---------------------------------------------------------------------------

**Intervjuu signaal:** öeldakse, et täna on puudu info “kes …” (sisuliselt: kes on tarbija, kes vastutab, kellele mida edastada).

Eans tll Recording 432

**Tulevased nõuded:**

*   Süsteem peab omama **selget adressaatide mudelit**: teavitused ja andmevood sõltuvad (asutus, roll, vastutusala, režiim).
*   Kõik tegevused peavad olema **auditeeritavad** (kes vaatas, kes muutis alasid, kes märgistas drooni, kes jagas edasi).
    Kontseptsioonidokument

5) Teavitusahel ja “tagasiside” PPA-le / teistele partneritele
--------------------------------------------------------------

**Intervjuu signaal:** mainitakse, et PPA peab saama olulise sisendi “tagasi”.

Eans tll Recording 432

**Tulevased nõuded:**

*   Häire/intsidendi objekt peab toetama **edastamist + tagasisidet** (nt PPA-le: asukoht, ajalugu, usaldusväärsus, seotud lennuplaan, tegevuslogi).
*   Toetada tuleb **operatiivset töövoogu** (reageerimine, menetlemise otsus, staatused), mis haakub kontseptsioonis “Operaator reageerib häirele” ja “ajaloo sirvimine”.
    Kontseptsioonidokument

6) Sensorid: “ainult radarist” ei piisa → multisensor + fusion + usaldusväärsus
-------------------------------------------------------------------------------

**Intervjuu signaal:** küsitakse sisuliselt “millega muuga sa drooni asukohta määrad kui ainult radariga?”.

Eans tll Recording 432

**Tulevased nõuded:**

*   Süsteem peab toetama **heterogeenseid sensoreid** (Remote ID, RF, radar jne) ja **sensor fusion’it** valepositiivide vähendamiseks.
*   Igal tuvastusel peab olema **usaldusväärsuse tase** (confidence), mida kasutatakse nii kuvamisel kui häire genereerimisel; kontseptsioonis on selleks “valmisoleku taseme režiimid / tundlikkus”.
    Kontseptsioonidokument

7) Kasutaja/operatiivvaate UX: drill-down kaardilt, zoom, operaatori asukoht
----------------------------------------------------------------------------

**Intervjuu signaalid:**

*   kirjeldatakse “kaardi peal klikkides näed ära …” ehk drill-down detailvaade.
    Eans tll Recording 432
*   mainitakse zoomi/kaardi kasutust ja keelebarjääri.
    Eans tll Recording 432
*   mainitakse operaatori asukoha vajadust (“operaatori asukohta teada”).
    Eans tll Recording 432
    **Tulevased nõuded:**
*   Kaardil peab olema **objekti detailkaart** (drooniträkk, häire, lennuplaan) koos allika/staatusinfoga.
*   Süsteem peab toetama **mitmekeelsust** vähemalt töökeelena (praktikas EN), kui siht on suhelda/vahendada infot võõrkeelse osapoolega.
    Eans tll Recording 432
*   Mobiili/operatiivkasutaja vaates peab olema võimalik kasutada **asukoha-põhist kaitstavat ala** (dünaamiline geopiir) – see on kontseptsioonis otsesõnu sees.
    Kontseptsioonidokument

8) Standardid, integratsioonid, hange: “mitu track’i” + vältida lukustust
-------------------------------------------------------------------------

**Intervjuu signaalid:**

*   eelanalüüs on pooleli ja “mitu paralleelset track’i”.
    Eans tll Recording 432
*   mainitakse standarditele vastavust ja et eri kihtidel/kaartidel “oma standard”.
    Eans tll Recording 432
*   tõstatatakse hangemudel, kus eriettevõtted hangivad “eritootja lahendusi” (risk: lukustumine).
    Eans tll Recording 432
    **Tulevased nõuded:**
*   Nõuda tuleb **selget integratsioonikataloogi + standardiseeritud liideseid** (API-lepingud, andmevormingud, versioonihaldus), et paralleelsed töölõigud ei toodaks vastuolulist arhitektuuri.
*   Hankes peab olema nõue **vendor-lock-in’i leevendamiseks**: avatud liidesed, andmete eksporditavus, komponentide asendatavus (minimaalselt “andmed ei jää tootja pantvangi”).
    Eans tll Recording 432

* * *

### Üks potentsiaalne komistuskivi / alternatiivvaade

Kui panna liiga varakult “kõik-kõigile” integratsioonid ja 3D geopiirid kohustuslikuks, võib MVP venida ja kasutus jääda sündmuse-põhiselt liiga aeglaseks; realistlikum on alustada **2D + lihtsad kõrgusreeglid + lennuplaani seostamine** ning teha 3D/ATC-sügavintegratsioon etapiti (aga nii, et andmemudel ei pane hiljem jalga ette).

## Response:
Thought for 1m 32s

9) Integratsioonid teiste riigikaitse/asutuste süsteemidega (nt Kaitsevägi) + “arhitektuuri loogika”
----------------------------------------------------------------------------------------------------

**Intervjuu signaal:** küsitakse otse, mis integratsioonid on (nt Kaitseväega) ning rõhutatakse vajadust läbi mõelda arhitektuuri loogika ja andmete liikumine “salvestatud võrgust”.  
**Tulevased nõuded:**

*   Süsteem peab omama **integreerimis-/liideste kataloogi** (mis partner, mis andmed, mis sagedus, mis turvatase).
*   Vajalik **andmevahetuse muster**, mis töötab ka piiratud võrkudes / segmentides (“salvestatud võrk” jms): puhverdus, edastusjärjekorrad, sündmuste taasesitus, katkestustaluvus.
*   Andmeobjektidel peab olema **jagamis- ja klassifitseerimisatribuut** (mida saab üle asutuste turvaliselt edasi anda; mida mitte) – haakub kontseptsiooni “rollipõhine olukorrapilt, varjatud/nähtamatu” ideega.

10) UTM kui “loogika selgitamise” referents → rollid + haldustasemed
--------------------------------------------------------------------

**Intervjuu signaal:** UTM veebilehe (utm.jens.ee) näidet kasutatakse selleks, et “loogikat” lihtsam selgitada; mainitakse “täiskontrolli” ja haldustasemete loogikat.  
**Tulevased nõuded:**

*   Vajalik **selge rollimudel + admin-tasemete hierarhia** (nt vaatleja / operaator / piirkonna admin / süsteemi admin).
*   Õigused peavad olema **atribuutide ja geograafia** järgi piiravad (kontseptsioonis sees), mitte ainult “üks admin”.
*   UX tasemel: kasutaja peab aru saama “miks ma seda ei näe / ei saa” (õiguste/klassifitseerimise selgitused).

11) “Kinnitatud droon” vs tuvastus → tõendamise/validatsiooni töövoog
---------------------------------------------------------------------

**Intervjuu signaal:** kirjeldatakse praktikat “sõidad autoga ringi, vaatad üle” ja siis on droon “kinnitatud”.

Eans tll Recording 432

**Tulevased nõuded:**

*   Tuvastusel peab olema **olekumasin**: _tuvastatud → tõenäoline → kinnitatud → suletud_ (või sarnane), koos auditeeritava “kes kinnitas ja mille alusel”.
*   Kinnitamist peab toetama **tõendite lisamine**: vaatlus, foto/video, patrulli raport, sensori ristkinnitus (fusion).
*   Kontseptsiooni droonistaatused (“kahtlane/vaenulikkuse kahtlus/vaenulik”) eeldavad, et staatus muutub **kontrollitud tegevuse** tulemusel, mitte ainult automaatikast.

12) Menetlemise otsus / eskaleerimine → juhtumihalduse reeglid
--------------------------------------------------------------

**Intervjuu signaal:** arutatakse olukorda, kus “kui te seda edasi menetlema ei hakka, siis…” (st otsus, kas eskaleerida/menetleda).

Eans tll Recording 432

**Tulevased nõuded:**

*   Intsidendil peab olema **otsuseloogika + põhjendus**: _menetlusse / mitte menetlusse_, _kellele edastati_, _mis tingimustel suletakse_.
*   Teavitused peavad olema **adressaadipõhised** (kes peab teadma, kui menetlusse ei lähe / kui läheb) – haakub kontseptsiooni “asutus saab häire, operaator reageerib, ajalugu” plokiga.

13) Seireseadmete paigaldamise piirangud → deploy/katvuse planeerimine + “miks ei saa”
--------------------------------------------------------------------------------------

**Intervjuu signaal:** vihjatakse, et seireseadmeid ei saa lihtsalt igale poole panna (kontekstis lennujaamad jms).

Eans tll Recording 432

**Tulevased nõuded:**

*   Süsteemis peab olema **sensorite inventar + paigaldus-/loa meta** (kus on lubatud, kus mitte; kes vastutab).
*   Planeerimisvaade peab toetama **katvuse analüüsi** ja vajadusel “hägustatud” katvust (kontseptsioonis sees).

14) “Palju standardeid” + välised platvormid (nt logide/“droonimiloodide” import)
---------------------------------------------------------------------------------

**Intervjuu signaal:** räägitakse, et “droonimiloodid” saavad midagi (nt “Bolti”) sisse tõmmata ja mainitakse “29 standardile” – ehk standardite/platvormide killustatus on päris.

Eans tll Recording 432

**Tulevased nõuded:**

*   Süsteem peab olema **standardite ja formaatide suhtes pluginaarne**: uue formaadi lisamine ei tohi tähendada kogu tuuma ümberkirjutamist.
*   Vajalik **andmete import/eksport** (logid, lennuplaanid, load, vaatlused) ning nende sidumine intsidentidega kui tõendmaterjal.

15) Kasv ja mõõdikud → raportid, trendid, koormuse prognoos
-----------------------------------------------------------

**Intervjuu signaal:** mainitakse kasvukõvera/trendi vaatamist ja edasi ennustamist.

Eans tll Recording 432

**Tulevased nõuded:**

*   Raportid: intsidentide maht, valepositiivid, kinnitamise aeg, sensorite rikete statistika, piirkondlik ja ajaliselt jaotus.
*   “Valmisoleku/tundlikkuse” režiimid (kontseptsioonis) vajavad mõõdikuid, et otsustada, millal automaatselt tundlikkust tõsta/langetada.

16) Objekti-/isikukaitse praktiline nurk → sündmusepõhine prioriteet ja kontekst
--------------------------------------------------------------------------------

**Intervjuu signaal:** juttu on objekti kaitse kontekstist (“kui tuleb droon nende objektidega…”).

Eans tll Recording 432

**Tulevased nõuded:**

*   “Kaitstav ala” peab olema **põhisüsteemi esimese klassi objekt**, koos prioriteetsuse ja eriteavitustega (kontseptsioon).
*   Intsidendi rikastamine: seos _kaitstava ala / ürituse / lennuplaani / sensori allikatega_.

* * *

### Üks potentsiaalne komistuskivi / alternatiivvaade

Kui üritada kohe katta **kõik standardid + kõik integratsioonid + kõik kinnitamis-/menetlusvood**, tekib “igavene platvorm” ja operatiivkasutus jääb tahaplaanile. Targem on lukustada varakult **tuum-olekumasin + audit + õigused + import/eksport raamistik**, ja jätta spetsiifilised standardid/partnerliidesed etapiviisiliseks pluginateks.

## Response:
Thought for 1m 30s

Veel “kõrge mõjuga” asju Alo/EANS 433 intervjuust, mis on pigem _arhitektuursed/operatiivsed_ nõuded (mitte lihtsalt UX-detailid):

1) Kohalik autonoomia (“local node”) + töökindlus / fallback
------------------------------------------------------------

Intervjuus joonistub üsna selgelt, et **iga objekt/asutus tahab oma kohalikku node’i**, mis töötab edasi ka siis, kui “keskne” või muu kukub ära; mainitakse ka _seamless fallback_ mõtet.

Alo eans Recording 433

**Nõuded:**

*   Node peab suutma pakkuda **kohalikku olukorrapilti ja häireid** ka võrgu-/keskteenuse katkestuse korral.
*   Vajalik **puhverdamine + hilisem sünk** (event replay), et keskne ajalugu ei läheks katki.
*   Kontseptsioonis olev “teavitus ühenduse katkemise korral” ja “sensori rikke teavitus” muutub siin “must-have” töökindluse taseme nõudeks.
    Kontseptsioonidokument

2) “Igaüks ei saa saata mida iganes” → range liidese/andmelepingu nõue
----------------------------------------------------------------------

Intervjuus öeldakse otse, et infosüsteemid ei luba “mida iganes” sisse saata; kui tahad infot saata, peab see millelegi vastama.

Alo eans Recording 433

**Nõuded:**

*   Määra **kanoniline sündmuse-/track’i skeem** + versioonihaldus.
*   Sisendis peab olema **valideerimine** (schema validation, contract tests) ja selge veakäitumine (reject/quarantine).
*   Integreerimispartneritele: **sertifitseeritav/automaat-testitav liides** (mitte käsitsi “lepime kokku ja vaatame”).

3) Sensorite “eriklassid” → ära kirjuta hankesse fikseeritud sagedust/täpsust
-----------------------------------------------------------------------------

Intervjuus rõhutatakse, et sensorid on nii erinevad, et ei saa ette öelda üht kindlat täpsust/sagedust kõigile.  
**Nõuded:**

*   Andmemudel peab kandma **update-rate, latency, accuracy, confidence** meta iga sensori/vaatluse kohta.
*   Fusion/alerting peab olema **heterogeense sisendi tolerantne** (nt aeglane sensor ei tapa kogu track’i; erinevad latentsused).
*   Nõuetes: defineeri pigem **minimaalsed klassipõhised SLA-d** või “capability matrix”, mitte üks number kõigile.

4) Nõuete omanik + delegeerimine (“kes on sensori/nõude omanik?”)
-----------------------------------------------------------------

Intervjuus käib läbi, et tekib küsimus, kas omanik on sensori omanik või keegi, kellele see delegeeritakse.  
**Nõuded:**

*   Süsteemis/halduses peab olema **ownership-mudel**: kes haldab sensorit, kes haldab reegleid, kes kinnitab intsidente.
*   Õigused ja audit peavad seda omaniklust peegeldama (ABAC + audit). Kontseptsioonis audit ja rollid on juba sees.
    Kontseptsioonidokument

5) “Valideeritud üldistatud nõue” peab jõudma dokumentatsiooni
--------------------------------------------------------------

Intervjuus on väga BA-kuldne punkt: osapoolte nõuded läbivad “sõela” ja dokumentatsiooni peaks jõudma **valideeritud, üldistatud nõue**.  
**Nõuded/protsess:**

*   Nõuete haldus: **traceability** (stakeholder statement → üldistatud requirement → disain/teostus → test).
*   Nõuete “sõel”: otsusta, mis on _lokalne reegel_ vs _riiklik tuumnõue_ (see on otseselt seotud local node ideega).

6) Operatiivne siht: perimeeter + konvoi (“kolonni kaitse”) + konkreetne ohtpilt
--------------------------------------------------------------------------------

Intervjuus tuuakse välja, et fookus on perimeetri kaitsel, mõnel juhul konvoi kaitsel; peamised ohud: keelatud aine/objektide toimetamine, ründed, põgenemised, jms.  
**Nõuded:**

*   Kaitstav ala peab toetama **staatilist perimeetrit** ja **liikuvat koridori/teekonda** (konvoi marsruut) – see haakub kontseptsiooni “planeerimine” vaatega.
    Kontseptsioonidokument
*   Häirete prioriseerimine peab oskama arvestada “kriitiline objekt/konvoi” konteksti.

7) “Protsess on juhuslik” → standardiseeritud töövood ja reeglid
----------------------------------------------------------------

Intervjuus mainitakse, et protsess on täna kujunenud “mõnevõrra juhuslik”.

Alo eans Recording 433

**Nõuded:**

*   Süsteem peab toetama **standardseid töövooge**: häire → triage → kinnitamine → eskaleerimine → sulgemine, koos põhjendustega ja auditiga.
*   Vastasel juhul jääb “infosüsteem” lihtsalt kaart + logi, mis ei paranda päris tööd.

8) MVP-mentaliteet on otsesõnu läbi: täisrakendus ilma MVP-ta on halb idee
--------------------------------------------------------------------------

Intervjuus käib läbi, et “täisrakendus ilma MVP-d ja mõtet arendada” ei ole hea suund.

Alo eans Recording 433

**Nõuded/tarnestrateegia:**

*   Tee tuumfunktsioonid (alarm + RBAC/ABAC + audit + ajalugu + 1–2 integratsiooni) enne “kõiki standardeid ja kõike”.

9) Väldi “sertifitseerimise peavalu” kui süsteemi disaini-ankur
---------------------------------------------------------------

On lõik, kus nimetatakse “peavalu” ja “mootori sertifitseerimist” kui midagi, mida pigem ei taheta enda kaela võtta.

Alo eans Recording 433

**Nõuded (ettevaatlikult sõnastada):**

*   Arhitektuur peab toetama, et **riskantsed/riistvaralised/eriregulatsiooniga komponendid** saaksid olla kapseldatud (asendatav moodul / eraldi teenus), mitte “kogu platvorm vajab serti”.

* * *

### Üks potentsiaalne komistuskivi / alternatiivvaade

Local-node + seamless fallback on ahvatlev, aga kui see kohe “kõigile ja alati” nõudeks teha, läheb süsteem kiiresti _distribueeritud-süsteemide põrguks_ (sünk, konfliktid, versioonid, audit). Mõistlik on alguses määrata **minimaalne offline-funktsionaalsus** (kohalik pilt + puhver + “read-only/limited actions”), ja alles hiljem lisada keerukamad lokaalsed reeglid.



---
Powered by [ChatGPT Exporter](https://www.chatgptexporter.com)