import express from 'express';
import { getAIMove, createGameSession, getUserSessions, getGameSessionById, createGameRoom, joinGameRoom, listRooms, closeGameRoom } from '../controllers/gameController.js';
import { authenticate } from '../../middleware/authMiddleware.js';
import { requireRole } from '../../middleware/roleMiddleware.js';

const router = express.Router();

router.post('/ai/move', getAIMove);
router.post('/sessions', authenticate, createGameSession);
router.get('/sessions', authenticate, getUserSessions);
router.get('/sessions/:id', authenticate, getGameSessionById);
router.post('/rooms', authenticate, createGameRoom);
router.patch('/rooms/:id/join', authenticate, joinGameRoom);
router.get('/rooms', authenticate, listRooms);
router.patch('/rooms/:id/close', authenticate, requireRole('admin'), closeGameRoom);

export default router;
