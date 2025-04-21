import Phaser from 'phaser';
import EventBus from '../Utils/EventBus';
import { Tower } from "../Objects/Tower";
import { Enemy } from "../Objects/Enemy";
import { TowerType } from '../Utils/TowerData';

const tileSize = 64;

export default class MainScene extends Phaser.Scene {
    towers: Tower[] = [];
    enemies: Enemy[] = [];
    logicMap: number[][] = [];
    path: Phaser.Math.Vector2[] = [];
    private highlightTile?: Phaser.GameObjects.Rectangle;
    currentRound: number = 1;
    maxRounds: number = 5;
    enemiesRemaining: number = 0;
    gameOver: boolean = false;
    selectedTower: TowerType | null = null;

    constructor() {
        super('GameScene');
    }

    preload() {
        this.load.tilemapTiledJSON('map', 'assets/map_basic4.json');
        this.load.image('walls_floor', 'assets/walls_floor.png');
        this.load.image('water', 'assets/Water_coasts_animation.png');
    }

    create() {
        const map = this.make.tilemap({ key: 'map' });

        // Add both tilesets to the map
        const wallsFloorTileset = map.addTilesetImage('walls_floor', 'walls_floor');
        const waterTileset = map.addTilesetImage('water', 'water');

        // Check if the tilesets are valid before using them
        if (!wallsFloorTileset || !waterTileset) {
            console.error("One or more tilesets are not found!");
            return;
        }

        const pathLayer = map.createLayer('Path layer', [wallsFloorTileset, waterTileset], 0, 0);
        const terrainLayer = map.createLayer('Terrain layer', [wallsFloorTileset, waterTileset], 0, 0);
        if (terrainLayer && pathLayer) {
            terrainLayer.setScale(2); // Apply scaling to terrain layer
            pathLayer.setScale(2); // Apply scaling to path layer
        } else {
            console.error("One or both layers are missing!");
        }

        if (!terrainLayer || !pathLayer) {
            console.error("One or both layers are missing!");
            return;
        }

        // Fill logicMap based on terrain tile types
        terrainLayer.forEachTile((tile: Phaser.Tilemaps.Tile) => {
            const y = tile.y;
            const x = tile.x;

            if (!this.logicMap[y]) {
                this.logicMap[y] = [];
            }

            const type = tile.properties?.type;
            if (type === 'ground') {
                this.logicMap[y][x] = 0; // Ground is free space
            } else if (type === 'obstacle') {
                this.logicMap[y][x] = 2; // Obstacle (cannot place tower here)
            } else {
                this.logicMap[y][x] = 9; // Unknown/other
            }
        });

        // Fill in paths
        pathLayer.forEachTile((tile: Phaser.Tilemaps.Tile) => {
            const y = tile.y;
            const x = tile.x;

            if (!this.logicMap[y]) {
                this.logicMap[y] = [];
            }

            const type = tile.properties?.type;
            if (type === 'path') {
                this.logicMap[y][x] = 1; // Path for enemies
            }
        });

        // Define the path for enemies
        this.path = [
            new Phaser.Math.Vector2(100, 100),
            new Phaser.Math.Vector2(100, 300),
            new Phaser.Math.Vector2(300, 300),
            new Phaser.Math.Vector2(300, 175),
            new Phaser.Math.Vector2(500, 175),
            new Phaser.Math.Vector2(500, 300),
            new Phaser.Math.Vector2(850, 300),
            new Phaser.Math.Vector2(850, 175),
            new Phaser.Math.Vector2(675, 175),
        ];

        // Highlight the path for debugging
        this.path.forEach((p: Phaser.Math.Vector2) => {
            this.add.circle(p.x, p.y, 5, 0xff0000).setDepth(10);
        });

        // Handle pointer tower placement
        this.input.on('pointerdown', (pointer: Phaser.Input.Pointer) => {
            const x = Math.floor(pointer.x / tileSize);
            const y = Math.floor(pointer.y / tileSize);

            if (this.logicMap[y] && this.logicMap[y][x] === 0) {
                // Only place a tower on ground (not path or obstacle)
                this.placeTower({ x: x * tileSize, y: y * tileSize, type: 'fire' });
                this.logicMap[y][x] = 3; // Mark the tile as occupied
            } else {
                console.log("Can't place tower here!");
            }
        });

        // Example towers and enemies
        this.towers.push(new Tower(this, 300, 350, 'fire'));
        this.enemies.push(new Enemy(this, 100, 100, this.path));

        // Add hover tile highlight for tower placement
        this.highlightTile = this.add.rectangle(0, 0, tileSize, tileSize, 0x00ff00, 0.3).setOrigin(0).setVisible(false);

        this.input.on('pointerdown', (pointer: Phaser.Input.Pointer) => {
            const x = Math.floor(pointer.x / tileSize);
            const y = Math.floor(pointer.y / tileSize);

            console.log(`Clicked tile: (${x}, ${y})`);
            console.log(`Selected tower: ${this.selectedTower}`);
            console.log(`LogicMap value: ${this.logicMap[y]?.[x]}`);

            if (this.selectedTower && this.logicMap[y] && this.logicMap[y][x] === 0) {
                this.placeTower({ x: x * tileSize, y: y * tileSize, type: this.selectedTower });
                this.logicMap[y][x] = 3;
            } else {
                console.log("Can't place tower here!");
            }
        });
// place tower event listener
        window.addEventListener('tower-selected', (event: any) => {
            const towerType: TowerType = event.detail;
            this.selectedTower = towerType;
            console.log("Selected tower type:", this.selectedTower); // should be "fire", "ice", etc.
        });

        // Start round logic
        this.startRound();
    }

    update(time: number, delta: number) {
        // Update enemies and towers each frame
        this.enemies.forEach(enemy => enemy.update(time, delta));
        this.towers.forEach(tower => tower.update(time, delta, this.enemies));
        this.selectedTower = 'fire';
    }

    placeTower(towerData: { x: number, y: number, type: string }) {
        if (!this.selectedTower) {
            console.log("No tower type selected");
            return;
        }

        console.log(`Placing ${this.selectedTower} tower at (${towerData.x}, ${towerData.y})`);

        const newTower = new Tower(this, towerData.x, towerData.y, this.selectedTower);
        this.towers.push(newTower);
    }

    shutdown() {
        EventBus.off('place-tower', this.placeTower, this);
    }

    upgradeTower(towerId: string, newLevel: number) {
        EventBus.emit('tower-upgraded', { towerId, newLevel });
    }

    startRound() {
        if (this.currentRound > this.maxRounds) {
            console.log("Game Won!");
            this.gameOver = true;
            return;
        }

        console.log(`Starting Round ${this.currentRound}`);
        const enemyCount = this.currentRound;
        this.enemiesRemaining = enemyCount;

        for (let i = 0; i < enemyCount; i++) {
            this.time.delayedCall(i * 500, () => {
                const newEnemy = new Enemy(this, this.path[0].x, this.path[0].y, this.path);
                this.enemies.push(newEnemy);
            });
        }
    }

}