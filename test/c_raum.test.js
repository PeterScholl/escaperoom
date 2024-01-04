// c_raum.test.js


describe('LockedRaum', () => {
    describe('removeLock()', () => {
        it('ein angegebenes Lock sollte vom Raum entfernt werden', () => {
            const lockedRaum = new LockedRaum('Locked Raum', 'Willkommen im verschlossenen Raum');
            const lock = new Lock('Schloss 1');
            lockedRaum.lockedBy = lock;

            lockedRaum.removeLock(lock);

            assert.strictEqual(lockedRaum.lockedBy.size, 0);
        });
    });

    describe('lockedBy', () => {
        it('ein Lock sollte zu dem lockedBy-Set hinzugefügt werden', () => {
            const lockedRaum = new LockedRaum('Locked Raum', 'Willkommen im verschlossenen Raum');
            const lock = new Lock('Schloss 1',"1234");

            lockedRaum.lockedBy = lock;

            assert.strictEqual(lockedRaum.lockedBy.size, 1);
        });

        it('ein Objekt, dass nicht vom Typ Lock ist, sollte sich nicht hinzufügen lassen', () => {
            const lockedRaum = new LockedRaum('Locked Raum', 'Willkommen im verschlossenen Raum');
            const nonLock = { name: 'Not a Lock' };

            lockedRaum.lockedBy = nonLock;

            assert.strictEqual(lockedRaum.lockedBy.size, 0);
        });
    });

    describe('Raum-Objekt in LockedRaum konvertieren', () => {
        it('createFromRaum gibt LockedRaumObject zurück', () => {
            const raum = new Raum("Testraum","willkommen");
            const lockedRaum = LockedRaum.createFromRaum(raum);
            const lr2 = LockedRaum.createFromRaum({"a":1});
            
            assert.equal(lockedRaum instanceof LockedRaum, true);
            assert.equal(lr2 instanceof LockedRaum, true);

        });

        it('createFromRaum gibt LockedRaumObject mit gleichen Werten zurück', () => {
            const raum = new Raum("Testraum","willkommen");
            const lockedRaum = LockedRaum.createFromRaum(raum);

            assert.equal(lockedRaum instanceof LockedRaum, true);
            //Alle weiteren Attribute testen
            assert.deepStrictEqual(raum,lockedRaum);
        });
    });

    // Weitere Tests für andere Methoden und Eigenschaften können hier hinzugefügt werden
});
