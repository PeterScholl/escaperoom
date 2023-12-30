function initEditArea() {
    let editArea = document.getElementById('editArea');
    // Löschen aller Child-Elemente
    editArea.innerHTML = "";
    // Horzizontal Row zur Abgrenzung erzeugen
    editArea.appendChild(document.createElement("hr"));

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
    selectElement.id="editAreaSelectRoom";
    selectElement.addEventListener("change", raumgewaehlt);
    editArea.appendChild(selectElement);
    //Tabelle mit Raumname und Welcometext erstellen
    //Name: | <Name> im Textfeld | Setzen
    //Welcometext: | <Text> | Editor öffnen

    //Rudimentäre Tabelle in der die Verweise auf die Folgeräume eingestellt und 
    //hinzugefügt werden können

    //Rudimentäre Tabelle mit den Infotexten 

}

function raumgewaehlt() {
    //Diesen Raum im Edit-Bereich darstellt
    let selectedRoomID = document.getElementById("editAreaSelectRoom").value;
    console.log("Ausgewählte RaumID:", selectedRoomID);
}