import React, { useEffect, useState, useRef } from 'react';
import Phaser from 'phaser';
import GameScene from '../Phaser/scenes/GameScene';

// Define a simple type for the tower types
type TowerType = 'fire';

const GameCanvas: React.FC = () => {
    const gameRef = useRef<HTMLDivElement>(null);
    const [selectedTower, setSelectedTower] = useState<TowerType>('fire'); // Default to 'fire' tower
    const [gameInstance, setGameInstance] = useState<Phaser.Game | null>(null);

    // Set up the Phaser game
    useEffect(() => {
        const config: Phaser.Types.Core.GameConfig = {
            type: Phaser.AUTO,
            width: window.innerWidth,
            height: window.innerHeight,
            parent: gameRef.current || undefined,
            scene: [GameScene],
            scale: {
                mode: Phaser.Scale.FIT,
                autoCenter: Phaser.Scale.CENTER_BOTH,
            },
            physics: {
                default: 'arcade',
                arcade: { debug: false },
            },
        };

        const game = new Phaser.Game(config);
        setGameInstance(game); // Store the Phaser game instance

        // Set the selected tower to the Phaser game scene
        game.events.on('boot', () => {
            const scene = game.scene.getScene('GameScene') as Phaser.Scene;
            scene.events.on('tower-selected', (towerType: TowerType) => {
                setSelectedTower(towerType); // Update React state when tower is selected
            });
        });

        return () => {
            game.destroy(true); // Clean up on unmount
        };
    }, []);

    // Handle tower selection UI
    const handleTowerSelect = (towerType: TowerType) => {
        setSelectedTower(towerType);

        // Trigger an event in Phaser game scene to update selected tower
        if (gameInstance) {
            const scene = gameInstance.scene.getScene('GameScene') as Phaser.Scene;
            scene.events.emit('tower-selected', towerType); // Emit event to Phaser
        }
    };

    return (
        <div>
            {/* Tower selection UI */}
            <div id="tower-selector" style={{ position: 'absolute', top: 20, left: 20, zIndex: 10 }}>
                <button onClick={() => handleTowerSelect('fire')}>Fire Tower</button>
            </div>

            {/* Game Canvas */}
            <div ref={gameRef} id="phaser-container" />
        </div>
    );
};

export default GameCanvas;