import { useState } from 'react';

const SIZE = 10;
const WIN_LENGTH = 5;
const COLS = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j'];

// Converts flat board index → algebraic notation (e.g. index 0 → "a10", index 99 → "j1")
const toAlgebraic = (index) => {
    const row = Math.floor(index / SIZE);
    const col = index % SIZE;
    return COLS[col] + (SIZE - row);
};

const checkWinner = (squares) => {
    const idx = (r, c) => r * SIZE + c;
    const directions = [
        { dr: 0, dc: 1, dir: 'horizontal' },
        { dr: 1, dc: 0, dir: 'vertical' },
        { dr: 1, dc: 1, dir: 'diagonal-right' },
        { dr: 1, dc: -1, dir: 'diagonal-left' },
    ];

    for (let r = 0; r < SIZE; r++) {
        for (let c = 0; c < SIZE; c++) {
            const player = squares[idx(r, c)];
            if (!player) continue;

            for (const { dr, dc, dir } of directions) {
                const line = [idx(r, c)];
                for (let i = 1; i < WIN_LENGTH; i++) {
                    const nr = r + dr * i;
                    const nc = c + dc * i;
                    if (nr < 0 || nr >= SIZE || nc < 0 || nc >= SIZE) break;
                    if (squares[idx(nr, nc)] !== player) break;
                    line.push(idx(nr, nc));
                }
                if (line.length === WIN_LENGTH) return { player, line, direction: dir };
            }
        }
    }
    return null;
};

export const useGameBoard = () => {
    const [board, setBoard] = useState(Array(SIZE * SIZE).fill(null));
    const [xIsNext, setXIsNext] = useState(true);
    const [winner, setWinner] = useState(null);
    const [winningLine, setWinningLine] = useState([]);
    const [winDirection, setWinDirection] = useState(null);

    const [gameStatus, setGameStatus] = useState('waiting');  // waiting | ongoing | finished | aborted
    const [result, setResult]         = useState(null);        // null | 'X_wins' | 'O_wins' | 'aborted'
    const [startTime, setStartTime]   = useState(null);
    const [endTime, setEndTime]       = useState(null);


    const [moves, setMoves] = useState([]);

    const handleCellClick = (index) => {
        if (board[index] || winner || gameStatus === 'aborted' || gameStatus === 'finished') return;

        const now = new Date();
        const currentPlayer = xIsNext ? 'X' : 'O';
        const newBoard = [...board];
        newBoard[index] = currentPlayer;

        // Record start time on the very first move
        if (!startTime) setStartTime(now);

        const newMove = {
            moveNumber:        moves.length + 1,
            playerId:          currentPlayer,   // will become actual user _id once auth is wired up
            algebraicNotation: toAlgebraic(index),
            timestamp:         now,
        };

        setBoard(newBoard);
        setMoves(prev => [...prev, newMove]);
        setGameStatus('ongoing');

        const winResult = checkWinner(newBoard);
        if (winResult) {
            setWinner(winResult.player);
            setWinningLine(winResult.line);
            setWinDirection(winResult.direction);
            setGameStatus('finished');
            setEndTime(now);
            setResult(winResult.player === 'X' ? 'X_wins' : 'O_wins');
        } else {
            setXIsNext(!xIsNext);
        }
    };

    const abortGame = () => {
        if (gameStatus !== 'ongoing') return;
        setGameStatus('aborted');
        setEndTime(new Date());
        setResult('aborted');
    };

    const resetGame = () => {
        setBoard(Array(SIZE * SIZE).fill(null));
        setXIsNext(true);
        setWinner(null);
        setWinningLine([]);
        setWinDirection(null);
        setGameStatus('waiting');
        setResult(null);
        setStartTime(null);
        setEndTime(null);
        setMoves([]);
    };

    // Returns a snapshot matching the GAME_SESSION + MOVE structure — ready for backend POST
    const getGameSessionData = () => ({
        gameType:      'LOCAL',
        boardSize:     '10x10',
        boardStyle:    'default',
        player1Marker: 'X',
        player2Marker: 'O',
        gameStatus,
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
        handleCellClick,
        abortGame,
        resetGame,
        getGameSessionData,
    };
};
