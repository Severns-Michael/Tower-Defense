import Phaser from 'phaser';

export class Enemy extends Phaser.GameObjects.Sprite {
    health: number;
    speed: number;
    path: Phaser.Math.Vector2[];
    currentWaypointIndex: number = 0;

    constructor(scene: Phaser.Scene, x: number, y: number, path: Phaser.Math.Vector2[]) {
        super(scene, x, y, 'enemy');  // Assuming 'enemy' is the key for the enemy sprite

        this.health = 100;
        this.speed = 50;  // Speed in pixels per second
        this.path = path;

        scene.add.existing(this);
        scene.physics.world.enable(this);  // Enable physics for this enemy
        this.setOrigin(0.5); // Optional but helps with alignment

        // Ensure the body is dynamic and set collision world bounds
        if (this.body && this.body instanceof Phaser.Physics.Arcade.Body) {
            const body = this.body as Phaser.Physics.Arcade.Body;
            body.setCollideWorldBounds(true);
            body.setBounce(1);
        } else {
            console.warn('Enemy body is not available or not an Arcade Body.');
        }
    }

    // Movement logic
    update(time: number, delta: number) {
        if (this.currentWaypointIndex >= this.path.length) {
            // Reached the end of the path
            if (this.body && this.body instanceof Phaser.Physics.Arcade.Body) {
                this.body.setVelocity(0, 0);  // Stop movement
            }
            return;
        }

        const target = this.path[this.currentWaypointIndex];
        const dx = target.x - this.x;
        const dy = target.y - this.y;
        const distance = Math.sqrt(dx * dx + dy * dy);

        if (distance < 4) {
            // Close enough to switch to the next waypoint
            this.currentWaypointIndex++;
        } else {
            // Move toward the current waypoint
            const angle = Math.atan2(dy, dx);
            const vx = Math.cos(angle) * this.speed;
            const vy = Math.sin(angle) * this.speed;

            if (this.body && this.body instanceof Phaser.Physics.Arcade.Body) {
                this.body.setVelocity(vx, vy);  // Set velocity for physics body
            }
        }
    }

    // Handle damage
    takeDamage(amount: number) {
        this.health -= amount;
        if (this.health <= 0) {
            this.destroy();  // Remove from the game
        }
    }
}