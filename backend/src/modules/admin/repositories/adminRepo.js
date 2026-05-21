import Player from '../../player/models/playerModel.js';
import Game from '../../game/model/gameModel.js';

export const findAllUsers = () => Player.find().sort({ createdAt: -1 });

export const setUserStatus = (id, isActive) =>
    Player.findByIdAndUpdate(id, { isActive }, { new: true });

export const findActiveRooms = ({ search = '', page = 1, limit = 10, sortOrder = 'desc' } = {}) => {
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
};

export const countActiveRooms = ({ search = '' } = {}) => {
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
};

export const closeRoom = (id) =>
    Game.findByIdAndUpdate(id, { isActive: false, result: 'aborted', endTime: new Date() }, { new: true });
