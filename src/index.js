import { Fighter } from './entities/Fighter.js';
import { SpecialAttack } from './entities/SpecialAttack.js';
import { chargeSpecialBar } from './utils/chargeSpecialBar.js';
import { isFighterCollidingAttack } from './utils/isFighterCollidingAttack.js';
import { isFighterCollidingBorder } from './utils/isFighterCollidingBorder.js';
import { specialAttackHitOpponent } from './utils/specialAttackHitOpponent.js';
import { specialReset } from './utils/specialReset.js';

const canvas = document.querySelector('canvas');
const ctx = canvas.getContext('2d');
const defaultWidth = 50;
const defaultHeight = 100;
const widthSpace = 40;
const entities = [
  new Fighter(
    'player',
    { x: widthSpace, y: canvas.height - defaultHeight },
    defaultWidth,
    defaultHeight,
    1,
    'red'
  ),
  new Fighter(
    'enemy',
    { x: canvas.width - widthSpace - defaultWidth, y: canvas.height - defaultHeight },
    defaultWidth,
    defaultHeight,
    1,
    'blue'
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
const specialAttacks = [];
const damageSpec = {
  attack: 10,
  special: 30,
};

let lastKey;
let jumpCooldown = {
  active: true,
  time: 200,
};
let attackCooldown = {
  active: true,
  time: 100,
};
let specialAttackCooldown = {
  active: true,
  time: 1000,
};
ctx.font = '16px Verdana';

function animate() {
  requestAnimationFrame(animate);
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  for (const entity of entities) {
    // player loop
    if (entity.name == 'player') {
      // move player
      if (keys.w.pressed) {
        entity.position.y -= 10;

        // apply gravity force
        setTimeout(() => (keys.w.pressed = false), jumpCooldown.time);

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
      } else if (keys.space.pressed && attackCooldown.active) {
        entity.attack(ctx);
        setTimeout(() => (keys.space.pressed = false), attackCooldown.time);
        if (
          isFighterCollidingAttack(
            entity.attackBox.x + entity.attackBox.width,
            entities[1].position.x
          )
        ) {
          attackCooldown.active = false;
          setTimeout(() => {
            attackCooldown.active = true;
          }, attackCooldown.time);
          // apply damage
          entities[1].life -= damageSpec.attack;
          // increase special bar
          if (entity.specialBar + damageSpec.attack < entity.specialBarLimit) {
            entity.specialBar += damageSpec.attack;
          } else {
            const fillSpecialBar = entity.specialBarLimit - entity.specialBar;
            entity.specialBar += fillSpecialBar;
          }
        }
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
        }
        setTimeout(() => (keys.r.pressed = false), 0);
      }
    }

    entity.update(ctx);
  }

  // special attacks loop
  specialAttacks.forEach((special, index) => {
    // special attack gets removed from array when crosses canvas or hit opponent
    if (special.x + special.width >= canvas.width) {
      setTimeout(() => {
        specialReset(special, specialAttacks, index);
      }, 0);
    }

    if (specialAttackHitOpponent(special, entities[1])) {
      entities[1].life -= damageSpec.special;
      setTimeout(() => {
        specialReset(special, specialAttacks, index);
      }, 0);
    }

    special.update(ctx);
  });

  // draw players info
  ctx.fillStyle = 'limegreen';
  ctx.fillText(`${entities[0].name} - ${entities[0].life}`, 30, 20 + 16);
  ctx.fillText(`${entities[0].specialBar}`, 30, (20 + 16) * 2);
  ctx.fillText(`${entities[1].name} - ${entities[1].life}`, canvas.width - 130, 20 + 16);
}

// increase special bar by 1 overtime
setInterval(() => chargeSpecialBar(entities[0]), 100);

requestAnimationFrame(animate);

document.addEventListener('keydown', ({ repeat, key }) => {
  if (repeat && key.toLowerCase() === 'w') {
    keys.w.pressed = false;
    return;
  }
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
      if (jumpCooldown.active === true) {
        keys.w.pressed = true;
        jumpCooldown.active = false;
        setTimeout(() => {
          jumpCooldown.active = true;
        }, jumpCooldown.time);
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
      if (attackCooldown.active === true) {
        keys.space.pressed = true;
      }
      break;
    }
    case 'r': {
      if (specialAttackCooldown.active === true) {
        keys.r.pressed = true;
        specialAttackCooldown.active = false;
        setTimeout(() => {
          specialAttackCooldown.active = true;
        }, specialAttackCooldown.time);
      }
      break;
    }
  }
});

document.addEventListener('keyup', ({ key }) => {
  switch (key.toLowerCase()) {
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
  }
});
