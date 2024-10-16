export function battleReset({ actualRound, firstFighter, secondFighter, ctx }) {
  const defaultWidth = 50;
  const defaultHeight = 100;
  const widthSpace = 40;
  const differenceSpace = 32;

  // increment round number
  actualRound.number++;
  actualRound.finished = false;

  // fighters position
  firstFighter.setPositionX(widthSpace);
  firstFighter.setPositionY(ctx.canvas.height - defaultHeight - differenceSpace);
  secondFighter.setPositionX(ctx.canvas.width - widthSpace - defaultWidth);
  secondFighter.setPositionY(ctx.canvas.height - defaultHeight - differenceSpace);

  // health bar fighters
  firstFighter.setLife(100);
  secondFighter.setLife(100);

  // block bar fighters
  firstFighter.setBlockBar(100);
  secondFighter.setBlockBar(100);
}
