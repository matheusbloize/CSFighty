import { soundtrack } from '../../utils/game/objects.js';

export function isPlaying() {
  if (
    soundtrack.actual.currentTime > 0 &&
    !soundtrack.actual.paused &&
    !soundtrack.actual.ended &&
    soundtrack.actual.readyState > soundtrack.actual.HAVE_CURRENT_DATA
  ) {
    return true;
  }
  return false;
}
