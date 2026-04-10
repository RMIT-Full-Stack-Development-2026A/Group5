import React from 'react';
import GameBoard from './components/GameBoard/GameBoard';

function App() {
  return (
    <div className="d-flex align-items-start gap-4 p-4">
      {/* Left — game board */}
      <GameBoard />

      {/* Right — placeholder for GameMode component */}
      <div style={{ minWidth: 260 }} />
    </div>
  );
}

export default App;
