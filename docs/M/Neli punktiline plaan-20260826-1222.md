# Neli punktiline plaan

**User:** Anonymous  
**Created:** 8/19/2026 18:54:11  
**Updated:** 8/19/2026 19:21:16  
**Exported:** 8/26/2026 12:22:45  
**Link:** [https://chatgpt.com/g/g-p-6a796fe178f08191965b7cfdbb567889/c/6a85d195-09c8-83eb-ad09-4053fb77ca72](https://chatgpt.com/g/g-p-6a796fe178f08191965b7cfdbb567889/c/6a85d195-09c8-83eb-ad09-4053fb77ca72)  

## Prompt:
8/19/2026, 6:54:08 PM

Mis on see 4 punktiline plaan, mida koosolekul välja käidi

## Response:
8/19/2026, 6:54:10 PM

Koosolekul sõnastati Anduril/Lattice’i töö **nelja suure blokina**:

1. **Süsteem päriselt tööle saada** - saada Lattice/Anduril PPA-s serveritel jooksma, lahendada SMIT-i, majutuse, võrgu ja infoturbe küsimused. Seda nimetati esimeseks prioriteediks. `Veik votta Recording 580.docx`

2. **Õiguslik pool paika saada** - teha selgeks:
   - millised andmed süsteemi tulevad;
   - mida PPA tohib koguda ja säilitada;
   - kui kaua säilitada;
   - kellega andmeid jagada;
   - kas vaja on õigusakti/seaduse muudatusi, andmekogu regulatsiooni jne.  
   Koosolekul öeldi sisuliselt: **„kõige tähtsam on saada tööle ja õigus [paika]“**. `Veik votta Recording 580.docx`

3. **PPA sisemine töökorraldus** - otsustada, **kes süsteemi kasutab ja mille eest vastutab**. Näiteks kas JRC vaatab üleriigilist pilti, teised üksused piirialasid, kuidas toimub reageerimine ja kes jälgib, et sündmus ei jääks tähelepanuta. `Veik votta Recording 580.docx`

4. **Arendused ja integratsioonid** - alles seejärel määrata, **mida Andurililt juurde arendada**. Näitena toodi, et patrullpolitseinik saaks Apollos seirest tulnud droonisündmuse koos asukoha ja vajaliku infoga otse oma töövoogu. Siia kuuluvad ka muud vajalikud kihid ja integratsioonid. `Veik votta Recording 580.docx`

Ehk väga lühidalt:

**1. Püsti → 2. Õiguslikult korrektseks → 3. Töökorraldus → 4. Arendused.**

Lisaks paluti sellest teha **reaalne tegevuste järjestus**, kus iga bloki juures oleks töömaht, vajalikud osapooled ja hinnanguline tähtaeg, et näha, mida saab paralleelselt teha. Sama tegevuskava vajadust rõhutati ka hilisemas vestluses. `V Recording 598.docx`

**Võimalik lõks:** punkt 4 ei tähenda lihtsalt „nice-to-have arendusi“. Osa integratsioone, nt operaatori identifitseerimine või Transpordiameti andmed, võivad olla vajalikud selleks, et süsteem annaks üldse operatiivset väärtust.

## Prompt:
8/19/2026, 6:55:36 PM

mõtle sügavamalt ja paremini nende allikate põhjal

## Response:
8/19/2026, 6:55:38 PM

Vaatan selle neljapunktilise plaani uuesti läbi mitte ainult sõnastuse, vaid ka **miks selline järjekord tekkis, mis on iga punkti tegelik väljund ja mis on nende vahelised sõltuvused**. Eriti oluline on eristada „tehniliselt püsti“ ja „operatiivselt kasutatav“, sest koosolekul kipuvad need kohati kokku jooksma.

> **Structuring workstreams**
>
> I’m organizing the plan around dependencies: establish hosting at two sites, map datasets before legal commitments, define operational ownership, and build integrations. I’m distinguishing platform readiness from remaining technical and governance work.
>
> **Structured workstreams**
>
> 
>
> **Synthesized deployment dependencies and portable multi-network server requirements**
>
> 
>
> Worked for 20s

Jah. Allikate põhjal on see 4-punktiline plaan tegelikult **palju sisulisem kui „tehnika → õigus → töökorraldus → arendus“**. Koosolekul üritati panna paika **tee katsetusest PPA päriselt kasutatava operatiivse süsteemini**.

Kõige olulisem tähelepanek: need neli punkti **ei ole neli võrdset paralleelset töövoogu**. Need moodustavad pigem sellise ahela:

**platvorm PPA kontrolli alla → määratle andmed ja õigus → määratle operatiivne mudel → ehita selle mudeli jaoks vajalikud integratsioonid.**

### 1. Saada PPA enda Lattice'i võimekus päriselt püsti

See ei tähenda lihtsalt „installime serveri“.

Koosolekul oli põhiprobleem, et **tehnoloogia enda toimimine oli suuresti juba tõestatud**. Kaitseväe poolel olid nelja radari andmed Lattice'is ning isegi Narvas kasutatav pilt oli Lattice'is olemas. PPA probleem oli hoopis see, et **PPA-l polnud veel oma node'i, majutust ega vajalikku organisatsioonilist rada selle käitamiseks**. `Ta ne t Recording 597.docx`

Seega esimese punkti tegelik eesmärk on:

**luua PPA-le kontrollitav ja ametlikult majutatud Lattice'i instants/node'id, mille peal saab järgmisi küsimusi päriselt lahendada.**

Selle alla lähevad vähemalt:

- kaks PPA node'i, sh SMIT-i ja Mustvee suund;
- SMIT-i teenus/tellimus: mida PPA neilt täpselt tahab;
- võrgujoonised ja ligipääsud;
- serverimajutuse arhitektuur;
- infoturbe nõuded ja kooskõlastus;
- SMIT-i hinnastus/kalkulatsioon;
- konfidentsiaalsus ja piiratud info käsitlemine;
- ühendus Kaitseväe olemasoleva Lattice'i keskkonnaga.

SMIT-i pudelikael ei olnud ainult tehniline. SMIT ei saanud isegi päriselt aru, **mis teenusena seda enda sees käsitleda** - arendusteenus, majutus vms. Seetõttu soovitati SMIT ja PPA infoturve ühe laua taha tuua ning leppida kokku konkreetsed tegevused, inimesed ja kuupäevad. `Veik votta Recording 580.docx`

See muudab minu eelmise vastuse olulises kohas: **punkt 1 on pigem „operational infrastructure + governance bootstrap“, mitte lihtsalt installatsioon.**

---

### 2. Selgitada välja, millise infosüsteemi PPA tegelikult ehitab ja mis õigusega

See on minu arvates kogu neliku **sisuliselt kõige kriitilisem punkt**.

Koosolekul öeldi otseselt, et järgmine küsimus tuleb *dataset'idest*:  
**mis andmed sealt tulevad ja milliseid andmeid me tahame, et seal tuleks.** `Veik votta Recording 580.docx`

See tähendab, et enne ei saa õigust korralikult lahendada, kui pole tehtud **andmekaarti**.

Näiteks:

- radari track;
- RF/Remote ID andmed;
- drooni ID;
- Remote ID operaatori/registreerimisnumber;
- puldi/piloodi asukoht;
- võimalik seos füüsilise isikuga;
- keelualad;
- PPA enda objektid ja tsoonid;
- Transpordiameti andmed;
- Kaitseväe andmed;
- ajalugu/salvestus versus ainult live-picture.

Just siin läks arutelu palju kaugemale tavalisest „teeme andmevahetuslepingu“.

Öeldi sisuliselt, et **andmevahetusleping ja sisemine pidamiskord on lihtsad asjad**. Suurem küsimus on, kas PPA-l on üldse õigus sellist infosüsteemi selliste andmetega pidada, kui kaua neid hoida, kellel on juurdepääs ja kas selleks tuleb muuta õigusakti. `Veik votta Recording 580.docx`

Ja see on tähtis nüanss:

**punkt 2 ei ole „jurist kontrollib süsteemi“. Punkt 2 on süsteemi andmemudeli ja õigusliku mandaadi koos projekteerimine.**

Koosolekul tekkis isegi variant, et PPA ja Kaitsevägi võiksid olla ühe süsteemi ühised peakasutajad või süsteem võiks õiguslikult olla mõne olemasoleva infosüsteemi osa. Kaitseväega soovitati teha sama andmete/õiguse arutelu eraldi töökohtumisena. `Veik votta Recording 580.docx`

---

### 3. Defineerida PPA operatiivmudel

Alles nüüd tuleb küsimus:

> **Kes seda pilti vaatab ja mida ta selle põhjal teeb?**

See punkt on suurem kui lihtsalt „töökorraldus“.

Koosolekul toodi otseselt näide:

- kas **JRC vaatab riigi tervikpilti**;
- kas piirkondlikud üksused vaatavad enda piiriala;
- kes märkab sündmust;
- kes reageerib;
- kes kontrollib, et midagi ei jäänud reageerimata;
- kuidas tekib üle-PPA situatsiooniteadlikkus. `Veik votta Recording 580.docx`

Seega selle punkti väljund peaks minu arvates olema midagi **operatiivse CONOPS-i** laadset:

**sensor → tuvastus → rikastamine → hindamine → sündmus → vastutav üksus → reageerimine → järeltegevus.**

See on eriti oluline, sest koosolekul tuli välja üks väga hea probleem:

> kui JRC näeb lihtsalt kaardil, et „droon lendab“, aga ei tea, kelle droon, kas see tohib seal olla ja miks see seal on, siis pole süsteemist operatiivtöös eriti kasu.

Seda öeldi üsna otseselt: pelgast droonide nägemisest ei piisa; kasutajal peab olema taustainfo, mille põhjal otsustada. `Veik votta Recording 580.docx`

Seega punkt 3 määrab tegelikult **punkti 4 requirements'id**.

---

### 4. Alles nüüd otsustada, mida Andurililt ja teistelt süsteemidelt arendada

See ei ole „Lattice feature wishlist“.

See on:

**millised tehnilised võimekused on vaja juurde ehitada, et punktis 3 defineeritud operatiivmudel toimiks.**

Koosoleku Apollo näide on väga kõnekas:

> patrullpolitseinik peaks oma töövahendis saama sündmuse ja drooni asukoha kaasa, mitte olema sunnitud eraldi Lattice'i pilti jälgima. `Veik votta Recording 580.docx`

Allikate põhjal hakkab siia arendusbacklog'i tekkima vähemalt:

- **Lattice → Apollo** sündmuse/koordinaadi edastus;
- Remote ID sisend;
- operaatori/registreerimisnumbri rikastamine;
- Transpordiameti andmed;
- LOIS/X-tee/Apollo seosed;
- keelualade kihid;
- PPA enda objektid/tornid/tsoonid;
- muud sensorikihid;
- vajadusel Transpordiameti poolne uus teenus/API.

Ja siin on oluline eristus: osa neist ei pruugi olla üldse **Andurili arendus**. Näiteks Transpordiameti teenuse loomine võib olla hoopis Eesti poole arendus, mille tulemuse Lattice lihtsalt tarbib. Koosolekul arutati isegi võimalust planeerida selle jaoks raha Transpordiameti arendusse. `Veik votta Recording 580.docx`

---

## Seega paneksin koosolekul mõeldud 4 punkti praegu nii kirja

| Etapp | Tegelik küsimus | Etapi väljund |
|---|---|---|
| **1. PPA Lattice püsti** | Kuidas saab PPA süsteemi reaalselt käitada? | PPA node'id, hosting, võrk, infoturve, SMIT protsess, KV ühendus |
| **2. Andmed + õigus** | Mida kogume ja mis alusel? | dataset map, säilitus, kasutajad/jagamine, õiguslik alus ja vajalikud muudatused |
| **3. Operatiivmudel** | Kes mida näeb ja mida selle põhjal teeb? | rollid, vastutused, JRC/piir/patrull workflow, reageerimismudel |
| **4. Arendusroadmap** | Mis on puudu, et see workflow päriselt töötaks? | Andurili + Apollo + TA + teiste süsteemide integratsioonide prioriseeritud backlog |

### Ja tegelik juhtimisülesanne oli veel üks aste kõrgemal

Hilisemas koosolekus küsiti sinult tegelikult **mitte lihtsalt neid nelja punkti üles kirjutada**, vaid teha neist tegevuskava: mis järjekorras asjad lähevad, mis ajaks, kelle sisendit on vaja ja millised ülesanded sellest teistele tekivad. Öeldi isegi, et pole vaja detailset „tšik-tšik-tšik“ plaani - vaja on põhistruktuuri, mille järgi juhtkond saab aru, **kus projekt on, mis seda blokeerib ja kellelt on vaja abi küsida**. `V Recording 598.docx`

Minu meelest on siin seega **kaks taset**:

**4 punkti = projekti sisuline arhitektuur.**  
**Tegevuskava = nende nelja punkti realiseerimise juhtimisvaade.**

Ja üks oluline vastuväide algsele järjekorrale: **punkti 2 ei saa tegelikult oodata, kuni punkt 1 on „valmis“.** Infoturve, andmeväljade kaardistus ja õiguslik analüüs peavad osaliselt juba node'i püstitamisega paralleelselt jooksma. Koosolekul endal öeldi samuti, et infoturve tuleb kohe kaasata, mitte alles pärast seda, kui Anduril on midagi ära installinud. `Veik votta Recording 580.docx`

Seega praktiliselt oleks õigem mudel:

**1 + 2 käivituvad kohe paralleelselt → 3 saab nende pealt konkreetseks → 4 tuleneb 2 + 3 tulemustest.**

See on minu arvates allikatele kõige paremini vastav tõlgendus.

## Prompt:
8/19/2026, 7:13:48 PM

mida me teame siinsete allikate põhjal oskame nendesse pakkuda

## Response:
8/19/2026, 7:13:51 PM

Panen nüüd nende nelja punkti alla **ainult selle, mida allikad juba reaalselt toetavad**: mis on teada, mida saab otsusena pakkuda, mis on veel hüpotees ja mis tuleb eraldi kinnitada. Nii saame sellest juhtkonnale kasutatava tegevuskava, mitte lihtsalt teemade loendi.

Praeguse materjali põhjal on **punkt 1 juba üsna hästi täidetav**, punkt 2 puhul saame koostada konkreetse andmekataloogi lähteversiooni, punkt 3 puhul pigem sihtmudeli hüpoteesi ning punkt 4 puhul juba üsna selge arendus-/integratsioonide järjekorra. Kõige vähem tõendatud on praegu lõplik kasutus- ja vastutusmudel.

> **Structuring the four points**
>
> I’m separating confirmed source details from proposed architecture and unresolved items. The strongest evidence supports point one; points two through four remain partly defined, so I’ll label assumptions clearly.
>
> **Structured the four points**
>
> 
>
> **Mapped Lattice requirements, architecture, integrations, and deployment priorities**
>
> 
>
> **Analyzed Lattice integration and developed a data governance plan**
>
> 
>
> Worked for 55s

Jah. Nende allikate põhjal saame nelja punkti alla panna juba **päris palju sisulist**, mitte ainult „vajab analüüsi“. Ma eristaks teadlikult **teadaoleva olukorra** ja **meie pakutava lahenduse**, sest eriti töökorraldus pole veel otsustatud.

| 4-punktiline teema | Mida saame juba sisuliselt pakkuda | Mis jääb otsustamiseks |
|---|---|---|
| **1. Lattice tehniliselt tööle** | Konkreetne pilootarhitektuur: Tallinna Node SMIT-i serverikeskkonnas; Mustvee Node Idaseire juures; Turvavõrgu Remote ID/RF sensorid Tallinna Node'i; üks Terma radar Mustvee Node'i; Node'id vahetavad operatiivset infot; kasutajad C2 kaudu. Olemasolevad süsteemid jäävad tööle ja Lattice saab paralleelse/read-only voo. | täpsed VM-id, võrguvood, tulemüürireeglid, remote admin, SMIT-i teenuse vorm, KV ühenduse transport |
| **2. Andmed + õigus** | Saame juba koostada esimese andmekataloogi: radar-track/plot/raw, Remote ID, RF bearing, video, Lattice'i tuletatud entity/track/event, kasutaja- ja logiandmed. Saame eraldada live-töötluse, säilitamise ja edasiandmise. Anduriliga saab NDA protsessi kohe käivitada. | iga andmeliigi õiguslik alus, säilitusaeg, isikuandmete piir, infosüsteemi/andmekogu staatus, vastutav töötleja/peakasutaja |
| **3. Operatiivne töökorraldus** | Saame kirjeldada sihtprotsessi: sensor → ühine olukorrapilt → sündmuse hindamine → vastutav üksus → reageerimine. Allikad toetavad probleemi, et täna töötatakse eri arvutites, võrkudes ja rakendustes ning soov on üks ühine pilt. | kas JRC on üleriigiline jälgija, mida jälgib kohalik piirivalve, kes kinnitab sündmuse, kes reageerib, kuidas PPA ja KV rollid jagunevad |
| **4. Arendused / integratsioonid** | Saame teha juba prioriseeritud backlog'i: Terma track-feed; Remote ID; RF DF; Milestone'i kaudu kaamera; Node↔Node infojagamine; hiljem Apollo/JRC, registririkastus, keelualad, PPA objektid ning Lattice→olemasolev PPA süsteem. | millised on standardtootes olemas, millised vajavad Andurili arendust, API-de olemasolu ning maksumus/töömaht |

See nelik on juba allikatega hästi põhjendatav. `Järeldused ja tegevuskava.txt`

### 1. Tehnilise punkti saame minu meelest juba peaaegu arhitektuurikirjelduseks teha

Kõige tugevam uus teadmine on **Mustvee**. Plado materjal tugevdab varasemat hüpoteesi, et Mustvee serverikeskkond on PPA kontrolli/halduse all, samal ajal kui SMIT annab Idaseire turvalise võrgutranspordi. See tähendab, et Mustvee Lattice Node'i ei pea käsitlema kui „uus Andurili süsteem SMIT-i keskkonnas“, vaid pigem kui **uus PPA töökoormus olemasolevas PPA serverikeskkonnas**, millele SMIT peab tagama vajalikud ühendused. `Haru · Haru · Network Findings and Gaps.txt`

Sealt tuleb päris konkreetne esimese etapi arhitektuur:

**Idaseire Terma → olemasolev tracker/feed → Mustvee Lattice Node → Lattice'i kaudu Tallinna Node → C2/KV Node'id.**

Turvavõrgu poolel võiks paralleelselt olla:

**Remote ID + RF-suunamääraja → adapter → Tallinna Lattice Node.**

Kaamera puhul on mõistlik esimesena proovida **Milestone'i kui olemasoleva VMS-i kaudu**, mitte anda Lattice'ile otse kaameravõrgu juhtimist. Sama mõte käib Teedu vestlusest läbi: kui olemas on master-VMS, tuleks uurida, kas uus platvorm saab selle pilti/funktsionaalsust enda sees kasutada või peegeldada. `Teet Recording 578.docx`

Radari puhul on väga oluline täpsustus: me ei peaks enam kirjutama lihtsalt „võtame UDP radarivoo“. Kõigepealt tuleb valida, kas piloodis antakse Lattice'ile **radarivideo, plotid, radari enda track'id või Mustasaare tarkvara loodud track'id**. Plado rõhutab, et need on tehniliselt eri liidesed ning SMIT vajab lõpuks konkreetset lähteaadressi, liidest/board'i, protokolli, sihtaadressi ja porti. `Haru · Haru · Network Findings and Gaps.txt`

Minu pakkumine oleks seega teha **MVP vaikimisi trackidega**, mitte raw-radariga. Raw võib olla teine test, kui tahame tõestada Andurili enda radaritöötlust. See vähendab ribalaiust, tootmissüsteemi puudutamist ja Mustasaare sõltuvust. Plado materjal toetab ka standardse märgiinfo jagamise loogikat ning ASTERIX/SAPIENT käivad reaalselt läbi võimalike formaatide kontekstis. `Haru · Haru · Network Findings and Gaps.txt`

### 2. Õiguspunkti saame juba muuta konkreetseks andmekaardistuseks

Me ei pea alustama juristiga küsimusest „mis on Lattice?“. Me saame talle anda juba **andmeliikide nimekirja ja vood**.

Piloodi jaoks on vähemalt järgmised klassid teada: radarist pärit märgi-/track-info; võimalik radarivideo; Remote ID tehnilised identifikaatorid ja asukohaandmed; RF-suunamäärang; kaamera/video; Lattice'is tekkinud tuletatud track/entity/event; ning süsteemi tehnilised logid. Edasi tuleb igaühe kohta otsustada eesmärk, säilitamine, kasutajad, jagamine, isikuandmete olemasolu, turvaklassifikatsioon ja õiguslik alus. Just sellist andmestike registrit soovitab ka olemasolev tegevuskava. `Järeldused ja tegevuskava.txt`

Remote ID on siin eriti hea piirijuhtum: **drooni tehnilise objekti nägemine** ja selle sidumine **operaatori või füüsilise isikuga** ei ole õiguslikult sama küsimus. Seetõttu võib esimese tehnilise piloodi teha ilma kogu registririkastust kohe eeltingimuseks muutmata ning käsitleda isikutuvastust eraldi töövoona. `Järeldused ja tegevuskava.txt`

Anduriliga tehnilise info jagamise rada on samuti juba olemas: ettevõttega standardne konfidentsiaalsusleping Delta kaudu; kui info liigub kõrgemale kui AK, ei piisa NDA-st ning tuleb kasutada vastavat riigisaladuse kaitse protsessi. `Konfidentsiaalsuslepingu nõuanded.txt`

Seega punkt 2 esimene reaalne väljund võiks olla mitte „õiguslik analüüs“, vaid **Data Processing Matrix v0.1**, mille juristid saavad veerg-veergu läbi töötada.

### 3. Töökorralduse osas teame probleemi paremini kui lahendust

Siin ma oleks ettevaatlikum. Allikad näitavad väga hästi **AS-IS probleemi**: operaatoril võib olla mitu võrku, arvutit ja rakendust; radari avastust võib olla vaja kontrollida teise süsteemi kaameraga; erinevad süsteemid ei moodusta ühist operatiivpilti. Ühe akna / keskse integratsioonikihi idee käib vestlustest korduvalt läbi. `MAIN SOURCE-Network Findings and Gaps-20260812-1855.md`

Aga me ei tea veel piisavalt, et kirjutada faktina:

> JRC vastutab kogu Eesti droonipildi jälgimise eest.

Seda saab pakkuda **arutelumudelina**, mitte otsusena.

Siin suudame juba teha kasuliku artefakti: 3-5 operatiivset kasutusjuhtu. Näiteks „Remote ID-ga droon keelualas“, „RF-sensor tuvastab emitteri“, „radar loob tundmatu track'i“, „piirivalveoperaator tahab radarimärki kaameraga valideerida“. Iga juhtumi puhul küsime ainult: **kes märkab, kes hindab, kellele eskaleerib, kes reageerib, mida peab järgmine inimene oma süsteemis nägema**.

See annab punktile 4 palju parema sisendi kui abstraktne küsimus „mida võiks Apollo või Lattice veel teha“.

### 4. Arenduspunkti saame juba kaheks jagada: piloodi integratsioonid ja tulevikuvõimekus

**Piloodi integratsioonid** on minu hinnangul juba üsna selged: üks Terma radar, Remote ID, üks RF-suunamääraja ja võimalusel üks Milestone'i kaudu kasutatav kaamera. See on piisavalt heterogeenne valim, et tõestada radar + RF + standardne digitaalne sensor + VMS-integratsioon, ilma et prooviksime korraga kogu PPA seiremaastikku sisse võtta. See sobib ka allikates läbiva mõttega, et esimene etapp peab tõestama platvormi ja andmevahetuse, mitte integreerima kõike. `Järeldused ja tegevuskava.txt`

Pärast seda on juba üsna hea **võimekuste backlog**: Remote ID operaatori/registri rikastus, keelualad, PPA objektikihid, Transpordiameti/LOIS andmed, Apollo/JRC sündmuse edastus ning vajadusel kahepoolne integratsioon, kus Lattice'is tekkinud või koondatud märgiinfo läheb tagasi olemasolevasse PPA süsteemi. Viimane on Plado pakutud eriti hea test, sest see tõestaks, et Lattice pole ainult uus kaart kasutajale, vaid päriselt **andmevahetuskiht olemasolevate süsteemide vahel**. `Haru · Haru · Network Findings and Gaps.txt`

Minu arvates saame seega nelja punkti juba ümber sõnastada **tulemustena**, mitte tegevustena:

**1. Pilootarhitektuur töötab vähemalt kahe PPA võrgu ja KV Node'ide vahel ning ühendab esinduslikud sensorid olemasolevaid tootmissüsteeme muutmata.  
2. Lattice'i töödeldavad andmed, nende liikumine, säilitamine ja õiguslik alus on kirjeldatud.  
3. On kokku lepitud, kes millist olukorrapilti kasutab, hindab ja mille põhjal reageerib.  
4. Piloodist tulenev integratsiooni- ja arendusbacklog on prioriseeritud operatiivse väärtuse järgi.**

See oleks minu meelest juba piisavalt konkreetne alus, mille alla hakata panema **tegevus → vastutaja → sõltuvus → väljund → tähtaeg**. `Järeldused ja tegevuskava.txt`

**Potentsiaalne lõks:** praegu on kõige rohkem materjali tehnilise arhitektuuri kohta, mistõttu võib kogu plaan hakata liiga tehniliseks kalduma. Tegelikult määrab punkt 3 lõpuks ära, kas Apollo, registririkastus, video või isegi Lattice C2 ise on lõppkasutaja jaoks üldse õige lahendus.

## Prompt:
8/19/2026, 7:16:16 PM

süvene veel ja leia seoseid

## Response:
8/19/2026, 7:16:17 PM

Lähen nüüd ühe taseme sügavamale: otsin allikatest mitte ainult vastuseid, vaid **korduvaid mustreid ja sõltuvusi** — kus sama probleem ilmub eri inimestel eri sõnastuses. Eesmärk on leida, millised otsused tegelikult avavad korraga mitu nelja-punktilise plaani teemat ja millised näivad olulised, aga on piloodi jaoks kõrvalised.

Üks tugev seos on juba näha: **Mustvee pole lihtsalt teine serveriasukoht**. See koht vähendab korraga vähemalt nelja riski — radariliidese keerukust, ribalaiust, tootmissüsteemi muutmise vajadust ja SMIT-i keskse teenuse vormistamise sõltuvust. Samal ajal võib olemasolev Idaseire märgiinfo väljaviimine olla Lattice'ile nii tehniline kui halduslik „precedent“, mida tasub kopeerida, mitte nullist leiutada.

> **Mapping architecture connections**
>
> I’m connecting recurring themes across the transcripts: existing air-picture feeds, Lattice integration, Mustvee routing, pilot success criteria, service ownership, operator workflows, security boundaries, vendor access, and legal obligations.
>
> **Mapped architecture connections**
>
> 
>
> **Evaluated Lattice and Plado integration architecture, governance, and sequencing**
>
> 
>
> **Connecting deeper themes**
>
> I’m seeing a staged strategy: define the target architecture, validate internal interoperability first, then formalize external sharing. Existing air-picture feeds offer reusable precedents, while aggregated track data limits bandwidth, vendor exposure, and integration risk without replacing current operational systems.
>
> **Connected deeper themes**
>
> 
>
> **Mapped pilot-to-production pathways and radar data-sharing architecture**
>
> 
>
> Worked for 57s

Jah. Kui panna allikad omavahel kokku, tuleb välja mõni **olulisem struktuurne seos**, mida ükski vestlus eraldi päris välja ei ütle.

### 1. Nelja punkti sees on tegelikult kaks eri projekti: piloot ja kasutuselevõtt

Plado vestlus teeb selle eriti selgeks. Hetke eesmärk ei ole veel „PPA võtab Lattice'i operatiivsüsteemina kasutusele“. Esialgu tahetakse tõestada, et **kaks PPA Node'i suhtlevad, andmed jõuavad sensoreist sisse ja liiguvad Node'ide vahel**. Alles pärast seda tuleb küsimus, kellele infot jagatakse, kuidas õigusi piiratakse, kes seda opereerib jne. `Plado Recording 593.docx`

Seega nelja punkti võiks sisuliselt jagada:

**Piloodi tõestus**
1. Node'id töötavad.
2. Esinduslikud andmeallikad jõuavad sisse.
3. Node'id vahetavad kontrollitult infot.
4. Olemasolevad süsteemid jäävad puutumata.

**Kasutuselevõtu ettevalmistus**
1. Milliseid andmeid päriselt hakatakse töötlema/jagama?
2. Kes neid kasutab ja milleks?
3. Kes vastutab süsteemi ja reageerimise eest?
4. Milliseid lisaarendusi selleks vaja läheb?

See seletab ka koosoleku näiliselt vastuolulist mõtet „kõigepealt saame asja püsti“ ja samal ajal „lõppeesmärk peab enne kirjeldatud olema“. Plado mõte oli: **tehniliselt tee sammhaaval, aga arhitektuuriliselt tea, mille poole liigud.** `Plado Recording 593.docx`

---

### 2. Mustvee on palju olulisem kui lihtsalt „teise Node'i asukoht“

Allikate kooslugemisel muutub Mustvee sisuliselt **piloodi võtmekohaks**.

Meil on mitu sõltumatut vihjet, et:

- Narva rakenduslik seirepilt koondub Mustvee kaudu;
- Mustvees on olemas serverikeskkond;
- seda keskkonda haldab tõenäoliselt PPA;
- seal on juba ligipääs radarite märgiinfole;
- olemasolev operaatorisüsteem agregeerib mitme radari track'e. `MAIN SOURCE-Network Findings and Gaps-20260812-1855.md` `Plado Recording 593.docx`

See tähendab, et Mustvee ei ole lihtsalt „edge compute lähemal radarile“, vaid **olemasolev AS-IS integratsioonipunkt**.

Seetõttu on arhitektuuriliselt palju mõistlikum:

**Radarid → olemasolev töötlus/agregatsioon → paralleelne väljund Lattice'ile**

kui:

**Lattice → ronib eraldi igasse radaripositsiooni ja integreerib iga sensori uuesti.**

See on väga oluline vahe. Esimene tõestab Lattice'i kui integratsioonikihti minimaalse sekkumisega; teine hakkaks ehitama paralleelset uut seiresüsteemi.

---

### 3. Idaseire olemasolev õhumärgi jagamine võib olla projekti kõige väärtuslikum AS-IS precedent

Teet ütleb sisuliselt: **me juba jagame Idaseire radarite õhumärke väljapoole**, tõenäoliselt multicast-/märgiinfo põhimõttel. `Teet Recording 578.docx`

See ühendab korraga punkti 1 ja punkti 2.

Kui olemasolev lahendus juba teeb:

**Idaseire → kontrollitud märgiinfo → teine asutus/süsteem**

siis Lattice'i puhul ei pea alustama küsimusest:

> „Kas üldse tohib Idaseirest midagi välja saata ja kas seda tehniliselt saab?“

Palju parem küsimus on:

> **„Millist olemasolevat andmevahetusmustrit me saame Lattice'i jaoks korrata?“**

See võib anda korraga:

- teadaoleva tehnilise eksportliidese;
- protokolli või vähemalt andmetaseme;
- olemasoleva võrgu-/turvamustri;
- varasema kooskõlastusmudeli;
- arusaama, millist infot on juba aktsepteeritud väljapoole jagada.

See võib olla palju suurem kiirendi kui uue VPN-i või uue firewall-arhitektuuri leiutamine.

---

### 4. Kõige olulisem arhitektuuriline otsus pole „milline radar?“, vaid **millisel töötlustasemel Lattice liidestub**

Plado vestluses tuleb välja väga oluline neljaastmeline ahel:

**radarivideo → plot → tracker → track → agregatsioon**

ja tracker võib olla kas radaris või Mustasaare tarkvaras. `Plado Recording 593.docx`

Siit tuleb palju sügavam seos.

Liidestuspunkt määrab korraga:

- ribalaiuse;
- tehnilise keerukuse;
- võrguvajaduse;
- Mustasaare sõltuvuse;
- Andurilile nähtava info hulga;
- võimalikud intellektuaalomandi probleemid;
- infoturbe klassifikatsiooni;
- ja selle, **mida piloot tegelikult tõestab**.

Näiteks:

**Existing tracker → track → Lattice**

tõestab eelkõige:
> Lattice ühendab PPA olemasoleva seirevõime uude infovahetuskihti.

Aga:

**raw radar → Anduril tracker → track**

tõestab:
> Andurili enda radarisignaali töötlus sobib PPA konkreetse radarikonfiguratsiooni ja sihtmärkidega.

Need on sisuliselt kaks eri projekti. Esimest on MVP jaoks palju lihtsam põhjendada.

---

### 5. Tehniline least-privilege ja õiguslik/confidentiality teema on tegelikult üks ja sama arhitektuuriotsus

Esmapilgul on NDA punkt 2 „õigus“ ja radariliides punkt 1 „tehnika“. Allikad näitavad, et neid ei saa nii lahutada.

Plado toob näite: kui Andurilile anda liiga lai ligipääs Mustvee keskkonda, võib ta näha **Mustasaare konkurendi tracker-tarkvara**. Samas konkreetse board'i või feed'i andmine võib selle täielikult vältida. `Plado Recording 593.docx`

Samuti ütleb ta, et:

- abstraktne „radar → Node“ skeem võib olla AK;
- IP-d, switch'id, pordid ja serverite detailne topoloogia võivad juba muuta dokumendi tundlikumaks. `Plado Recording 593.docx`

Seega peaks arhitektuur juba ise **minimeerima jagatavat infot**:

**Anduril saab integratsiooniks vajalikku feed'i + oma VM-i, mitte Idaseire võrku uurimiseks.**

See vähendab korraga:

- tehnilist riski;
- NDA ulatust;
- klassifitseeritud info avaldamist;
- vendor-IP konflikti;
- remote-access riski.

See ei ole lihtsalt infoturbereegel - see on üks piloodi keskseid disainiprintsiipe.

---

### 6. „Üks aken“ ei tähenda, et Lattice peab olemasolevad süsteemid välja vahetama

Mitmest varasemast vestlusest tuleb välja AS-IS probleem: operaator kasutab erinevaid arvuteid, võrke ja programme ning võib radari märki kontrollida teises süsteemis oleva kaameraga. `Raudsepp k6rvalt Recording 571.docx`

Samas Plado vestluses jõutakse täpselt vastupidise tehnilise järelduseni sellele, mida võiks esimese hooga arvata: **olemasolevaid süsteeme ei ole mõistlik esimese etapina asendada ega sensoreid otse Lattice'i külge ümber tõsta**. Olemasolevad agregatsioonid ja VMS-id võiksid pigem olla Lattice'i andmeallikad. `Plado Recording 593.docx`

Seega TO-BE ei peaks olema:

**Mustasaare + Milestone + Remote ID süsteem → ära → Lattice**

vaid pigem:

**Mustasaare →**  
**Milestone → Lattice operatiivne infokiht → kasutajad / teised süsteemid**  
**Remote ID →**

See on suur arhitektuuriline erinevus.

Lattice'i väärtus on siis **süsteemide vahelise sidestuse vähendamine**, mitte nende asendamine.

---

### 7. Milestone'i kaamera pole lihtsalt „veel üks sensor“ - see testib teist integratsioonimustrit

Radar ja Remote ID testivad üsna otsest andmesisendit.

Milestone'i kaudu kaamera testib hoopis:

> **kas Lattice suudab integreeruda olemasoleva platvormiga, mis ise haldab paljusid seadmeid.**

See on arhitektuuri seisukohalt isegi tähtsam kui konkreetse kaamera töötamine.

Plado vestluses jõutakse samuti mõtteni, et esimeses etapis võiks Mustasaare keerulisema/proprietary kaamerapoolse integratsiooni asemel võtta **Milestone'i kui standardsema integratsioonipinna**. `Plado Recording 593.docx`

Piloot annaks siis tahtlikult kaks integratsioonimustrit:

- **sensor → Lattice**: Terma / Remote ID / RF;
- **olemasolev platvorm → Lattice**: Milestone.

See on palju parem piloodi põhjendus kui „integreerisime neli erinevat seadet“.

---

### 8. Plado pakutud tagasisuunaline test muudab kogu piloodi tähendust

See on minu meelest üks tugevamaid seoseid allikates.

Plado ütleb sisuliselt: kui Lattice korjab märke kokku, siis tema tahaks proovida, kas **PPA olemasolev süsteem saab neid Lattice'ist omakorda vastu võtta**. `Haru · Haru · Network Findings and Gaps.txt`

See teeb kaks võimalikku ambitsioonitaset:

**Tase 1 - uus visualiseerimisvahend**

Sensor → Lattice → Lattice C2

Tõestab, et Andurili ekraanil on info.

**Tase 2 - integratsiooni-/andmevahetusplatvorm**

Sensor → Lattice → teised Node'id  
ja  
Lattice → olemasolev PPA süsteem

Tõestab, et **Lattice saab olla süsteemidevaheline backbone**, mitte veel üks eraldiseisev operaatorirakendus.

Arvestades kogu projekti probleemi - palju võrke, palju tootjaid, palju rakendusi - on **teine tõestus strateegiliselt palju väärtuslikum**.

Ma isegi paneks selle tulevikus piloodi üheks põhiliseks „stretch acceptance criterion'iks“.

---

### 9. Töökorralduse punktist hakkab juba välja kooruma arhitektuurireegel: **info peab minema kasutaja töövahendisse, mitte kasutaja Lattice'i**

See selgitab Apollo näidet.

Kui patrullpolitseinik peab hakkama eraldi Lattice'i C2-d jälgima, oleme tegelikult loonud talle **veel ühe süsteemi**.

Koosoleku mõte oli vastupidine: näiteks relevantne sündmus ja asukoht peaksid jõudma Apollo töövoogu. JRC või keskne operaator võib kasutada C2-d, aga kõigi kasutajate viimine uude kasutajaliidesesse pole tingimata õige TO-BE. `Järeldused ja tegevuskava.txt`

See seostub otse eelmise punktiga:

> **Lattice C2 on üks tarbija, mitte tingimata lõpparhitektuuri keskpunkt.**

Lattice'i tähtsam roll võib PPA jaoks lõpuks olla **andmete koondamine, normaliseerimine, rikastamine ja levitamine**.

Plado eristab samamoodi üsna teravalt „infovahetusplatvormi“ ja „lõppkasutaja toodet“. `Plado Recording 593.docx`

---

### 10. SMIT-i praegune probleem pole peamiselt võrgutehniline - see on teenuse omandi probleem

See tuleb eri vestlustes väga järjekindlalt läbi.

SMIT ei ole eelkõige kinni küsimuses „kas VM-i saab teha?“. Probleem on, et nad ei oska hetkel Lattice'i oma organisatsioonis **õigesse teenusekasti panna** ja sellest sõltuvad omanik, SLA, tugi, majutus jne. Samas öeldakse otseselt, et piloodile pole mõtet kohe kolmeaastase tootmisteenuse nõudeid külge kruvida. `Mihkel smit liiga palju vasikas Recording 574.docx`

Sellest tuleneb väga kasulik eristus:

**Piloodi käitusmudel**
- VM;
- nimetatud admin;
- best-effort/piloodi tugi;
- piiratud kasutajad;
- ajutiselt kokkulepitud võrguvood.

**TO-BE käitusmudel**
- teenuseomanik;
- 24/7 või muu SLA;
- seire;
- varundus;
- kasutajahaldus;
- patchimine;
- tootjatugi;
- muudatuste haldus.

Neid ei tohiks ühe otsusega lahendada.

Muidu tekib klassikaline probleem: **tootmisarhitektuuri protsess blokeerib tehnilise piloodi, mille tulemusi on tegelikult tootmisarhitektuuri otsustamiseks vaja.**

---

## Sellest tuleb minu meelest välja parem 4-punktiline plaan

Ma muudaks selle sõnastuse veidi konkreetsemaks:

1. **Tõesta Lattice'i andmetee.**  
   Kaks PPA Node'i, vähemalt kaks eri võrku, representative sensorid, Node↔Node andmevahetus, olemasolevaid süsteeme muutmata.

2. **Tõesta kontrollitav andmekäitlus.**  
   Iga sisendi puhul on teada allikas, töötlustase, Lattice'i tekkiv andmeobjekt, säilitamine, adressaadid ja lubatud jagamine.

3. **Tõesta operatiivne kasutusjuht.**  
   Vähemalt üks terviklik juhtum: sensor tuvastab → Lattice koondab/rikastab → õige kasutaja või süsteem saab vajaliku info → olemasolev töövoog jätkub.

4. **Otsusta alles tulemuste põhjal TO-BE.**  
   Millised Node'id jäävad, millised integratsioonid laienevad, kes opereerib, kas Lattice on peamiselt C2 või integratsioonikiht, millised custom-arendused on päriselt põhjendatud.

Kõige suurem mõtteline muutus võrreldes varasema käsitlusega on minu jaoks see:

> **Piloodi päris küsimus ei ole „kas Lattice suudab PPA sensorit näidata?“.**  
> Pigem: **„kas Lattice suudab olemasolevate PPA süsteemide vahele lisanduda kontrollitud andmekihina nii, et olemasolevad süsteemid jäävad puutumata, eri võrkude operatiivne info saab kokku ja seda saab vajalikule tarbijale edasi anda?“**

See sõnastus seob praktiliselt **kõik allikates korduvad probleemid üheks arhitektuuriliseks hüpoteesiks**. `Plado Recording 593.docx` `Järeldused ja tegevuskava.txt`

**Võimalik vastuväide:** kui juhtkond ootab piloodilt eelkõige nähtavat C2-demo, võib „andmevahetuskiht“ kõlada liiga infrastruktuurselt. Sellisel juhul tasub C2-demo kindlasti teha, aga käsitleda seda **ühe tõendina**, mitte piloodi ainsa eesmärgina.

## Prompt:
8/19/2026, 7:20:09 PM

vaata neid nelja punkti teise nurga alt

## Response:
8/19/2026, 7:20:30 PM

> **Reframing the four points**
>
> I’m treating the four areas as four validation questions rather than project phases: can it run, may it run, who owns it and why, and what capabilities or product choices are still missing?
>
> **Reframed the four points**
>
> 
>
> **Evaluated lattice implementation through four organizational decision lenses**
>
> 
>
> Worked for 24s

Jah. Kui vaadata neid nelja punkti mitte projektifaasi, vaid **„mida PPA peab Lattice'i kohta ära otsustama“** vaates, muutub nende loogika palju selgemaks.

Minu meelest on nende taga tegelikult neli eri küsimust:

| Punkt | Päris küsimus | Mida sellega tõestatakse |
|---|---|---|
| **1. Tehniliselt tööle** | **Kas me saame seda ise käitada?** | tehniline kontroll |
| **2. Õigus ja andmed** | **Kas me tohime seda niimoodi kasutada?** | õiguslik kontroll |
| **3. Töökorraldus** | **Kes ja milleks seda kasutab?** | organisatsiooniline kontroll |
| **4. Arendused** | **Mida on veel vaja, et sellest päriselt kasu oleks?** | võimekus- ja investeerimisotsus |

See on minu arvates parem viis neid nelja punkti mõista kui lihtsalt „1 → 2 → 3 → 4“.

### 1. „Saada tööle“ tähendab tegelikult **võtta tehniline kontroll enda kätte**

Algne probleem pole ainult, et server puudub. Projekt tuli suuresti KV/Andurili suunalt ning PPA alles uurib, mida selle tootega enda vajaduste jaoks teha. Plado vestluses öeldakse sisuliselt isegi välja: *oleme asja saanud/ostnud, aga mida me sellega PPA-s teeme, pole veel lõpuni selge*. `Plado Recording 593.docx`

Seega esimene punkt vastab küsimustele:

- kas PPA saab oma Node'i ise majutada;
- kas PPA/SMIT saab seda administreerida;
- kas oma sensorid saab ilma tootmissüsteeme lõhkumata külge;
- kas PPA Node'id saavad omavahel ja KV Node'idega kontrollitult suhelda;
- kas välise tootja pidevat juurdepääsu pole vaja.

Selles valguses on Mustvee, SMIT VM, remote access, adminnikoolitus jne kõik ühe suurema teema osad:

> **Kas sellest saab PPA kontrollitav tehniline võimekus, mitte Andurili/KV poolt meile püsti pandud must kast?**

Seda toetab ka arutelu, et KV väljaõppinud adminnid võivad aidata esmasel paigaldusel, aga teadmine tuleks PPA/SMIT poolele üle anda. `Mihkel smit liiga palju vasikas Recording 574.docx`

---

### 2. „Õiguslik pool“ tähendab tegelikult **võtta kontroll selle üle, mida süsteem teab**

See ei ole minu meelest peamiselt juristi check-box.

Lattice on integratsiooniplatvorm. Mida rohkem me sinna süsteeme ühendame, seda rohkem hakkab ta teadma:

- kus objekt asub;
- mis objekt see on;
- millisest sensorist info tuli;
- kes on operaator;
- kas tegevus on lubatud;
- mida teised asutused selle kohta teavad;
- võimalik ajalugu.

Seetõttu küsitakse allikates õigesti enne:

> mida me sinna üldse sisse paneme?

Koosoleku tegevuskava eristab just **dataset'e, isikuandmeid, säilitamist, jagamist ja süsteemi õiguslikku staatust**. `Järeldused ja tegevuskava.txt`

Selle punkti päris otsus on seega:

> **Millise operatiivse teadmise koondamist PPA Lattice'is lubab?**

See on arhitektuuriline piir.

Näiteks võib tulemus olla:

- radar-track **jah**;
- Remote ID drooni tehniline identifikaator **jah**;
- operaatori isikuandmetega rikastamine **ainult konkreetse kasutusjuhu korral**;
- raw video **vajaduspõhiselt**;
- täielik võrgutopoloogia välisele tarnijale **ei**.

Plado tehniline hoiatus on siin otseselt seotud: kui Anduril vajab ainult konkreetset radarifeed'i ja oma VM-i, pole põhjust anda talle laiemat ligipääsu võrgule või Mustasaare tarkvarale. `Plado Recording 593.docx`

Ehk **andmeminimeerimine ja võrgu least-privilege on sisuliselt sama otsuse kaks külge**.

---

### 3. „Töökorraldus“ tähendab tegelikult **otsustada, kelle võimekus Lattice üldse on**

See võib olla kõige raskem punkt.

Kas Lattice on:

- piirivalve operaatori süsteem?
- JRC töövahend?
- droonitõrje süsteem?
- PPA-KV ühine olukorrapildi kiht?
- PPA süsteemide integratsiooniplatvorm?
- kõigi eelnevate tehniline alus?

Praegu pole sellele allikates üht vastust.

SMIT-i vestlus näitab sama probleemi tehnilise organisatsiooni poolelt: isegi SMIT ei oska veel otsustada, **millise teenuse alla Lattice kuulub** - taristu, side, platvorm, äriteenus või midagi muud. Samas rõhutatakse, et piloodi teenusemudelit ei tohiks liiga vara kolme aasta tootmislahenduse järgi defineerida. `Mihkel smit liiga palju vasikas Recording 574.docx`

See on sama küsimus teises keeles.

PPA äripoolel:

> kes kasutab ja mille eest vastutab?

SMIT-i poolel:

> kelle teenus see on ja kes seda käitab?

Need tuleb lõpuks **üheks vastutusmudeliks kokku viia**.

Seetõttu pole punkt 3 lihtsalt „kirjutame protseduuri“. See otsustab:

> **kelle organisatsioonilise võimekuse osaks Lattice muutub.**

---

### 4. „Arendused“ tähendab tegelikult **otsustada, kas Lattice'i väärtus õigustab edasist investeeringut**

See muudab ka neljanda punkti tähendust.

Apollo, registrid, keelualad, Milestone, automaatne rikastamine jne pole lihtsalt funktsioonide wishlist. Need vastavad küsimusele:

> **Mis on puudu selle vahel, mida Lattice karbist välja teeb, ja selle vahel, mida PPA operatiivtöö vajab?**

Näiteks kui C2 näitab:

> tundmatu droon asukohas X

aga operatiivtöötajal on tegelikult vaja:

> droon X, operaator Y, selles alas pole luba, sündmus on saadetud patrullile Z,

siis tekib mõõdetav **võimekuslünk**.

Alles siis on mõistlik küsida:

- kas Anduril juba toetab seda;
- kas PPA peab ehitama integratsiooni;
- kas Transpordiamet peab tegema teenuse;
- kas Apollo peab võtma sündmuse vastu;
- palju see maksab;
- kas kasu õigustab seda.

Koosoleku enda loogika oli, et custom-arendused tuleb backlog'i panna ja mitte lasta neil esimese Node'i püstitamist blokeerida. `Järeldused ja tegevuskava.txt`

---

## Veel üks, minu meelest isegi tugevam tõlgendus

Need neli punkti kirjeldavad **Lattice'i omandi järkjärgulist ülevõtmist PPA poolt**:

**1. Tehniline omand**  
„Me oskame ja saame seda käitada.“

**2. Andmete omand ja vastutus**  
„Me teame täpselt, mida see töötleb ja mille alusel.“

**3. Teenuse/võimekuse omand**  
„Me teame, kes selle eest vastutab ja milleks seda kasutatakse.“

**4. Toote arengusuuna omand**  
„Meie otsustame kasutusjuhtude järgi, mida on juurde vaja.“

See sobib allikatega eriti hästi, sest projekt tuli PPA-le suhteliselt väljastpoolt ning paljud praegused segadused - SMIT-i teenuseklass, adminnid, sensorite liidestamine, õigus, töökorraldus - on tegelikult ühe probleemi eri sümptomid:

> **Lattice pole veel PPA organisatsioonis „maandunud“.** `Plado Recording 593.docx` `Mihkel smit liiga palju vasikas Recording 574.docx`

Seetõttu sõnastaksin juhtkonna jaoks need neli punkti isegi nii:

**1. Kas PPA suudab Lattice'i kontrollitult käitada?**  
**2. Millist infot PPA Lattice'is töötleb ja jagab?**  
**3. Millist PPA võimekust Lattice toetab ja kes selle eest vastutab?**  
**4. Millised täiendused on vajalikud, et saadud võimekus oleks operatiivselt väärtuslik?**

See on minu meelest tugevam kui „tehnika / õigus / töökorraldus / arendus“, sest näitab **mida iga töövoog peab lõpuks otsustama**.

**Võimalik lõks:** kui punkt 3 jääb lahendamata, võivad punktid 1, 2 ja 4 kõik edukalt tehtud saada, aga tulemuseks on tehniliselt toimiv süsteem, mida keegi organisatsioonis päriselt ei oma.



---
Powered by [ChatGPT Exporter](https://www.chatgptexporter.com)