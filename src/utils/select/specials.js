import { SpecialAttack } from '../../entities/SpecialAttack.js';
import { select_fighters } from './fighters.js';
import { specials_frames } from '../../constants/specials.frames.js';

export const select_specials = [
  new SpecialAttack({
    fighter: select_fighters[0],
    src: `../assets/specials/${select_fighters[0].getSpecial()}/001.png`,
    scale: specials_frames[select_fighters[0].getSpecial()].scale,
    framesMax: 10,
    offset:
      specials_frames[select_fighters[0].getSpecial()].offset[
        select_fighters[0].getDirection()
      ],
    isSelect: true,
    position: {
      x: select_fighters[0].getPositionX() + 20,
      y: 415,
    },
  }),
  new SpecialAttack({
    fighter: select_fighters[1],
    src: `../assets/specials/${select_fighters[1].getSpecial()}/001.png`,
    scale: specials_frames[select_fighters[1].getSpecial()].scale,
    framesMax: 10,
    offset:
      specials_frames[select_fighters[1].getSpecial()].offset[
        select_fighters[1].getDirection()
      ],
    isSelect: true,
    position: {
      x: select_fighters[1].getPositionX() + 20,
      y: 415,
    },
  }),
  new SpecialAttack({
    fighter: select_fighters[2],
    src: `../assets/specials/${select_fighters[2].getSpecial()}/001.png`,
    scale: specials_frames[select_fighters[2].getSpecial()].scale,
    framesMax: 10,
    offset:
      specials_frames[select_fighters[2].getSpecial()].offset[
        select_fighters[2].getDirection()
      ],
    isSelect: true,
    position: {
      x: select_fighters[2].getPositionX() + 20,
      y: 415,
    },
  }),
  new SpecialAttack({
    fighter: select_fighters[3],
    src: `../assets/specials/${select_fighters[3].getSpecial()}/001.png`,
    scale: specials_frames[select_fighters[3].getSpecial()].scale,
    framesMax: 10,
    offset:
      specials_frames[select_fighters[3].getSpecial()].offset[
        select_fighters[3].getDirection()
      ],
    isSelect: true,
    position: {
      x: select_fighters[3].getPositionX() + 20,
      y: 415,
    },
  }),
];
