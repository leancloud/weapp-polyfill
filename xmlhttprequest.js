const assign = require('object-assign');
const EventTarget = require('event-target-shim');
const FormData = require('./formdata.js');

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

function successCallback(response) {
  this.status = response.statusCode;
  this.statusText = response.statusCode;
  let text = response.data;
  if (typeof text !== 'string') {
    text = JSON.stringify(text);
  }
  this.responseText = this.response = text;
  this.readyState = DONE;
  this.dispatchEvent({ type: 'readystatechange' });
}

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
    this.dispatchEvent({ type: 'readystatechange' });
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
    if (data instanceof FormData) {
      const entries = data.entries();
      const blobs = entries.filter(entry => typeof entry[1] !== 'string');
      if (blobs.length === 0) {
        throw new Error('Must specify a Blob field in FormData');
      }
      if (blobs.length > 1) {
        console.warn('Only the first Blob will be send in Weapp');
      }
      const restData = entries
        .filter(entry => typeof entry[1] === 'string')
        .reduce((result, entry) => assign(result, { [entry[0]]: entry[1] }), {});
      wx.uploadFile({
        url: this._url,
        name: blobs[0][0],
        filePath: blobs[0][1].uri,
        formData: restData,
        header: this._headers,
        success: successCallback.bind(this),
        fail: (error) => {
          this.dispatchEvent({ type: 'error' });
        }
      })
    } else {
      wx.request({
        url: this._url,
        data: data || '',
        method: this._method,
        header: this._headers,
        success: successCallback.bind(this),
        fail: (error) => {
          this.dispatchEvent({ type: 'error' });
        }
      });
    }
  }
}

assign(XMLHttpRequest, {
  UNSENT,
  OPENED,
  HEADERS_RECEIVED,
  LOADING,
  DONE,
});

module.exports = XMLHttpRequest;
