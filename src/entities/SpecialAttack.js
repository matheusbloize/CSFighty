export class SpecialAttack {
  #fighter;
  #velocity = 2;
  #width = 30;
  #height = 30;
  #x;
  #y;
  #direction;

  constructor(fighter) {
    this.#fighter = fighter;
    this.#x =
      this.#fighter.getDirection() > 0
        ? this.#fighter.getPositionX() + this.#fighter.getWidth()
        : this.#fighter.getPositionX() - this.#width;
    this.#y = this.#fighter.getPositionY() + this.#height;
    this.#direction = this.#fighter.getDirection();
  }

  draw(ctx) {
    ctx.fillStyle = 'gold';
    ctx.fillRect(this.#x, this.#y, this.#width, this.#height);
  }

  update(ctx) {
    this.draw(ctx);

    if (this.#direction > 0) {
      this.#x += this.#velocity * 2;
    } else {
      this.#x -= this.#velocity * 2;
    }
  }

  resetPosition() {
    this.#x = this.#fighter.getPositionX();
  }

  getFighter() {
    return this.#fighter;
  }

  getWidth() {
    return this.#width;
  }

  getHeight() {
    return this.#height;
  }

  getX() {
    return this.#x;
  }

  getY() {
    return this.#y;
  }
}
