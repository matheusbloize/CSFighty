import { isFighterCollidingAttack } from './isFighterCollidingAttack.js';
import { finishRound } from './finishRound.js';

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
  actualFighter.attack(references.ctx);
  if (
    isFighterCollidingAttack(
      actualFighter.direction,
      actualFighter.attackBox.x,
      actualFighter.attackBox.width,
      opponent.position.x,
      opponent.width
    )
  ) {
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
        defeatOpponent(ui, actualRound, references);
      }
    }
    // increase actual fighter special bar
    if (
      actualFighter.specialBar + references.damageSpec.attack <
      actualFighter.specialBarLimit
    ) {
      setTimeout(() => (actualFighter.specialBar += references.damageSpec.attack), 0);
    } else {
      const fillSpecialBar = actualFighter.specialBarLimit - actualFighter.specialBar;
      setTimeout(() => (actualFighter.specialBar += fillSpecialBar), 0);
    }
    // increase opponent special bar
    if (opponent.specialBar + references.damageSpec.attack < opponent.specialBarLimit) {
      setTimeout(() => (opponent.specialBar += references.damageSpec.attack), 0);
    } else {
      const fillSpecialBar = opponent.specialBarLimit - opponent.specialBar;
      setTimeout(() => (opponent.specialBar += fillSpecialBar), 0);
    }
  }
}