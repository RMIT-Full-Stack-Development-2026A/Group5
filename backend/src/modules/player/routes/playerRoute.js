import express from 'express';
import { UserController } from './playerController.js';
import { authenticate } from '../../middleware/authMiddleware.js';
import { upload } from '../../config/avatarUpload.js';

const router = express.Router();

router.get('/me', authenticate, UserController.getMe);
router.patch('/me', authenticate, UserController.updateProfile);
router.patch('/me/password', authenticate, UserController.changePassword);
router.post('/me/avatar', authenticate, upload.single('avatar'), UserController.uploadAvatar);

export default router;