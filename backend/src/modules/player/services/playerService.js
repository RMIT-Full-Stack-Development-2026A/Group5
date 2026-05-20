import bcrypt from 'bcrypt';
import { UserRepository } from './playerRepo.js';
import { toPublicUserDTO } from './dto/dto.js';

export const UserService = {
    async getMe(userId) {
        const user = await UserRepository.findById(userId);
        if (!user) throw { status: 404, message: 'User not found.' };
        return toPublicUserDTO(user);
    },

    async updateProfile(userId, data) {
        const allowed = ['username', 'email', 'country'];
        const update = Object.fromEntries(Object.entries(data).filter(([k]) => allowed.includes(k)));

        if (update.username) {
            const existing = await UserRepository.findByUsername(update.username);
            if (existing && existing._id.toString() !== userId) {
                throw { status: 409, message: 'Username is already taken.' };
            }
        }

        if (update.email) {
            const existing = await UserRepository.findByEmail(update.email);
            if (existing && existing._id.toString() !== userId) {
                throw { status: 409, message: 'Email is already registered.' };
            }
        }

        const user = await UserRepository.updateById(userId, update);
        return toPublicUserDTO(user);
    },

    async changePassword(userId, { currentPassword, newPassword, confirmNewPassword }) {
        if (newPassword !== confirmNewPassword) {
            throw { status: 400, message: 'Passwords do not match.' };
        }

        const user = await UserRepository.findByIdWithPassword(userId);
        if (!user) throw { status: 404, message: 'User not found.' };

        const valid = await bcrypt.compare(currentPassword, user.passwordHash);
        if (!valid) throw { status: 401, message: 'Current password is incorrect.' };

        const passwordHash = await bcrypt.hash(newPassword, 12);
        await UserRepository.updateById(userId, { passwordHash });
        return { message: 'Password changed successfully.' };
    },

    async updateAvatar(userId, avatarUrl) {
        const user = await UserRepository.updateById(userId, { avatarUrl });
        return toPublicUserDTO(user);
    },

    async getAllUsers() {
        const users = await UserRepository.findAll();
        return users.map(toPublicUserDTO);
    },

    async setActiveStatus(targetId, isActive) {
        const user = await UserRepository.updateById(targetId, { isActive });
        return toPublicUserDTO(user);
    },
};