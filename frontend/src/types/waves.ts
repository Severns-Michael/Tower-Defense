import { GameRound } from './GameWaves'; // adjust path if needed

export const waves: GameRound[] = [
    {
        roundNumber: 1,
        waves: [
            {
                enemies: [
                    { type: 'grunt', count: 5, spawnDelay: 500 }
                ]
            }
        ]
    },
    {
        roundNumber: 2,
        waves: [
            {
                enemies: [
                    { type: 'grunt', count: 8, spawnDelay: 400 }
                ]
            }
        ]
    },
    {
        roundNumber: 3,
        waves: [
            {
                enemies: [
                    { type: 'grunt', count: 10, spawnDelay: 300 }
                ]
            }
        ]
    }
];