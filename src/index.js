import { Fighter } from './entities/Fighter.js';
import { isFighterCollidingAttack } from './utils/isFighterCollidingAttack.js';
import { isFighterCollidingBorder } from './utils/isFighterCollidingBorder.js';

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
        setTimeout(() => (keys.w.pressed = false), 200);

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
          entities[1].life -= 10;
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
    }

    entity.update(ctx);
  }
  ctx.fillStyle = 'limegreen';
  ctx.fillText(`${entities[0].name} - ${entities[0].life}`, 30, 20 + 16);
  ctx.fillText(`${entities[1].name} - ${entities[1].life}`, canvas.width - 130, 20 + 16);
}

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
