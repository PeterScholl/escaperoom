/* In dieser Klasse wird ein EscapeGame abgebildet 
   Es enthält eine Raumliste aller Räume, damit sich das als JSON besser speichern lässt
   Räume geben dann nur Folge-IDs zurück um den Raum zu wechseln
*/
class EscapeGame {
    editAllowed = true;
    startraumID = 0;
    raumliste = [new Raum()];
    aktuellerRaumID = 0;
    name = "Mein Escape-Room";

    constructor(name) {
        this.name=name;
        this.startraumID=0;
        this.aktuellerRaumID=this.startraumID;
    }

    //ERstellt ein Beispielescapegame
    setExample() {
        let r1 = new Raum("Startraum Beispielgame","Du bist in einem dunklen Startraum, der Schalter für das Licht ist binär.<br>"
        +"Worauf solltest du den Schalter stellen?");
        let r2 = new Raum("Zielraum - Beispielgame","Du bist am Ziel und hast die Erleuchtung gefunden :-)");
        this.raumliste=[r1,r2];
        r1.folgeraeume = {"eins":1, "1":1};
        r2.folgeraeume = {"back":0};
        r2.istZiel = true;
        r1.infotexte = {"0":"so geht es aus"};
        this.startraumID = 0;
        this.aktuellerRaumID = 0;
        this.name = "Beispiel-Escape-Game";
    }

    //Überprüft einen eingegeben Schlüssel auf den aktuellen Raum
    //meldet true bei Erfolg
    testKeyOnLock(key) {
        console.log("GAME: Schlüssel auf Schloss prüfen:"+key);
        let folgeraumID = this.raumliste[this.aktuellerRaumID].testKeyOnLock(key);
        console.log("GAME: erhaltene Folgeraumid - "+folgeraumID);
        if (folgeraumID>=0) {
            this.aktuellerRaumID = folgeraumID;
            return true; //Success melden
        } else {
            return false; // kein Erfolg
        }
    }

    //Überprüft einen eingegeben Schlüssel auf den aktuellen Raum bzgl. Infotexte
    //gibt den Text oder null zurück
    testKeyOnInfotexte(key) {
        console.log("GAME: Schlüssel auf Text prüfen:"+key);
        let aktuellerRaum = this.raumliste[this.aktuellerRaumID];
        let infotext = aktuellerRaum.testKeyInfotext(key);
        if (infotext) {
            return infotext; //Success melden
        } else {
            return false; // kein Erfolg
        }
    }

    //Aktuellen Raumnamen ausgeben
    getAktuellerRaumName() {
        let aktuellerRaum = this.raumliste[this.aktuellerRaumID];
        return typeof(aktuellerRaum) !== 'undefined' ? aktuellerRaum.name : "None";
    }

    // Text zum aktuellen Raum ausgeben
    getAktuellerRaumText() {
        let aktuellerRaum = this.raumliste[this.aktuellerRaumID];
        return typeof(aktuellerRaum) !== 'undefined' ? aktuellerRaum.welcometext : "None";
    }

    /**
     * doOpenRoomsExist prüft ob das Game offene Räume von Typ lockedRaeume enthält
     * @returns true wenn es offene Räume gibt
     */
    doOpenRoomsExist() {
        return this.openRooms().length > 0;
    }

    /**
     * openRooms liefert 
     * @returns ein Array der offenen Räume
     */
    openRooms() {
        lockedRooms = this.raumliste.filter((x) => (x instanceof LockedRaum));
        openRooms = lockedRooms.filter((x) => {x.isOpen();});
        return this.openRooms;
    }
}