import { chargeSpecialBar } from './chargeSpecialBar.js';
import { finishRound } from './finishRound.js';

const intervalTypes = ['countdown', 'specialBar'];

function content(type, references) {
  switch (type) {
    case intervalTypes[0]:
      // end match
      if (references.matchTime.duration <= 0) {
        references.countdownDOM.innerHTML = 0;
        references.countdownDOM.classList.add('hud_time-pulsing');
        // prevent draw if none fighter hit each other
        if (
          references.firstFighter.life < references.secondFighter.life ||
          references.firstFighter.life > references.secondFighter.life
        ) {
          references.actualRound.finished = true;
          finishRound({
            ...references,
          });
        }
      } else {
        // decrease time by 1
        references.countdownDOM.innerHTML = references.matchTime.duration--;
      }
      break;
    case intervalTypes[1]:
      chargeSpecialBar(references.firstFighter, references.firstFighterSpecialBar);
      chargeSpecialBar(references.secondFighter, references.secondFighterSpecialBar);
      break;
    default:
      break;
  }
}

export function manageInterval(action, variableId, type, references, time) {
  if (action === 'set') {
    variableId[type] = setInterval(() => content(type, references), time);
  } else {
    clearInterval(variableId[type]);
    variableId[type] = null;
  }
}
