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
        let r1 = new Raum("Startraum Beispielgame","Du bist in einem dunklen Startraum, der Schalter für das Licht ist binär. Was steht darauf?");
        let r2 = new Raum("Zielraum - Beispielgame","Du bist am Ziel und hast die Erleuchtung gefunden");
        this.raumliste=[r1,r2];
        r1.folgeraeume = {"eins":1, "1":1};
        r2.folgeraeume = {};
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
        return aktuellerRaum.name;
    }

    // Text zum aktuellen Raum ausgeben
    getAktuellerRaumText() {
        let aktuellerRaum = this.raumliste[this.aktuellerRaumID];
        return aktuellerRaum.welcometext;
    }
}