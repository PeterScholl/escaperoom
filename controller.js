/* Die Klasse Controller bildt die Verbindung zwischen dem HTML-Dokument und
   der Programmierlogik
   Ich führe den Controller als Singleton aus - zwei machen keinen Sinn
    - nach der Webseite https://www.heise.de/blog/GoF-Entwurfsmuster-in-JavaScript-Teil-1-Singleton-3079815.html
*/



class Controller {
    constructor(name) {
        if (typeof Controller.instance === 'object') {
            return Controller.instance;
        } else {
            //erster und einziger Aufruf der Initialisierung
            this.name = name;
            let game = new EscapeGame("Start", null);
            game.setExample();
            this.newGame(game);
            Controller.instance = this;
        }
    }
    //getInstanceMethode um den Controller zur erhalten
    static getInstance() {
        Controller.instance = new Controller("Controller - Instanz");
        Controller.getInstance = function () {
            return Controller.instance;
        }
        return Controller.instance;
    }

    /* init initialisiert:
        * Versucht ein JSON zu laden
        * die Buttons der Menüleiste
        * den Listener für die Eingabe des Keys
        * den Button des Modals (ausblenden/bestaetigen)
        * legt ein Startescapegame fest
        * Und stellt die Startseite dar
    */
    init() {
        let self = this;
        console.log("Das Dokument wurde geladen. init() wird aufgerufen.");

        //Wurde ein Dokument per get-Parameter übergeben?
        let dest = getUrlParam("url");
        console.log("JSON laden von " + dest);
        if (dest) {
            fetch(dest, {
                method: 'GET',
                headers: {
                    'Accept': 'application/json',
                },
            })
                .then(response => {
                    if (!response.ok) {
                        throw new Error('Netzwerkantwort war nicht OK');
                    }
                    return response.json();
                }).then(response => parseJSONObjToEscapeGame(response))
                .then(response => Controller.getInstance().newGame(response))
                .catch(error => {
                    // Hier wird der Fehler behandelt
                    console.log('Fehler bei der Fetch-Anfrage:'+ error);
                    // Füge hier weitere Fehlerbehandlung hinzu, falls erforderlich
                    Controller.getInstance().setModalText("JSON-URL konnte nicht als Game interpretiert werden: "+error);
                    Controller.getInstance().showModal(true);
                });

        }


        // Schleife durch alle Elemente mit der Klasse "menuitem"
        var menuItems = document.querySelectorAll('[id^="menuitem"]');
        for (var i = 0; i < menuItems.length; i++) {
            // Füge die Funktion als Eventlistener hinzu
            //console.log("Durchgang:"+i);
            //console.log("This/Self:"+JSON.stringify(self));
            //console.log("c"+JSON.stringify(c));
            menuItems[i].addEventListener("click", (event) => self.reactMenuClick(event));
        }

        // Listener für das Keyfeld aktivieren (Reagiert auf Enter)
        this.enableListenerKeyFeld(true);


        // Button des Modals bzw. click daneben
        document.getElementById('infomodalbutton').addEventListener("click", function (event) {
            self.showModal(false);
        });
        document.getElementById('overlay').addEventListener("click", function (event) {
            self.showModal(false);
        });

        this.drawRoom();
    }

