const EventTarget = require('./event-target.js');

const UNSENT = 0;
const OPENED = 1;
const HEADERS_RECEIVED = 2;
const LOADING = 3;
const DONE = 4;

const REQUEST_EVENTS = [
  'abort',
  'error',
  'load',
  'loadstart',
  'progress',
  'timeout',
  'loadend',
  'readystatechange'
];

class XMLHttpRequestEventTarget extends EventTarget {}

class XMLHttpRequest extends XMLHttpRequestEventTarget {

    constructor() {
        super(REQUEST_EVENTS);
        this.readyState = UNSET;
        this._headers = {};
    }

    abort() {
        throw new Error('not supported in weixin');
    }
    getAllResponseHeaders() {
        throw new Error('not supported in weixin');
    }
    getResponseHeader() {
        throw new Error('not supported in weixin');
    }
    overrideMimeType() {
        throw new Error('not supported in weixin');
    }
    open(method, url, async = true) {
        if (this.readyState !== UNSENT) {
            throw new Error('request is already opened');
        }
        if (!async) {
            throw new Error('sync request is not supported');
        }
        this._method = method;
        this._url = url;
        this.readyState = OPENED;
        this.dispatchEvent({type: 'readystatechange'});
    }
    setRequestHeader(header, value) {
        if (this.readyState !== OPENED) {
            throw new Error('request is not opened');
        }
        this._headers[header.toLowerCase()] = value;
    }
    send(data) {
        if (this.readyState !== OPENED) {
            throw new Error('request is not opened');
        }
        wx.request({
            url: this._url,
            data: data,
            header: this._headers,
            success: (response) => {
                this.status = response.statusCode;
                let text = response.data;
                if (typeof text !== string) {
                    text = JSON.stringify(text);
                }
                this.responseText = this.response = text;
                this.readyState = DONE;
                this.dispatchEvent({type: 'readystatechange'});
            },
            fail: (error) => {
                this.dispatchEvent({type: 'error'});
            }
        })
    }
}

Object.assign(XMLHttpRequest, {
    UNSENT,
    OPENED,
    HEADERS_RECEIVED,
    LOADING,
    DONE,
});

module.exports = XMLHttpRequest;