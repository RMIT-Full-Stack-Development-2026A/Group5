import express from 'express';
import * as userController from './user.controller.js';
import { authenticate } from '../../middleware/auth.middleware.js';
import { requireRole } from '../../middleware/role.middleware.js';
import { upload } from './avatar.upload.js';

const router = express.Router();

// Auth (Login Page)
router.post('/register', userController.register);
router.post('/login', userController.login);
router.post('/logout', authenticate, userController.logout);

// Profile
router.get('/me', authenticate, userController.getMe);
router.patch('/me', authenticate, userController.updateProfile);
router.patch('/me/password', authenticate, userController.changePassword);
router.post('/me/avatar', authenticate, upload.single('avatar'), userController.uploadAvatar);

// Admin (User Management)
router.get('/', authenticate, requireRole('admin'), userController.getAllUsers);
router.patch('/:id/status', authenticate, requireRole('admin'), userController.setActiveStatus);

export default router;
