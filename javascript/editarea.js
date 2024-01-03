function initEditArea() {
    let editArea = document.getElementById('editArea');
    // Löschen aller Child-Elemente
    editArea.innerHTML = "";

    //Grundlagen des Game-Objekts

    //Raumauswahl erzeugen
    let p = document.createElement("p");
    p.innerHTML = "Raumauswahl:";
    let selectElement = selectElementRaumauswahl();
    selectElement.id = "editAreaSelectRoom";
    //selectElement.selectedIndex = 0;
    selectElement.addEventListener("change", raumgewaehlt);
    p.appendChild(selectElement);
    editArea.appendChild(p);

    let neuerRaumButton = document.createElement("button");
    neuerRaumButton.innerHTML = "Neuen Raum anlegen";
    neuerRaumButton.style.marginLeft="5px";
    neuerRaumButton.onclick = function () {
        // Hier die Aktion für neuen Raum anlegen
        console.log("neuer Raum wird angelegt");
        Controller.getInstance().game.raumliste.push(new Raum("Neuer Raum","Willkommen im neuen Raum"));
        updateRaumAuswahl();
    };
    p.appendChild(neuerRaumButton);

    // TODO: Testen - Möglichkeit ohne Edit-anzeige zu speichern bzw. Speicheroptionen einzustellen
    let speichernOhneEditButton = document.createElement("button");
    speichernOhneEditButton.innerHTML = "Speichern ohne Edit";
    speichernOhneEditButton.style.marginLeft="5px";
    speichernOhneEditButton.onclick = function () {
        // Hier die Aktion für neuen Raum anlegen
        console.log("Raum wird gespeichernt");
        Controller.getInstance().game.editAllowed = false;
        downloadJSON(Controller.getInstance().game);
        Controller.getInstance().game.editAllowed = true;
    };
    p.appendChild(speichernOhneEditButton);


    //Bereich für das Editieren des ausgewählten Raums

    let div_editRaum = document.createElement("div");
    div_editRaum.id = "raumbearbeitung";
    editArea.appendChild(div_editRaum);

    //Tabelle mit Raumname und Welcometext erstellen
    p = document.createElement("p");
    p.innerHTML = "Basisdaten des Raums:<br>";
    let raumBasics = createTable(["Bezeichner", "Inhalt", "Aktionen"]);
    raumBasics.id = "table_raumBasics";
    p.appendChild(raumBasics);
    div_editRaum.appendChild(p);

    //Rudimentäre Tabelle in der die Verweise auf die Folgeräume eingestellt und 
    //hinzugefügt werden können
    p = document.createElement("p");
    p.innerHTML = "Folger&auml;ume zu Schl&uuml;sseln:<br>";
    let tbl_folgeraeume = createTable(["key", "Folgeraum"]);
    tbl_folgeraeume.id = "table_folgeraeume";
    p.appendChild(tbl_folgeraeume);
    div_editRaum.appendChild(p);

    //Rudimentäre Tabelle mit den Infotexten 
    p = document.createElement("p");
    p.innerHTML = "Infotexte zu Schl&uuml;sseln:<br>";
    let tbl_infotexte = createTable(["key", "Infotext", "Aktionen"]);
    tbl_infotexte.id = "table_infotexte";
    p.appendChild(tbl_infotexte);
    div_editRaum.appendChild(p);


    // Inhalte eintragen
    raumgewaehlt();

}

function raumgewaehlt() {
    tabelleRaumgrundlagenFuellen();

    tabelleFolgeraeumeFuellen();

    tabelleInfotexteFuellen();
}

