# Idee
Es geht darum die Kontrolle für ein Escape-Spiel in den Browser zu verlagern. Die Webseite lädt eine json-Datei mit Raumdefinitionen und der Nutzer kann einen Schlüssel eingeben um in den nächsten Raum mit neuen Informationen zu gelangen

# Umsetzung
Mir war es wichtig, javascript-Klassen in separaten Dateien zu verwenden, um auch eine gemeinsame Code-Bearbeitung einfach zu machen.

Es gibt eine Klasse für den
**Controller**, der die Verbindung zwischen dem Game und der Webseite darstellt, eine Klasse für das **EscapeGame**, die die verschiedenen Objekte vom Typ **Raum** verwaltet.
Ich habe die Räume in einer Liste gespeichert und der Folgeraum nach einem erfolgreichen Schlüssel wird als ID zurück gegeben, da mir das für die Speicherung in einer JSON-Datei vorteilhaft erschien.

**Dateioperationen** werden in einer Hilfsdatei als Funktionen definiert.
