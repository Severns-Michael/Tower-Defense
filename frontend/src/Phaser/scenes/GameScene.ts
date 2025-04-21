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
    path: Phaser.Math.Vector2[] = []; // 👈 add this
    private highlightTile?: Phaser.GameObjects.Rectangle;

    constructor() {
        super('MainScene');
    }


    preload() {
        this.load.tilemapTiledJSON('map', 'assets/map_basic4.json');
        this.load.image('walls_floor', 'assets/walls_floor.png'); // Correct path to tileset image
        this.load.image('water', 'assets/Water_coasts_animation.png'); // Correct path to the second tileset image (if applicable)
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

            // Ensure the row exists before trying to access it
            if (!this.logicMap[y]) {
                this.logicMap[y] = []; // Initialize the row if it doesn't exist
            }

            const type = tile.properties?.type;
            if (type === 'ground') {
                this.logicMap[y][x] = 0;
            } else if (type === 'obstacle') {
                this.logicMap[y][x] = 2;
            } else {
                this.logicMap[y][x] = 9; // Unknown/other
            }
        });
        terrainLayer.forEachTile((tile: Phaser.Tilemaps.Tile) => {
            const y = tile.y;
            const x = tile.x;
            console.log(`Tile coordinates: (${x}, ${y})`);
        });
        console.log(map.layers);  // This will show you all the layers in the tilemap

// Fill in paths (same logic for paths as above)
        pathLayer.forEachTile((tile: Phaser.Tilemaps.Tile) => {
            const y = tile.y;
            const x = tile.x;

            // Ensure the row exists before trying to access it
            if (!this.logicMap[y]) {
                this.logicMap[y] = []; // Initialize the row if it doesn't exist
            }

            const type = tile.properties?.type;
            if (type === 'path') {
                this.logicMap[y][x] = 1;
            }
        });
        console.log("Generated logicMap:", this.logicMap);

        this.path.forEach(p => {
            this.add.circle(p.x, p.y, 5, 0xff0000).setDepth(10);
        });
        // path
        this.path = [
            new Phaser.Math.Vector2(100, 100),
            new Phaser.Math.Vector2(100, 300),
            new Phaser.Math.Vector2(300, 300),
            new Phaser.Math.Vector2(300, 500),
        ];
        this.path.forEach((p: Phaser.Math.Vector2) => {
            this.add.circle(p.x, p.y, 5, 0xff0000).setDepth(10);
        });




        // Handle pointer tower placement
        this.input.on('pointerdown', (pointer: Phaser.Input.Pointer) => {
            const x = Math.floor(pointer.x / tileSize);
            const y = Math.floor(pointer.y / tileSize);

            if (this.logicMap[y] && this.logicMap[y][x] === 0) {
                this.placeTower({ x: x * tileSize, y: y * tileSize, type: 'fire' });
                this.logicMap[y][x] = 3; // Mark as occupied
            } else {
                console.log("Can't place tower here!");
            }
        });

        // Handle external event tower placement
        window.addEventListener('place-tower', (event: any) => {
            const { x, y, type } = event.detail;
            this.placeTower({ x, y, type });
        });

        // Debug/test towers and enemies
        this.towers.push(new Tower(this, 200, 300, 'fire'));
        this.enemies.push(new Enemy(this, 100, 100, this.path));

        // Add hover tile highlight
        this.highlightTile = this.add.rectangle(0, 0, tileSize, tileSize, 0x00ff00, 0.3).setOrigin(0).setVisible(false);

        this.input.on('pointermove', (pointer: Phaser.Input.Pointer) => {
            const x = Math.floor(pointer.x / tileSize);
            const y = Math.floor(pointer.y / tileSize);

            if (this.logicMap[y] && this.logicMap[y][x] === 0) {
                this.highlightTile!.setPosition(x * tileSize, y * tileSize);
                this.highlightTile!.setFillStyle(0x00ff00, 0.3); // green for valid
                this.highlightTile!.setVisible(true);
            } else {
                this.highlightTile!.setFillStyle(0xff0000, 0.3); // red for invalid
                this.highlightTile!.setPosition(x * tileSize, y * tileSize);
                this.highlightTile!.setVisible(true);
            }
        });
    }

    update(time: number, delta: number) {
        this.enemies.forEach(enemy => enemy.update(time, delta));
        this.towers.forEach(tower => tower.update(time, delta, this.enemies));
    }

    placeTower(data: { x: number; y: number; type: TowerType }) {
        console.log(`Placing tower at (${data.x}, ${data.y}) of type: ${data.type}`);
        this.towers.push(new Tower(this, data.x, data.y, data.type));
    }

    shutdown() {
        EventBus.off('place-tower', this.placeTower, this);
    }

    upgradeTower(towerId: string, newLevel: number) {
        EventBus.emit('tower-upgraded', {
            towerId,
            newLevel
        });
    }

}