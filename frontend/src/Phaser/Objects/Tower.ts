import Phaser from 'phaser';
import { TowerData, UpgradeStats } from '../Utils/TowerData';
import { Enemy } from './Enemy';
import { Projectile } from './Projectile';
import { TowerType } from '../../types/Tower';
import { AttackStrategy } from '../Utils/AttackStrategy/AttackStrategy';
import { BasicProjectileAttack } from '../Utils/AttackStrategy/BasicProjectileAttack';
import { ChainLightningAttack } from '../Utils/AttackStrategy/ChainLightningAttack';
import { BaseTowers } from '../Utils/BaseTower';
import { BaseTowerStats, AttackStrategyType } from '../Utils/BaseTowerTypes';
import { SlowShotAttack } from '../Utils/AttackStrategy/SlowShotAttack';
import { HeavyShotAttack } from '../Utils/AttackStrategy/HeavyShotAttack';

export class Tower extends Phaser.GameObjects.Sprite {

    path: 'TopPath' | 'MiddlePath' | 'LowerPath';
    level: number;
    stats: UpgradeStats;
    lastShotTime: number = 0;
    cooldown: number = 1000;
    rangeCircle: Phaser.GameObjects.Arc;
    rateOfFire: number = 400;
    specialAbility: string;
    fireStrategy: AttackStrategy;
    type: TowerType;

    constructor(scene: Phaser.Scene, x: number, y: number, type: TowerType) {
        super(scene, x, y, `${type}-tower`);
        this.type = type;
        this.path = 'TopPath'; // default path
        this.level = 0;


        const baseStats = BaseTowers[this.type];
        this.stats = {
            damage: baseStats.damage,
            range: baseStats.range,
            rateOfFire: baseStats.rateOfFire,
            specialAbility: baseStats.specialAbility,
        };

        this.specialAbility = baseStats.specialAbility;
        this.fireStrategy = this.getFireStrategy(baseStats.baseAttackStrategy);

        this.rangeCircle = scene.add.circle(x, y, this.stats.range, 0x00ff00, 0.1);

        scene.add.existing(this);
    }

    getFireStrategy(baseAttackStrategy: AttackStrategyType): AttackStrategy {
        switch (baseAttackStrategy) {
            case 'Projectile':
                return new BasicProjectileAttack();
            case 'ChainLightning':
                return new ChainLightningAttack();
            case 'SlowShot':
                return new SlowShotAttack();
            case 'HeavyShot':
                return new HeavyShotAttack();
            default:
                return new BasicProjectileAttack();
        }
    }

    canShoot(time: number): boolean {
        return time - this.lastShotTime >= this.rateOfFire;
    }

    update(time: number, delta: number, enemies: Enemy[]) {
        const targetEnemy = this.getTarget(enemies);
        if (targetEnemy) {
            this.shoot(targetEnemy, time);
        }
    }

    shoot(enemy: Enemy, time: number) {
        if (this.canShoot(time)) {
            this.fireStrategy.execute(this, enemy, time);
        }
    }

    getTarget(enemies: Enemy[]): Enemy | null {
        const closest = enemies
            .filter(enemy => Phaser.Math.Distance.Between(this.x, this.y, enemy.x, enemy.y) <= this.stats.range)
            .sort((a, b) =>
                Phaser.Math.Distance.Between(this.x, this.y, a.x, a.y) -
                Phaser.Math.Distance.Between(this.x, this.y, b.x, b.y)
            )[0];

        return closest || null;
    }
}