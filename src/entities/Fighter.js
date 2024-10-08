export class Fighter {
  constructor(name, position, width, height, velocity, color, differenceSpace) {
    this.name = name;
    this.position = { ...position };
    this.width = width;
    this.height = height;
    this.velocity = velocity;
    this.color = color;
    this.differenceSpace = differenceSpace;
    this.originPositionY = this.position.y;
    this.attackBox = {
      x: this.position.x + this.width,
      y: this.position.y,
      width: 100,
      height: 30,
    };
    this.life = 100;
    this.specialBar = 0;
    this.specialBarLimit = 100;
    this.gravity = 0.45;
    this.friction = 0.9;
    this.direction = 1;
  }

  draw(ctx) {
    ctx.fillStyle = this.color;
    ctx.fillRect(this.position.x, this.position.y, this.width, this.height);
    ctx.fillStyle = 'white';
    if (this.direction > 0) {
      ctx.fillRect(this.position.x + this.width - 10, this.position.y, 10, 10);
    } else {
      ctx.fillRect(this.position.x, this.position.y, 10, 10);
    }

    this.attackBox = {
      ...this.attackBox,
      x:
        this.direction > 0
          ? this.position.x + this.width
          : this.position.x - this.attackBox.width,
      y: this.position.y,
    };
  }

  update(ctx) {
    this.draw(ctx);

    this.velocity += this.gravity;
    this.position.y += this.velocity;
    this.velocity *= this.friction;

    if (this.position.y + this.height + this.differenceSpace > ctx.canvas.height) {
      this.velocity = 0;
      this.position.y = ctx.canvas.height - 100 - this.differenceSpace;
    }
  }

  attack(ctx) {
    ctx.fillStyle = 'limegreen';
    ctx.fillRect(
      this.attackBox.x,
      this.attackBox.y,
      this.attackBox.width,
      this.attackBox.height
    );
  }

  changeDirection(side) {
    if (side === 'left') {
      this.direction = -1;
    } else {
      this.direction = 1;
    }
  }
}
