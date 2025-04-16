import React, { useState } from 'react';
import Board from './components/board'; // Adjust path if needed

const App = () => {
  const [gameStarted, setGameStarted] = useState(false);

  // Define startGame function
  const startGame = () => {
    setGameStarted(true);
    console.log('Game Started!');
  };

  return (
      <div className="app">
        {/* Start Button placed outside the board */}
        <div className="start-container">
          <button onClick={startGame}>Start Game</button>
        </div>

        {/* The Game Board */}
        {gameStarted ? <Board /> : <p>Click start to begin the game!</p>}
      </div>
  );
};

export default App;