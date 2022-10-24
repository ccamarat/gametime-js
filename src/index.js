import './styles.scss';
import { $, on } from './utils';
import { makePlayer } from './Player';
import { updateUi, buttons, settingsUi } from './user-interface';
import { makeSettings } from './game-settings';

function makeGame () {
  const settings = makeSettings();
  const p1 = makePlayer();
  const p2 = makePlayer();
  let activePlayer;
  let isPaused = true;

  return {
    get activePlayer () {
      return activePlayer;
    },
    get isPaused () {
      return isPaused;
    },
    settings,
    p1,
    p2,
    pause () {
      isPaused = true;
      p1.pause();
      p2.pause();
    },
    resume () {
      isPaused = false;
      p1.resume();
      p2.resume();
    }
  };
}

function gameLoop (game) {
  updateUi(game);
  requestAnimationFrame(() => gameLoop(game));
}

function start () {
  // For now just hide the top row.
  // display.plFirst.classList.add('hidden');
  // display.p2First.classList.add('hidden');
  // display.currentProgram.classList.add('hidden');
  // display.minutes.classList.add('hidden');
  // display.claim.classList.add('hidden');
  // display.save.classList.add('hidden');
  // display.recall.classList.add('hidden');
  // display.gameEnd.classList.add('hidden');
  // display.accumulator.classList.add('hidden');
  // display.sound.classList.add('hidden');

  on('change', buttons.pause, e => {
    const isPaused = !e.target.checked;
    if (isPaused) {
      handlePause();
    } else {
      handleResume();
    }
  });

  game = makeGame();

  bind(settingsUi.preset, game.settings, 'preset');
  bind(settingsUi.accumulatorEnabled, game.settings, 'accumulator');
  bind(settingsUi.accumulatorValue, game.settings, 'accumulatorDelay');
  bind(settingsUi.delayEnabled, game.settings, 'delayAll');
  bind(settingsUi.delayValue, game.settings, 'delay');
  bind(settingsUi.claimEnabled, game.settings, 'claim');
  bind(settingsUi.claimAllEnabled, game.settings, 'claimAll');
  bind(settingsUi.showCounter, game.settings, 'counter');
  bind(settingsUi.gameEndEnabled, game.settings, 'gameEnd');
  bind(settingsUi.gameEndValue, game.settings, 'gameEndCounter');
  bind(settingsUi.soundEnabled, game.settings, 'sound');
  bind(settingsUi.wordEnabled, game.settings, 'word');
  bind(settingsUi.displaySeconds, game.settings, 'second');

  function bind (el, obj, key) {
    const [ bindTarget, type ] = el.type === 'checkbox' ? [ 'checked', Boolean ] : [ 'value', Number ];
    el[bindTarget] = obj[key];
    on('change', el, e => {
      try {
        obj[key] = type(el[bindTarget]);
      } catch (ex) {
        console.warn(ex.message);
        el[bindTarget] = obj[key];
        return false;
      }
    });
  }

  gameLoop(game);
}

function handlePause () {
  listeners.forEach(off => off());
  game && game.pause();
}

function handleResume () {
  game.resume();
  listeners = [
    on('click', buttons.p1, () => {
      game.p2.finishTurn();
      game.p1.startTurn();
    }),
    on('click', buttons.p2, () => {
      game.p1.finishTurn();
      game.p2.startTurn();
    })
  ];
}

let game;
let listeners;

start();
