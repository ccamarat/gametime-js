import { $, formatSecond, formatTime } from './utils';

export const { buttons, display } = (function () {
  const buttons = {
    counter: $('.button-counter'),
    white: $('.button-white'),
    select: $('.button-select'),
    verify: $('.button-verify'),
    p1: $('.player-1.plunger'),
    p2: $('.player-2.plunger'),
    pause: $('.play-pause-switch')
  };

  const display = {
    clockContainer: $('.clock-container'),
    p1Info: $('.display-container .player-info.player-1'),
    p2Info: $('.display-container .player-info.player-2'),
    p1Timer: $('.player-1 .timer'),
    p2Timer: $('.player-2 .timer'),
    plFirst: $('.display-first.player-1'), // "First" means "White"
    p2First: $('.display-first.player-2'),
    currentProgram: $('.preset-container .timer'),
    delayTimer: $('.delay-container .timer'),
    minutes: $('.display-minutes'),
    claim: $('.display-claim'),
    save: $('.display-save'),
    recall: $('.display-recall'),
    gameEnd: $('.display-game-end'),
    accumulator: $('.display-accumulator'),
    sound: $('.display-sound')
  };

  return { buttons, display };
})();

export function updateUi (game) {
  const { p1, p2 } = game;
  const activePlayer = [p1, p2].find(p => p.isActive);
  display.p1Timer.innerHTML = `${formatTime(p1.timer.timeRemaining)}`;
  display.p2Timer.innerHTML = `${formatTime(p2.timer.timeRemaining)}`;
  display.delayTimer.innerHTML = activePlayer
    ? formatSecond(activePlayer.delay.timeRemaining)
    : 0;

  if (game.isPaused && !display.clockContainer.classList.contains('paused')) {
    display.clockContainer.classList.add('paused');
  } else if (
    !game.isPaused &&
    display.clockContainer.classList.contains('paused')
  ) {
    display.clockContainer.classList.remove('paused');
  }

  if (!p1.isActive && display.p1Info.classList.contains('active')) {
    display.p1Info.classList.remove('active');
    buttons.p1.classList.remove('active');
  } else if (p1.isActive) {
    display.p1Info.classList.add('active');
    buttons.p1.classList.add('active');
  }

  if (!p2.isActive && display.p2Info.classList.contains('active')) {
    display.p2Info.classList.remove('active');
    buttons.p2.classList.remove('active');
  } else if (p2.isActive) {
    display.p2Info.classList.add('active');
    buttons.p2.classList.add('active');
  }
}
