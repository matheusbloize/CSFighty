export function chargeSpecialBar(fighter, ui) {
  if (fighter.specialBar < fighter.specialBarLimit) {
    fighter.specialBar++;
  } else {
    ui.parentElement.classList.add('special-bar_charged');
  }
  ui.style.width = `${fighter.specialBar}%`;
}
