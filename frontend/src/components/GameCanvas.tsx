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
        setSelectedTileType(tileIndex); // Set the selected tile index
        console.log(`Selected tile type: ${tileIndex}`);
    };



    const toggleEditorMode = () => {
        if (!gameInstance) return;

        if (editorMode) {
            // Switch to GameScene
            gameInstance.scene.stop('LevelEditorScene');
            gameInstance.scene.start('GameScene');
        } else {
            // Switch to LevelEditorScene
            gameInstance.scene.stop('GameScene');
            gameInstance.scene.start('LevelEditorScene');
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
        <div>
            <div style={{ position: 'absolute', top: 20, left: 20, zIndex: 10 }}>
                <button onClick={() => handleTowerSelect(TowerType.Fire)}>Fire Tower</button>
                {/* Add more tower buttons here as needed */}
                <button onClick={toggleEditorMode} style={{ marginLeft: '10px' }}>
                    {editorMode ? 'Play Game' : 'Open Level Editor'}
                </button>
                {/* Tile Palette UI */}
                <TilePalette
                    onTileSelect={handleTileSelect}  // Function to handle tile selection
                    tileset="assets/walls_floor.png"  // Path to your tileset image
                    tileSize={50}  // Tile size, adjust based on your tileset
                    tileColumns={10}  // Number of columns in your tileset
                />
            </div>

            <div ref={gameRef} id="phaser-container" />
        </div>
    );
};

export default GameCanvas;