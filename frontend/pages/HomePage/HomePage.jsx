import {useState } from 'react';
import GameBoard from '../../components/GameBoard/GameBoard';
import ModeSelector from '../../components/ModeSelector/ModeSelector';


function HomePage() {
    const [selectedMode, setSelectedMode] = useState('easy');
  return (
    <div className="d-flex justify-content-center p-4 row g-4">
      {/* Left — game board */}
      <GameBoard selectedMode={selectedMode} boardStyle="celestial" />

      {/* Right — mode selector */}
      <ModeSelector onSelectMode={setSelectedMode} />
    </div>
  );
}

export default HomePage;