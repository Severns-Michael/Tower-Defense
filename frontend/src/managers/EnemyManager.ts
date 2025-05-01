import { Enemy } from "../Phaser/Objects/Enemy";
import EventBus from "../Phaser/Utils/EventBus";
import {EnemyType} from "../types/EnemyTypes";

export class EnemyManager {
    scene: Phaser.Scene;
    path: Phaser.Math.Vector2[];
    enemies: Enemy[] = [];

    constructor(scene: Phaser.Scene, path: Phaser.Math.Vector2[]) {
        this.scene = scene;
        this.path = path;
        EventBus.on('enemy-killed', (data: { reward: number, enemy: Enemy }) => {
            this.removeEnemy(data.enemy);
            EventBus.emit('enemies-changed', this.enemies.length);
        });
    }

    spawnEnemy(
        x: number,
        y: number,
        onReachEnd: (enemy: Enemy) => void,
        type: EnemyType
    ) {
        const enemy = new Enemy(this.scene, x, y, this.path, onReachEnd, type);
        this.enemies.push(enemy);

        EventBus.emit('enemies-changed', this.enemies.length);
    }

    update(time: number, delta: number) {
        this.enemies.forEach(enemy => enemy.update(time, delta));
    }

    removeEnemy(enemy: Enemy) {
        enemy.destroy();
        this.enemies = this.enemies.filter(e => e !== enemy);

        EventBus.emit('enemies-changed', this.enemies.length);

        if (this.enemies.length === 0) {
            console.log(' All enemies cleared!');
            EventBus.emit('all-enemies-dead');
        }
    }
}