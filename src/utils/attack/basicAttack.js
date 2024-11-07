import { increaseSpecialBar } from '../round/increaseSpecialBar.js';
import { attackCollision } from '../collision/attackCollision.js';
import { undoBlock } from '../block/undoBlock.js';
import { fearMeter } from '../../states/enemy.js';
import { defeatOpponent } from './defeatOpponent.js';
import { isSfxPlaying } from '../sfx/isSfxPlaying.js';

export function basicAttack(actualFighter, opponent, ui, references) {
  if (actualFighter.isBlocking()) {
    undoBlock(actualFighter, references.firstFighterBlockBar);
  }

  // add sword sfx
  const swordSfx =
    actualFighter.getName() !== 'nightborne'
      ? document.querySelector('#sfx_slash')
      : document.querySelector('#sfx_slash_boss');
  if (isSfxPlaying(swordSfx)) {
    swordSfx.currentTime = 0;
  }
  swordSfx.play();

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

    // get basic attack damage
    const damage =
      actualFighter.getName() !== 'nightborne' ? references.damageSpec.attack : 30;

    // apply damage
    if (opponent.getLife() - damage >= 0) {
      opponent.setLife(opponent.getLife() - damage);
      ui.style.width = `${Number(ui.style.width.split('%')[0]) - damage}%`;
      if (opponent.getLife() === 0) {
        defeatOpponent(ui, references.actualRound, references);
      }
    } else {
      if (ui.style.border != 'none') {
        defeatOpponent(ui, references.actualRound, references);
      }
    }

    // change enemy fear meter
    if (opponent.getRole() === 'enemy' && fearMeter.value + 10 <= fearMeter.max) {
      fearMeter.value += 10;
    } else if (opponent.getRole() === 'player' && fearMeter.value - 10 >= fearMeter.min) {
      fearMeter.value -= 10;
    }

    increaseSpecialBar(actualFighter, 20);
    increaseSpecialBar(opponent, 20);
  }
}
