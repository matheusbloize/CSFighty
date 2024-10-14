import { SpecialAttack } from '../../entities/SpecialAttack.js';
import { basicAttack } from '../attack/basicAttack.js';
import { undoBlock } from '../block/undoBlock.js';
import { battleActions, fearMeter } from '../../states/enemy.js';
import { attackCollision } from '../collision/attackCollision.js';

export function enemyBattleAction(specialAttacks, battleInfo) {
  const player = battleInfo.firstFighter;
  const enemy = battleInfo.secondFighter;
  const randomBattleValue = Math.floor(
    Math.random() * (fearMeter.max - fearMeter.min + 1) + fearMeter.min
  );
  let battleAction = null;

  // block player special attack
  if (specialAttacks.length > 0) {
    specialAttacks.forEach((special) => {
      if (special.fighter.name === 'player') {
        if (
          attackCollision(
            {
              x:
                player.direction > 0
                  ? special.x
                  : special.x - battleInfo.ctx.canvas.width,
              y: special.y,
              width: special.width + battleInfo.ctx.canvas.width,
              height: special.height,
            },
            enemy
          )
        ) {
          battleAction = 1;
        }
      }
    });
  }

  if (enemy.specialBar === 100 && player.blockBar !== 100) {
    battleAction = 2;
  }
  if (battleAction === null && attackCollision(enemy.attackBox, player)) {
    if (
      randomBattleValue >= battleActions.attack[0] &&
      randomBattleValue < battleActions.attack[1]
    ) {
      battleAction = 0;
    } else {
      battleAction = 1;
    }
  }

  // perform action
  switch (battleAction) {
    case 0: {
      if (battleInfo.secondFighter.isBlocking) {
        undoBlock(battleInfo.secondFighter, battleInfo.secondFighterBlockBar);
      }
      basicAttack(
        battleInfo.secondFighter,
        battleInfo.firstFighter,
        battleInfo.firstFighterHealthBar,
        battleInfo
      );
      break;
    }
    case 1: {
      battleInfo.secondFighter.addBlock();
      break;
    }
    case 2: {
      if (battleInfo.secondFighter.isBlocking) {
        undoBlock(battleInfo.secondFighter, battleInfo.secondFighterBlockBar);
      }
      if (
        battleInfo.secondFighter.specialBar === battleInfo.secondFighter.specialBarLimit
      ) {
        specialAttacks.push(new SpecialAttack(battleInfo.secondFighter));
        battleInfo.secondFighter.specialBar = 0;
        battleInfo.secondFighterSpecialBar.parentElement.classList.remove(
          'special-bar_charged'
        );
      }
      break;
    }
  }
}
