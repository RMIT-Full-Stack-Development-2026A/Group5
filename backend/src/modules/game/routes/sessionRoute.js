import express from 'express';
import { verifyToken } from '../../../middleware/authMiddleware.js';
import {
    startGame,
    recordMove,
    finishGame,
    abortGame,
    getHistory,
    getMatchById,
} from '../controllers/sessionController.js';

const router = express.Router();

router.use(verifyToken);

router.post('/start',          startGame);
router.get('/history',         getHistory);
router.get('/:id',             getMatchById);
router.patch('/:id/move',      recordMove);
router.patch('/:id/finish',    finishGame);
router.patch('/:id/abort',     abortGame);

export default router;
