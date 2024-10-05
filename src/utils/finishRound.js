import { manageInterval } from './manageInterval.js';
import { battleReset } from './battleReset.js';

export function finishRound(battleInfo) {
  // clear intervals
  manageInterval('clear', battleInfo.intervals, 'countdown');
  manageInterval('clear', battleInfo.intervals, 'specialBar');

  if (battleInfo.actualRound.number == 1 || battleInfo.actualRound.number == 2) {
    // add winner
    battleInfo.winners[`round${battleInfo.actualRound.number}`] = battleInfo.healthBar.firstFighter == 0 ? battleInfo.secondFighter.name : battleInfo.firstFighter.name;

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
