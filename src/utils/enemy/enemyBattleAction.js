import { SpecialAttack } from '../../entities/SpecialAttack.js';
import { basicAttack } from '../attack/basicAttack.js';
import { undoBlock } from '../block/undoBlock.js';
import { enemyLevel, battleActions, fearMeter } from '../../states/enemy.js';
import { attackCollision } from '../collision/attackCollision.js';

export function enemyBattleAction(specialAttacks, battleInfo) {
  const player = battleInfo.firstFighter;
  const enemy = battleInfo.secondFighter;
  const randomBattleValue = Math.floor(
    Math.random() * (fearMeter.max - fearMeter.min + 1) + fearMeter.min
  );
  let battleAction = null;

  if (enemyLevel.actual === enemyLevel.max) {
    if (
      enemy.getSpecialBar() === 100 &&
      (player.getBlockBar() !== 100 ||
        attackCollision(
          {
            getPositionX: () =>
              player.getDirection() > 0
                ? enemy.getAttackBox().getPositionX() - enemy.getWidth() * 4
                : enemy.getAttackBox().getPositionX() + enemy.getWidth() * 4,
            getPositionY: () => enemy.getAttackBox().getPositionY(),
            getWidth: () => enemy.getAttackBox().getWidth(),
            getHeight: () => enemy.getAttackBox().getHeight(),
          },
          player
        )) &&
      enemy.getPositionY() === player.getPositionY()
    ) {
      battleAction = 2;
    }
  } else {
    if (enemy.getSpecialBar() === 100) {
      battleAction = 2;
    }
  }

  if (battleAction === null && attackCollision(enemy.getAttackBox(), player)) {
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
  // switch (battleAction) {
  //   case 0: {
  //     if (enemy.isBlocking()) {
  //       undoBlock(enemy, battleInfo.secondFighterBlockBar);
  //     }
  //     basicAttack(enemy, player, battleInfo.firstFighterHealthBar, battleInfo);
  //     break;
  //   }
  //   case 1: {
  //     enemy.addBlock();
  //     if (enemyLevel.actual < enemyLevel.max) {
  //       setTimeout(() => {
  //         if (enemy.isBlocking()) {
  //           undoBlock(enemy, battleInfo.secondFighterBlockBar);
  //         }
  //       }, 500);
  //     }
  //     break;
  //   }
  //   case 2: {
  //     if (enemy.isBlocking()) {
  //       undoBlock(enemy, battleInfo.secondFighterBlockBar);
  //     }
  //     if (
  //       enemy.getSpecialBar() === enemy.getSpecialBarLimit() &&
  //       enemy.getAttackBox().getY() === enemy.getPositionY()
  //     ) {
  //       specialAttacks.push(new SpecialAttack(enemy));
  //       enemy.setSpecialBar(0);
  //       battleInfo.secondFighterSpecialBar.parentElement.classList.remove(
  //         'special-bar_charged'
  //       );
  //     }
  //     break;
  //   }
  // }
}
