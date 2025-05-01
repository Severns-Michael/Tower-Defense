import React from "react";
import GameCanvas from "./components/GameCanvas";

function App() {
    return (
        <div style={{ position: 'relative', minHeight: '100vh' }}>
            <GameCanvas />

            <div style={{
                position: 'absolute',
                bottom: '20px',
                width: '100%',
                textAlign: 'center',
                color: '#00ffff',
                fontSize: '18px',
                letterSpacing: '2px',
                textShadow: '0 0 8px rgba(0, 255, 255, 0.7)',
                userSelect: 'none'
            }}>
                React + Phaser Tower Defense
            </div>
        </div>
    );
}

export default App;