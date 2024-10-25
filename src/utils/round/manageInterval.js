import { defeatOpponent } from '../attack/defeatOpponent.js';
import { chargeBar } from './chargeBar.js';
import { getRoundWinner } from './getRoundWinner.js';

const intervalTypes = ['countdown', 'bars'];
const bars = ['specialBar', 'blockBar'];

function content(type, references) {
  switch (type) {
    case intervalTypes[0]:
      // end match
      if (references.matchInfo.duration <= 0) {
        references.countdownDOM.innerHTML = 0;
        references.countdownDOM.classList.add('hud_time-pulsing');
        // prevent draw if none fighter hit each other
        if (
          references.firstFighter.getLife() < references.secondFighter.getLife() ||
          references.firstFighter.getLife() > references.secondFighter.getLife()
        ) {
          const winner = getRoundWinner(references);
          const ui =
            winner === 'player'
              ? references.secondFighterHealthBar
              : references.firstFighterHealthBar;
          defeatOpponent(ui, references.actualRound, references);
        }
      } else {
        // decrease time by 1
        references.countdownDOM.innerHTML = references.matchInfo.duration--;
      }
      break;
    case intervalTypes[1]:
      chargeBar(references.firstFighter, bars[0], references.firstFighterSpecialBar);
      chargeBar(references.secondFighter, bars[0], references.secondFighterSpecialBar);
      chargeBar(references.firstFighter, bars[1], references.firstFighterBlockBar);
      chargeBar(references.secondFighter, bars[1], references.secondFighterBlockBar);
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
