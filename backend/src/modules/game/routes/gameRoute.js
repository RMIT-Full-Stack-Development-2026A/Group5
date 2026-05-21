import express from 'express';
import { verifyToken } from '../../../middleware/authMiddleware.js';
import {
    getMove,
    startGame,
    recordMove,
    finishGame,
    abortGame,
    getHistory,
    getMatchById,
} from '../controllers/gameController.js';

const router = express.Router();

// AI move computation
router.post('/ai/move',          getMove);

// Session lifecycle  all auth-protected
router.post('/start',            verifyToken, startGame);
router.get('/history',           verifyToken, getHistory);
router.get('/:id',               verifyToken, getMatchById);
router.patch('/:id/move',        verifyToken, recordMove);
router.patch('/:id/finish',      verifyToken, finishGame);
router.patch('/:id/abort',       verifyToken, abortGame);

export default router;
