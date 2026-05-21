import bcrypt from 'bcrypt'
import * as authRepo from '../repositories/authRepo.js';

const USERNAME_REGEX = /^[a-zA-Z0-9_-]{3,20}$/;
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PASSWORD_REGEX = /^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*]).{8,}$/;

const createError = (message, statusCode) => {
    const err = new Error(message);
    err.statusCode = statusCode;
    return err;
}

export const register = async ({username, email, password, confirm,confirmPassword, country }) => {
    if (password !== confirmPassword)
        throw createError('Password do not match', 400);

    if (!USERNAME_REGEX.test(username))
        throw createError('Username must be 3-20 characters and only contain letters, numbers, _ or -', 400);

     if (!EMAIL_REGEX.test(email))
        throw createError('Invalid email format', 400);

    if (!PASSWORD_REGEX.test(password))
        throw createError('Password must be at least 8 characters with 1 uppercase, 1 number, and 1 special character (!@#$%^&*)', 400);

    if (await authRepo.findByEmail(email))
        throw createError('Email is already registered', 409);

    if (await authRepo.findByUsername(username))
        throw createError('Username is already taken', 409);

    const passwordHash = await bcrypt.hash(password, 10);
    const user = await authRepo.createUser({username, email , passwordHash, country});

    return { id: user._id, username: user.username, email: user.email, country: user.country, role: user.role }
}

export const login = async ({identifier, password})  => {
    const user = await authRepo.findByEmailOrUsername(identifier);

    if (!user) { 
        throw createError('Invalid Username/Email or password', 401);
    }

    const isMatch = await bcrypt.compare(password, user.passwordHash);

    if (!isMatch) {
        throw createError("Invalid Username/Email or password", 401)
    }

    return {id: user._id, username: user.username, email: user.email, country: user.country, role: user.role}
}