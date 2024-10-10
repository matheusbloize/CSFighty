import { SpecialAttack } from '../../entities/SpecialAttack.js';
import { basicAttack } from '../attack/basicAttack.js';
import { isFighterCollidingBorder } from '../collision/isFighterCollidingBorder.js';

const actions = ['left', 'right', 'jump', 'attack', 'special'];
const sideWalk = 10;

export function enemyAction(specialAttacks, battleInfo) {
  // const action = Math.floor(Math.random() * actions.length);
  const action = 4;

  switch (action) {
    case 0: {
      if (
        !isFighterCollidingBorder(
          battleInfo.secondFighter.position.x - sideWalk,
          battleInfo.secondFighter.width,
          battleInfo.ctx.canvas.width
        )
      ) {
        battleInfo.secondFighter.position.x -= sideWalk;
      }
      break;
    }
    case 1: {
      if (
        !isFighterCollidingBorder(
          battleInfo.secondFighter.position.x + sideWalk,
          battleInfo.secondFighter.width,
          battleInfo.ctx.canvas.width
        )
      ) {
        battleInfo.secondFighter.position.x += sideWalk;
      }
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
    case 4: {
      if (
        battleInfo.secondFighter.specialBar === battleInfo.secondFighter.specialBarLimit
      ) {
        specialAttacks.push(new SpecialAttack(battleInfo.secondFighter));
        battleInfo.secondFighter.specialBar = 0;
        battleInfo.secondFighterSpecialBar.parentElement.classList.remove(
          'special-bar_charged'
        );
      }
      break;
    }
  }
}
