SMIT Lattice node **ei toimi võrkudevahelise ruuteri ega lüüsina** . Kõik võrkudevahelised ühendused piiratakse konkreetsete lähte- ja sihtaadresside ning vajalike portidega. 

**Turvavõrgu adapter** edastab droonisensori info kontrollitud HTTPS API ühenduse kaudu **SMIT** . **Lattice node'i Mustvee Lattice node** edastab radaritest saadud ja Lattice'is töödeldud radariivinfo **Lattice Mesh'i kaudu SMIT Lattice node'i** . **PPA kasutajad** pääsevad SMIT Lattice node'i kasutajaliidesele ligi **HTTPS pordi 443 kaudu** . 

**SMIT Lattice node on PPA keskne koondus- ja jagamispunkt** , mis suhtleb edasi **Kaitseväe Lattice keskkonnaga üle Lattice Mesh'i** . Turvavõrk, Mustvee keskkond ja Kaitseväe võrk ei vaja omavahel otseseid võrguühendusi. 

Selline lahendus võimaldab piloodis tõestada Lattice põhimõtet: eri PPA võrkudest pärinev operat vinfo koondatakse ühisesse olukorrapilti ning lubatud osa sellest saab kontrollitult edasi jagada, Lattice töötab mesh võrguga ning same jagada suletud võrkudest valitud infot. 

