import { Fighter } from '../../entities/Fighter.js';
import { fighters_frames } from '../../constants/fighters_frames.js';
import { getEnemies } from './getEnemies.js';

export function getSelectedFighter(fighter) {
  dialogue_characters[0] = new Fighter({
    spriteInfo: fighters_frames[fighter],
    position: { x: 100, y: 400 },
    width: 100,
    height: 100,
    differenceSpace: 105,
    fighterDirection: 1,
    role: 'dialogue',
    special: 'fire',
  });
  const enemies = getEnemies(fighter);
  dialogue_characters[1] = new Fighter({
    spriteInfo: fighters_frames[enemies[0]],
    position: { x: 580, y: 400 },
    width: 100,
    height: 100,
    differenceSpace: 105,
    fighterDirection: -1,
    role: 'dialogue',
    special: 'water',
  });
  dialogue_characters[2] = new Fighter({
    spriteInfo: fighters_frames[enemies[1]],
    position: { x: 680, y: 400 },
    width: 100,
    height: 100,
    differenceSpace: 105,
    fighterDirection: -1,
    role: 'dialogue',
    special: 'earth',
  });
  dialogue_characters[3] = new Fighter({
    spriteInfo: fighters_frames[enemies[2]],
    position: { x: 780, y: 400 },
    width: 100,
    height: 100,
    differenceSpace: 105,
    fighterDirection: -1,
    role: 'dialogue',
    special: 'air',
  });
  dialogue_characters[4] = new Fighter({
    spriteInfo: fighters_frames.nightborne,
    position: { x: 880, y: 400 },
    width: 100,
    height: 100,
    differenceSpace: 105,
    fighterDirection: -1,
    role: 'dialogue',
    special: 'air',
  });

  dialogue_characters.forEach((char) => char.changeSprite('pose'));

  setTimeout(() => {
    dialogue_characters[1].setPositionX(680);
    dialogue_characters[2].setPositionX(780);
    dialogue_characters[3].setPositionX(880);
    dialogue_characters[4].setPositionX(2000);
  }, 8000);
}

export const dialogue_characters = [];
