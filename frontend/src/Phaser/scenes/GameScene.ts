import Phaser from 'phaser';
import { Tower } from '../Objects/Tower';
import { Enemy } from '../Objects/Enemy';
import { TowerType } from '../Utils/TowerData';

type LayerName = 'Ground' | 'Path' | 'Obstacles' | 'Props';

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
    private mapData!: any;
    private tileSize: number = 32;
    private tileScale: number = 1;
    spawnPoints: { x: number, y: number }[] = [];
    endPoints: Phaser.Math.Vector2[] = [];
    private layerDepthMap = {
        Ground: 0,
        Path: 1,
        Obstacles: 2,
        Props: 3,
    };

    private tilemap: Phaser.Tilemaps.Tilemap | null = null;

    constructor() {
        super('GameScene');
    }

    preload() {
        this.load.json('map', 'assets/custom_map3.json');

        // ✅ Load tilesets as spritesheets (frameWidth, frameHeight)
        this.load.spritesheet('grass_tileset', 'assets/tilesets/grass_tileset.png', { frameWidth: 32, frameHeight: 32 });
        this.load.spritesheet('stone_tileset', 'assets/tilesets/stone_ground_tileset.png', { frameWidth: 32, frameHeight: 32 });
        this.load.spritesheet('wall_tileset', 'assets/tilesets/wall_tileset.png', { frameWidth: 32, frameHeight: 32 });
        this.load.spritesheet('Struct_tileset', 'assets/tilesets/Struct_tileset.png', { frameWidth: 32, frameHeight: 32 });

    }

    create() {
        this.mapData = this.cache.json.get('map');
        this.tilemap = this.make.tilemap({ key: 'map' });

        const obstaclesLayer = this.tilemap.getLayer('Obstacles') as unknown;
        if (obstaclesLayer && (obstaclesLayer as Phaser.Tilemaps.TilemapLayer).setCollisionByProperty) {
            (obstaclesLayer as Phaser.Tilemaps.TilemapLayer).setCollisionByProperty({ collides: true });
        }

        const pathLayerz = this.tilemap.getLayer('Path') as unknown;
        if (pathLayerz && (pathLayerz as Phaser.Tilemaps.TilemapLayer).setCollisionByProperty) {
            (pathLayerz as Phaser.Tilemaps.TilemapLayer).setCollisionByProperty({ collides: false });
        }

        if (!this.mapData) {
            console.error('Map or tileset data not found!');
            return;
        }
        console.log('Map Data:', this.mapData);

        // Log layers to check their structure
        this.mapData.layers.forEach((layer: any) => {
            if (layer.type !== 'tilelayer') return;

            const layerName = layer.name as LayerName;
            const tilesetKey = {
                Ground: 'grass_tileset',
                Path: 'stone_tileset',
                Obstacles: 'wall_tileset',
                Props: 'Struct_tileset',
            }[layerName];


            if (!tilesetKey) {
                console.warn(`Unknown layer: ${layerName}`);
                return;
            }

            this.createLayerFromTiles(layer.data, layerName, tilesetKey, this.mapData.width);
        });

        const tilesets = {
            'Ground': 'grass_tileset',
            'Path': 'stone_tileset',
            'Obstacles': 'wall_tileset',
            'Props': 'Struct_tileset',
        };

        console.log('Layers:', this.mapData.layers);

        this.logicMap = this.mapData.logicMap;
        this.spawnPoints = this.mapData.spawnPoints;
        this.endPoints = this.mapData.endPoints.map((point: { x: number, y: number }) => new Phaser.Math.Vector2(point.x, point.y));

        this.setupInputHandlers();
        this.addCollisionDebugGraphics();

        // Extract path and create enemies
        const pathLayer = this.mapData.layers.find((layer: any) => layer.name === 'Path');
        if (!pathLayer) {
            console.error('Path layer not found in map data!');
            return;
        }


        const path = this.extractPathFromLayer(pathLayer.data, this.mapData.width);
        console.log('Extracted Path:', path);

        // Now, draw the path on the screen
        this.drawPath(path);

        // Create enemies with the extracted path
        this.spawnPoints.forEach(spawnPoint => {
            this.createEnemy(spawnPoint.x, spawnPoint.y, path);  // Pass the path to each enemy
        });
        const graphics = this.add.graphics({ lineStyle: { width: 2, color: 0xff0000 } });

    }
    private drawPath(path: Phaser.Math.Vector2[]) {
        const graphics = this.add.graphics();
        graphics.lineStyle(2, 0xff0000, 1); // Red color, 100% alpha

        // Set the depth of the path to be above the tiles
        graphics.setDepth(15); // Make sure this depth is higher than your tile layers

        // Start drawing the path
        path.forEach((point, index) => {
            if (index === 0) {
                graphics.moveTo(point.x, point.y);
            } else {
                graphics.lineTo(point.x, point.y);
            }
        });

        graphics.strokePath();
    }





    private createLayerFromTiles(tiles: number[], layerName: LayerName, tilesetKey: string, mapWidth: number) {
        const group = this.add.group();

        tiles.forEach((tileIndex, i) => {
            if (tileIndex === -1) return; // Skip empty spaces

            const x = (i % mapWidth) * this.tileSize * this.tileScale;
            const y = Math.floor(i / mapWidth) * this.tileSize * this.tileScale;

            const frameIndex = tileIndex; // 0-based frame numbers match!

            this.add.image(x, y, tilesetKey, frameIndex)
                .setOrigin(0)
                .setScale(this.tileScale)
                .setDepth((this.layerDepthMap)[layerName]);

        });

        const graphics = this.add.graphics();
        graphics.lineStyle(1, 0xffffff, 0.3); // white lines, 30% opacity

        for (let x = 0; x <= this.mapData.width; x++) {
            graphics.moveTo(x * this.tileSize * this.tileScale, 0);
            graphics.lineTo(x * this.tileSize * this.tileScale, this.mapData.height * this.tileSize * this.tileScale);
        }

        for (let y = 0; y <= this.mapData.height; y++) {
            graphics.moveTo(0, y * this.tileSize * this.tileScale);
            graphics.lineTo(this.mapData.width * this.tileSize * this.tileScale, y * this.tileSize * this.tileScale);
        }

        graphics.strokePath();
    }

    private createEnemy(x: number, y: number, path: Phaser.Math.Vector2[]) {
        // Center the enemy on the path tile
        const enemy = new Enemy(this, x, y, path);

        // Set the depth of the enemy
        enemy.setDepth(15);  // Make sure this depth is higher than your tile layers

        this.enemies.push(enemy);
        console.log('Enemy spawn position:', x, y);
        console.log('Path passed to enemy:', path);
    }


    update(time: number, delta: number) {
        // Update each enemy, ensuring they follow the path
        this.enemies.forEach(enemy => {
            enemy.update(time, delta);
        });

    }

    canPlaceTowerHere(x: number, y: number): boolean {
        if (y < 0 || y >= this.logicMap.length || x < 0 || x >= this.logicMap[y].length) {
            console.log('Invalid tile coordinates:', x, y);
            return false;
        }
        return this.logicMap[y][x] === 0;
    }

    placeTower(x: number, y: number, towerType: TowerType) {
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
        this.input.on('pointerdown', (pointer: Phaser.Input.Pointer) => {
            const tileX = Math.floor(pointer.x / (this.tileSize * this.tileScale));
            const tileY = Math.floor(pointer.y / (this.tileSize * this.tileScale));
            if (this.selectedTowerType && this.canPlaceTowerHere(tileX, tileY)) {
                this.placeTower(tileX, tileY, this.selectedTowerType);
            }
        });

        this.events.on('tower-selected', (towerType: TowerType) => {
            this.selectedTowerType = towerType;
        });

        this.input.on('wheel', (pointer: Phaser.Input.Pointer) => {
            const scaleChange = pointer.deltaY > 0 ? 0.1 : -0.1;
            this.cameras.main.zoom = Phaser.Math.Clamp(this.cameras.main.zoom + scaleChange, 0.5, 2);
        });
    }
    extractPathFromLayer(pathLayerData: number[], mapWidth: number) {
        let path: Phaser.Math.Vector2[] = [];
        let spawnPoint: Phaser.Math.Vector2 | null = null;
        let endPoint: Phaser.Math.Vector2 | null = null;

        // Use the mapData spawn and end points directly
        if (this.mapData.spawnPoints.length > 0) {
            spawnPoint = new Phaser.Math.Vector2(
                this.mapData.spawnPoints[0].x * this.tileSize * this.tileScale + this.tileSize / 2,
                this.mapData.spawnPoints[0].y * this.tileSize * this.tileScale + this.tileSize / 2
            );
        } else {
            console.warn('Missing spawn point, using default (0,0).');
            spawnPoint = new Phaser.Math.Vector2(0, 0);  // Default spawn point
        }

        if (this.mapData.endPoints.length > 0) {
            endPoint = new Phaser.Math.Vector2(
                this.mapData.endPoints[0].x * this.tileSize * this.tileScale + this.tileSize / 2,
                this.mapData.endPoints[0].y * this.tileSize * this.tileScale + this.tileSize / 2
            );
        } else {
            console.warn('Missing end point, using default (0,0).');
            endPoint = new Phaser.Math.Vector2(0, 0);  // Default end point
        }

        // Extract the path from the path layer, skipping spawn and end points
        pathLayerData.forEach((tileIndex, i) => {
            const x = (i % mapWidth) * this.tileSize * this.tileScale + this.tileSize / 2;
            const y = Math.floor(i / mapWidth) * this.tileSize * this.tileScale + this.tileSize / 2;

            // Only add to path if it's not the spawn or end point
            if (
                (spawnPoint && !spawnPoint.equals(new Phaser.Math.Vector2(x, y))) &&
                (endPoint && !endPoint.equals(new Phaser.Math.Vector2(x, y)))
            ) {
                if (tileIndex !== -1) { // Valid path tile
                    path.push(new Phaser.Math.Vector2(x, y));
                }
            }
        });

        if (spawnPoint && !path[0].equals(spawnPoint)) {
            path.unshift(spawnPoint);  // Add the spawn point at the start if missing
        }

        if (endPoint && !path[path.length - 1].equals(endPoint)) {
            path.push(endPoint);  // Forcefully add the endpoint at the end if it's missing
        }

        // Debugging: Log the final path
        console.log("Final Path:", path);
        console.log("Path Length:", path.length);

        return path;
    }


    private addCollisionDebugGraphics() {
        const graphics = this.add.graphics();

        // Set the line style for the debug rectangles
        graphics.lineStyle(2, 0xff0000, 1); // Red color, 100% alpha

        // Check if tilemap is not null before proceeding
        if (this.tilemap) {
            // Iterate through the tilemap to find the tiles with collisions
            this.tilemap.layers.forEach((layer: any) => {
                if (layer.properties.isColliding) {
                    layer.data.forEach((tile: any) => {
                        if (tile.index !== -1 && tile.properties.isColliding) {
                            const tileX = tile.pixelX;
                            const tileY = tile.pixelY;

                            // Ensure tileWidth and tileHeight are accessed only after null check
                            if (this.tilemap) {
                                const tileWidth = this.tilemap.tileWidth;
                                const tileHeight = this.tilemap.tileHeight;

                                // Draw a debug rectangle
                                graphics.strokeRect(tileX, tileY, tileWidth, tileHeight);
                            }
                        }
                    });
                }
            });
        }
    }




}