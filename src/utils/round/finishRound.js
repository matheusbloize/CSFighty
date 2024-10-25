import { manageInterval } from './manageInterval.js';
import { battleReset } from './battleReset.js';
import { movementActionsIntervals } from '../enemy/movementActionsIntervals.js';
import { enemyLevel, fearMeter, movementIntervals } from '../../states/enemy.js';
import { getRoundWinner } from './getRoundWinner.js';

function restartRound(battleInfo) {
  // restart round time
  battleInfo.matchInfo.duration = 99;

  // set countdown interval and fighters health and block bars style after 2 seconds
  setTimeout(() => {
    manageInterval('set', battleInfo.intervals, 'countdown', battleInfo, 1000);
    battleInfo.firstFighterHealthBar.style.width = '100%';
    battleInfo.secondFighterHealthBar.style.width = '100%';
    battleInfo.firstFighterHealthBar.style.border = '2px solid';
    battleInfo.secondFighterHealthBar.style.border = '2px solid';
    battleInfo.firstFighterBlockBar.style.width = '100%';
    battleInfo.secondFighterBlockBar.style.width = '100%';
  }, 2000);

  // start round and set special bar interval after 3 seconds
  setTimeout(() => {
    manageInterval('set', battleInfo.intervals, 'bars', battleInfo, 100);
    // reset enemy fear meter
    fearMeter.value = 50;

    battleReset(battleInfo);

    // change to default stage
    battleInfo.stage.last = '';
    battleInfo.stage.actual = 'default';
  }, 3000);
}

function changeMatch(status, battleInfo) {
  setTimeout(() => {
    document.querySelector('#hud .hud_fighter-1_round-count_1').style.backgroundColor =
      'transparent';
    document.querySelector('#hud .hud_fighter-1_round-count_2').style.backgroundColor =
      'transparent';
    document.querySelector('#hud .hud_fighter-2_round-count_1').style.backgroundColor =
      'transparent';
    document.querySelector('#hud .hud_fighter-2_round-count_2').style.backgroundColor =
      'transparent';

    if (status === 'won') {
      battleInfo.matchInfo.number++;
      switch (battleInfo.matchInfo.number) {
        case 2:
        case 3: {
          enemyLevel.actual = 2;
          break;
        }
        case 4: {
          enemyLevel.actual = 3;
          break;
        }
      }
    } else {
      battleInfo.matchInfo.number = 1;
      enemyLevel.actual = enemyLevel.initial;
    }
    battleInfo.actualRound.number = 0;
    battleInfo.winners.round1 = null;
    battleInfo.winners.round2 = null;
    battleInfo.winners.round3 = null;
    battleInfo.firstFighter.setSpecialBar(0);
    battleInfo.secondFighter.setSpecialBar(0);

    restartRound(battleInfo);
  }, 4000);
}

export function finishRound(battleInfo) {
  // clear intervals
  manageInterval('clear', battleInfo.intervals, 'countdown');
  setTimeout(() => {
    // timeout added for last hit before fighter die counts on special bar
    manageInterval('clear', battleInfo.intervals, 'bars');
  }, 300);
  movementActionsIntervals('clear', movementIntervals, 'right');
  movementActionsIntervals('clear', movementIntervals, 'left');

  const winner = getRoundWinner(battleInfo);

  winner === 'player'
    ? battleInfo.firstFighter.changeSprite('idle')
    : battleInfo.secondFighter.changeSprite('idle');

  // check if match ended
  let hasMatchWinner = false;
  let firstFighterRoundsWon = 0;
  let secondFighterRoundsWon = 0;

  for (const winner in battleInfo.winners) {
    battleInfo.winners[winner] === battleInfo.firstFighter.getName() &&
      firstFighterRoundsWon++;
    battleInfo.winners[winner] === battleInfo.secondFighter.getName() &&
      secondFighterRoundsWon++;
  }

  // add winner hud
  const fighterRoundHud = document.querySelector(
    `#hud .hud_fighter-${winner === 'player' ? '1' : '2'}_round-count_${
      winner === 'player' ? firstFighterRoundsWon : secondFighterRoundsWon
    }`
  );
  setTimeout(() => (fighterRoundHud.style.backgroundColor = '#FFFFFF'), 2000);

  console.log(battleInfo.winners);

  if (firstFighterRoundsWon === 2 || secondFighterRoundsWon === 2) {
    hasMatchWinner = true;
  }

  // remove time pulsing
  battleInfo.countdownDOM.classList.remove('hud_time-pulsing');

  // restart round variables
  if (!hasMatchWinner) {
    restartRound(battleInfo);
  } else {
    // remove special bar pulse if battle end
    setTimeout(() => {
      battleInfo.firstFighterSpecialBar.parentElement.classList.remove(
        'special-bar_charged'
      );
      battleInfo.secondFighterSpecialBar.parentElement.classList.remove(
        'special-bar_charged'
      );
    }, 300);
    console.log('Battle end');

    if (firstFighterRoundsWon == 2) {
      // player won match, go to the next level
      if (battleInfo.matchInfo.number !== 4) {
        // change stage
        battleInfo.stage.last = battleInfo.stage.actual;
        switch (battleInfo.matchInfo.number) {
          case 1: {
            battleInfo.stage.actual = 'red';
            break;
          }
          case 2: {
            battleInfo.stage.actual = 'green';
            break;
          }
          case 3: {
            battleInfo.stage.actual = 'blue';
            break;
          }
        }

        changeMatch('won', battleInfo);
      } else {
        console.log('player defeated boss');

        // defeat boss animation
        battleInfo.stage.actual = 'final';
      }
    } else {
      // player lost match, restart from first level
      changeMatch('lost', battleInfo);
    }
  }
}
