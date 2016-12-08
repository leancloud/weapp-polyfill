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

let instance;

function errorHandler(event) {
  // 安卓小程序会诡异地触发 onSocketError 回调
  // 通过比较 message 过滤掉
  if (event.message === "") return;
  if (instance) {
    instance._readyState = CLOSED;
    instance.dispatchEvent({
      type: 'error',
      message: event.errMsg,
    });
  }
}

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
      instance.dispatchEvent({
        type: 'close'
      });
    }
    instance = this;
    
    wx.onSocketOpen(function (event) {
      if (instance) {
        instance._readyState = OPEN;
        instance.dispatchEvent({
          type: 'open'
        });
      }
    });
    wx.onSocketError(errorHandler);
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
    
    wx.connectSocket({
      url,
      fail: (error) => setTimeout(() => errorHandler(error), 0),
    });
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

}

assign(WebSocket, {
  CONNECTING,
  OPEN,
  CLOSING,
  CLOSED,
});

module.exports = WebSocket;
