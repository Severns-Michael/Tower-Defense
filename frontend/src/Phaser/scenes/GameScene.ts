import Phaser from 'phaser';
import { Tower } from '../Objects/Tower';
import { Enemy } from '../Objects/Enemy';
import { TowerType } from '../Utils/TowerData';

type LayerName = 'Ground' | 'Path' | 'Obstacles' | 'Props';

export default class MainScene extends Phaser.Scene {
    towers: Tower[] = [];
    enemies: Enemy[] = [];
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
    groundLayer!: Phaser.Tilemaps.TilemapLayer;
    pathLayer!: Phaser.Tilemaps.TilemapLayer;
    obstaclesLayer!: Phaser.Tilemaps.TilemapLayer;
    propsLayer!: Phaser.Tilemaps.TilemapLayer;

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

        // Create the base Tilemap
        this.tilemap = this.make.tilemap({
            tileWidth: this.tileSize,
            tileHeight: this.tileSize,
            width: this.mapData.width,
            height: this.mapData.height
        });

        // Load tilesets
        const grassTileset = this.tilemap.addTilesetImage('grass_tileset');
        const stoneTileset = this.tilemap.addTilesetImage('stone_tileset');
        const wallTileset = this.tilemap.addTilesetImage('wall_tileset');
        const structTileset = this.tilemap.addTilesetImage('Struct_tileset');

        if (!grassTileset || !stoneTileset || !wallTileset || !structTileset) {
            console.error('Tilesets not found!');
            return;
        }

        // Create blank layers
        const groundLayer = this.tilemap.createBlankLayer('Ground', grassTileset)!;
        const pathLayer = this.tilemap.createBlankLayer('Path', stoneTileset)!;
        const obstaclesLayer = this.tilemap.createBlankLayer('Obstacles', wallTileset)!;
        const propsLayer = this.tilemap.createBlankLayer('Props', structTileset)!;

        // Fill in the tiles from your custom JSON
        this.populateLayer(this.mapData.layers, 'Ground', groundLayer);
        this.populateLayer(this.mapData.layers, 'Path', pathLayer);
        this.populateLayer(this.mapData.layers, 'Obstacles', obstaclesLayer);
        this.populateLayer(this.mapData.layers, 'Props', propsLayer);

        this.spawnPoints = this.mapData.spawnPoints;
        this.endPoints = this.mapData.endPoints.map((point: { x: number, y: number }) => new Phaser.Math.Vector2(point.x, point.y));

        // Set up collision for obstacles
        obstaclesLayer.setCollisionBetween(0, 999);  // Mark all tiles as colliding

        // Save the layers if you want to access them later
        this.groundLayer = groundLayer;
        this.pathLayer = pathLayer;
        this.obstaclesLayer = obstaclesLayer;
        this.propsLayer = propsLayer;
        this.setupInputHandlers();

        // Extract path and create enemies
        const pathLayerz = this.mapData.layers.find((layer: any) => layer.name === 'Path');
        if (!pathLayerz) {
            console.error('Path layer not found in map data!');
            return;
        }


        const path = this.extractPathFromLayer(pathLayerz.data, this.mapData.width);


        // Now, draw the path on the screen
        this.drawPath(path);

        // Create enemies with the extracted path
        this.spawnPoints.forEach(spawnPoint => {
            this.createEnemy(spawnPoint.x, spawnPoint.y, path);  // Pass the path to each enemy
        });

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


    private createEnemy(x: number, y: number, path: Phaser.Math.Vector2[]) {
        // Center the enemy on the path tile
        const enemy = new Enemy(this, x, y, path);

        // Set the depth of the enemy
        enemy.setDepth(15);  // Make sure this depth is higher than your tile layers

        this.enemies.push(enemy);

    }


    update(time: number, delta: number) {
        // Update each enemy, ensuring they follow the path
        this.enemies.forEach(enemy => {
            enemy.update(time, delta);
        });
        this.towers.forEach(tower => {
            tower.update(time, delta, this.enemies);
        });

    }

    canPlaceTowerHere(tileX: number, tileY: number): boolean {
        if (!this.groundLayer || !this.obstaclesLayer || !this.pathLayer) {
            console.error('One or more required layers missing.');
            return false;
        }

        const groundTile = this.groundLayer.getTileAt(tileX, tileY);
        const pathTile = this.pathLayer.getTileAt(tileX, tileY);
        const obstacleTile = this.obstaclesLayer.getTileAt(tileX, tileY);

        if (!groundTile) {
            console.log('No ground tile here.');
            return false;
        }

        if (obstacleTile) {
            console.log('Obstacle blocking the tile.');
            return false;
        }

        if (pathTile) {
            console.log('Path is blocking the tile.');
            return false;
        }

        // NEW: Check if there's already a tower at this tile
        const tileSize = this.tileSize * this.tileScale;
        const existingTower = this.towers.find(tower => {
            return Math.floor(tower.x / tileSize) === tileX && Math.floor(tower.y / tileSize) === tileY;
        });

        if (existingTower) {
            console.log('Already a tower here.');
            return false;
        }

        return true;
    }

    placeTower(x: number, y: number, towerType: TowerType) {
        if (!this.canPlaceTowerHere(x, y)) {
            console.log("Can't place tower here!");
            return;
        }

        const tileSize = this.tileSize * this.tileScale;
        const newTower = new Tower(
            this,
            x * tileSize + tileSize / 2,
            y * tileSize + tileSize / 2,
            towerType
        );

        this.towers.push(newTower);
    }

    setupInputHandlers() {
        this.input.on('pointerdown', (pointer: Phaser.Input.Pointer) => {
            const tileX = Math.floor(pointer.x / (this.tileSize * this.tileScale));
            const tileY = Math.floor(pointer.y / (this.tileSize * this.tileScale));
            if (this.selectedTowerType && this.canPlaceTowerHere(tileX, tileY)) {
                console.log('Placing tower at:', tileX, tileY);
                this.placeTower(tileX, tileY, this.selectedTowerType);
            }
        });

        this.events.on('tower-selected', (towerType: TowerType) => {
            this.selectedTowerType = towerType;
            console.log('Tower selected:', towerType);
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

        return path;
    }
    private populateLayer(layersData: any[], targetName: string, tilemapLayer: Phaser.Tilemaps.TilemapLayer) {
        const layerData = layersData.find(layer => layer.name === targetName);

        if (!layerData) {
            console.warn(`Layer ${targetName} not found in map data`);
            return;
        }

        layerData.data.forEach((tileIndex: number, i: number) => {
            const x = i % this.mapData.width;
            const y = Math.floor(i / this.mapData.width);

            if (tileIndex !== -1) {
                tilemapLayer.putTileAt(tileIndex, x, y);
            }
        });

        tilemapLayer.setDepth(this.layerDepthMap[targetName as LayerName] || 0);
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