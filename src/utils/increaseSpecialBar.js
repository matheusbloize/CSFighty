export function increaseSpecialBar(fighter, damage) {
  if (fighter.specialBar + damage < fighter.specialBarLimit) {
    setTimeout(() => (fighter.specialBar += damage), 0);
  } else {
    const fillSpecialBar = fighter.specialBarLimit - fighter.specialBar;
    setTimeout(() => (fighter.specialBar += fillSpecialBar), 0);
  }
}
