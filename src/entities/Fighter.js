export class Fighter {
  #name;
  #position;
  #width;
  #height;
  #color;
  #differenceSpace;
  #velocity = 1;
  #attackBox;
  #life = 100;
  #specialBar = 0;
  #specialBarLimit = 100;
  #gravity = 0.45;
  #friction = 0.9;
  #direction = 1;
  #isBlocking = false;
  #blockBar = 100;
  #blockBarLimit = 100;

  constructor(name, position, width, height, color, differenceSpace) {
    this.#name = name;
    this.#position = { ...position };
    this.#width = width;
    this.#height = height;
    this.#color = color;
    this.#differenceSpace = differenceSpace;
    this.#attackBox = {
      x: this.#position.x + this.#width,
      y: this.#position.y,
      width: 100,
      height: 30,
    };
  }

  draw(ctx) {
    ctx.fillStyle = this.#color;
    ctx.fillRect(this.#position.x, this.#position.y, this.#width, this.#height);
    ctx.fillStyle = 'white';
    if (this.#direction > 0) {
      ctx.fillRect(this.#position.x + this.#width - 10, this.#position.y, 10, 10);
    } else {
      ctx.fillRect(this.#position.x, this.#position.y, 10, 10);
    }

    this.#attackBox = {
      ...this.#attackBox,
      x:
        this.#direction > 0
          ? this.#position.x + this.#width
          : this.#position.x - this.#attackBox.width,
      y: this.#position.y,
    };

    if (this.#isBlocking) {
      // print block representation
      ctx.lineWidth = 5;
      ctx.strokeStyle = '#FFFAFA';
      ctx.strokeRect(
        this.#position.x - ctx.lineWidth / 2,
        this.#position.y - ctx.lineWidth / 2,
        this.#width + ctx.lineWidth,
        this.#height + ctx.lineWidth
      );
    }
  }

  update(ctx) {
    this.draw(ctx);

    this.#velocity += this.#gravity;
    this.#position.y += this.#velocity;
    this.#velocity *= this.#friction;

    if (this.#position.y + this.#height + this.#differenceSpace > ctx.canvas.height) {
      this.#velocity = 0;
      this.#position.y = ctx.canvas.height - 100 - this.#differenceSpace;
    }
  }

  attack(ctx) {
    ctx.fillStyle = 'limegreen';
    ctx.fillRect(
      this.#attackBox.x,
      this.#attackBox.y,
      this.#attackBox.width,
      this.#attackBox.height
    );
  }

  changeDirection(side) {
    if (side === 'left') {
      this.#direction = -1;
    } else {
      this.#direction = 1;
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

  getName() {
    return this.#name;
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

  getVelocity() {
    return this.#velocity;
  }

  setVelocity(value) {
    this.#velocity = value;
  }

  getAttackBox() {
    const attackBox = {
      getX: () => this.#attackBox.x,
      getY: () => this.#attackBox.y,
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

  getDirection() {
    return this.#direction;
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
