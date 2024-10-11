export const fearMeter = {
  min: 0,
  max: 100,
  value: 50,
};
export const movementActions = {
  left: [0, 50],
  right: [50, 100],
  distance: 10,
};
export const battleActions = {
  attack: [0, 80],
  special: [80, 90],
  block: [90, 100],
};
export let movementIntervals = {
  left: null,
  right: null,
};
