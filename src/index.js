import { Fighter } from './entities/Fighter.js';
import { SpecialAttack } from './entities/SpecialAttack.js';
import { finishRound } from './utils/finishRound.js';
import { isFighterCollidingAttack } from './utils/isFighterCollidingAttack.js';
import { isFighterCollidingBorder } from './utils/isFighterCollidingBorder.js';
import { manageInterval } from './utils/manageInterval.js';
import { specialAttackHitOpponent } from './utils/specialAttackHitOpponent.js';
import { specialReset } from './utils/specialReset.js';

const canvas = document.querySelector('canvas');
const ctx = canvas.getContext('2d');
const defaultWidth = 50;
const defaultHeight = 100;
const widthSpace = 40;
const differenceSpace = 32;
const entities = [
  new Fighter(
    'player',
    { x: widthSpace, y: canvas.height - defaultHeight - differenceSpace },
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
      y: canvas.height - defaultHeight - differenceSpace,
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

function animate() {
  requestAnimationFrame(animate);
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  for (const entity of entities) {
    if (!actualRound.finished) {
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
            if (entities[1].life - damageSpec.attack >= 0) {
              entities[1].life -= damageSpec.attack;
              secondFighterHealthBar.style.width = `${
                Number(secondFighterHealthBar.style.width.split('%')[0]) -
                damageSpec.attack
              }%`;
              if (entities[1].life == 0) {
                setTimeout(() => {
                  secondFighterHealthBar.style.border = 'none';
                }, 400);
                actualRound.finished = true;
                finishRound({
                  firstFighter: entities[0],
                  secondFighter: entities[1],
                  time: matchTime,
                  ctx,
                  actualRound,
                  healthBar: {
                    firstFighter: firstFighterHealthBar,
                    secondFighter: secondFighterHealthBar,
                  },
                  specialBar: {
                    firstFighter: firstFighterSpecialBar,
                    secondFighter: secondFighterSpecialBar,
                  },
                  intervals,
                  references,
                  winners,
                });
              }
            } else {
              if (secondFighterHealthBar.style.border != 'none') {
                setTimeout(() => {
                  secondFighterHealthBar.style.border = 'none';
                }, 400);
                actualRound.finished = true;
                finishRound({
                  firstFighter: entities[0],
                  secondFighter: entities[1],
                  time: matchTime,
                  ctx,
                  actualRound,
                  healthBar: {
                    firstFighter: firstFighterHealthBar,
                    secondFighter: secondFighterHealthBar,
                  },
                  specialBar: {
                    firstFighter: firstFighterSpecialBar,
                    secondFighter: secondFighterSpecialBar,
                  },
                  intervals,
                  references,
                  winners,
                });
              }
            }
            // increase special bar
            if (entity.specialBar + damageSpec.attack < entity.specialBarLimit) {
              setTimeout(() => (entity.specialBar += damageSpec.attack), 0);
            } else {
              const fillSpecialBar = entity.specialBarLimit - entity.specialBar;
              setTimeout(() => (entity.specialBar += fillSpecialBar), 0);
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
      if (special.x + special.width >= canvas.width) {
        setTimeout(() => {
          specialReset(special, specialAttacks, index);
        }, 0);
      }

      if (specialAttackHitOpponent(special, entities[1])) {
        if (entities[1].life - damageSpec.special >= 0) {
          entities[1].life -= damageSpec.special;
          secondFighterHealthBar.style.width = `${
            Number(secondFighterHealthBar.style.width.split('%')[0]) - damageSpec.special
          }%`;
          if (entities[1].life === 0) {
            setTimeout(() => {
              secondFighterHealthBar.style.border = 'none';
            }, 400);
            actualRound.finished = true;
            finishRound({
              firstFighter: entities[0],
              secondFighter: entities[1],
              time: matchTime,
              ctx,
              actualRound,
              healthBar: {
                firstFighter: firstFighterHealthBar,
                secondFighter: secondFighterHealthBar,
              },
              specialBar: {
                firstFighter: firstFighterSpecialBar,
                secondFighter: secondFighterSpecialBar,
              },
              intervals,
              references,
              winners,
            });
          }
        } else {
          entities[1].life = 0;
          secondFighterHealthBar.style.width = `${entities[1].life}%`;
          setTimeout(() => {
            secondFighterHealthBar.style.border = 'none';
          }, 400);
          actualRound.finished = true;
          finishRound({
            firstFighter: entities[0],
            secondFighter: entities[1],
            time: matchTime,
            ctx,
            actualRound,
            healthBar: {
              firstFighter: firstFighterHealthBar,
              secondFighter: secondFighterHealthBar,
            },
            specialBar: {
              firstFighter: firstFighterSpecialBar,
              secondFighter: secondFighterSpecialBar,
            },
            intervals,
            references,
            winners,
          });
        }
        entities[0].specialBar += 20;
        setTimeout(() => {
          specialReset(special, specialAttacks, index);
        }, 0);
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
    20
  );
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
