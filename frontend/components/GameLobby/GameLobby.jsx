import { useEffect, useState } from 'react';
import { useGameStatus } from '../../config/context/GameStatusContext';
import { getSocket, emitAck, disconnectSocket } from '../../services/socketClient';
import './GameLobby.css';

export default function GameLobby({selectedMode = 'local', boardSize = 10, opponentName = 'AI', onChangeOpponentName, onStart, onOnlineReady}) {
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
        return <OnlineLobby boardSize={boardSize} onOnlineReady={onOnlineReady} setGameStatus={setGameStatus} />;
    }
    return null;
}


function OnlineLobby({ boardSize, onOnlineReady, setGameStatus }) {
    const [mode, setMode]       = useState(null);   // 'create' | 'join' | null
    const [code, setCode]       = useState('');     // joining: typed code; created: returned code
    const [waiting, setWaiting] = useState(false);
    const [error, setError]     = useState(null);

    // When the server confirms match started (either player), hand the data up
    useEffect(() => {
        const socket = getSocket();
        const onMatchStarted = (payload) => {
            setWaiting(false);
            onOnlineReady?.({
                ...payload,
                code,
                you: mode === 'create' ? 'player1' : 'player2',
            });
            setGameStatus('ongoing');
        };
        socket.on('matchStarted', onMatchStarted);
        return () => {
            socket.off('matchStarted', onMatchStarted);
        };
    }, [code, mode, onOnlineReady, setGameStatus]);

    const handleCreate = async () => {
        setError(null);
        try {
            const ack = await emitAck('createRoom', { boardSize: `${boardSize}x${boardSize}` });
            setCode(ack.code);
            setMode('create');
            setWaiting(true);
        } catch (err) {
            setError(err.message);
        }
    };

    const handleJoin = async () => {
        setError(null);
        if (!code.trim()) { setError('Enter a room code'); return; }
        try {
            setMode('join');
            await emitAck('joinRoom', { code: code.trim().toUpperCase() });
            // matchStarted event handler will fire and transition the UI
        } catch (err) {
            setError(err.message);
            setMode(null);
        }
    };

    const handleCancel = () => {
        disconnectSocket();
        setMode(null);
        setCode('');
        setWaiting(false);
        setError(null);
    };

    return (
        <div className="d-flex flex-column align-items-center py-4 col-lg-8 game-lobby">
            <h2 className="mb-4">Online Game</h2>

            {error && <div className="alert alert-danger py-2 mb-3">{error}</div>}

            {mode === null && (
                <div className="d-flex flex-column gap-3 align-items-center" style={{ minWidth: 320 }}>
                    <button className="start-game-btn" onClick={handleCreate}>Create Room</button>
                    <div className="text-muted">— or —</div>
                    <input
                        type="text"
                        className="form-control text-center"
                        placeholder="ENTER ROOM CODE"
                        value={code}
                        onChange={(e) => setCode(e.target.value.toUpperCase())}
                        maxLength={6}
                        style={{ textTransform: 'uppercase', letterSpacing: '0.3em', fontWeight: 700 }}
                    />
                    <button className="start-game-btn" onClick={handleJoin}>Join Room</button>
                </div>
            )}

            {mode === 'create' && waiting && (
                <div className="text-center">
                    <p className="mb-2">Share this code with your opponent:</p>
                    <h1 className="display-3 fw-bold mb-3" style={{ letterSpacing: '0.3em' }}>{code}</h1>
                    <p className="text-muted">Waiting for opponent to join…</p>
                    <button className="btn btn-outline-secondary mt-3" onClick={handleCancel}>Cancel</button>
                </div>
            )}

            {mode === 'join' && (
                <div className="text-center">
                    <p>Joining room <strong>{code}</strong>…</p>
                </div>
            )}
        </div>
    );
}
