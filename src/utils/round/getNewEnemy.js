let fighters = ['warrior', 'rogue', 'ninja', 'samurai'];
const boss = 'nightborne';

export function getNewEnemy(fightersUsed, playerLost) {
  if (playerLost) {
    fighters = ['warrior', 'rogue', 'ninja', 'samurai'];
  }
  fighters.splice(fighters.indexOf(fightersUsed), 1);
  return fighters.length > 0
    ? fighters[Math.floor(Math.random() * fighters.length)]
    : boss;
}
