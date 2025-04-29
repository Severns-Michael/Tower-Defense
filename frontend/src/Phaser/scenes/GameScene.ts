import Phaser from 'phaser';
import { TowerType } from '../../types/Tower';
import { RoundManager } from "../../managers/RoundManager";
import { PlayerManager } from "../../managers/PlayerManager";
import { EnemyManager } from "../../managers/EnemyManager";
import { TowerManager } from "../../managers/TowerManager";
import { waves } from '../../types/waves';
import EventBus from "../Utils/EventBus";
import { extractPathFromLayer, drawPath } from '../Utils/PathUtils';
import { populateLayer } from '../Utils/TilemapUtils';
import {Enemy} from "../Objects/Enemy";

type LayerName = 'Ground' | 'Path' | 'Obstacles' | 'Props';

export default class MainScene extends Phaser.Scene {
    path: Phaser.Math.Vector2[] = [];
    roundManager!: RoundManager;
    playerManager!: PlayerManager;
    enemyManager!: EnemyManager;
    towerManager!: TowerManager;
    selectedTowerType: TowerType | null = null;
    currentRound: number = 1;
    private mapData!: any;
    private tileSize: number = 32;
    private tileScale: number = 1;

    spawnPoints: { x: number, y: number }[] = [];
    endPoints: Phaser.Math.Vector2[] = [];

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
        this.load.spritesheet('grass_tileset', 'assets/tilesets/grass_tileset.png', { frameWidth: 32, frameHeight: 32 });
        this.load.spritesheet('stone_tileset', 'assets/tilesets/stone_ground_tileset.png', { frameWidth: 32, frameHeight: 32 });
        this.load.spritesheet('wall_tileset', 'assets/tilesets/wall_tileset.png', { frameWidth: 32, frameHeight: 32 });
        this.load.spritesheet('Struct_tileset', 'assets/tilesets/Struct_tileset.png', { frameWidth: 32, frameHeight: 32 });
    }

    create() {
        this.mapData = this.cache.json.get('map');

        this.tilemap = this.make.tilemap({
            tileWidth: this.tileSize,
            tileHeight: this.tileSize,
            width: this.mapData.width,
            height: this.mapData.height
        });

        const grassTileset = this.tilemap.addTilesetImage('grass_tileset');
        const stoneTileset = this.tilemap.addTilesetImage('stone_tileset');
        const wallTileset = this.tilemap.addTilesetImage('wall_tileset');
        const structTileset = this.tilemap.addTilesetImage('Struct_tileset');

        if (!grassTileset || !stoneTileset || !wallTileset || !structTileset) {
            console.error('Tilesets not found!');
            return;
        }

        // Create layers
        this.groundLayer = this.tilemap.createBlankLayer('Ground', grassTileset)!;
        this.pathLayer = this.tilemap.createBlankLayer('Path', stoneTileset)!;
        this.obstaclesLayer = this.tilemap.createBlankLayer('Obstacles', wallTileset)!;
        this.propsLayer = this.tilemap.createBlankLayer('Props', structTileset)!;

        populateLayer(this.mapData.layers, 'Ground', this.groundLayer, this.mapData.width);
        populateLayer(this.mapData.layers, 'Path', this.pathLayer, this.mapData.width);
        populateLayer(this.mapData.layers, 'Obstacles', this.obstaclesLayer, this.mapData.width);
        populateLayer(this.mapData.layers, 'Props', this.propsLayer, this.mapData.width);

        this.spawnPoints = this.mapData.spawnPoints;
        this.endPoints = this.mapData.endPoints.map((point: { x: number, y: number }) =>
            new Phaser.Math.Vector2(point.x, point.y)
        );

        this.obstaclesLayer.setCollisionBetween(0, 999);

        // ✅ Extract Path BEFORE managers
        const pathLayerData = this.mapData.layers.find((layer: any) => layer.name === 'Path');
        if (!pathLayerData) {
            console.error('Path layer not found!');
            return;
        }

        this.path = extractPathFromLayer(
            pathLayerData.data,
            this.mapData.width,
            this.tileSize,
            this.tileScale,
            this.spawnPoints,
            this.mapData.endPoints
        );
        drawPath(this, this.path);

        // ✅ Create managers AFTER extracting path
        this.playerManager = new PlayerManager(this, 500, 100);
        this.enemyManager = new EnemyManager(this, this.path);
        this.towerManager = new TowerManager(
            this,
            this.playerManager,
            this.groundLayer,
            this.pathLayer,
            this.obstaclesLayer,
            this.tileSize,
            this.tileScale
        );

        // ✅ Create round manager
        this.roundManager = new RoundManager(waves, {
            onRoundStart: (round) => {
                console.log(`Round ${round} started`);
                this.currentRound = round;
                EventBus.emit('round-changed', { round });
            },
            onWaveStart: (wave) => {
                console.log(`Wave ${wave} started`);
            },
            onAllRoundsComplete: () => {
                console.log('All rounds complete!');
            },
            spawnEnemy: (type: string) => this.spawnEnemy(type),
        });
        EventBus.on('round-completed', () => {
            console.log('✅ Round completed triggered.');

            this.time.delayedCall(300, () => {
                console.log('💰 Rewarding player for completing Round', this.currentRound);
                this.playerManager.rewardForRound(this.currentRound);
            });
        });


        EventBus.on('enemy-killed', (data: { reward: number }) => {
            this.playerManager.earnMoney(data.reward);
        });

        EventBus.emit('round-changed', { round: this.currentRound });


        this.setupInputHandlers();
    }

    spawnEnemy(type: string) {
        const spawn = this.spawnPoints[0];
        this.enemyManager.spawnEnemy(spawn.x, spawn.y, this.handleEnemyReachedEnd.bind(this));
    }

    handleEnemyReachedEnd(enemy: Enemy) {
        enemy.destroy();
        this.enemyManager.removeEnemy(enemy);
        this.playerManager.takeDamage(10);
    }

    update(time: number, delta: number) {
        this.enemyManager.update(time, delta);
        this.towerManager.update(time, delta, this.enemyManager.enemies);

        if (this.enemyManager.enemies.length === 0 && this.roundManager.allWavesSpawned) {
            EventBus.emit('all-enemies-dead');
        }

    }

    setupInputHandlers() {
        this.input.on('pointerdown', (pointer: Phaser.Input.Pointer) => {
            const tileX = Math.floor(pointer.x / (this.tileSize * this.tileScale));
            const tileY = Math.floor(pointer.y / (this.tileSize * this.tileScale));
            if (this.selectedTowerType && this.towerManager.canPlaceTowerHere(tileX, tileY)) {
                this.towerManager.placeTower(tileX, tileY, this.selectedTowerType);
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
}

