class Raum {
    welcometext="Dies ist ein Standardraum";
    name = "Standardraum";
    //Dictionary Infotexte
    folgeraeume = { "0":this , "start": this };
    // Infotexte
    infotexte = { "help" : "Gib einen Schlüssel ein um ihn auszuprobieren!"};
    istZiel = false;

    constructor (name,welcometext) {
        this.name=name;
        this.welcometext=welcometext;
    }

    testKeyInfotext(key) {
        //Wenn der key zu einem Infotext gehört, wird dieser zurückgegeben
        console.log("RAUM: Teste auf Infotext:"+key+"-"+this.infotexte[key]);
        return this.infotexte[key];
    }

    testKeyOnLock(key) {
        //Wenn der key zu einem Folgeraum gehört, dann wird dieser zurückgegeben
        let folgeraumID = this.folgeraeume[key];
        if (folgeraumID) {
            return folgeraumID;
        }
        // sonst -1
        return -1;
    }
}