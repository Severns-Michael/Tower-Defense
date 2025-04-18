import React, { useEffect, useRef } from "react";
import Phaser from "phaser";

const GameCanvas: React.FC = () => {
    const gameRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const config: Phaser.Types.Core.GameConfig = {
            type: Phaser.AUTO,
            width: 800,
            height: 600,
            parent: gameRef.current || undefined,
            physics: {
                default: "arcade",
                arcade: {
                    debug: true, // shows hitboxes & velocity
                },
            },
            scene: {
                preload,
                create,
                update,
            },
        };

        const game = new Phaser.Game(config);

        function preload(this: Phaser.Scene) {
            // Load assets here
            this.load.image("enemy", "/assets/enemy.png");
            this.load.image("tower", "/assets/tower.png");
        }

        function create(this: Phaser.Scene) {
            this.add.text(20, 20, "Tower Defense Game", { font: "20px Arial", fill: "#ffffff" });

            // Example enemy sprite
            this.enemy = this.physics.add.sprite(100, 100, "enemy");
        }

        function update(this: Phaser.Scene, time: number, delta: number) {
            // Game loop logic
            if (this.enemy) {
                this.enemy.x += 0.5;
            }
        }

        return () => {
            game.destroy(true);
        };
    }, []);

    return <div ref={gameRef} />;
};

export default GameCanvas;