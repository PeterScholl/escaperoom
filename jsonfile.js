/* Diese Datei bietet Hilfsfunktionen an um mit JSON-Files
   zu arbeiten */

// Funktion um die Daten eines EscapeGames zum Download anzubieten
function downloadJSON(game) {
    //TODO: Prüfen ob game wirklich ein EscapeGame ist


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
    a.click();

    // URL-Objekt freigeben, um Speicher freizugeben
    URL.revokeObjectURL(url);
}
