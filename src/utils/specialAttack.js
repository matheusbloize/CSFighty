import { specialReset } from './specialReset.js';
import { finishRound } from './finishRound.js';
import { increaseSpecialBar } from './increaseSpecialBar.js';

function defeatOpponent(ui, actualRound, references) {
  setTimeout(() => {
    ui.style.border = 'none';
  }, 400);
  actualRound.finished = true;
  finishRound({
    ...references,
  });
}

export function specialAttack(
  special,
  actualFighter,
  opponent,
  ui,
  references,
  specialAttacks,
  index
) {
  if (opponent.life - references.damageSpec.special >= 0) {
    opponent.life -= references.damageSpec.special;
    ui.style.width = `${
      Number(ui.style.width.split('%')[0]) - references.damageSpec.special
    }%`;
    if (opponent.life === 0) {
      defeatOpponent(ui, references.actualRound, references);
    }
  } else {
    opponent.life = 0;
    ui.style.width = `${opponent.life}%`;
    defeatOpponent(ui, references.actualRound, references);
  }
  increaseSpecialBar(actualFighter, 20);
  increaseSpecialBar(opponent, 20);
  setTimeout(() => {
    specialReset(special, specialAttacks, index);
  }, 0);
}
