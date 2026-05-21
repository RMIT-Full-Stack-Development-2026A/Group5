import Player from '../../player/models/playerModel.js';

export const findByEmail = (email) => Player.findOne({ email });
export const findByUsername = (username) => Player.findOne({ username });
export const findById = (id) => Player.findById(id).select('+passwordHash');
export const findByEmailOrUsername = (identifier) => {
    return Player.findOne({
        $or: [{ email: identifier }, { username: identifier }]
    }).select('+passwordHash');
};

export const createUser = (userData) => Player.create(userData);
export const incFailedLogins = (id) => Player.findByIdAndUpdate(id, { $inc: { failedLoginAttempts: 1 } }, { new: true });
export const resetFailedLogins = (id) => Player.findByIdAndUpdate(id, { failedLoginAttempts: 0, lockUntil: null }, { new: true });
export const setLockUntil = (id, date) => Player.findByIdAndUpdate(id, { lockUntil: date }, { new: true });