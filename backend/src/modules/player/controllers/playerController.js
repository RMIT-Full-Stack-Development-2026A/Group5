import { UserService } from './user.service.js';
import { processAvatar } from '../../config/avatarUpload.js';

const handle = (fn) => async (req, res) => {
    try {
        await fn(req, res);
    } catch (error) {
        res.status(error.status || 500).json({ message: error.message, errors: error.errors });
    }
};

export const UserController = {
    getMe: handle(async (req, res) => res.json(await UserService.getMe(req.user.sub))),
    updateProfile: handle(async (req, res) => res.json(await UserService.updateProfile(req.user.sub, req.body))),
    changePassword: handle(async (req, res) => res.json(await UserService.changePassword(req.user.sub, req.body))),
    uploadAvatar: handle(async (req, res) => {
        if (!req.file) throw { status: 400, message: 'No file uploaded.' };
        const avatarURL = await processAvatar(req.file.buffer, req.user.sub);
        res.json(await UserService.updateAvatar(req.user.sub, avatarURL));
    }),
    getAllUsers: handle(async (req, res) => res.json(await UserService.getAllUsers())),
    setActiveStatus: handle(async (req, res) =>
        res.json(await UserService.setActiveStatus(req.params.id, req.body.isActive))),
};