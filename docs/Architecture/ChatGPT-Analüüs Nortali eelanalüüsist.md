# Analüüs Nortali eelanalüüsist

**User:** Andres Moks (andres.moks@gmail.com)  
**Created:** 12/27/2025 0:47:17  
**Updated:** 12/27/2025 21:05:34  
**Exported:** 1/7/2026 23:23:08  
**Link:** [https://chatgpt.com/g/g-p-693e11a6a8f88191a9d275ef1e30a781-c2/c/694f1071-d5c8-8325-b57c-af90bd19bcb5](https://chatgpt.com/g/g-p-693e11a6a8f88191a9d275ef1e30a781-c2/c/694f1071-d5c8-8325-b57c-af90bd19bcb5)  

## Prompt:
1\. Piisavalt kaetud teemad Nortali eelanalüüsis (1).docx

Document

Drooniseiresüsteemi huvigruppide vajaduste kaardistamise küsimustik.docx

Document

Eelanalüüsi pakkumise analüüs ja soovitused.docx

Document

Huvigruppide vajaduste kaardistamise küsimustik seiresüsteemi arendamiseks.docx

Document

Kasutusvajadused ja huviosalised.docx

Document

Küsimused teiste huvigruppide esindajatele.docx

Document

Potentsiaalsed droonitõrje tehnoloogia huvirühmad Eestis ja rahvusvahelised näited.docx

Document

PPA drooniseiresüsteemi haldus- ja pidamiskorra eeluuringu intervjuuküsimused.docx

Document

Täiendavad küsimused huvigruppide esindajatele.docx

Document

Eelanalüüsi raames - keskendu et millest Nortali analüüsis puudust tundub (liiga palju on üle sensorite valikuid jne tehnilist ning seotust teadusega) aga kus võiks olla lüngad.

(süsteem tuleb PPA alla, sensoreid pole veel olemas)

vaata projekti failidest transkriptsioone ning sellele vestlusele praegu lisatud faile inspiratsiooniks.

## Response:
Et koostada täpne analüüs Nortali eelanalüüsi puudustest ja võimalikest lünkadest, siis enne alustamist võiksid sa täpsustada järgnevat:

1.  Kas fookus peaks olema ainult I etapi "eelanalüüsi" sisulisel hindamisel (nt tehnilised lüngad, kasutusstsenaariumide ebapiisavus) või ka metoodilisel lähenemisel?
2.  Kas peaksin eraldi välja tooma:
    *   Puudujäägid koostalitluses rahvusvaheliste süsteemidega (nt NATO/EU)
    *   Ebapiisava tähelepanu avatud lähtekoodile ja koodi omandile
    *   Teadusasutuste ja innovatsiooni kogukonna kaasamise
    *   Reaalseid PPA vajadusi võrreldes esitatud funktsionaalsustega?
3.  Millises formaadis soovid kokkuvõtet:
    *   Bullet list?
    *   Lühikokkuvõte tekstina?
    *   Või raportilaadne struktureeritud dokument (nt alapeatükid)?

Anna palun lühike suunis nende punktide kohta.

## Prompt:
1. nii sisulisel kui metoodilisel.

2. jäta välja rahvusvaheline koostalitus, teadusasutused ja innovatsioon. 
veidi tähelepanu avatud lähtekoodile ja koodi omandile.

3. mitte päris bullet list aga lühiblokkides seletustena. nii nt alampeatükkide kaupa.

## Response:
Selge. Alustan analüüsiga, mis toob välja Nortali eelanalüüsis esinevad sisulised ja metoodilised puudused. Keskendun eelkõige tehnilise tasakaalu puudumisele, üledetailsele sensorite käsitlusele, vähesele seosele PPA sisuliste vajadustega ning sellele, kuivõrd avatud lähtekoodi ja koodi omandi küsimused on käsitlemata või pinnapealsed.

Jagatud failid ja transkriptsioonid aitavad hinnata ka tegelikku PPA vajadust, mille valguses Nortali töö ulatust ja fookust hinnata. Annan tulemused struktuurse, selgitavate alajaotustega tekstina. Annan sulle teada, kui see on valmis – saad samal ajal vestlust jätkata.

Research completed in 5m · 20 sources · 81 searches

## Response:
Liiga tehniline fookus vs operatiivsed kasutusstsenaariumid
===========================================================

Nortali eelanalüüs kalduleb väga tehnilise detaili poole (sensorite standardid, integratsioonivõimalused jt), kuid kirjeldab puudulikult tegelikke kasutusstsenaariume ja operatiivseid protsesse PPA vaates. Tegelikes juhtumites peaks lahendus lähtuma sellest, kuidas piirivalve või politsei droonidega piltandmeid kasutavad (nt õhuruumi tõkestamine, sisevalve operatsioonid, inimeste otsimine jms), mitte ainult andmekanalite tehnilistest omadustest. Parimaid tulemusi annab kasutajakeskne lähenemine: nt agile-kasutuslugudel (user stories) põhinev analüüs seab kasutaja ja tema eesmärgid keskmesse[atlassian.com](https://www.atlassian.com/agile/project-management/user-stories#:~:text=user%20story%20puts%20end%20users,development%20team%20and%20their%20efforts)[policechiefmagazine.org](https://www.policechiefmagazine.org/drones-tactical-response/#:~:text=While%20drones%20do%20not%20replace,more%20information%20to%20act%20upon). Atlassiani allikad rõhutavad, et „user story puts end users at the center of the conversation“ – pärast kasutusloo läbivõtmist saab meeskond aru, _miks_ ja _mida_ ehitada, millist väärtust see kasutajale loob[atlassian.com](https://www.atlassian.com/agile/project-management/user-stories#:~:text=user%20story%20puts%20end%20users,development%20team%20and%20their%20efforts). Sarnasel printsiibil on ka drooniseiresüsteemide operatsioonis: näiteks ainuüksi füüsilisi sensoritunnuseid kirjeldav eelanalüüs ei selgita, kuidas ja millal PPA meeskonnad antud infot kasutavad (nt patrulliruumide katmine, vägistatud isikute otsimine, eriolukordade juhtimine). Politseiuurimustest teabime, et droonid annavad reaalaja situatsiooniteadlikkuse (näiteks kaugpilti ning termilise kaamera abil inimeste liikumise jälgimist), mis suurendab operatiivset efektiivsust ja turvalisust[policechiefmagazine.org](https://www.policechiefmagazine.org/drones-tactical-response/#:~:text=While%20drones%20do%20not%20replace,more%20information%20to%20act%20upon). Nortali eelanalüüs peaks seega selgemalt siduma tehnilised nõuded konkreetsete stsenaariumite ja protsessidega, et vastaks PPA igapäevastele töövajadustele.

Metoodika ja kasutajakesksus
============================

Nortali dokument mainib üldises plaanis intervjuude ja analüüsi, kuid avalik tekst jääb põhiliselt deklaratiivseks tehnoloogiakirjelduste loeteluks. Hea analüüs tugineb aga sügavale huviosaliste kaardistamisele ja kogemuspõhisele prototüüpimisele. Näiteks tuleks vestluste ja töötoade tulemusi kasutada konkreetsete kasutajategelugude ja MVP (minimum viable product) loomisel, mitte ainult märksõnade loetlemiseks. Agile-metoodika kohaselt tuleks koostada lühikesed kasutajalood või stsenaariumid („Asjaolu X juhtumil soovib patrull…“, „Kontaktikeskuse töötaja peab kuvama…“), mis hoiavad tiimi fookuse kasutajal ja loovad koostöövõimalusi[atlassian.com](https://www.atlassian.com/agile/project-management/user-stories#:~:text=user%20story%20puts%20end%20users,development%20team%20and%20their%20efforts). Samuti on kriitiline iteratiivne arendus ja prototüüpimine – kiire prototüüp võimaldab testida ideid juba varajases etapis ning suunata nõudeid vastavalt tegelikule tagasisidele[devsquad.com](https://devsquad.com/blog/what-is-rapid-prototyping-and-why-is-it-used-in-development#:~:text=Rapid%20prototyping%20is%20an%20iterative,user). Näiteks selle asemel, et lõplikku arhitektuuri kirjeldada alles peale intervjuusid, võiks prototüüpidega kaardistada, kuidas info eri andmeallikatest (radaarid, lennujuhtimissüsteemid, ametkondade droonivideod jms) ühtseks vaateks sulandub. Kokkuvõttes ei tohi metoodika jääda pelgalt „paberkandjal“ kirjeldamiseks, vaid peab toetama lõppkasutaja vajaduste mõistmist ja lahenduse testimist kasutajagruppide poolt.

Avatud lähtekood ja jätkusuutlikkus
===================================

Tarkvaraarenduses on oluline, et riikliku süsteemi kood kuuluks hankija huvidesse ning oleks lihtsasti edasiarendatav. Nortal peaks rõhutama avatud lähtekoodi kasutamist ja selgeid omandiklausleid: pärast hanke lõppemist peaks PPA omama kontrolli koodibaasi üle. Näiteks on Eesti riigi tavaks pakkuda kriitilise infrastruktuuri tarkvara avatud lähtekoodiga (nt RIA e-allkirjapalvel avatud lähtekood võimaldab kõigil sarnast teenust luua)[ria.ee](https://www.ria.ee/riigi-infosusteem/elektrooniline-identiteet-ja-usaldusteenused/digiallkirja-serverteenused#:~:text=Teenust%20osutatakse%20k%C3%B5igile%20valitsussektori%20asutustele,ka%20ise%20sarnast%20teenust%20osutada). Üldised praktikad soovitavad luua organisatsiooni sees vastutuse OSS-i (open source software) haldamise eest ja tagada koodile pidev hooldus[anchore.com](https://anchore.com/blog/5-open-source-procurement-best-practices/#:~:text=The%20time%20is%20now%20to,processes%20and%20governance%20over%20OSS). Anchore’i analüüs rõhutab, et korrektne OSS-i kasutuselevõtt eeldab sisemiste protsesside ja valitsemise loomist ning aktiivset koostööd avatud lähtekoodi kogukondadega[anchore.com](https://anchore.com/blog/5-open-source-procurement-best-practices/#:~:text=The%20time%20is%20now%20to,processes%20and%20governance%20over%20OSS). Kui eelanalüüsile ei lisandu selget strateegiat koodi litsentsi, hoolduse ja pikaajalise arendusvõime tagamiseks (nt SBOM-id, uuendusteversioonid, arendajameeskonna koolitus), võib see tulevikus viia sõltuvuseni tarnijast või projektist, mille hooldamine kukub riski alla. Seega peaks töö rõhutama, et süsteem arendatakse EUPL või muul sobival viisil, mis lubab riigil koodi vabalt kasutada ja vajadusel ise täiendada.

Lahenduskäigu struktuur ja paindlikkus
======================================

Nortali pakutud struktuur (esmalt _eesmärk_, siis _andmeallikad_ ning lõppkokkuvõttes _arhitektuur_) võib alguspunktina loogiline tunduda, kuid kriitiline on tagada paindlikkus. Kuna sensorid ja hüpersituatsioonid hakkavad kajastama kiiresti arenevaid nõudeid, peab arhitektuur olema modulaarne ja kohandatav. Kuigi selge eesmärgistamine on vajalik, ei tohi praegune visioon sellisena lõplikult lukustuda – näiteks võib PPA vajaduste arenedes ilmneda uusi stsenaariume (piirikontroll, kodanikuabi, eriolukorrad), mida tuleks hõlpsasti süsteemi lisada. Architektuur peab toetama mitut liidest ja erinevat andmetüüpi (nt radarijäljed, optiliselt tuvastatud droonid, kaardistusandmed), ilma et üksik muutuja (nt konkreetne dronimudel) süsteemi lõplikuks piirideks kujuneks. Kokkuvõttes on plaani loogiline selgus positiivne, ent see peaks olema kombineeritud agile-printsiipe järgiva arendusmudeliga, kus iga samm (eesmärk → andmed → arhitektuur) täieneb tagasiside ja praktiliste testide alusel.

Puuduvad või alahinnatud teemad
===============================

Nortali eelanalüüsist jääb puudu mitu olulist aspekti, mis mõjutavad pikas perspektiivis projekti edukust:

*   **Protsessipõhised töövood ja rollid.** PPA puhul ei tohi unustada, milline on tegelik tööjaotus ja otsustuskäik häire korral. Kes drooniseiret juhib? Kuidas langevad rollid eriopsustel (piiririkkumised, terrorismivastane operatsioon) ja milline on info käitlemise protsess eri tasanditel (info kogumine, analüüs, häireandmete levitamine)? Eelanalüüs peaks selgitanud, kuidas droonivideot haldavad ametnikud, kuidas see võimaldab langetada kiireid otsuseid ja kuidas eri süsteemid (näiteks PPA situatsioonikeskus) infot visualiseerivad ja jagavad.
*   **Kiire prototüüpimine ja kasutajate testimine.** Standardne ühekordne uurimus ei pruugi paljastada põhiprobleeme. Agile-põhiseid projekte iseloomustab MVP-loomine ja kasutajatelt tagasiside kogumine, et vajadusel suunda muuta. Nortali analüüs peaks julgustama varase prototüübi või simulatsioonikeskkonna tegemist ning kasutajate kaasamist õiget tüüpi graafiliste liideste ja hoiatusmudelite katsetamiseks[devsquad.com](https://devsquad.com/blog/what-is-rapid-prototyping-and-why-is-it-used-in-development#:~:text=Rapid%20prototyping%20is%20an%20iterative,user)[atlassian.com](https://www.atlassian.com/agile/project-management/user-stories#:~:text=,solving%20problems%20for%20real%20users). Näiteks võiks luua droni olukorra pildi (radari-ja thermalvirmalade kombinatsioon) visualiseeriva kujutise ja testida, kas piirivalvurid näevad olulise infot õigel ajal.
*   **Andmete visuaalne esitlus.** Suures andmevoos (mitu sensorit, ATC-andmed, droonide telemeetria) on kriitiline kujundada kasutajasõbralik liides. Puudu on analüüs, kuidas visualiseerida reaalaja sündmusi (kaart, kaameravaade, märguanded) nii, et ops-juht ja patrullid saaksid kiiresti situatsioonist aru. Studiud näitavad, et kvaliteetne visualiseerimine tugevdab otsuste tegemist (tihe side situatsiooniteadlikkusega[policechiefmagazine.org](https://www.policechiefmagazine.org/drones-tactical-response/#:~:text=While%20drones%20do%20not%20replace,more%20information%20to%20act%20upon)).
*   **Riskide ja ettearvamatuse käsitlemine.** Drooni häirimine ja rünnakud võivad olla nii ohuallikaks kui ka lahenduseks (küberrünnakud, signaalisegmendid). Nortali analüüs võiks käsitleda olukordi, kus sensorid või droonid ebaõnnestuvad või neid häiritakse, ning kuidas sellistel juhtudel toimida (asendussüsteemid, meeskonnaprotseduurid).
*   **Sisemine tööjaotus ja koolitusvajadus.** Isegi parim tarkvara jääb tühjaks rehkenduseks, kui personal ei oska seda kasutada. Puudu on hinnang, kui suur peaks olema kasutajate koolitusmaht või kas PPA rajab spetsiaalse droonipartiid. Samuti tuleks kaaluda üleminekut rahuaegsetelt režiimidelt kriisiolukordadele – näiteks erioperatsioonide eri andmetöötlusketid.

Kokkuvõttes on Nortali eelanalüüs tehniliselt põhjalik, kuid peaks andma suurema rõhu lõppkasutaja stsenaariumitele, iteratiivsele testimisele ja juhtimisprotsessidele. Läbi avatud lähtekoodi ning modulaarse lähenemise saab tagada, et pärast hanke lõppu jääb PPA-l lahenduse üle kontroll ning võimalus süsteemi vastavalt vajadustele edasi arendada[ria.ee](https://www.ria.ee/riigi-infosusteem/elektrooniline-identiteet-ja-usaldusteenused/digiallkirja-serverteenused#:~:text=Teenust%20osutatakse%20k%C3%B5igile%20valitsussektori%20asutustele,ka%20ise%20sarnast%20teenust%20osutada)[anchore.com](https://anchore.com/blog/5-open-source-procurement-best-practices/#:~:text=The%20time%20is%20now%20to,processes%20and%20governance%20over%20OSS). Lisaks soovitatakse analüüsida pidevalt tekkivaid uusi riske ja kasutusviise, et süsteem ei muutuks ajale jalgujäänuks.

**Allikad:** Best practice agile meetodid nõustavad keskenduma kasutajale (näiteks Atlassian user stories[atlassian.com](https://www.atlassian.com/agile/project-management/user-stories#:~:text=user%20story%20puts%20end%20users,development%20team%20and%20their%20efforts)), OSS-projektides tuleb loobuda mustast kastist (nt RIA näide avatud lähtekoodiga teenusest[ria.ee](https://www.ria.ee/riigi-infosusteem/elektrooniline-identiteet-ja-usaldusteenused/digiallkirja-serverteenused#:~:text=Teenust%20osutatakse%20k%C3%B5igile%20valitsussektori%20asutustele,ka%20ise%20sarnast%20teenust%20osutada)) ning prototüüpimine aitab riske maandada ja hoida arendusprojekti fookust kasutaja vajadustel[devsquad.com](https://devsquad.com/blog/what-is-rapid-prototyping-and-why-is-it-used-in-development#:~:text=Rapid%20prototyping%20is%20an%20iterative,user)[policechiefmagazine.org](https://www.policechiefmagazine.org/drones-tactical-response/#:~:text=While%20drones%20do%20not%20replace,more%20information%20to%20act%20upon). Allikate päringud on esitatud vastavalt mainekate väljaannete ja tehnoloogiasektorite juhenditega.

## Prompt:
analüüsi edasi!

## Response:
Thought for 1m 17s

1) Eeldusviga: „kasutusel olevate sensorite” maailm vs tegelik olukord (sensoreid veel pole)
--------------------------------------------------------------------------------------------

Nortali tekst on kirjutatud toonis, justkui koondataks „kasutusel olevate droonituvastusseadmete ja sensorite andmed” ühtseks pildiks.

NORTAL

Tegelikult on sul endal väga selgelt raam: süsteem tuleb PPA alla, sensorid alles hangitakse. See tekitab riski, et eelanalüüs hakkab varakult „lukustama” tehnilisi lahendusi ja standardivalikuid, millele pole veel reaalseid sisendeid (sensorite päris andmeformaadid, kvaliteedinäitajad, sidepiirangud, tootjate reaalsed API-d).

Selle koha pealt on oluline, et eelanalüüsi keskne väljund oleks mitte „millised sensorid turul on”, vaid **milline integratsioonileping ja andmemudel peab olema**, et _ükskõik mis_ hiljem hangitud sensor oleks võetav ühe pildi sisse (sh testitavus ja vastavuskriteeriumid).

2) Liigne tehniline detaliseerimine, aga puudu „operaatori töölaud”
-------------------------------------------------------------------

PPA algne vajadus on väga „operatiivne”: operaator ei jõua kõike jälgida, ta peab reageerima alarmidele; vaja on reaalaja hoiatusi, kaardivaadet, sündmuste arhiivi, rolli- ja piirkonnapõhist ligipääsu ning sisevõrgus (offline) hallatavust.

Eelanalüüs

Nortali lähenemine kaldub pakkumisdokumendis tugevalt tehnilise „maastiku” ja standardite kirjeldamise poole.

NORTAL

Sama mõte on sul juba „soovitustes” ka kirjas: kui eelanalüüsi sees läheb droonitõrje vastumeetmete detailseks kirjeldamiseks, tuleks mahtu vähendada – rahuaja eelanalüüs peaks keskenduma tuvastamisele ja info jagamisele ning jätma neutraliseerimise (ja muu süvaprügi) pigem tulevikku.

Eelanalüüsi pakkumise analüüs j…

Ka andurite füüsilise taristu (paigalduse ja kaablite jms) detailid on pigem järgmiste etappide teema.

Eelanalüüsi pakkumise analüüs j…

**Lünk** ei ole „tehnika puudumine”, vaid **tööprotsessi ja kasutajakogemuse (alarmiloogika, valehäirete käsitlus, eskaleerimine, tõendikett) vähene lahtikirjutamine** sellisel kujul, et sellest saaks kohe teha 2. etapi detailanalüüsi hanke.

3) MVP ja etappide sisendite vormistamine jääb liiga üldiseks
-------------------------------------------------------------

Tellija enda raam ütleb, et 2. etapp = detailanalüüs + tehniline prototüüp riskikohtade testimiseks ja beetatestiks.

Eelanalüüs

Transkriptsioonidest tuleb ka ajasurve ja siht: „vähemalt prototüübi mõiste või prototüübi valmis” ning 2027 lõpuks oma lahendus, mille peale üle minna.

Ppa\_resampled\_mono\_PRE180\_vadli…

Nortali pakkumine lubab prototüüpimise vajadust „määratleda”, kuid eelanalüüsis peaks palju selgemalt lukku panema:

*   mis on **MVP**, mis peab kindlasti esimesena tööle minema;
*   millised riskid peavad prototüübis saama reaalse testiga kontrollitud (nt alarmikoormus, sündmuse korrelatsioon, offline-update, logide terviklus jne);
*   millised on konkreetsed **artefaktid**, mida 2. etapi hankija saab otse kasutada.

Sama rõhuasetus on sinu „soovituste” dokumendis: eelanalüüs peaks eos defineerima konkreetsed väljundid (nõuete kataloog, kontseptuaalne arhitektuur, andmevahetuse skeem, õiguslike kitsaskohtade lahendussoovitused, kasutusjuhtumid) ja selgelt prioritiseerima MVP vs nice-to-have.

4) Metoodika on „konsultandilikult korrektne”, aga liiga vähe mõõdetav ja valideeritav
--------------------------------------------------------------------------------------

Nortal kirjeldab metoodikat (probleemi lahkamine, lahenduse koostamine, riskid, tegevuskava) ja töövooge (funktsionaalne/tehniline/õiguslik).

NORTAL

See kõlab hästi, aga jääb nõrgaks seal, kus eelanalüüs peab olema hanke-eelne tööriist: **kuidas valideeritakse**, et saadud nõuded päriselt sobivad PPA operatiivsele kasutusele (nt iteratiivne valideerimine töötubades, prototüübi klikimudel, alarmistsenaariumite läbimäng, jms).

Praktiliselt: ilma selge valideerimisplaanita riskid nihkuvad 2. etappi, kus iga „valesti mõistetud kasutusjuht” muutub kalliks ümbertegemiseks.

5) Andmemudeli ja sündmuse „tõlgendamise” lüngad (mitte sensorite nimekiri)
---------------------------------------------------------------------------

Üks kõige olulisemaid lünki on see, et andmemahtude, metaandmete ja „mis on sündmus” teema on Nortali poolel pigem deklaratiivne: mainitakse, et hinnatakse mahtu/sagedust/metaandmeid, aga ei avata, **millised metaandmed on kohustuslikud** ja kuidas need hiljem seoseid loovad (päritolu, kvaliteet, usaldusväärsus, ajatempli reeglid, korrelatsioonireeglid).

1\. Piisavalt kaetud teemad Nort…

Sama kehtib rollide ja ligipääsuloogika kohta: öeldakse, et tehakse maatriks, kuid detailne pärimine/konfliktid/klassifikaatorite „kaasapärandumine” on lahti.

1\. Piisavalt kaetud teemad Nort…

Arvestades, et PPA nõuab piirkonna/sensorigrupi põhist nähtavust ja alarmidele reageerimist (mitte „pidev jälgimine”), peab eelanalüüsis olema palju konkreetsem **alarmide tekkimise ja sulgemise loogika**, „vale-positiivse” käitlemine ja sündmuse elutsükkel.

Eelanalüüs

6) Koodi omand, tarnijasõltumatus ja elutsükkel: Nortali pakkumises nõrk koht
-----------------------------------------------------------------------------

Transkriptsioonidest kõlab selge soov, et lahendus „ei oleks kinnine” ja et PPA saaks vajadusel tellida teiselt partnerilt edasiarendust.

Ppa\_resampled\_mono\_PRE180\_vadli…

Samas on PPA-l endal piiratud integratsioonipädevus ning tõenäoliselt „integratsioon tuleb ikkagi sisse osta”.

Ppa\_resampled\_mono\_PRE180\_vadli…

See teeb koodi omandi ja üleandmise nõuded kriitiliseks.

Sinu lisamaterjal toob väga otse välja, et versioonihalduse ja pikaajalise arendussuutlikkuse teema on Nortali pakkumises sisuliselt katmata.

1\. Piisavalt kaetud teemad Nort…

Ja seal on ka konkreetne soovitus, mida eelanalüüs peaks hanke sisendina ütlema: nõuda, et kood ja dokumentatsioon oleks riiklikus repoes, koodistandardid, automaattestid, uue tarnija sujuv ülevõtt jne – „Nortali dokumentis need aspektid puudusid”.

1\. Piisavalt kaetud teemad Nort…

Kui see jääb eelanalüüsis lahti, siis 2.–4. etapis on väga lihtne libiseda vendor lock-in’i: integratsioonid ja tuumikloogika jäävad ühe tarnija „eriteadmise” taha.

7) Haldusreaalsus PPA-s: sisevõrk, ligipääsud, uuendused, kasutajatugi
----------------------------------------------------------------------

PPA nõuab sisevõrgus töötamist ja seda, et uuendusi saab PPA ise juhise järgi teha, ning 24/7 töökindlust.

Eelanalüüs

Transkriptsioonides jookseb läbi ka väga praktiline integratsioonirealism (seadmed, võrgud, kompetentsipuudus, kasutajatoe vajadus).

Sys Recording 354\_resampled\_mon…

Nortali pakkumise tasandil on need teemad pigem „nimekirjas”, aga eelanalüüsis peaks olema otsuseline: milline on **operatsioonimudel** (kes haldab, kes teeb deploy’d, mis on taasteplaan, kuidas toimib testkeskkond vs tootmine, kuidas käib kasutajatoe eskalatsioon).

8) Mida oleks vaja Nortali eelanalüüsi sees juurde, et lüngad kinni saada
-------------------------------------------------------------------------

**Konkreetsete kasutusjuhtude läbimäng**: mitte „põhistsenaariumid üldiselt”, vaid 2–3 PPA jaoks kõrge prioriteediga juhtumit samm-sammult (alarm → reageerimine → salvestus → menetlus/tõendikett → sulgemine). See on kooskõlas sinu soovitusega skoop piiritleda konkreetsete juhtumitega.

Eelanalüüsi pakkumise analüüs j…

**Selge artefaktipakett 2. etapiks**: nõuete kataloog + andmemudel (sündmuse objektid, metaandmed, usaldusväärsus) + integratsioonileping (adapteri nõuded) + logimise/auditi reeglid + rollide/õiguste mudel. „Selged väljundid” on sul soovitustes väga hästi kirjas.

**Tarnijasõltumatuse nõuded kirjalikult**: koodi omand, repo asukoht, ülevõtmise protsess, automaattestid, dokumentatsiooninõuded – sest eesmärk on, et PPA saaks vajadusel teise arendaja võtta.

**Sensorite puudumise kompenseerimine testitavusega**: kuna sensoreid veel pole, eelanalüüs peaks soovitama (ja kirjeldama) „virtuaal-andurite”/test-andmete raamistikku, millega 2. etapis prototüüpi päriselt proovida. Sul on see mõte soovitustes olemas (simulatsioon/liivakast).

Eelanalüüsi pakkumise analüüs j…

Kui tahad, võin järgmise sammuna vormistada selle sama sisu nii, et see oleks **otse kasutatav “tagasiside Nortalile / täpsustused hanke sisendiks”** (st iga lünga juurde: _miks oluline_ + _mida täpselt nõuda / lisada eelanalüüsi väljundisse_).

## Prompt:
jätka analüüsiga! ole põhjalikum

## Response:
Thought for 1m 14s

Allpool on **kohad, kus Nortali eelanalüüsi pakkumine (ja selle rõhuasetused) jätavad PPA vaates lüngad** – nii **sisuliselt** kui ka **metoodiliselt**. Hoian fookuse “PPA alla tulev infosüsteem, sensoreid veel pole” ning väldin rahvusvahelist koostalitlust/teadust/innovatsiooni (v.a. lühike märge avatud lähtekoodi ja koodi omandi kohta, nagu palusid).

* * *

1) Fookus nihkub “sensoritehnika valikule” enne, kui infosüsteemi tuum on lukus
-------------------------------------------------------------------------------

Nortali tekst rõhutab tugevalt sensoritehnoloogiaid, integratsioonistandardeid, konfliktikeskkondade õppetunde ja turuolukorda

NORTAL

. Samal ajal on PPA lähteootus pigem: **infosüsteem peab andma operaatorile lihtsa pildi + alarmid + salvestus + õigused + sisevõrgu server**

Eelanalüüs

. Ehk risk on, et eelanalüüs kulutab “kõrge energiaga” nädalaid sensorite/EDGE/side detailidele, kuid jätab “igapäevase töö” nõuded poolikuks.

Teie enda soovitustes on see üsna otse kirjas: **andurite ja droonitõrje detailne tehnoloogiline valik tuleks eelanalüüsis pigem vähendada**, sest füüsilised hanked tulevad eraldi

Eelanalüüsi pakkumise analüüs j…

.

* * *

2) Arhitektuursed eeldused pannakse liiga vara “kivisse” (EDGE + x-tee-laadsus)
-------------------------------------------------------------------------------

