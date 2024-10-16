export function increaseSpecialBar(fighter, damage) {
  if (fighter.getSpecialBar() + damage <= fighter.getSpecialBarLimit()) {
    setTimeout(() => fighter.setSpecialBar(fighter.getSpecialBar() + damage), 0);
  } else {
    const fillSpecialBar = fighter.getSpecialBarLimit() - fighter.getSpecialBar();
    setTimeout(() => fighter.setSpecialBar(fighter.getSpecialBar() + fillSpecialBar), 0);
  }
}
