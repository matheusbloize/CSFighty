export function isFighterCollidingAttack(f1AttackWidth, f2Width) {
  if (f1AttackWidth >= f2Width) {
    return true;
  }
  return false;
}
