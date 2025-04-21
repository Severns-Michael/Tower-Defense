import Phaser from 'phaser';
import EventBus from '../Utils/EventBus';
import { Tower } from "../Objects/Tower";
import { Enemy } from "../Objects/Enemy";
import { TowerType } from '../Utils/TowerData';

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
    selectedTowerType: TowerType | null = null;
    private tileSize: number = 64;
    private tileScale: number = 2;

    constructor() {
        super('GameScene');
    }

    preload() {
        this.load.tilemapTiledJSON('map', 'assets/map_basic5.json');
        this.load.image('walls_floor', 'assets/walls_floor.png');
        this.load.image('water', 'assets/Water_coasts_animation.png');
    }

    create() {
        const map = this.make.tilemap({ key: 'map' });

        const wallsFloorTileset = map.addTilesetImage('walls_floor', 'walls_floor');
        const waterTileset = map.addTilesetImage('water', 'water');

        // Ensure tileset is not null before proceeding
        if (!wallsFloorTileset || !waterTileset) {
            console.error("Tilesets could not be loaded.");
            return;
        }

        // Create layers
        const pathLayer = map.createLayer('Path layer', [wallsFloorTileset, waterTileset], 0, 0);
        const terrainLayer = map.createLayer('Terrain layer', [wallsFloorTileset, waterTileset], 0, 0);

        if (!pathLayer || !terrainLayer) {
            console.error("One or both layers are missing!");
            return;
        }

        // Initialize logicMap
        this.logicMap = Array.from({ length: map.height }, () => Array(map.width).fill(0));

        // Set properties based on the terrainLayer's tiles
        terrainLayer.forEachTile((tile: Phaser.Tilemaps.Tile) => {
            const y = tile.y;
            const x = tile.x;

            if (tile.properties && tile.properties.type) {
                const type = tile.properties.type;
                this.logicMap[y][x] = type === 'ground' ? 0 : type === 'obstacle' ? 2 : 9;
            } else {
                console.warn(`Tile at (${x}, ${y}) has no properties.`);
                this.logicMap[y][x] = 9;
            }
            if (tile.properties) {
                const type = tile.properties.type;
                if (type === 'ground') {
                    this.logicMap[y][x] = 0; // Ground is free space
                } else if (type === 'obstacle') {
                    this.logicMap[y][x] = 2; // Obstacle (cannot place tower here)
                } else {
                    this.logicMap[y][x] = 9; // Unknown/other
                }
            } else {
                console.warn(`Tile at (${x}, ${y}) has no properties.`);
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

        // Handle player input
        this.input.on('pointerdown', (pointer: Phaser.Input.Pointer) => {
            const tileX = Math.floor(pointer.x / (this.tileSize * this.tileScale));
            const tileY = Math.floor(pointer.y / (this.tileSize * this.tileScale));

            console.log("Clicked tile:", tileX, tileY); // Check if the coordinates are correct

            // Check if tileX and tileY are within bounds of the logicMap
            if (tileY < 0 || tileY >= this.logicMap.length || tileX < 0 || tileX >= this.logicMap[tileY].length) {
                console.log("Clicked outside valid tile area.");
                return;
            }

            const logicValue = this.logicMap[tileY][tileX];
            if (!this.selectedTowerType) {
                console.log("No tower selected!");
                return;
            }

            if (logicValue === 9) {
                console.log("Can't place tower here!");
                return;
            }

            this.placeTower(tileX, tileY, this.selectedTowerType);
            this.selectedTowerType = null; // reset after placing
        });

        // Example towers and enemies
        this.towers.push(new Tower(this, 300, 350, TowerType.Fire));
        this.enemies.push(new Enemy(this, 100, 100, this.path));

        // Place tower event listener
        this.events.on('tower-selected', (towerType: TowerType) => {
            this.selectedTowerType = towerType;
            console.log(`Tower selected:`, this.selectedTowerType);
        });

        // Start round logic
        console.table(this.logicMap);
    }

    update(time: number, delta: number) {
        // Update enemies and towers each frame
        this.enemies = this.enemies.filter(enemy => {
            enemy.update(time, delta);
            return enemy.active; // or whatever flag you're using to check if it's still in the game
        });
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

    private getTileAt(x: number, y: number): { x: number, y: number } | null {
        // Convert world coords to tile coords and check if valid
        return { x: Math.floor(x / 32), y: Math.floor(y / 32) }; // example for 32x32 grid
    }

    private canPlaceTowerHere(x: number, y: number): boolean {
        // Ensure that the coordinates are within bounds of the logicMap
        if (y < 0 || y >= this.logicMap.length || x < 0 || x >= this.logicMap[y].length) {
            console.log("Invalid tile coordinates:", x, y);
            return false;
        }

        const tileValue = this.logicMap[y][x];
        console.log("Checking if tower can be placed on tile:", tileValue);
        return tileValue === 0; // Only allow placement on ground (value 0)
    }

    placeTower(x: number, y: number, towerType: TowerType) {
        console.log(`Placing ${towerType} tower at (${x}, ${y})`);
        const tileValue = this.logicMap[y][x];
        console.log("Tile value at", x, y, "is", tileValue);

        if (!this.canPlaceTowerHere(x, y)) {
            console.log("Can't place tower here!");
            return;
        }

        const newTower = new Tower(
            this,
            x * this.tileSize * this.tileScale,
            y * this.tileSize * this.tileScale,
            towerType
        );

        this.towers.push(newTower);
    }

    selectTower(towerType: TowerType) {
        this.selectedTowerType = towerType;
        console.log("Tower selected in scene:", this.selectedTowerType);
    }
}