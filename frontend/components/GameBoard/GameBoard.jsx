import React from 'react';
import './gameBoard.css';
import { useGameBoard } from './useGameBoard';

const LOBBY_ID = '1234567';

const GameBoard = () => {
    const {
        board, xIsNext, winner, winningLine, winDirection,
        gameStatus,
        handleCellClick, abortGame, resetGame,
    } = useGameBoard();

    const isAborted  = gameStatus === 'aborted';
    const isFinished = gameStatus === 'finished';
    const isOver     = isFinished || isAborted;

    const statusText = isAborted
        ? 'Game aborted — no winner'
        : winner
            ? `Player ${winner} wins!`
            : `Next player: ${xIsNext ? 'X' : 'O'}`;

    const statusColor = isAborted
        ? 'text-secondary'
        : winner === 'X' ? 'text-danger'
        : winner === 'O' ? 'text-primary'
        : 'text-dark';

    return (
        <div className="d-flex flex-column align-items-start py-4">

            {/* Status + buttons */}
            <div className="d-flex align-items-center gap-2 mb-3">
                <span className={`fs-5 fw-bold ${statusColor}`}>{statusText}</span>
                <button
                    className="btn btn-outline-danger btn-sm px-3"
                    onClick={abortGame}
                    disabled={isOver}
                >
                    Abort
                </button>
                <button className="btn btn-dark btn-sm px-3" onClick={resetGame}>
                    Reset
                </button>
            </div>

            {/* Board */}
            <div className={`board ${isOver ? 'board-over' : ''}`}>
                {board.map((cell, index) => {
                    const row = Math.floor(index / 10);
                    const col = index % 10;
                    const isDark = (row + col) % 2 === 0;
                    const isWin  = winningLine.includes(index);

                    let cellClass = `cell ${isDark ? 'bg-dark-cell' : 'bg-light-cell'}`;
                    if (isWin) cellClass += ` win ${winDirection}`;

                    return (
                        <div
                            key={index}
                            className={cellClass}
                            onClick={() => handleCellClick(index)}
                        >
                            {cell && <span className={`piece piece-${cell}`}>{cell}</span>}
                        </div>
                    );
                })}
            </div>

            {/* Lobby footer */}
            <div className="lobby-footer">
                LOBBY ID: {LOBBY_ID}
            </div>

        </div>
    );
};

export default GameBoard;
