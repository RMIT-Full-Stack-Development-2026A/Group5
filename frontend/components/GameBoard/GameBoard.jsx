import React, { useEffect, useState } from 'react';
import './gameBoard.css';
import { useGameBoard } from './useGameBoard';
import { ClassicGameBoard } from './boards/ClassicGameBoard';
import { CelestialGameBoard } from './boards/CelestialGameBoard';
import { ArcaneGameBoard } from './boards/ArcaneGame';
import { saveGameSession } from '../../services/gameService.js';

const mapResultToBackend = (result) => {
    if (result === 'X_wins') return 'player1';
    if (result === 'O_wins') return 'player2';
    if (result === 'draw') return 'draw';
    if (result === 'aborted') return 'aborted';
    return 'pending';
};

const GameBoard = ({ selectedMode, boardStyle = 'classic', boardSize = 10, gameId, opponentName }) => {
    const {
        board, xIsNext, winner, winningLine, winDirection,
        gameStatus,
        result,
        moves,
        startTime,
        endTime,
        handleCellClick, abortGame, resetGame,
    } = useGameBoard(selectedMode, boardSize);
    const [sessionSaved, setSessionSaved] = useState(false);
    const [saveError, setSaveError] = useState('');

    const isAborted = gameStatus === 'aborted';
    const isFinished = gameStatus === 'finished';
    const isOver = isFinished || isAborted;

    useEffect(() => {
        if (gameStatus === 'waiting') {
            setSessionSaved(false);
            setSaveError('');
        }
    }, [gameStatus]);

    useEffect(() => {
        const shouldSave = (isFinished || isAborted) && !sessionSaved && moves.length > 0;
        if (!shouldSave) return;

        const saveSession = async () => {
            try {
                const gameType = selectedMode === 'local' ? 'local' : selectedMode === 'online' ? 'online' : 'ai';
                const payload = {
                    gameType,
                    boardSize: `${boardSize}x${boardSize}`,
                    boardStyle,
                    player1Name: 'You',
                    player2Name: selectedMode === 'local'
                        ? opponentName || 'Player 2'
                        : selectedMode === 'online'
                            ? opponentName || 'Opponent'
                            : 'AI',
                    player1Marker: 'X',
                    player2Marker: 'O',
                    result: mapResultToBackend(result),
                    startTime,
                    endTime,
                    moves,
                };

                await saveGameSession(payload);
                setSessionSaved(true);
            } catch (error) {
                setSaveError(error.message || 'Unable to save game history.');
            }
        };

        saveSession();
    }, [isFinished, isAborted, sessionSaved, moves, selectedMode, opponentName, boardSize, boardStyle, result, startTime, endTime]);

    const LOBBY_ID = '1234567';

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
            <button className="btn btn-dark btn-sm px-3" onClick={resetGame}>
                Reset
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

            {saveError && (
                <div className="alert alert-warning w-75 mt-3" role="alert">
                    {saveError}
                </div>
            )}
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
