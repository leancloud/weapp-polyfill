const EventTarget = require('event-target-shim');

exports.polyfill = target => {
  if (!wx.onNetworkStatusChange) return;
  if (target.__onlineOfflinePolyfilled) return;
  target.__onlineOfflinePolyfilled = true;
  const internalEventTarget = new EventTarget();
  if (!target.dispatchEvent) {
    target.addEventListener = internalEventTarget.addEventListener.bind(internalEventTarget);
    target.removeEventListener = internalEventTarget.removeEventListener.bind(internalEventTarget);
    target.dispatchEvent = internalEventTarget.dispatchEvent.bind(internalEventTarget);
    // avoid this condition to be true:
    // https://github.com/zloirock/core-js/blob/9f051803760c02b306aae2595621bb7ef698fc29/library/modules/_task.js#L61
    if (typeof postMessage == 'function' && !target.importScripts) {
      target.importScripts = () => { throw new Error('mocked'); };
    }
  }
  wx.getNetworkType({
    success: ({networkType}) => {
      target.onLine = networkType !== 'none';
      wx.onNetworkStatusChange(({isConnected}) => {
        if (target.onLine === isConnected) return;
        target.onLine = isConnected;
        target.dispatchEvent({
          type: isConnected ? 'online' : 'offline',
        });
      });
    },
  });
}
