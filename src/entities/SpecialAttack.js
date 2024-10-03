export class SpecialAttack {
  constructor(fighter) {
    this.fighter = fighter;
    this.velocity = 1;
    this.width = 30;
    this.height = 30;
    this.x = this.fighter.position.x + this.fighter.width;
    this.y = this.fighter.position.y + this.height;
  }

  draw(ctx) {
    ctx.fillStyle = 'gold';
    ctx.fillRect(this.x, this.y, this.width, this.height);
  }

  update(ctx) {
    this.draw(ctx);

    this.x += this.velocity * 2;
  }

  resetPosition() {
    this.x = this.fighter.position.x;
  }
}
