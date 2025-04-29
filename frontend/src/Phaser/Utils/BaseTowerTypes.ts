export type AttackStrategyType = 'Projectile' | 'ChainLightning' | 'SlowShot' | 'HeavyShot';

export interface BaseTowerStats {
    name: string;
    description: string;
    damage: number;
    range: number;
    rateOfFire: number;
    specialAbility: string;
    baseAttackStrategy: AttackStrategyType;
}