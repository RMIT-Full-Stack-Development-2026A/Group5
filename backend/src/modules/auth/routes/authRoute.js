import express from 'express'
import rateLimit from 'express-rate-limit'
import * as authController from '../controllers/authController.js'
import { verifyToken } from '../../../middleware/authMiddleware.js'

const router = express.Router();

const loginLimiter = rateLimit({
    windowMs: 60 * 1000,
    max: 5,
    message: { message: 'Too many login attempts. Please try again later'}
});

router.post('/register', authController.register);
router.post('/login', loginLimiter, authController.login);
router.post('/logout', verifyToken, authController.logout);

export default router;