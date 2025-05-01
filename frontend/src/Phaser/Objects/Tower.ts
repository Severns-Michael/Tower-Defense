import Phaser from 'phaser';
import {TowerData, UpgradeModifiers} from '../Utils/TowerData';
import { Enemy } from './Enemy';
import {TowerType, UpgradePath} from '../../types/Tower';
import { AttackStrategy } from '../Utils/AttackStrategy/AttackStrategy';
import { BasicProjectileAttack } from '../Utils/AttackStrategy/BasicProjectileAttack';
import { ChainLightningAttack } from '../Utils/AttackStrategy/ChainLightningAttack';
import { BaseTowers } from '../Utils/BaseTower';
import { BaseTowerStats, AttackStrategyType } from '../Utils/BaseTowerTypes';
import { SlowShotAttack } from '../Utils/AttackStrategy/SlowShotAttack';
import { HeavyShotAttack } from '../Utils/AttackStrategy/HeavyShotAttack';
import {SpecialAbilityDescriptions} from "../Utils/AbilityDescriptions";


export class Tower extends Phaser.GameObjects.Sprite {

    path: 'TopPath' | 'MiddlePath' | 'LowerPath';
    level: number;
    stats: {
        damage: number;
        range: number;
        rateOfFire: number;
        specialAbility: string;
        baseAttackStrategy: string;
    };
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
            baseAttackStrategy: baseStats.baseAttackStrategy
        };
        this.setInteractive({ useHandCursor: true });

        this.on('pointerdown', () => {
            this.scene.events.emit('tower-selected-for-upgrade', this);
        });

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
        return time - this.lastShotTime >= this.stats.rateOfFire;
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
    pathLevels: { [key in 'TopPath' | 'MiddlePath' | 'LowerPath']: number } = {
        TopPath: -1,
        MiddlePath: -1,
        LowerPath: -1,
    };
    upgradePath(path: 'TopPath' | 'MiddlePath' | 'LowerPath') {
        const currentLevel = this.pathLevels[path];

        if (currentLevel >= 2) return;

        const nextLevel = currentLevel + 1;

        const upgradedPaths = Object.entries(this.pathLevels).filter(([p, lvl]) => lvl >= 0);
        const hasT3 = Object.values(this.pathLevels).includes(2);

        if (nextLevel === 2 && hasT3) return;
        if (upgradedPaths.length === 2 && currentLevel === -1) return;

        const modifiers = TowerData[this.type][path][nextLevel];
        if (!modifiers) return;

        this.pathLevels[path] = nextLevel;
        this.path = path;
        this.level = nextLevel;

        this.applyUpgradeStats();
        console.log('Upgrading pathLevels:', JSON.stringify(this.pathLevels));

        console.log(`🔼 Upgraded ${this.type} tower to T${nextLevel + 1} on ${path}`);
    }

    applyUpgradeStats() {
        const paths = this.pathLevels;
        const towerStats = TowerData[this.type];
        const baseStats = BaseTowers[this.type];

        // Reset to base
        this.stats.damage = baseStats.damage;
        this.stats.range = baseStats.range;
        this.stats.rateOfFire = baseStats.rateOfFire;
        this.specialAbility = baseStats.specialAbility;
        this.stats.specialAbility = baseStats.specialAbility;
        this.fireStrategy = this.getFireStrategy(baseStats.baseAttackStrategy);


        (['TopPath', 'MiddlePath', 'LowerPath'] as const).forEach(path => {
            const level = paths[path];

            if (level >= 0) {
                for (let i = 0; i <= level; i++) {
                    const upgrade = towerStats[path][i];

                    if (upgrade.damage !== undefined) {
                        this.stats.damage += upgrade.damage;
                    }

                    if (upgrade.range !== undefined) {
                        this.stats.range += upgrade.range;
                    }

                    if (upgrade.rateOfFire !== undefined) {
                        this.stats.rateOfFire += upgrade.rateOfFire;
                    }

                    if (upgrade.specialAbility) {
                        this.stats.specialAbility = upgrade.specialAbility;
                        this.specialAbility = upgrade.specialAbility;
                    }

                    if (upgrade.baseAttackStrategy) {
                        this.fireStrategy = this.getFireStrategy(upgrade.baseAttackStrategy);
                    }
                }
            }
        });

        this.rangeCircle.setRadius(this.stats.range);

    }
    getSpecialParams(): any {
        const params: any = {};

        // Fireball T3 (Inferno → 2x DoT)
        if (this.specialAbility === 'Fireball' && this.pathLevels['TopPath'] === 2) {
            params.dotDamage = this.stats.damage * 0.5;
        }

        // Chain Lightning T3 (TopPath → more chains)
        if (this.specialAbility === 'Chain Lightning' && this.pathLevels['TopPath'] === 2) {
            params.chainRange = 500;
            params.chains = 5;
        }

        // Chain Lightning T3 (LowerPath → high single target dmg)
        if (this.specialAbility === 'Chain Lightning' && this.pathLevels['LowerPath'] === 2) {
            params.chainRange = 0;
            params.chains = 0;
        }

        // SlowShotv2
        if (this.specialAbility === 'SlowShotv2') {
            params.freezeDuration = 4;
        }

        return params;
    }
    getCurrentAbilityDescription(): string {
        return SpecialAbilityDescriptions[this.specialAbility] ?? "Basic attack.";
    }
}