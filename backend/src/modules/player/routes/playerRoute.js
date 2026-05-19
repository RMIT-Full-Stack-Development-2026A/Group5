import express from 'express';
import { UserController } from './user.controller.js';
import { authenticate } from '../../middleware/auth.middleware.js';
import { requireRole } from '../../middleware/role.middleware.js';
import { upload } from './avatar.upload.js';

const router = express.Router();

// Auth (Login Page)
router.post('/register', UserController.register);
router.post('/login', UserController.login);
router.post('/logout', authenticate, UserController.logout);

// Profile
router.get('/me', authenticate, UserController.getMe);
router.patch('/me', authenticate, UserController.updateProfile);
router.patch('/me/password', authenticate, UserController.changePassword);
router.post('/me/avatar', authenticate, upload.single('avatar'), UserController.uploadAvatar);

// Admin (User Management)
router.get('/', authenticate, requireRole('admin'), UserController.getAllUsers);
router.patch('/:id/status', authenticate, requireRole('admin'), UserController.setActiveStatus);

export default router;