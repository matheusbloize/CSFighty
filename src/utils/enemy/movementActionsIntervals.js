import { isFighterCollidingBorder } from '../collision/isFighterCollidingBorder.js';
import { movementActions } from '../../states/enemy.js';

const intervalTypes = ['left', 'right'];

function content(type, references, jump) {
  switch (type) {
    case intervalTypes[0]:
      if (
        !isFighterCollidingBorder(
          references.secondFighter.getPositionX() - movementActions.distance,
          references.secondFighter.getWidth(),
          references.ctx.canvas.width
        )
      ) {
        // references.secondFighter.setPositionX(
        //   references.secondFighter.getPositionX() - 2
        // );
        // if (
        //   jump &&
        //   references.secondFighter.getPositionY() === references.floorPositionY &&
        //   references.secondFighter.getVelocity() === 0
        // ) {
        //   references.secondFighter.setVelocity(
        //     references.secondFighter.getVelocity() - 20
        //   );
        // }
      }
      break;
    case intervalTypes[1]:
      if (
        !isFighterCollidingBorder(
          references.secondFighter.getPositionX() + movementActions.distance,
          references.secondFighter.getWidth(),
          references.ctx.canvas.width
        )
      ) {
        // references.secondFighter.setPositionX(
        //   references.secondFighter.getPositionX() + 2
        // );
        // if (
        //   jump &&
        //   references.secondFighter.getPositionY() === references.floorPositionY &&
        //   references.secondFighter.getVelocity() === 0
        // ) {
        //   references.secondFighter.setVelocity(
        //     references.secondFighter.getVelocity() - 20
        //   );
        // }
      }
      break;
    default:
      break;
  }
}

export function movementActionsIntervals(
  action,
  variableId,
  type,
  references,
  time,
  jump
) {
  if (action === 'set') {
    variableId[type] = setInterval(() => content(type, references, jump), time);
  } else {
    clearInterval(variableId[type]);
    variableId[type] = null;
  }
}
