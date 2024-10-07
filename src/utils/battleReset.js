export function battleReset({ actualRound, firstFighter, secondFighter, ctx }) {
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

  // health bar fighters
  firstFighter.life = 100;
  secondFighter.life = 100;
}
