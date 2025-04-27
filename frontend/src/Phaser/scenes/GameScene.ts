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
    private tileSize: number = 32;
    private tileScale: number = 1;
    spawnPoints: { x: number, y: number }[] = [];
    endPoints: Phaser.Math.Vector2[] = [];

    constructor() {
        super('GameScene');
    }

    preload() {
        this.load.json('map', 'assets/custom_map2.json');

        // ✅ Load tilesets as spritesheets (frameWidth, frameHeight)
        this.load.spritesheet('grass_tileset', 'assets/tilesets/grass_tileset.png', { frameWidth: 32, frameHeight: 32 });
        this.load.spritesheet('stone_tileset', 'assets/tilesets/stone_ground_tileset.png', { frameWidth: 32, frameHeight: 32 });
        this.load.spritesheet('wall_tileset', 'assets/tilesets/wall_tileset.png', { frameWidth: 32, frameHeight: 32 });
        this.load.spritesheet('Struct_tileset', 'assets/tilesets/Struct_tileset.png', { frameWidth: 32, frameHeight: 32 });
    }

    create() {
        const mapData = this.cache.json.get('map');

        if (!mapData) {
            console.error('Map or tileset data not found!');
            return;
        }

        const tilesets = {
            'Ground': 'grass_tileset',
            'Path': 'stone_tileset',
            'Obstacles': 'wall_tileset',
            'Props': 'Struct_tileset',
        };

        mapData.layers.forEach((layer: any) => {
            if (layer.type === 'tilelayer') {
                const layerName = layer.name as LayerName;
                this.createLayerFromTiles(layer.data, layerName, tilesets[layerName], mapData.width);
            }
        });

        this.logicMap = mapData.logicMap;
        this.spawnPoints = mapData.spawnPoints;
        this.endPoints = mapData.endPoints.map((point: { x: number, y: number }) => new Phaser.Math.Vector2(point.x, point.y));

        this.setupInputHandlers();

        this.spawnPoints.forEach(spawnPoint => {
            this.createEnemy(spawnPoint.x, spawnPoint.y);
        });
    }

    private createLayerFromTiles(
        tiles: number[],
        layerName: LayerName,
        tilesetKey: string,
        mapWidth: number
    ) {
        const group = this.add.group();

        tiles.forEach((tileIndex, i) => {
            if (tileIndex === -1 || tileIndex === 0) return;

            const x = (i % mapWidth) * this.tileSize * this.tileScale;
            const y = Math.floor(i / mapWidth) * this.tileSize * this.tileScale;

            // ✅ Select the specific tile frame (tileIndex - 1)
            const tile = this.add.image(x, y, tilesetKey, tileIndex - 1)
                .setOrigin(0)
                .setScale(this.tileScale);

            group.add(tile);
        });
    }

    private createEnemy(x: number, y: number) {
        const enemy = new Enemy(this, x * this.tileSize * this.tileScale, y * this.tileSize * this.tileScale, this.endPoints);
        this.enemies.push(enemy);
    }

    update(time: number, delta: number) {
        this.enemies = this.enemies.filter(enemy => {
            enemy.update(time, delta);
            return enemy.active;
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
}