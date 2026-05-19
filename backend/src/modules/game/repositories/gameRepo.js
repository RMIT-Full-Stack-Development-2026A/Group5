import Game from '../model/gameModel.js';

export const gameRepository = {
    // search by gameNumber or opponent name
    findByPlayer: async (playerId, { search = '', page = 1, limit = 5, sortOrder = 'desc', result = null, gameMode = null, startDate = null, endDate = null }) => {
        const query = {
            $or: [{ player1: playerId }, { player2Id: playerId }],
        };

        // case-insensitive pattern search on gameNumber or player2Name
        if (search) {
            const num = parseInt(search);
            query.$and = [{
                $or: [
                ...(num ? [{ gameNumber: num }] : []),
                { player2Name: { $regex: search, $options: 'i' } },
                ],
            }];
        }

        // filter by result and gameMode
        if (result)   query.result   = result;
        if (gameMode) query.gameMode = gameMode;

        // filter by date range
        if (startDate || endDate) {
            query.startTime = {};
            if (startDate) query.startTime.$gte = new Date(startDate);
            if (endDate) query.startTime.$lte = new Date(endDate);
        }

        const total = await Game.countDocuments(query);
        const games = await Game.find(query)
            .sort({ startTime: sortOrder === 'asc' ? 1 : -1 })
            .skip((page - 1) * limit)
            .limit(limit)
            .populate('player1', 'username avatarUrl')
            .populate('player2Id', 'username avatarUrl');

        return { games, total, page, totalPages: Math.ceil(total / limit) };
    },

    findById: (id) => Game.findById(id).populate('player1 player2Id', 'username avatarUrl'),
    create: (data) => Game.create(data),
    updateById: (id, data) => Game.findByIdAndUpdate(id, data, { new: true }),
    findAll: () => Game.find().sort({ startTime: -1 }) .populate('player1 player2Id', 'username'),
};