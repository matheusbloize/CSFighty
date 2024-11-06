export function isSfxPlaying(sfx) {
  if (
    sfx.currentTime > 0 &&
    !sfx.paused &&
    !sfx.ended &&
    sfx.readyState > sfx.HAVE_CURRENT_DATA
  ) {
    return true;
  }
  return false;
}
