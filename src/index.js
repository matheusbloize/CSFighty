import { Fighter } from './entities/Fighter.js';
import { SpecialAttack } from './entities/SpecialAttack.js';
import { basicAttack } from './utils/basicAttack.js';
import { enemyAction } from './utils/enemyAction.js';
import { isFighterCollidingBorder } from './utils/isFighterCollidingBorder.js';
import { manageInterval } from './utils/manageInterval.js';
import { specialAttack } from './utils/specialAttack.js';
import { specialAttackHitOpponent } from './utils/specialAttackHitOpponent.js';
import { specialReset } from './utils/specialReset.js';

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
    1,
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
    1,
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

let lastKey;
let attackCooldown = {
  active: true,
  time: 200,
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
manageInterval(
  'set',
  intervals,
  'specialBar',
  {
    firstFighter: entities[0],
    secondFighter: entities[1],
    firstFighterSpecialBar,
    secondFighterSpecialBar,
    intervals,
  },
  100
);

setInterval(() => !actualRound.finished && enemyAction(specialAttacks, references), 100);

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
          if (entity.specialBar === entity.specialBarLimit) {
            specialAttacks.push(new SpecialAttack(entity));
            entity.specialBar = 0;
            firstFighterSpecialBar.parentElement.classList.remove('special-bar_charged');
          }
          setTimeout(() => (keys.r.pressed = false), 0);
        }
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

      if (
        special.fighter.name === 'player' &&
        specialAttackHitOpponent(special, entities[1])
      ) {
        specialAttack(
          special,
          special.fighter,
          entities[1],
          secondFighterHealthBar,
          references,
          specialAttacks,
          index
        );
      }
      if (
        special.fighter.name === 'enemy' &&
        specialAttackHitOpponent(special, entities[0])
      ) {
        specialAttack(
          special,
          special.fighter,
          entities[0],
          firstFighterHealthBar,
          references,
          specialAttacks,
          index
        );
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
    canvas.height / 6
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
  }
});
