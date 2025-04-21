import React, { useEffect, useRef } from 'react';
import Phaser from 'phaser';
import GameScene from '../Phaser/scenes/GameScene';

const GameCanvas: React.FC = () => {
    const gameRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const config: Phaser.Types.Core.GameConfig = {
            type: Phaser.AUTO,
            width: 800,
            height: 600,
            parent: gameRef.current || undefined,
            scene: [GameScene],
            physics: {
                default: 'arcade',
                arcade: { debug: false },
            },
        };

        const game = new Phaser.Game(config);

        return () => {
            game.destroy(true); // 👈 Clean up on unmount
        };
    }, []);

    return <div ref={gameRef} id="phaser-container" />;
};

export default GameCanvas;