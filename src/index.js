import { Fighter } from './entities/Fighter.js';
import { SpecialAttack } from './entities/SpecialAttack.js';
import { attackCollision } from './utils/collision/attackCollision.js';
import { basicAttack } from './utils/attack/basicAttack.js';
import { enemyMovementAction } from './utils/enemy/enemyMovementAction.js';
import { isFighterCollidingBorder } from './utils/collision/isFighterCollidingBorder.js';
import { manageInterval } from './utils/round/manageInterval.js';
import { specialAttack } from './utils/attack/specialAttack.js';
import { specialReset } from './utils/attack/specialReset.js';
import { undoBlock } from './utils/block/undoBlock.js';
import { enemyLevel, movementIntervals } from './states/enemy.js';
import { movementActionsIntervals } from './utils/enemy/movementActionsIntervals.js';
import { enemyBattleAction } from './utils/enemy/enemyBattleAction.js';

const canvas = document.querySelector('canvas');
const ctx = canvas.getContext('2d');
const defaultWidth = 50;
const defaultHeight = 100;
const widthSpace = 40;
const differenceSpace = 97;
const floorPositionY = canvas.height - defaultHeight - differenceSpace;
const entities = [
  new Fighter({
    name: 'player',
    position: { x: widthSpace, y: floorPositionY },
    width: defaultWidth,
    height: defaultHeight,
    src: '../assets/fighters/medieval/idle.png',
    scale: 2.5,
    framesMax: 10,
    differenceSpace,
    offset: { x: 145, y: 120 },
  }),
  new Fighter({
    name: 'enemy',
    position: {
      x: canvas.width - widthSpace - defaultWidth,
      y: floorPositionY,
    },
    width: defaultWidth,
    height: defaultHeight,
    src: '../assets/fighters/medieval/idle.png',
    scale: 2.5,
    framesMax: 10,
    differenceSpace,
    offset: { x: 196, y: 120 },
  }),
];
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
const damageSpec = {
  attack: 10,
  special: 30,
};
const matchTimeDuration = 99;
const countdownDOM = document.querySelector('#hud .hud_time');
const firstFighterHealthBar = document.querySelector(
  '#hud .hud_fighter-1_health-bar_content'
);
const secondFighterHealthBar = document.querySelector(
  '#hud .hud_fighter-2_health-bar_content'
);
const firstFighterSpecialBar = document.querySelector(
  '#special-bar .special-bar_fighter-1_content'
);
const secondFighterSpecialBar = document.querySelector(
  '#special-bar .special-bar_fighter-2_content'
);
document.querySelector('#hud .hud_fighter-1_name').innerHTML = entities[0].getName();
document.querySelector('#hud .hud_fighter-2_name').innerHTML = entities[1].getName();
const firstFighterBlockBar = document.querySelector(
  '#hud .hud_fighter-1_block-bar_content'
);
const secondFighterBlockBar = document.querySelector(
  '#hud .hud_fighter-2_block-bar_content'
);
const stageBackground = new Image();

let lastKey;
let attackCooldown = {
  active: true,
  time: 500,
};
let blockCooldown = {
  active: true,
  time: 800,
};
let enemyCooldown = {
  active: true,
  time: 500,
};
let matchInfo = {
  duration: matchTimeDuration - 1,
  number: 1,
};
let actualRound = {
  number: 1,
  finished: false,
};
let specialAttacks = [];
let intervals = {
  countdown: null,
  specialBar: null,
};
let winners = {
  round1: null,
  round2: null,
  round3: null,
};
let stage = {
  actual: 'default',
  last: '',
};
let spriteAnimations = {
  run: {
    active: false,
  },
  jump: {
    active: false,
    time: 450,
  },
  fall: {
    active: false,
    time: 230,
  },
  attack_basic: {
    active: false,
    time: 300,
  },
  attack_special: {
    active: false,
    time: 100,
  },
};
const references = {
  matchInfo,
  countdownDOM,
  actualRound,
  firstFighter: entities[0],
  secondFighter: entities[1],
  ctx,
  firstFighterHealthBar,
  secondFighterHealthBar,
  firstFighterSpecialBar,
  secondFighterSpecialBar,
  firstFighterBlockBar,
  secondFighterBlockBar,
  intervals,
  winners,
  specialAttacks,
  damageSpec,
  floorPositionY,
  stage,
};

ctx.font = '16px Verdana';
firstFighterHealthBar.style.width = '100%';
secondFighterHealthBar.style.width = '100%';
firstFighterSpecialBar.style.width = '0%';
secondFighterSpecialBar.style.width = '0%';

manageInterval('set', intervals, 'countdown', references, 1000);
manageInterval('set', intervals, 'bars', references, 100);

