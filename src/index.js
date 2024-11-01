import { SpecialAttack } from './entities/SpecialAttack.js';
import { attackCollision } from './utils/collision/attackCollision.js';
import { basicAttack } from './utils/attack/basicAttack.js';
import { enemyMovementAction } from './utils/enemy/enemyMovementAction.js';
import { isFighterCollidingBorder } from './utils/collision/isFighterCollidingBorder.js';
import { specialAttack } from './utils/attack/specialAttack.js';
import { specialReset } from './utils/attack/specialReset.js';
import { undoBlock } from './utils/block/undoBlock.js';
import { enemyLevel, movementIntervals } from './states/enemy.js';
import { movementActionsIntervals } from './utils/enemy/movementActionsIntervals.js';
import { enemyBattleAction } from './utils/enemy/enemyBattleAction.js';
import { specials_frames } from './constants/specials.frames.js';
import { spriteAnimations } from './states/sprites.js';
import { gameInterfaces } from './states/game.js';
import { gameHTML } from './pages/game.js';
import { startGame, references, entities } from './utils/game/startGame.js';
import { matchInfo, actualRound, stage, soundtrack } from './utils/game/objects.js';

const canvas = document.querySelector('canvas');
const ctx = canvas.getContext('2d');
const contentElement = document.querySelector('main');
const keys = {
  w: {
    pressed: false,
  },
  a: {
    pressed: false,
  },
  d: {
    pressed: false,
  },
  space: {
    pressed: false,
  },
  r: {
    pressed: false,
  },
  s: {
    pressed: false,
  },
};
const stageBackground = new Image();

let lastKey;
let attackCooldown = {
  active: true,
  time: 450,
};
let blockCooldown = {
  active: true,
  time: 800,
};
let enemyCooldown = {
  active: true,
  time: 500,
};
let gameStarted = false;

ctx.font = '16px Verdana';

setTimeout(() => (gameInterfaces.actual = 'game'), 1500);

