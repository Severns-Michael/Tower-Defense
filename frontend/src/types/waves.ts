import { GameRound } from './GameWaves';

export const waves: GameRound[] = [
    {
        roundNumber: 1,
        waves: [{ enemies: [{ type: 'grunt', count: 5, spawnDelay: 600 }] }]
    },
    {
        roundNumber: 2,
        waves: [{ enemies: [{ type: 'grunt', count: 8, spawnDelay: 550 }] }]
    },
    {
        roundNumber: 3,
        waves: [{ enemies: [{ type: 'grunt', count: 10, spawnDelay: 500 }] }]
    },
    {
        roundNumber: 4,
        waves: [{ enemies: [{ type: 'grunt', count: 12, spawnDelay: 450 }] }]
    },
    {
        roundNumber: 5,
        waves: [{ enemies: [{ type: 'grunt', count: 8, spawnDelay: 400 }, { type: 'fast', count: 4, spawnDelay: 300 }] }]
    },
    {
        roundNumber: 6,
        waves: [{ enemies: [{ type: 'grunt', count: 10, spawnDelay: 400 }, { type: 'fast', count: 6, spawnDelay: 250 }] }]
    },
    {
        roundNumber: 7,
        waves: [{ enemies: [{ type: 'brute', count: 3, spawnDelay: 800 }] }]
    },
    {
        roundNumber: 8,
        waves: [{ enemies: [{ type: 'grunt', count: 6, spawnDelay: 400 }, { type: 'brute', count: 2, spawnDelay: 700 }] }]
    },
    {
        roundNumber: 9,
        waves: [{ enemies: [{ type: 'fast', count: 10, spawnDelay: 200 }] }]
    },
    {
        roundNumber: 10,
        waves: [
            { enemies: [{ type: 'brute', count: 3, spawnDelay: 600 }] },
            { enemies: [{ type: 'boss', count: 1, spawnDelay: 1500 }] }
        ]
    },
    {
        roundNumber: 11,
        waves: [{ enemies: [{ type: 'grunt', count: 15, spawnDelay: 350 }] }]
    },
    {
        roundNumber: 12,
        waves: [{ enemies: [{ type: 'fast', count: 8, spawnDelay: 250 }, { type: 'brute', count: 2, spawnDelay: 700 }] }]
    },
    {
        roundNumber: 13,
        waves: [{ enemies: [{ type: 'grunt', count: 10, spawnDelay: 300 }, { type: 'brute', count: 3, spawnDelay: 650 }] }]
    },
    {
        roundNumber: 14,
        waves: [{ enemies: [{ type: 'fast', count: 10, spawnDelay: 150 }, { type: 'brute', count: 3, spawnDelay: 600 }] }]
    },
    {
        roundNumber: 15,
        waves: [
            { enemies: [{ type: 'brute', count: 4, spawnDelay: 600 }] },
            { enemies: [{ type: 'boss', count: 1, spawnDelay: 1200 }] }
        ]
    }
];