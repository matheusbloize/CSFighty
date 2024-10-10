import { finishRound } from './finishRound.js';
import { increaseSpecialBar } from './increaseSpecialBar.js';
import { attackCollision } from './attackCollision.js';
import { undoBlock } from './undoBlock.js';

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
    increaseSpecialBar(actualFighter, 20);
    increaseSpecialBar(opponent, 20);
  }
}
