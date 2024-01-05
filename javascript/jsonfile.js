/* Diese Datei bietet Hilfsfunktionen an um mit JSON-Files
   zu arbeiten */

// Funktion um die Daten eines EscapeGames zum Download anzubieten
function downloadJSON(game) {
    if (!game instanceof EscapeGame) {
        alert("Es wird kein EscapeGame gespeichert");
        return;
    } else {
        console.log("JSONFILE.js: downloadJSON - prüfung auf richtige Klasse erfolgreich");
    }


    // JSON-Text aus dem Objekt erstellen
    let jsonText = JSON.stringify(game, null, 2);

    // Blob aus dem JSON-Text erstellen
    let blob = new Blob([jsonText], { type: 'application/json' });

    // Link erstellen
    let url = URL.createObjectURL(blob);
    let a = document.createElement('a');
    a.href = url;
    a.download = 'escapegame.json';

    // Klicken Sie auf den Link, um das Herunterladen zu initiieren
    // NOTE: Alternativ Modal anzeigen und den Benutzer auf den Link klicken lassen mit
    //       dem Vorteil, dass man den Dateinamen auswählen/ändern kann
    a.click();

    // URL-Objekt freigeben, um Speicher freizugeben
    URL.revokeObjectURL(url);
}


//Funktion um eine Datei zu Laden sie gibt ein komplett neues
// EscapeGame-Objekt zurück oder null
function openJSON(controller) {
    // Ein unsichtbares Eingabefeld erstellen
    let dateiEingabe = document.createElement('input');
    dateiEingabe.type = 'file';
    dateiEingabe.accept = '.json'; // Nur JSON-Dateien zulassen

    // Eventlistener für das Ändern des Eingabefelds hinzufügen
    dateiEingabe.addEventListener('change', function () {
        // Überprüfen, ob eine Datei ausgewählt wurde
        if (dateiEingabe.files.length > 0) {
            // Die ausgewählte Datei
            let datei = dateiEingabe.files[0];

            // FileReader verwenden, um den Inhalt der Datei zu lesen
            let reader = new FileReader();

            // FileReader-Eventlistener für das Laden der Datei
            reader.onload = function (event) {
                // Der Inhalt der Datei als Text
                let jsonText = event.target.result;

                // Hier kannst du mit dem JSON-Text arbeiten, z.B. ihn analysieren oder anzeigen
                try {
                    // Versuche, den JSON-Text zu analysieren
                    let jsonObj = JSON.parse(jsonText);

                    let newEscapeGame = parseJSONObjToEscapeGame(jsonObj);

                    //console.log(jsonObj);
                    //console.log(newEscapeGame);

                    if (controller) {
                        controller.newGame(newEscapeGame);
                    } else {
                        alert("Kein Controller vorhanden um das Game zu öffnen");
                    }

                    // Erfolgreiches Ergebnis an eine Callback-Funktion zurückgeben
                    //ergebnisCallback(jsonObj);
                } catch (error) {
                    // Fehler beim Analysieren des JSON-Texts
                    console.error('Fehler beim Analysieren der JSON-Datei:', error);

                    // Fehlerhaftes Ergebnis (null) an eine Callback-Funktion zurückgeben
                    // ergebnisCallback(null);
                }
            };

            // Die Datei als Text lesen
            reader.readAsText(datei);
        }
    });

    // Das Eingabefeld klicken, um den Auswahldialog zu öffnen
    dateiEingabe.click();
}

//Aus einem JSONObj ein Escape Game machen - in der Hoffnung, dass
//alle Parameter richtig vorhanden sind
function parseJSONObjToEscapeGame(jsonObj) {
    // ein sauberes Escape-Game erstellen
    // 1. Namen des Escape Games aus der Datei übernehmen
    if (!jsonObj.name instanceof String) {
        jsonObj.name = "Escape-Room-Spiel";
    }
    let newEscapeGame = new EscapeGame(jsonObj.name);
    // 2. Raumliste aufbauen
    let newRaumliste = [];
    if (Array.isArray(jsonObj.raumliste)) {
        newRaumliste = jsonObj.raumliste.map(parseJSONObjToRaum);
    }
    newEscapeGame.raumliste = newRaumliste;
    if (Number.isInteger(jsonObj.startraumID)) {
        newEscapeGame.startraumID = jsonObj.startraumID;
        newEscapeGame.aktuellerRaumID = jsonObj.startraumID;
    }
    // 3. Grunddaten übernehmen 
    // TODO: sind das alle?
    if (jsonObj.options) {
        newEscapeGame.options = jsonObj.options;
    }
    return newEscapeGame;
}

//Aus einem JSONObj einen Raum machen
function parseJSONObjToRaum(jsonObjRaum) {
    // ein Raum hat die Attribute welcometext,name,folgeraeume,infotexte,istZiel
    let raumname = "Raum";
    let welcometext = "Hier fehlt der Raumtext :-(";
    //console.log(JSON.stringify(jsonObjRaum.name) + " - " +(jsonObjRaum.name instanceof String)+":" +(typeof jsonObjRaum));
    if (jsonObjRaum.name) {
        raumname = jsonObjRaum.name;
    }
    if (jsonObjRaum.welcometext) {
        welcometext = jsonObjRaum.welcometext;
    }
    let newRaum = new Raum(raumname, welcometext);
    if (typeof jsonObjRaum.istZiel == "boolean") {
        newRaum.istZiel = jsonObjRaum.istZiel;
    }
    // hier wird geprüft ob folgeräume ein Objekt/Dictionary ist
    // Clonen ist überflüssig, da das JSON-Obj später nicht mehr 
    // gebraucht wird (hoffentlich)
    if (jsonObjRaum.folgeraeume.constructor == Object) {
        newRaum.folgeraeume = jsonObjRaum.folgeraeume;
    }
    if (jsonObjRaum.infotexte.constructor === Object) {
        newRaum.infotexte = jsonObjRaum.infotexte;
    }
    return newRaum;
}