function tabelleRaumgrundlagenFuellen() {
    let selectedRoomID = document.getElementById("editAreaSelectRoom").value;

    let controller = Controller.getInstance();

    let aktRaum = controller.game.raumliste[selectedRoomID];

    // ***** Obere Tabelle füllen (Raumgrundlagen) *****
    // Alle Zeilen löschen
    let raumBasics = document.getElementById("table_raumBasics");
    while (raumBasics.rows.length > 1) {
        raumBasics.deleteRow(1); // 1, weil die Kopfzeile bei 0 beginnt
    }
    //Name: | <Name> im Textfeld | Setzen
    let zeile = raumBasics.insertRow(-1);
    let zelle = zeile.insertCell(0);
    zelle.innerHTML = "Name";
    zelle = zeile.insertCell(1);
    let form = document.createElement("form");
    form.id = "editRaumname";
    form.style.width = "100%";
    form.onsubmit = function (event) {
        console.log("Raumname geändert:", aktRaum.name);
        aktRaum.name = input.value;
        tabelleRaumgrundlagenFuellen();
        updateRaumAuswahl();
        return false; //damit keine Standardaktion ausgeführt wird
    };
    let input = document.createElement("input");
    input.style.width="100%";
    input.type = "text";
    input.id = "editRaumnameInput";
    input.name = "editRaumnameInput";
    input.value = aktRaum.name;
    form.appendChild(input);

    zelle.appendChild(form);

    zelle = zeile.insertCell(2);
    // Button für Speichern
    let speichereNameButton = document.createElement("button");
    speichereNameButton.innerHTML = "Speichern";
    speichereNameButton.onclick = function () {
        // Hier die Aktion für den Bearbeiten-Button
        console.log("Raumname geändert:", aktRaum.name);
        aktRaum.name = input.value;
        tabelleRaumgrundlagenFuellen();
        updateRaumAuswahl();
    };
    zelle.appendChild(speichereNameButton);

    //Zeile mit: Welcometext: | <Text> | Editor öffnen
    zeile = raumBasics.insertRow(-1);
    zelle = zeile.insertCell(0);
    zelle.innerHTML = "Welcome-<br>text";
    zelle = zeile.insertCell(1);
    zelle.innerHTML = aktRaum.welcometext;
    zelle = zeile.insertCell(2);
    // Button für Editieren
    let editWelcomeTextButton = document.createElement("button");
    editWelcomeTextButton.innerHTML = "Edit";
    editWelcomeTextButton.onclick = function () {
        // Hier die Aktion für den Bearbeiten-Button
        controller.showEditorInModal(aktRaum.welcometext, function (text) {
            console.log("in der anonymen Funktion von " + aktRaum.name + " mit text: " + text);
            aktRaum.welcometext = text;
            //Controller.getInstance().setRaumWelcometext(selectedRoomID,text);
            //Update - der Darstellung
            tabelleRaumgrundlagenFuellen();
        });
        console.log("Edit Welcometext geklickt für Raum:", aktRaum.name);
    };
    zelle.appendChild(editWelcomeTextButton);
}

function tabelleFolgeraeumeFuellen() {
    let selectedRoomID = document.getElementById("editAreaSelectRoom").value;

    let controller = Controller.getInstance();

    let aktRaum = controller.game.raumliste[selectedRoomID];

    // Alle Zeilen löschen
    let tblFolgeraeume = document.getElementById("table_folgeraeume");
    while (tblFolgeraeume.rows.length > 1) {
        tblFolgeraeume.deleteRow(1); // 1, weil die Kopfzeile bei 0 beginnt
    }
    //Eintrag für jede Zeile in folgeraeume

    for (const [key, folgeraumID] of Object.entries(aktRaum.folgeraeume)) {
        let zeile = tblFolgeraeume.insertRow(-1);
        //Zelle für den Key
        let zelle = zeile.insertCell(0);
        zelle.innerHTML = "<a href=\"javascript:deleteFolgeraumKey('" + key + "');\" class=\"text-danger\" role=\"button\">x</a> " + key;
        //Zelle für den Folgeraum
        zelle = zeile.insertCell(1);
        let folgeraumSelector = selectElementRaumauswahl();
        folgeraumSelector.selectedIndex = folgeraumID;
        zelle.appendChild(folgeraumSelector);
        folgeraumSelector.addEventListener("change", (event) => folgeraumAendern(event, aktRaum, key, folgeraumSelector.selectedIndex));

    }

    //Zeile mit: Hinzufügen eines Keys - Raumpaar wird dann erstellt
    zeile = tblFolgeraeume.insertRow(-1);
    zelle = zeile.insertCell(0);
    let form = document.createElement("form");
    form.id = "addNewFolgeraumKeyForm";
    form.onsubmit = function (event) {
        aktRaum.setFolgeraum(input.value, 0);
        console.log("Neuer Key (" + input.value + ") erstellt für:", aktRaum.name);
        tabelleFolgeraeumeFuellen();
        return false; //damit keine Standardaktion ausgeführt wird
    };
    let input = document.createElement("input");
    input.type = "text";
    input.id = "newFolgeraumKeyInput";
    input.name = "newFolgeraumKeyInput";
    form.appendChild(input);

    zelle.appendChild(form);
    zelle = zeile.insertCell(1);
    // Button für Key übernehmen
    let saveNewKeyButton = document.createElement("button");
    saveNewKeyButton.innerHTML = "erstellen";
    saveNewKeyButton.onclick = function () {
        // Hier die Aktion für den erstellen-Button
        aktRaum.setFolgeraum(input.value, 0);
        console.log("Neuer Key (" + input.value + ") erstellt für:", aktRaum.name);
        tabelleFolgeraeumeFuellen();
    };
    zelle.appendChild(saveNewKeyButton);
}

