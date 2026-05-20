import { useState, useEffect } from 'react';
import { getAIMove } from './gameBoardService';
import { useGameStatus } from '../../config/context/GameStatusContext';

const WIN_LENGTH = 5;
const COLS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');

// Converts flat board index → algebraic notation (e.g. index 0 → "a10", index 99 → "j1")
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
export const useGameBoard = (selectedMode = 'local', boardSize = 10) => {
    const { gameStatus, setGameStatus } = useGameStatus();
    const [board, setBoard] = useState(Array(boardSize * boardSize).fill(null));
    const [xIsNext, setXIsNext] = useState(true);
    const [winner, setWinner] = useState(null);
    const [winningLine, setWinningLine] = useState([]);
    const [winDirection, setWinDirection] = useState(null);

    const [result, setResult] = useState(null);        // null | 'X_wins' | 'O_wins' | 'aborted'
    const [startTime, setStartTime] = useState(null);
    const [endTime, setEndTime] = useState(null);
    const [AITurn, setAITurn] = useState(false); // For single-player modes, track if it's AI's turn


    const [moves, setMoves] = useState([]);


    const makeMove = (index, player) => {
        const now = new Date();
        const newBoard = [...board];
        newBoard[index] = player;

        // Record start time on the very first move
        if (!startTime) setStartTime(now);

        const newMove = {
            moveNumber: moves.length + 1,
            playerId: player,   // will become actual user _id once auth is wired up
            algebraicNotation: toAlgebraic(index, boardSize),
            timestamp: now,
            index: index,
        };

        setBoard(newBoard);
        setMoves(prev => [...prev, newMove]);
        setGameStatus('ongoing');

        const winResult = checkWinner(newBoard, boardSize);
        if (winResult) {
            setWinner(winResult.player);
            setWinningLine(winResult.line);
            setWinDirection(winResult.direction);
            setGameStatus('finished');
            setEndTime(now);
            setResult(winResult.player === 'X' ? 'X_wins' : 'O_wins');
            return true;
        }
        return false;
    };

    const handleCellClick = (index) => {
        if (gameStatus === 'finished' || gameStatus === 'aborted') return;
        if (board[index]) return; // Cell already occupied
        if (AITurn) return; // Prevent player from moving while AI is thinking

        const player = selectedMode === 'local' ? (xIsNext ? 'X' : 'O') : 'X'; // Default to 'X' for single-player modes
        const gameEnd = makeMove(index, player);
        if (selectedMode === 'local' && !gameEnd) {
            setXIsNext(!xIsNext);
        }
        else {
            setXIsNext(false);
            setAITurn(true);
        }
    };

    useEffect(() => {
        if (AITurn && gameStatus === 'ongoing' && !winner) {

            const timer = setTimeout(() => {
                // Call the AI move function here
                getAIMove({ board, selectedMode, lastMove: moves[moves.length - 1].index, boardSize })
                    .then((aiMove) => {
                        makeMove(aiMove.moveIndex, 'O');
                    })
                    .finally(() => {
                        setAITurn(false);
                        setXIsNext(true);
                    });
            }, 500); // Simulate AI thinking time
            return () => clearTimeout(timer);
        }
    }, [AITurn]);

    const abortGame = () => {
        if (gameStatus !== 'ongoing') return;
        setGameStatus('aborted');
        setEndTime(new Date());
        setResult('aborted');
        setAITurn(false);
    };

    const resetGame = () => {
        setBoard(Array(boardSize * boardSize).fill(null));
        setXIsNext(true);
        setWinner(null);
        setWinningLine([]);
        setWinDirection(null);
        setGameStatus('waiting');
        setResult(null);
        setStartTime(null);
        setEndTime(null);
        setMoves([]);
        setAITurn(false);
    };

    useEffect(() => {
        setBoard(Array(boardSize * boardSize).fill(null));
    }, [boardSize]);

    // Returns a snapshot matching the GAME_SESSION + MOVE structure — ready for backend POST
    const getGameSessionData = () => ({
        gameType: selectedMode,
        boardSize: `${boardSize}x${boardSize}`,
        boardStyle: 'default',
        player1Marker: 'X',
        player2Marker: 'O',
        result,
        startTime,
        endTime,
        moves,
    });

    return {
        board,
        xIsNext,
        winner,
        winningLine,
        winDirection,
        gameStatus,
        result,
        moves,
        AITurn,
        handleCellClick,
        abortGame,
        resetGame,
        getGameSessionData,
    };
};
