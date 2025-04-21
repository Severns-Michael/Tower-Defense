// types/GameWave.ts
export interface EnemyConfig {
    type: string; // e.g., "grunt", "tank"
    count: number;
    spawnDelay: number; // time between spawns
}

export interface GameWave {
    enemies: EnemyConfig[];
}

export interface GameRound {
    roundNumber: number;
    waves: GameWave[];
}