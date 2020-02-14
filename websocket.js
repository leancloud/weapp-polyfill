const assign = require('object-assign');
const EventTarget = require('event-target-shim');

const CONNECTING = 0;
const OPEN = 1;
const CLOSING = 2;
const CLOSED = 3;

const EVENTS = [
  'open',
  'error',
  'message',
  'close',
];

class WebSocket extends EventTarget(EVENTS) {
  constructor(url, protocol) {
    if (!url) {
      throw new TypeError('Failed to construct \'WebSocket\': url required');
    }
    if (protocol && !(wx.canIUse && wx.canIUse('connectSocket.object.protocols'))) {
      throw new Error('subprotocol not supported in weapp');
    }
    super();
    this._url = url;
    this._protocol = protocol || ''; // default value according to specs
    this._readyState = CONNECTING;

    const errorHandler = (event) => {
      this._readyState = CLOSED;
      this.dispatchEvent({
        type: 'error',
        message: event.errMsg,
      });
    }
    
    const socketTask = wx.connectSocket({
      url,
      protocols: this._protocol,
      fail: (error) => setTimeout(() => errorHandler(error), 0),
    });
    this._socketTask = socketTask;

    socketTask.onOpen((event) => {
      this._readyState = OPEN;
      this.dispatchEvent({
        type: 'open'
      });
    });
    socketTask.onError(errorHandler);
    socketTask.onMessage((event) => {
      var {
        data,
        origin,
        ports,
        source,
      } = event;
      this.dispatchEvent({
        data,
        origin,
        ports,
        source,
        type: 'message',
      });
    });
    socketTask.onClose((event) => {
      this._readyState = CLOSED;
      var {
        code,
        reason,
        wasClean,
      } = event;
      this.dispatchEvent({
        code,
        reason,
        wasClean,
        type: 'close',
      });
    });
  }

  get url() {
    return this._url;
  }
  get protocol() {
    return this._protocol;
  }
  get readyState() {
    return this._readyState;
  }

  close() {
    if (this.readyState === CLOSED) return;
    if (this.readyState === CONNECTING) {
      console.warn('close WebSocket which is connecting might not work');
    }
    this._socketTask.close();
  }

  send(data) {
    if (this.readyState !== OPEN) {
      throw new Error('INVALID_STATE_ERR');
    }

    if (!(typeof data === 'string' || data instanceof ArrayBuffer)) {
      throw new TypeError('only String/ArrayBuffer supported');
    }

    this._socketTask.send({
      data
    });
  }

}

assign(WebSocket, {
  CONNECTING,
  OPEN,
  CLOSING,
  CLOSED,
});

module.exports = WebSocket;
