import Phaser from 'phaser';
import GameScene from './scenes/GameScene';



const config: Phaser.Types.Core.GameConfig = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    parent: 'phaser-game', // matches the div ID in GameCanvas.tsx
    backgroundColor: '#1d212d',
    scene: [GameScene],
    physics: {
        default: 'arcade',
        arcade: {
            debug: false,
        },
    },
};

class Game extends Phaser.Game {
    constructor() {
        super(config);
    }
}

export default Game;