import { manageInterval } from './manageInterval.js';
import { battleReset } from './battleReset.js';

export function finishRound(battleInfo) {
  // clear intervals
  manageInterval('clear', battleInfo.intervals, 'countdown');
  manageInterval('clear', battleInfo.intervals, 'specialBar');

  if (battleInfo.actualRound.number == 1 || battleInfo.actualRound.number == 2) {
    // add winner
    let winner = null;
    if (battleInfo.firstFighter.life === 0 || battleInfo.secondFighter.life === 0) {
      winner =
        battleInfo.firstFighter.life === 0
          ? battleInfo.secondFighter.name
          : battleInfo.firstFighter.name;
    } else {
      winner =
        battleInfo.firstFighter.life < battleInfo.secondFighter.life
          ? battleInfo.secondFighter.name
          : battleInfo.firstFighter.name;
    }

    if (winner !== null) {
      battleInfo.winners[`round${battleInfo.actualRound.number}`] = winner;
    }
    console.log(battleInfo.winners);

    // restart round time
    battleInfo.time.duration = 99;

    // set countdown interval after 2 seconds
    setTimeout(() => {
      manageInterval(
        'set',
        battleInfo.intervals,
        'countdown',
        battleInfo.references,
        1000
      );
    }, 2000);

    // start round and set special bar interval after 3 seconds
    setTimeout(() => {
      manageInterval(
        'set',
        battleInfo.intervals,
        'specialBar',
        battleInfo.references,
        100
      );
      battleReset(battleInfo);
    }, 3000);
  } else {
    console.log('Battle end');
  }
}
