import { references } from '../game/startGame';

export function actualMatchInfo(
  hasMatchWinner,
  firstFighterRoundsWon,
  secondFighterRoundsWon
) {
  for (const winner in references.winners) {
    references.winners[winner] === references.firstFighter.getRole() &&
      firstFighterRoundsWon++;
    references.winners[winner] === references.secondFighter.getRole() &&
      secondFighterRoundsWon++;
  }

  if (firstFighterRoundsWon === 2 || secondFighterRoundsWon === 2) {
    hasMatchWinner = true;
  }
}
