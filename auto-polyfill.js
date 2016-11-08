var polyfill = require('./index.js').polyfill;
window = window || {};
polyfill();
polyfill(window);
try {
  localStorage = localStorage || require('./localstorage.js');
} catch (e) {}
try {
  XMLHttpRequest = XMLHttpRequest || require('./xmlhttprequest.js');
} catch (e) {}
try {
  FormData = FormData || require('./formdata.js');
} catch (e) {}
try {
  WebSocket = WebSocket || require('./websocket.js');
} catch (e) {}
