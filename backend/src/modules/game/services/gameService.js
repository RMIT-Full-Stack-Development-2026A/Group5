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
    if (difficulty === 'medium') {
        return mediumAI(board, lastMove, boardSize);
    }
    if (difficulty === 'hard') {
        return hardAI(board, lastMove, boardSize);
    }
    return null;
};

export const createSession = async (userId, sessionData) => {
    validateSession(sessionData);
    const prepared = {
        ...sessionData,
        player1Id: userId,
        startTime: sessionData.startTime ? new Date(sessionData.startTime) : new Date(),
        endTime: sessionData.endTime ? new Date(sessionData.endTime) : null,
        isActive: sessionData.result === 'pending',
    };
    return gameRepository.create(prepared);
};

export const getSessionsForUser = async (userId, filters) => gameRepository.findByPlayer(userId, filters);
export const getSessionById = async (id) => {
    const session = await gameRepository.findById(id);
    if (!session) throw { status: 404, message: 'Game session not found.' };
    return session;
};

export const createRoom = async (userId, roomData) => {
    validateSession(roomData);
    const prepared = {
        ...roomData,
        player1Id: userId,
        isActive: true,
        result: 'pending',
        startTime: new Date(),
        endTime: null,
    };
    return gameRepository.create(prepared);
};

export const joinRoom = async (roomId, userId, userName, avatar, marker) => {
    const room = await gameRepository.findById(roomId);
    if (!room) throw { status: 404, message: 'Room not found.' };
    if (!room.isActive) throw { status: 400, message: 'Room is no longer active.' };

    return gameRepository.updateById(roomId, {
        player2Id: userId,
        player2Name: userName,
        player2Avatar: avatar,
        player2Marker: marker,
    });
};

export const listActiveRooms = async (filters) => {
    const rooms = await gameRepository.findActiveRooms(filters);
    const total = await gameRepository.countActiveRooms(filters);
    return { rooms, total, page: filters.page || 1, totalPages: Math.ceil(total / (filters.limit || 10)) };
};

export const closeRoom = async (roomId) => {
    const room = await gameRepository.updateById(roomId, {
        isActive: false,
        result: 'aborted',
        endTime: new Date(),
    });
    if (!room) throw { status: 404, message: 'Room not found.' };
    return room;
};
