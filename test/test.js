// test.js
//const assert = require('chai').assert;
//const Lock = require('../javascript/c_lock'); // Passe den Pfad an, wenn nötig

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

    it('Set and get lock name', () => {
        const myLock = new Lock('MyLock', '1234');
        assert.equal(myLock.name, 'MyLock');

        myLock.name = 'NewLockName';
        assert.equal(myLock.name, 'NewLockName');
    });

    it('Set and get lock status', () => {
        const myLock = new Lock('MyLock', '1234');
        assert.equal(myLock.isOpen, false);

        myLock.isOpen = true;
        assert.equal(myLock.isOpen, true);
    });
});
