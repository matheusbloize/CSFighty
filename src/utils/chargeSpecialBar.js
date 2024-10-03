export function chargeSpecialBar(fighter) {
  if (fighter.specialBar < fighter.specialBarLimit) {
    fighter.specialBar++;
  }
}