function animate() {
  requestAnimationFrame(animate);
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  if (stage.last !== stage.actual) {
    stageBackground.src = `../assets/stages/stage_${stage.actual}.webp`;
  }
  ctx.drawImage(stageBackground, 0, 0, canvas.width, canvas.height);

  for (const entity of entities) {
    if (!actualRound.finished) {
      // player loop
      if (entity.getName() === 'player') {
        // check/change directions
        if (
          entity.getPositionX() + entity.getWidth() >
          entities[1].getPositionX() + entities[1].getWidth()
        ) {
          entity.changeDirection('left');
          entities[1].changeDirection('right');
        } else {
          entity.changeDirection('right');
          entities[1].changeDirection('left');
        }

        // check animations and reset sprite to idle
        if (
          !spriteAnimations.run.active &&
          !spriteAnimations.jump.active &&
          !spriteAnimations.fall.active &&
          !spriteAnimations.attack_basic.active &&
          !spriteAnimations.attack_special.active &&
          entity.getActualSprite() !== 'idle' &&
          entity.getPositionY() === floorPositionY &&
          !keys.d.pressed &&
          !keys.a.pressed
        ) {
          console.log('can go idle');
          entity.changeSprite('idle');
        }

        // check for changes when left and right keys are clicked
        if (entity.getDirection() > 0) {
          if (keys.d.pressed && lastKey !== 'd' && entity.getActualSprite() !== 'idle') {
            entity.changeSprite('idle');
          }
          if (keys.a.pressed && lastKey !== 'a' && entity.getActualSprite() !== 'run') {
            entity.changeSprite('run');
          } else if (
            keys.a.pressed &&
            lastKey === 'a' &&
            entity.getActualSprite() !== 'idle' &&
            entity.getPositionY() === floorPositionY &&
            !spriteAnimations.attack_basic.active
          ) {
            entity.changeSprite('idle');
          }
        }

        // move player
        if (keys.w.pressed && entity.getPositionY() === floorPositionY) {
          entity.setVelocity(entity.getVelocity() - 25);
          entity.changeSprite('jump');
          spriteAnimations.jump.active = true;
          setTimeout(
            () => (spriteAnimations.jump.active = false),
            spriteAnimations.jump.time
          );
          setTimeout(() => {
            if (entity.getActualSprite() !== 'attack_basic') {
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
          basicAttack(entity, entities[1], secondFighterHealthBar, references);
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
            if (!spriteAnimations.attack_basic.active) {
              entity.setPositionX(entity.getPositionX() - 2);
              if (
                entity.getDirection() < 0 &&
                entity.getActualSprite() !== 'run' &&
                entity.getActualSprite() !== 'jump' &&
                entity.getPositionY() === floorPositionY
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
            if (!spriteAnimations.attack_basic.active) {
              entity.setPositionX(entity.getPositionX() + 2);
              if (
                entity.getDirection() > 0 &&
                entity.getActualSprite() !== 'run' &&
                entity.getActualSprite() !== 'jump' &&
                entity.getPositionY() === floorPositionY
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
            undoBlock(entity, firstFighterBlockBar);
          }
          if (entity.getSpecialBar() === entity.getSpecialBarLimit()) {
            specialAttacks.push(new SpecialAttack(entity));
            entity.setSpecialBar(0);
            firstFighterSpecialBar.parentElement.classList.remove('special-bar_charged');
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
                undoBlock(entity, firstFighterBlockBar);
              }
            }, 500);
            firstFighterBlockBar.style.backgroundColor = '#333333';
            firstFighterBlockBar.parentElement.style.borderColor = '#CCCCCC';
          }
        }
      }

      // enemy loop
      if (enemyCooldown.active) {
        movementActionsIntervals('clear', movementIntervals, 'right');
        movementActionsIntervals('clear', movementIntervals, 'left');
        enemyMovementAction(references);
        enemyBattleAction(specialAttacks, references);
        enemyCooldown.active = false;
        setTimeout(() => (enemyCooldown.active = true), enemyCooldown.time);
      }
    }
    entity.update(ctx);
  }

  if (!actualRound.finished) {
    // special attacks loop
    specialAttacks.forEach((special, index) => {
      // special attack gets removed from array when crosses canvas or hit opponent
      if (special.getX() + special.getWidth() >= canvas.width || special.getX() < 0) {
        setTimeout(() => {
          specialReset(special, specialAttacks, index);
        }, 0);
      }

      // block player special attack if enemy level is max
      if (
        enemyLevel.actual === enemyLevel.max &&
        special.getFighter().getName() === 'player' &&
        entities[1].getBlockBar() === 100 &&
        !entities[1].isBlocking()
      ) {
        entities[1].addBlock();
      }

      if (
        special.getFighter().getName() === 'player' &&
        attackCollision(special, entities[1])
      ) {
        // check if opponent is not blocking
        if (!entities[1].isBlocking()) {
          specialAttack(
            special,
            special.getFighter(),
            entities[1],
            secondFighterHealthBar,
            references,
            specialAttacks,
            index
          );
        } else {
          undoBlock(entities[1], secondFighterBlockBar);
          setTimeout(() => {
            specialReset(special, specialAttacks, index);
          }, 0);
        }
      }
      if (
        special.getFighter().getName() === 'enemy' &&
        attackCollision(special, entities[0])
      ) {
        // check if opponent is not blocking
        if (!entities[0].isBlocking()) {
          specialAttack(
            special,
            special.getFighter(),
            entities[0],
            firstFighterHealthBar,
            references,
            specialAttacks,
            index
          );
        } else {
          undoBlock(entities[0], firstFighterBlockBar);
          setTimeout(() => {
            specialReset(special, specialAttacks, index);
          }, 0);
        }
      }

      special.update(ctx);
    });
  } else {
    specialAttacks = [];
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
}

requestAnimationFrame(animate);

document.addEventListener('keydown', ({ repeat, key }) => {
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
});

document.addEventListener('keyup', ({ key }) => {
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
      undoBlock(entities[0], firstFighterBlockBar);
      break;
    }
  }
});