Nortal pakub välja kihilise arhitektuuri, kus **iga sensor/sensoriklaster peab olema EDGE seadmega**, mis teeb tuvastust, krüpto/allkirjastab liikluse, võimaldab remote management’i jne ning eelistatult kaabliga ühenduse; samuti “x-tee laadne” lähenemine, kus EDGE seadmed käituvad turvaserveritena

NORTAL

.

Probleem PPA vaatest (sensoreid pole veel): selline eeldus **muudab sensorihanke kohe “EDGE-toega sensori” hankeks** ja võib:

*   piirata turuvalikuid (Nortal ise nimetab riskina, kas turu sensorid üldse toetavad kirjeldatud EDGE võimekust)
    NORTAL
    ;
*   tekitada PPA-le kohe alguses suure haldus-/turbe-/uuenduskoorma (remote management + allkirjastus + jaotatud turvaserverid), enne kui on selge, kas see on MVP-s päriselt vajalik;
*   ajada segamini “infosüsteemi” ja “sensorvõrgu” probleemid: PPA MVP vajab esmalt **ühtset pilti, alarmiloogikat, ligipääse, logisid, arhiivi**
    Eelanalüüs
    .

Vestluses kumab sama mure: “meil on kinnine võrk… kas see on üldse võimalik… kes mida näeb… tsentraalne vs piirkondlik”

