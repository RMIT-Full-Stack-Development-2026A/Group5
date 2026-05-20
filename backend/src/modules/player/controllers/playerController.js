import { playerService } from '../services/playerService.js';


export const getProfile = async (req, res) => {
    try {
        const profile = await playerService.getProfile(req.user.id);
        return res.status(200).json({ profile });
    } catch (err) {
        return res.status(err.statusCode || 500).json({ message: err.message || 'Failed to load profile' });
    }
};


export const updateProfile = async (req, res) => {
    try {
        const profile = await playerService.updateProfile(req.user.id, req.body);
        return res.status(200).json({ profile });
    } catch (err) {
        return res.status(err.statusCode || 500).json({ message: err.message || 'Failed to update profile' });
    }
};


export const changePassword = async (req, res) => {
    try {
        const result = await playerService.changePassword(req.user.id, req.body);
        return res.status(200).json(result);
    } catch (err) {
        return res.status(err.statusCode || 500).json({ message: err.message || 'Failed to change password' });
    }
};
