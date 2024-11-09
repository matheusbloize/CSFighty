import { manageInterval } from './manageInterval.js';
import { battleReset } from './battleReset.js';
import { movementActionsIntervals } from '../enemy/movementActionsIntervals.js';
import { enemyLevel, fearMeter, movementIntervals } from '../../states/enemy.js';
import { getRoundWinner } from './getRoundWinner.js';
import { getNewEnemy } from './getNewEnemy.js';
import { getNewSpecial } from './getNewSpecial.js';
import { entities, references } from '../game/startGame.js';
import { Fighter } from '../../entities/Fighter.js';
import { fighters_frames } from '../../constants/fighters_frames.js';
import { soundtrack } from '../../utils/game/objects.js';
import { isPlaying } from '../soundtrack/isPlaying.js';

function restartRound(battleInfo, status) {
  // restart round time
  battleInfo.matchInfo.duration = 99;

  references.dialogue = {
    active: false,
  };

  // set countdown interval and fighters health and block bars style after 2 seconds
  setTimeout(() => {
    manageInterval('set', battleInfo.intervals, 'countdown', 1000);
    battleInfo.firstFighterHealthBar.style.width = '100%';
    battleInfo.secondFighterHealthBar.style.width = '100%';
    battleInfo.firstFighterHealthBar.style.border = '2px solid';
    battleInfo.secondFighterHealthBar.style.border = '2px solid';
    battleInfo.firstFighterBlockBar.style.width = '100%';
    battleInfo.secondFighterBlockBar.style.width = '100%';
  }, 2000);

  // start round and set special bar interval after 3 seconds
  setTimeout(() => {
    manageInterval('set', battleInfo.intervals, 'bars', 100);
    // reset enemy fear meter
    fearMeter.value = 50;

    battleReset(battleInfo);

    if (status) {
      // change enemy fighter
      const enemy =
        status === 'won'
          ? getNewEnemy(battleInfo.secondFighter.getName())
          : getNewEnemy(battleInfo.firstFighter.getName(), true);
      const special = getNewSpecial(enemy);
      entities[1] = new Fighter({
        spriteInfo: fighters_frames[enemy],
        position: {
          x:
            battleInfo.ctx.canvas.width - battleInfo.widthSpace - battleInfo.defaultWidth,
          y: battleInfo.floorPositionY,
        },
        width: battleInfo.defaultWidth,
        height: battleInfo.defaultHeight,
        differenceSpace: battleInfo.differenceSpace,
        special,
        fighterDirection: -1,
        role: 'enemy',
      });
      references.secondFighter = entities[1];
      document.querySelector('#hud .hud_fighter-2_name').innerHTML =
        entities[1].getName();

      soundtrack.actual.pause();
      switch (battleInfo.matchInfo.number) {
        case 2: {
          soundtrack.actual = document.querySelector('#soundtrack_second_enemy');
          break;
        }
        case 3: {
          soundtrack.actual = document.querySelector('#soundtrack_third_enemy');
          break;
        }
        case 4: {
          soundtrack.actual = document.querySelector('#soundtrack_boss');
          break;
        }
      }
      if (!isPlaying()) {
        soundtrack.actual.play();
      }
    }

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

    restartRound(battleInfo, status);
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

  if (winner === 'player') {
    references.firstFighter.changeSprite('pose');
  } else {
    references.secondFighter.changeSprite('pose');
  }

  // check if match ended
  let hasMatchWinner = false;
  let firstFighterRoundsWon = 0;
  let secondFighterRoundsWon = 0;

  for (const winner in references.winners) {
    references.winners[winner] === references.firstFighter.getRole() &&
      firstFighterRoundsWon++;
    references.winners[winner] === references.secondFighter.getRole() &&
      secondFighterRoundsWon++;
  }

  if (firstFighterRoundsWon === 2 || secondFighterRoundsWon === 2) {
    hasMatchWinner = true;
  }

  // add winner hud
  const fighterRoundHud = document.querySelector(
    `#hud .hud_fighter-${winner === 'player' ? '1' : '2'}_round-count_${
      winner === 'player' ? firstFighterRoundsWon : secondFighterRoundsWon
    }`
  );
  setTimeout(() => (fighterRoundHud.style.backgroundColor = '#FFFFFF'), 2000);

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

    references.dialogue = {
      active: true,
      winner,
    };

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
        soundtrack.actual.pause();
        soundtrack.actual = document.querySelector('#soundtrack_credits');
        if (!isPlaying()) {
          soundtrack.actual.play();
        }

        // defeat boss animation
        battleInfo.stage.actual = 'final';
      }
    } else {
      // player lost match, restart from first level
      changeMatch('lost', battleInfo);
    }
  }
}
