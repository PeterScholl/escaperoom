/* Diese Datei bietet Hilfsfunktionen an um mit JSON-Files
   zu arbeiten */

// Funktion um die Daten eines EscapeGames zum Download anzubieten
function downloadJSON(game) {
    //TODO: Prüfen ob game wirklich ein EscapeGame ist
    if (! game instanceof EscapeGame) {
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
    // TODO: Alternativ Modal anzeigen und den Benutzer auf den Link klicken lassen mit
    //       dem Vorteil, dass man den Dateinamen auswählen/ändern kann
    a.click();

    // URL-Objekt freigeben, um Speicher freizugeben
    URL.revokeObjectURL(url);
}


//Funktion um eine Datei zu Laden sie gibt ein komplett neues
// EscapeGame-Objekt zurück oder null
function openJSON() {
    // Ein unsichtbares Eingabefeld erstellen
    let dateiEingabe = document.createElement('input');
    dateiEingabe.type = 'file';
    dateiEingabe.accept = '.json'; // Nur JSON-Dateien zulassen

    // Eventlistener für das Ändern des Eingabefelds hinzufügen
    dateiEingabe.addEventListener('change', function () {
        // Überprüfen, ob eine Datei ausgewählt wurde
        if (dateiEingabe.files.length > 0) {
            // Die ausgewählte Datei
            var datei = dateiEingabe.files[0];

            // FileReader verwenden, um den Inhalt der Datei zu lesen
            var reader = new FileReader();

            // FileReader-Eventlistener für das Laden der Datei
            reader.onload = function (event) {
                // Der Inhalt der Datei als Text
                var jsonText = event.target.result;

                // Hier kannst du mit dem JSON-Text arbeiten, z.B. ihn analysieren oder anzeigen
                try {
                    // Versuche, den JSON-Text zu analysieren
                    var jsonObj = JSON.parse(jsonText);

                    // Hier kannst du mit dem JSON-Objekt arbeiten
                    // TODO: ein sauberes Escape-Game erstellen
                    console.log(jsonObj);

                    // Erfolgreiches Ergebnis an eine Callback-Funktion zurückgeben
                    //ergebnisCallback(jsonObj);
                } catch (error) {
                    // Fehler beim Analysieren des JSON-Texts
                    console.error('Fehler beim Analysieren der JSON-Datei:', error);

                    // Fehlerhaftes Ergebnis (null) an eine Callback-Funktion zurückgeben
                    // ergebnisCallback(null);
                }            };

            // Die Datei als Text lesen
            reader.readAsText(datei);
        }
    });

    // Das Eingabefeld klicken, um den Auswahldialog zu öffnen
    dateiEingabe.click();
}