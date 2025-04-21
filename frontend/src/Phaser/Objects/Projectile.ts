import Phaser from 'phaser';
import { Enemy } from './Enemy';

export class Projectile extends Phaser.Physics.Arcade.Sprite {
    speed: number = 300;
    damage: number = 20;
    target: Enemy;

    constructor(scene: Phaser.Scene, x: number, y: number, target: Enemy) {
        super(scene, x, y, 'projectile');  // Make sure 'projectile' key is loaded!

        this.target = target;

        scene.add.existing(this);
        scene.physics.add.existing(this);

        this.setActive(true);
        this.setVisible(true);

        // Fire toward the enemy
        scene.physics.moveToObject(this, target, this.speed);
    }

    preUpdate(time: number, delta: number) {
        super.preUpdate(time, delta);

        if (!this.active || !this.target || !this.target.active) return;

        const dist = Phaser.Math.Distance.Between(this.x, this.y, this.target.x, this.target.y);
        if (dist < 10) {
            this.target.takeDamage(this.damage);
            this.destroy();
        }
    }
}