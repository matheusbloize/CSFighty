export class SpecialAttack {
  constructor(fighter) {
    this.fighter = fighter;
    this.velocity = 1;
    this.width = 30;
    this.height = 30;
    this.x =
      this.fighter.direction > 0
        ? this.fighter.position.x + this.fighter.width
        : this.fighter.position.x - this.width;
    this.y = this.fighter.position.y + this.height;
    this.direction = this.fighter.direction;
  }

  draw(ctx) {
    ctx.fillStyle = 'gold';
    ctx.fillRect(this.x, this.y, this.width, this.height);
  }

  update(ctx) {
    this.draw(ctx);

    if (this.direction > 0) {
      this.x += this.velocity * 2;
    } else {
      this.x -= this.velocity * 2;
    }
  }

  resetPosition() {
    this.x = this.fighter.position.x;
  }
}
