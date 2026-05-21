
const easyAI = (board, lastMove, boardSize) => {
    const emptyCells = board.map((cell, index) =>
        (cell === null ? index : null))
        .filter((v) => v !== null);

    if (emptyCells.length === 0) return null;

    //Simple AI: Randomly pick an adjacent cell
    const adjacentCells = [];
    const directions = [
        [-1, -1], [-1, 0], [-1, 1],
        [0, -1], [0, 1],
        [1, -1], [1, 0], [1, 1]
    ];

    const row = Math.floor(lastMove / boardSize);
    const col = lastMove % boardSize;
    for (const [dr, dc] of directions) {
        const nr = row + dr;
        const nc = col + dc;
        if (nr >= 0 && nr < boardSize && nc >= 0 && nc < boardSize && board[nr * boardSize + nc] === null) {
            adjacentCells.push(nr * boardSize + nc);
        }
    }
    if (adjacentCells.length === 0) {
        // If no adjacent cells are available, pick any random empty cell
        return emptyCells[Math.floor(Math.random() * emptyCells.length)];

    }
    return adjacentCells[Math.floor(Math.random() * adjacentCells.length)];
}

const evaluateLine = (board, index, player, dRow, dCol, boardSize) => {
    let count = 1;
    let openEnds = 0;

    const row = Math.floor(index / boardSize);
    const col = index % boardSize;

    // Check in the forward direction
    let r1 = row + dRow;
    let c1 = col + dCol;

    while (r1 >= 0 && r1 < boardSize && c1 >= 0 && c1 < boardSize && board[r1 * boardSize + c1] === player) {
        count++;
        r1 += dRow;
        c1 += dCol;
    }

    if (r1 >= 0 && r1 < boardSize && c1 >= 0 && c1 < boardSize && board[r1 * boardSize + c1] === null) {
        openEnds++;
    }

    // Check in the backward direction
    let r2 = row - dRow;
    let c2 = col - dCol;
    while (r2 >= 0 && r2 < boardSize && c2 >= 0 && c2 < boardSize && board[r2 * boardSize + c2] === player) {
        count++;
        r2 -= dRow;
        c2 -= dCol;
    }
    if (r2 >= 0 && r2 < boardSize && c2 >= 0 && c2 < boardSize && board[r2 * boardSize + c2] === null) {
        openEnds++;
    }

    return { count, openEnds };
};

// Medium AI: Block opponent's winning move
const mediumAI = (board, lastMove, boardSize) => {
    const directions = [
        { dr: 0, dc: 1 },   // horizontal
        { dr: 1, dc: 0 },   // vertical
        { dr: 1, dc: 1 },   // diagonal right
        { dr: 1, dc: -1 }   // diagonal left
    ];

    const opponent = 'X';
    let highestPriority = 0;

    let bestMove = null;

    // Check if opponent has a winning move and block it
    for (let i = 0; i < board.length; i++) {
        let priority = 0;
        let open3 = 0;
        if (board[i] === null) {
            for (const { dr, dc } of directions) {
                const { count, openEnds } = evaluateLine(board, i, opponent, dr, dc, boardSize);
                if (count >= 5) {
                    priority = 3;
                }
                if (count === 4 && openEnds === 2) {
                    priority = 2;
                }
                if (count === 3 && openEnds === 2) {
                    ++open3;
                }
            }
            if (open3 >= 2) {
                priority = 1;
            }

            if (priority > highestPriority) {
                bestMove = i;
                highestPriority = priority;
            }
        }
    }
    if (bestMove === null) {
        return easyAI(board, lastMove, boardSize);
    }
    return bestMove;
}

