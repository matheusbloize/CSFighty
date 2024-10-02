export class Fighter {
  constructor(name, position, width, height, velocity, color) {
    this.name = name;
    this.position = { ...position };
    this.width = width;
    this.height = height;
    this.velocity = velocity;
    this.color = color;
    this.originPositionY = this.position.y;
    this.attackBox = {
      x: this.position.x + this.width,
      y: this.position.y,
      width: 100,
      height: 30,
    };
    this.life = 100;
  }

  draw(ctx) {
    ctx.fillStyle = this.color;
    ctx.fillRect(this.position.x, this.position.y, this.width, this.height);
  }

  update(ctx) {
    this.draw(ctx);

    if (this.position.y + this.height < ctx.canvas.height) {
      this.position.y += 10 * 0.5;
    }
  }

  attack(ctx) {
    ctx.fillStyle = 'limegreen';
    this.attackBox = {
      ...this.attackBox,
      x: this.position.x + this.width,
      y: this.position.y,
      width: 100,
      height: 30,
    };
    ctx.fillRect(
      this.attackBox.x,
      this.attackBox.y,
      this.attackBox.width,
      this.attackBox.height
    );

    this.update(ctx);
  }
}
