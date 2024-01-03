async function hashString(inputString) {
    // Text in Uint8Array umwandeln
    const encoder = new TextEncoder();
    const data = encoder.encode(inputString);

    // Hash-Wert berechnen (SHA-256)
    const hashBuffer = await crypto.subtle.digest('SHA-256', data);

    // Hash-Wert in Hexadezimal umwandeln
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    const hashHex = hashArray.map(byte => byte.toString(16).padStart(2, '0')).join('');

    return hashHex;
}

// Beispielaufruf der Asynchronen Methode mit await
/*
const inputString = 'Hallo, Welt!';
hashString(inputString).then(hashValue => {
    console.log('Hash-Wert:', hashValue);
});
*/

function hashStringSync(inputString) {
    // Text in Uint8Array umwandeln
    const encoder = new TextEncoder();
    const data = encoder.encode(inputString);

    // Hash-Wert berechnen (SHA-256)
    const hashBuffer = crypto.subtle.digestSync('SHA-256', data);

    // Hash-Wert in Hexadezimal umwandeln
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    const hashHex = hashArray.map(byte => byte.toString(16).padStart(2, '0')).join('');

    return hashHex;
}

/*// Beispielaufruf
const inputString = 'Hallo, Welt!';
const hashValue = hashStringSync(inputString);
console.log('Hash-Wert:', hashValue);
*/

//Tabellenzeile für ein HTML-Dokument erstellen
function createTable(listOfHeadCelltexts) {
    // Tabelle erstellen
    let tabelle = document.createElement("table");
    let kopfzeile = tabelle.createTHead();
    let kopfzeilenZeile = kopfzeile.insertRow();

    // Schleife für Kopfzellen
    for (var i = 0; i < listOfHeadCelltexts.length; i++) {
        var kopfzelle = listOfHeadCelltexts[i];
        var zellenElement = document.createElement("th");
        zellenElement.innerHTML = kopfzelle;
        kopfzeilenZeile.appendChild(zellenElement);
    }
    return tabelle;
}

// Funktion von der Webseite zum Verarbeiten von get-Parametern in der URL
// https://ekiwi.de/index.php/1749/javascript-get-parameter-aus-url-auslesen/
function getUrlParam(name) {
    var url_string = window.location;
    var url = new URL(url_string);
    var c = url.searchParams.get(name);
    return c;
}
