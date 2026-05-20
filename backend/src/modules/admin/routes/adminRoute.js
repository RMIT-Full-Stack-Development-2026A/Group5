import express from 'express';
import { AdminController } from './adminController.js';
import { authenticate } from '../../middleware/authMiddleware.js';
import { requireRole } from '../../middleware/roleMiddleware.js';

const router = express.Router();

router.use(authenticate, requireRole('admin'));
router.get('/users', AdminController.getAllUsers);
router.patch('/users/:id/status', AdminController.setActiveStatus);
router.get('/rooms', AdminController.listRooms);
router.patch('/rooms/:id/close', AdminController.closeRoom);

export default router;
