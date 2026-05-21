import jwt from 'jsonwebtoken'
import * as authService from '../services/authService.js'
import { registerDto, loginDto } from '../dto/dto.js'

const signToken = (user) => {
    return jwt.sign(
        { id: user.id, username: user.username, role: user.role },
        process.env.JWT_SECRET,
        { expiresIn: process.env.JWT_EXPIRES_IN }
    );
};

export const register = async (req, res) => {
    try {
        const dto = registerDto(req.body);
        const user = await authService.register(dto);
        const token = signToken(user);
        res.status(201).json({ token, user });
    } catch (err) {
        res.status(err.statusCode || 500).json({ message: err.message });
    }
};

export const login = async (req, res) => {
    try {
        const dto = loginDto(req.body);
        const user = await authService.login(dto);
        const token = signToken(user);
        res.status(200).json({ token, user });
    } catch (err) {
        res.status(err.statusCode || 500).json({ message: err.message });
    }
};

export const logout = async (req, res) => {
    try {
        await authService.logout(req.user);
        res.status(200).json({ message: 'Logged out successfully.' });
    } catch (err) {
        res.status(err.statusCode || 500).json({ message: err.message });
    }
};