var polyfill = require('./index.js').polyfill;
window = window || {};
polyfill();
polyfill(window);
localStorage = localStorage || require('./localstorage.js');
XMLHttpRequest = XMLHttpRequest || require('./xmlhttprequest.js');
WebSocket = WebSocket || require('./websocket.js');
