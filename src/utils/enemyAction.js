import { SpecialAttack } from '../entities/SpecialAttack.js';
import { basicAttack } from './basicAttack.js';

const actions = ['left', 'right', 'jump', 'attack', 'special'];

export function enemyAction(battleInfo) {
  const action = Math.floor(Math.random() * actions.length);
  console.log(action);
  switch (action) {
    case 0: {
      battleInfo.secondFighter.position.x -= 10;
      break;
    }
    case 1: {
      battleInfo.secondFighter.position.x += 10;
      break;
    }
    // case 2: {
    //   battleInfo.secondFighter.velocity -= 20;
    //   break;
    // }
    case 3: {
      basicAttack(
        battleInfo.secondFighter,
        battleInfo.firstFighter,
        battleInfo.firstFighterHealthBar,
        battleInfo
      );
      break;
    }
    // case 4: {
    //   if (battleInfo.secondFighter.specialBar === battleInfo.secondFighter.specialBarLimit) {
    //     battleInfo.specialAttacks.push(new SpecialAttack(battleInfo.secondFighter));
    //     battleInfo.secondFighter.specialBar = 0;
    //     battleInfo.secondFighterSpecialBar.parentElement.classList.remove('special-bar_charged');
    //   }
    //   break;
    // }
  }
}