function animate() {
  requestAnimationFrame(animate);
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  if (gameInterfaces.actual === 'game') {
    if (!gameStarted) {
      contentElement.innerHTML = gameHTML;
      startGame(ctx);
      gameStarted = true;
    }
    if (stage.last !== stage.actual) {
      stageBackground.src = `../assets/stages/stage_${stage.actual}.webp`;
    }
    ctx.drawImage(stageBackground, 0, 0, canvas.width, canvas.height);

    for (const entity of entities) {
      if (!actualRound.finished) {
        // player loop
        if (entity.getRole() === 'player') {
          // check/change directions
          if (
            entity.getPositionX() + entity.getWidth() >
            entities[1].getPositionX() + entities[1].getWidth()
          ) {
            if (entity.getDirection() == 1) {
              entity.changeDirection('left');
              entities[1].changeDirection('right');
            }
          } else {
            if (entity.getDirection() !== 1) {
              entity.changeDirection('right');
              entities[1].changeDirection('left');
            }
          }

          // check animations and reset sprite to idle
          if (
            !spriteAnimations.run.active &&
            !spriteAnimations.jump.active &&
            !spriteAnimations.fall.active &&
            !spriteAnimations.attack_basic.active &&
            !spriteAnimations.attack_special.active &&
            entity.getActualSprite() !== 'idle' &&
            entity.getPositionY() === references.floorPositionY &&
            !keys.d.pressed &&
            !keys.a.pressed &&
            entity.getActualSprite() !== 'hit'
          ) {
            console.log('can go idle');
            entity.changeSprite('idle');
          }

          // check for changes when left and right keys are clicked
          if (entity.getDirection() > 0) {
            if (
              keys.d.pressed &&
              lastKey !== 'd' &&
              entity.getActualSprite() !== 'idle' &&
              entity.getActualSprite() !== 'jump' &&
              entity.getActualSprite() !== 'fall' &&
              !spriteAnimations.attack_basic.active &&
              !spriteAnimations.attack_special.active
            ) {
              entity.changeSprite('idle');
            } else if (
              keys.a.pressed &&
              lastKey === 'a' &&
              entity.getActualSprite() !== 'idle' &&
              entity.getPositionY() === references.floorPositionY &&
              !spriteAnimations.attack_basic.active &&
              !spriteAnimations.attack_special.active
            ) {
              entity.changeSprite('idle');
            }
          } else {
            if (
              keys.a.pressed &&
              lastKey !== 'a' &&
              entity.getActualSprite() !== 'idle' &&
              entity.getActualSprite() !== 'jump' &&
              entity.getActualSprite() !== 'fall' &&
              !spriteAnimations.attack_basic.active &&
              !spriteAnimations.attack_special.active
            ) {
              entity.changeSprite('idle');
            } else if (
              keys.d.pressed &&
              lastKey === 'd' &&
              entity.getActualSprite() !== 'idle' &&
              entity.getPositionY() === references.floorPositionY &&
              !spriteAnimations.attack_basic.active &&
              !spriteAnimations.attack_special.active
            ) {
              entity.changeSprite('idle');
            }
          }

          // move player
          if (
            keys.w.pressed &&
            entity.getPositionY() === references.floorPositionY &&
            !spriteAnimations.attack_basic.active &&
            !spriteAnimations.attack_special.active
          ) {
            entity.setVelocity(entity.getVelocity() - 25);
            entity.changeSprite('jump');
            spriteAnimations.jump.active = true;
            setTimeout(
              () => (spriteAnimations.jump.active = false),
              spriteAnimations.jump.time
            );
            setTimeout(() => {
              if (
                entity.getActualSprite() !== 'attack_basic' &&
                !spriteAnimations.attack_special.active &&
                !actualRound.finished
              ) {
                // change to fall sprite when hits jump peak (200 ms)
                entity.changeSprite('fall');
                spriteAnimations.fall.active = true;
                setTimeout(() => {
                  // remove sprites on landing
                  spriteAnimations.fall.active = false;
                  spriteAnimations.run.active = false;
                }, spriteAnimations.fall.time);
              }
            }, 200);
          }
          if (keys.space.pressed && attackCooldown.active) {
            keys.space.pressed = false;
            attackCooldown.active = false;
            setTimeout(() => (attackCooldown.active = true), attackCooldown.time);
            basicAttack(
              entity,
              entities[1],
              references.secondFighterHealthBar,
              references
            );
            entity.changeSprite('attack_basic');
            spriteAnimations.attack_basic.active = true;
            setTimeout(() => {
              spriteAnimations.attack_basic.active = false;
            }, spriteAnimations.attack_basic.time);
          }
          if (keys.a.pressed && lastKey === 'a') {
            if (
              !isFighterCollidingBorder(
                entity.getPositionX() - 2,
                entity.getWidth(),
                canvas.width
              )
            ) {
              if (
                !spriteAnimations.attack_basic.active &&
                !spriteAnimations.attack_special.active
              ) {
                entity.setPositionX(entity.getPositionX() - 2);
                if (
                  entity.getDirection() < 0 &&
                  entity.getActualSprite() !== 'run' &&
                  entity.getActualSprite() !== 'jump' &&
                  entity.getPositionY() === references.floorPositionY
                ) {
                  setTimeout(() => entity.changeSprite('run'), 0);
                  spriteAnimations.run.active = true;
                }
              }
            }
          } else if (keys.d.pressed && lastKey === 'd') {
            if (
              !isFighterCollidingBorder(
                entity.getPositionX() + 2,
                entity.getWidth(),
                canvas.width
              )
            ) {
              if (
                !spriteAnimations.attack_basic.active &&
                !spriteAnimations.attack_special.active
              ) {
                entity.setPositionX(entity.getPositionX() + 2);
                if (
                  entity.getDirection() > 0 &&
                  entity.getActualSprite() !== 'run' &&
                  entity.getActualSprite() !== 'jump' &&
                  entity.getPositionY() === references.floorPositionY
                ) {
                  setTimeout(() => entity.changeSprite('run'), 0);
                  spriteAnimations.run.active = true;
                }
              }
            }
          }
          if (keys.r.pressed) {
            keys.r.pressed = false;
            if (entity.isBlocking()) {
              undoBlock(entity, references.firstFighterBlockBar);
            }
            if (
              entity.getSpecialBar() >= entity.getSpecialBarLimit() &&
              !spriteAnimations.attack_basic.active
            ) {
              entity.changeSprite('attack_special');
              spriteAnimations.attack_special.active = true;
              setTimeout(() => {
                references.specialAttacks.push(
                  new SpecialAttack({
                    fighter: entity,
                    src: `../assets/specials/${entity.getSpecial()}/001.png`,
                    scale: specials_frames[entity.getSpecial()].scale,
                    framesMax: 10,
                    offset:
                      specials_frames[entity.getSpecial()].offset[entity.getDirection()],
                  })
                );
              }, 200);
              setTimeout(() => {
                spriteAnimations.attack_special.active = false;
              }, spriteAnimations.attack_special.time);
              entity.setSpecialBar(0);
              references.firstFighterSpecialBar.parentElement.classList.remove(
                'special-bar_charged'
              );
            }
          }
          if (keys.s.pressed && blockCooldown.active) {
            keys.s.pressed = false;
            blockCooldown.active = false;
            setTimeout(() => (blockCooldown.active = true), blockCooldown.time);
            entity.addBlock();
            if (entity.isBlocking()) {
              setTimeout(() => {
                if (entity.isBlocking()) {
                  undoBlock(entity, references.firstFighterBlockBar);
                }
              }, 500);
              references.firstFighterBlockBar.style.backgroundColor = '#333333';
              references.firstFighterBlockBar.parentElement.style.borderColor = '#CCCCCC';
            }
          }
        }

        // enemy loop
        if (enemyCooldown.active) {
          movementActionsIntervals('clear', movementIntervals, 'right');
          movementActionsIntervals('clear', movementIntervals, 'left');
          enemyMovementAction(references);
          enemyBattleAction(references.specialAttacks, references);
          enemyCooldown.active = false;
          setTimeout(() => (enemyCooldown.active = true), enemyCooldown.time);
        }
      }
      entity.update(ctx);
    }

    if (!actualRound.finished) {
      // special attacks loop
      references.specialAttacks.forEach((special, index) => {
        // special attack gets removed from array when crosses canvas or hit opponent
        if (
          special.getPositionX() + special.getWidth() >= canvas.width ||
          special.getPositionX() < 0
        ) {
          setTimeout(() => {
            specialReset(special, references.specialAttacks, index);
          }, 0);
        }

        // block player special attack if enemy level is max
        if (
          enemyLevel.actual === enemyLevel.max &&
          special.getFighter().getRole() === 'player' &&
          entities[1].getBlockBar() === 100 &&
          !entities[1].isBlocking()
        ) {
          entities[1].addBlock();
        }

        if (
          special.getFighter().getRole() === 'player' &&
          attackCollision(special, entities[1])
        ) {
          // check if opponent is not blocking
          if (!entities[1].isBlocking()) {
            specialAttack(
              special,
              special.getFighter(),
              entities[1],
              references.secondFighterHealthBar,
              references,
              references.specialAttacks,
              index
            );
          } else {
            undoBlock(entities[1], references.secondFighterBlockBar);
            setTimeout(() => {
              specialReset(special, references.specialAttacks, index);
            }, 0);
          }
        }
        if (
          special.getFighter().getRole() === 'enemy' &&
          attackCollision(special, entities[0])
        ) {
          // check if opponent is not blocking
          if (!entities[0].isBlocking()) {
            specialAttack(
              special,
              special.getFighter(),
              entities[0],
              references.firstFighterHealthBar,
              references,
              references.specialAttacks,
              index
            );
          } else {
            undoBlock(entities[0], references.firstFighterBlockBar);
            setTimeout(() => {
              specialReset(special, references.specialAttacks, index);
            }, 0);
          }
        }

        special.update(ctx);
      });
    } else {
      references.specialAttacks = [];
    }

    ctx.fillStyle = 'limegreen';
    ctx.fillText(
      `actual match ${matchInfo.number}`,
      canvas.width / 2.25,
      canvas.height / 5
    );
    ctx.fillText(
      `actual round ${actualRound.number}`,
      canvas.width / 2.25,
      canvas.height / 4
    );
    ctx.fillText(
      `actual enemy level ${enemyLevel.actual} ${
        enemyLevel.actual === enemyLevel.max ? 'BOSS' : ''
      }`,
      canvas.width / 2.25,
      canvas.height / 3.25
    );
  } else if (gameInterfaces.actual === 'select') {
    ctx.fillStyle = 'limegreen';
    ctx.fillText(`select`, canvas.width / 2.25, canvas.height / 5);
  } else if (gameInterfaces.actual === 'home') {
    ctx.fillStyle = 'limegreen';
    ctx.fillText(`home`, canvas.width / 2.25, canvas.height / 5);
  }
}

