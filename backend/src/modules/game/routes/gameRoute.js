import express from 'express';
import { getMove } from '../controllers/gameController.js';

const router = express.Router();

// Route to get the AI's move based on the current board state
router.post('/ai/move', getMove);

export default router;