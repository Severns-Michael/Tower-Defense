import {GameRound, GameWave} from "../types/GameWaves";


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
  private isRunning = false;
  private isRoundActive = false;

  private events: RoundEvents;

  constructor(rounds: GameRound[], events: RoundEvents = {}) {
    this.rounds = rounds;
    this.events = events;
  }

  startNextRound() {
    if (this.isRoundActive) return; // don't allow starting mid-round

    if (this.currentRoundIndex >= this.rounds.length) {
      this.events.onAllRoundsComplete?.();
      return;
    }

    const round = this.rounds[this.currentRoundIndex];
    this.events.onRoundStart?.(round.roundNumber);

    this.currentWaveIndex = 0;
    this.isRoundActive = true;

    this.startNextWave();
  }

  private startNextWave() {
    const round = this.rounds[this.currentRoundIndex];
    const wave = round.waves[this.currentWaveIndex];

    this.events.onWaveStart?.(this.currentWaveIndex + 1);

    this.spawnWave(wave, () => {
      this.currentWaveIndex++;
      if (this.currentWaveIndex >= round.waves.length) {
        // End of the round
        this.isRoundActive = false;
        this.currentRoundIndex++;
      } else {
        // Go to next wave in current round
        this.startNextWave();
      }
    });
  }

  private spawnWave(wave: GameWave, onComplete: () => void) {
    let enemyCount = 0;
    const totalEnemies = wave.enemies.reduce((sum, e) => sum + e.count, 0);

    wave.enemies.forEach(config => {
      for (let i = 0; i < config.count; i++) {
        setTimeout(() => {
          this.events.spawnEnemy?.(config.type);
          enemyCount++;

          if (enemyCount === totalEnemies) {
            onComplete();
          }
        }, i * config.spawnDelay);
      }
    });
  }
}