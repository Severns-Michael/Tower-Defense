import React, { useEffect, useState, useRef } from 'react';
import Phaser from 'phaser';
import { TowerType } from '../Phaser/Utils/TowerData';
import GameScene from '../Phaser/scenes/GameScene';
import { LevelEditorScene } from '../Phaser/scenes/LevelEditorScene';
import TilePalette from "./TilePalette";

const GameCanvas: React.FC = () => {
    const gameRef = useRef<HTMLDivElement>(null);
    const [selectedTower, setSelectedTower] = useState<TowerType>(TowerType.Fire);
    const [gameInstance, setGameInstance] = useState<Phaser.Game | null>(null);
    const [editorMode, setEditorMode] = useState(false);
    const [selectedTileType, setSelectedTileType] = useState<number>(0); // Default to the first tile

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
                arcade: { debug: false },
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

    const handleTileSelect = (tileIndex: number) => {
        setSelectedTileType(tileIndex);
        console.log(`Selected tile type: ${tileIndex}`);

        // Emitting the event to the Phaser scene
        if (gameInstance) {
            const levelEditorScene = gameInstance.scene.getScene('LevelEditorScene') as LevelEditorScene;
            levelEditorScene.events.emit('tile-selected', tileIndex);
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

    const handleTowerSelect = (towerType: TowerType) => {
        setSelectedTower(towerType);

        if (gameInstance) {
            const scene = gameInstance.scene.getScene('GameScene') as GameScene;
            scene.events.emit('tower-selected', towerType);
        }
    };

    return (
        <div style={{ display: 'flex', alignItems: 'flex-start' }}>
            {/* Phaser game canvas */}
            <div ref={gameRef} id="phaser-container" />

            {/* Show TilePalette only in LevelEditor mode */}
            {editorMode && (
                <div style={{
                    marginLeft: '10px',
                    height: '750px',
                    position: 'relative',
                    zIndex: 10,
                }}>
                    <TilePalette
                        onTileSelect={handleTileSelect}
                        tileset="assets/grass_tileset.png"
                        tileSize={32}
                        tileColumns={4}
                    />
                </div>
            )}

            {/* UI Buttons */}
            <div style={{
                position: 'absolute',
                top: 20,
                left: 20,
                zIndex: 20
            }}>
                <button onClick={() => handleTowerSelect(TowerType.Fire)}>Fire Tower</button>
                <button onClick={toggleEditorMode} style={{ marginLeft: '10px' }}>
                    {editorMode ? 'Play Game' : 'Open Level Editor'}
                </button>
            </div>
        </div>
    );
}
export default GameCanvas;