export enum TowerType {
    Fire = 'fire',
    Ice = 'ice',
    Physical = 'physical',
    Lightning = 'lightning'
}
export type UpgradePath = 'TopPath' | 'MiddlePath' | 'LowerPath';
export type UpgradeLevel = 0 | 1 | 2;

export interface TowerStats {
    damage: number;
    range: number;
    rateOfFire: number;
    specialAbility: string;
}

export type TowerLevelData = {
    [key in UpgradeLevel]?: TowerStats;
};

export type TowerPaths = {
    [key in UpgradePath]: TowerLevelData;
};

export type TowerData = {
    [key in TowerType]: TowerPaths;
};