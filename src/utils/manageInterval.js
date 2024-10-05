import { chargeSpecialBar } from './chargeSpecialBar.js';
import { finishRound } from './finishRound.js';

const intervalTypes = ['countdown', 'specialBar'];

function content(type, references) {
  switch (type) {
    case intervalTypes[0]:
      // end match
      if (references.matchTime.duration <= 0) {
        references.countdownDOM.innerHTML = 0;
        references.actualRound.finished = true;
        finishRound({
          firstFighter: references.firstFighter,
          secondFighter: references.secondFighter,
          time: references.matchTime,
          ctx: references.ctx,
          actualRound: references.actualRound,
          healthBar: {
            firstFighter: references.firstFighterHealthBar,
            secondFighter: references.secondFighterHealthBar,
          },
          specialBar: {
            firstFighter: references.firstFighterSpecialBar,
            secondFighter: references.secondFighterSpecialBar,
          },
          intervals: references.intervals,
          references: references,
          winners: references.winners,
        });
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
