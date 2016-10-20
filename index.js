var localStorage = require('./localstorage.js');
var XMLHttpRequest = require('./xmlhttprequest.js');
var FormData = require('./formdata.js');
var WebSocket = require('./websocket.js');

module.exports = {
    polyfill(target = global || window) {
        if (typeof target !== 'object') {
            throw new Error('polyfill target is not an Object');
        }
        Object.assign(target, {
            localStorage,
            XMLHttpRequest,
            FormData,
            WebSocket,
            Object,
        });
        // window.localStorage is readonly
        if (target.localStorage !== localStorage) {
            target.wxStorage = localStorage;
        }
    },
    localStorage,
    XMLHttpRequest,
    FormData,
    WebSocket,
}
