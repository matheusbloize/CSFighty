import { finishRound } from '../round/finishRound.js';
import { increaseSpecialBar } from '../round/increaseSpecialBar.js';
import { attackCollision } from '../collision/attackCollision.js';
import { undoBlock } from '../block/undoBlock.js';
import { fearMeter } from '../../states/enemy.js';

function defeatOpponent(ui, actualRound, references) {
  setTimeout(() => {
    ui.style.border = 'none';
  }, 400);
  actualRound.finished = true;
  finishRound({
    ...references,
  });
}

export function basicAttack(actualFighter, opponent, ui, references) {
  if (actualFighter.isBlocking) {
    undoBlock(actualFighter, references.firstFighterBlockBar);
  }

  actualFighter.attack(references.ctx);
  if (attackCollision(actualFighter.attackBox, opponent)) {
    if (references.matchTime.duration === 98) {
      // prevent battle action bug
      return;
    }
    // check if opponent is blocking
    if (opponent.isBlocking) {
      return opponent.removeBlock();
    }

    // apply damage
    if (opponent.life - references.damageSpec.attack >= 0) {
      opponent.life -= references.damageSpec.attack;
      ui.style.width = `${
        Number(ui.style.width.split('%')[0]) - references.damageSpec.attack
      }%`;
      if (opponent.life == 0) {
        console.log(`${opponent.name} defeated`);
        defeatOpponent(ui, references.actualRound, references);
      }
    } else {
      if (ui.style.border != 'none') {
        console.log(`${opponent.name} defeated`);
        defeatOpponent(ui, references.actualRound, references);
      }
    }

    // change enemy fear meter
    if (opponent.name === 'enemy' && fearMeter.value + 10 <= fearMeter.max) {
      fearMeter.value += 10;
    } else if (opponent.name === 'player' && fearMeter.value - 10 >= fearMeter.min) {
      fearMeter.value -= 10;
    }

    increaseSpecialBar(actualFighter, 20);
    increaseSpecialBar(opponent, 20);
  }
}
