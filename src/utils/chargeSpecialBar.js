export function chargeSpecialBar(fighter, ui) {
  if (fighter.specialBar < fighter.specialBarLimit) {
    fighter.specialBar++;
  } else if (fighter.specialBar == fighter.specialBarLimit) {
    ui.parentElement.classList.add('special-bar_charged');
  }
  ui.style.width = `${fighter.specialBar}%`;
}
