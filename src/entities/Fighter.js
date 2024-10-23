import { Sprite } from './Sprite.js';

export class Fighter extends Sprite {
  #differenceSpace;
  #velocity = 1;
  #attackBox;
  #life = 100;
  #specialBar = 0;
  #specialBarLimit = 100;
  #gravity = 0.45;
  #friction = 0.9;
  #isBlocking = false;
  #blockBar = 100;
  #blockBarLimit = 100;

  constructor({
    name,
    position,
    width,
    height,
    src,
    scale,
    framesMax,
    framesActual,
    differenceSpace,
    offset,
    special,
    fighterDirection,
  }) {
    super({
      position,
      width,
      height,
      src,
      scale,
      framesMax,
      framesActual,
      offset,
      name,
      special,
      fighterDirection,
    });
    this.#differenceSpace = differenceSpace;
    this.#attackBox = {
      x: this.getPositionX() + width,
      y: this.getPositionY(),
      width: 115,
      height: 30,
    };
  }

  update(ctx) {
    this.draw(ctx);
    this.animateFrames();

    this.#velocity += this.#gravity;
    this.setPositionY(this.getPositionY() + this.#velocity);
    this.#velocity *= this.#friction;

    if (
      this.getPositionY() + this.getHeight() + this.#differenceSpace >
      ctx.canvas.height
    ) {
      this.#velocity = 0;
      this.setPositionY(ctx.canvas.height - 100 - this.#differenceSpace);
    }

    this.#attackBox = {
      ...this.#attackBox,
      x:
        this.getDirection() > 0
          ? this.getPositionX() + this.getWidth()
          : this.getPositionX() - this.#attackBox.width,
      y: this.getPositionY(),
    };

    if (this.#isBlocking) {
      // print block representation
      ctx.lineWidth = 5;
      ctx.strokeStyle = '#FFFAFA';
      ctx.strokeRect(
        this.getPositionX() - ctx.lineWidth / 2,
        this.getPositionY() - ctx.lineWidth / 2,
        this.getWidth() + ctx.lineWidth,
        this.getHeight() + ctx.lineWidth
      );
    }
  }

  addBlock() {
    if (this.#blockBar === this.#blockBarLimit) {
      this.#isBlocking = true;
    }
  }

  removeBlock() {
    if (this.#isBlocking && this.#blockBar === this.#blockBarLimit) {
      this.#isBlocking = false;
      this.#blockBar = 0;
    }
  }

  getVelocity() {
    return this.#velocity;
  }

  setVelocity(value) {
    this.#velocity = value;
  }

  getAttackBox() {
    const attackBox = {
      getPositionX: () => this.#attackBox.x,
      getPositionY: () => this.#attackBox.y,
      getWidth: () => this.#attackBox.width,
      getHeight: () => this.#attackBox.height,
    };
    return attackBox;
  }

  getLife() {
    return this.#life;
  }

  setLife(value) {
    this.#life = value;
  }

  getSpecialBar() {
    return this.#specialBar;
  }

  setSpecialBar(value) {
    this.#specialBar = value;
  }

  getSpecialBarLimit() {
    return this.#specialBarLimit;
  }

  isBlocking() {
    return this.#isBlocking;
  }

  getBlockBar() {
    return this.#blockBar;
  }

  setBlockBar(value) {
    this.#blockBar = value;
  }

  getBlockBarLimit() {
    return this.#blockBarLimit;
  }
}
