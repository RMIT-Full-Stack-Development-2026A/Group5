import { useGameStatus } from '../../config/context/GameStatusContext';
import './GameLobby.css';

export default function GameLobby({selectedMode = 'local', opponentName = 'AI', onChangeOpponentName, onStart}) {
    const { setGameStatus } = useGameStatus();

    const handleStart = async () => {
        if (onStart) {
            await onStart();
        }
        setGameStatus('ongoing');
    };

    if (selectedMode === 'local' || selectedMode === 'easy' || selectedMode === 'medium' || selectedMode === 'hard') {
        return (
            <div className="d-flex flex-column align-items-center py-4 col-lg-8 game-lobby">
                <h2 className="mb-4">Local Game</h2>
                <div className="d-flex align-items-center mb-3 gap-5">
                    <p>P1: You</p>
                    <p>P2: </p>
                    {selectedMode === 'local' ? (
                        <input type="text" placeholder="Enter opponent name" onChange={(e) => onChangeOpponentName(e.target.value)} className="form-control" required value={opponentName}/>
                    ) : (
                        <p>{opponentName}</p>
                    )}
                </div>
                <button className="start-game-btn" onClick={handleStart}>Start Game</button>
            </div>
        )
    }
    if (selectedMode === 'online') {
        return (
            <div className="d-flex flex-column align-items-center py-4 col-lg-8 game-lobby">
                <h2 className="mb-4">Online Game</h2>
                <div className="d-flex align-items-center mb-3 gap-5">
                    <p>P1: You</p>
                    <p>P2: {opponentName || 'Waiting for opponent...'}</p>
                </div>
                <button className="start-game-btn" onClick={handleStart}>Start Game</button>
            </div>
        )
    }
    return null;
}