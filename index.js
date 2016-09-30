const global = require('./global.js');
var localStorage = require('./localstorage.js');
var XMLHttpRequest = require('./xmlhttprequest.js');

module.exports = {
    polyfill(target = this) {
        if (typeof target !== 'object') {
            throw new Error('polyfill target is not an Object');
        }
        Object.assign(target, {
            localStorage,
            XMLHttpRequest,
        });
        // window.localStorage is readonly
        if (target.localStorage !== localStorage) {
            target.wxStorage = localStorage;
        }
    }
}