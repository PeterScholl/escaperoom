function initEditArea() {
    let editArea = document.getElementById('editArea');
    // Löschen aller Child-Elemente
    editArea.innerHTML = "";
    // Horzizontal Row zur Abgrenzung erzeugen
    editArea.appendChild(document.createElement("hr"));

    //Raumauswahl erzeugen
    let selectElement = selectElementRaumauswahl();
    selectElement.id = "editAreaSelectRoom";
    //selectElement.selectedIndex = 0;
    selectElement.addEventListener("change", raumgewaehlt);
    editArea.appendChild(selectElement);

    //Tabelle mit Raumname und Welcometext erstellen
    let raumBasics = createTable(["Bezeichner", "Inhalt", "Aktionen"]);
    raumBasics.id = "table_raumBasics";
    editArea.appendChild(raumBasics);

    //Rudimentäre Tabelle in der die Verweise auf die Folgeräume eingestellt und 
    //hinzugefügt werden können
    let tbl_folgeraeume = createTable(["key","Folgeraum"]);
    tbl_folgeraeume.id = "table_folgeraeume";
    editArea.appendChild(tbl_folgeraeume);

    //Rudimentäre Tabelle mit den Infotexten 
    let tbl_infotexte = createTable(["key","Infotext","Aktionen"]);
    tbl_infotexte.id = "table_folgeraeume";
    editArea.appendChild(tbl_infotexte);


    // Inhalte eintragen
    raumgewaehlt();

}

function raumgewaehlt() {
    tabelleRaumgrundlagenFuellen();

    tabelleFolgeraeumeFuellen();

    //TODO: Tabelle mit Infotexten füllen

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
    // TODO Editierbar machen
    zelle.innerHTML = aktRaum.name;
    zelle = zeile.insertCell(2);
    // Button für Speichern
    let speichereNameButton = document.createElement("button");
    speichereNameButton.innerHTML = "Speichern";
    speichereNameButton.onclick = function () {
        // Hier die Aktion für den Bearbeiten-Button
        console.log("Speichere Namen geklickt für Raum:", aktRaum.name);
        controller.setModalText("Speichere Namen geklickt für Raum:"+ aktRaum.name);
        controller.showModal(true);
    };
    zelle.appendChild(speichereNameButton);

    //Zeile mit: Welcometext: | <Text> | Editor öffnen
    zeile = raumBasics.insertRow(-1);
    zelle = zeile.insertCell(0);
    zelle.innerHTML = "Welcome-<br>text";
    zelle = zeile.insertCell(1);
    zelle.innerHTML = aktRaum.welcometext;
    zelle = zeile.insertCell(2);
    // Button für Speichern
    let editWelcomeTextButton = document.createElement("button");
    editWelcomeTextButton.innerHTML = "Edit";
    editWelcomeTextButton.onclick = function () {
        // Hier die Aktion für den Bearbeiten-Button
        controller.showEditorInModal(aktRaum.welcometext, function (text) {
            console.log("in der anonymen Funktion von "+aktRaum.name+" mit text: "+text); 
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
    for (const [key,folgeraumID] of Object.entries(aktRaum.folgeraeume)) {
        let zeile = tblFolgeraeume.insertRow(-1);
        //Zelle für den Key
        let zelle = zeile.insertCell(0);
        zelle.innerHTML = key;
        //Zelle für den Folgeraum
        zelle = zeile.insertCell(1);
        let folgeraumSelector = selectElementRaumauswahl();
        folgeraumSelector.selectedIndex = folgeraumID;
        //TODO: OnChangeAction implementieren
        zelle.appendChild(folgeraumSelector);
        folgeraumSelector.addEventListener("change", (event) => folgeraumAendern(event,aktRaum,key,folgeraumSelector.selectedIndex));

    }

    //Zeile mit: Hinzufügen eines Keys - Raumpaar wird dann erstellt
    zeile = tblFolgeraeume.insertRow(-1);
    zelle = zeile.insertCell(0);
    let form = document.createElement("form");
    form.id="addNewFolgeraumKeyForm";
    form.onsubmit = function (event) {
        aktRaum.setFolgeraum(input.value,0);
        console.log("Neuer Key ("+input.value+") erstellt für:", aktRaum.name);
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
        aktRaum.setFolgeraum(input.value,0);
        console.log("Neuer Key ("+input.value+") erstellt für:", aktRaum.name);
        tabelleFolgeraeumeFuellen();
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
    console.log("folgeraumAendern aufgerufen für raum "+raum.name+" event: "+event);
    raum.folgeraeume[key]=raumid;
    console.log("folgeraum - angeblich geändert");
}