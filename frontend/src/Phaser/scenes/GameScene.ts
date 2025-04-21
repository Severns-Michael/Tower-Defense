import Phaser from 'phaser';
import EventBus from '../Utils/EventBus';
import {Tower} from "../Objects/Tower";
import {Enemy} from "../Objects/Enemy";
import {TowerType} from '../Utils/TowerData';



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

        this.input.on('pointerdown', (pointer: Phaser.Input.Pointer) => {
            const tileX = Math.floor(pointer.x / this.tileSize);
            const tileY = Math.floor(pointer.y / this.tileSize);

            console.log("Clicked tile:", tileX, tileY);
            console.log("Selected tower:", this.selectedTowerType);

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
        this.towers.push(new Tower(this, 300, 350, TowerType.Fire ));
        this.enemies.push(new Enemy(this, 100, 100, this.path));


// place tower event listener
        this.events.on('tower-selected', (towerType: TowerType) => {
            this.selectedTowerType = towerType;
            console.log(`Tower selected:`, this.selectedTowerType);
        });

        // Start round logic

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
        // For now, let's fake it:
        return { x: Math.floor(x / 32), y: Math.floor(y / 32) }; // example for 32x32 grid
    }

    private canPlaceTowerHere(x: number, y: number): boolean {
        const tileValue = this.logicMap[y][x];
        if (tileValue === 0) {
            return true; // Ground tile, can place tower
        }
        return false; // Not ground (either path or obstacle)
    }

    placeTower(x: number, y: number, towerType: TowerType) {
        console.log(`Placing ${towerType} tower at (${x}, ${y})`);

        if (!this.canPlaceTowerHere(x, y)) {
            console.log("Can't place tower here!");
            return;
        }

        // Pass the TowerType to the constructor properly
        const newTower = new Tower(this, x * this.tileSize + this.tileSize / 2, y * this.tileSize + this.tileSize / 2, towerType);
        this.towers.push(newTower);
    }

    selectTower(towerType: TowerType) {
        this.selectedTowerType = towerType;
        console.log("Tower selected in scene:", this.selectedTowerType);
    }


}