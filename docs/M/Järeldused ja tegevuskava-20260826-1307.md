# Järeldused ja tegevuskava

**User:** Anonymous  
**Created:** 8/13/2026 9:51:59  
**Updated:** 8/18/2026 22:42:06  
**Exported:** 8/26/2026 13:07:05  
**Link:** [https://chatgpt.com/g/g-p-6a796fe178f08191965b7cfdbb567889/c/6a7d698e-72b0-83eb-8a0e-2eeaedde62a2](https://chatgpt.com/g/g-p-6a796fe178f08191965b7cfdbb567889/c/6a7d698e-72b0-83eb-8a0e-2eeaedde62a2)  

## Prompt:
8/13/2026, 9:51:58 AM

selgita järeldusi ja tegevuskava:

[Attachment: Kleebitud tekst(20260813-065156).txt]

## Response:
8/13/2026, 9:51:59 AM

Vestluse põhisõnum ei ole niivõrd „kas kaamerate nimekiri on AK?”, vaid **enne Anduriliga tehnilise integratsiooni sisulist alustamist tuleb paika saada, millist PPA infot neile üldse tohib anda ja millistel tingimustel**.

### Järeldused

**1. Anduriliga on vaja üldist konfidentsiaalsuslepingut, mitte ainult kaamerate jaoks.**  
Vestluses jõutakse üsna selgelt järeldusele, et kaamerate mudelid on ainult esimene näide. Projekti käigus tuleb tõenäoliselt jagada võrkude, liideste, seadmete, konfiguratsiooni ja muu tehnilise keskkonna infot. Seetõttu soovitatakse teha leping ettevõttega üldiseks infovahetuseks ning kasutada kohapealset Andurili inseneri kontaktisikuna, mitte sõlmida midagi ainult temaga. `Kleebitud tekst.txt`

**2. NDA/konfidentsiaalsusleping ei anna automaatselt õigust jagada riigisaladust või „piiratud” infot.**  
See on oluline eristus. Vestluses öeldakse otseselt, et AK-info puhul on konfidentsiaalsusleping vajalik, kuid kui mingi info kvalifitseerub RS-iks/piiratud tasemele, rakenduvad eraldi käitlemis-, loa- ja infosüsteeminõuded. `Kleebitud tekst.txt`

**3. Info klassifikatsioon sõltub sisust, mitte lihtsalt sellest, kus see asub.**  
Näiteks „IP-aadressid/config” versus reaalne operatiivne kaamerapilt võivad olla väga erineva tundlikkusega. Samuti ei saa järeldada, et „kui võrku pääseb mujalt ligi, siis see ei saa olla piiratud”. Vestluse järgi tuleb hinnata konkreetselt **mida Anduril näeb, mida Lattice töötleb ja mida PPA süsteemist välja antakse**. `Kleebitud tekst.txt`

See on sinu projekti jaoks eriti oluline: klassifitseerimise objekt ei peaks olema ainult dokument, vaid ka **andmevoog**.

Näiteks:

> radar → Lattice: track/plot data  
> kaamera → Lattice: live video  
> Idaseire → Lattice: objekt/alarmsündmus  
> Lattice → kasutaja: fused operational picture  
> Andurili insener → PPA võrguseadmed: configuration access

Neid tuleb hinnata eraldi.

**4. Kõige olulisem arhitektuuriline piir on RS-info sattumine Lattice'i.**  
Vestluses tuuakse välja, et kui süsteemis hakkab liikuma RS-andmestik, võib see tõsta infosüsteemi nõuete taset (vestluses räägitakse S2 → S3 hüppest) ja kulud/nõuded kasvavad oluliselt. `Kleebitud tekst.txt`

Seetõttu oleks PoC jaoks väga mõistlik projekteerimispõhimõte:

**Lattice PoC-sse ei lasta RS/piiratud andmeid enne, kui selleks on teadlikult eraldi otsus tehtud.**

See ei tähenda, et neid tulevikus ei integreerita. Pigem hoiab see esimese tehnilise tõestuse oluliselt lihtsamana.

### Tegevuskava

1. **Käivita Anduril-PPA konfidentsiaalsuslepingu protsess.** Mitte kaamerate nimekirja jaoks eraldi, vaid projekti tehnilise infovahetuse katmiseks. Vestluse järgi saab kasutada olemasolevat standardset Delta töövoogu ning Andurili kohapealne inimene saab anda firma legal/esindaja kontaktid. `Kleebitud tekst.txt`

2. **Leia PPA-s õige infoturbe/riigisaladuse kontakt.** Vestluses viidatakse „Katile” kui inimesele, kes teeb analoogseid asju erafirmade ja hangetega. Temaga tuleks kontrollida mitte ainult NDA-d, vaid eelkõige seda, millised kavandatavad andmed või ligipääsud võivad ületada AK taseme. `Kleebitud tekst.txt`

3. **Tee Lattice PoC andmevoogude nimekiri.** Mitte kogu tulevase süsteemi analüüs, vaid esimese etapi kohta näiteks: radar track data, üks kaamera/video, Remote ID objektid, suunamääraja andmed, Lattice Node ↔ Node liiklus, kasutaja ligipääs ning Andurili inseneri administratiivne ligipääs.

4. **Lisa iga voo juurde klassifikatsioon: `AK / RS? / kontrollida`.** „Kontrollida” on praegu täiesti aktsepteeritav tulemus. Oluline on, et enne päris andmete jagamist oleks see lahendatud. Vestluses rõhutatakse just seda, et klassifikatsiooni ei tohi hakata tagantjärele parandama pärast info väljasaatmist. `Kleebitud tekst.txt`

5. **Vali PoC sensorid võimalusel nii, et RS-probleemi ei tekiks.** See sobib hästi projekti eesmärgiga tõestada minimaalsete esinduslike seadmetega eri võrkude ühendamist. Esimese milestone'i jaoks pole vaja tõestada, et *kõik* PPA andmed saavad Lattice'is liikuda; vaja on tõestada, et arhitektuur töötab.

6. **Alles seejärel anna Andurilile vajalik tehniline info.** Kaamerate mudeliloend, võrguinfo, IP-d, konfiguratsioonid jne vastavalt sellele, mida eelnev analüüs lubab.

Kõige olulisem praktiline väljund oleks seega üsna väike tabel:

| Andmevoog / ligipääs | Allikas | Lattice saab | Anduril näeb | Klassifikatsioon | Otsustaja |
|---|---|---|---|---|---|
| Radar | Turvavõrk | track data | jah | kontrollida | PPA |
| Kaamera | Idaseire võrk | video | jah | kontrollida | PPA |
| Remote ID | … | objektid | jah | … | … |
| Network config | SMIT | IP/config | vajadusel | … | … |

**Potentsiaalne lõks:** vestluses osalejate arvamusi AK/RS/S2/S3 kohta ei tasu võtta ametliku klassifikatsiooniotsusena. Nad ise rõhutavad korduvalt, et lõplik hinnang tuleb teha sisu ja kehtivate kaitsenõuete põhjal. Seega on transkript väga hea **küsimuste ja tegevuste allikas**, kuid mitte klassifitseerimisotsuse alus. `Kleebitud tekst.txt`

## Prompt:
8/13/2026, 1:14:43 PM

millele see leping vastama peaks? 
kuidas ja kellega peaks lepingu tegema? kes peaks olema Andurilis? mida mainitakse isikute kohta?

## Response:
8/13/2026, 1:14:44 PM

> **Veebist otsimine**
>
>
> **Otsing 4 veebisaidilt**
>
> 
>
> Töötles mõne sekundi

Transkripti põhjal on siin tegelikult **kaks eri režiimi**, mida ei tohiks üheks „konfidentsiaalsuslepinguks“ kokku mõelda.

### 1. Milline leping praegu teha?

Vestluse soovitus on üsna konkreetne: teha **PPA ↔ Anduril ettevõttetasemel üldine konfidentsiaalsusleping**, mitte leping ühe inseneriga ega ainult kaamerate nimekirja kohta.

Põhjendus on, et projektis hakatakse Anduriliga vahetama palju enamat kui kaamerate mudelid: tehnilised kirjeldused, võrgud, konfiguratsioonid, süsteemi sisendid jne. Seda öeldakse üsna otseselt: *„mitte ainult kaamerate peale, vaid kogu info vahetuseks“*. `Kleebitud tekst.txt`

Transkriptist tulenev soovitud ulatus oleks seega ligikaudu:

**PPA ja Anduril Industriesi vaheline konfidentsiaalsusleping, mis katab Lattice'i / seiresüsteemi integratsiooni ja arendamise käigus vahetatava AK ja muu konfidentsiaalse tehnilise informatsiooni.**

Ma ei piiraks lepingut konkreetsete sensorite, kaamerate ega esimese PoC-ga, sest just selle vastu vestluses argumenteeritakse.

### 2. Kellega Andurilis leping teha?

Siin on transkript päris hea.

Kohapealse tehnilise Andurili inimesega **ei soovitata lepingut eraisikuna sõlmida**. Küsimusele, kas teha leping „konkreetselt ühe inimesega“, vastatakse sisuliselt:

> „Sa teed terve ettevõttega, kes üks inimene.“ `Kleebitud tekst.txt`

Edasi täpsustatakse rollid:

- kohapealne Andurili tehniline inimene võib olla **kontaktisik**;
- tema peaks andma Andurilist õiged ettevõtte kontaktid;
- lepingu sisuline/formaalne vastaspool peaks minema **Andurili legal'i**;
- allkirjastama peab **ettevõtte esindusõigusega isik**. `Kleebitud tekst.txt`

Seega praktiliselt:

**PPA → kohapealne Andurili technical representative → Anduril Legal / contracts → Andurili volitatud allkirjastaja.**

Andurili konkreetse juriidilise keha nime (nt Anduril Industries, Inc. või Euroopa tütarühing) transkript **ei ütle**. Seda ei tasu ise oletada - Anduril peaks ütlema, milline nende juriidiline isik selle projekti lepingupooleks tuleb.

### 3. Mida tähendab jutt „isikutest“?

Siin on oluline nüanss. Vestluses soovitatakse lepingusse/menetlusse panna **Andurili kontaktisikud**:

> „tehke Anduriliga ... konfleping ... pange need isikud ja krüptitult saadate ... Andurili kontaktina.“ `Kleebitud tekst.txt`

Minu tõlgendus on, et eesmärk pole teha iga inimesega eraldi NDA, vaid:

**ettevõttetaseme leping + teada/nimetatud Andurili inimesed, kellele PPA kaitstavat infot projekti raames edastab.**

See sobib ka *need-to-know* põhimõttega: ligipääs ei peaks tekkima automaatselt kogu Andurilile.

Kui aga info osutub **riigisaladuseks**, muutub isiku küsimus palju rangemaks. Siis NDA-st ja lepingus nimetamisest ei piisa. Eesti RSVS eristab „juurdepääsuvajadust“, „teadmisvajadust“ ja formaalset „juurdepääsuõigust“. ([Riigi Teataja](https://www.riigiteataja.ee/akt/13009805.pdf?utm_source=chatgpt.com))

Transkript ütleb sama praktilisemalt: tuleb riigisaladuse kaitsega tegeleva PPA poolega kontrollida, **kas Andurili inimeste load/õigused on PPA poolt kontrollitud**. `Kleebitud tekst.txt`

### 4. Millele leping peaks vastama?

**Transkriptist endast** saab kindlalt järeldada järgmised nõuded:

1. leping PPA ja Andurili ettevõtte vahel;
2. hõlmab kogu projekti käigus vahetatavat konfidentsiaalset infot, mitte ainult kaameraid;
3. võimaldab määrata Andurili kontaktisikud;
4. info edastatakse nõuetekohaselt/turvaliselt (transkriptis konkreetselt „krüptitult“);
5. kasutatakse PPA olemasolevat standardset konfidentsiaalsuslepingu protsessi - mainitakse **Delta töövoogu** ja standardlepingut. `Kleebitud tekst.txt`

Transkript **ei anna lepingu konkreetseid klausleid** nagu säilitustähtaeg, kustutamine, subcontractor'id, incident notification, governing law jne. Neid ei saa selle vestluse põhjal lepingu nõudena väita.

Kõige mõistlikum järgmine samm tundub seetõttu olevat väga lihtne: **mitte hakata ise NDA-d koostama**, vaid võtta PPA olemasolev standardne konfidentsiaalsusleping/Delta töövoog ja küsida Andurili kohapealselt inimeselt:

> Milline Andurili juriidiline isik peab olema lepingu vastaspool, kes on Legal/Contracts kontakt ning millised Andurili tehnilised töötajad vajavad projekti käigus ligipääsu PPA konfidentsiaalsele teabele?

Seejärel saab PPA enda infoturbe/RS-pool otsustada, **kas see leping katab kavandatud AK-infovahetuse või on mõne andmevoo puhul vaja juba teistsugust režiimi**.

**Potentsiaalne lõks:** NDA-d ei tohiks sõnastada nii, nagu see annaks Andurilile õiguse saada „PPA infot“ üldiselt. Ligipääsu ulatus ja nimetatud inimesed võiksid olla seotud projekti ning teadmisvajadusega; RS-info tuleks sellest tavalisest NDA-protsessist selgelt eraldi hoida. ([Riigi Teataja](https://www.riigiteataja.ee/akt/13009805.pdf?utm_source=chatgpt.com))

---

**Sources:**

- [Väljaandja:](https://www.riigiteataja.ee/akt/13009805.pdf?utm_source=chatgpt.com)

## Prompt:
8/13/2026, 2:38:38 PM

näita, kus viidatakse Vestluses viidatakse „Katile”

## Response:
8/13/2026, 2:38:38 PM

> **Veebist otsimine**
>
>
> **Otsing 6 veebisaidilt**
>
> 
>
> Töötles paar sekundit

Jah. **„Kati“ on transkriptis ainult ühes kohas**, real 85:

> „...rääkida riigisaladuse kaitsetalitusega, kuidas, mismoodi, kas nende load on kontrollitud meie poolt, meie asutuse poolt, **no Kati teab seda, Kati teeb ju seda erafirmadega hangetis kogu aeg.**“ `Kleebitud tekst.txt`

Kontekst on oluline. Vahetult enne räägitakse olukorrast, kus **PPA annab infot erafirmale** ning tuleb välja selgitada, kas vastaspoole inimestel on vajalikud load/õigused ja kuidas PPA seda kontrollib. Seejärel tuuakse Kati näiteks inimesest, kes **tegeleb selliste küsimustega erafirmade hangetes**.

Seega minu eelmine sõnastus, et Kati on „infoturbe/riigisaladuse kontakt“, oli **liiga tugev järeldus**. Transkript ütleb ainult, et Kati *teab seda protsessi* ja *teeb seda erafirmadega hangetes*. Tema ametikohta ega täpset vastutusala siin ei nimetata.

**Praktiline järeldus:** tasub välja selgitada, *kes see Kati on*, sest vestluse järgi on ta hea inimene, kellelt küsida, kuidas Andurili-taolise erafirmaga vajalikud load/infovahetuse formaalsused korrektselt lahendada.

## Prompt:
8/13/2026, 3:46:00 PM

soovitatud 4 punktiline plaan. edasised todo listis andurili ja infosüsteemi vaates.

[Attachment: Kleebitud tekst(20260813-124555).txt]

## Response:
8/13/2026, 3:46:02 PM

Koosolekus pakutud **4-punktiline järjestus** on üsna selge ja tasub säilitada just sellises prioriteedis:

1. **Saada Lattice tehniliselt tööle.**  
   Panna esimene päris node/server PPA keskkonnas tööle, lahendades SMIT-i, majutuse, võrgu ja infoturbe küsimused. Mõte on kõigepealt tõestada, et „toode on asutusena tervikuna püsti“. `Kleebitud tekst.txt`

2. **Selgitada õiguslikult ja infosüsteemi vaatest, milliseid andmeid süsteem töötleb.**  
   Kaardistada mitte ainult see, mida Lattice *suudab* sisse võtta, vaid mida PPA *tahab* sinna sisse võtta: millised dataset'id, isikuandmed, identifikaatorid, säilitamine, jagamine jne. Selle põhjal saab otsustada, kas vaja on andmekogu/infosüsteemi pidamiskorda, õigusakti muudatust või muud õiguslikku alust. `Kleebitud tekst.txt`

3. **Paika panna PPA/KV töökorraldus.**  
   Kes süsteemi kasutab, kes näeb tervikpilti, kes reageerib, kes on peakasutaja, kuidas PPA ja Kaitsevägi sama süsteemi või andmeid kasutavad. See on eraldi küsimus tehnilisest integratsioonist. `Kleebitud tekst.txt`

4. **Alles siis prioriseerida Andurililt tellitavad arendused.**  
   Näiteks Apollo/JRC integratsioonid, operaatori identiteedi rikastamine, keelualad, täiendavad kihid jne. Neid ei peaks laskma esimese node'i püstitamist blokeerida. `Kleebitud tekst.txt`

## TODO - Andurili vaade

**P0 - kohe**

- [ ] Anda Andurilile teada, milline on esimese etapi minimaalne scope: **Lattice node tööle + valitud sensorite ühendamine**, mitte veel kogu tulevane C2.
- [ ] Saada Andurililt kirjalik ülevaade:
  - milliseid andmeid Lattice iga kavandatud sensori puhul vastu võtab;
  - millised väljad salvestatakse;
  - mida ainult jooksvalt töödeldakse;
  - kus andmeid hoitakse;
  - kui kaua;
  - millised andmed liiguvad node'ide vahel;
  - millised andmed võivad liikuda Andurili teenustesse/välja PPA infrastruktuurist.
- [ ] Teha **sensor → Lattice dataset matrix**. Näiteks radar, kaamera, Remote ID, raadiosensor jne.
- [ ] Täpsustada Anduriliga, milline osa süsteemist vajab püsivat ajaloolist salvestust. Koosolekul jõutakse sisuliselt järeldusele, et ainult live-vaatest ei piisa. `Kleebitud tekst.txt`
- [ ] Eraldada standardtoote funktsioonid ja **custom development**. Kõik, mida Andurililt tuleb eraldi arendada, läheb backlog'i, mitte esialgse püstitamise eeltingimuseks.

**P1 - pärast esimese node'i arhitektuuri lukustamist**

- [ ] Koostada Anduriliga soovitud integratsioonide backlog:
  - Transpordiameti/LOIS/registri andmed;
  - Remote ID identifikaatorite rikastamine;
  - keelualad/geozones;
  - PPA enda objektid ja kihid;
  - Apollo/JRC väljad;
  - vajadusel Kaitseväe andmeallikad.
- [ ] Iga arenduse juurde märkida **operatiivne kasutusjuht**, mitte lihtsalt „oleks hea integratsioon“.
- [ ] Küsida Andurililt iga arenduse mahu, sõltuvuste ja vajalike API-de hinnang.

See vastab ka koosolekul toodud kriitikale: pelgalt „droon lendab siin“ tüüpi situatsioonipilt ei ole lõppkasutajale piisav; väärtus tuleb rikastamisest - kas objekt tohib seal olla, kes seda käitab, mida on vaja reageerimiseks jne. `Kleebitud tekst.txt`

## TODO - infosüsteemi / PPA vaade

**P0 - paralleelselt tehnilise tööga**

- [ ] Viia **SMIT + PPA infoturve + projekti tehniline pool ühe laua taha** ja otsustada:
  - kes süsteemi majutab;
  - kelle teenus see SMIT-i mõttes on;
  - kes vastutab serveri, võrgu ja turvanõuete eest;
  - milline on ametlik tellimus/teenus;
  - millised on kulud ja tähtajad.  
  See on koosolekul konkreetselt soovitatud tegevus. `Kleebitud tekst.txt`
- [ ] Teha **andmestike register** vähemalt järgmiste väljadega:
  - allikas;
  - andmeväljad;
  - kas isikuandmed;
  - kas identifikaator võimaldab isikut tuvastada;
  - töötlemise eesmärk;
  - salvestatakse / ei salvestata;
  - säilitusaeg;
  - kellele jagatakse;
  - õiguslik alus;
  - turvaklassifikatsioon.
- [ ] Eraldi käsitleda **live processing vs storage**. Koosolekus tuleb korduvalt välja, et salvestamine muudab nii õiguslikku kui praktilist pilti. `Kleebitud tekst.txt`
- [ ] Selgitada, kas Lattice on:
  - eraldi infosüsteem;
  - olemasoleva infosüsteemi osa;
  - andmekogu;
  - või lihtsalt töötlus-/integratsioonikiht mõne olemasoleva andmekogu peal.
- [ ] Määrata infosüsteemi **vastutav kasutaja / peakasutaja / andmete omanikud**.

**P1 - õiguslik lahendus**

- [ ] Annika/õigusloome + andmekaitsega hinnata iga dataset'i õiguslik alus.
- [ ] Teha eraldi kohtumine **PPA + Kaitsevägi + õigus + andmekaitse + tehniline pool**, sest mõlemad hakkavad tõenäoliselt kasutama samu või kattuvaid andmeid. Koosolekul pakutakse isegi võimalust, et õiguslikult võiks olla tegemist ühise infosüsteemi või olemasoleva infosüsteemi osaga. `Kleebitud tekst.txt`
- [ ] Selgitada kiiresti, kas vajatakse:
  - sisemist pidamiskorda;
  - andmevahetuslepinguid;
  - olemasoleva õigusakti täiendamist;
  - uut õiguslikku alust.
- [ ] Remote ID puhul käsitleda eraldi **objekti tehnilist ID-d vs operaatori/isiku tuvastamist**. Koosolekul tekib just siin piir puhta situatsiooniteadlikkuse ja isikuandmete töötlemise vahel. `Kleebitud tekst.txt`

### Minu soovitatud juhtimisloogika

Praktiliselt teeksin sellest kolm paralleelset töövoogu:

**A. `Lattice MVP`** - SMIT + infoturve + Anduril → node tööle.  
**B. `Data & Legal`** - dataset'id → eesmärk → säilitamine → õiguslik alus.  
**C. `Capability backlog`** - kõik Andurili lisaarendused ja integratsioonid.

A ja B peavad liikuma **paralleelselt**. C ei tohiks A-d blokeerida.

Kõige suurem oht oleks teha praegu vastupidi: hakata arutama Apollo, registrite, Remote ID rikastamise, merepiiri, JRC, Kaitseväe ja kümnete sensorite lõplikku lahendust enne, kui **üks korrektse majutuse ja andmemudeliga Lattice node reaalselt töötab**. Täpselt selle fookuse hajumise vastu koosolekul hoiatatakse. `Kleebitud tekst.txt`



---
Powered by [ChatGPT Exporter](https://www.chatgptexporter.com)