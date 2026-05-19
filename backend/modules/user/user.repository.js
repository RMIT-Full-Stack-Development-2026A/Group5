import User from '/user/model.js';

export const UserRepository = {
    findByEmail: (email)  => User.findOne({ email }),
    findByUsername: (username) => User.findOne({ username }),
    findByEmailOrUsername: (identifier) =>
        User.findOne({ $or: [{ email: identifier }, { username: identifier }] }),
    findById: (id) => User.findById(id),
    findAll: () => User.find().sort({ createdAt: -1 }),
    create: (data) => User.create(data),
    updateById: (id, data) => User.findByIdAndUpdate(id, data, { new: true }),
    incFailedLogins: (id) => User.findByIdAndUpdate(id, { $inc: { failedLoginAttempts: 1 } }, { new: true }),
    resetFailedLogins: (id) => User.findByIdAndUpdate(id, { failedLoginAttempts: 0, lockUntil: null }, { new: true }),
    setLockUntil: (id, until) => User.findByIdAndUpdate(id, { lockUntil: until }, { new: true }),
}