export class Fighter {
  constructor(position, width, height, velocity, color) {
    this.position = { ...position };
    this.width = width;
    this.height = height;
    this.velocity = velocity;
    this.color = color;
  }

  draw(ctx) {
    ctx.fillStyle = this.color;
    ctx.fillRect(this.position.x, this.position.y, this.width, this.height);
  }

  update(ctx) {
    this.draw(ctx);
  }
}
