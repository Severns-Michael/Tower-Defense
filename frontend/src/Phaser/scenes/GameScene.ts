//main phaser scene handles game logic
import Phaser from 'phaser';
import EventBus from '../Utils/EventBus';
import {Tower} from "../Objects/Tower";
import {Enemy} from "../Objects/Enemy";

const tileSize = 64; // or whatever fits your image size

// Simple logic map (0 = walkable, 1 = path, 2 = obstacle)
const logicMap = [
    [0, 0, 0, 1, 1, 1, 0, 0],
    [0, 2, 0, 0, 0, 1, 0, 0],
    [0, 2, 0, 2, 0, 1, 0, 0],
    [0, 0, 0, 2, 0, 1, 1, 1],
];

export default class MainScene extends Phaser.Scene {
    towers: Tower[] = [];
    enemies: Enemy[] = [];
    logicMap: number[][] = [];

    constructor() {
        super('MainScene');
    }

    preload() {
        this.load.tilemapTiledJSON('map', 'assets/map basic.tsx');
        this.load.image('tiles', 'frontend/public/assets/walls_floor.png');
        this.load.image("tiles", "frontend/public/assets/walls_floor.tsx");
    }

    create() {
        // Create the tilemap from the loaded JSON data
        const map = this.make.tilemap({key: 'map'});

        // Create the tileset from the tileset image
        const tileset = map.addTilesetImage('tiles'); // Match the tileset name from Tiled

        // Create the terrain layer from the tilemap data
        const terrainLayer = map.createLayer('Terrain', tileset, 0, 0);

        // You can also add other layers like paths, obstacles, etc.
        terrainLayer.setCollisionByProperty({collides: true}); // Set collidable tiles (if needed)

        window.addEventListener('place-tower', (event: any) => {
            const { x, y, type } = event.detail;
            this.placeTower({ x, y, type });
        });

        this.input.on('pointerdown', (pointer: Phaser.Input.Pointer) => {
            const x = Math.floor(pointer.x / tileSize);
            const y = Math.floor(pointer.y / tileSize);
            const tileType = this.logicMap[y][x];

            if (tileType === 0) {
                console.log(`Placing tower at (${x}, ${y})`);
                this.placeTower({ x: x * tileSize, y: y * tileSize, type: 'fire' });
                this.logicMap[y][x] = 3; // Mark the tile as occupied
            } else {
                console.log("Can't place tower here!");
            }
        });

        this.towers.push(new Tower(this, 400, 300, 'fire')); // For testing
        this.enemies.push(new Enemy(this, 100, 100, [
            new Phaser.Math.Vector2(100, 100),
            new Phaser.Math.Vector2(400, 300)
        ]));

        this.logicMap = logicMap.map(row => [...row]); // make a deep copy

        for (let y = 0; y < logicMap.length; y++) {
            for (let x = 0; x < logicMap[y].length; x++) {
                const tileType = logicMap[y][x];
                let imageKey = '';

                if (tileType === 0) imageKey = 'ground';
                else if (tileType === 1) imageKey = 'path';
                else if (tileType === 2) imageKey = 'obstacle';

                this.add.image(x * tileSize, y * tileSize, imageKey).setOrigin(0);
            }
        }
    }

    update(time: number, delta: number) {
        this.enemies.forEach(enemy => enemy.update(time, delta));
        this.towers.forEach(tower => tower.update(time, delta, this.enemies));
    }

    placeTower(data: { x: number; y: number; type: string }) {
        console.log(`Placing tower at (${data.x}, ${data.y}) of type: ${data.type}`);
        // Add your tower creation logic here
    }

    shutdown() {
        EventBus.off('place-tower', this.placeTower, this);
    }

    upgradeTower(towerId: string, newLevel: number) {
        // Your logic to upgrade the tower
        EventBus.emit('tower-upgraded', {
            towerId,
            newLevel
        });
    }
}
