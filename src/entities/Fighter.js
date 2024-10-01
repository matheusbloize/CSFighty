export class Fighter {
  constructor(name, position, width, height, velocity, color) {
    this.name = name;
    this.position = { ...position };
    this.width = width;
    this.height = height;
    this.velocity = velocity;
    this.color = color;
    this.originPositionY = this.position.y;
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
}
