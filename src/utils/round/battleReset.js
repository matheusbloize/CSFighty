export function battleReset({
  actualRound,
  firstFighter,
  secondFighter,
  ctx,
  defaultWidth,
  defaultHeight,
  widthSpace,
  differenceSpace,
}) {
  // increment round number
  actualRound.number++;
  actualRound.finished = false;

  // fighters position
  firstFighter.setPositionX(widthSpace);
  firstFighter.setPositionY(ctx.canvas.height - defaultHeight - differenceSpace);
  secondFighter.setPositionX(ctx.canvas.width - widthSpace - defaultWidth);
  secondFighter.setPositionY(ctx.canvas.height - defaultHeight - differenceSpace);

  // restart sprites
  firstFighter.changeSprite('idle');
  secondFighter.changeSprite('idle');
  firstFighter.setFramesHold(10);
  secondFighter.setFramesHold(10);

  // health bar fighters
  firstFighter.setLife(100);
  secondFighter.setLife(100);

  // block bar fighters
  firstFighter.setBlockBar(100);
  secondFighter.setBlockBar(100);
}
