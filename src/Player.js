import { makeTimer } from './Timer';
import { DEFAULT_GAME_TIMEOUT, DEFAULT_TURN_DELAY } from './consts';

export function makePlayer (settings) {
  let moveCount = 0;
  let isActive = false;
  const delay = makeTimer(settings.delay);
  const timer = makeTimer(DEFAULT_GAME_TIMEOUT);

  const player = {
    timer,
    delay,
    startTurn () {
      if (!isActive) {
        isActive = true;
        delay.reset();
        delay.start();
      }
    },
    finishTurn () {
      if (isActive) {
        isActive = false;
        moveCount++;
        delay.stop();
        timer.stop();
      }
    },
    pause () {
      delay.pause();
      timer.pause();
    },
    resume () {
      delay.resume();
      timer.resume();
    },
    get isActive () {
      return isActive;
    },
    get moveCount () {
      return moveCount;
    }
  };

  delay.events.on('done', timer.start);

  return player;
}
