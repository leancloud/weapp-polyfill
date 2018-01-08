var localStorage = require('./localstorage.js');
var XMLHttpRequest = require('./xmlhttprequest.js');
var FormData = require('./formdata.js');
var WebSocket = require('./websocket.js');
var OnlineOfflineEvents = require('./online-offline-events.js');
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
    OnlineOfflineEvents.polyfill(target);
    //  假扮为 React Native，让 axios 认为这是一个 nonStandardBrowserEnv
    target.navigator.product = 'ReactNative';
  },
  localStorage,
  XMLHttpRequest,
  FormData,
  WebSocket,
}
