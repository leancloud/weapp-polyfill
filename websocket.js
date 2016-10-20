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

let instance;

wx.onSocketOpen(function (event) {
  if (instance) {
    instance._readyState = OPEN;
    instance.dispatchEvent({
      type: 'open'
    });
  }
});
wx.onSocketError(function (event) {
  if (instance) {
    instance._readyState = CLOSED;
    instance.dispatchEvent(event);
  }
});
wx.onSocketMessage(function (event) {
  if (instance) {
    var {
      data,
      origin,
      ports,
      source,
    } = event;
    instance.dispatchEvent({
      data,
      origin,
      ports,
      source,
      type: 'message',
    });
  }
});
wx.onSocketClose(function (event) {
  if (instance) {
    instance._readyState = CLOSED;
    var {
      code,
      reason,
      wasClean,
    } = event;
    instance.dispatchEvent({
      code,
      reason,
      wasClean,
      type: 'close',
    });
    instance = null;
  }
});

class WebSocket extends EventTarget(EVENTS) {
  constructor(url, protocal) {
    if (!url) {
      throw new TypeError('Failed to construct \'WebSocket\': url required');
    }
    if (protocal) {
      throw new Error('subprotocal not supported in weapp');
    }
    super();
    this._url = url;
    this._protocal = ''; // default value according to specs
    this._readyState = CONNECTING;
    if (instance) {
      // instance._removeEventListeners();
      instance.dispatchEvent({
        type: 'close'
      });
    }
    instance = this;
    wx.connectSocket({
      url
    });
    // this._addEventListeners();
  }

  get url() {
    return this._url;
  }
  get protocal() {
    return this._protocal;
  }
  get readyState() {
    return this._readyState;
  }

  close() {
    if (this.readyState === CONNECTING) {
      console.warn('close WebSocket which is connecting might not work');
    }
    // this._removeEventListeners();
    wx.closeSocket();
  }

  send(data) {
    if (this.readyState !== OPEN) {
      throw new Error('INVALID_STATE_ERR');
    }

    if (typeof data !== 'string') {
      throw new TypeError('only string typed data are supported');
    }

    wx.sendSocketMessage({
      data
    });
  }

  // _addEventListeners() {
  // }

  // _removeEventListeners() {
  //   // no wx API for this
  // }
}

Object.assign(WebSocket, {
  CONNECTING,
  OPEN,
  CLOSING,
  CLOSED,
});

module.exports = WebSocket;
