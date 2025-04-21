//enemy class

import Phaser from 'phaser';

export class Enemy extends Phaser.GameObjects.Sprite {
    health: number;
    speed: number;
    path: Phaser.Math.Vector2[];
    currentWaypointIndex: number = 0;

    constructor(scene: Phaser.Scene, x: number, y: number, path: Phaser.Math.Vector2[]) {
        super(scene, x, y, 'enemy');  // Assuming you have an 'enemy' sprite
        this.health = 100;
        this.speed = 50;  // Speed in pixels per second
        this.path = path;

        scene.add.existing(this);
    }

    update(time: number, delta: number) {
        // Move along path
        if (this.currentWaypointIndex < this.path.length) {
            const target = this.path[this.currentWaypointIndex];
            const distance = Phaser.Math.Distance.Between(this.x, this.y, target.x, target.y);

            if (distance > this.speed * delta / 1000) {
                const angle = Phaser.Math.Angle.Between(this.x, this.y, target.x, target.y);
                this.x += Math.cos(angle) * this.speed * delta / 1000;
                this.y += Math.sin(angle) * this.speed * delta / 1000;
            } else {
                this.currentWaypointIndex++;
            }
        }
    }

    takeDamage(amount: number) {
        this.health -= amount;
        if (this.health <= 0) {
            this.destroy();  // Remove from the game
        }
    }
}
