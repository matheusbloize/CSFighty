const specials = ['fire', 'water', 'earth', 'air'];
const boss = 'void';

export function getNewSpecial(enemy) {
  return enemy !== 'nightborne'
    ? specials[Math.floor(Math.random() * specials.length)]
    : boss;
}
