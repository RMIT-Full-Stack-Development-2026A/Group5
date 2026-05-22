import React from 'react';
import './gameBoard.css';
import { useOnlineGameBoard } from './useOnlineGameBoard';
import { ClassicGameBoard } from './boards/ClassicGameBoard';


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

            <ClassicGameBoard
                board={board}
                winningLine={winningLine}
                winDirection={winDirection}
                handleCellClick={handleCellClick}
                boardSize={boardSize}
            />

            <div className="lobby-footer text-center">
                ROOM CODE: {roomInfo?.code} · LOBBY ID: {lobbyId}
            </div>
        </div>
    );
};

export default OnlineGameBoard;
