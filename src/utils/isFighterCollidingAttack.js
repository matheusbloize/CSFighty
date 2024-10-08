export function isFighterCollidingAttack(
  f1Direction,
  f1AtkBoxX,
  f1AtkBoxWidth,
  f2PosX,
  f2Width
) {
  if (f1Direction > 0) {
    if (f1AtkBoxX + f1AtkBoxWidth >= f2PosX) {
      return true;
    }
  } else {
    if (f1AtkBoxX - f1AtkBoxWidth < f2PosX - f2Width) {
      return true;
    }
  }
  return false;
}
