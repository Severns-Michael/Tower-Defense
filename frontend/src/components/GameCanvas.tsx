import React, {useEffect, useState, useRef} from 'react';
import Phaser from 'phaser';
import {TowerType} from '../Phaser/Utils/TowerData';
import GameScene from '../Phaser/scenes/GameScene';
import {LevelEditorScene} from '../Phaser/scenes/LevelEditorScene';
import TilePalette from "./TilePalette";
import TilePaletteGroup from "./TilePaletteGroup";
import { downloadMapJSON} from "../utils/maputils";

const GameCanvas: React.FC = () => {
    const gameRef = useRef<HTMLDivElement>(null);
    const [selectedTower, setSelectedTower] = useState<TowerType>(TowerType.Fire);
    const [gameInstance, setGameInstance] = useState<Phaser.Game | null>(null);
    const [editorMode, setEditorMode] = useState(false);
    const [selectedTileType, setSelectedTileType] = useState<number>(0); // Default to the first tile
    const [selectedLayer, setSelectedLayer] = useState<number>(0); // Default to Ground layer
    const [placingMode, setPlacingMode] = useState<'tile' | 'spawn' | 'end' | 'tower'>('tile');


    const palettes = [
        {label: "Grass", tileset: "assets/tilesets/grass_tileset.png", tileSize: 32},
        {label: "Stone", tileset: "assets/tilesets/stone_ground_tileset.png", tileSize: 32},
        {label: "Walls", tileset: "assets/tilesets/wall_tileset.png", tileSize: 32},
        {label: "Structures", tileset: "assets/tilesets/Struct_tileset.png", tileSize: 32},
    ];
    const layers = [
        {label: 'Ground', key: 'groundLayer'},
        {label: 'Path', key: 'pathLayer'},
        {label: 'Obstacles', key: 'obstaclesLayer'},
        {label: 'Props', key: 'propsLayer'}
    ];


    useEffect(() => {
        const canvasWidth = 1000;  // Set a fixed width for the game canvas
        const canvasHeight = 750; // Set a fixed height for the game canvas

        const config: Phaser.Types.Core.GameConfig = {
            type: Phaser.AUTO,
            width: canvasWidth,
            height: canvasHeight,
            parent: gameRef.current || undefined,
            scene: [GameScene, LevelEditorScene],
            scale: {
                autoCenter: Phaser.Scale.CENTER_BOTH,
            },
            physics: {
                default: 'arcade',
                arcade: {debug: false},
            },
        };

        const game = new Phaser.Game(config);
        setGameInstance(game);

        game.events.on('boot', () => {
            const scene = game.scene.getScene('GameScene') as GameScene;
            (window as any).gameScene = scene;

            scene.events.on('tower-selected', (towerType: TowerType) => {
                setSelectedTower(towerType);
            });

            // Start with the GameScene
            game.scene.start('GameScene');
        });

        return () => {
            game.destroy(true);
        };
    }, []);

    useEffect(() => {
        if (gameInstance) {
            const levelEditorScene = gameInstance.scene.getScene('LevelEditorScene') as LevelEditorScene;

            // Listen for the spawn placement complete event
            levelEditorScene.events.on('spawn-placed', handlePlacementComplete);

            // Listen for the end placement complete event
            levelEditorScene.events.on('end-placed', handlePlacementComplete);
        }

        return () => {
            if (gameInstance) {
                const levelEditorScene = gameInstance.scene.getScene('LevelEditorScene') as LevelEditorScene;
                levelEditorScene.events.removeListener('spawn-placed', handlePlacementComplete);
                levelEditorScene.events.removeListener('end-placed', handlePlacementComplete);
            }
        };
    }, [gameInstance]);

    const handleTileSelect = (tileIndex: number, paletteIndex: number) => {
        setSelectedTileType(tileIndex);
        setPlacingMode('tile');

        if (gameInstance) {
            const levelEditorScene = gameInstance.scene.getScene('LevelEditorScene') as LevelEditorScene;

            // Emit cancellation if previously in 'spawn' or 'end' mode
            levelEditorScene.events.emit('cancel-placement');

            levelEditorScene.events.emit('tile-selected', {
                tileIndex,
                paletteIndex,
                layerIndex: selectedLayer
            });
        }
    };


    const toggleEditorMode = () => {
        console.log('Toggling editor mode. Current mode:', editorMode);
        if (!gameInstance) return;

        if (editorMode) {
            console.log('Stopping LevelEditorScene and starting GameScene');
            gameInstance.scene.stop('LevelEditorScene');
            gameInstance.scene.start('GameScene');
        } else {
            console.log('Stopping GameScene and starting LevelEditorScene');
            gameInstance.scene.stop('GameScene');
            gameInstance.scene.start('LevelEditorScene');

            setTimeout(() => {
                console.log('Emitting tile-selected event');
                gameInstance.scene.getScene('LevelEditorScene').events.emit('tile-selected', selectedTileType);
            }, 100);
        }

        setEditorMode(!editorMode);
    };
    const layerToPaletteMap: Record<number, number[]> = {
        0: [0], // Ground -> Grass
        1: [1], // Path -> Stone
        2: [2], // Obstacles -> Walls
        3: [3], // Props -> Structures
    };

    const handleTowerSelect = (towerType: TowerType) => {
        setSelectedTower(towerType);

        if (gameInstance) {
            const scene = gameInstance.scene.getScene('GameScene') as GameScene;
            scene.events.emit('tower-selected', towerType);
        }
    };

    const handleLayerSelect = (layerIndex: number) => {
        setSelectedLayer(layerIndex);

        if (gameInstance) {
            const levelEditorScene = gameInstance.scene.getScene('LevelEditorScene') as LevelEditorScene;
            levelEditorScene.events.emit('layer-selected', layerIndex);
        }
    };

    const handlePlacementComplete = () => {
        setPlacingMode('tile'); // Switch back to tile mode
        console.log('Placement complete, switched back to tile mode.');
    };

    return (
        <div style={{display: 'flex'}}>
            <div ref={gameRef} id="phaser-container"/>

            {/* Editor UI Panel */}
            {editorMode && (
                <div
                    style={{
                        marginLeft: '10px',
                        height: '750px',
                        position: 'relative',
                        zIndex: 10,
                        backgroundColor: 'rgba(255, 255, 255, 0.8)',
                        padding: '10px',
                        overflowY: 'auto',
                    }}
                >
                    <h4>Layer Selector</h4>
                    {layers.map((layer, index) => (
                        <button
                            key={index}
                            style={{
                                margin: '2px',
                                backgroundColor: selectedLayer === index ? '#ddd' : '#fff',
                            }}
                            onClick={() => handleLayerSelect(index)}
                        >
                            {layer.label}
                        </button>
                    ))}
                    {!editorMode && (
                        <div
                            style={{
                                position: 'absolute',
                                top: '80px',
                                right: '20px', // <-- RIGHT SIDE
                                zIndex: 20,
                                backgroundColor: 'rgba(255, 255, 255, 0.8)',
                                padding: '10px',
                                borderRadius: '8px'
                            }}
                        >
                            <h4>Select Tower</h4>
                            <button
                                style={{ marginBottom: '5px' }}
                                onClick={() => handleTowerSelect(TowerType.Fire)}
                            >
                                Fire Tower
                            </button>
                            {/* Add more tower buttons here if you want later */}
                        </div>
                    )}

                    <h4>Tile Palette</h4>
                    <TilePaletteGroup
                        palettes={palettes.filter((_, i) =>
                            layerToPaletteMap[selectedLayer]?.includes(i)
                        )}
                        onTileSelect={handleTileSelect}
                    />

                    <h4>Special Points</h4>
                    <button
                        onClick={() => {
                            setPlacingMode('spawn');
                            gameInstance?.scene.getScene('LevelEditorScene').events.emit('start-placing-spawn');
                            gameInstance?.scene.getScene('LevelEditorScene').events.once('spawn-placed', handlePlacementComplete);
                        }}
                    >
                        Place Spawn
                    </button>
                    <button
                        onClick={() => {
                            setPlacingMode('end');
                            gameInstance?.scene.getScene('LevelEditorScene').events.emit('start-placing-end');
                            gameInstance?.scene.getScene('LevelEditorScene').events.once('end-placed', handlePlacementComplete);
                        }}
                    >
                        Place End
                    </button>
                    <button
                        onClick={() => {
                            if (!gameInstance) return;

                            const levelEditorScene = gameInstance.scene.getScene('LevelEditorScene') as LevelEditorScene;
                            const tilemap = levelEditorScene.getTileData(); // Get tile data from the scene

                            // Pass the correct properties from tilemap
                            downloadMapJSON(tilemap.layers, tilemap.mapWidth, tilemap.mapHeight, tilemap.spawnPoints, tilemap.endPoints);
                        }}
                    >
                        Download Map
                    </button>

                </div>
            )}
            {/* Tower Selection - show only when NOT in editorMode */}
            {!editorMode && (
                <div
                    style={{
                        marginLeft: '10px',
                        height: '750px',
                        position: 'relative',
                        zIndex: 10,
                        backgroundColor: 'rgba(255, 255, 255, 0.8)',
                        padding: '10px',
                        overflowY: 'auto',
                    }}
                >
                    <h4>Select Tower</h4>
                    <button
                        style={{marginBottom: '5px'}}
                        onClick={() => handleTowerSelect(TowerType.Fire)}
                    >
                        Fire Tower
                    </button>
                    {/* Add more towers later */}

                    <h4>Round Control</h4>
                    <button
                        onClick={() => {
                            if (!gameInstance) return;
                            const scene = gameInstance.scene.getScene('GameScene') as GameScene;
                            scene.roundManager?.startNextRound();
                        }}
                    >
                        Start Next Round
                    </button>
                </div>

            )}

            {/* Editor Toggle */}
            <div style={{position: 'absolute', top: '20px', left: '20px', zIndex: 20}}>
                <button onClick={toggleEditorMode}>
                    {editorMode ? 'Play Game' : 'Open Level Editor'}
                </button>
            </div>
        </div>
    );
}

export default GameCanvas;

