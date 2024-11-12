import { finishRound } from '../round/finishRound.js';
import { getRoundWinner } from '../round/getRoundWinner.js';

export function defeatOpponent(ui, actualRound, references) {
  // change opponent sprite to death
  const winner = getRoundWinner(references);

  if (winner === 'player') {
    let hasMatchWinner = false;
    let firstFighterRoundsWon = 0;
    let secondFighterRoundsWon = 0;

    for (const winner in references.winners) {
      references.winners[winner] === references.firstFighter.getRole() &&
        firstFighterRoundsWon++;
      references.winners[winner] === references.secondFighter.getRole() &&
        secondFighterRoundsWon++;
    }

    if (firstFighterRoundsWon === 2 || secondFighterRoundsWon === 2) {
      hasMatchWinner = true;
    }

    if (references.matchInfo.number === 4 && hasMatchWinner) {
      references.secondFighter.changeSprite('death');
    } else {
      if (references.secondFighter.getName() === 'nightborne') {
        references.secondFighter.changeSprite('first_death');
      } else {
        references.secondFighter.changeSprite('death');
      }
    }
    references.secondFighter.setFramesHold(20);
    references.firstFighter.changeSprite('pose');
  } else {
    references.firstFighter.changeSprite('death');
    references.firstFighter.setFramesHold(20);
    references.secondFighter.changeSprite('pose');
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
