import { useState, useEffect } from 'react';
import GameBoard from '../../components/GameBoard/GameBoard';
import ModeSelector from '../../components/ModeSelector/ModeSelector';
import Navbar from '../../components/Navbar/Navbar';
import GameLobby from '../../components/GameLobby/GameLobby';
import { GameStatusProvider, useGameStatus } from '../../config/context/GameStatusContext';
import { gameSessionService } from '../../services/gameSessionService';


const AI_MODES = ['easy', 'medium', 'hard'];

const toSessionPayload = (selectedMode, boardSize, opponentName) => {
  if (AI_MODES.includes(selectedMode)) {
    return {
      gameType:    'ai',
      aiLevel:     selectedMode,
      boardSize:   `${boardSize}x${boardSize}`,
      boardStyle:  'classic',
    };
  }
  return {
    gameType:    selectedMode,
    boardSize:   `${boardSize}x${boardSize}`,
    boardStyle:  'classic',
    player2Name: opponentName || null,
  };
};


function HomePageContent() {
  const [selectedMode, setSelectedMode] = useState('easy');
  const [boardSize, setBoardSize] = useState(10);
  const [matchId, setMatchId] = useState(null);
  const [gameNumber, setGameNumber] = useState(null);
  const { gameStatus } = useGameStatus();

  const [opponentName, setOpponentName] = useState("");
  useEffect(() => {
    if (selectedMode === 'easy') {
      setOpponentName("Easy AI");
    } else if (selectedMode === 'medium') {
      setOpponentName("Medium AI");
    } else if (selectedMode === 'hard') {
      setOpponentName("Hard AI");
    }
  }, [selectedMode]);

  // Reset matchId whenever we return to the lobby
  useEffect(() => {
    if (gameStatus === 'waiting') {
      setMatchId(null);
      setGameNumber(null);
    }
  }, [gameStatus]);

  const handleStart = async () => {
    try {
      const payload = toSessionPayload(selectedMode, boardSize, opponentName);
      const { matchId: id, gameNumber: num } = await gameSessionService.start(payload);
      setMatchId(id);
      setGameNumber(num);
    } catch (err) {
      console.error('Failed to start match', err);
    }
  };

  return (
    <div className="d-flex justify-content-center p-4 row g-4">
      {/* Left — game board */}
      {gameStatus === 'waiting' ? (
        <GameLobby selectedMode={selectedMode} opponentName={opponentName} onChangeOpponentName={setOpponentName} onStart={handleStart} />
      ) : (
        <GameBoard selectedMode={selectedMode} boardStyle="celestial" boardSize={boardSize} gameId={matchId} gameNumber={gameNumber} opponentName={opponentName} />
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