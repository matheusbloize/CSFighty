import { isSfxPlaying } from '../utils/sfx/isSfxPlaying.js';
import { Sprite } from './Sprite.js';

function drawShield(ctx, obj) {
  ctx.lineWidth = 2;
  ctx.strokeStyle = '#FFFAFA';
  ctx.strokeRect(
    obj.getPositionX() +
      15 * obj.getDirection() +
      (obj.getDirection() > 0 ? obj.getWidth() * obj.getDirection() : 0),
    obj.getPositionY() + 5,
    1,
    obj.getHeight() - 10
  );
  ctx.strokeRect(
    obj.getPositionX() +
      15 * obj.getDirection() +
      (obj.getDirection() > 0 ? obj.getWidth() * obj.getDirection() : 0) +
      2 * obj.getDirection(),
    obj.getPositionY() + 10,
    1,
    obj.getHeight() - 20
  );
  ctx.strokeRect(
    obj.getPositionX() +
      15 * obj.getDirection() +
      (obj.getDirection() > 0 ? obj.getWidth() * obj.getDirection() : 0) +
      4 * obj.getDirection(),
    obj.getPositionY() + 15,
    1,
    obj.getHeight() - 30
  );
  ctx.strokeRect(
    obj.getPositionX() +
      15 * obj.getDirection() +
      (obj.getDirection() > 0 ? obj.getWidth() * obj.getDirection() : 0) +
      6 * obj.getDirection(),
    obj.getPositionY() + 20,
    1,
    obj.getHeight() - 40
  );
  ctx.strokeRect(
    obj.getPositionX() +
      15 * obj.getDirection() +
      (obj.getDirection() > 0 ? obj.getWidth() * obj.getDirection() : 0) +
      8 * obj.getDirection(),
    obj.getPositionY() + 25,
    1,
    obj.getHeight() - 50
  );
  ctx.strokeRect(
    obj.getPositionX() +
      15 * obj.getDirection() +
      (obj.getDirection() > 0 ? obj.getWidth() * obj.getDirection() : 0) +
      10 * obj.getDirection(),
    obj.getPositionY() + 30,
    1,
    obj.getHeight() - 60
  );
}

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
    position,
    width,
    height,
    differenceSpace,
    special,
    fighterDirection,
    role,
    spriteInfo,
  }) {
    super({
      position,
      width,
      height,
      src: spriteInfo.src,
      scale: spriteInfo.scale,
      framesMax: spriteInfo.framesMax,
      offset: fighterDirection > 0 ? spriteInfo.offset[-1] : spriteInfo.offset[1],
      name: spriteInfo.name,
      special,
      fighterDirection,
      role,
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
      y: this.getPositionY() + 30,
    };

    if (this.#isBlocking) {
      // print block representation
      drawShield(ctx, this);
    }

    // reduce ninja idle sprite speed
    if (this.getName() === 'ninja') {
      if (this.getActualSprite() === 'idle') {
        if (this.getFramesHold() !== 20) {
          this.setFramesHold(20);
        }
      } else {
        if (this.getFramesHold() !== 10 && this.getActualSprite() !== 'death') {
          this.setFramesHold(10);
        }
      }
    }
  }

  addBlock() {
    if (this.#blockBar === this.#blockBarLimit) {
      this.#isBlocking = true;
      // add block sfx
      const blockSfx = document.querySelector('#sfx_block');
      if (isSfxPlaying(blockSfx)) {
        blockSfx.currentTime = 0;
      }
      blockSfx.play();
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
