import Player from '../../player/models/playerModel.js';


export const findByEmail = (email) => {
    return Player.findOne({ email })
}

export const findByUsername = (username) => {
    return Player.findOne({ username });
};

export const findByEmailOrUsername = (identifier) => {
    return Player.findOne({
        $or: [{ email: identifier }, { username: identifier }]
    }).select('+passwordHash');
};
export const createUser = (userData) => {
    return Player.create(userData)
}