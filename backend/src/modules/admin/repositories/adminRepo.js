import Player from '../../player/models/playerModel.js';
import Game from '../../game/model/gameModel.js';

// Return all users except administrators
export const findAllUsers = () => Player.find({ role: { $ne: 'admin' } }).sort({ createdAt: -1 });

export const setUserStatus = (id, isActive) =>
    Player.findByIdAndUpdate(id, { isActive }, { new: true });

export const findAllGames = ({ search = '', result = '', gameType = null, startDate = null, endDate = null, sortOrder = 'desc', page = 1, limit = 10 } = {}) => {
    const query = {};

    if (search) {
        const regex = { $regex: search, $options: 'i' };
        const num = parseInt(search, 10);
        query.$or = [
            { player2Name: regex },
        ];
        if (!Number.isNaN(num)) query.$or.push({ gameNumber: num });
    }

    if (result) query.result = result;
    if (gameType) query.gameType = gameType;

    if (startDate || endDate) {
        query.startTime = {};
        if (startDate) query.startTime.$gte = new Date(startDate);
        if (endDate) query.startTime.$lte = new Date(endDate);
    }

    return Game.find(query)
        .sort({ startTime: sortOrder === 'asc' ? 1 : -1 })
        .skip((page - 1) * limit)
        .limit(limit)
        .populate('player1', 'username')
        .populate('player2', 'username');
};

export const countAllGames = ({ search = '', result = '', gameType = null, startDate = null, endDate = null } = {}) => {
    const query = {};
    if (search) {
        const regex = { $regex: search, $options: 'i' };
        const num = parseInt(search, 10);
        query.$or = [
            { player2Name: regex },
        ];
        if (!Number.isNaN(num)) query.$or.push({ gameNumber: num });
    }
    if (result) query.result = result;
    if (gameType) query.gameType = gameType;
    if (startDate || endDate) {
        query.startTime = {};
        if (startDate) query.startTime.$gte = new Date(startDate);
        if (endDate) query.startTime.$lte = new Date(endDate);
    }
    return Game.countDocuments(query);
};
