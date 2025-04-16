import { Tower, Enemy } from '../types';

// detect enemies within range of a tower
export const getEnemiesInRange = (tower: Tower, enemies: Enemy[]): Enemy[] => {
    return enemies.filter((enemy) => {
        const distance = Math.abs(tower.row - enemy.row) + Math.abs(tower.col - enemy.col);
        return distance <= tower.range;  // Check if enemy is within tower's range
    });
};

//enemy movement logic
export const moveEnemies = (enemies: Enemy[], boardSize: number): Enemy[] => {
    return enemies.map((enemy) => {

        const newRow = Math.min(enemy.row + 1, boardSize - 1);
        const newCol = Math.min(enemy.col + 1, boardSize - 1);
        return { ...enemy, row: newRow, col: newCol };
    });
};