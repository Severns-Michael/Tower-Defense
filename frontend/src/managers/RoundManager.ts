import { GameRound, GameWave } from "../types/GameWaves";

type RoundEvents = {
  onRoundStart?: (round: number) => void;
  onWaveStart?: (wave: number) => void;
  onAllRoundsComplete?: () => void;
};

export class RoundManager {
  private rounds: GameRound[];
  private currentRoundIndex = 0;
  private currentWaveIndex = 0;
  private isRunning = false;

  private events: RoundEvents;

  constructor(rounds: GameRound[], events: RoundEvents = {}) {
    this.rounds = rounds;
    this.events = events;
  }

  startRounds() {
    this.isRunning = true;
    this.startNextRound();
  }

  private startNextRound() {
    if (this.currentRoundIndex >= this.rounds.length) {
      this.events.onAllRoundsComplete?.();
      this.isRunning = false;
      return;
    }

    const round = this.rounds[this.currentRoundIndex];
    this.events.onRoundStart?.(round.roundNumber);

    this.currentWaveIndex = 0;
    this.startNextWave();
  }

  private startNextWave() {
    const round = this.rounds[this.currentRoundIndex];
    const wave = round.waves[this.currentWaveIndex];

    this.events.onWaveStart?.(this.currentWaveIndex + 1);

    // Simulate spawning
    this.spawnWave(wave, () => {
      this.currentWaveIndex++;
      if (this.currentWaveIndex >= round.waves.length) {
        this.currentRoundIndex++;
        this.startNextRound();
      } else {
        this.startNextWave();
      }
    });
  }

  private spawnWave(wave: GameWave, onComplete: () => void) {
    let enemyCount = 0;
    wave.enemies.forEach((config) => {
      for (let i = 0; i < config.count; i++) {
        setTimeout(() => {
          // Replace with your game's spawn logic:
          console.log(`Spawned ${config.type}`);

          enemyCount++;
          if (enemyCount === wave.enemies.reduce((sum, e) => sum + e.count, 0)) {
            onComplete();
          }
        }, i * config.spawnDelay);
      }
    });
  }
}