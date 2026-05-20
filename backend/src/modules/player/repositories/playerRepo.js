import Player from '../models/playerModel.js';


export const playerRepository = {

    findById: (id) =>
        Player.findById(id).select('-passwordHash'),

    findByIdWithPassword: (id) =>
        Player.findById(id),

    findByEmail: (email) =>
        Player.findOne({ email }),

    findByUsername: (username) =>
        Player.findOne({ username }),

    updateById: (id, update) =>
        Player.findByIdAndUpdate(id, update, { returnDocument: 'after' }).select('-passwordHash'),
};
