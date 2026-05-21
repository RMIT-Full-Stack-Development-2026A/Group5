import { useEffect, useRef, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { gameSessionService } from '../../services/gameSessionService';
import { ClassicGameBoard } from '../../components/GameBoard/boards/ClassicGameBoard';

const boardSizeToInt = (s) => parseInt(String(s).split('x')[0], 10);

const renderMarker = (slot) => slot === 'player1' ? 'X' : 'O';

const aiDisplayName = (level) => {
    if (level === 'easy')   return 'Jeremy';
    if (level === 'medium') return 'Morgan';
    if (level === 'hard')   return '404 Not Found';
    return 'AI';
};

const opponentLabel = (session) => {
    if (session.gameType === 'ai') return aiDisplayName(session.aiLevel);
    return session.player2?.username || session.player2Name || '—';
};


export default function Replay() {
    const { id } = useParams();
    const [session, setSession] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const [cursor, setCursor] = useState(0);
    const [playing, setPlaying] = useState(false);
    const tickRef = useRef(null);

    useEffect(() => {
        let cancelled = false;
        (async () => {
            try {
                const { session } = await gameSessionService.getById(id);
                if (!cancelled) setSession(session);
            } catch (err) {
                if (!cancelled) setError(err.message || 'Failed to load match');
            } finally {
                if (!cancelled) setLoading(false);
            }
        })();
        return () => { cancelled = true; };
    }, [id]);

    useEffect(() => {
        if (!playing || !session) return;
        tickRef.current = setInterval(() => {
            setCursor((c) => {
                if (c >= session.moves.length) {
                    setPlaying(false);
                    return c;
                }
                return c + 1;
            });
        }, 800);
        return () => clearInterval(tickRef.current);
    }, [playing, session]);

    if (loading) return <div className="container py-5">Loading replay…</div>;
    if (error)   return <div className="container py-5 text-danger">{error}</div>;
    if (!session) return null;

    const size = boardSizeToInt(session.boardSize);

    const board = Array(size * size).fill(null);
    for (let i = 0; i < cursor && i < session.moves.length; i++) {
        const m = session.moves[i];
        board[m.position] = renderMarker(m.playerSlot);
    }

    const atEnd        = cursor >= session.moves.length;
    const showWinLine  = atEnd && session.status === 'finished';
    const winningLine  = showWinLine ? (session.winLine || []) : [];

    const inferWinDirection = (line, boardSize) => {
        if (!line || line.length < 2) return null;
        const diff = line[1] - line[0];
        if (diff === 1)              return 'horizontal';
        if (diff === boardSize)      return 'vertical';
        if (diff === boardSize + 1)  return 'diagonal-right';
        if (diff === boardSize - 1)  return 'diagonal-left';
        return 'horizontal';
    };
    const winDirection = showWinLine ? inferWinDirection(winningLine, size) : null;

    const lastMove   = session.moves[cursor - 1] || null;
    const totalMoves = session.moves.length;
    const noop       = () => {};

    return (
        <div className="container py-4">
            <div className="d-flex justify-content-between align-items-center mb-3">
                <h2 className="fw-bold mb-0">
                    Match {String(session.gameNumber || '').padStart(6, '0')} — Replay
                </h2>
                <Link to="/profile" className="btn btn-outline-secondary btn-sm">Back to history</Link>
            </div>

            <div className="row g-4">
                <div className="col-lg-8 d-flex justify-content-center">
                    <ClassicGameBoard
                        board={board}
                        winningLine={winningLine}
                        winDirection={winDirection}
                        handleCellClick={noop}
                        boardSize={size}
                    />
                </div>

                <div className="col-lg-4">
                    <div className="card p-3">
                        <p className="mb-1"><strong>Player 1 (X):</strong> {session.player1?.username || '—'}</p>
                        <p className="mb-1"><strong>Player 2 (O):</strong> {opponentLabel(session)}</p>
                        <p className="mb-1"><strong>Board:</strong> {session.boardSize}</p>
                        <p className="mb-1"><strong>Status:</strong> {session.status}</p>
                        <p className="mb-3"><strong>Result:</strong> {session.result || '—'}</p>

                        <p className="mb-2">Move {cursor} / {totalMoves}{lastMove ? ` — ${lastMove.notation}` : ''}</p>

                        <div className="d-flex gap-2 mb-2 flex-wrap">
                            <button className="btn btn-outline-dark btn-sm" onClick={() => { setPlaying(false); setCursor(0); }}>⏮ Restart</button>
                            <button className="btn btn-outline-dark btn-sm" onClick={() => { setPlaying(false); setCursor((c) => Math.max(0, c - 1)); }}>◀ Back</button>
                            {playing
                                ? <button className="btn btn-warning btn-sm" onClick={() => setPlaying(false)}>⏸ Pause</button>
                                : <button className="btn btn-success btn-sm" onClick={() => setPlaying(true)} disabled={cursor >= totalMoves}>▶ Play</button>
                            }
                            <button className="btn btn-outline-dark btn-sm" onClick={() => { setPlaying(false); setCursor((c) => Math.min(totalMoves, c + 1)); }}>Next ▶</button>
                            <button className="btn btn-outline-dark btn-sm" onClick={() => { setPlaying(false); setCursor(totalMoves); }}>End ⏭</button>
                        </div>

                        <ol className="small mt-3 ps-3" style={{ maxHeight: 240, overflowY: 'auto' }}>
                            {session.moves.map((m, i) => (
                                <li
                                    key={i}
                                    style={{ cursor: 'pointer', fontWeight: i + 1 === cursor ? 700 : 400 }}
                                    onClick={() => { setPlaying(false); setCursor(i + 1); }}
                                >
                                    {m.playerSlot === 'player1' ? 'X' : 'O'} → {m.notation}
                                </li>
                            ))}
                        </ol>
                    </div>
                </div>
            </div>
        </div>
    );
}
