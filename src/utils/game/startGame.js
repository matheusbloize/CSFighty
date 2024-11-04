import { fighters_frames } from '../../constants/fighters_frames.js';
import { manageInterval } from '../round/manageInterval.js';
import { Fighter } from '../../entities/Fighter.js';
import { matchInfo, actualRound, specialAttacks, stage } from './objects.js';
import { getNewEnemy } from '../round/getNewEnemy.js';
import { getNewSpecial } from '../round/getNewSpecial.js';

export let references;
export let entities;
export function startGame(ctx, fighter, special) {
  const defaultWidth = 50;
  const defaultHeight = 100;
  const widthSpace = 40;
  const differenceSpace = 97;
  const floorPositionY = ctx.canvas.height - defaultHeight - differenceSpace;
  const enemy = getNewEnemy(fighter);
  const enemySpecial = getNewSpecial(enemy);
  entities = [
    new Fighter({
      spriteInfo: fighters_frames[fighter],
      position: { x: widthSpace, y: floorPositionY },
      width: defaultWidth,
      height: defaultHeight,
      differenceSpace,
      special,
      fighterDirection: 1,
      role: 'player',
    }),
    new Fighter({
      spriteInfo: fighters_frames[enemy],
      position: {
        x: ctx.canvas.width - widthSpace - defaultWidth,
        y: floorPositionY,
      },
      width: defaultWidth,
      height: defaultHeight,
      differenceSpace,
      special: enemySpecial,
      fighterDirection: -1,
      role: 'enemy',
    }),
  ];
  const damageSpec = {
    attack: 10,
    special: 30,
  };

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

  let intervals = {
    countdown: null,
    specialBar: null,
  };
  let winners = {
    round1: null,
    round2: null,
    round3: null,
  };

  references = {
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
    defaultWidth,
    defaultHeight,
    widthSpace,
    differenceSpace,
  };
  manageInterval('set', intervals, 'countdown', references, 1000);
  manageInterval('set', intervals, 'bars', references, 100);

  firstFighterHealthBar.style.width = '100%';
  secondFighterHealthBar.style.width = '100%';
  firstFighterSpecialBar.style.width = '0%';
  secondFighterSpecialBar.style.width = '0%';
}