const findWinningMove = (board, boardSize, player) => {
    const directions = [
        { dr: 0, dc: 1 },   // horizontal
        { dr: 1, dc: 0 },   // vertical
        { dr: 1, dc: 1 },   // diagonal right
        { dr: 1, dc: -1 }   // diagonal left
    ];

    for (let i = 0; i < board.length; ++i) {
        if (board[i] === null) {

            for (const { dr, dc } of directions) {
                const { count } = evaluateLine(board, i, player, dr, dc, boardSize)
                if (count >= 5) {
                    return i;
                }
            }
        }
    }
    return null; // If the guard finishes walking and finds no wins, return null
}
// Hard AI: Try to win, if not possible, block opponent's winning move (Fallback to medium), otherwise pick random (Fallback to easy)
const hardAI = (board, lastMove, boardSize) => {
    const ai = "O"
    const opponent = "X"

    const winMove = findWinningMove(board, boardSize, ai)
    if (winMove !== null) {
        return winMove;
    }
    else {
        return mediumAI(board, lastMove, boardSize)
    }
}

export { easyAI, mediumAI, hardAI };


// ─────────────────────────────────────────────────────────────
//  Game session management (start / move / finish / abort / history)
// ─────────────────────────────────────────────────────────────

import { gameRepository } from '../repositories/gameRepo.js';


const AI_NAMES = {
    easy:   'Jeremy',
    medium: 'Casey',
    hard:   '404 Not Found',
};


const buildNewSession = (playerId, payload) => {
    const {
        gameType,
        aiLevel = null,
        boardSize,
        boardStyle = 'classic',
        player2Name = null,
        player2 = null,
    } = payload;

    const resolvedName = gameType === 'ai'
        ? (AI_NAMES[aiLevel] || 'Bot')
        : player2Name;

    return {
        player1: playerId,
        player2,
        player2Name: resolvedName,
        gameType,
        aiLevel: gameType === 'ai' ? aiLevel : null,
        boardSize,
        boardStyle,
        status: 'in_progress',
        startTime: new Date(),
    };
};


const assertOwnership = (session, playerId) => {
    const ownerId = session.player1?._id ?? session.player1;
    if (String(ownerId) !== String(playerId)) {
        throw { statusCode: 403, message: 'You are not a participant of this match.' };
    }
};


export const sessionService = {

    startGame: async (playerId, payload) => {
        const data = buildNewSession(playerId, payload);
        return gameRepository.create(data);
    },

    recordMove: async (matchId, playerId, move) => {
        const session = await gameRepository.findById(matchId);
        if (!session) throw { statusCode: 404, message: 'Match not found.' };
        assertOwnership(session, playerId);

        if (session.status !== 'in_progress') {
            throw { statusCode: 409, message: 'Match is already finished.' };
        }

        const next = {
            index:      session.moves.length,
            playerSlot: move.playerSlot,
            position:   move.position,
            notation:   move.notation,
            timestamp:  new Date(),
        };

        return gameRepository.pushMove(matchId, next);
    },

    finishGame: async (matchId, playerId, { result, winLine = [] }) => {
        const session = await gameRepository.findById(matchId);
        if (!session) throw { statusCode: 404, message: 'Match not found.' };
        assertOwnership(session, playerId);

        return gameRepository.updateById(matchId, {
            status: 'finished',
            result,
            winLine,
            endTime: new Date(),
        });
    },

    abortGame: async (matchId, playerId) => {
        const session = await gameRepository.findById(matchId);
        if (!session) throw { statusCode: 404, message: 'Match not found.' };
        assertOwnership(session, playerId);

        return gameRepository.updateById(matchId, {
            status: 'aborted',
            result: 'aborted',
            endTime: new Date(),
        });
    },

    getHistory: async (playerId, filters = {}) => {
        const GAME_TYPE_MAP = {
            single: 'ai',
            two:    'local',
            online: 'online',
        };
        const mappedGameType = filters.gameType
            ? (GAME_TYPE_MAP[filters.gameType] || filters.gameType)
            : null;

        return gameRepository.findByPlayer(playerId, {
            ...filters,
            gameType: mappedGameType,
        });
    },

    getById: async (matchId, playerId) => {
        const session = await gameRepository.findById(matchId);
        if (!session) throw { statusCode: 404, message: 'Match not found.' };
        assertOwnership(session, playerId);
        return session;
    },
};