Tannar 121225 Recording 355\_res…

. See on täpselt see koht, kus eelanalüüs peaks pakkuma **valikute võrdlust (tsentraalne vs regionaalne töörežiim, offline töö)**, mitte ühe “eelistatud” arhitektuuri varajast normaliseerimist

Eelanalüüsi pakkumise analüüs j…

.

* * *

3) Operatiivprotsessid jäävad lubaduse tasemele, mitte “läbimängitud juhtumiks”
-------------------------------------------------------------------------------

Nortal ütleb, et teeb põhistsenaariumid, rollid/ligipääsud, intervjuud jne

NORTAL

. Kuid PPA lähteülesanne eeldab, et eelanalüüs kirjeldaks **asutuste tööprotsessid ja juhtumid, mida süsteem peab toetama**

Eelanalüüs

– ja need on drooniseire puhul kriitiliselt “ajapõhised”.

PPA miinimumnõuded on väga operatiivsed:

*   “operaator jõuab reageerida ainult alarmidele”
    Eelanalüüs
*   “reaalaja hoiatused + GIS vaade”
    Eelanalüüs
*   “salvestus ja sündmuste arhiiv”
    Eelanalüüs

Kui eelanalüüs ei tee vähemalt 1–2 stsenaariumi **päriselt samm-sammult** (häire tekib → triage → teavitamine → otsus → patrull → järeltegevus/menetlus → tõend), siis jääb järgmise etapi hange “õhku”. Teie soovitused ütlevadki: **kitsenda skoop konkreetsete kasutusjuhtudega, sest just need paljastavad nõuded ja kitsaskohad**

