import Game from '../model/gameModel.js';


const buildResultClause = (result, playerId) => {
    if (!result) return null;

    if (result === 'draw')    return { result: 'draw' };
    if (result === 'aborted') return { status: 'aborted' };

    if (result === 'win') {
        return {
            $or: [
                { player1: playerId, result: 'player1' },
                { player2: playerId, result: 'player2' },
            ],
        };
    }
    if (result === 'lose') {
        return {
            $or: [
                { player1: playerId, result: 'player2' },
                { player2: playerId, result: 'player1' },
            ],
        };
    }
    return null;
};


const buildSearchClause = (search) => {
    if (!search) return null;

    const orClauses = [
        { player2Name: { $regex: search, $options: 'i' } },
    ];

    const num = parseInt(search, 10);
    if (!Number.isNaN(num)) {
        orClauses.push({ gameNumber: num });
    }

    return { $or: orClauses };
};


export const gameRepository = {

    create: (data) => Game.create(data),

    findById: (id) =>
        Game.findById(id)
            .populate('player1', 'username')
            .populate('player2', 'username'),

    updateById: (id, update) =>
        Game.findByIdAndUpdate(id, update, { returnDocument: 'after' }),

    pushMove: (id, move) =>
        Game.findByIdAndUpdate(
            id,
            { $push: { moves: move } },
            { returnDocument: 'after' }
        ),

    findByPlayer: async (playerId, {
        search = '',
        result = null,
        gameType = null,
        startDate = null,
        endDate = null,
        sortOrder = 'desc',
    } = {}) => {
        const andClauses = [
            { $or: [{ player1: playerId }, { player2: playerId }] },
        ];

        const searchClause = buildSearchClause(search);
        if (searchClause) andClauses.push(searchClause);

        const resultClause = buildResultClause(result, playerId);
        if (resultClause) andClauses.push(resultClause);

        if (gameType) andClauses.push({ gameType });

        if (startDate || endDate) {
            const dateClause = { startTime: {} };
            if (startDate) dateClause.startTime.$gte = new Date(startDate);
            if (endDate)   dateClause.startTime.$lte = new Date(endDate);
            andClauses.push(dateClause);
        }

        const query = andClauses.length > 1 ? { $and: andClauses } : andClauses[0];

        return Game.find(query)
            .sort({ startTime: sortOrder === 'asc' ? 1 : -1 })
            .populate('player1', 'username')
            .populate('player2', 'username');
    },
};
