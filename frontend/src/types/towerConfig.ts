// towerConfig.ts

// Define the tower types and export them
export type TowerType = "basic" | "sniper" | "slow";  // Add more tower types as needed

// Define the stats for each tower type
export interface TowerStats {
    range: number;
    damage: number;
    cooldown: number;
    emoji: string;
}

// Tower stats configuration (range, cooldown, emoji, etc.)
export const towerStats: Record<TowerType, TowerStats> = {
    basic: { range: 1, damage: 10, cooldown: 1000, emoji: "🏰" },   // Basic tower
    sniper: { range: 4, damage: 20, cooldown: 2000, emoji: "🎯" },  // Sniper tower
    slow: { range: 2, damage: 5, cooldown: 1500, emoji: "❄️" },    // Slow tower
};