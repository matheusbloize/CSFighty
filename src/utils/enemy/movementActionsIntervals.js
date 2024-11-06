import { isFighterCollidingBorder } from '../collision/isFighterCollidingBorder.js';
import { movementActions } from '../../states/enemy.js';
import { spriteAnimations } from '../../states/sprites.js';
import { actualRound } from '../game/objects.js';

const intervalTypes = ['left', 'right'];

function enemyJump(enemy, references) {
  enemy.setVelocity(enemy.getVelocity() - 25);
  enemy.changeSprite('jump');
  setTimeout(() => {
    if (
      enemy.getActualSprite() !== 'attack_basic' &&
      enemy.getActualSprite() !== 'attack_special' &&
      enemy.getActualSprite() !== 'hit' &&
      enemy.getActualSprite() !== 'death' &&
      enemy.getActualSprite() !== 'pose' &&
      !references.actualRound.finished
    ) {
      // change to fall sprite when hits jump peak (200 ms)
      enemy.changeSprite('fall');
      setTimeout(() => {
        if (enemy.getActualSprite() !== 'death') {
          enemy.changeSprite('idle');
        }
      }, spriteAnimations.fall.time);
    }
  }, 200);
}

function content(type, references, jump) {
  const enemy = references.secondFighter;
  switch (type) {
    case intervalTypes[0]:
      if (
        !isFighterCollidingBorder(
          enemy.getPositionX() - movementActions.distance,
          enemy.getWidth(),
          references.ctx.canvas.width
        ) &&
        enemy.getActualSprite() !== 'attack_basic' &&
        enemy.getActualSprite() !== 'attack_special' &&
        enemy.getActualSprite() !== 'hit' &&
        enemy.getActualSprite() !== 'death'
      ) {
        enemy.setPositionX(enemy.getPositionX() - 2);
        if (
          enemy.getDirection() < 0 &&
          enemy.getPositionY() === references.floorPositionY
        ) {
          if (enemy.getActualSprite() !== 'run' && !actualRound.finished) {
            setTimeout(() => {
              if (enemy.getActualSprite() !== 'death') {
                enemy.changeSprite('run');
              }
            }, 0);
          }
        } else {
          if (
            enemy.getActualSprite() !== 'idle' &&
            enemy.getActualSprite() !== 'jump' &&
            enemy.getActualSprite() !== 'fall' &&
            enemy.getActualSprite() !== 'hit' &&
            enemy.getActualSprite() !== 'death' &&
            enemy.getActualSprite() !== 'pose'
          ) {
            enemy.changeSprite('idle');
          }
        }
        if (
          jump &&
          enemy.getPositionY() === references.floorPositionY &&
          enemy.getVelocity() === 0
        ) {
          enemyJump(enemy, references);
        }
      }
      break;
    case intervalTypes[1]:
      if (
        !isFighterCollidingBorder(
          enemy.getPositionX() + movementActions.distance,
          enemy.getWidth(),
          references.ctx.canvas.width
        ) &&
        enemy.getActualSprite() !== 'attack_basic' &&
        enemy.getActualSprite() !== 'attack_special' &&
        enemy.getActualSprite() !== 'hit' &&
        enemy.getActualSprite() !== 'death'
      ) {
        enemy.setPositionX(enemy.getPositionX() + 2);
        if (
          enemy.getDirection() > 0 &&
          enemy.getPositionY() === references.floorPositionY
        ) {
          if (enemy.getActualSprite() !== 'run' && !actualRound.finished) {
            setTimeout(() => {
              if (enemy.getActualSprite() !== 'death') {
                enemy.changeSprite('run');
              }
            }, 0);
          }
        } else {
          if (
            enemy.getActualSprite() !== 'idle' &&
            enemy.getActualSprite() !== 'jump' &&
            enemy.getActualSprite() !== 'fall' &&
            enemy.getActualSprite() !== 'hit' &&
            enemy.getActualSprite() !== 'death' &&
            enemy.getActualSprite() !== 'pose'
          ) {
            enemy.changeSprite('idle');
          }
        }
        if (
          jump &&
          enemy.getPositionY() === references.floorPositionY &&
          enemy.getVelocity() === 0
        ) {
          enemyJump(enemy, references);
        }
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
