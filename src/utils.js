export function formatSecond (ms) {
  return Math.ceil(ms / 1000);
}

export function formatTime (ms) {
  const sec = formatSecond(ms);
  const mins = Math.floor(sec / 60);
  let secs = String(sec - mins * 60);
  if (secs.length === 1) {
    secs = `0${secs}`;
  }
  return `${mins}:${secs}`;
}

export function $ (selector) {
  return document.querySelectorAll(selector)[0];
}

export function on (event, element, handler) {
  element.addEventListener(event, handler);
  return function off () {
    element.removeEventListener(event, handler);
  };
}

export function makeEventChannel () {
  const listeners = {};
  const eventChannel = {
    /**
     * Creates a listener for `event`. When `event` is triggered, `callback` is called
     * @param event
     * @param callback
     */
    on (event, callback) {
      listeners[event] = callback;
    },
    /**
     * removes all listeners of `event`
      * @param event
     */
    off (event) {
      delete listeners[event];
    },
    /**
     * Calls all listeners of `event`
     * @param event
     * @param args
     */
    trigger (event, ...args) {
      if (listeners[event]) {
        listeners[event](...args);
      }
    }
  };
  return eventChannel;
}
