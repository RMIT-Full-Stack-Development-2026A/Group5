import { useGameStatus } from '../../config/context/GameStatusContext';
import './GameLobby.css';

export default function GameLobby({ selectedMode = 'local', opponentName = 'AI', onChangeOpponentName, onStartGame, roomInfo, isLoading }) {
    const { setGameStatus } = useGameStatus();

    const renderLocalOrAI = () => (
        <>
            <h2 className="mb-4">{selectedMode === 'local' ? 'Local Game' : 'AI Game'}</h2>
            <div className="d-flex align-items-center mb-3 gap-5">
                <p>P1: You</p>
                <p>P2: </p>
                {selectedMode === 'local' ? (
                    <input
                        type="text"
                        placeholder="Enter opponent name"
                        onChange={(e) => onChangeOpponentName(e.target.value)}
                        className="form-control"
                        required
                        value={opponentName}
                    />
                ) : (
                    <p>{opponentName}</p>
                )}
            </div>
            <button className="start-game-btn" onClick={() => setGameStatus('ongoing')}>
                Start Game
            </button>
        </>
    );

    const renderOnline = () => (
        <>
            <h2 className="mb-4">Online Game</h2>
            <div className="d-flex align-items-center mb-3 gap-5">
                <p>P1: You</p>
                <p>P2: {opponentName || 'Waiting for opponent...'}</p>
            </div>
            {roomInfo ? (
                <div className="text-center mb-3">
                    <p className="mb-1">Room created successfully.</p>
                    <strong>{roomInfo.roomNumber}</strong>
                </div>
            ) : null}
            <button className="start-game-btn" onClick={onStartGame} disabled={isLoading}>
                {isLoading ? 'Creating room...' : 'Create Online Room'}
            </button>
        </>
    );

    return (
        <div className="d-flex flex-column align-items-center py-4 col-lg-8 game-lobby">
            {selectedMode === 'online' ? renderOnline() : renderLocalOrAI()}
        </div>
    );
}