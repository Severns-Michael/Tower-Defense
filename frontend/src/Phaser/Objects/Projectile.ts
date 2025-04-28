import Phaser from 'phaser';
import { Enemy } from './Enemy';

export class Projectile extends Phaser.Physics.Arcade.Sprite {
    speed: number = 300;
    damage: number = 20;
    target: Enemy;

    constructor(scene: Phaser.Scene, x: number, y: number, target: Enemy) {
        super(scene, x, y, 'projectile');  // 'projectile' should be a loaded asset key
        this.target = target;
        scene.add.existing(this);
        scene.physics.add.existing(this);

        this.setActive(true);
        this.setVisible(true);
        this.setOrigin(0.5); // Centered origin looks better

        scene.physics.moveToObject(this, target, this.speed);
    }

    preUpdate(time: number, delta: number) {
        super.preUpdate(time, delta);

        if (!this.active || !this.target || !this.target.active) {
            this.destroy();
            return;
        }

        const angle = Phaser.Math.Angle.Between(this.x, this.y, this.target.x, this.target.y);
        const velocityX = Math.cos(angle) * this.speed;
        const velocityY = Math.sin(angle) * this.speed;

        this.setVelocity(velocityX, velocityY);

        // Check collision distance
        const dist = Phaser.Math.Distance.Between(this.x, this.y, this.target.x, this.target.y);
        if (dist < 10) {
            this.target.takeDamage(this.damage);
            this.destroy();
        }
    }
}