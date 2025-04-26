import Phaser from 'phaser';
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
    private tileSize: number = 32;
    private tileScale: number = 1;

    // New properties for spawn and end points
    spawnPoints: { x: number, y: number }[] = [];
    endPoints: Phaser.Math.Vector2[] = []; // Using Phaser.Vector2[]

    constructor() {
        super('GameScene');
    }

    preload() {
        // Load tile images
        this.load.json('map', 'assets/custom_map2.json');
        this.load.image('grass_tileset', 'assets/tilesets/grass_tileset.png');
        this.load.image('stone_tileset', 'assets/tilesets/stone_ground_tileset.png');
        this.load.image('wall_tileset', 'assets/tilesets/wall_tileset.png');
        this.load.image('Struct_tileset', 'assets/tilesets/Struct_tileset.png');
    }

    create() {
        const mapData = this.cache.json.get('map');
        console.log('Map from cache:', this.cache.json.get('map'));


        if (!mapData) {
            console.error('Map or tileset data not found!');
            return;
        }
        mapData.layers.forEach((layer: any) => {
            if (layer.type === 'tilelayer') {
                this.createLayerFromTiles(
                    layer.data,
                    layer.name,
                    mapData.tilesets,
                    mapData.width
                );
            }
        });
        // Define tilesets
        const tilesets = {
            'grass_tileset': this.textures.get('grass_tileset'),
            'stone_tileset': this.textures.get('stone_tileset'),
            'wall_tileset': this.textures.get('wall_tileset'),
            'Struct_tileset': this.textures.get('Struct_tileset')
        };
        this.createLayerFromTiles(mapData.layers[0].data, 'Ground', tilesets, mapData);
        this.logicMap = mapData.logicMap;

        this.spawnPoints = mapData.spawnPoints;
        this.endPoints = mapData.endPoints.map((point: { x: number, y: number }) => new Phaser.Math.Vector2(point.x, point.y)); // Convert to Phaser.Math.Vector2



        this.setupInputHandlers();

        // Create enemies at spawn points
        this.spawnPoints.forEach(spawnPoint => {
            this.createEnemy(spawnPoint.x, spawnPoint.y);
        });
    }

    private createLayerFromTiles(
        tiles: number[],
        layerName: string,
        tilesets: any,
        mapWidth: number
    ) {
        const group = this.add.group();

        tiles.forEach((tileIndex, i) => {
            if (tileIndex === 0) return; // 0 = no tile

            const x = (i % mapWidth) * this.tileSize * this.tileScale;
            const y = Math.floor(i / mapWidth) * this.tileSize * this.tileScale;

            const tileKey = this.getTilesetKeyForLayer(layerName);
            const tile = this.add
                .image(x, y, tileKey)
                .setOrigin(0)
                .setScale(this.tileScale);

            group.add(tile);
        });

        return group;
    }

    private getTilesetKeyForLayer(layerName: string): string {
        switch (layerName) {
            case 'Ground': return 'grass_tileset';
            case 'Path': return 'stone_tileset';
            case 'Obstacles': return 'wall_tileset';
            case 'Props': return 'Struct_tileset';
            default: return 'grass_tileset';
        }
    }
    // Create an enemy at a specific spawn point
    private createEnemy(x: number, y: number) {
        const enemy = new Enemy(this, x * this.tileSize * this.tileScale, y * this.tileSize * this.tileScale, this.endPoints);
        this.enemies.push(enemy);
    }

    update(time: number, delta: number) {
        // Update enemies and towers each frame
        this.enemies = this.enemies.filter(enemy => {
            enemy.update(time, delta);
            return enemy.active; // or whatever flag you're using to check if it's still in the game
        });
    }

    canPlaceTowerHere(x: number, y: number): boolean {
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

    setupInputHandlers() {
        // Handle pointer clicks for tower placement
        this.input.on('pointerdown', (pointer: Phaser.Input.Pointer) => {
            const tileX = Math.floor(pointer.x / (this.tileSize * this.tileScale));
            const tileY = Math.floor(pointer.y / (this.tileSize * this.tileScale));
            if (this.canPlaceTowerHere(tileX, tileY)) {
                this.placeTower(tileX, tileY, this.selectedTowerType!);
            }
        });

        // Optionally: Handle tower selection via a UI event or hotkeys
        this.events.on('tower-selected', (towerType: TowerType) => {
            this.selectedTowerType = towerType;
        });

        // Handle zooming (optional)
        this.input.on('wheel', (pointer: Phaser.Input.Pointer, gameObjects: Phaser.GameObjects.GameObject[]) => {
            const scaleChange = pointer.deltaY > 0 ? 0.1 : -0.1;
            this.cameras.main.zoom += scaleChange;
            this.cameras.main.zoom = Phaser.Math.Clamp(this.cameras.main.zoom, 0.5, 2); // Clamped zoom
        });
    }


}