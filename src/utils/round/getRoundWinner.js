export function getRoundWinner(battleInfo) {
  let winner = null;
  winner =
    battleInfo.firstFighter.getLife() < battleInfo.secondFighter.getLife()
      ? battleInfo.secondFighter.getName()
      : battleInfo.firstFighter.getName();

  if (winner !== null) {
    battleInfo.winners[`round${battleInfo.actualRound.number}`] = winner;
  }
  return winner;
}
