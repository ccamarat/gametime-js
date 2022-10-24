import { $, formatSecond, formatTime } from './utils';

export const { buttons, display, settingsUi } = (function () {
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
    counterContainer: $('.counter-container'),
    counter: $('.counter-container .counter'),
    currentProgram: $('.preset-container .program'),
    delayTimer: $('.delay-container .delay'),
    minutes: $('.display-minutes'),
    claim: $('.display-claim'),
    save: $('.display-save'),
    recall: $('.display-recall'),
    gameEnd: $('.display-game-end'),
    gameEndRemaining: $('.game-end-remaining'),
    accumulator: $('.display-accumulator'),
    sound: $('.display-sound')
  };

  const settingsUi = {
    preset: $('.settings-container .preset-value'),
    accumulatorEnabled: $('.settings-container .use-accumulator'),
    accumulatorValue: $('.settings-container .accumulator-value'),
    delayEnabled: $('.settings-container .use-delay'),
    delayValue: $('.settings-container .delay-value'),
    claimEnabled: $('.settings-container .use-claim'),
    claimAllEnabled: $('.settings-container .use-claim-all'),
    showCounter: $('.settings-container .show-counter'),
    gameEndEnabled: $('.settings-container .use-game-end'),
    gameEndValue: $('.settings-container .game-end-value'),
    soundEnabled: $('.settings-container .use-sound'),
    wordEnabled: $('.settings-container .use-word'),
    displaySeconds: $('.settings-container .show-seconds')
  };

  return { buttons, display, settingsUi };
})();

export function updateUi (game) {
  const { p1, p2, settings } = game;
  const activePlayer = [p1, p2].find(p => p.isActive);

  display.counterContainer.classList[settings.counter ? 'remove' : 'add']('hidden');
  display.minutes.classList[settings.second ? 'add' : 'remove']('hidden'); // add/remove swapped cos minutes not seconds
  display.claim.classList[settings.claim ? 'remove' : 'add']('hidden');
  display.save.classList[settings.save ? 'remove' : 'add']('hidden');
  display.recall.classList[settings.recall ? 'remove' : 'add']('hidden');
  display.gameEnd.classList[settings.gameEnd ? 'remove' : 'add']('hidden');
  display.accumulator.classList[settings.accumulator ? 'remove' : 'add']('hidden');
  display.sound.classList[settings.sound ? 'remove' : 'add']('hidden');

  display.p1Timer.innerHTML = `${formatTime(p1.timer.timeRemaining)}`;
  display.p2Timer.innerHTML = `${formatTime(p2.timer.timeRemaining)}`;
  display.delayTimer.innerHTML = activePlayer
    ? formatSecond(activePlayer.delay.timeRemaining)
    : 0;
  const moveCount = Math.max(p1.moveCount, p2.moveCount);
  display.counter.innerHTML = moveCount;
  display.gameEndRemaining.innerHTML = settings.gameEndCounter - moveCount;

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
