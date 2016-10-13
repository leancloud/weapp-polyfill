const EventTarget = require('event-target-shim');

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

class XMLHttpRequest extends EventTarget(REQUEST_EVENTS) {

    constructor() {
        super();
        this.readyState = UNSENT;
        this._headers = {};
    }

    abort() {
        throw new Error('not supported in weapp');
    }
    getAllResponseHeaders() {
        console.warn('getAllResponseHeaders always returns \'\'');
        return '';
    }
    getResponseHeader(key) {
        if (key === 'content-type') {
            console.warn('get content-type always returns \'application/json\'');
            return 'application/json';
        }
        console.warn('getResponseHeader always returns \'\'');
        return '';
    }
    overrideMimeType() {
        throw new Error('not supported in weapp');
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
            data: data || '',
            method: this._method,
            header: this._headers,
            success: (response) => {
                this.status = response.statusCode;
                this.statusText = response.statusCode;
                let text = response.data;
                if (typeof text !== 'string') {
                    text = JSON.stringify(text);
                }
                this.responseText = this.response = text;
                this.readyState = DONE;
                this.dispatchEvent({type: 'readystatechange'});
            },
            fail: (error) => {
                this.dispatchEvent({type: 'error'});
            }
        });
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
