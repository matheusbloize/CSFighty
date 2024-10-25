import { finishRound } from '../round/finishRound.js';
import { getRoundWinner } from '../round/getRoundWinner.js';

export function defeatOpponent(ui, actualRound, references) {
  // change opponent sprite to death
  const winner = getRoundWinner(references);

  if (winner === 'player') {
    references.secondFighter.changeSprite('death');
    references.secondFighter.setFramesHold(55);
  } else {
    references.firstFighter.changeSprite('death');
    references.firstFighter.setFramesHold(55);
  }

  ui.style.width = 0;
  setTimeout(() => {
    ui.style.border = 'none';
  }, 400);
  actualRound.finished = true;
  finishRound({
    ...references,
  });
}
