var localStorage = require('./localstorage.js');
var XMLHttpRequest = require('./xmlhttprequest.js');
var FormData = require('./formdata.js');
var WebSocket = require('./websocket.js');
var navigator = require('./navigator');

module.exports = {
  polyfill(target = global || window) {
    if (typeof target !== 'object') {
      throw new Error('polyfill target is not an Object');
    }
    const polyfills = {
      localStorage,
      XMLHttpRequest,
      FormData,
      WebSocket,
      Object,
      navigator,
    };
    for (let k in polyfills) {
      if (!target[k]) target[k] = polyfills[k];
    }
  },
  localStorage,
  XMLHttpRequest,
  FormData,
  WebSocket,
}
