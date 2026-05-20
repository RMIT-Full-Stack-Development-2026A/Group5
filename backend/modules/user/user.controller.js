import * as userService from './user.service.js';
import { processAvatar } from './avatar.upload.js';

const handleError = (res, err) => {
    res.status(err.status || 500).json({
        message: err.message,
        errors: err.errors
    });
};

export const register = async (req, res) => {
    try {
        const user = await userService.register(req.body);
        res.status(201).json(user);
    } catch (err) {
        handleError(res, err);
    }
};

export const login = async (req, res) => {
    try {
        const result = await userService.login(req.body);
        res.json(result);
    } catch (err) {
        handleError(res, err);
    }
};

export const logout = async (req, res) => {
    try {
        await userService.logout(req.user);
        res.json({ message: 'Logged out successfully.' });
    } catch (err) {
        handleError(res, err);
    }
};

export const getMe = async (req, res) => {
    try {
        const user = await userService.getById(req.user.sub);
        res.json(user);
    } catch (err) {
        handleError(res, err);
    }
};

export const updateProfile = async (req, res) => {
    try {
        const user = await userService.updateProfile(req.user.sub, req.body);
        res.json(user);
    } catch (err) {
        handleError(res, err);
    }
};

export const changePassword = async (req, res) => {
    try {
        const result = await userService.changePassword(req.user.sub, req.body);
        res.json(result);
    } catch (err) {
        handleError(res, err);
    }
};

export const uploadAvatar = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ message: 'No file uploaded.' });
        }
        const avatarUrl = await processAvatar(req.file.buffer, req.user.sub);
        const user = await userService.updateAvatar(req.user.sub, avatarUrl);
        res.json(user);
    } catch (err) {
        handleError(res, err);
    }
};

export const getAllUsers = async (req, res) => {
    try {
        const users = await userService.getAllUsers();
        res.json(users);
    } catch (err) {
        handleError(res, err);
    }
};

export const setActiveStatus = async (req, res) => {
    try {
        const user = await userService.setActiveStatus(req.params.id, req.body.isActive);
        res.json(user);
    } catch (err) {
        handleError(res, err);
    }
};