Eelanalüüsi pakkumise analüüs j…

.

* * *

4) Häire-/valehaire loogika ja “operaatori koormus” on alad, kus Nortalil kipub jääma lünk
------------------------------------------------------------------------------------------

PPA lähtetekst ütleb otse: **ei jõuta järjepidevalt jälgida**, reageeritakse alarmidele

Eelanalüüs

. Sellest tekib terve klass nõudeid, mida sensorite jutu sees on kerge ära kaotada:

*   mis on “alarm”, mis on “teade”, mis on “vaatlus” (klassid, prioriteet, eskalatsioon);
*   kuidas vältida “alarmitormi” (snooze, dedupeerimine, korrelatsioon, geotsoonid);
*   mis on valehäire käsitlemise protsess (kes märgib, mis logitakse, kuidas õpitakse).

Sama joont näeb ka huvigruppide küsimustikes: valehäired, häirete mõju tööle, 24/7 teenuse ootus

Drooniseiresüsteemi huvigruppid…

. Nortali pakkumine küll mainib “operatiivvajadusi”, aga ei paista lahti kirjutavat **alarmihalduse** kui omaette disainiobjekti

NORTAL

.

* * *

5) Ligipääsud ja “kes mida näeb” on nimetatud, kuid detailne mudel kipub puudu jääma
------------------------------------------------------------------------------------

