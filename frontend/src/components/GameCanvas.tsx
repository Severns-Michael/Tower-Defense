import React, { useEffect, useState, useRef } from 'react';
import Phaser from 'phaser';
import { TowerType } from '../Phaser/Utils/TowerData';
import GameScene from '../Phaser/scenes/GameScene';

const GameCanvas: React.FC = () => {
    const gameRef = useRef<HTMLDivElement>(null);
    const [selectedTower, setSelectedTower] = useState<TowerType>(TowerType.Fire);
    const [gameInstance, setGameInstance] = useState<Phaser.Game | null>(null);

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
        setGameInstance(game);

        game.events.on('boot', () => {
            const scene = game.scene.getScene('GameScene') as GameScene;
            (window as any).gameScene = scene;

            scene.events.on('tower-selected', (towerType: TowerType) => {
                setSelectedTower(towerType);
            });
        });

        return () => {
            game.destroy(true);
        };
    }, []);

    const handleTowerSelect = (towerType: TowerType) => {
        setSelectedTower(towerType);

        if (gameInstance) {
            const scene = gameInstance.scene.getScene('GameScene') as GameScene;
            scene.events.emit('tower-selected', towerType);
        }
    };

    return (
        <div>
            <div id="tower-selector" style={{ position: 'absolute', top: 20, left: 20, zIndex: 10 }}>
                <button onClick={() => handleTowerSelect(TowerType.Fire)}>Fire Tower</button>
            </div>

            <div ref={gameRef} id="phaser-container" />
        </div>
    );
};

export default GameCanvas;