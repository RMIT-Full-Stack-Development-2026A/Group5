import express from 'express';
import { verifyToken } from '../../../middleware/authMiddleware.js';
import { upload } from '../../../config/avatarUpload.js';
import {
    getProfile,
    updateProfile,
    changePassword,
    uploadAvatar,
} from '../controllers/playerController.js';

const router = express.Router();

router.use(verifyToken);

router.get('/me',           getProfile);
router.patch('/me',         updateProfile);
router.patch('/me/password', changePassword);
router.post('/me/avatar',   upload.single('avatar'), uploadAvatar);

export default router;
