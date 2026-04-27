import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { v4 as uuidv4 } from 'uuid';
import { UserRepository } from './user.repository.js';
import { toPublicUserDTO } from './user.dto.js';
import RevokedToken from './revokedToken.model.js';
import { validateRegistration } from './user.validator';

export const UserService = {

    async register(data) {
        const errors = validateRegistration(data);
        if (errors.length) throw { status: 400, errors };

        const { username, email, password, country } = data;
        if (await UserRepository.findByEmail(email))
            throw { status: 409, errors: [{ field: 'email', message: 'Email already registered.' }] };
        if (await UserRepository.findByUsername(username))
            throw { status: 409, errors: [{ field: 'username', message: 'Username taken.' }] };

        const passwordHash = await bcrypt.hash(password, 12);
        const user = await UserRepository.create({ username, email, passwordHash, country });
        return toPublicUserDTO(user);
    },

    async login({ identifier, password }) {
        const user = await UserRepository.findByEmailOrUsername(identifier);
        if (!user) throw { status: 401, message: 'Invalid credentials.' };
        if (!user.isActive) throw { status: 403, message: 'Account has been deactivated.' };

        if (user.lockUntil && user.lockUntil > new Date())
            throw { status: 429, message: `Account locked. Try again after ${user.lockUntil.toISOString()}.` };

        const valid = await bcrypt.compare(password, user.passwordHash);
        if (!valid) {
            await UserRepository.incFailedLogins(user._id);
            const updated = await UserRepository.findById(user._id);
            if (updated.failedLoginAttempts >= 5)
                await UserRepository.setLockUntil(user._id, new Date(Date.now() + 60_000));
            throw { status: 401, message: 'Invalid credentials.' };
        }
    
        await UserRepository.resetFailedLogins(user._id);

        const jti = uuidv4();
        const token = jwt.sign(
            { sub: user._id, role: user.role, jti },
            process.env.JWT_SECRET,
            { expiresIn: process.env.JWT_EXPIRES_IN }
        );

        return { token, user: toPublicUserDTO(user) };
    },

    async logout(decoded) {
        const expiresAt = new Date(decoded.exp * 1000);
        await RevokedToken.create({ jti: decoded.jti, expiresAt });
    },

    async updateProfile(userId, data) {
        const allowed = ['username', 'email', 'country'];
        const update = Object.fromEntries(Object.entries(data).filter(([k]) => allowed.includes(k)));
        const user = await UserRepository.updateById(userId, update);
        return toPublicUserDTO(user);
    },

    async changePassword(userId, { currentPassword, newPassword, confirmNewPassword }) {
        if (newPassword !== confirmNewPassword)
            throw { status: 400, message: 'Passwords do not match.' };

        const user = await UserRepository.findById(userId);
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

    async getById(id) {
        const user = await UserRepository.findById(id);
        if (!user) throw { status: 404, message: 'User not found.' };
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