function tabelleInfotexteFuellen() {
    let selectedRoomID = document.getElementById("editAreaSelectRoom").value;

    let controller = Controller.getInstance();

    let aktRaum = controller.game.raumliste[selectedRoomID];

    // Alle Zeilen löschen
    let tblInfotexte = document.getElementById("table_infotexte");
    while (tblInfotexte.rows.length > 1) {
        tblInfotexte.deleteRow(1); // 1, weil die Kopfzeile bei 0 beginnt
    }
    //Eintrag für jede Zeile in Infotexte
    console.log("EDITAREA: Zeilen für Infotexte füllen");
    for (const [key, infotext] of Object.entries(aktRaum.infotexte)) {
        console.log("EDITAREA: Zeile für infotext zu " + key);
        let zeile = tblInfotexte.insertRow(-1);
        //Zelle für den Key
        let zelle = zeile.insertCell(0);
        // Mit Delete-Button InfotextKey
        zelle.innerHTML = "<a href=\"javascript:deleteInfotextKey('" + key + "');\" class=\"text-danger\" role=\"button\">x</a> " + key;
        //Zelle für den Infotext
        zelle = zeile.insertCell(1);

        zelle.innerHTML = infotext;
        //Zelle für die Aktionsbuttons
        zelle = zeile.insertCell(2);
        // Button für Editieren
        let editInfotextButton = document.createElement("button");
        editInfotextButton.innerHTML = "Edit";
        editInfotextButton.onclick = function () {
            // Hier die Aktion für den Bearbeiten-Button
            controller.showEditorInModal(infotext, function (text) {
                aktRaum.infotexte[key] = text;
                //Update - der Darstellung
                tabelleInfotexteFuellen();
            });
            console.log("Edit Infotext geklickt für Key:", key);
        };
        zelle.appendChild(editInfotextButton);

    }

    //Zeile mit: Hinzufügen eines Keys - Infotext wird mit "Info zu <key>" gesetzt
    zeile = tblInfotexte.insertRow(-1);
    zelle = zeile.insertCell(0);
    let form = document.createElement("form");
    form.id = "addNewInfotextKeyForm";
    form.onsubmit = function (event) {
        aktRaum.setInfotext(input.value, "Infotext zu " + input.value);
        console.log("Neuer Infotext-Key (" + input.value + ") erstellt für:", aktRaum.name);
        tabelleInfotexteFuellen();
        return false; //damit keine Standardaktion ausgeführt wird
    };
    let input = document.createElement("input");
    input.type = "text";
    input.id = "newInfotextKeyInput";
    input.name = "newInfotextKeyInput";
    form.appendChild(input);

    zelle.appendChild(form);
    zelle = zeile.insertCell(1); //Leerzelle
    zelle = zeile.insertCell(2);
    // Button für Key übernehmen
    let saveNewKeyButton = document.createElement("button");
    saveNewKeyButton.innerHTML = "erstellen";
    saveNewKeyButton.onclick = function () {
        // Hier die Aktion für den erstellen-Button
        aktRaum.setInfotext(input.value, "Infotext zu " + input.value);
        console.log("Neuer Infotext-Key (" + input.value + ") erstellt für:", aktRaum.name);
        tabelleInfotexteFuellen();
    };
    zelle.appendChild(saveNewKeyButton);
}

function selectElementRaumauswahl() {
    //Raumauswahl erzeugen
    let selectElement = document.createElement("select");

    // Iteriere über die Liste der Räume und füge jede Option dem Select-Element hinzu
    let raumliste = Controller.getInstance().game.raumliste;
    for (var i = 0; i < raumliste.length; i++) {
        var option = document.createElement("option");
        option.value = i;
        option.text = "" + i + ":" + raumliste[i].name;
        selectElement.appendChild(option);
    }
    return selectElement
}

function folgeraumAendern(event, raum, key, raumid) {
    console.log("folgeraumAendern aufgerufen für raum " + raum.name + " event: " + event);
    raum.folgeraeume[key] = raumid;
    console.log("folgeraum - angeblich geändert");
}

function deleteFolgeraumKey(key) {
    //Folgeraum des aktuellen Editraums löschen
    let selectedRoomID = document.getElementById("editAreaSelectRoom").value;

    let controller = Controller.getInstance();

    let aktRaum = controller.game.raumliste[selectedRoomID];
    aktRaum.delFolgeraum(key);
    tabelleFolgeraeumeFuellen(); //neu aufbauen - da fehlt ja jetzt was
}

function deleteInfotextKey(key) {
    //Infotext des aktuellen Editraums löschen
    let selectedRoomID = document.getElementById("editAreaSelectRoom").value;

    let controller = Controller.getInstance();

    let aktRaum = controller.game.raumliste[selectedRoomID];
    aktRaum.delInfotext(key);
    tabelleInfotexteFuellen(); //neu aufbauen - da fehlt ja jetzt was
}

//Aktualisiert die Raumauswahl z.B. nach einer erfolgten Namensänderung
function updateRaumAuswahl() {
    //TODO evtl. alle Raumauswahlen (auch bei Folgeräumen) aktualisieren
    //Alten Selector holen - zum Ersetzen und Wert übernehmen
    let alterSelector = document.getElementById('editAreaSelectRoom');

    //neuen Selector erzeugen 
    let newSelector = selectElementRaumauswahl();
    newSelector.id = "editAreaSelectRoom";
    newSelector.addEventListener("change", raumgewaehlt);
    //ausgwählte Option korrekt setzen
    newSelector.selectedIndex = alterSelector.selectedIndex;
    
    //...und diesen ersetzen
    alterSelector.replaceWith(newSelector); 
}