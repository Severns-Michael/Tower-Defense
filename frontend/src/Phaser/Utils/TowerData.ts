// src/Phaser/Utils/TowerData.ts
import { TowerType } from '../../types/Tower';
import { AttackStrategyType } from "./BaseTowerTypes";

interface UpgradeModifiers {
    damage?: number;
    range?: number;
    rateOfFire?: number;
    specialAbility?: string;
    baseAttackStrategy?: AttackStrategyType;
}

interface UpgradePath {
    [level: number]: UpgradeModifiers;
}

interface TowerUpgrades {
    TopPath: UpgradePath;
    MiddlePath: UpgradePath;
    LowerPath: UpgradePath;
}

export type TowerDataType = Record<TowerType, TowerUpgrades>;

export const TowerData: TowerDataType = {
    fire: {
        TopPath: {
            0: { damage: 5, range: 20, rateOfFire: -100, specialAbility: 'Fireball' },
            1: { damage: 10, range: 30, rateOfFire: -150, specialAbility: 'Fireball' },
            2: { damage: 20, range: 50, rateOfFire: -200, specialAbility: 'Inferno' },
        },
        MiddlePath: {
            0: { damage: 3, range: 10, rateOfFire: -50, specialAbility: 'Fireball' },
            1: { damage: 5, range: 20, rateOfFire: -100, specialAbility: 'Fireball' },
            2: { damage: 8, range: 30, rateOfFire: -150, specialAbility: 'Fire Patch' },
        },
        LowerPath: {
            0: { damage: 4, range: 10, rateOfFire: -50, specialAbility: 'Fireball' },
            1: { damage: 6, range: 20, rateOfFire: -100, specialAbility: 'Fireball' },
            2: { damage: 10, range: 30, rateOfFire: -150, specialAbility: 'Knockback' },
        },
    },

    ice: {
        TopPath: {
            0: { damage: 3, range: 15, rateOfFire: -50, specialAbility: 'SlowShot' },
            1: { damage: 5, range: 25, rateOfFire: -100, specialAbility: 'SlowShot' },
            2: { damage: 8, range: 40, rateOfFire: -150, specialAbility: 'Blizzard' },
        },
        MiddlePath: {
            0: { damage: 2, range: 10, rateOfFire: -50, specialAbility: 'SlowShot' },
            1: { damage: 3, range: 15, rateOfFire: -100, specialAbility: 'SlowShot' },
            2: { damage: 5, range: 25, rateOfFire: -150, specialAbility: 'SlowShotv2' },
        },
        LowerPath: {
            0: { damage: 4, range: 10, rateOfFire: -50, specialAbility: 'SlowShot' },
            1: { damage: 6, range: 20, rateOfFire: -100, specialAbility: 'SlowShot' },
            2: { damage: 9, range: 30, rateOfFire: -150, specialAbility: 'Freeze' },
        },
    },

    physical: {
        TopPath: {
            0: { damage: 7, range: 10, rateOfFire: -50, specialAbility: 'HeavyShot' },
            1: { damage: 12, range: 20, rateOfFire: -100, specialAbility: 'HeavyShot' },
            2: { damage: 20, range: 30, rateOfFire: -150, specialAbility: 'HeavyShot' },
        },
        MiddlePath: {
            0: { damage: 5, range: 5, rateOfFire: -50, specialAbility: 'HeavyShot' },
            1: { damage: 8, range: 15, rateOfFire: -100, specialAbility: 'HeavyShot' },
            2: { damage: 12, range: 20, rateOfFire: -150, specialAbility: 'HeavyShot' },
        },
        LowerPath: {
            0: { damage: 4, range: 5, rateOfFire: -50, specialAbility: 'HeavyShot' },
            1: { damage: 6, range: 10, rateOfFire: -100, specialAbility: 'HeavyShot' },
            2: { damage: 10, range: 15, rateOfFire: -150, specialAbility: 'HeavyShot' },
        },
    },

    lightning: {
        TopPath: {
            0: { damage: 5, range: 15, rateOfFire: -50, specialAbility: 'Chain Lightning' },
            1: { damage: 8, range: 25, rateOfFire: -100, specialAbility: 'Chain Lightning' },
            2: { damage: 12, range: 40, rateOfFire: -150, specialAbility: 'Chain Lightning' },
        },
        MiddlePath: {
            0: { damage: 3, range: 10, rateOfFire: -50, specialAbility: 'Chain Lightning' },
            1: { damage: 5, range: 20, rateOfFire: -100, specialAbility: 'Chain Lightning' },
            2: { damage: 8, range: 30, rateOfFire: -150, specialAbility: 'Shock' },
        },
        LowerPath: {
            0: { damage: 4, range: 15, rateOfFire: -50, specialAbility: 'Chain Lightning' },
            1: { damage: 7, range: 25, rateOfFire: -100, specialAbility: 'Chain Lightning' },
            2: { damage: 10, range: 40, rateOfFire: -150, specialAbility: 'Chain Lightning' },
        },
    },
};

export type {
    UpgradeModifiers,
    UpgradePath,
    TowerUpgrades,
};
