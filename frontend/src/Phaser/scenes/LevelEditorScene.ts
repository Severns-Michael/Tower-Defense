import Phaser from 'phaser';

export class LevelEditorScene extends Phaser.Scene {
    private gridSize = 16;
    private rows = 20;
    private cols = 30;
    private selectedTileType = 0;  // Default to 0 or some other initial tile
    private tilemap!: Phaser.Tilemaps.Tilemap;
    private tileset!: Phaser.Tilemaps.Tileset;
    private layer!: Phaser.Tilemaps.TilemapLayer;

    constructor() {
        super({ key: 'LevelEditorScene' });
    }

    preload() {
        this.load.image('grass_tileset', 'assets/grass_tileset.png');
        this.load.image('stone_tileset', 'assets/tilesets/stone_ground_tileset.png');
        this.load.image('wall_tileset', 'assets/tilesets/wall_tileset.png');
        this.load.image('Struct_tileset', 'assets/tilesets/Struct_tileset.png');
    }

    create() {
        this.tilemap = this.make.tilemap({
            tileWidth: 32,
            tileHeight: 32,
            width: this.cols,
            height: this.rows,
        });

        // Corrected the tileset name to match the preload key
        this.tileset = this.tilemap.addTilesetImage('grass_tileset', undefined, 32, 32)!;
        this.layer = this.tilemap.createBlankLayer('Ground', this.tileset)!;

        this.input.on('pointerdown', this.handlePointerDown, this);

        // Listen for tile selection from the GameCanvas
        this.events.on('tile-selected', this.handleTileSelected, this);
    }

    handlePointerDown(pointer: Phaser.Input.Pointer) {
        const worldPoint = pointer.positionToCamera(this.cameras.main) as Phaser.Math.Vector2;
        const tileX = this.layer.worldToTileX(worldPoint.x);
        const tileY = this.layer.worldToTileY(worldPoint.y);

        // Log tile placement for debugging
        console.log(`Placing tile at: (${tileX}, ${tileY}) with type: ${this.selectedTileType}`);

        // Place the selected tile
        this.layer.putTileAt(this.selectedTileType, tileX, tileY);
    }

    handleTileSelected(tileIndex: number) {
        console.log(`Tile selected: ${tileIndex}`);  // Log the selected tile for debugging
        this.selectedTileType = tileIndex;  // Update the selected tile type
    }
}