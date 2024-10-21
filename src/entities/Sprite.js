export class Sprite {
  #position;
  #width = 50;
  #height = 100;
  #image;
  #scale;
  #framesMax;
  #framesActual;
  #framesElapsed;
  #framesHold;
  #offset;
  #direction = 1;

  constructor({
    position,
    src,
    scale = 1,
    framesMax = 1,
    framesActual = 0,
    framesElapsed = 0,
    framesHold = 10,
    offset = { x: 0, y: 0 },
    name,
  }) {
    this.#position = position;
    this.#image = new Image();
    this.#image.src = src;
    this.#scale = scale;
    this.#framesMax = framesMax;
    this.#framesActual = framesActual;
    this.#framesElapsed = framesElapsed;
    this.#framesHold = framesHold;
    this.#offset = offset;
    this.name = name;
  }

  draw(ctx) {
    ctx.scale(this.#direction, 1);
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
    ctx.setTransform(1, 0, 0, 1, 0, 0);

    // rect visualization
    ctx.fillStyle = '#ff00001f';
    ctx.fillRect(this.#position.x, this.#position.y, this.#width, this.#height);

    ctx.fillStyle = 'white';
    if (this.#direction > 0) {
      ctx.fillRect(this.#position.x + this.#width - 10, this.#position.y, 10, 10);
    } else {
      ctx.fillRect(this.#position.x, this.#position.y, 10, 10);
    }
  }

  animateFrames() {
    this.#framesElapsed++;

    if (this.#framesElapsed % this.#framesHold === 0) {
      if (this.#framesActual < this.#framesMax - 1) {
        this.#framesActual++;
      } else {
        this.#framesActual = 0;
      }
    }
  }

  update(ctx) {
    this.draw(ctx);
    this.animateFrames();
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
}
