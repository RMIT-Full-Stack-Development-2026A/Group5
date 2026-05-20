import Game from '../model/gameModel.js';

export const gameRepository = {
    findByPlayer: async (playerId, { search = '', page = 1, limit = 10, sortOrder = 'desc', result = null, gameType = null, startDate = null, endDate = null } = {}) => {
        const query = {
            $or: [{ player1Id: playerId }, { player2Id: playerId }],
        };

        if (search) {
            const regex = { $regex: search, $options: 'i' };
            query.$and = [{
                $or: [
                    { gameNumber: parseInt(search) || -1 },
                    { roomNumber: regex },
                    { player1Name: regex },
                    { player2Name: regex },
                ],
            }];
        }

        if (result) query.result = result;
        if (gameType) query.gameType = gameType;

        if (startDate || endDate) {
            query.startTime = {};
            if (startDate) query.startTime.$gte = new Date(startDate);
            if (endDate) query.startTime.$lte = new Date(endDate);
        }

        const total = await Game.countDocuments(query);
        const games = await Game.find(query)
            .sort({ startTime: sortOrder === 'asc' ? 1 : -1 })
            .skip((page - 1) * limit)
            .limit(limit);

        return { games, total, page, totalPages: Math.ceil(total / limit) };
    },

    findById: (id) => Game.findById(id),
    create: (data) => Game.create(data),
    updateById: (id, data) => Game.findByIdAndUpdate(id, data, { new: true }),
    findAll: () => Game.find().sort({ startTime: -1 }),
    findActiveRooms: ({ search = '', page = 1, limit = 10, sortOrder = 'desc' } = {}) => {
        const query = { isActive: true };
        if (search) {
            const regex = { $regex: search, $options: 'i' };
            query.$or = [
                { roomNumber: regex },
                { player1Name: regex },
                { player2Name: regex },
            ];
        }
        return Game.find(query)
            .sort({ startTime: sortOrder === 'asc' ? 1 : -1 })
            .skip((page - 1) * limit)
            .limit(limit);
    },
    countActiveRooms: ({ search = '' } = {}) => {
        const query = { isActive: true };
        if (search) {
            const regex = { $regex: search, $options: 'i' };
            query.$or = [
                { roomNumber: regex },
                { player1Name: regex },
                { player2Name: regex },
            ];
        }
        return Game.countDocuments(query);
    },
};
