import Phaser from 'phaser';
import { TowerData, UpgradeStats } from '../Utils/TowerData';
import { Enemy } from './Enemy';
import { Projectile } from './Projectile';
import {TowerType, UpgradePath} from '../../types/Tower';
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
            baseAttackStrategy: baseStats.baseAttackStrategy
        };
        this.setInteractive({ useHandCursor: true });

        this.on('pointerdown', () => {
            this.scene.events.emit('tower-selected-for-upgrade', {
                type: this.type,
                pathLevels: this.pathLevels,
            });

            // Store reference for upgrade command
            (this.scene as any).selectedTowerRef = this; // We'll use this later
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

        // Do not upgrade past level 2
        if (currentLevel >= 2) return;

        const nextLevel = currentLevel + 1;

        // Count how many paths have been upgraded at all (>= 0)
        const upgradedPaths = Object.entries(this.pathLevels)
            .filter(([p, lvl]) => lvl >= 0);

        // Check if any path already reached T3
        const hasT3 = Object.values(this.pathLevels).includes(2);

        // You can only upgrade to T3 if no other path is at T3
        if (nextLevel === 2 && hasT3) {
            return;
        }

        // You can only upgrade a second path to T2 (level 1) max
        if (upgradedPaths.length === 2 && currentLevel === -1) {
            return;
        }

        // Perform upgrade
        const upgrade = TowerData[this.type][path][nextLevel];
        if (!upgrade) return;

        this.pathLevels[path] = nextLevel;
        this.path = path;
        this.level = nextLevel;

        this.stats = upgrade;
        this.fireStrategy = this.getFireStrategy(upgrade.baseAttackStrategy);


        console.log(`🔼 Upgraded ${this.type} tower to T${nextLevel + 1} on ${path}`);
    }

}