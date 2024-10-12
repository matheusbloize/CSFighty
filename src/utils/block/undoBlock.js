import { fearMeter } from '../../states/enemy.js';

let playerLife = null;
export function undoBlock(fighter, ui) {
  fighter.removeBlock();
  ui.parentElement.classList.remove('block-bar_charged');
  ui.style.backgroundColor = '#CCCCCC';
  ui.parentElement.style.borderColor = '#333333';

  // fear meter
  const oldFearMeter = fearMeter.value;

  if (fighter.name === 'player') {
    fearMeter.value = 0;
    playerLife = fighter.life;
  }

  setTimeout(() => {
    if (fearMeter.value === 0 && playerLife === fighter.life) {
      fearMeter.value = oldFearMeter;
    }
  }, 7000);
}
