import Phaser from 'phaser';
import EventBus from "../Utils/EventBus";
import {EnemyType, EnemyStats} from "../../types/EnemyTypes";

export class Enemy extends Phaser.GameObjects.Sprite {
    health: number;
    speed: number;
    path: Phaser.Math.Vector2[];
    currentWaypointIndex: number = 0;
    public onReachedEnd: (enemy: Enemy) => void;
    isDead: boolean = false;
    isFrozen: boolean = false;
    freezeTimer?: Phaser.Time.TimerEvent;
    healthBarBg: Phaser.GameObjects.Graphics;
    healthBar: Phaser.GameObjects.Graphics;
    enemyType!: EnemyType;
    reward: number;

    constructor(
        scene: Phaser.Scene,
        x: number,
        y: number,
        path: Phaser.Math.Vector2[],
        onReachedEnd: (enemy: Enemy) => void,
        type: EnemyType



    ) {
        super(scene, x, y, 'enemy');  // Assuming 'enemy' is the key for the enemy sprite

        this.health = 50;
        this.speed = 3;  // Speed in pixels per second
        this.path = path;
        this.onReachedEnd = onReachedEnd;
        const def = EnemyStats[type];
        this.health = def.health;
        this.speed = def.speed;
        this.reward = def.reward;


        scene.add.existing(this);
        scene.physics.world.enable(this);

        this.setOrigin(0.5);
        // Health Bar background
        this.healthBarBg = scene.add.graphics();
        this.healthBarBg.fillStyle(0x000000);
        this.healthBarBg.fillRect(this.x - 16, this.y - 32, 32, 4); // black background bar

        // Health Bar foreground
        this.healthBar = scene.add.graphics();
        this.healthBar.fillStyle(0x00ff00);
        this.healthBar.fillRect(this.x - 16, this.y - 32, 32, 4); // green health bar

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

        // Movement only happens if not frozen
        if (!this.isFrozen) {
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
                        this.onReachedEnd(this);
                    }
                }
            }
        }

        // ✅ ALWAYS update health bar position and size even when frozen!
        const healthRatio = Phaser.Math.Clamp(this.health / 50, 0, 1);

        this.healthBar.setPosition(this.x - 16, this.y - 32);
        this.healthBar.clear();
        this.healthBar.fillStyle(0x00ff00);
        this.healthBar.fillRect(0, 0, 32 * healthRatio, 4);
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
        EventBus.emit('enemy-killed', { reward: this.reward, enemy: this });
        this.destroy();
        this.healthBar.destroy();
        this.healthBarBg.destroy();
    }

    freeze(freezeDurationSeconds: number) {
        if (this.isFrozen) return;  // already frozen, skip

        console.log('❄️ Freezing enemy at:', this.x, this.y);

        this.isFrozen = true;

        const originalSpeed = this.speed;
        this.speed = 0; // stop enemy

        this.freezeTimer = this.scene.time.addEvent({
            delay: freezeDurationSeconds * 1000,
            callback: () => {
                console.log('🔥 Unfreezing enemy at:', this.x, this.y);
                this.speed = originalSpeed;
                this.isFrozen = false;
            }
        });
    }
}