// test.js
// Vorlage bzw. Idee von https://javascript.info/testing-mocha

describe('Lock Class Tests', () => {
    it('Lock should be closed by default', () => {
        const myLock = new Lock('MyLock', '1234');
        assert.equal(myLock.isOpen, false);
    });

    it('Try key on lock', () => {
        const myLock = new Lock('MyLock', '1234');
        const isKeyValid = myLock.tryKeyOnLock('1234');
        assert.equal(isKeyValid, true);
        assert.equal(myLock.isOpen, true);
    });

});

describe('Lock Class Tests 2', () => {
    it('Lock should be closed by default', () => {
        const myLock = new Lock('MyLock', '1234');
        assert.equal(myLock.isOpen, false);
    });

    it('Try key on lock', () => {
        const myLock = new Lock('MyLock', '1234');
        const isKeyValid = myLock.tryKeyOnLock('1234');
        assert.equal(isKeyValid, true);
        assert.equal(myLock.isOpen, true);
    });

    it('Get lock name', () => {
        const myLock = new Lock('MyLock', '1234');
        assert.equal(myLock.name, 'MyLock');
    });

    it('Set and get lock status', () => {
        const myLock = new Lock('MyLock', '1234');
        assert.equal(myLock.isOpen, false);

        myLock.isOpen = true;
        assert.equal(myLock.isOpen, true);
    });
});
