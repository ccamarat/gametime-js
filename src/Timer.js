import { makeEventChannel } from './utils';

export function makeTimer (timeout) {
  let elapsedTimeMs = 0;
  let lastStartTime = null;
  let events = makeEventChannel();
  let flag = false;
  let isPaused = false;

  function calculateCurrentElapsedTime () {
    return lastStartTime && !isPaused ? Date.now() - lastStartTime : 0;
  }

  const timer = {
    get events () {
      return events;
    },
    get timeout () {
      return timeout;
    },
    set timeout (val) {
      timeout = val;
    },

    get timeRemaining () {
      const out = timeout - (elapsedTimeMs + calculateCurrentElapsedTime());
      return out >= 0 ? out : 0;
    },

    start () {
      if (!lastStartTime) {
        lastStartTime = Date.now();
        pollIsDone();
      }
    },

    stop () {
      if (lastStartTime) {
        elapsedTimeMs += calculateCurrentElapsedTime();
        lastStartTime = null;
      }
    },

    pause () {
      if (lastStartTime && !isPaused) {
        elapsedTimeMs += calculateCurrentElapsedTime();
        isPaused = true;
      }
    },

    resume () {
      if (lastStartTime && isPaused) {
        lastStartTime = Date.now();
        isPaused = false;
      }
    },

    reset () {
      elapsedTimeMs = 0;
      lastStartTime = null;
      flag = false;
    }
  };

  return timer;

  function pollIsDone () {
    if (timer.timeRemaining <= 0) {
      flag = true;
      events.trigger('done');
    } else if (lastStartTime) {
      setTimeout(pollIsDone, 1); // each ms check if done until done.
    }
  }
}
