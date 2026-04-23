import express from 'express';
import { MatchController } from './match.controller.js';
import { authenticate } from '../../middleware/auth.middleware.js';
import { requireRole } from '../../middleware/role.middleware.js';

const router = express.Router();

// Profile History Panel
router.get('/my', authenticate, MatchController.getMyMatches);
router.get('/:id', authenticate, MatchController.getMatchById);

// Admin Match Management
router.get('/', authenticate, requireRole('admin'), MatchController.getAllMatches);
router.delete('/:id', authenticate, requireRole('admin'), MatchController.closeRoom);

// Create matches
router.post('/', authenticate, MatchController.createMatch);
router.patch('/:id', authenticate, MatchController.updateMatch);

export default router;