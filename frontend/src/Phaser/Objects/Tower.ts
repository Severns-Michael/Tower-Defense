import Phaser from 'phaser';
import { TowerData, UpgradeStats} from '../Utils/TowerData';
import { Enemy } from './Enemy';
import { Projectile } from './Projectile';
import { TowerType } from '../../types/Tower';

export class Tower extends Phaser.GameObjects.Sprite {

    path: 'TopPath' | 'MiddlePath' | 'LowerPath';
    level: number;
    stats: UpgradeStats;
    lastShotTime: number = 0;
    cooldown: number = 1000;
    rangeCircle: Phaser.GameObjects.Arc;
    rateOfFire: number = 400;

    constructor(scene: Phaser.Scene, x: number, y: number, type: TowerType) {
        super(scene, x, y, `${type}-tower`);
        this.type = type;
        this.path = 'TopPath'; // default path for now
        this.level = 0;
        this.stats = TowerData[this.type as keyof typeof TowerData][this.path][this.level];

        this.rangeCircle = scene.add.circle(x, y, this.stats.range, 0x00ff00, 0.1);
        scene.add.existing(this);
    }
// see if it can shoot due to cooldown or attackspeed
    canShoot(time: number): boolean {
        return time - this.lastShotTime >= this.rateOfFire;
    }
//check for taget is in range and ready to shoot
    update(time: number, delta: number, enemies: Enemy[]) {
        const targetEnemy = this.getTarget(enemies);
        if (targetEnemy) {
            this.shoot(targetEnemy, time);
        }
    }
//shoot
shoot(enemy: Enemy, time: number) {
    if (this.canShoot(time)) {
        this.rotation = Phaser.Math.Angle.Between(this.x, this.y, enemy.x, enemy.y);
        this.lastShotTime = time;
        new Projectile(this.scene, this.x, this.y, enemy);
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