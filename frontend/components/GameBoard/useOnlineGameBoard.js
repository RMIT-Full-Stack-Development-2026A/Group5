import { useEffect, useRef, useState, useCallback } from 'react';
import { getSocket, emitAck, disconnectSocket } from '../../services/socketClient';
import { useGameStatus } from '../../config/context/GameStatusContext';


const WIN_LENGTH = 5;
const COLS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');

const toAlgebraic = (index, boardSize) => {
    const row = Math.floor(index / boardSize);
    const col = index % boardSize;
    return COLS[col] + (boardSize - row);
};

const checkWinner = (squares, boardSize) => {
    const idx = (r, c) => r * boardSize + c;
    const directions = [
        { dr: 0, dc: 1, dir: 'horizontal' },
        { dr: 1, dc: 0, dir: 'vertical' },
        { dr: 1, dc: 1, dir: 'diagonal-right' },
        { dr: 1, dc: -1, dir: 'diagonal-left' },
    ];
    for (let r = 0; r < boardSize; r++) {
        for (let c = 0; c < boardSize; c++) {
            const player = squares[idx(r, c)];
            if (!player) continue;
            for (const { dr, dc, dir } of directions) {
                const line = [idx(r, c)];
                for (let i = 1; i < WIN_LENGTH; i++) {
                    const nr = r + dr * i;
                    const nc = c + dc * i;
                    if (nr < 0 || nr >= boardSize || nc < 0 || nc >= boardSize) break;
                    if (squares[idx(nr, nc)] !== player) break;
                    line.push(idx(nr, nc));
                }
                if (line.length === WIN_LENGTH) return { player, line, direction: dir };
            }
        }
    }
    return null;
};


// Hook for online matches. Caller passes in `roomInfo` produced by the lobby:
//   { code, you: 'player1' | 'player2', matchId, boardSize, opponentName }
export const useOnlineGameBoard = (roomInfo) => {
    const { gameStatus, setGameStatus } = useGameStatus();
    const boardSize = parseInt(String(roomInfo?.boardSize || '10x10').split('x')[0], 10);

    const [board, setBoard] = useState(Array(boardSize * boardSize).fill(null));
    const [winner, setWinner] = useState(null);
    const [winningLine, setWinningLine] = useState([]);
    const [winDirection, setWinDirection] = useState(null);
    const [currentTurn, setCurrentTurn] = useState('player1');
    const finalizedRef = useRef(false);

    const mySlot   = roomInfo?.you;          // 'player1' | 'player2'
    const myMark   = mySlot === 'player1' ? 'X' : 'O';
    const xIsNext  = currentTurn === 'player1';
    const myTurn   = currentTurn === mySlot;

    // Receive moves from the server (both mine echoed and opponent's)
    useEffect(() => {
        if (!roomInfo) return;
        const socket = getSocket();

        const onMoveApplied = ({ playerSlot, position }) => {
            setBoard((prev) => {
                const next = [...prev];
                next[position] = playerSlot === 'player1' ? 'X' : 'O';

                const winResult = checkWinner(next, boardSize);
                if (winResult && !finalizedRef.current) {
                    finalizedRef.current = true;
                    setWinner(winResult.player);
                    setWinningLine(winResult.line);
                    setWinDirection(winResult.direction);
                    setGameStatus('finished');
                    emitAck('finish', {
                        result: winResult.player === 'X' ? 'player1' : 'player2',
                        winLine: winResult.line,
                    }).catch((e) => console.error('finish failed', e));
                }
                return next;
            });
            setCurrentTurn(playerSlot === 'player1' ? 'player2' : 'player1');
        };

        const onGameOver = ({ result, winLine }) => {
            if (winLine && winLine.length) setWinningLine(winLine);
            setWinner(result === 'player1' ? 'X' : 'O');
            setGameStatus('finished');
        };

        const onGameAborted = () => {
            setGameStatus('aborted');
        };

        const onOpponentDisconnected = () => {
            if (!finalizedRef.current) {
                finalizedRef.current = true;
                setGameStatus('aborted');
            }
        };

        socket.on('moveApplied',          onMoveApplied);
        socket.on('gameOver',             onGameOver);
        socket.on('gameAborted',          onGameAborted);
        socket.on('opponentDisconnected', onOpponentDisconnected);

        return () => {
            socket.off('moveApplied',          onMoveApplied);
            socket.off('gameOver',             onGameOver);
            socket.off('gameAborted',          onGameAborted);
            socket.off('opponentDisconnected', onOpponentDisconnected);
        };
    }, [roomInfo, boardSize, setGameStatus]);

    // Once the room is set up, mark status as ongoing
    useEffect(() => {
        if (roomInfo && gameStatus !== 'ongoing' && !finalizedRef.current) {
            setGameStatus('ongoing');
        }
    }, [roomInfo, gameStatus, setGameStatus]);

    const handleCellClick = useCallback((index) => {
        if (!roomInfo || finalizedRef.current) return;
        if (board[index]) return;
        if (!myTurn) return;

        emitAck('move', {
            position: index,
            notation: toAlgebraic(index, boardSize),
        }).catch((e) => console.error('move rejected', e.message));
    }, [roomInfo, board, myTurn, boardSize]);

    const abortGame = useCallback(() => {
        if (finalizedRef.current) return;
        finalizedRef.current = true;
        emitAck('abort').catch(() => {});
        setGameStatus('aborted');
    }, [setGameStatus]);

    const resetGame = useCallback(() => {
        // For online, "reset" means leaving the room and going back to lobby
        disconnectSocket();
        setGameStatus('waiting');
        setBoard(Array(boardSize * boardSize).fill(null));
        setWinner(null);
        setWinningLine([]);
        setWinDirection(null);
        finalizedRef.current = false;
    }, [boardSize, setGameStatus]);

    return {
        board,
        xIsNext,
        winner,
        winningLine,
        winDirection,
        gameStatus,
        handleCellClick,
        abortGame,
        resetGame,
        myMark,
        myTurn,
    };
};
