import React, { useEffect, useRef } from 'react';
import './gameBoard.css';
import { useGameBoard } from './useGameBoard';
import { ClassicGameBoard } from './boards/ClassicGameBoard';
import { CelestialGameBoard } from './boards/CelestialGameBoard';
import { ArcaneGameBoard } from './boards/ArcaneGame';
import { gameSessionService } from '../../services/gameSessionService';
import OnlineGameBoard from './OnlineGameBoard';


const GameBoard = ({ selectedMode, boardStyle = 'classic', boardSize = 10, gameId, gameNumber, opponentName, roomInfo }) => {
    // Online mode is fully delegated — uses sockets, not REST persistence.
    if (selectedMode === 'online') {
        return <OnlineGameBoard roomInfo={roomInfo} />;
    }

    const {
        board, xIsNext, winner, winningLine, winDirection,
        gameStatus, moves,
        handleCellClick, abortGame, resetGame,
    } = useGameBoard(selectedMode, boardSize);

    const LOBBY_ID = gameNumber ? String(gameNumber).padStart(7, '0') : '1234567';

    // Persist each new move to the backend as it happens.
    const sentMoveCountRef = useRef(0);
    useEffect(() => {
        if (!gameId) return;
        if (moves.length <= sentMoveCountRef.current) return;

        const pending = moves.slice(sentMoveCountRef.current);
        sentMoveCountRef.current = moves.length;

        (async () => {
            for (const m of pending) {
                try {
                    await gameSessionService.recordMove(gameId, {
                        playerSlot: m.playerId === 'X' ? 'player1' : 'player2',
                        position:   m.index,
                        notation:   m.algebraicNotation,
                    });
                } catch (err) {
                    console.error('Failed to record move', err);
                }
            }
        })();
    }, [moves, gameId]);

    // Persist game result on finish / abort.
    const finalizedRef = useRef(false);
    useEffect(() => {
        if (!gameId) return;
        if (finalizedRef.current) return;

        if (gameStatus === 'finished' && winner) {
            finalizedRef.current = true;
            gameSessionService.finish(gameId, {
                result: winner === 'X' ? 'player1' : 'player2',
                winLine: winningLine,
            }).catch((err) => console.error('Failed to finish match', err));
        } else if (gameStatus === 'aborted') {
            finalizedRef.current = true;
            gameSessionService.abort(gameId).catch((err) =>
                console.error('Failed to abort match', err));
        }
    }, [gameStatus, winner, winningLine, gameId]);

    // Allow a fresh game/reset to be recorded again
    useEffect(() => {
        if (gameStatus === 'waiting') {
            finalizedRef.current = false;
            sentMoveCountRef.current = 0;
        }
    }, [gameStatus]);

    const isAborted = gameStatus === 'aborted';
    const isFinished = gameStatus === 'finished';
    const isOver = isFinished || isAborted;

    const statusText = isAborted
        ? 'Game aborted — no winner'
        : winner
            ? `Player ${winner} wins!`
            : `Next player: ${xIsNext ? 'P1' : 'P2'}`;

    const statusColor = isAborted
        ? 'text-secondary'
        : winner === 'X' ? 'text-danger'
            : winner === 'O' ? 'text-primary'
                : 'text-dark';

    let boardContent;

    if (boardStyle === 'celestial') {
        boardContent = (
            <CelestialGameBoard
                board={board}
                winningLine={winningLine}
                isFinished={isFinished}
                handleCellClick={handleCellClick}
                boardSize={boardSize}
            />
        );
    } else if (boardStyle === 'classic') {
        boardContent = (
            <ClassicGameBoard
                board={board}
                winningLine={winningLine}
                winDirection={winDirection}
                handleCellClick={handleCellClick}
                boardSize={boardSize}
            />
        );
    } else if (boardStyle === 'arcane') {
        boardContent = (
            <ArcaneGameBoard
                board={board}
                winningLine={winningLine}
                isFinished={isFinished}
                winner={winner}
                handleCellClick={handleCellClick}
                boardSize={boardSize}
            />
        );
    }

    return (
        <div className="d-flex flex-column align-items-center py-4 col-lg-8 ">
            <div className="d-flex justify-content-center gap-3 w-75 mb-3">
            <button
                className="btn btn-outline-danger btn-sm px-3"
                onClick={abortGame}
                disabled={isOver}
            >Abort</button>
            <button className="btn btn-dark btn-sm px-3" onClick={resetGame} disabled={!isOver}>
                New Game
            </button>
            </div>


            {/* Status + buttons */}
            <div className="d-flex align-items-center mb-3 justify-content-between w-75 px-4">
                <div className="d-flex flex-column ">
                    <span className="text-muted">P1: </span>
                    <span className={`fs-5 fw-semi-bold`}>You</span>
                </div>
                <span className={`fw-bold ${statusColor} fs-5`}>{statusText}</span>

                <div className="d-flex flex-column">
                    <span className="text-muted">P2: </span>
                    <span className="fs-5 fw-semi-bold">{opponentName || 'Waiting for opponent...'}</span>
                </div>

            </div>

            {/* Board */}
            {boardContent}

            {/* Lobby footer */}
            <div className="lobby-footer text-center">
                LOBBY ID: {LOBBY_ID}
            </div>

        </div >
    );
};

export default GameBoard;