var localStorage = require('./localstorage.js');
var XMLHttpRequest = require('./xmlhttprequest.js');
var WebSocket = require('./websocket.js');

module.exports = {
    polyfill(target = window || this) {
        if (typeof target !== 'object') {
            throw new Error('polyfill target is not an Object');
        }
        Object.assign(target, {
            localStorage,
            XMLHttpRequest,
            WebSocket,
            Object,
        });
        // window.localStorage is readonly
        if (target.localStorage !== localStorage) {
            target.wxStorage = localStorage;
        }
    }
}
