import { GameRound, GameWave } from "../types/GameWaves";
import EventBus from "../Phaser/Utils/EventBus";


type RoundEvents = {
  onRoundStart?: (round: number) => void;
  onWaveStart?: (wave: number) => void;
  onAllRoundsComplete?: () => void;
  spawnEnemy?: (type: string) => void;
};

export class RoundManager {
  private rounds: GameRound[];
  private currentRoundIndex = 0;
  private currentWaveIndex = 0;
  private isRoundActive = false;
  allWavesSpawned = false;

  private events: RoundEvents;

  constructor(rounds: GameRound[], events: RoundEvents = {}) {
    this.rounds = rounds;
    this.events = events;




    EventBus.on('all-enemies-dead', () => {
      if (this.isRoundActive && this.allWavesSpawned) {
        this.completeRound();
      }
    });
  }

  startNextRound() {
    if (this.isRoundActive) return;

    if (this.currentRoundIndex >= this.rounds.length) {
      this.events.onAllRoundsComplete?.();
      return;
    }

    const round = this.rounds[this.currentRoundIndex];

    EventBus.emit('round-changed', round.roundNumber);
    this.events.onRoundStart?.(round.roundNumber);

    this.currentWaveIndex = 0;
    this.isRoundActive = true;
    this.allWavesSpawned = false;

    this.startNextWave();
  }

  private startNextWave() {
    const round = this.rounds[this.currentRoundIndex];
    const wave = round.waves[this.currentWaveIndex];

    this.events.onWaveStart?.(this.currentWaveIndex + 1);

    this.spawnWave(wave, () => {
      this.currentWaveIndex++;

      if (this.currentWaveIndex >= round.waves.length) {

        this.allWavesSpawned = true;
      } else {
        this.startNextWave();
      }
    });
  }

  private spawnWave(wave: GameWave, onComplete: () => void) {
    let spawned = 0;
    const totalEnemies = wave.enemies.reduce((sum, e) => sum + e.count, 0);

    wave.enemies.forEach(config => {
      for (let i = 0; i < config.count; i++) {
        setTimeout(() => {
          this.events.spawnEnemy?.(config.type);
          spawned++;

          if (spawned === totalEnemies) {
            onComplete();
          }
        }, i * config.spawnDelay);
      }
    });
  }

  private handleAllEnemiesDead() {
    if (this.isRoundActive && this.allWavesSpawned) {

      this.completeRound();
    }
  }

  completeRound() {

    this.isRoundActive = false;
    this.currentRoundIndex++;
    EventBus.emit('round-completed');
  }

  isRoundActiveNow(): boolean {
    return this.isRoundActive;
  }
}