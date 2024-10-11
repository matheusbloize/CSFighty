import { SpecialAttack } from '../../entities/SpecialAttack.js';
import { basicAttack } from '../attack/basicAttack.js';
import { undoBlock } from '../block/undoBlock.js';
import { fearMeter } from '../../states/enemy.js';

export function enemyBattleAction(specialAttacks, battleInfo) {
  const player = battleInfo.firstFighter;
  const randomBattleValue = Math.floor(
    Math.random() * (fearMeter.max - fearMeter.min + 1) + fearMeter.min
  );
  let battleAction;

  // choose action according to player distance or special
  // TODO

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
    case 2: {
      battleInfo.secondFighter.addBlock();
      break;
    }
  }
}
