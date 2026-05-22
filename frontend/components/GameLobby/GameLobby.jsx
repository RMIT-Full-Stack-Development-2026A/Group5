import './GameLobby.css';
import { useGameLobby } from './useGameLobby';

export default function GameLobby({selectedMode = 'local', opponentName = 'AI', onChangeOpponentName, onStart}) {
    const {
        handleStart,
        roomCodeInput,
        setRoomCodeInput,
        activeRoomCode,
        onlineError,
        canStartOnline,
        createRoom,
        joinRoom,
    } = useGameLobby({ selectedMode, onStart });

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

                <div className="d-flex gap-2 mb-3">
                    <button className="start-game-btn" type="button" onClick={createRoom}>Create Room</button>
                    <button className="start-game-btn" type="button" onClick={joinRoom}>Join Room</button>
                </div>

                <input
                    type="text"
                    className="form-control mb-3"
                    placeholder="Enter room code"
                    value={roomCodeInput}
                    onChange={(e) => setRoomCodeInput(e.target.value.toUpperCase())}
                    style={{ maxWidth: '260px' }}
                />

                {activeRoomCode ? <p className="mb-2">Room: {activeRoomCode}</p> : null}
                {onlineError ? <p className="text-danger mb-3">{onlineError}</p> : null}

                <button className="start-game-btn" onClick={handleStart} disabled={!canStartOnline}>Start Game</button>
            </div>
        )
    }
    return null;
}