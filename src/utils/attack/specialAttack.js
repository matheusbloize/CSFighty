import { specialReset } from './specialReset.js';
import { increaseSpecialBar } from '../round/increaseSpecialBar.js';
import { fearMeter } from '../../states/enemy.js';
import { defeatOpponent } from './defeatOpponent.js';

export function specialAttack(
  special,
  actualFighter,
  opponent,
  ui,
  references,
  specialAttacks,
  index
) {
  // change opponent sprite when get hit
  opponent.changeSprite('hit');

  if (opponent.getLife() - references.damageSpec.special >= 0) {
    opponent.setLife(opponent.getLife() - references.damageSpec.special);
    ui.style.width = `${
      Number(ui.style.width.split('%')[0]) - references.damageSpec.special
    }%`;
    if (opponent.getLife() === 0) {
      defeatOpponent(ui, references.actualRound, references);
    }
  } else {
    opponent.setLife(0);
    ui.style.width = `${opponent.getLife()}%`;
    defeatOpponent(ui, references.actualRound, references);
  }

  // change enemy fear meter
  if (opponent.getName() === 'enemy') {
    if (fearMeter.value + 20 <= fearMeter.max) {
      fearMeter.value += 20;
    } else {
      const fillFearMeter = fearMeter.max - fearMeter.value;
      fearMeter.value += fillFearMeter;
    }
  } else {
    if (fearMeter.value - 20 >= fearMeter.min) {
      fearMeter.value -= 20;
    } else {
      const fillFearMeter = fearMeter.value;
      fearMeter.value -= fillFearMeter;
    }
  }

  increaseSpecialBar(actualFighter, 20);
  increaseSpecialBar(opponent, 20);
  setTimeout(() => {
    specialReset(special, specialAttacks, index);
  }, 0);
}
