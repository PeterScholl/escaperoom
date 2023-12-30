function initEditArea() {
    let editArea = document.getElementById('editArea');
    // Löschen aller Child-Elemente
    editArea.innerHTML = "";
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
    document.getElementById('editArea').appendChild(selectElement);

}

function raumgewaehlt(nr) {
    //Diesen Raum im oberen Bereich darstellen
}