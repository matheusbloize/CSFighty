export function isFighterCollidingBorder(x, width, canvasWidth) {
  if (x + width > canvasWidth || x < 0) {
    return true;
  }
  return false;
}
