import { sessionRepository } from '../repositories/sessionRepo.js';


const AI_NAMES = {
    easy:   'Easy AI',
    medium: 'Medium AI',
    hard:   'Hard AI',
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


export const sessionService = {

    startGame: async (playerId, payload) => {
        const data = buildNewSession(playerId, payload);
        const session = await sessionRepository.create(data);
        return session;
    },

    recordMove: async (matchId, playerId, move) => {
        const session = await sessionRepository.findById(matchId);
        if (!session) throw { statusCode: 404, message: 'Match not found.' };
        const ownerId = session.player1?._id ?? session.player1;
        if (String(ownerId) !== String(playerId)) {
            throw { statusCode: 403, message: 'You are not a participant of this match.' };
        }
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

        return sessionRepository.pushMove(matchId, next);
    },

    finishGame: async (matchId, playerId, { result, winLine = [] }) => {
        const session = await sessionRepository.findById(matchId);
        if (!session) throw { statusCode: 404, message: 'Match not found.' };
        const ownerId = session.player1?._id ?? session.player1;
        if (String(ownerId) !== String(playerId)) {
            throw { statusCode: 403, message: 'You are not a participant of this match.' };
        }

        return sessionRepository.updateById(matchId, {
            status: 'finished',
            result,
            winLine,
            endTime: new Date(),
        });
    },

    abortGame: async (matchId, playerId) => {
        const session = await sessionRepository.findById(matchId);
        if (!session) throw { statusCode: 404, message: 'Match not found.' };
        const ownerId = session.player1?._id ?? session.player1;
        if (String(ownerId) !== String(playerId)) {
            throw { statusCode: 403, message: 'You are not a participant of this match.' };
        }

        return sessionRepository.updateById(matchId, {
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

        return sessionRepository.findByPlayer(playerId, {
            ...filters,
            gameType: mappedGameType,
        });
    },

    getById: async (matchId, playerId) => {
        const session = await sessionRepository.findById(matchId);
        if (!session) throw { statusCode: 404, message: 'Match not found.' };
        const ownerId = session.player1?._id ?? session.player1;
        if (String(ownerId) !== String(playerId)) {
            throw { statusCode: 403, message: 'You are not a participant of this match.' };
        }
        return session;
    },
};
