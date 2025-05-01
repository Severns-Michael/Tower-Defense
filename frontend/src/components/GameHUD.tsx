import React from 'react';

interface GameHUDProps {
    money: number;
    lives: number;
    round: number;
    maxRounds: number;
}

const GameHUD: React.FC<GameHUDProps> = ({ money, lives, round, maxRounds }) => {
    return (
        <div style={{
            position: 'absolute',
            top: '20px',
            left: '40%',
            transform: 'translateX(-50%)',
            backgroundColor: 'rgba(0, 0, 0, 0.8)',
            color: 'white',
            padding: '10px 40px',
            borderRadius: '10px',
            border: '2px solid #00ffff',
            display: 'flex',
            gap: '40px',
            fontSize: '20px',
            zIndex: 50
        }}>
            <div>💰 Money: {money}</div>
            <div>❤️ Lives: {lives}</div>
            <div>📢 Round: {round} / {maxRounds}</div>
        </div>
    );
};

export default GameHUD;