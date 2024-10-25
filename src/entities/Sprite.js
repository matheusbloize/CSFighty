import { fighters_frames } from '../constants/fighters_frames.js';
import { spriteAnimations } from '../states/sprites.js';

export class Sprite {
  #position;
  #width;
  #height;
  #image;
  #scale;
  #framesMax;
  #framesActual;
  #framesElapsed;
  #framesHold;
  #offset;
  #direction = 1;
  #name;
  #special;
  #fighter;

  constructor({
    position,
    width,
    height,
    src,
    scale = 1,
    framesMax = 1,
    framesActual = 0,
    framesElapsed = 0,
    framesHold = 10,
    offset = { x: 0, y: 0 },
    name,
    special,
    fighterDirection,
    fighter = null,
  }) {
    this.#position = position;
    this.#width = width;
    this.#height = height;
    this.#image = new Image();
    this.#image.src = src;
    this.#scale = scale;
    this.#framesMax = framesMax;
    this.#framesActual = framesActual;
    this.#framesElapsed = framesElapsed;
    this.#framesHold = framesHold;
    this.#offset = offset;
    this.#name = name;
    this.#special = special;
    this.#direction = fighterDirection;
    this.#fighter = fighter;
  }

  draw(ctx) {
    ctx.scale(this.#direction, 1);
    if (this.#name !== 'special') {
      ctx.drawImage(
        this.#image,
        this.#framesActual * (this.#image.width / this.#framesMax),
        0,
        this.#image.width / this.#framesMax,
        this.#image.height,
        Math.floor(this.#position.x * this.#direction) - this.#offset.x,
        this.#position.y - this.#offset.y,
        (this.#image.width / this.#framesMax) * this.#scale,
        this.#image.height * this.#scale
      );
    } else {
      ctx.drawImage(
        this.#image,
        (this.#image.width / this.#framesMax) * 0,
        0,
        this.#image.width,
        this.#image.height,
        Math.floor(this.#position.x * this.#direction) - this.#offset.x,
        this.#position.y - this.#offset.y,
        this.#width * this.#scale,
        this.#height * this.#scale
      );
    }
    ctx.setTransform(1, 0, 0, 1, 0, 0);

    // // rect visualization
    // ctx.fillStyle = this.#name === 'player' ? '#ff0000b2' : '#0000ffb2';
    // ctx.fillRect(this.#position.x, this.#position.y, this.#width, this.#height);

    // ctx.fillStyle = 'white';
    // if (this.#direction > 0) {
    //   ctx.fillRect(this.#position.x + this.#width - 10, this.#position.y, 10, 10);
    // } else {
    //   ctx.fillRect(this.#position.x, this.#position.y, 10, 10);
    // }
  }

  animateFrames() {
    this.#framesElapsed++;

    if (this.#framesElapsed % this.#framesHold === 0) {
      if (this.#name !== 'special') {
        if (this.#framesActual < this.#framesMax - 1) {
          this.#framesActual++;
        } else {
          const actualSpriteSplit = this.#image.src.split('.png')[0].split('/');
          if (actualSpriteSplit[actualSpriteSplit.length - 1] === 'attack_basic') {
            spriteAnimations.attack_basic.active = false;
            this.changeSprite('idle');
          }
          if (actualSpriteSplit[actualSpriteSplit.length - 1] === 'attack_special') {
            this.changeSprite('fall');
          }
          if (actualSpriteSplit[actualSpriteSplit.length - 1] === 'hit') {
            this.changeSprite('idle');
          }
          this.#framesActual = 0;
        }
      } else {
        if (this.#framesActual < this.#framesMax) {
          this.#framesActual++;
          this.#image.src = `../assets/specials/${this.#special}/0${
            this.#framesActual < 10 ? '0' + this.#framesActual : this.#framesActual
          }.png`;
        } else {
          this.#framesActual = 0;
        }
      }
    }
  }

  update(ctx) {
    this.draw(ctx);
    this.animateFrames();
  }

  getActualSprite() {
    const actualSrc = this.#image.src;
    const actualSrcSplit = actualSrc.split('/');
    return actualSrcSplit[actualSrcSplit.length - 1].split('.png')[0];
  }

  changeSprite(action) {
    const actualSrc = this.#image.src;
    const actualSrcSplit = actualSrc.split('/');
    const fighterName = actualSrcSplit[actualSrcSplit.length - 2];

    actualSrcSplit.splice(actualSrcSplit.length - 1, 1, action + '.png');

    this.#image.src = actualSrcSplit.join('/');
    this.setFramesMax(fighters_frames[fighterName][action]);
    this.#framesActual = 0;
  }

  setFramesActual(qtd) {
    this.#framesMax = qtd;
  }

  setFramesMax(qtd) {
    this.#framesMax = qtd;
  }

  changeDirection(side) {
    if (side === 'left') {
      this.#direction = -1;
      this.#offset = { x: 196, y: 120 };
    } else {
      this.#direction = 1;
      this.#offset = { x: 145, y: 120 };
    }
  }

  getDirection() {
    return this.#direction;
  }

  getPositionX() {
    return this.#position.x;
  }

  setPositionX(value) {
    this.#position.x = value;
  }

  getPositionY() {
    return this.#position.y;
  }

  setPositionY(value) {
    this.#position.y = value;
  }

  getWidth() {
    return this.#width;
  }

  getHeight() {
    return this.#height;
  }

  getName() {
    return this.#name;
  }

  getSpecial() {
    return this.#special;
  }

  getFighter() {
    return this.#fighter;
  }

  getImage() {
    return this.#image;
  }

  setFramesHold(value) {
    this.#framesHold = value;
  }
}
