export function specialAttackHitOpponent(special, opponent) {
  if (
    special.x + special.width >= opponent.position.x &&
    special.x <= opponent.position.x + opponent.width &&
    special.y + special.height >= opponent.position.y &&
    special.y <= opponent.position.y + opponent.height
  ) {
    return true;
  }
  return false;
}
