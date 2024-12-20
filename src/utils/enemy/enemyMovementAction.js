import { fearMeter, movementActions, movementIntervals } from '../../states/enemy.js';
import { movementActionsIntervals } from './movementActionsIntervals.js';
import { references as battleInfo } from '../game/startGame.js';

let oldDirection = null;

export function enemyMovementAction() {
  const player = battleInfo.firstFighter;
  const randomMovementValue = Math.floor(
    Math.random() * (fearMeter.max - fearMeter.min + 1) + fearMeter.min
  );
  let direction = player.getDirection();
  let movementAction;

  // check fear meter to change behavior
  if (fearMeter.value > 0 && fearMeter.value <= 70) {
    // agressive movement
    if (
      (oldDirection !== null && oldDirection !== direction) ||
      (movementActions.left[0] === 0 &&
        movementActions.left[1] !== 80 &&
        movementActions.left[0] === 0 &&
        movementActions.left[1] !== 20)
    ) {
      if (direction > 0) {
        movementActions.left = [0, 80];
        movementActions.right = [80, 100];
        oldDirection = direction;
      } else {
        movementActions.left = [0, 20];
        movementActions.right = [20, 100];
        oldDirection = direction;
      }
    }
  } else if (fearMeter.value > 70 && fearMeter.value <= 100) {
    // careful movement
    if (
      (oldDirection !== null && oldDirection !== direction) ||
      (movementActions.left[0] === 0 &&
        movementActions.left[1] !== 40 &&
        movementActions.left[0] === 0 &&
        movementActions.left[1] !== 60)
    ) {
      if (direction > 0) {
        movementActions.left = [0, 40];
        movementActions.right = [40, 100];
        oldDirection = direction;
      } else {
        movementActions.left = [0, 60];
        movementActions.right = [60, 100];
        oldDirection = direction;
      }
    }
  } else {
    // fear meter value === 0 -> player doesn't have block bar enable
    if (fearMeter.value === 0) {
      if (
        (oldDirection !== null && oldDirection !== direction) ||
        (movementActions.left[0] === 0 &&
          movementActions.left[1] !== 100 &&
          movementActions.left[0] === 0 &&
          movementActions.left[1] !== 0)
      ) {
        if (direction > 0) {
          movementActions.left = [0, 100];
          movementActions.right = [0, 0];
          oldDirection = direction;
        } else {
          movementActions.left = [0, 0];
          movementActions.right = [0, 100];
          oldDirection = direction;
        }
      }
    }
  }

  // random jump
  let randomJumpValue =
    battleInfo.matchInfo.duration < 98 && Math.floor(Math.random() * (10 - 1 + 1) + 1);

  // choose action according to movement percentage
  if (
    randomMovementValue >= movementActions.left[0] &&
    randomMovementValue < movementActions.left[1]
  ) {
    movementAction = 0;
  } else {
    movementAction = 1;
  }

  // perform action
  switch (movementAction) {
    case 0: {
      movementActionsIntervals(
        'set',
        movementIntervals,
        'left',
        battleInfo,
        10,
        randomJumpValue > 8 ? true : false
      );
      break;
    }
    case 1: {
      movementActionsIntervals(
        'set',
        movementIntervals,
        'right',
        battleInfo,
        10,
        randomJumpValue > 8 ? true : false
      );
      break;
    }
  }
}
