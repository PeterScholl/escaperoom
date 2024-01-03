"use strict";

class Lock {
    #key = "1234"; //key to open the lock
    #name = "MyLock"; //name of the Lock (e.g. treasure chest)
    #isOpen = false; // was the lock opened?

    constructor(name, key) {
        this.#name = name;
        this.#key = key;
        this.isOpen = false;
    }

    /**
     * Tries the key on the lock and opens it if the key fits
     * 
     * @param {String} key
     * @returns true if the key opens the lock 
     */
    tryKeyOnLock(key) {
        if (key === this.#key) {
            this.#isOpen = true;
            return true;
        }
        return false;
    }

    /**
     * @returns {boolean} true if the lock was opened already}
     */
    get isOpen() {
        return this.#isOpen;
    }

    get name() {
        return this.#name;
    }

    set isOpen(x) {
        if (typeof (x) === 'boolean') {
            this.#isOpen = x;
        }
    }


}