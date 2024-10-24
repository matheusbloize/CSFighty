import { finishRound } from '../round/finishRound.js';

export function defeatOpponent(ui, actualRound, references) {
  // change opponent sprite to death
  references.secondFighter.changeSprite('death');
  references.secondFighter.setFramesHold(50);

  setTimeout(() => {
    ui.style.border = 'none';
  }, 400);
  actualRound.finished = true;
  finishRound({
    ...references,
  });
}
