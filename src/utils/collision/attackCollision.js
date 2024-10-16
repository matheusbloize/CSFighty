export function attackCollision(rect1, rect2) {
  if (
    rect1.getX() + rect1.getWidth() >= rect2.getPositionX() &&
    rect1.getX() <= rect2.getPositionX() + rect2.getWidth() &&
    rect1.getY() + rect1.getHeight() >= rect2.getPositionY() &&
    rect1.getY() <= rect2.getPositionY() + rect2.getHeight()
  ) {
    return true;
  }
  return false;
}