Nortalil on tegevusplaanis rollide/ligipääsude maatriks

NORTAL

, kuid tellija ootused on konkreetsemad:

*   **õigused sensorite kaupa ja gruppide kaupa** (nt “Tallinna sensorid nähtavad ainult Tallinna grupile”)
    Eelanalüüs
*   kinnine võrk + eri tasemed, “Tallinn näeb kõike, kordon näeb oma” tüüpi loogika
    Tannar 121225 Recording 355\_res…

Siin on lünk tavaliselt see, et jäädakse RBAC-i (“rollid”) juurde, kuid tegelik vajadus on sageli **RBAC + atribuudid** (asukohatsoon, sensori omanik/klass, juhtumi staatus, ajapiirangud, kriisirežiim). Teie “piisavalt kaetud / puudujäägid” dok ütleb sama: ligipääsud on mainitud, aga päris “pärimisõigused / õiguste loogika detail” jääb lahti

1\. Piisavalt kaetud teemad Nort…

.

* * *

6) Andmemudel, metaandmed, päritavus ja tõendiväärtus: Nortal puudutab, aga ei “kinnista”
-----------------------------------------------------------------------------------------

Nortali pakkumises on juttu andmemahtude prognoosist, metaandmete nõuetest jne, aga detailid (millised metaandmed ja miks) võivad jääda deklaratiivseks

1\. Piisavalt kaetud teemad Nort…

. Drooniseire “infosüsteemi” puhul on see aga tuum:

*   mis on sündmuse identiteet (event id), kuidas seotakse sensorivaatlus → alarm → juhtum → toimingud;
*   millised metaandmed on minimaalsed (asukoht/ajad, sensori tüüp, usaldusväärsuse skoor, tuvastusmeetod);
*   kuidas tagatakse tegevuste hilisem kontroll (auditlogid, jälgitavus)
    Eelanalüüs
    ;
