import { Fighter } from './entities/Fighter.js';

const canvas = document.querySelector('canvas');
const ctx = canvas.getContext('2d');
const defaultWidth = 50;
const defaultHeight = 100;
const widthSpace = 40;

const entities = [
  new Fighter(
    { x: widthSpace, y: canvas.height - defaultHeight },
    defaultWidth,
    defaultHeight,
    1,
    'red'
  ),
  new Fighter(
    { x: canvas.width - widthSpace - defaultWidth, y: canvas.height - defaultHeight },
    defaultWidth,
    defaultHeight,
    1,
    'blue'
  ),
];

function animate() {
  requestAnimationFrame(animate);
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  for (const entity of entities) {
    entity.update(ctx);
  }
}

requestAnimationFrame(animate);
