// types/index.ts

// Import tower config
import { towerStats, TowerType } from './towerConfig';  // Import both towerStats and TowerType

// Types for grid coordinates
export interface GridPosition {
    row: number;
    col: number;
}

// Enemy type
export interface Enemy {
    id: number;
    row: number;
    col: number;
    health: number;
    speed: number;   // Add speed property
    alive: boolean;  // Add alive property
}

// Tower type with dynamic stats
export interface Tower {
    id: number;        // Add id property
    type: TowerType;
    row: number;
    col: number;
    range: number;
    damage: number;
    fireRate: number;  // Add fireRate property
}

// Create a tower using its type, row, and column
export const createTower = (id: number, type: TowerType, row: number, col: number): Tower => {
    const stats = towerStats[type];  // Get stats from the config
    return {
        id,
        type,
        row,
        col,
        range: stats.range,
        damage: stats.damage,  // Use damage from towerStats
        fireRate: stats.cooldown,  // Set fire rate based on cooldown
    };
};

export { towerStats } from './towerConfig';

