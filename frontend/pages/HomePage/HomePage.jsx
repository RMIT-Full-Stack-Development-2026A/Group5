import { useState, useEffect } from 'react';
import GameBoard from '../../components/GameBoard/GameBoard';
import ModeSelector from '../../components/ModeSelector/ModeSelector';
import Navbar from '../../components/Navbar/Navbar';
import GameLobby from '../../components/GameLobby/GameLobby';
import { GameStatusProvider, useGameStatus } from '../../config/context/GameStatusContext';


function HomePageContent() {
  const [selectedMode, setSelectedMode] = useState('easy');
  const [boardSize, setBoardSize] = useState(10);
  const [gameId, setGameId] = useState(null);
  const { gameStatus } = useGameStatus();

  const [opponentName, setOpponentName] = useState("");
  useEffect(() => {
    if (selectedMode === 'easy') {
      setOpponentName("Jeremy");
    } else if (selectedMode === 'medium') {
      setOpponentName("Morgan");
    } else if (selectedMode === 'hard') {
      setOpponentName("404 not found");
    }
  }, [selectedMode]);

  return (
    <div className="d-flex justify-content-center p-4 row g-4">
      {/* Left — game board */}
      {gameStatus === 'waiting' ? (
        <GameLobby selectedMode={selectedMode} opponentName={opponentName} onChangeOpponentName={setOpponentName} />
      ) : (
        <GameBoard selectedMode={selectedMode} boardStyle="classic" boardSize={boardSize} gameId={gameId} opponentName={opponentName} />
      )}

      {/* Right — mode selector */}
      <ModeSelector selectedMode={selectedMode} boardSize={boardSize} onSelectMode={setSelectedMode} onBoardSizeChange={setBoardSize} />
    </div>
  );
}

function HomePage() {
  return (
    <GameStatusProvider>
      <HomePageContent />
    </GameStatusProvider>
  );
}

export default HomePage;