*   mis on säilitustähtajad / arhiivipoliitika ja taastamine (eriti kui hiljem läheb menetluseks).

Haldus- ja pidamiskorra küsimustes on see lausa omaette plokk (arhiveerimine, taastamine, auditijälg)

PPA drooniseiresüsteemi haldus-…

, kuid Nortali pakkumine ei tõota neid väljundeid kuigivõrd “hankevalmis” kujul, vaid pigem “analüüsime” kujul

NORTAL

.

* * *

7) Toimepidevus ja võrgu reaalsus: “sisevõrk + uuendused PPA käes” vajab rohkem kui üldine turbejutt
----------------------------------------------------------------------------------------------------

PPA lähteinfo on praktiline:

*   süsteem **töötab sisevõrgus** (välisühendused keelatud/limiteeritud),
*   uuendused peavad olema tehtavad nii, et **PPA saab ise juhise järgi teha**,
*   24/7 töökindlus
    Eelanalüüs
    .

Siin kipub Nortali tüüpi pakkumisel tekkima lünk: räägitakse krüptost/õigusest/logidest, kuid ei sõnastata **kuidas üldse tarkvara elutsüklit hallatakse kinnises võrgus**:

*   kuidas pakendatakse releasid (offline artefaktid, checksum, signatuurid),
*   mis on rollback-protseduur,
*   kuidas hoitakse sõltuvusi (repo peegel, container registry sisevõrgus),
*   mis on monitooring (ilma pilveteenuseta),
*   milline on hooldusaken vs “null-seisak”.

Need on täpselt teemad, mida teie intervjuuküsimused suruvad lahti (versioonihaldus, katkestuste risk, tagasipööramise plaan, mitme keskkonna mudel)

PPA drooniseiresüsteemi haldus-…

, kuid Nortali pakkumise struktuuris on oht, et need jäävad “hilisema detailanalüüsi” alla.

* * *

8) Testimine ja simulatsioon on sisendites “kriitiline”, Nortalis sisuliselt puudu
----------------------------------------------------------------------------------

Teie koondmaterjal ütleb üsna ühemõtteliselt: **on vaja simulatsioonituge ja testkeskkonda**, et imiteerida sensorandmeid õppusteks, arenduseks ja ohutuks katsetamiseks; Nortal seda ei maini

1\. Piisavalt kaetud teemad Nort…

.

See on eriti oluline, kui sensoreid veel pole: ilma simulaatorita ei saa

*   arendada UI/juhtumiloogikat,
*   testida alarmi- ja õigusemudeleid,
*   teha integratsiooni “plug-and-play” tõestust.

Lisaks tuleb see välja ka vestluses “ehitad testid… alustad testidest… tootlikkuse kordistamine…”

Tannar 121225 Recording 355\_res…

– ehk organisatsioonil on seesama tunnetus, et **testitavus** peab olema arhitektuuri nõue, mitte nice-to-have.

* * *

9) Juhtimine, pidamine ja “kes on omanik” – Nortal keskendub süsteemile, aga pidamise mudel kipub lahjaks jääma
---------------------------------------------------------------------------------------------------------------

Kuna süsteem tuleb **PPA alla**, on eelanalüüsis vaja väga maiset “operating model’it”:

*   kes on teenuse omanik (RACI),
*   kes on 1. taseme kasutajatugi,
*   kuidas eskaleeritakse intsident (nii tehniline kui operatiivne),
*   kuidas koordineeritakse arendust (SMIT roll vs PPA roll),
*   kuidas käsitletakse kriisirežiimi ümberlülitust (mis muutub õigustes, nähtavuses, töörežiimis).

“Kasutusvajadused ja huviosalised” tõstab need küsimused tugevalt esile (rahuaeg vs eriolukord, tsentraalne vs regionaalne, side dubleerimine, tarnija kadumise risk)

Kasutusvajadused ja huviosalised

. Nortali pakkumine räägib küll “operatiivprotsesside kaardistamisest”, kuid ei paista lubavat eraldi **pidamis- ja juhtimismudeli** väljundit

NORTAL

.

* * *

10) Väljundite “hankevalmidus” vajab konkreetsemat artefaktide loetelu (muidu jääb raport jutustuseks)
------------------------------------------------------------------------------------------------------

Teie soovitused ütlevad, et eelanalüüsil peaksid olema **selged väljundid**: nõuete kataloog, kontseptuaalne arhitektuur, andmevahetuse skeem, õiguslike kitsaskohtade lahendused, kasutusjuhtumid jne

Eelanalüüsi pakkumise analüüs j…

. Nortali pakkumine räägib samast ambitsioonist (“hankevalmis sisendid”), kuid metoodikas on risk, et lõpp kujuneb “hea ülevaade”, mitte “hanke lisadokumendid”.

Praktiline lünk, mida ma siit loen: **puudub konkreetne “definition of done” iga teema kohta**. Näiteks ligipääsude teema: kas väljund on 1-lehekülgine rollide tabel või on see reeglite kogum + kasutuslood + testjuhtumid? Sama andmemudeli ja alarmiloogika puhul.

* * *

11) Kvaliteedisignaal: pakkumises on “võõras” sisukorra kirje (DAC7) – viitab mallile, mida pole lõpuni kohandatud
------------------------------------------------------------------------------------------------------------------

Nortali dokumendi sisukorras on kirje “OECD riikidele DAC7 laiendamise eelanalüüs”

NORTAL

. See paistab drooniseire kontekstis ilmselge “template leakage” ja on väike, kuid oluline signaal: kui sellised jäägid on sees, siis on mõistlik olla eriti tähelepanelik, et **kriitilised PPA-spetsiifilised osad (sisevõrk, pidamine, alarmitöövoog, õigused sensorite kaupa)** oleksid lõppraportis päriselt välja töötatud, mitte “teeme ära” tasemel.

* * *

12) Avatud lähtekood ja koodi omand: Nortal rõhutab vahetatavust, aga IP/õigused jäävad sõnastamata
---------------------------------------------------------------------------------------------------

Sa palusid seda käsitleda vaid “veidi”, aga see on tellija riski mõttes suur. Teie koondanalüüs ütleb: osapooled rõhutavad, et lahendus peaks olema avatud lähtekoodiga või vähemalt tagama tellijale täielikud õigused koodile, et vältida vendor lock-in’i; Nortali tekstis see põhimõte ei ole otsesõnu kirjas

1\. Piisavalt kaetud teemad Nort…

.

Minimaalne, mida eelanalüüsist oleks vaja (ja mida praegu ei paista olevat):  
kuidas korraldatakse **repo omand**, litsentsid (sh kasutatavad 3rd-party komponendid), üleandmise tingimused, automaattestide nõue uue tarnija jaoks – teie materjalides on see vajadus selgelt välja toodud

1\. Piisavalt kaetud teemad Nort…

.

* * *

### Kui tahad, võin järgmises sammus teha sama “alampeatükkide kaupa” ka **konkreetsete parandusettepanekutena Nortali struktuuri sisse** (st kuhu peatükki lisada: alarmimudel, andmemudel, offline-uuendused, pidamis- ja teenusehaldus, simulatsioon/test jne) – nii, et see oleks otse kasutatav eelanalüüsi lähteülesande täienduseks.

