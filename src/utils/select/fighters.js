import { Fighter } from '../../entities/Fighter.js';
import { fighters_frames } from '../../constants/fighters_frames.js';

export const select_fighters = [
  new Fighter({
    spriteInfo: fighters_frames.warrior,
    position: { x: 290, y: 300 },
    width: 100,
    height: 100,
    differenceSpace: 205,
    fighterDirection: 1,
    role: 'select',
    special: 'fire',
  }),
  new Fighter({
    spriteInfo: fighters_frames.rogue,
    position: { x: 420, y: 300 },
    width: 100,
    height: 100,
    differenceSpace: 205,
    fighterDirection: 1,
    role: 'select',
    special: 'water',
  }),
  new Fighter({
    spriteInfo: fighters_frames.ninja,
    position: { x: 550, y: 300 },
    width: 100,
    height: 100,
    differenceSpace: 205,
    fighterDirection: 1,
    role: 'select',
    special: 'earth',
  }),
  new Fighter({
    spriteInfo: fighters_frames.samurai,
    position: { x: 680, y: 300 },
    width: 100,
    height: 100,
    differenceSpace: 205,
    fighterDirection: 1,
    role: 'select',
    special: 'air',
  }),
];
