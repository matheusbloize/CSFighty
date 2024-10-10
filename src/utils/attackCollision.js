export function attackCollision(rect1, rect2) {
  if (
    rect1.x + rect1.width >= rect2.position.x &&
    rect1.x <= rect2.position.x + rect2.width &&
    rect1.y + rect1.height >= rect2.position.y &&
    rect1.y <= rect2.position.y + rect2.height
  ) {
    return true;
  }
  return false;
}