requestAnimationFrame(animate);

document.addEventListener('keydown', ({ repeat, key }) => {
  // check if current soundtrack is playing
  const isPlaying =
    soundtrack.actual.currentTime > 0 &&
    !soundtrack.actual.paused &&
    !soundtrack.actual.ended &&
    soundtrack.actual.readyState > soundtrack.actual.HAVE_CURRENT_DATA;

  if (!isPlaying) {
    soundtrack.actual.play();
  }

  if (gameInterfaces.actual === 'game') {
    // set keys to move player
    if (repeat && key.toLowerCase() === ' ') {
      keys.space.pressed = false;
      return;
    }
    if (repeat && key.toLowerCase() === 'r') {
      keys.r.pressed = false;
      return;
    }
    if (repeat && key.toLowerCase() === 's') {
      keys.s.pressed = false;
      return;
    }
    switch (key.toLowerCase()) {
      case 'w': {
        if (!actualRound.finished) {
          keys.w.pressed = true;
        }
        break;
      }
      case 'a': {
        keys.a.pressed = true;
        lastKey = 'a';
        break;
      }
      case 'd': {
        keys.d.pressed = true;
        lastKey = 'd';
        break;
      }
      case ' ': {
        if (!actualRound.finished) {
          keys.space.pressed = true;
        }
        break;
      }
      case 'r': {
        if (!actualRound.finished) {
          keys.r.pressed = true;
        }
        break;
      }
      case 's': {
        if (!actualRound.finished) {
          keys.s.pressed = true;
        }
        break;
      }
    }
  }
});

document.addEventListener('keyup', ({ key }) => {
  if (gameInterfaces.actual === 'game') {
    switch (key.toLowerCase()) {
      case 'w': {
        keys.w.pressed = false;
        break;
      }
      case 'a': {
        keys.a.pressed = false;
        if (keys.d.pressed) {
          lastKey = 'd';
        } else {
          lastKey = 'a';
        }
        spriteAnimations.run.active = false;
        break;
      }
      case 'd': {
        keys.d.pressed = false;
        if (keys.a.pressed) {
          lastKey = 'a';
        } else {
          lastKey = 'd';
        }
        spriteAnimations.run.active = false;
        break;
      }
      case ' ': {
        keys.space.pressed = false;
        break;
      }
      case 's': {
        keys.s.pressed = false;
        undoBlock(references.firstFighter, references.firstFighterBlockBar);
        break;
      }
    }
  }
});
