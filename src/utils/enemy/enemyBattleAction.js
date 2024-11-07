import { SpecialAttack } from '../../entities/SpecialAttack.js';
import { basicAttack } from '../attack/basicAttack.js';
import { undoBlock } from '../block/undoBlock.js';
import { enemyLevel, battleActions, fearMeter } from '../../states/enemy.js';
import { attackCollision } from '../collision/attackCollision.js';
import { specials_frames } from '../../constants/specials.frames.js';
import { spriteAnimations } from '../../states/sprites.js';
import { references as battleInfo } from '../game/startGame.js';
import { isSfxPlaying } from '../sfx/isSfxPlaying.js';

export function enemyBattleAction(specialAttacks) {
  const player = battleInfo.firstFighter;
  const enemy = battleInfo.secondFighter;
  const randomBattleValue = Math.floor(
    Math.random() * (fearMeter.max - fearMeter.min + 1) + fearMeter.min
  );
  let battleAction = null;

  if (enemyLevel.actual === enemyLevel.max) {
    if (
      enemy.getSpecialBar() === 100 &&
      (player.getBlockBar() !== 100 ||
        attackCollision(
          {
            getPositionX: () =>
              player.getDirection() > 0
                ? enemy.getAttackBox().getPositionX() - enemy.getWidth() * 4
                : enemy.getAttackBox().getPositionX() + enemy.getWidth() * 4,
            getPositionY: () => enemy.getAttackBox().getPositionY(),
            getWidth: () => enemy.getAttackBox().getWidth(),
            getHeight: () => enemy.getAttackBox().getHeight(),
          },
          player
        )) &&
      enemy.getPositionY() === player.getPositionY()
    ) {
      battleAction = 2;
    }
  } else {
    if (enemy.getSpecialBar() === 100) {
      battleAction = 2;
    }
  }

  if (battleAction === null && attackCollision(enemy.getAttackBox(), player)) {
    if (
      randomBattleValue >= battleActions.attack[0] &&
      randomBattleValue < battleActions.attack[1]
    ) {
      if (!spriteAnimations.boss_attack_basic.active) {
        battleAction = 0;
      }
    } else {
      battleAction = 1;
    }
  }

  // perform action
  switch (battleAction) {
    case 0: {
      if (enemy.isBlocking()) {
        undoBlock(enemy, battleInfo.secondFighterBlockBar);
      }
      const isEnemyBoss = enemy.getName() === 'nightborne';
      enemy.changeSprite('attack_basic');
      if (isEnemyBoss) {
        spriteAnimations.boss_attack_basic.active = true;
        setTimeout(
          () => basicAttack(enemy, player, battleInfo.firstFighterHealthBar, battleInfo),
          600
        );
        setTimeout(() => {
          spriteAnimations.boss_attack_basic.active = false;
        }, spriteAnimations.boss_attack_basic.time);
      } else {
        basicAttack(enemy, player, battleInfo.firstFighterHealthBar, battleInfo);
      }
      break;
    }
    case 1: {
      enemy.addBlock();
      if (enemyLevel.actual < enemyLevel.max) {
        setTimeout(() => {
          if (enemy.isBlocking()) {
            undoBlock(enemy, battleInfo.secondFighterBlockBar);
          }
        }, 500);
      }
      break;
    }
    case 2: {
      if (enemy.isBlocking()) {
        undoBlock(enemy, battleInfo.secondFighterBlockBar);
      }
      if (
        enemy.getSpecialBar() === enemy.getSpecialBarLimit() &&
        enemy.getAttackBox().getPositionY() === enemy.getPositionY() + 30
      ) {
        enemy.changeSprite('attack_special');
        const timeoutTime = enemy.getName() === 'nightborne' ? 700 : 200;
        // add special sfx
        const specialSfx = document.querySelector(`#sfx_${enemy.getSpecial()}`);
        if (isSfxPlaying(specialSfx)) {
          specialSfx.currentTime = 0;
        }
        if (enemy.getName() === 'nightborne') {
          setTimeout(() => specialSfx.play(), timeoutTime / 2);
        } else {
          specialSfx.play();
        }
        setTimeout(() => {
          specialAttacks.push(
            new SpecialAttack({
              fighter: enemy,
              src: `../assets/specials/${enemy.getSpecial()}/001.png`,
              scale: specials_frames[enemy.getSpecial()].scale,
              framesMax: 10,
              offset: specials_frames[enemy.getSpecial()].offset[enemy.getDirection()],
            })
          );
        }, timeoutTime);
        enemy.setSpecialBar(0);
        battleInfo.secondFighterSpecialBar.parentElement.classList.remove(
          'special-bar_charged'
        );
      }
      break;
    }
  }
}
