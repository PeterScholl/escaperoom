/* In dieser Klasse wird ein EscapeGame abgebildet */
class EscapeGame {
    startraum = new Raum();
    aktuellerRaum = this.startraum;
    name = "Mein Escape-Room";

    constructor(name, startraum) {
        this.name=name;
        this.startraum=startraum;
        this.aktuellerRaum=startraum;
    }

    //ERstellt ein Beispielescapegame
    setExample() {
        let r1 = new Raum("Startraum Beispielgame","Du bist in einem dunklen Startraum, der Schalter für das Licht ist binär. Was steht darauf?");
        let r2 = new Raum("Zielraum - Beispielgame","Du bist am Ziel und hast die Erleuchtung gefunden");
        r1.folgeraeume = {"eins":r2, "1":r2};
        r2.folgeraeume = {};
        r2.istZiel = true;
        r1.infotexte = {"0":"so geht es aus"};
        this.startraum = r1;
        this.aktuellerRaum = r1;
        this.name = "Beispiel-Escape-Game";
    }

    //Überprüft einen eingegeben Schlüssel auf den aktuellen Raum
    //meldet true bei Erfolg
    testKeyOnLock(key) {
        console.log("GAME: Schlüssel auf Schloss prüfen:"+key);
        let folgeraum = this.aktuellerRaum.testKeyOnLock(key);
        if (folgeraum) {
            this.aktuellerRaum = folgeraum;
            return true; //Success melden
        } else {
            return false; // kein Erfolg
        }
    }

    //Überprüft einen eingegeben Schlüssel auf den aktuellen Raum bzgl. Infotexte
    //gibt den Text oder null zurück
    testKeyOnInfotexte(key) {
        console.log("GAME: Schlüssel auf Text prüfen:"+key);
        let infotext = this.aktuellerRaum.testKeyInfotext(key);
        if (infotext) {
            return infotext; //Success melden
        } else {
            return false; // kein Erfolg
        }
    }
}