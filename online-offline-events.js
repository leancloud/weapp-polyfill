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
