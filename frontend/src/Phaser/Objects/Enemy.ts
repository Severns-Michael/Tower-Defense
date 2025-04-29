import Phaser from 'phaser';
import EventBus from "../Utils/EventBus";

export class Enemy extends Phaser.GameObjects.Sprite {
    health: number;
    speed: number;
    path: Phaser.Math.Vector2[];
    currentWaypointIndex: number = 0;
    public onReachedEnd: (enemy: Enemy) => void;
    isDead: boolean = false;

    constructor(
        scene: Phaser.Scene,
        x: number,
        y: number,
        path: Phaser.Math.Vector2[],
        onReachedEnd: (enemy: Enemy) => void

    ) {
        super(scene, x, y, 'enemy');  // Assuming 'enemy' is the key for the enemy sprite

        this.health = 100;
        this.speed = 3;  // Speed in pixels per second
        this.path = path;
        this.onReachedEnd = onReachedEnd;

        scene.add.existing(this);
        scene.physics.world.enable(this);
        this.setOrigin(0.5);

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
        if (this.isDead) return;

        const target = this.path[this.currentWaypointIndex];

        if (target) {
            const dx = target.x - this.x;
            const dy = target.y - this.y;
            const distance = Math.sqrt(dx * dx + dy * dy);

            if (distance > this.speed) {
                const moveX = (dx / distance) * this.speed;
                const moveY = (dy / distance) * this.speed;

                this.x += moveX;
                this.y += moveY;
            } else {
                this.x = target.x;
                this.y = target.y;

                this.currentWaypointIndex++;

                if (this.currentWaypointIndex >= this.path.length) {
                    this.onReachedEnd(this); // Only alive enemies reach end
                }
            }
        }
    }

    // Handle damage
    takeDamage(amount: number) {
        if (this.isDead) return;

        this.health -= amount;
        if (this.health <= 0) {
            this.handleDeath();
        }
    }

    handleDeath() {
        console.log('Enemy destroyed');
        this.isDead = true;
        EventBus.emit('enemy-killed', { reward: 5, enemy: this });
        this.destroy();
    }

}