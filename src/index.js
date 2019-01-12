import "./styles.scss";

const FIVE_MINUTES_MS = 5 * 60 * 1000;
const TWO_SECONDS_MS = 2 * 1000;
const DEFAULT_GAME_TIMEOUT = FIVE_MINUTES_MS;
const DEFAULT_TURN_DELAY = TWO_SECONDS_MS;

const { buttons, display } = (function() {
  const buttons = {
    counter: $(".button-counter"),
    white: $(".button-white"),
    select: $(".button-select"),
    verify: $(".button-verify"),
    p1: $(".player-1.plunger"),
    p2: $(".player-2.plunger"),
    pause: $(".play-pause-switch")
  };

  const display = {
    clockContainer: $(".clock-container"),
    p1Info: $(".display-container .player-info.player-1"),
    p2Info: $(".display-container .player-info.player-2"),
    p1Timer: $(".player-1 .timer"),
    p2Timer: $(".player-2 .timer"),
    plFirst: $(".display-first.player-1"), // "First" means "White"
    p2First: $(".display-first.player-2"),
    currentProgram: $(".preset-container .timer"),
    delayTimer: $(".delay-container .timer"),
    minutes: $(".display-minutes"),
    claim: $(".display-claim"),
    save: $(".display-save"),
    recall: $(".display-recall"),
    gameEnd: $(".display-game-end"),
    accumulator: $(".display-accumulator"),
    sound: $(".display-sound")
  };

  return { buttons, display };
})();

function makePlayer() {
  let moveCount = 0;
  let isActive = false;
  const delay = makeTimer(DEFAULT_TURN_DELAY);
  const timer = makeTimer(DEFAULT_GAME_TIMEOUT);

  const player = {
    timer,
    delay,
    startTurn() {
      if (!isActive) {
        isActive = true;
        delay.reset();
        delay.start();
      }
    },
    finishTurn() {
      if (isActive) {
        isActive = false;
        moveCount++;
        delay.stop();
        timer.stop();
      }
    },
    pause() {
      delay.pause();
      timer.pause();
    },
    resume() {
      delay.resume();
      timer.resume();
    },
    get isActive() {
      return isActive;
    },
    get moveCount() {
      return moveCount;
    }
  };

  delay.events.on("done", timer.start);

  return player;
}

function makeEventChannel() {
  const listeners = {};
  const eventChannel = {
    on(event, callback) {
      listeners[event] = callback;
    },
    off(event) {
      delete listeners[event];
    },
    trigger(event) {
      if (listeners[event]) {
        listeners[event]();
      }
    }
  };
  return eventChannel;
}

function makeTimer(timeout) {
  let elapsedTimeMs = 0;
  let lastStartTime = null;
  let events = makeEventChannel();
  let flag = false;
  let isPaused = false;

  function calculateCurrentElapsedTime() {
    return lastStartTime && !isPaused ? Date.now() - lastStartTime : 0;
  }

  const timer = {
    get events() {
      return events;
    },
    get timeout() {
      return timeout;
    },
    set timeout(val) {
      timeout = val;
    },

    get timeRemaining() {
      const out = timeout - (elapsedTimeMs + calculateCurrentElapsedTime());
      return out >= 0 ? out : 0;
    },

    start() {
      if (!lastStartTime) {
        lastStartTime = Date.now();
        pollIsDone();
      }
    },

    stop() {
      if (lastStartTime) {
        elapsedTimeMs += calculateCurrentElapsedTime();
        lastStartTime = null;
      }
    },

    pause() {
      if (lastStartTime && !isPaused) {
        elapsedTimeMs += calculateCurrentElapsedTime();
        isPaused = true;
      }
    },

    resume() {
      if (lastStartTime && isPaused) {
        lastStartTime = Date.now();
        isPaused = false;
      }
    },

    reset() {
      elapsedTimeMs = 0;
      lastStartTime = null;
      flag = false;
    }
  };

  return timer;

  function pollIsDone() {
    if (timer.timeRemaining <= 0) {
      flag = true;
      events.trigger("done");
    } else if (lastStartTime) {
      setTimeout(pollIsDone, 1); // each ms check if done until done.
    }
  }
}

function makeGame() {
  const p1 = makePlayer();
  const p2 = makePlayer();
  let activePlayer;
  let isPaused = true;

  return {
    get activePlayer() {
      return activePlayer;
    },
    get isPaused() {
      return isPaused;
    },
    p1,
    p2,
    pause() {
      isPaused = true;
      p1.pause();
      p2.pause();
    },
    resume() {
      isPaused = false;
      p1.resume();
      p2.resume();
    }
  };
}

function gameLoop(game) {
  updateUi(game);
  requestAnimationFrame(() => gameLoop(game));
}

function updateUi(game) {
  const { p1, p2 } = game;
  const activePlayer = [p1, p2].find(p => p.isActive);
  display.p1Timer.innerHTML = `${formatTime(p1.timer.timeRemaining)}`;
  display.p2Timer.innerHTML = `${formatTime(p2.timer.timeRemaining)}`;
  display.delayTimer.innerHTML = activePlayer
    ? formatSecond(activePlayer.delay.timeRemaining)
    : 0;

  if (game.isPaused && !display.clockContainer.classList.contains("paused")) {
    display.clockContainer.classList.add("paused");
  } else if (
    !game.isPaused &&
    display.clockContainer.classList.contains("paused")
  ) {
    display.clockContainer.classList.remove("paused");
  }

  if (!p1.isActive && display.p1Info.classList.contains("active")) {
    display.p1Info.classList.remove("active");
    buttons.p1.classList.remove("active");
  } else if (p1.isActive) {
    display.p1Info.classList.add("active");
    buttons.p1.classList.add("active");
  }

  if (!p2.isActive && display.p2Info.classList.contains("active")) {
    display.p2Info.classList.remove("active");
    buttons.p2.classList.remove("active");
  } else if (p2.isActive) {
    display.p2Info.classList.add("active");
    buttons.p2.classList.add("active");
  }
}

function formatTime(ms) {
  const sec = formatSecond(ms);
  const mins = Math.floor(sec / 60);
  let secs = String(sec - mins * 60);
  if (secs.length === 1) {
    secs = `0${secs}`;
  }
  return `${mins}:${secs}`;
}
function formatSecond(ms) {
  return Math.ceil(ms / 1000);
}
function $(selector) {
  return document.querySelectorAll(selector)[0];
}
function on(event, element, handler) {
  element.addEventListener(event, handler);
  return function off() {
    element.removeEventListener(event, handler);
  };
}

function start() {
  // For now just hide the top row.
  display.plFirst.classList.add("hidden");
  display.p2First.classList.add("hidden");
  display.currentProgram.classList.add("hidden");
  display.minutes.classList.add("hidden");
  display.claim.classList.add("hidden");
  display.save.classList.add("hidden");
  display.recall.classList.add("hidden");
  display.gameEnd.classList.add("hidden");
  display.accumulator.classList.add("hidden");
  display.sound.classList.add("hidden");

  buttons.pause.addEventListener("change", e => {
    const isPaused = !e.target.checked;
    if (isPaused) {
      handlePause();
    } else {
      handleResume();
    }
  });

  game = makeGame();
  gameLoop(game);
}
function handlePause() {
  listeners.forEach(off => off());
  game && game.pause();
}
function handleResume() {
  game.resume();
  listeners = [
    on("click", buttons.p1, () => {
      game.p2.finishTurn();
      game.p1.startTurn();
    }),
    on("click", buttons.p2, () => {
      game.p1.finishTurn();
      game.p2.startTurn();
    })
  ];
}

let game;
let listeners;

start();
