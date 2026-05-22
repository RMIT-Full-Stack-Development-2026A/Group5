import React, { useEffect, useRef, useState } from 'react';
import './gameBoard.css';
import { useOnlineGameBoard } from './useOnlineGameBoard';
import { ClassicGameBoard } from './boards/ClassicGameBoard';
import { getSocket, emitAck } from '../../services/socketClient';


const OnlineGameBoard = ({ roomInfo }) => {
    const {
        board, xIsNext, winner, winningLine, winDirection,
        gameStatus,
        handleCellClick, abortGame, resetGame,
        myMark, myTurn,
    } = useOnlineGameBoard(roomInfo);

    const boardSize  = parseInt(String(roomInfo?.boardSize || '10x10').split('x')[0], 10);
    const lobbyId    = roomInfo?.gameNumber
        ? String(roomInfo.gameNumber).padStart(7, '0')
        : roomInfo?.code || '-------';

    const isAborted  = gameStatus === 'aborted';
    const isFinished = gameStatus === 'finished';
    const isOver     = isFinished || isAborted;

    const statusText = isAborted
        ? 'Game aborted'
        : winner
            ? `Player ${winner} wins!`
            : myTurn
                ? 'Your turn'
                : `Waiting for opponent (${xIsNext ? 'P1' : 'P2'})`;

    const statusColor = isAborted
        ? 'text-secondary'
        : winner === 'X' ? 'text-danger'
            : winner === 'O' ? 'text-primary'
                : 'text-dark';

    const youName        = roomInfo?.you === 'player1' ? roomInfo?.player1?.username : roomInfo?.player2?.username;
    const opponentName   = roomInfo?.you === 'player1' ? roomInfo?.player2?.username : roomInfo?.player1?.username;

    //  Chat 
    const [messages, setMessages]   = useState([]);
    const [draft, setDraft]         = useState('');
    const scrollerRef               = useRef(null);

    useEffect(() => {
        const socket = getSocket();
        const onChat = (msg) => setMessages((prev) => [...prev, msg]);
        socket.on('chatMessage', onChat);
        return () => socket.off('chatMessage', onChat);
    }, []);

    useEffect(() => {
        if (scrollerRef.current) {
            scrollerRef.current.scrollTop = scrollerRef.current.scrollHeight;
        }
    }, [messages]);

    const sendChat = async (e) => {
        e.preventDefault();
        const text = draft.trim();
        if (!text) return;
        setDraft('');
        try {
            await emitAck('chat', { message: text });
        } catch (err) {
            console.error('chat failed', err);
        }
    };

    return (
        <div className="d-flex flex-column align-items-center py-4 col-lg-8">
            <div className="d-flex justify-content-center gap-3 w-75 mb-3">
                <button
                    className="btn btn-outline-danger btn-sm px-3"
                    onClick={abortGame}
                    disabled={isOver}
                >Abort</button>
                <button className="btn btn-dark btn-sm px-3" onClick={resetGame}>
                    Leave
                </button>
            </div>

            <div className="d-flex align-items-center mb-3 justify-content-between w-75 px-4">
                <div className="d-flex flex-column">
                    <span className="text-muted">You ({myMark}):</span>
                    <span className="fs-5 fw-semi-bold">{youName || '—'}</span>
                </div>
                <span className={`fw-bold ${statusColor} fs-5`}>{statusText}</span>
                <div className="d-flex flex-column">
                    <span className="text-muted">Opponent:</span>
                    <span className="fs-5 fw-semi-bold">{opponentName || '—'}</span>
                </div>
            </div>

            <div className="d-flex flex-wrap gap-3 w-100 justify-content-center align-items-start">
                <ClassicGameBoard
                    board={board}
                    winningLine={winningLine}
                    winDirection={winDirection}
                    handleCellClick={handleCellClick}
                    boardSize={boardSize}
                    style={{
                        '--cell-size': `clamp(20px, calc((100vw - 360px) / ${boardSize} - 4px), ${boardSize >= 15 ? 36 : 50}px)`,
                    }}
                />

                {/* Chat panel */}
                <div className="card d-flex flex-column" style={{ width: 280, maxHeight: 480, flexShrink: 0 }}>
                    <div className="card-header py-2 fw-bold">Chat</div>
                    <div
                        ref={scrollerRef}
                        className="card-body p-2 small"
                        style={{ overflowY: 'auto', flex: 1 }}
                    >
                        {messages.length === 0 && (
                            <div className="text-muted">Say hi to your opponent…</div>
                        )}
                        {messages.map((m, i) => {
                            const mine = m.from === youName;
                            return (
                                <div key={i} className={`mb-2 d-flex ${mine ? 'justify-content-end' : 'justify-content-start'}`}>
                                    <div
                                        className={`px-2 py-1 rounded ${mine ? 'bg-primary text-white' : 'bg-light text-dark'}`}
                                        style={{ maxWidth: '85%', wordBreak: 'break-word' }}
                                    >
                                        {!mine && <div className="fw-bold small">{m.from}</div>}
                                        <div>{m.message}</div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                    <form onSubmit={sendChat} className="card-footer p-2 d-flex gap-1">
                        <input
                            type="text"
                            className="form-control form-control-sm"
                            placeholder="Type a message…"
                            value={draft}
                            onChange={(e) => setDraft(e.target.value)}
                            maxLength={500}
                            disabled={isOver}
                        />
                        <button type="submit" className="btn btn-sm btn-primary" disabled={isOver || !draft.trim()}>
                            Send
                        </button>
                    </form>
                </div>
            </div>

            <div className="lobby-footer text-center mt-3">
                ROOM CODE: {roomInfo?.code} · LOBBY ID: {lobbyId}
            </div>
        </div>
    );
};

export default OnlineGameBoard;
