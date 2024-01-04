class Raum {
    keysHashed = false; //Marker ob die Keys durch eine hashfunktion verschlüsselt wurden
    welcometext = "Dies ist ein Standardraum";
    name = "Standardraum";
    //Dictionary Infotexte
    folgeraeume = { "start": 0 };
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
        console.log("FolgeraumID: " + folgeraumID + " ist Integer " + Number.isInteger(folgeraumID));
        if (Number.isInteger(folgeraumID) && folgeraumID >= 0) {
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

    //Löscht den Folgeraumkey
    delFolgeraum(key) {
        console.log("RAUM: Folgeraumkey löschen: " + key);
        delete this.folgeraeume[key];
    }

    //Setzt einen Infotext für einen gegebenen Key
    setInfotext(key, infotext) {
        if (typeof (infotext) === 'string') {
            let hkey = key;
            if (this.keysHashed) {
                hkey = hashStringSync(key);
            }
            this.infotexte[hkey] = infotext;
        } else {
            console.log("RAUM: setInfoText war kein String - " + infotext + " sondern: " + typeof (infotext));
        }
    }

    //Löscht den Infotextkey
    delInfotext(key) {
        console.log("RAUM: Infotextkey löschen: " + key);
        delete this.infotexte[key];
    }

    /**
     * @param {string} text
     */
    set welcometext(text) {
        console.log("RAUM: " + this.name + " in set welcometext:" + text);
        this.welcometext = text;
    }
}

class LockedRaum extends Raum {
    #lockedBy = new Set(); // locks which keep the room closed
    #isOpen = false;
    #offersLocks = new Set(); //the locks you can open in this room

    constructor(name, welcometext) {
        super(name, welcometext);
    }

    static createFromRaum(r) {
        if (r instanceof Raum) {
            let lr = new LockedRaum(r.name, r.welcometext);
            lr.keysHashed = r.keysHashed;
            lr.folgeraeume = r.folgeraeume;
            lr.infotexte = r.infotexte;
            lr.istZiel = r.istZiel;
            return lr;
        }
        return new LockedRaum("Neu","Dies ist ein neuer Raum");
    }

    removeLock(lock) {
        if (this.#lockedBy.has(lock)) {
            this.#lockedBy.delete(lock);
        }
    }

    set lockedBy(newLock) {
        if (newLock instanceof Lock) {
            this.#lockedBy.add(newLock);
        }
    }

    set lockOffered(lock) {
        if (lock instanceof Lock) {
            this.#offersLocks.add(lock);
        }
    }

    get isOpen() {
        if (this.isOpen) {
            return true;
        } else {
            this.isOpen = true;
            this.lockedBy.forEach(function (value) {
                this.isOpen &= value.isOpen;
            })
        }
        return this.#isOpen;
    }

    set isOpen(x) {
        if (typeof(x) === 'boolean') {
            this.#isOpen=x;
        }
    }

    get lockedBy() {
        return this.#lockedBy;
    }
}