export function chargeBar(fighter, bar, ui) {
  if (fighter[bar] < fighter[`${bar}Limit`]) {
    bar === 'specialBar' ? fighter[bar]++ : (fighter[bar] += 2);
  } else {
    ui.parentElement.classList.add(
      `${bar === 'specialBar' ? 'special-bar' : 'block-bar'}_charged`
    );
  }
  ui.style.width = `${fighter[bar]}%`;
}
