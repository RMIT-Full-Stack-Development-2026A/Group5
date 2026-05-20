import { sessionService } from '../services/sessionService.js';


export const startGame = async (req, res) => {
    try {
        const session = await sessionService.startGame(req.user.id, req.body);
        return res.status(201).json({
            matchId:    session._id,
            gameNumber: session.gameNumber,
            session,
        });
    } catch (err) {
        console.error('[startGame] error:', err);
        return res.status(err.statusCode || 500).json({ message: err.message || 'Failed to start game.', code: err.code, name: err.name });
    }
};


export const recordMove = async (req, res) => {
    try {
        const session = await sessionService.recordMove(req.params.id, req.user.id, req.body);
        return res.status(200).json({ session });
    } catch (err) {
        return res.status(err.statusCode || 500).json({ message: err.message || 'Failed to record move.' });
    }
};


export const finishGame = async (req, res) => {
    try {
        const session = await sessionService.finishGame(req.params.id, req.user.id, req.body);
        return res.status(200).json({ session });
    } catch (err) {
        return res.status(err.statusCode || 500).json({ message: err.message || 'Failed to finish game.' });
    }
};


export const abortGame = async (req, res) => {
    try {
        const session = await sessionService.abortGame(req.params.id, req.user.id);
        return res.status(200).json({ session });
    } catch (err) {
        return res.status(err.statusCode || 500).json({ message: err.message || 'Failed to abort game.' });
    }
};


export const getHistory = async (req, res) => {
    try {
        const { search, result, gameType, startDate, endDate, sortOrder } = req.query;
        const sessions = await sessionService.getHistory(req.user.id, {
            search, result, gameType, startDate, endDate, sortOrder,
        });
        return res.status(200).json({ sessions });
    } catch (err) {
        return res.status(err.statusCode || 500).json({ message: err.message || 'Failed to fetch history.' });
    }
};


export const getMatchById = async (req, res) => {
    try {
        const session = await sessionService.getById(req.params.id, req.user.id);
        return res.status(200).json({ session });
    } catch (err) {
        return res.status(err.statusCode || 500).json({ message: err.message || 'Failed to fetch match.' });
    }
};
