import { Sprite } from './Sprite.js';

export class SpecialAttack extends Sprite {
  #velocity = 2;

  constructor({ fighter, src, scale, framesMax, offset }) {
    super({
      width: 30,
      height: 30,
      position: {
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
  }

  update(ctx) {
    this.draw(ctx);
    this.animateFrames();

    if (this.getDirection() > 0) {
      this.setPositionX(this.getPositionX() + this.#velocity * 2);
    } else {
      this.setPositionX(this.getPositionX() - this.#velocity * 2);
    }
  }

  resetPosition() {
    this.setPositionX(this.getFighter().getPositionX());
  }
}
