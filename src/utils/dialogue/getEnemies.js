let fighters = ['warrior', 'rogue', 'ninja', 'samurai'];

export function getEnemies(player) {
  fighters.splice(fighters.indexOf(player), 1);
  return fighters;
}
