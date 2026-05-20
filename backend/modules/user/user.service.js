import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { v4 as uuidv4 } from 'uuid';
import * as userRepo from './user.repository.js';
import { toPublicUserDTO } from './user.dto.js';
import RevokedToken from './revokedToken.model.js';
import { validateRegistration } from './user.validator.js';

const createError = (message, status, errors) => {
    const err = new Error(message);
    err.status = status;
    if (errors) err.errors = errors;
    return err;
};

export const register = async (data) => {
    const errors = validateRegistration(data);
    if (errors.length) throw createError('Validation failed', 400, errors);

    const { username, email, password, country } = data;

    if (await userRepo.findByEmail(email)) {
        throw createError('Email already registered', 409, [
            { field: 'email', message: 'Email already registered.' }
        ]);
    }

    if (await userRepo.findByUsername(username)) {
        throw createError('Username taken', 409, [
            { field: 'username', message: 'Username taken.' }
        ]);
    }

    const passwordHash = await bcrypt.hash(password, 12);
    const user = await userRepo.createUser({ username, email, passwordHash, country });

    return toPublicUserDTO(user);
};

export const login = async ({ identifier, password }) => {
    const user = await userRepo.findByEmailOrUsername(identifier);

    if (!user) {
        throw createError('Invalid credentials.', 401);
    }

    if (!user.isActive) {
        throw createError('Account has been deactivated.', 403);
    }

    if (user.lockUntil && user.lockUntil > new Date()) {
        throw createError(
            `Account locked. Try again after ${user.lockUntil.toISOString()}.`,
            429
        );
    }

    const valid = await bcrypt.compare(password, user.passwordHash);

    if (!valid) {
        await userRepo.incFailedLogins(user._id);
        const updated = await userRepo.findById(user._id);

        if (updated.failedLoginAttempts >= 5) {
            await userRepo.setLockUntil(user._id, new Date(Date.now() + 60_000));
        }

        throw createError('Invalid credentials.', 401);
    }

    await userRepo.resetFailedLogins(user._id);

    const jti = uuidv4();
    const token = jwt.sign(
        { sub: user._id, role: user.role, jti },
        process.env.JWT_SECRET,
        { expiresIn: process.env.JWT_EXPIRES_IN }
    );

    return { token, user: toPublicUserDTO(user) };
};

export const logout = async (decoded) => {
    const expiresAt = new Date(decoded.exp * 1000);
    await RevokedToken.create({ jti: decoded.jti, expiresAt });
};

export const updateProfile = async (userId, data) => {
    const allowed = ['username', 'email', 'country'];
    const update = Object.fromEntries(
        Object.entries(data).filter(([k]) => allowed.includes(k))
    );
    const user = await userRepo.updateById(userId, update);
    return toPublicUserDTO(user);
};

export const changePassword = async (userId, { currentPassword, newPassword, confirmNewPassword }) => {
    if (newPassword !== confirmNewPassword) {
        throw createError('Passwords do not match.', 400);
    }

    const user = await userRepo.findById(userId);
    const valid = await bcrypt.compare(currentPassword, user.passwordHash);

    if (!valid) {
        throw createError('Current password is incorrect.', 401);
    }

    const passwordHash = await bcrypt.hash(newPassword, 12);
    await userRepo.updateById(userId, { passwordHash });

    return { message: 'Password changed successfully.' };
};

export const updateAvatar = async (userId, avatarUrl) => {
    const user = await userRepo.updateById(userId, { avatarUrl });
    return toPublicUserDTO(user);
};

export const getById = async (id) => {
    const user = await userRepo.findById(id);
    if (!user) throw createError('User not found.', 404);
    return toPublicUserDTO(user);
};

export const getAllUsers = async () => {
    const users = await userRepo.findAll();
    return users.map(toPublicUserDTO);
};

export const setActiveStatus = async (targetId, isActive) => {
    const user = await userRepo.updateById(targetId, { isActive });
    return toPublicUserDTO(user);
};
