import { increaseSpecialBar } from '../round/increaseSpecialBar.js';
import { attackCollision } from '../collision/attackCollision.js';
import { undoBlock } from '../block/undoBlock.js';
import { fearMeter } from '../../states/enemy.js';
import { defeatOpponent } from './defeatOpponent.js';

export function basicAttack(actualFighter, opponent, ui, references) {
  if (actualFighter.isBlocking()) {
    undoBlock(actualFighter, references.firstFighterBlockBar);
  }

  if (attackCollision(actualFighter.getAttackBox(), opponent)) {
    if (references.matchInfo.duration === 98) {
      // prevent battle action bug
      return;
    }
    // check if opponent is blocking
    if (opponent.isBlocking()) {
      return opponent.removeBlock();
    }

    // change opponent sprite when get hit
    opponent.changeSprite('hit');

    // apply damage
    if (opponent.getLife() - references.damageSpec.attack >= 0) {
      opponent.setLife(opponent.getLife() - references.damageSpec.attack);
      ui.style.width = `${
        Number(ui.style.width.split('%')[0]) - references.damageSpec.attack
      }%`;
      if (opponent.getLife() === 0) {
        console.log(`${opponent.getName()} defeated`);
        defeatOpponent(ui, references.actualRound, references);
      }
    } else {
      if (ui.style.border != 'none') {
        console.log(`${opponent.getName()} defeated`);
        defeatOpponent(ui, references.actualRound, references);
      }
    }

    // change enemy fear meter
    if (opponent.getName() === 'enemy' && fearMeter.value + 10 <= fearMeter.max) {
      fearMeter.value += 10;
    } else if (opponent.getName() === 'player' && fearMeter.value - 10 >= fearMeter.min) {
      fearMeter.value -= 10;
    }

    increaseSpecialBar(actualFighter, 20);
    increaseSpecialBar(opponent, 20);
  }
}
