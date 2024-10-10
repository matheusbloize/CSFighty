export function undoBlock(fighter, ui) {
  fighter.removeBlock();
  ui.parentElement.classList.remove('block-bar_charged');
  ui.style.backgroundColor = '#CCCCCC';
  ui.parentElement.style.borderColor = '#333333';
}
