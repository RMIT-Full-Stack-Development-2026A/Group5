import bcrypt from 'bcrypt'
import { v4 as uuidv4 } from 'uuid';
import * as authRepo from '../repositories/authRepo.js';
import RevokedToken from '../models/revokedTokenModel.js';

const USERNAME_REGEX = /^[a-zA-Z0-9_-]{3,20}$/;
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PASSWORD_REGEX = /^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*]).{8,}$/;
const MAX_FAILED_ATTEMPTS = 5;
const LOCK_TIME_MS = 60 * 1000;

const createError = (message, statusCode) => {
    const err = new Error(message);
    err.statusCode = statusCode;
    return err;
}

export const register = async ({ username, email, password, confirmPassword, country }) => {
    if (password !== confirmPassword)
        throw createError('Passwords do not match.', 400);

    if (!USERNAME_REGEX.test(username))
        throw createError('Username must be 3-20 characters and contain only letters, numbers, _ or -.', 400);

    if (!EMAIL_REGEX.test(email))
        throw createError('Invalid email format.', 400);

    if (!PASSWORD_REGEX.test(password))
        throw createError('Password must be at least 8 characters with 1 uppercase letter, 1 number, and 1 special character.', 400);

    if (await authRepo.findByEmail(email))
        throw createError('Email is already registered.', 409);

    if (await authRepo.findByUsername(username))
        throw createError('Username is already taken.', 409);

    const passwordHash = await bcrypt.hash(password, 12);
    const user = await authRepo.createUser({ username, email, passwordHash, country });

    return { id: user._id, username: user.username, email: user.email, country: user.country, role: user.role };
}

export const login = async ({ identifier, password }) => {
    const user = await authRepo.findByEmailOrUsername(identifier);
    if (!user)
        throw createError('Invalid Username/Email or password.', 401);

    if (!user.isActive)
        throw createError('Account has been deactivated.', 403);

    if (user.lockUntil && user.lockUntil > new Date())
        throw createError('Account temporarily locked. Please try again later.', 429);

    const isMatch = await bcrypt.compare(password, user.passwordHash);
    if (!isMatch) {
        await authRepo.incFailedLogins(user._id);
        const updated = await authRepo.findById(user._id);
        if (updated.failedLoginAttempts >= MAX_FAILED_ATTEMPTS) {
            await authRepo.setLockUntil(user._id, new Date(Date.now() + LOCK_TIME_MS));
        }
        throw createError('Invalid Username/Email or password.', 401);
    }

    await authRepo.resetFailedLogins(user._id);

    return { id: user._id, username: user.username, email: user.email, country: user.country, role: user.role };
}

export const logout = async ({ jti, exp }) => {
    if (!jti) return;
    await RevokedToken.create({ jti, expiresAt: new Date(exp * 1000) });
}
