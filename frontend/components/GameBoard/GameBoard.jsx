import React from 'react';
import './gameBoard.css';
import { useGameBoard } from './useGameBoard';
import { ClassicGameBoard } from './ClassicGameBoard';
import { CelestialGameBoard } from './CelestialGameBoard';

const LOBBY_ID = '1234567';

const GameBoard = ({ selectedMode, boardStyle = 'classic' }) => {
    const {
        board, xIsNext, winner, winningLine, winDirection,
        gameStatus,
        handleCellClick, abortGame, resetGame,
    } = useGameBoard(selectedMode);

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
        <div className="d-flex flex-column align-items-center py-4 col-lg-8 ">

            {/* Status + buttons */}
            <div className="d-flex align-items-center gap-2 mb-3">
                <span className={`fs-5 fw-bold ${statusColor}`}>{statusText}</span>
                <span className="badge text-bg-light border">Mode: {selectedMode}</span>
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
            {boardStyle === 'celestial' ? (
                <CelestialGameBoard
                    board={board}
                    winningLine={winningLine}
                    isFinished={isFinished}
                    handleCellClick={handleCellClick}
                />
            ) : (
                <ClassicGameBoard
                    board={board}
                    winningLine={winningLine}
                    winDirection={winDirection}
                    handleCellClick={handleCellClick}
                />
            )}

            {/* Lobby footer */}
            <div className="lobby-footer text-center">
                LOBBY ID: {LOBBY_ID}
            </div>

        </div>
    );
};

export default GameBoard;
