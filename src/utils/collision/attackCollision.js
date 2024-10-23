export function attackCollision(rect1, rect2) {
  if (
    rect1.getPositionX() + rect1.getWidth() >= rect2.getPositionX() &&
    rect1.getPositionX() <= rect2.getPositionX() + rect2.getWidth() &&
    rect1.getPositionY() + rect1.getHeight() >= rect2.getPositionY() &&
    rect1.getPositionY() <= rect2.getPositionY() + rect2.getHeight()
  ) {
    return true;
  }
  return false;
}
