import { useState, useEffect } from 'react';
import GameBoard from '../../components/GameBoard/GameBoard';
import ModeSelector from '../../components/ModeSelector/ModeSelector';
import Navbar from '../../components/Navbar/Navbar';
import GameLobby from '../../components/GameLobby/GameLobby';
import { GameStatusProvider, useGameStatus } from '../../config/context/GameStatusContext';
import { useGameBoard } from '../../config/context/GameBoardContext';
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
  const [roomInfo, setRoomInfo] = useState(null);
  const [roomLoading, setRoomLoading] = useState(false);

  const [opponentName, setOpponentName] = useState('');
  const { gameBoard } = useGameBoard();
  useEffect(() => {
    if (selectedMode === 'easy') {
      setOpponentName('Jeremy');
    } else if (selectedMode === 'medium') {
      setOpponentName('Morgan');
    } else if (selectedMode === 'hard') {
      setOpponentName('404 not found');
    } else if (selectedMode === 'local') {
      setOpponentName('');
    } else {
      setOpponentName('Waiting...');
    }
  }, [selectedMode]);

  // Reset matchId whenever we return to the lobby
  useEffect(() => {
    if (gameStatus === 'waiting') {
      setMatchId(null);
      setGameNumber(null);
      setRoomInfo(null);
    }
  }, [gameStatus]);

  const handleStart = async () => {
    // Online mode is socket-driven; session is created on the server when both players join.
    if (selectedMode === 'online') return;

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
        <GameLobby selectedMode={selectedMode} boardSize={boardSize} opponentName={opponentName} onChangeOpponentName={setOpponentName} onStart={handleStart} onOnlineReady={setRoomInfo} />
      ) : (
        <GameBoard selectedMode={selectedMode} boardStyle={gameBoard} boardSize={boardSize} gameId={matchId} gameNumber={gameNumber} opponentName={opponentName} roomInfo={roomInfo} />
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