## Prompt:
jätka analüüsiga! ole põhjalikum

## Response:
Thought for 44s

All right — lähen veel sügavamale ja “lahkan lahti”, **mis Nortali käsitluses jääb PPA jaoks süsteemiarenduse eelanalüüsina nõrgaks/õhukeseks**, eriti arvestades, et **sensorid pole veel olemas** ja eelanalüüs peab andma **hankevalmis sisendi 2. etapile**. Hoian fookuse sisul + metoodikal, ning teen seda alapeatükkidena (mitte puhta bullet-listina).

* * *

1) Põhiprobleem: Nortal kirjutab “ökosüsteemist”, PPA vajab “infosüsteemi”
--------------------------------------------------------------------------

Nortali sissejuhatus ja raamistus nihutab fookust laiemale “kogu ahel tuvastamisest neutraliseerimiseni” käsitlusele.

NORTAL

See võib olla strateegiliselt huvitav, aga PPA tellija tekstis on 1. etapi eesmärk pigem **ühtse seirepildi loomine, alarmid, salvestus, õigused, sisevõrgu töökindlus** ning 2. etapi sisendi ettevalmistus.

Eelanalüüs

Kui eelanalüüs liigub liiga palju “kõik drooniohu kihid” maailmas, siis kannatab see, mida PPA-l on vaja hanke ettevalmistuseks: **täpsed kasutuslood + nõuete kataloog + arhitektuuri valikute võrdlus + riskide prototüübitestimise plaan**. Nortal küll ütleb, et eesmärk on anda “hankevalmis sisendid”, kuid tegevusplaanis jääb oht, et lõpptulemus on pigem “lai raport” kui “hanke sisendpakett”.

NORTAL

* * *

2) “Sensoritehnoloogia ja standardid” saavad liiga suure kaalu enne, kui integratsiooni põhireeglid on paigas
-------------------------------------------------------------------------------------------------------------

Tellija lähteülesanne eeldab, et sensorid alles hangitakse ja süsteem peab olema tootja-/seadme-neutraalne, sest avalike hangetega tulevad erinevad tootjad.

Eelanalüüs

Nortali tekstis on aga arhitektuuri kirjelduse sees tugev eeldus: **iga sensor/klaster peab olema EDGE seadme taga**, mis teeb tuvastust, krüpteerib/allkirjastab kogu liikluse ja võimaldab remote management’i; eelistatult kaabliga.

NORTAL

See on PPA vaates risk kahel tasandil:

*   See “tõstab lati” sensorihankele (sa pead hakkama hangetes nõudma EDGE sobivust / võrgurežiimi), enne kui sul on selge, kas see on MVP-s hädavajalik.
*   Nortal ise nimetab riskina, kas turu sensorid üldse toetavad kirjeldatud EDGE võimekust.
    NORTAL

Eelanalüüs peaks sensorite maailma asemel **lukustama integratsiooni lepingu/adapterimudeli**: milline on minimaalne sõnumimudel, metaandmed, ajastamine, kvaliteedimärgistus, autentimine, ja kuidas sensor “tõestab” oma vastavust (testid, simulaator, sertifitseerimine). See on koht, kus Nortal on praegu pigem tehnilise “visiooni” peal, mitte “hankekõlbulike nõuete” peal.

* * *

3) Arhitektuuriline “eelistus” (x-tee-laadne jaotus, self-healing jne) enne kasutusmudelit
------------------------------------------------------------------------------------------

Nortal eelistab “x-tee laadset” lahendust, kus EDGE seadmed käituvad turvaserveritena ja suudavad andmeid saata ka siis, kui keskserver pole kättesaadav.

NORTAL

See võib olla täiesti mõistlik _üks võimalik variant_, aga eelanalüüsi ülesanne peaks olema:

*   kirjeldada **3–4 realistlikku arhitektuurivarianti** (tsentraalne / regionaalne / hübriid / offline režiimid),
*   siduda need konkreetsete PPA tööstsenaariumitega (kes näeb, kes kinnitab, kes eskaleerib),
*   ja anda “valikukriteeriumid” (toimepidevus, halduskoormus, turbejuhtimine, maksumus, kompetents).

Transkriptsioonides on see probleem väga elus: “kes vaatab üldpilti?”, “kas üldse on kordonites inimesi?”, “kas üks keskus või killustub?”

Sys Recording 354\_resampled\_mon…

Nortali pakkumine ütleb, et tahab teha regionaalse + keskse kasutuse, kuid ei anna veel “operatsioonimudelit”, mis selle reaalselt tööle paneks.

NORTAL

* * *

4) Operatiivsed kasutuslood jäävad Nortalil “lubaduseks”, mitte läbimängitud protsessiks
----------------------------------------------------------------------------------------

Tellija ootab tööprotsesside ja juhtumite kirjeldamist (drooniseire, piiri valvamine, õhuruumi kaitse jms).

Eelanalüüs

Nortalil on plaanis “põhistsenaariumide loomine” ja “rollide maatriks”.

NORTAL

Puudujääk tekib tavaliselt siin: **põhistsenaarium** kirjutatakse üldiselt (“tuvastatakse droon ja teavitatakse”), aga ei seota seda _operatiivse töö tegeliku sammuga_. PPA lähteootus on eriti oluline: kuna operaator ei jaksa jälgida, peab ta reageerima alarmidele. See eeldab alarmi elutsüklit (tekib → rikastub → eskaleerub → suletakse → arhiveeritakse), mitte ainult “kaardil näitamine”.

Eelanalüüs

Sinu enda “soovituste” materjal rõhutab sama: eelanalüüs peaks keskenduma esmavajadustele — avastamine, asukoht, info jagamine, reageerimine — ja ülejäänu jäägu tuleviku võimaluseks.

Eelanalüüsi pakkumise analüüs j…

* * *

5) “Kes on operaator ja haldaja?” — see on PPA-s keskne otsus, aga Nortalis kipub jääma õhku
--------------------------------------------------------------------------------------------

PPA materjalides ja intervjuuküsimustes on väga teravalt sees juhtimise/valitsemise küsimus: kes haldab teenust, kes on keskne vaataja, kuidas on rahuaja vs kriisi rollid, mis siis kui Tallinna keskserveri ühendus kaob jne.

Kasutusvajadused ja huviosalised

Transkriptsioonides jookseb sama: idee, et oleks üks “tühjaks jäänud valvekeskus”, kuhu tekib üleriigiline droonipilt, muidu killustub.

Sys Recording 354\_resampled\_mon…

Nortali pakkumine räägib töövoogudest (funktsionaalne/tehniline/õiguslik), aga “operatsioonimudel” (RACI, teenuseomanik, 1./2. taseme tugi, vahetuse korraldus, eskalatsioon) ei ole selle pakkumise lõigus välja toodud kui konkreetne väljund.

NORTAL

See on lünk, sest ilma operatsioonimudelita ei saa 2. etapp teha prototüüpi õigesti: prototüüp peab vastama sellele, _kes päriselt_ vaatab, kinnitab ja reageerib.

* * *

6) Testimine, simulatsioon ja “sensorid pole veel olemas” — kriitiline puuduolek
--------------------------------------------------------------------------------

