class Raum {
    keysHashed = false; //Marker ob die Keys durch eine hashfunktion verschlüsselt wurden
    welcometext = "Dies ist ein Standardraum";
    name = "Standardraum";
    //Dictionary Infotexte
    folgeraeume = { "0": this, "start": this };
    // Infotexte
    infotexte = { "help": "Gib einen Schlüssel ein um ihn auszuprobieren!" };
    istZiel = false;

    constructor(name, welcometext) {
        this.name = name;
        this.welcometext = welcometext;
    }

    // Hashed alle keys der Dictionarys folgeraeume und infotexte
    // Dies kann natürlich nur einmal erfolgen
    setKeysHashed() {
        if (!this.keysHashed) {
            //Keys der folgeräume hashen
            let newFolgeraeume = {};
            for (const key in this.folgeraeume) {
                if (this.folgeraeume.hasOwnProperty(key)) {
                    console.log('Key:', key);
                    newFolgeraeume[hashStringSync(key)] = this.folgeraeume[key];
                }
            }
            this.folgeraeume = newFolgeraeume;
            //Keys der infotexte hashen
            let newInfotexte = {};
            for (const key in this.infotexte) {
                if (this.infotexte.hasOwnProperty(key)) {
                    console.log('Key:', key);
                    newInfotexte[hashStringSync(key)] = this.infotexte[key];
                }
            }
            this.infotexte = newInfotexte;
            this.keysHashed = true;
        }
    }

    testKeyInfotext(key) {
        //Wenn der key zu einem Infotext gehört, wird dieser zurückgegeben
        //Hash-Key if needed
        let hkey = key;
        if (this.keysHashed) {
            hkey = hashStringSync(key);
        }
        console.log("RAUM: Teste auf Infotext:" + key + "-" + this.infotexte[hkey]);
        return this.infotexte[hkey];
    }

    testKeyOnLock(key) {
        //Wenn der key zu einem Folgeraum gehört, dann wird dieser zurückgegeben
        //Hash-Key if needed
        let hkey = key;
        if (this.keysHashed) {
            hkey = hashStringSync(key);
        }
        let folgeraumID = this.folgeraeume[hkey];
        console.log("FolgeraumID: "+folgeraumID+" ist Integer "+Number.isInteger(folgeraumID));
        if (Number.isInteger(folgeraumID) && folgeraumID>0) {
            return folgeraumID;
        }
        // sonst -1
        return -1;
    }

    //Setzt einen Folgeraum für einen gegebenen Key
    setFolgeraum(key, raumIndex) {
        if (Number.isInteger(raumIndex)) {
            let hkey = key;
            if (this.keysHashed) {
                hkey = hashStringSync(key);
            }
            this.folgeraeume[hkey] = raumIndex;
        }
    }

    //Setzt einen Infotext für einen gegebenen Key
    setInfotext(key, infotext) {
        if (infotext instanceof String) {
            let hkey = key;
            if (this.keysHashed) {
                hkey = hashStringSync(key);
            }
            this.infotexte[hkey] = infotext;
        }
    }

    /**
     * @param {string} text
     */
    set welcometext(text) {
        console.log("RAUM: "+this.name+" in set welcometext:"+text);
        this.welcometext=text;
    }
}