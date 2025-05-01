import React, {useEffect, useState, useRef} from 'react';
import Phaser from 'phaser';
import {TowerInfoType, TowerType} from '../types/Tower';
import GameScene from '../Phaser/scenes/GameScene';
import {LevelEditorScene} from '../Phaser/scenes/LevelEditorScene';
import TilePaletteGroup from "./TilePaletteGroup";
import { downloadMapJSON} from "../utils/maputils";
import EventBus from "../Phaser/Utils/EventBus";
import TowerSelector from './TowerUi';
import UpgradePanel from "./UpgradePanel";
import GameHUD from './GameHUD';


import NextRoundButton from "./NextRoundButton";
import GamePanel from "./GamePanel";
import {Tower} from "../Phaser/Objects/Tower";
import {waves} from "../types/waves";

const GameCanvas: React.FC = () => {
    const gameRef = useRef<HTMLDivElement>(null);
    const [selectedTower, setSelectedTower] = useState<TowerType | null>(null);
    const [gameInstance, setGameInstance] = useState<Phaser.Game | null>(null);
    const [editorMode, setEditorMode] = useState(false);
    const [selectedTileType, setSelectedTileType] = useState<number>(0); // Default to the first tile
    const [selectedLayer, setSelectedLayer] = useState<number>(0); // Default to Ground layer
    const [placingMode, setPlacingMode] = useState<'tile' | 'spawn' | 'end' | 'tower'>('tile');
    const [currentRound, setCurrentRound] = useState(1);
    const maxRounds = waves.length;
    const [gameOver, setGameOver] = useState(false);
    const [playerHealth, setPlayerHealth] = useState(100);
    const [enemiesRemaining, setEnemiesRemaining] = useState(0);
    const [playerMoney, setPlayerMoney] = useState(500);
    const [selectedTowerForUpgrade, setSelectedTowerForUpgrade] = useState<Tower | null>(null);


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
        const canvasWidth = 960;  // Set a fixed width for the game canvas
        const canvasHeight = 640; // Set a fixed height for the game canvas

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

    useEffect(() => {
        const handleRoundChanged = (roundNumber: number) => {
            setCurrentRound(roundNumber);
        };

        EventBus.on('round-changed', handleRoundChanged);

        return () => {
            EventBus.off('round-changed', handleRoundChanged);
        };
    }, []);

    useEffect(() => {
        const handleGameOver = () => {
            setGameOver(true);
        };

        EventBus.on('game-over', handleGameOver);

        return () => {
            EventBus.off('game-over', handleGameOver);
        };
    }, []);

    useEffect(() => {
        const handleHealthChanged = (health: number) => {
            setPlayerHealth(health);
        };

        EventBus.on('health-changed', handleHealthChanged);

        return () => {
            EventBus.off('health-changed', handleHealthChanged);
        };
    }, []);

    useEffect(() => {
        const handleEnemiesChanged = (count: number) => {
            console.log('Enemies Remaining:', count);
            setEnemiesRemaining(count);
        };

        EventBus.on('enemies-changed', handleEnemiesChanged);

        return () => {
            EventBus.off('enemies-changed', handleEnemiesChanged);
        };
    }, []);

    useEffect(() => {
        const handleMoneyChanged = (money: number) => {
            setPlayerMoney(money);
        };

        EventBus.on('money-changed', handleMoneyChanged);

        return () => {
            EventBus.off('money-changed', handleMoneyChanged);
        };
    }, []);
    const upgradeListener = (tower: Tower) => {
        setSelectedTowerForUpgrade(tower);
    };

    useEffect(() => {
        if (!gameInstance) return;

        const scene = gameInstance.scene.getScene('GameScene') as GameScene;
        const upgradeListener = (tower: Tower) => {
            setSelectedTowerForUpgrade(tower);
        };

        scene.events.on('tower-selected-for-upgrade', upgradeListener);

        return () => {
            scene.events.off('tower-selected-for-upgrade', upgradeListener);
        };
    }, [gameInstance]);

    const handleTileSelect = (tileIndex: number, paletteIndex: number) => {
        setSelectedTileType(tileIndex);
        setPlacingMode('tile');

        if (gameInstance) {
            const levelEditorScene = gameInstance.scene.getScene('LevelEditorScene') as LevelEditorScene;


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
        setPlacingMode('tile');
        console.log('Placement complete, switched back to tile mode.');
    };
    const restartGame = () => {
        if (!gameInstance) return;

        setGameOver(false);
        setCurrentRound(1);
        setPlayerHealth(100);

        const scene = gameInstance.scene.getScene('GameScene');
        scene.scene.restart();
    };


    return (
        <>
            <GameHUD money={playerMoney} lives={playerHealth} round={currentRound} maxRounds={maxRounds}/>

            <div style={{ display: 'flex', justifyContent: 'center', gap: '20px', width: '100%',alignItems: 'center',minHeight: '100vh' }}>
                <div ref={gameRef} id="phaser-container" />

                {!editorMode && (
                    <div style={{
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '20px',
                        alignItems: 'center',
                        justifyContent: 'flex-start'
                    }}>
                        {!selectedTowerForUpgrade ? (
                            <GamePanel title="Select a Tower">
                                <TowerSelector onTowerSelect={handleTowerSelect} />
                            </GamePanel>
                        ) : (
                            <GamePanel title={`${selectedTowerForUpgrade.type.toUpperCase()} Tower`}>
                                <UpgradePanel
                                    tower={selectedTowerForUpgrade}
                                    onClose={() => setSelectedTowerForUpgrade(null)}
                                />
                            </GamePanel>
                        )}

                        <NextRoundButton
                            onClick={() => {
                                if (!gameInstance) return;
                                const scene = gameInstance.scene.getScene('GameScene') as GameScene;
                                scene.roundManager?.startNextRound();
                            }}
                        />
                    </div>
                )}

                {editorMode && (
                    <div style={{
                        marginLeft: '10px',
                        height: '750px',
                        padding: '10px',
                        overflowY: 'auto',
                        backgroundColor: 'rgba(0, 0, 0, 0.8)',
                        border: '2px solid #00ffff',
                        borderRadius: '12px',
                        boxShadow: '0 0 12px rgba(0, 255, 255, 0.2)'
                    }}>
                        <h4>Layer Selector</h4>
                        {layers.map((layer, index) => (
                            <button
                                key={index}
                                style={{ margin: '2px', backgroundColor: selectedLayer === index ? '#ddd' : '#fff' }}
                                onClick={() => handleLayerSelect(index)}
                            >
                                {layer.label}
                            </button>
                        ))}

                        <h4>Tile Palette</h4>
                        <TilePaletteGroup
                            palettes={palettes.filter((_, i) => layerToPaletteMap[selectedLayer]?.includes(i))}
                            onTileSelect={handleTileSelect}
                        />

                        <h4>Special Points</h4>
                        <button onClick={() => {
                            setPlacingMode('spawn');
                            gameInstance?.scene.getScene('LevelEditorScene').events.emit('start-placing-spawn');
                        }}>
                            Place Spawn
                        </button>
                        <button onClick={() => {
                            setPlacingMode('end');
                            gameInstance?.scene.getScene('LevelEditorScene').events.emit('start-placing-end');
                        }}>
                            Place End
                        </button>
                        <button onClick={() => {
                            if (!gameInstance) return;
                            const levelEditorScene = gameInstance.scene.getScene('LevelEditorScene') as LevelEditorScene;
                            const tilemap = levelEditorScene.getTileData();
                            downloadMapJSON(tilemap.layers, tilemap.mapWidth, tilemap.mapHeight, tilemap.spawnPoints, tilemap.endPoints);
                        }}>
                            Download Map
                        </button>
                    </div>
                )}
            </div>

            {/* Editor Toggle */}
            <div style={{ position: 'absolute', top: '20px', right: '20px', zIndex: 20 }}>
                <button onClick={toggleEditorMode}>
                    {editorMode ? 'Play Game' : 'Open Level Editor'}
                </button>
            </div>

            {/* Game Over */}
            {gameOver && (
                <div style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: '100%',
                    backgroundColor: 'rgba(0,0,0,0.7)',
                    color: 'white',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    alignItems: 'center',
                    zIndex: 100,
                }}>
                    <h1>Game Over</h1>
                    <button
                        style={{
                            marginTop: '20px',
                            padding: '10px 20px',
                            fontSize: '20px',
                            borderRadius: '8px',
                            backgroundColor: '#ff4d4d',
                            color: 'white',
                            border: 'none',
                            cursor: 'pointer'
                        }}
                        onClick={restartGame}
                    >
                        Restart Game
                    </button>
                </div>
            )}
        </>
    );
}

export default GameCanvas;

