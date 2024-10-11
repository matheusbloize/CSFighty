import { fearMeter, movementActions, movementIntervals } from '../../states/enemy.js';
import { movementActionsIntervals } from './movementActionsIntervals.js';

let oldDirection = null;

export function enemyMovementAction(battleInfo) {
  const player = battleInfo.firstFighter;
  const randomMovementValue = Math.floor(
    Math.random() * (fearMeter.max - fearMeter.min + 1) + fearMeter.min
  );
  let direction = player.direction;
  let movementAction;
  console.log(fearMeter.value);

  // check fear meter to change behavior
  if (fearMeter.value >= 0 && fearMeter.value <= 30) {
    console.log('agressive');
    // agressive movement
    if (
      (oldDirection !== null && oldDirection !== direction) ||
      (movementActions.left[0] === 0 &&
        movementActions.left[1] !== 10 &&
        movementActions.left[0] === 0 &&
        movementActions.left[1] !== 90)
    ) {
      if (direction > 0) {
        movementActions.left = [0, 70];
        movementActions.right = [70, 100];
        oldDirection = direction;
      } else {
        movementActions.left = [0, 30];
        movementActions.right = [30, 100];
        oldDirection = direction;
      }
    }
  } else if (fearMeter.value > 30 && fearMeter.value < 70) {
    // neutral movement
    console.log('neutral');
    if (movementActions.left[0] === 0 && movementActions.left[1] !== 50) {
      console.log('enemy is on neutral movement mode now');
      movementActions.left = [0, 50];
      movementActions.right = [50, 100];
    }
  } else {
    // careful movement
    console.log('careful');
    if (
      (oldDirection !== null && oldDirection !== direction) ||
      (movementActions.left[0] === 0 &&
        movementActions.left[1] !== 10 &&
        movementActions.left[0] === 0 &&
        movementActions.left[1] !== 90)
    ) {
      if (direction > 0) {
        movementActions.left = [0, 30];
        movementActions.right = [30, 100];
        oldDirection = direction;
      } else {
        movementActions.left = [0, 70];
        movementActions.right = [70, 100];
        oldDirection = direction;
      }
    }
  }

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
      console.log('left');
      movementActionsIntervals('set', movementIntervals, 'left', battleInfo, 10);
      break;
    }
    case 1: {
      console.log('right');
      movementActionsIntervals('set', movementIntervals, 'right', battleInfo, 10);
      break;
    }
  }
}
