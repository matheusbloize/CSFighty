import { isFighterCollidingBorder } from '../collision/isFighterCollidingBorder.js';
import { movementActions } from '../../states/enemy.js';

const intervalTypes = ['left', 'right'];

function content(type, references) {
  switch (type) {
    case intervalTypes[0]:
      if (
        !isFighterCollidingBorder(
          references.secondFighter.position.x - movementActions.distance,
          references.secondFighter.width,
          references.ctx.canvas.width
        )
      ) {
        references.secondFighter.position.x -= 2;
      }
      break;
    case intervalTypes[1]:
      if (
        !isFighterCollidingBorder(
          references.secondFighter.position.x + movementActions.distance,
          references.secondFighter.width,
          references.ctx.canvas.width
        )
      ) {
        references.secondFighter.position.x += 2;
      }
      break;
    default:
      break;
  }
}

export function movementActionsIntervals(action, variableId, type, references, time) {
  if (action === 'set') {
    variableId[type] = setInterval(() => content(type, references), time);
  } else {
    clearInterval(variableId[type]);
    variableId[type] = null;
  }
}
