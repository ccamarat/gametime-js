import { makeEventChannel } from './utils';
import { DEFAULT_GAME_TIMEOUT } from './consts';

const ON = true;
const OFF = false;

export const defaultSettings = {
  preset: 1,

  gameTimeout: DEFAULT_GAME_TIMEOUT, // todo - wire in

  // The Accumulate option works in conjunction with the Delay option by adding to the
  // player’s clock any delay time not used by the player. As an example of what happens,
  // assume the delay has been set to 5 seconds on a sudden-death game of 5 minutes. On
  // the first move, if white takes 3 seconds to move and presses his clock button, white’s
  // game clock would show 5 minutes and 2 seconds. The additional 2 seconds added to the
  // player’s game clock is the 5-second delay minus the 3 seconds actually used.
  accumulator: OFF, // "On" enables "accumulatorDelay" and disables "delay"
  accumulatorDelay: 2, // seconds

  // When you set a countdown delay, a player’s clock does not start running until the delay
  // interval has passed. For example, setting a countdown delay of five seconds allows five
  // seconds from the time a player presses the plunger until the opponent’s clock actually
  // starts running.
  // A countdown delay is especially helpful in sudden-death situations. Without a countdown
  // delay, a player who is hopelessly lost, but ahead on time, can continue to play,
  // hoping the opponent will forfeit on time before having a chance to win. The countdown
  // delay gives a player just enough time to make the routine moves that it would take to
  // ensure a win in such a situation.
  // At this writing, USCF’S rules call for a delay of two seconds for “Speed Chess” time
  // controls up to, but not including G/10. For controls G/10 to G/29 (called “Quick
  // Chess”), the delay is three seconds. For all longer time controls the suggested delay is
  // five seconds.
  // --- out of date ---
  // The Accumulate option works in conjunction with the Delay option by adding to the
  // player’s clock any delay time not used by the player. As an example of what happens,
  // assume the delay has been set to 5 seconds on a sudden-death game of 5 minutes. On
  // the first move, if white takes 3 seconds to move and presses his clock button, white’s
  // game clock would show 5 minutes and 2 seconds. The additional 2 seconds added to the
  // player’s game clock is the 5-second delay minus the 3 seconds actually used.
  // --- end out of date ---
  delay: 2, // 1-19 seconds; 0 disables

  // GameTime™ always indicates when a time forfeit occurs by displaying a flag and flashing
  // a red light on the side of the player who has exceeded the time control. You can set
  // GameTime™ to freeze the time display and ignore the plungers, or to continue allowing
  // moves.
  // Selecting ON tells GameTime™ to freeze the display and ignore the PLUNGERS. Selecting
  // OFF allows more moves to be made.
  claim: OFF, // "On" enables claimAll
  claimAll: OFF, // ?

  // You may need to adjourn a game in progress and resume play later. With GameTime™
  // you cannot only save a game, you can play other games while the adjourned game
  // remains in memory. You can keep only one game in memory at a time. Saving a game
  // erases the previously saved game.
  save: OFF, // only available in-game
  recall: OFF,

  // The GameTime™ always keeps track of the number of moves made. But you can show
  // or hide the move counter.
  counter: OFF,

  // GameTime™ can end a game after a specified number of moves. After the specified
  // move number the clock will show a forfeit.
  // Important. Make sure to turn off the GAME END feature after playing the game. It
  // can prematurely end other games played under more traditional time controls.
  gameEnd: OFF,
  // NEW
  gameEndCounter: 1,

  // The GameTime™ beeps when a player loses a game by failing to meet a time control.
  // You can also set GameTime™ to beep before a time control is about to expire (see the
  // following section).
  sound: ON,

  // The countdown delay is most useful for sudden-death time controls. However, you can
  // apply the delay to all time controls.
  delayAll: ON, // related to delay setting? Why is delay=0 mentioned in description?

  // For Word games time never runs out, so when the main time has counted down to zero,
  // the clock enters overtime. In overtime the time is counted up instead of down. When in
  // WORD mode, the GameTime™ shows the overtime condition by turning on the appropriate
  // players FLAG. Some digital clocks that do not have a FLAG symbol, place a
  // minus sign in front of the time to indicate it is displaying overtime time.
  // NOTE: While in WORD mode, the DELAY feature is not available.
  word: OFF,

  // GameTime™ normally always shows the remaining seconds. For times less than 10
  // minutes, the remaining seconds are shown to the right of the colon (:) symbol. For time
  // greater than 10 minutes the remaining seconds are shown in two smaller digits next to
  // the three large minutes digits. If you prefer to only see the large three minutes digits,
  // you may turn off the display of remaining seconds on the small digits.
  second: ON
};

function assertIsBoolean(value, key) {
  if (!(value === true || value === false)) {
    throw new Error(`${key} must be boolean`);
  }
}
function assertIsInRange(value, min, max, key) {
  if (value < min || value > max) {
    throw new Error(`${key} must be a number between ${min} and ${max}; got ${value}`);
  }
}
export function makeSettings () {
  const settings = JSON.parse(JSON.stringify(defaultSettings));
  const settingsProxy = new Proxy(settings, {
    set (obj, prop, value) {
      switch (prop) {
        case 'preset':
          assertIsInRange(value, 1, 100, 'preset');
          // loadPreset(value);
          break;
        case 'accumulator':
          assertIsBoolean(value, 'accumulator');
          break;
        case 'accumulatorDelay':
          assertIsInRange(value, 1, 100, 'accumulatorDelay');
          break;
        case 'delay':
          assertIsInRange(value, 1, 19, 'delay');
          break;
        case 'claim':
          assertIsBoolean(value, 'claim');
          break;
        case 'claimAll':
          assertIsBoolean(value, 'claimAll');
          break;
        case 'save':
          break;
        case 'recall':
          break;
        case 'counter':
          assertIsBoolean(value, 'counter');
          break;
        case 'gameEnd':
          assertIsBoolean(value, 'gameEnd');
          break;
        case 'gameEndCounter':
          assertIsInRange(value, 1, 99999, 'gameEndCounter');
          break;
        case 'sound':
          assertIsBoolean(value, 'sound');
          break;
        case 'delayAll':
          assertIsBoolean(value, 'delayAll');
          break;
        case 'word':
          assertIsBoolean(value, 'word');
          break;
        case 'second':
          assertIsBoolean(value, 'second');
          break;
        case 'on':
        case 'off':
        case 'trigger':
          obj[prop] = value;
          return true;
        default:
          throw new Error(`Cannot add new "${prop}" to settings object.`);
      }

      // signal pending change
      settingsProxy.trigger(`change`, prop, value, obj[prop]);
      // settingsProxy.trigger(`${prop}-changed`, value, obj[prop]);

      console.log(prop, obj[prop], '=>', value);

      // commit change
      obj[prop] = value;

      // signal success
      return true;
    }
  });

  const events = makeEventChannel();
  Object.assign(settingsProxy, events);
  return settingsProxy;
}
