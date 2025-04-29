import { TowerType } from '../../types/Tower';

// Define the properties for each upgrade stage (LightBlue, DarkBlue, MidnightBlue, etc.)
interface UpgradeStats {
    damage: number;
    range: number;
    rateOfFire: number;
    specialAbility: string; // Example: Freeze, Fireball, Shock, etc.
}

// Each upgrade path can have 3 stages
interface UpgradePath {
    [level: number]: UpgradeStats;
}

// The full set of upgrades for each tower (fire, ice, etc.)
interface TowerUpgrades {
    TopPath: UpgradePath;
    MiddlePath: UpgradePath;
    LowerPath: UpgradePath;
}

export type {
    UpgradeStats,
    UpgradePath,
    TowerUpgrades,
};
export type TowerDataType = Record<TowerType, TowerUpgrades>;

export const TowerData: TowerDataType = {
    fire: {
        TopPath: {
            0: { damage: 10, range: 100, rateOfFire: 1000, specialAbility: 'Fireball' },
            1: { damage: 20, range: 120, rateOfFire: 900, specialAbility: 'Flame Burst' },
            2: { damage: 40, range: 150, rateOfFire: 800, specialAbility: 'Inferno' },
        },
        MiddlePath: {
            0: { damage: 5, range: 110, rateOfFire: 1200, specialAbility: 'Freeze' },
            1: { damage: 10, range: 130, rateOfFire: 1100, specialAbility: 'Ice Nova' },
            2: { damage: 15, range: 140, rateOfFire: 1000, specialAbility: 'Blizzard' },
        },
        LowerPath: {
            0: { damage: 8, range: 90, rateOfFire: 1000, specialAbility: 'Poison Cloud' },
            1: { damage: 12, range: 100, rateOfFire: 950, specialAbility: 'Acid Rain' },
            2: { damage: 18, range: 110, rateOfFire: 900, specialAbility: 'Toxic Wave' },
        },
    },
    ice: {
        TopPath: {},
        MiddlePath: {},
        LowerPath: {},
    },
    physical: {
        TopPath: {},
        MiddlePath: {},
        LowerPath: {},
    },
    lightning: {
        TopPath: {},
        MiddlePath: {},
        LowerPath: {},
    }
};

