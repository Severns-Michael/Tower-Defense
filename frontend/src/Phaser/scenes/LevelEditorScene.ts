import Phaser from 'phaser';


export class LevelEditorScene extends Phaser.Scene {
    private gridSize = 16;
    private rows = 20;
    private cols = 30;
    private selectedTileType = 0;  // Default to 0 or some other initial tile
    private tilemap!: Phaser.Tilemaps.Tilemap;
    public tilesets: Phaser.Tilemaps.Tileset[] = [];  // Array of tilesets
    public layers: Phaser.Tilemaps.TilemapLayer[] = [];  // Layers for the map
    private selectedLayerIndex: number = 0; // Tracks the currently selected layer

    constructor() {
        super({ key: 'LevelEditorScene' });
    }

    preload() {
        // Loading tilesets
        this.load.image('grass_tileset', 'assets/grass_tileset.png');
        this.load.image('stone_tileset', 'assets/tilesets/stone_ground_tileset.png');
        this.load.image('wall_tileset', 'assets/tilesets/wall_tileset.png');
        this.load.image('Struct_tileset', 'assets/tilesets/Struct_tileset.png');
    }

    create() {
        // Create tilemap with fixed grid size
        this.tilemap = this.make.tilemap({ tileWidth: 32, tileHeight: 32, width: this.cols, height: this.rows });

        // Add tilesets to the map
        this.tilesets = [
            this.tilemap.addTilesetImage('grass_tileset', undefined, 32, 32)!,
            this.tilemap.addTilesetImage('stone_tileset', undefined, 32, 32)!,
            this.tilemap.addTilesetImage('wall_tileset', undefined, 32, 32)!,
            this.tilemap.addTilesetImage('Struct_tileset', undefined, 32, 32)!,
        ];

        // Add multiple layers and store them in an array
        this.layers = [
            this.tilemap.createBlankLayer('Ground', this.tilesets[0])!,
            this.tilemap.createBlankLayer('Path', this.tilesets[1])!,
            this.tilemap.createBlankLayer('Obstacles', this.tilesets[2])!,
            this.tilemap.createBlankLayer('Props', this.tilesets[3])!,
        ];

        // Set all layers visible initially
        this.layers.forEach(layer => layer.setAlpha(1));

        // Handle tile placement when mouse is clicked
        this.input.on('pointerdown', this.handlePointerDown, this);

        // Listen for tile selection event from the UI
        this.events.on('tile-selected', this.handleTileSelected, this);
    }

    handlePointerDown(pointer: Phaser.Input.Pointer) {
        // Calculate which tile to place based on mouse position
        const worldPoint = pointer.positionToCamera(this.cameras.main) as Phaser.Math.Vector2;
        const tileX = this.layers[this.selectedLayerIndex].worldToTileX(worldPoint.x);
        const tileY = this.layers[this.selectedLayerIndex].worldToTileY(worldPoint.y);

        console.log(`Placing tile at: (${tileX}, ${tileY}) on layer: ${this.selectedLayerIndex} with tile index: ${this.selectedTileType}`);
        this.layers[this.selectedLayerIndex].putTileAt(this.selectedTileType, tileX, tileY);
    }

    handleTileSelected({ tileIndex, paletteIndex }: { tileIndex: number; paletteIndex: number }) {
        // Update the tile index for the current layer
        this.selectedTileType = tileIndex;

        // Here you might want to do something with the selected tileset, e.g. update the active tileset or palette.
        // The tileset is already selected in the tilesets array using paletteIndex.
        const selectedTileset = this.tilesets[paletteIndex];  // Store the selected tileset if needed

        console.log(`Selected tileset: `, selectedTileset);
    }

    // Method to toggle layer visibility
    toggleLayerVisibility(layerIndex: number, isVisible: boolean) {
        const layer = this.layers[layerIndex];
        layer.setAlpha(isVisible ? 1 : 0.5);
    }

    // Method to change selected layer
    selectLayer(layerIndex: number) {
        this.selectedLayerIndex = layerIndex;
    }
}