export function chargeBar(fighter, bar, ui) {
  const getFighterBar =
    bar === 'specialBar' ? fighter.getSpecialBar() : fighter.getBlockBar();
  const getFighterBarLimit =
    bar === 'specialBar' ? fighter.getSpecialBarLimit() : fighter.getBlockBarLimit();

  if (getFighterBar < getFighterBarLimit) {
    bar === 'specialBar'
      ? fighter.setSpecialBar(getFighterBar + 1)
      : fighter.setBlockBar(getFighterBar + 2);
  } else {
    ui.parentElement.classList.add(
      `${bar === 'specialBar' ? 'special-bar' : 'block-bar'}_charged`
    );
  }
  ui.style.width = `${getFighterBar}%`;
}
