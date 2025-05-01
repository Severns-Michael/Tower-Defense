export type EnemyType = 'grunt' | 'fast' | 'brute' | 'boss';

export interface EnemyDefinition {
    type: EnemyType;
    health: number;
    speed: number;
    reward: number;
}

export const EnemyStats: Record<EnemyType, EnemyDefinition> = {
    grunt: {
        type: 'grunt',
        health: 30,
        speed: 2,
        reward: 1
    },
    fast: {
        type: 'fast',
        health: 20,
        speed: 8,
        reward: 1
    },
    brute: {
        type: 'brute',
        health: 100,
        speed: 4,
        reward: 3
    },
    boss: {
        type: 'boss',
        health: 500,
        speed: 5,
        reward: 10
    }
};