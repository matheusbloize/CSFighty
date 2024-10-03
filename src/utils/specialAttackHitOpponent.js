export function specialAttackHitOpponent(special, opponent) {
  if (
    special.x + special.width >= opponent.position.x &&
    special.y + special.height >= opponent.position.y
  ) {
    return true;
  }
  return false;
}
