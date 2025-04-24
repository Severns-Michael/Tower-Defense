export class LevelEditorScene extends Phaser.Scene {
    private gridSize = 16;
    private rows = 20;
    private cols = 30;
    private selectedTileType = 0;  // Default to 0 or some other initial tile
    private tilemap!: Phaser.Tilemaps.Tilemap;
    public tilesets: Phaser.Tilemaps.Tileset[] = [];  // Array of tilesets
    public layers: Phaser.Tilemaps.TilemapLayer[] = [];  // Layers for the map
    private selectedLayerIndex: number = 0; // Tracks the currently selected layer
    public spawnPoints: { x: number, y: number }[] = [];  // Array to store multiple spawn points
    public endPoints: { x: number, y: number }[] = [];    // Array to store multiple end points
    private isPlacingSpawnPoint = false;
    private isPlacingEndPoint = false;
    private isMouseDown = false; // To track mouse button state
    private isDragging = false;  // To track if the user is dragging
    private lastTileX = -1;
    private lastTileY = -1;

    constructor() {
        super({ key: 'LevelEditorScene' });
    }

    preload() {
        // Loading tilesets
        this.load.image('grass_tileset', 'assets/grass_tileset.png');
        this.load.image('stone_tileset', 'assets/tilesets/stone_ground_tileset.png');
        this.load.image('wall_tileset', 'assets/tilesets/wall_tileset.png');
        this.load.image('Struct_tileset', 'assets/tilesets/Struct_tileset.png');
        this.load.image('spawn_point_sprite', 'assets/sprites/spawn.png');
        this.load.image('end_point_sprite', 'assets/sprites/end.png');
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

        // Listen for tile selection event from the UI
        this.events.on('tile-selected', this.handleTileSelected, this);

        // Listen for layer change
        this.events.on('layer-selected', this.selectLayer, this);

        // Make grid for editor
        this.drawGrid();

        // Right-click delete
        this.input.on('pointerdown', this.handlePointerDown, this);
        this.input.on('pointermove', this.handlePointerMove, this);  // New pointer move listener
        this.input.on('pointerup', this.handlePointerUp, this);  // New pointer up listener
        this.input.mouse?.disableContextMenu(); // Prevent the browser right-click menu

        // Spawn listener
        this.events.on('start-placing-spawn', () => {
            this.isPlacingSpawnPoint = true;
            this.isPlacingEndPoint = false;
            console.log("Spawn point placement mode enabled");
        });

        this.events.on('start-placing-end', () => {
            this.isPlacingEndPoint = true;
            this.isPlacingSpawnPoint = false;
            console.log("End point placement mode enabled");
        });

        this.events.on('cancel-placement', () => {
            this.isPlacingSpawnPoint = false;
            this.isPlacingEndPoint = false;
            console.log("Special placement cancelled. Returning to normal tile placement.");
        });
    }

    private drawGrid() {
        const graphics = this.add.graphics();
        graphics.lineStyle(1, 0x888888, 0.3); // color and transparency of grid lines

        const mapWidth = this.cols * this.tilemap.tileWidth;
        const mapHeight = this.rows * this.tilemap.tileHeight;

        // Draw vertical lines
        for (let x = 0; x <= mapWidth; x += this.tilemap.tileWidth) {
            graphics.moveTo(x, 0);
            graphics.lineTo(x, mapHeight);
        }

        // Draw horizontal lines
        for (let y = 0; y <= mapHeight; y += this.tilemap.tileHeight) {
            graphics.moveTo(0, y);
            graphics.lineTo(mapWidth, y);
        }

        graphics.strokePath();
    }

    // Handle the initial mouse down to start drag
    handlePointerDown(pointer: Phaser.Input.Pointer) {
        this.isMouseDown = true;

        const worldPoint = pointer.positionToCamera(this.cameras.main) as Phaser.Math.Vector2;
        const tileX = this.layers[this.selectedLayerIndex].worldToTileX(worldPoint.x);
        const tileY = this.layers[this.selectedLayerIndex].worldToTileY(worldPoint.y);

        if (tileX < 0 || tileX >= this.cols || tileY < 0 || tileY >= this.rows) {
            return; // Prevent placement outside the grid boundaries
        }

        // If right-click, delete tile
        if (pointer.button === 2) { // Right mouse button
            this.deleteTile(tileX, tileY);
        }

        // Check if it's a spawn or endpoint placement
        if (this.isPlacingSpawnPoint) {
            this.spawnPoints.push({ x: tileX, y: tileY });
            this.add.sprite(tileX * 32 + 16, tileY * 32 + 16, 'spawn_point_sprite').setDepth(10);
            console.log(`Spawn point added at (${tileX}, ${tileY})`);
        }

        if (this.isPlacingEndPoint) {
            this.endPoints.push({ x: tileX, y: tileY });
            this.add.sprite(tileX * 32 + 16, tileY * 32 + 16, 'end_point_sprite').setDepth(10);
            console.log(`End point added at (${tileX}, ${tileY})`);
        }

        // If not in spawn/end point mode, start placing tiles
        if (pointer.button !== 2) { // Not right-click, normal left-click tile placement
            this.isDragging = true; // Start dragging
            this.placeTile(tileX, tileY);  // Place initial tile
        }
    }

    // Handle mouse move during dragging
    handlePointerMove(pointer: Phaser.Input.Pointer) {
        if (this.isDragging && this.isMouseDown) {
            const worldPoint = pointer.positionToCamera(this.cameras.main) as Phaser.Math.Vector2;
            const tileX = this.layers[this.selectedLayerIndex].worldToTileX(worldPoint.x);
            const tileY = this.layers[this.selectedLayerIndex].worldToTileY(worldPoint.y);

            if (tileX !== this.lastTileX || tileY !== this.lastTileY) {
                this.lastTileX = tileX;
                this.lastTileY = tileY;

                // Prevent placing outside the grid boundaries
                if (tileX >= 0 && tileX < this.cols && tileY >= 0 && tileY < this.rows) {
                    // Place tile at the new location
                    this.placeTile(tileX, tileY);
                }
            }
        }
    }

    // Handle mouse up to stop dragging
    handlePointerUp(pointer: Phaser.Input.Pointer) {
        this.isMouseDown = false;
        this.isDragging = false;
    }

    // Function to place the selected tile at the given coordinates
    placeTile(tileX: number, tileY: number) {
        const layer = this.layers[this.selectedLayerIndex];

        // If placing a tile (and not spawn/end points), place the tile
        if (!this.isPlacingSpawnPoint && !this.isPlacingEndPoint) {
            layer.putTileAt(this.selectedTileType, tileX, tileY);
            console.log(`Placed tile at (${tileX}, ${tileY})`);
        }
    }

    // Function to delete a tile at the specified coordinates
    deleteTile(tileX: number, tileY: number) {
        const layer = this.layers[this.selectedLayerIndex];

        // Remove tile by setting it to -1 (or empty tile ID)
        layer.putTileAt(-1, tileX, tileY); // -1 is typically the "no tile" ID in Phaser
        console.log(`Deleted tile at (${tileX}, ${tileY})`);
    }

    handleTileSelected({ tileIndex, paletteIndex }: { tileIndex: number; paletteIndex: number }) {
        this.selectedTileType = tileIndex;
        const selectedTileset = this.tilesets[paletteIndex];
        console.log(`Selected tileset: `, selectedTileset);
    }

    toggleLayerVisibility(layerIndex: number, isVisible: boolean) {
        const layer = this.layers[layerIndex];
        layer.setAlpha(isVisible ? 1 : 0.5);
    }

    selectLayer(layerIndex: number) {
        this.selectedLayerIndex = layerIndex;

        this.layers.forEach((layer, i) => {
            layer.setAlpha(i === layerIndex ? 1 : 0.5);
        });
    }
}