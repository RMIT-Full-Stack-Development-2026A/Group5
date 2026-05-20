import bcrypt from 'bcrypt';
import { playerRepository } from '../repositories/playerRepo.js';
import COUNTRIES from '../../../config/countries.js';


const USERNAME_REGEX = /^[a-zA-Z0-9_-]{3,20}$/;
const EMAIL_REGEX    = /^[^\s@()]+@[^\s@()]+\.[^\s@()]+$/;
const PASSWORD_REGEX = /^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*]).{8,}$/;


const createError = (message, statusCode) => {
    const err = new Error(message);
    err.statusCode = statusCode;
    return err;
};


const toPublic = (player) => ({
    id:        player._id,
    username:  player.username,
    email:     player.email,
    country:   player.country,
    avatarUrl: player.avatarUrl,
    role:      player.role,
});


export const playerService = {

    getProfile: async (userId) => {
        const player = await playerRepository.findById(userId);
        if (!player) throw createError('Player not found', 404);
        return toPublic(player);
    },

    updateProfile: async (userId, { email, username, country }) => {
        const update = {};

        if (email !== undefined) {
            if (!EMAIL_REGEX.test(email)) {
                throw createError('Invalid email format. Example: name@example.com', 400);
            }
            const existing = await playerRepository.findByEmail(email);
            if (existing && String(existing._id) !== String(userId)) {
                throw createError('Email is already registered', 409);
            }
            update.email = email;
        }

        if (username !== undefined) {
            if (!USERNAME_REGEX.test(username)) {
                throw createError('Username must be 3-20 chars: letters, numbers, _ or -', 400);
            }
            const existing = await playerRepository.findByUsername(username);
            if (existing && String(existing._id) !== String(userId)) {
                throw createError('Username is already taken', 409);
            }
            update.username = username;
        }

        if (country !== undefined) {
            if (country !== null && !COUNTRIES.includes(country)) {
                throw createError('Invalid country', 400);
            }
            update.country = country;
        }

        if (Object.keys(update).length === 0) {
            throw createError('No fields to update', 400);
        }

        const player = await playerRepository.updateById(userId, update);
        return toPublic(player);
    },

    changePassword: async (userId, { currentPassword, newPassword, confirmPassword }) => {
        if (!currentPassword || !newPassword) {
            throw createError('Current and new password are required', 400);
        }
        if (newPassword !== confirmPassword) {
            throw createError('New passwords do not match', 400);
        }
        if (!PASSWORD_REGEX.test(newPassword)) {
            throw createError('Password must be at least 8 chars with 1 uppercase, 1 number, and 1 special character (!@#$%^&*)', 400);
        }

        const player = await playerRepository.findByIdWithPassword(userId);
        if (!player) throw createError('Player not found', 404);

        const ok = await bcrypt.compare(currentPassword, player.passwordHash);
        if (!ok) throw createError('Current password is incorrect', 401);

        const passwordHash = await bcrypt.hash(newPassword, 10);
        await playerRepository.updateById(userId, { passwordHash });

        return { message: 'Password updated successfully' };
    },
};
