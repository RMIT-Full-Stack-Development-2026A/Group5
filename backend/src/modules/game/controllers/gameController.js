import { getMove, createSession, getSessionsForUser, getSessionById, createRoom, joinRoom, listActiveRooms, closeRoom } from '../services/gameService.js';

const handle = (fn) => async (req, res) => {
    try {
        await fn(req, res);
    } catch (err) {
        res.status(err.status || 500).json({ message: err.message });
    }
};

export const getAIMove = handle(async (req, res) => {
    const { board, difficulty, lastMove, boardSize } = req.body;
    const move = getMove(board, difficulty, lastMove, boardSize);
    res.status(200).json({ moveIndex: move ?? null });
});

export const createGameSession = handle(async (req, res) => {
    const session = await createSession(req.user.sub, req.body);
    res.status(201).json(session);
});

export const getUserSessions = handle(async (req, res) => {
    const filters = {
        search: req.query.search || '',
        page: Number(req.query.page) || 1,
        limit: Number(req.query.limit) || 10,
        sortOrder: req.query.sortOrder || 'desc',
        result: req.query.result || null,
        gameType: req.query.gameType || null,
        startDate: req.query.startDate || null,
        endDate: req.query.endDate || null,
    };
    const history = await getSessionsForUser(req.user.sub, filters);
    res.json(history);
});

export const getGameSessionById = handle(async (req, res) => {
    const session = await getSessionById(req.params.id);
    res.json(session);
});

export const createGameRoom = handle(async (req, res) => {
    const room = await createRoom(req.user.sub, req.body);
    res.status(201).json(room);
});

export const joinGameRoom = handle(async (req, res) => {
    const { marker, avatar } = req.body;
    const room = await joinRoom(req.params.id, req.user.sub, req.user.username, avatar, marker);
    res.json(room);
});

export const listRooms = handle(async (req, res) => {
    const filters = {
        search: req.query.search || '',
        page: Number(req.query.page) || 1,
        limit: Number(req.query.limit) || 10,
        sortOrder: req.query.sortOrder || 'desc',
    };
    res.json(await listActiveRooms(filters));
});

export const closeGameRoom = handle(async (req, res) => {
    const room = await closeRoom(req.params.id);
    res.json(room);
});
