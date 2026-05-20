import express from 'express';
import { verifyToken } from '../../../middleware/authMiddleware.js';
import {
    getProfile,
    updateProfile,
    changePassword,
} from '../controllers/playerController.js';

const router = express.Router();

router.use(verifyToken);

router.get('/me',           getProfile);
router.patch('/me',         updateProfile);
router.patch('/me/password', changePassword);

export default router;
