// c_egame.test.js


describe('Klasse EscapeGame testen', () => {
    let escapeGame;

    beforeEach(() => {
        escapeGame = new EscapeGame('Test Escape-Game');
        escapeGame.setExample();
    });

    describe('#testKeyOnLock()', () => {
        it('should return true and change room for a valid key', () => {
            const validKey = 'eins';

            const result = escapeGame.testKeyOnLock(validKey);

            assert.strictEqual(result, true);
            assert.strictEqual(escapeGame.aktuellerRaumID, 1);
        });

        it('should return false for an invalid key', () => {
            const invalidKey = 'invalid';

            const result = escapeGame.testKeyOnLock(invalidKey);

            assert.strictEqual(result, false);
            assert.strictEqual(escapeGame.aktuellerRaumID, 0);
        });
    });

    describe('#testKeyOnInfotexte()', () => {
        it('should return the infotext for a valid key', () => {
            const validKey = '0';

            const result = escapeGame.testKeyOnInfotexte(validKey);

            assert.strictEqual(result, 'so geht es aus');
        });

        it('should return false for an invalid key', () => {
            const invalidKey = 'invalid';

            const result = escapeGame.testKeyOnInfotexte(invalidKey);

            assert.strictEqual(result, false);
        });
    });

    describe('#getAktuellerRaumName()', () => {
        it('should return the name of the current room', () => {
            const result = escapeGame.getAktuellerRaumName();

            assert.strictEqual(result, 'Startraum Beispielgame');
        });
    });

    describe('#getAktuellerRaumText()', () => {
        it('should return the welcometext of the current room', () => {
            const result = escapeGame.getAktuellerRaumText();

            assert.strictEqual(result, 'Du bist in einem dunklen Startraum, der Schalter für das Licht ist binär.<br>Worauf solltest du den Schalter stellen?');
        });
    });

    describe('#doOpenRoomsExist()', () => {
        it('should return true if open rooms exist', () => {
            const result = escapeGame.doOpenRoomsExist();

            assert.strictEqual(result, true);
        });

        it('should return false if no open rooms exist', () => {
            escapeGame.raumliste = [new Raum(), new Raum()];
            const result = escapeGame.doOpenRoomsExist();

            assert.strictEqual(result, false);
        });
    });

    // Weitere Tests für andere Methoden und Szenarien können hier hinzugefügt werden
});
