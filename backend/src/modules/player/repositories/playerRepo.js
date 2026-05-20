import Player from '../models/playerModel.js';

export const UserRepository = {
    findByEmail: (email) => Player.findOne({ email }),
    findByUsername: (username) => Player.findOne({ username }),
    findById: (id) => Player.findById(id),
    findByIdWithPassword: (id) => Player.findById(id).select('+passwordHash'),
    findByEmailOrUsername: (identifier) => Player.findOne({
        $or: [{ email: identifier }, { username: identifier }]
    }).select('+passwordHash'),
    create: (data) => Player.create(data),
    updateById: (id, data) => Player.findByIdAndUpdate(id, data, { new: true }),
    findAll: () => Player.find().sort({ createdAt: -1 }),
    incFailedLogins: (id) => Player.findByIdAndUpdate(id, { $inc: { failedLoginAttempts: 1 } }, { new: true }),
    resetFailedLogins: (id) => Player.findByIdAndUpdate(id, { failedLoginAttempts: 0, lockUntil: null }, { new: true }),
    setLockUntil: (id, date) => Player.findByIdAndUpdate(id, { lockUntil: date }, { new: true }),
};