    // Funktion, die aufgerufen wird, wenn ein Menüpunkt geklickt wird
    reactMenuClick(event) {
        let self = this;
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
                openJSON(self);
                break;
            case "menuitem_save":
                // Code für den Menüpunkt Save
                console.log("menuitem Save: Datei wird gespeichert");
                downloadJSON(self.game);
                break;
            case "menuitem_edit":
                // Code für den Menüpunkt Save
                console.log("menuitem Edit - toggle Editview");
                self.toggleEditView();
                break;

            default:
                // Code für den Fall, dass keine der vorherigen Bedingungen zutrifft
                console.log("Unbekannter Menüpunkt");
        }
    }

    //Funktion die den aktuellen Raum auf der Webseite darstellt
    drawRoom() {
        // Name darstellen
        document.getElementById('raumname').innerText = this.game.getAktuellerRaumName();
        // Infotext bzw. Welcometext ausgeben
        document.getElementById('infotext').innerHTML = this.game.getAktuellerRaumText();
        //TODO bei Zielraum eingabefeld ausblenden / ansonsten Einblendung prüfen und wieder 

    }

    //Die Editieransicht ein oder Ausschalten und initialisieren
    toggleEditView() {
        let self = this;
        let mainArea = document.getElementById('mainArea');
        let editArea = document.getElementById('editArea');
        if (editArea.style.display === 'block') {
            //EditArea ausblenden
            mainArea.style.display = 'block';
            editArea.style.display = 'none';
            self.drawRoom();
        } else {
            //EditArea einblenden
            mainArea.style.display = 'none';
            editArea.style.display = 'block';
            initEditArea();
        }

    }

    //Neues Escape-Game starten
    newGame(game) {
        this.game = game;
        this.drawRoom();
        //ggf. Modal ausblenden
        this.showModal(false);
        if (this.game.editAllowed) {
            document.getElementById('menuitem_edit').style.display = 'block';
        } else {
            document.getElementById('menuitem_edit').style.display = 'none';
        }
    }

    //Funktion die den eingegebenen Schlüssel auswertet
    keyauswerten(key) {
        console.log("Schlüssel " + key + " wurde eingegeben!");
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
            if (!this.isModalShown()) {
                //Nur anzeigen, wenn nicht evtl. schon ein anderer Infotext gezeigt wird
                this.setModalText("Dieser Schlüssel ist ungültig");
                this.showModal(true);
            }
        }
    }

    //Funktion zum anzeigen und ausblenden des Infomodals
    showModal(show) {
        let self = this;
        if (show) {//anzeigen
            document.getElementById('infomodal').style.display = 'block';
            document.getElementById('overlay').style.display = 'block';
            if (document.getElementById('infomodalbutton')) {
                document.getElementById('infomodalbutton').focus();
            }
        } else { //ausblenden
            document.getElementById('infomodal').style.display = 'none';
            document.getElementById('overlay').style.display = 'none';
            //Fokus zurück auf das Eingabefeld und alles auswählen
            document.getElementById('keyfeld').focus();
            document.getElementById('keyfeld').select();
        }
    }
    isModalShown() {
        return document.getElementById('infomodal').style.display === 'block';
    }
    setModalText(text) {
        //Baut den Inhalt des Modals komplett neu auf mit dem übergebenen Text
        //document.getElementById('infomodaltext').innerHTML = text;
        let infomodaldiv = document.getElementById('infomodal');
        infomodaldiv.innerHTML = ""; //leeren
        //Basisabschnitt
        let modal_p = document.createElement("p");
        modal_p.id = "infomodaltext";
        modal_p.innerHTML = text;
        infomodaldiv.appendChild(modal_p);
        // Button
        let bestaetigeModalButton = document.createElement("button");
        bestaetigeModalButton.innerHTML = "Bestätigen";
        bestaetigeModalButton.id = "infomodalbutton";
        bestaetigeModalButton.addEventListener("click", function (event) {
            Controller.getInstance().showModal(false);
        });

        infomodaldiv.appendChild(bestaetigeModalButton);
    }

    //öffnet einen Editor mit einer Basisdatei
    // gibt null oder neuen Inhalt zurück
    showEditorInModal(sourceHTML, returnResultFunction) {
        //Kleiner Test
        if (typeof (returnResultFunction) === 'function') {
            console.log("CONT: returnResultFunction ist funktion");
        } else {
            console.log("CONT: returnResultFunction ist KEINE funktion" + returnResultFunction);
        }
        let self = this;
        //Baut den Inhalt des Modals komplett neu auf mit dem übergebenen Text
        let infomodaldiv = document.getElementById('infomodal');
        infomodaldiv.innerHTML = ""; //leeren
        //Textarea für eingabe
        let modal_ta = document.createElement("textarea");
        modal_ta.id = "editor";

        infomodaldiv.appendChild(modal_ta);
        // Initialisiere den CKEditor
        modal_ta.innerHTML = sourceHTML;
        CKEDITOR.replace('editor');


        // Speichern - Button
        let saveEditorContentButton = document.createElement("button");
        saveEditorContentButton.innerHTML = "Speichern";
        saveEditorContentButton.id = "editorInModalSpeichernButton";
        saveEditorContentButton.addEventListener("click", function (event) {
            //Inhalt des Editors zurückgeben und Modal schliessen
            const editor = CKEDITOR.instances.editor;
            const htmlContent = editor.getData();
            if (typeof (returnResultFunction) === 'function') {
                console.log("ReturnResult-Funktion aufrufen");
                console.log(htmlContent);
                returnResultFunction(htmlContent);
            }
            self.showModal(false);
        });

        infomodaldiv.appendChild(saveEditorContentButton);
        self.showModal(true);

    }

    setRaumWelcometext(raumId, text) {
        console.log("CONT: setRaumWelcomeID " + raumId + " - " + text);
        let self = this;
        self.game.raumliste[raumId].welcometext = text;
    }

    enableListenerKeyFeld(bool) {
        let self = this;
        if (bool) { //aktivieren
            document.getElementById('keyfeld').addEventListener('keypress', function (event) {
                // Überprüfe, ob die gedrückte Taste die Enter-Taste ist
                if (event.key === 'Enter') {
                    // Verhindert das Standardverhalten des Formulars (neu laden)
                    event.preventDefault();
                    self.keyauswerten(document.getElementById('keyfeld').value);
                }
            });
        } else { //deaktivieren
            document.getElementById('keyfeld').removeEventListener('keypress');
        }
    }
}

let c = new Controller("Hauptcontroller");
//Funktion init soll nach dem Laden des HTML-Docs alles Initialisieren
//Mit Arrow-Notation, damit in der Funktion auf das richtige this zugegriffen wird
document.addEventListener("DOMContentLoaded", (event) => c.init(event));


