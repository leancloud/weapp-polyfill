var polyfill = require('./index.js').polyfill;
try {
  polyfill();
} catch (e) {}
try {
  polyfill(GameGlobal);
} catch (e) {}
try{
  polyfill(window);
} catch (e) {}
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
try {
  navigator = navigator || require('./navigator.js');
} catch (e) {}
