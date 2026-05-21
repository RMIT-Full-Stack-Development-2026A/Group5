import { easyAI, mediumAI, hardAI } from './aiService.js';
import { gameRepository } from '../repositories/gameRepo.js';

const validateSession = (data) => {
    if (!data.gameType) throw { status: 400, message: 'Game type is required.' };
    if (!data.boardSize) throw { status: 400, message: 'Board size is required.' };
    if (!data.player1Name) throw { status: 400, message: 'Player 1 name is required.' };
    if (!data.player2Name) throw { status: 400, message: 'Player 2 name is required.' };
    if (!data.player1Marker) throw { status: 400, message: 'Player 1 marker is required.' };
    if (!data.player2Marker) throw { status: 400, message: 'Player 2 marker is required.' };
};

export const getMove = (board, difficulty, lastMove, boardSize) => {
    if (difficulty === 'easy') {
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
                const { count, openEnds } = evaluateLine(board, i, player, dr, dc, boardSize)
                if (count >= 5) {
                    return i;
                }
                else if (count === 4 && openEnds === 2) {
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