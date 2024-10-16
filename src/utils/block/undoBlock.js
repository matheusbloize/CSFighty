import { enemyLevel, fearMeter } from '../../states/enemy.js';

let playerLife = null;
export function undoBlock(fighter, ui) {
  fighter.removeBlock();
  ui.parentElement.classList.remove('block-bar_charged');
  ui.style.backgroundColor = '#CCCCCC';
  ui.parentElement.style.borderColor = '#333333';

  // fear meter
  const oldFearMeter = fearMeter.value;

  if (fighter.getName() === 'player' && enemyLevel.actual > enemyLevel.initial) {
    fearMeter.value = 0;
    playerLife = fighter.getLife();
  }

  setTimeout(() => {
    if (fearMeter.value === 0 && playerLife === fighter.getLife()) {
      fearMeter.value = oldFearMeter;
    }
  }, 7000);
}
