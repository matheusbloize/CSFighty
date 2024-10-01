import { Fighter } from './entities/Fighter.js';
import { isColliding } from './utils/isColliding.js';

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
};
let lastKey;
let jumpCooldown = {
  active: true,
  time: 200,
};

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
          if (!isColliding(entity.position.x - 2, entity.width, canvas.width)) {
            entity.position.x -= 1;
          }
        } else if (keys.d.pressed && lastKey === 'd') {
          if (!isColliding(entity.position.x + 2, entity.width, canvas.width)) {
            entity.position.x += 1;
          }
        }
      }
      if (keys.a.pressed && lastKey === 'a') {
        if (!isColliding(entity.position.x - 2, entity.width, canvas.width)) {
          entity.position.x -= 2;
        }
      } else if (keys.d.pressed && lastKey === 'd') {
        if (!isColliding(entity.position.x + 2, entity.width, canvas.width)) {
          entity.position.x += 2;
        }
      }
    }

    entity.update(ctx);
  }
}

requestAnimationFrame(animate);

document.addEventListener('keydown', ({ repeat, key }) => {
  if (repeat && key.toLowerCase() === 'w') {
    keys.w.pressed = false;
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