Sinu “Piisavalt kaetud / puudujäägid” dokument ütleb väga otse, et simulatsioonide ja testvõimekuse teema on Nortali dokumendis puudu ning see on kriitiline, et saaks harjutada, arendada ja turvaliselt katsetada.

1\. Piisavalt kaetud teemad Nort…

See on eriti oluline PPA olukorras, kus sensoreid alles hangitakse: kui sul pole simulaatorit/testandmeid, siis 2. etapi prototüüp jääb kas “UI makett” või “tulevikus näeme” ning riskide testimise eesmärk (mida tellija ise rõhutab) ei täitu.

Eelanalüüs

Eelanalüüsi väljundina peaks sisuliselt olema “teststrateegia”:

*   kuidas simuleeritakse radar/RF/kaamera sündmusi,
*   kuidas testitakse alarmitormi, valehäireid, võrgu katkestust,
*   kuidas valideeritakse rolliõiguseid ja logide terviklust.

* * *

7) Koodi omand ja avatud lähtekood: Nortali “vahetatavus” ei ole sama mis “PPA kontroll”
----------------------------------------------------------------------------------------

Sa palusid seda käsitleda mõõdukalt — aga PPA riskina on see suur ja on materjalides korduvalt välja tulnud.

“Puudujäägid” dokument ütleb otse, et vestlustes oli mure: 10 aasta pärast arenduspartner vahetub ja “arendus ei tohi tuulde lennata”, ning et open source / vähemalt tellijale täielik koodiõigus oli aruteludes sees, kuid Nortali tekstis seda põhimõtet otsesõnu ei ole.

1\. Piisavalt kaetud teemad Nort…

Lisaks on haldus- ja pidamiskorra küsimustes eraldi plokk avatud vs suletud lahenduste riskidest ja arendajavahetuse riskidest (dokumenteeritus, üleandmine, varuarendaja, hooldusprotseduurid).

PPA drooniseiresüsteemi haldus-…

Eelanalüüsis peaks olema minimaalselt:

*   IP ja koodi omandi soovitus (kood tellija omandisse, repo tellija hallata),
*   ülevõtmise nõuded (dokumentatsioon, automaattestid, build-protsess, sõltuvuste peegel sisevõrgus),
*   tarnijasõltumatuse printsiibid (moodulid/adapterid, mitte “üks monoliit + vendor-spetsiifiline integratsioon”).

Praegu Nortali pakkumine räägib “vahetatavusest” pigem tehnilise arhitektuuri võtmes, aga ei seo seda “õigusliku ja praktilise kontrolliga” (kood, repo, build, testid).

* * *

8) Toimepidevus ja sisevõrgu elutsükkel: “krüpteerime ja logime” ei kata hooldusreaalsust
-----------------------------------------------------------------------------------------

Tellija nõuab sisevõrgu toimimist ja seda, et uuendusi saab PPA ise juhise järgi teha; 24/7 töökindlus.

Eelanalüüs

Nortali EDGE-visioon sisaldab remote management’i, krüptot ja allkirjastamist.

NORTAL

Aga eelanalüüsis on puudu “kuidas päriselt elutsüklit hallatakse”, näiteks:

*   kuidas toimub offline release (pakendamine, allkirjad, checksum),
*   kuidas käib rollback,
*   kuidas hoitakse konteinerregistrit / pakirepot sisevõrgus,
*   mis on hooldusaknad, DR (taaste), monitooring, logide säilitamine.

See ei ole “detailanalüüsi hilisem asi” — vastupidi: kui 2. etapis prototüübitakse, peab prototüüpima ka kõige riskantsemaid elutsükli asju (offline deploy, õigused, auditeeritavus).

* * *

9) Riskianalüüs: Nortal loetleb riske, aga “risk → test” ahel jääb nõrgaks
--------------------------------------------------------------------------

Nortal loetleb riskid, sh:

*   kas sensorid toetavad EDGE võimekust,
*   self-healing võrk,
*   tuvastusalgoritmide töökindlus,
*   distributed arhitektuuri töökindlus katkestustes,
*   side avaliku vs salastatud võrgu vahel.
    NORTAL

See on hea algus, aga eelanalüüsi “parim väärtus” tekib siis, kui iga risk on seotud **konkreetse prototüübikatsega** (mida 2. etapis tuleb teha) ja mõõdikuga (mis on “õnnestumine”). Praegu on riskid nimekirjana, aga puudub “testiplokk”: millised katsed, millised testandmed, millised mõõdetavad tulemused.

Just see on tellija 2. etapi mõte (“tehnilise prototüübi loomine riskikohtade testimiseks”).

Eelanalüüs

* * *

10) Väljundite hankevalmidus: Nortali tegevusplaan on olemas, aga “artefaktide nimekiri” peaks olema karmim
-----------------------------------------------------------------------------------------------------------

Sinu soovitused ütlevad, et eelanalüüs peaks juba eos defineerima konkreetsed väljundid: nõuete kataloog, kontseptuaalne arhitektuuridiagramm, andmevahetuse skeem, õiguslike kitsaskohtade analüüs lahendustega, kasutusjuhtumid.

Eelanalüüsi pakkumise analüüs j…

Nortali tegevusplaan loetleb tegevusi (“andmemahtude prognoos”, “arhitektuuri visioon”, “prototüüpimise vajaduse määratlemine”), aga ei ütle, mis kujul need “hankes kasutatavaks” muutuvad.

NORTAL

Praktiline lünk on “definition of done” tasemel: näiteks kas “rollide maatriks” tähendab 1 tabelit, või tähendab see:

*   rollid + atribuudid (asukoht, sensorigrupp, andmeklass),
*   näidisreeglid,
*   testjuhtumid (“Tartu kordon ei näe Tallinna sensorit”),
*   ning konfliktide lahendus (“kui kriisirežiim, siis õigused laienevad X tingimusel”).

Kui neid ei nõuta eelanalüüsi väljundina, siis 2. etapi hange saab väga ebamäärase lähte.

* * *

11) Metoodiline kvaliteedisignaal: “DAC7” sisukorra lekke-episood
-----------------------------------------------------------------

Nortali sisukorras on drooniseire dokumendis sees “OECD riikidele DAC7 laiendamise eelanalüüs”.

NORTAL

See ei ole sisuline “suur patt”, aga see on punane lipp selle kohta, et dokument on osaliselt mallist ja mitte lõpuni puhastatud. Sellise signaali korral on mõistlik tellijana eriti rangelt nõuda, et:

*   PPA-spetsiifilised küsimused (sisevõrk, operaatori mudel, alarmitöövoog, pidamine, testkeskkond, IP/kood) ei jääks üldsõnaliseks,
*   ning lõpptulemus oleks “hanke tööriist”, mitte “konsultatsiooniraport”.

* * *

Kui soovid, teen järgmise sammuna **konkreetse “nõua Nortalilt / lisa eelanalüüsi sisendisse” loetelu**, aga mitte bulletitena — vaid iga lünga juurde lühike lõik: _miks oluline_ + _mida täpselt nõuda väljundina_ + _kuidas see 2. etapi prototüübis testitakse_.



---
Powered by [ChatGPT Exporter](https://www.chatgptexporter.com)