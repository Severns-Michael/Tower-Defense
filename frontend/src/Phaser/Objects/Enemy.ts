import Phaser from 'phaser';

export class Enemy extends Phaser.GameObjects.Sprite {
    health: number;
    speed: number;
    path: Phaser.Math.Vector2[];
    currentWaypointIndex: number = 0;

    constructor(scene: Phaser.Scene, x: number, y: number, path: Phaser.Math.Vector2[]) {
        super(scene, x, y, 'enemy');  // Assuming 'enemy' is the key for the enemy sprite

        this.health = 100;
        this.speed = 3;  // Speed in pixels per second
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
        const target = this.path[this.currentWaypointIndex];

        if (target) {
            const dx = target.x - this.x;
            const dy = target.y - this.y;
            const distance = Math.sqrt(dx * dx + dy * dy);

            if (distance > this.speed) {
                // Move towards the target
                const moveX = (dx / distance) * this.speed;
                const moveY = (dy / distance) * this.speed;

                this.x += moveX;
                this.y += moveY;
            } else {
                // Reached target, so we snap to the target
                this.x = target.x;
                this.y = target.y;

                // Move to the next waypoint
                this.currentWaypointIndex++;

                // If we reached the last waypoint
                if (this.currentWaypointIndex >= this.path.length) {
                    this.stop();
                }
            }
        }
        //enemy postion debug
    }

    // Handle damage
    takeDamage(amount: number) {
        this.health -= amount;
        if (this.health <= 0) {
            console.log('Enemy destroyed');
            this.destroy();  // Remove from the game
        }
    }

    // Logging the movement of the enemy
    private logMovement() {
        console.log(`Enemy Position - X: ${this.x.toFixed(2)}, Y: ${this.y.toFixed(2)} | Current waypoint: ${this.currentWaypointIndex}`);
    }

}