import { Sprite } from './Sprite.js';

export class SpecialAttack extends Sprite {
  #velocity = 2;

  constructor({ fighter, src, scale, framesMax, offset, isSelect = false, position }) {
    super({
      width: 30,
      height: 30,
      position: position || {
        x:
          fighter.getDirection() > 0
            ? fighter.getPositionX() + fighter.getWidth() + 20
            : fighter.getPositionX() - fighter.getWidth(),
        y: fighter.getPositionY() + 30,
      },
      src,
      scale,
      framesMax,
      offset,
      role: 'special',
      special: fighter.getSpecial(),
      fighterDirection: fighter.getDirection(),
      fighter,
    });
    this.isSelect = isSelect;
  }

  update(ctx) {
    this.draw(ctx);
    this.animateFrames();

    if (!this.isSelect) {
      if (this.getDirection() > 0) {
        this.setPositionX(this.getPositionX() + this.#velocity * 2);
      } else {
        this.setPositionX(this.getPositionX() - this.#velocity * 2);
      }
    }
  }

  resetPosition() {
    this.setPositionX(this.getFighter().getPositionX());
  }
}
