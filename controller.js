/* Die Klasse Controller bildt die Verbindung zwischen dem HTML-Dokument und
   der Programmierlogik
*/



class Controller {
    constructor(name) {
        this.name = name;
        this.game = new EscapeGame("Start",null);
        this.game.setExample();

    }
    /* init initialisiert:
        * die Buttons der Menüleiste
        * den Listener für die Eingabe des Keys
        * den Button des Modals (ausblenden/bestaetigen)
        * legt ein Startescapegame fest
        * Und stellt die Startseite dar
    */
    init() {
        let self = this;
        console.log("Das Dokument wurde geladen. init() wird aufgerufen.");

        // Schleife durch alle Elemente mit der Klasse "menuitem"
        var menuItems = document.querySelectorAll('[id^="menuitem"]');
        for (var i = 0; i < menuItems.length; i++) {
            // Füge die Funktion als Eventlistener hinzu
            //console.log("Durchgang:"+i);
            //console.log("This/Self:"+JSON.stringify(self));
            //console.log("c"+JSON.stringify(c));
            menuItems[i].addEventListener("click", this.reactMenuClick);
        }

        // Listener für das Keyfeld
        document.getElementById('keyfeld').addEventListener('keypress', function(event) {
            // Überprüfe, ob die gedrückte Taste die Enter-Taste ist
            if (event.key === 'Enter') {
                 // Verhindert das Standardverhalten des Formulars (neu laden)
                event.preventDefault();
                self.keyauswerten(document.getElementById('keyfeld').value);
            }
        });

        // Button des Modals
        document.getElementById('infomodalbutton').addEventListener("click", function(event) {
             self.showModal(false);
        });

        this.drawRoom();
    }

    // Funktion, die aufgerufen wird, wenn ein Menüpunkt geklickt wird
    reactMenuClick(event) {
        // Verhindert das Standardverhalten des Links (falls vorhanden)
        event.preventDefault();

        // Ermittelt die ID des angeklickten Elements
        var clickedMenuItem = event.target.id;

        // Je nach Menuitem muss eine passende Reaktion progrmmiert werden
        console.log("Menüpunkt geklickt: " + clickedMenuItem);
        switch (clickedMenuItem) {
            case "menuitem_load":
                // Code für den Menüpunkt Load
                console.log("Aktion für Load");
                break;

            default:
                // Code für den Fall, dass keine der vorherigen Bedingungen zutrifft
                console.log("Unbekannter Menüpunkt");
        }
    }

    //Funktion die den aktuellen Raum auf der Webseite darstellt
    drawRoom() {
        // Name darstellen
        document.getElementById('raumname').innerText=this.game.aktuellerRaum.name;
        // Infotext bzw. Welcometext ausgeben
        document.getElementById('infotext').innerHTML=this.game.aktuellerRaum.welcometext;
        
    }

    //Funktion die den eingegebenen Schlüssel auswertet
    keyauswerten(key) {
        console.log("Schlüssel "+key+" wurde eingegeben!");
        // Testen ob es einen Infotext zu diesem Schlüssel gibt
        let text = this.game.testKeyOnInfotexte(key);
        if (text) {
            this.setModalText(text);
            this.showModal(true);
        }
        // Testen ob es einen Folgeraum zu diesem Schlüssel gibt
        let success = this.game.testKeyOnLock(key);
        if (success) {
            this.drawRoom();
        } else {
            if (! this.isModalShown()) {
                //Nur anzeigen, wenn nicht evtl. schon ein anderer Infotext gezeigt wird
                this.setModalText("Dieser Schlüssel ist ungültig");
                this.showModal(true);
            }
        }
    }

    //Funktion zum anzeigen und ausblenden des Infomodals
    showModal(show) {
        if (show) {//anzeigen
            document.getElementById('infomodal').style.display = 'block';
            document.getElementById('overlay').style.display = 'block';
        } else { //ausblenden
            document.getElementById('infomodal').style.display = 'none';
            document.getElementById('overlay').style.display = 'none';
        }
    }
    isModalShown() {
        return document.getElementById('infomodal').style.display === 'block';
    }
    setModalText(text) {
        document.getElementById('infomodaltext').innerText=text;
    }
}

let c = new Controller("Hauptcontroller");
//Funktion init soll nach dem Laden des HTML-Docs alles Initialisieren
//Mit Arrow-Notation, damit in der Funktion auf das richtige this zugegriffen wird
document.addEventListener("DOMContentLoaded", (event) => c.init(event));

