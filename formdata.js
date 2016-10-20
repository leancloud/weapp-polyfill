class FormData {
  constructor() {
    this._entries = [];
  }

  append(name, value) {
    if (typeof name !== 'string') {
      throw new TypeError('FormData name must be a string');
    }
    if (typeof value !== 'string') {
      if (typeof value !== 'object' || typeof value.uri !== 'string') {
        throw new TypeError('FormData value must be a string or { uri: tempFilePath }')
      }
    }
    this._entries.push([name, value]);
  }

  set(name, value) {
    const entry = this.get(name);
    if (entry) {
      entry[1] = value;
    } else {
      this.append(name, value);
    }
  }

  delete(name) {
    this._entries = this._entries.filter(entry => entry[0] !== name);
  }

  entries() {
    return this._entries;
  }

  get(name) {
    return this._entries.find(entry => entry[0] === name);
  }

  getAll(name) {
    return this._entries.filter(entry => entry[0] === name);
  }

  has(name) {
    return this._entries.some(entry => entry[0] === name);
  }

  keys() {
    return this._entries.map(entry => entry[0]);
  }

  values() {
    return this._entries.map(entry => entry[1]);
  }
}

module.exports = FormData;
