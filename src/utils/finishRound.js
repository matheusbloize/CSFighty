import { manageInterval } from './manageInterval.js';
import { battleReset } from './battleReset.js';

export function finishRound(battleInfo) {
  // clear intervals
  manageInterval('clear', battleInfo.intervals, 'countdown');
  setTimeout(() => {
    // timeout added for last hit before fighter die counts on special bar
    manageInterval('clear', battleInfo.intervals, 'specialBar');
  }, 300);

  // set round winner
  let winner = null;
  winner =
    battleInfo.firstFighter.life < battleInfo.secondFighter.life
      ? battleInfo.secondFighter.name
      : battleInfo.firstFighter.name;

  if (winner !== null) {
    battleInfo.winners[`round${battleInfo.actualRound.number}`] = winner;

    // add winner hud
    const fighterRoundHud = document.querySelector(
      `#hud .hud_fighter-${winner === 'player' ? '1' : '2'}_round-count_${
        battleInfo.actualRound.number
      }`
    );
    setTimeout(() => (fighterRoundHud.style.backgroundColor = '#FFFFFF'), 2000);
  }

  // check if match ended
  let hasMatchWinner = false;
  let firstFighterRoundsWon = 0;
  let secondFighterRoundsWon = 0;

  for (const winner in battleInfo.winners) {
    battleInfo.winners[winner] === battleInfo.firstFighter.name &&
      firstFighterRoundsWon++;
    battleInfo.winners[winner] === battleInfo.secondFighter.name &&
      secondFighterRoundsWon++;
  }

  if (firstFighterRoundsWon === 2 || secondFighterRoundsWon === 2) {
    hasMatchWinner = true;
  }

  // remove time pulsing
  battleInfo.countdownDOM.classList.remove('hud_time-pulsing');

  // restart round variables
  if (!hasMatchWinner) {
    // restart round time
    battleInfo.matchTime.duration = 99;

    // set countdown interval and fighters health bars style after 2 seconds
    setTimeout(() => {
      manageInterval('set', battleInfo.intervals, 'countdown', battleInfo, 1000);
      battleInfo.firstFighterHealthBar.style.width = '100%';
      battleInfo.secondFighterHealthBar.style.width = '100%';
      battleInfo.firstFighterHealthBar.style.border = '2px solid';
      battleInfo.secondFighterHealthBar.style.border = '2px solid';
    }, 2000);

    // start round and set special bar interval after 3 seconds
    setTimeout(() => {
      manageInterval('set', battleInfo.intervals, 'specialBar', battleInfo, 100);
      battleReset(battleInfo);
    }, 3000);
  } else {
    console.log('Battle end');
  }
}
