import Phaser from 'phaser';
import { TowerData, UpgradeStats, TowerType } from '../Utils/TowerData';
import { Enemy } from './Enemy';

export class Tower extends Phaser.GameObjects.Sprite {
    type: TowerType;
    path: 'TopPath' | 'MiddlePath' | 'LowerPath';
    level: number;
    stats: UpgradeStats;
    lastShotTime: number = 0;
    cooldown: number = 1000;
    rangeCircle: Phaser.GameObjects.Arc;

    constructor(scene: Phaser.Scene, x: number, y: number, type: TowerType) {
        super(scene, x, y, `${type}-tower`);
        this.type = type;
        this.path = 'TopPath'; // default path for now
        this.level = 0;
        this.stats = TowerData[this.type][this.path][this.level];

        this.rangeCircle = scene.add.circle(x, y, this.stats.range, 0x00ff00, 0.1);
        scene.add.existing(this);
    }
// see if it can shoot due to cooldown or attackspeed
    canShoot(time: number): boolean {
        return time - this.lastShotTime >= this.cooldown;
    }
//check for taget is in range and ready to shoot
    update(time: number, delta: number, enemies: Enemy[]) {
        const target = this.getTarget(enemies);

        if (target && this.canShoot(time)) {
            this.shoot(target);
        }
    }
//shoot
    shoot(target: Enemy) {
        this.lastShotTime = this.scene.time.now;

        const projectile = this.scene.add.sprite(this.x, this.y, 'fireball');
        this.scene.physics.moveToObject(projectile, target, 200);

        this.scene.time.delayedCall(500, () => { // simulate hit after travel time
            if (Phaser.Math.Distance.Between(projectile.x, projectile.y, target.x, target.y) < 20) {
                target.takeDamage(this.stats.damage);
                projectile.destroy();
            }
        });
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