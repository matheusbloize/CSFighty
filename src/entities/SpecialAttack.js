import { Sprite } from './Sprite.js';

export class SpecialAttack extends Sprite {
  #fighter;
  #velocity = 2;
  #width = 30;
  #height = 30;
  #direction;

  constructor({ fighter, src, scale, framesMax, framesActual, offset }) {
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
      framesActual,
      offset,
      name: 'special',
      special: fighter.getSpecial(),
      fighterDirection: fighter.getDirection(),
    });
    this.#fighter = fighter;
    this.#direction = this.#fighter.getDirection();
  }

  update(ctx) {
    this.draw(ctx);
    this.animateFrames();

    if (this.#direction > 0) {
      this.setPositionX(this.getPositionX() + this.#velocity * 2);
    } else {
      this.setPositionX(this.getPositionX() - this.#velocity * 2);
    }
  }

  resetPosition() {
    this.setPositionX(this.#fighter.getPositionX());
  }

  getFighter() {
    return this.#fighter;
  }

  getWidth() {
    return this.#width;
  }

  getHeight() {
    return this.#height;
  }
}
