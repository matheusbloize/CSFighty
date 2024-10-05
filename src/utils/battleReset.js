export function battleReset({
  actualRound,
  firstFighter,
  secondFighter,
  ctx,
  healthBar,
  specialBar,
}) {
  const defaultWidth = 50;
  const defaultHeight = 100;
  const widthSpace = 40;
  const differenceSpace = 32;

  // increment round number
  actualRound.number++;
  actualRound.finished = false;

  // fighters position
  firstFighter.position = {
    x: widthSpace,
    y: ctx.canvas.height - defaultHeight - differenceSpace,
  };
  firstFighter.width = defaultWidth;
  firstFighter.height = defaultHeight;
  secondFighter.position = {
    x: ctx.canvas.width - widthSpace - defaultWidth,
    y: ctx.canvas.height - defaultHeight - differenceSpace,
  };
  secondFighter.width = defaultWidth;
  secondFighter.height = defaultHeight;

  // special bar fighters
  firstFighter.specialBar = 0;
  secondFighter.specialBar = 0;

  // health bar fighters
  firstFighter.life = 100;
  secondFighter.life = 100;
  healthBar.firstFighter.style.width = '100%';
  healthBar.secondFighter.style.width = '100%';
  healthBar.firstFighter.style.border = '2px solid';
  healthBar.secondFighter.style.border = '2px solid';
  specialBar.firstFighter.style.width = '0%';
  specialBar.secondFighter.style.width = '0%';
}
