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
import { movementIntervals } from './states/enemy.js';
import { movementActionsIntervals } from './utils/enemy/movementActionsIntervals.js';

const canvas = document.querySelector('canvas');
const ctx = canvas.getContext('2d');
const defaultWidth = 50;
const defaultHeight = 100;
const widthSpace = 40;
const differenceSpace = 32;
const floorPositionY = canvas.height - defaultHeight - differenceSpace;
const entities = [
  new Fighter(
    'player',
    { x: widthSpace, y: floorPositionY },
    defaultWidth,
    defaultHeight,
    'red',
    differenceSpace
  ),
  new Fighter(
    'enemy',
    {
      x: canvas.width - widthSpace - defaultWidth,
      y: floorPositionY,
    },
    defaultWidth,
    defaultHeight,
    'blue',
    differenceSpace
  ),
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
document.querySelector('#hud .hud_fighter-1_name').innerHTML = entities[0].name;
document.querySelector('#hud .hud_fighter-2_name').innerHTML = entities[1].name;
const firstFighterBlockBar = document.querySelector(
  '#hud .hud_fighter-1_block-bar_content'
);
const secondFighterBlockBar = document.querySelector(
  '#hud .hud_fighter-2_block-bar_content'
);

let lastKey;
let attackCooldown = {
  active: true,
  time: 200,
};
let blockCooldown = {
  active: true,
  time: 800,
};
let enemyCooldown = {
  active: true,
  time: 500,
};
let matchTime = {
  duration: matchTimeDuration - 1,
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
const references = {
  matchTime,
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
};

ctx.font = '16px Verdana';
firstFighterHealthBar.style.width = '100%';
secondFighterHealthBar.style.width = '100%';
firstFighterSpecialBar.style.width = '0%';
secondFighterSpecialBar.style.width = '0%';

manageInterval('set', intervals, 'countdown', references, 1000);
manageInterval('set', intervals, 'bars', references, 100);

setInterval(() => {
  if (!actualRound.finished) {
    console.log('enemy attack');
    if (entities[1].isBlocking) {
      undoBlock(entities[1], secondFighterBlockBar);
    }
    basicAttack(entities[1], entities[0], firstFighterHealthBar, references);
  }
}, 1000);

function animate() {
  requestAnimationFrame(animate);
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  for (const entity of entities) {
    if (!actualRound.finished) {
      // player loop
      if (entity.name == 'player') {
        // check/change directions
        if (
          entity.position.x + entity.width >
          entities[1].position.x + entities[1].width
        ) {
          entity.changeDirection('left');
          entities[1].changeDirection('right');
        } else {
          entity.changeDirection('right');
          entities[1].changeDirection('left');
        }

        // move player
        if (keys.w.pressed && entity.position.y == floorPositionY) {
          entity.velocity -= 20;

          // move left or right while jumping
          if (keys.a.pressed && lastKey === 'a') {
            if (
              !isFighterCollidingBorder(entity.position.x - 2, entity.width, canvas.width)
            ) {
              entity.position.x -= 1;
            }
          } else if (keys.d.pressed && lastKey === 'd') {
            if (
              !isFighterCollidingBorder(entity.position.x + 2, entity.width, canvas.width)
            ) {
              entity.position.x += 1;
            }
          }
        }
        if (keys.space.pressed && attackCooldown.active) {
          keys.space.pressed = false;
          attackCooldown.active = false;
          setTimeout(() => (attackCooldown.active = true), attackCooldown.time);
          basicAttack(entity, entities[1], secondFighterHealthBar, references);
        }
        if (keys.a.pressed && lastKey === 'a') {
          if (
            !isFighterCollidingBorder(entity.position.x - 2, entity.width, canvas.width)
          ) {
            entity.position.x -= 2;
          }
        } else if (keys.d.pressed && lastKey === 'd') {
          if (
            !isFighterCollidingBorder(entity.position.x + 2, entity.width, canvas.width)
          ) {
            entity.position.x += 2;
          }
        }
        if (keys.r.pressed) {
          keys.r.pressed = false;
          if (entity.isBlocking) {
            undoBlock(entity, firstFighterBlockBar);
          }
          if (entity.specialBar === entity.specialBarLimit) {
            specialAttacks.push(new SpecialAttack(entity));
            entity.specialBar = 0;
            firstFighterSpecialBar.parentElement.classList.remove('special-bar_charged');
          }
        }
        if (keys.s.pressed && blockCooldown.active) {
          keys.s.pressed = false;
          blockCooldown.active = false;
          setTimeout(() => (blockCooldown.active = true), blockCooldown.time);
          entity.addBlock();
          if (entity.isBlocking) {
            setTimeout(() => {
              if (entity.isBlocking) {
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
      if (special.x + special.width >= canvas.width || special.x < 0) {
        setTimeout(() => {
          specialReset(special, specialAttacks, index);
        }, 0);
      }

      if (special.fighter.name === 'player' && attackCollision(special, entities[1])) {
        // check if opponent is not blocking
        if (!entities[1].isBlocking) {
          specialAttack(
            special,
            special.fighter,
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
      if (special.fighter.name === 'enemy' && attackCollision(special, entities[0])) {
        // check if opponent is not blocking
        if (!entities[0].isBlocking) {
          specialAttack(
            special,
            special.fighter,
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
    `actual round ${actualRound.number}`,
    canvas.width / 2 - differenceSpace - differenceSpace / 2,
    canvas.height / 4
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
      break;
    }
    case 'd': {
      keys.d.pressed = false;
      if (keys.a.pressed) {
        lastKey = 'a';
      } else {
        lastKey = 'd';
      }
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
