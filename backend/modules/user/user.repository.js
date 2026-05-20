import User from './user.model.js';

export const findByEmail = (email) => {
    return User.findOne({ email });
};

export const findByUsername = (username) => {
    return User.findOne({ username });
};

export const findByEmailOrUsername = (identifier) => {
    return User.findOne({
        $or: [{ email: identifier }, { username: identifier }]
    }).select('+passwordHash');
};

export const findById = (id) => {
    return User.findById(id);
};

export const findAll = () => {
    return User.find().sort({ createdAt: -1 });
};

export const createUser = (data) => {
    return User.create(data);
};

export const updateById = (id, data) => {
    return User.findByIdAndUpdate(id, data, { new: true });
};

export const incFailedLogins = (id) => {
    return User.findByIdAndUpdate(
        id,
        { $inc: { failedLoginAttempts: 1 } },
        { new: true }
    );
};

export const resetFailedLogins = (id) => {
    return User.findByIdAndUpdate(
        id,
        { failedLoginAttempts: 0, lockUntil: null },
        { new: true }
    );
};

export const setLockUntil = (id, until) => {
    return User.findByIdAndUpdate(id, { lockUntil: until }, { new: true });
};
