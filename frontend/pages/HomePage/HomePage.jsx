import {useState } from 'react';
import GameBoard from '../../components/GameBoard/GameBoard';
import ModeSelector from '../../components/ModeSelector/ModeSelector';


function HomePage() {
    const [selectedMode, setSelectedMode] = useState('easy');
    const [boardSize, setBoardSize] = useState(10);
  return (
    <div className="d-flex justify-content-center p-4 row g-4">
      {/* Left — game board */}
      <GameBoard selectedMode={selectedMode} boardStyle="classic" boardSize={boardSize} />

      {/* Right — mode selector */}
      <ModeSelector onSelectMode={setSelectedMode} onBoardSizeChange={setBoardSize} />
    </div>
  );
}

export default HomePage;