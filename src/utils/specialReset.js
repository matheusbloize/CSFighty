export function specialReset(obj, array, index) {
  array.splice(index, 1);
  obj.resetPosition();
}
