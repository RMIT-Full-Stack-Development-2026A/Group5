import { easyAI, mediumAI, hardAI } from '../services/gameService.js';

export const getMove = (req, res) => {
	try {
		const { board, difficulty, lastMove, boardSize } = req.body;

		if (difficulty === 'easy') {
			const moveIndex = easyAI(board, lastMove, boardSize);
			return res.status(200).json({ moveIndex: moveIndex ?? null });
		}

		if (difficulty === 'medium') {
			const moveIndex = mediumAI(board, lastMove, boardSize);
			return res.status(200).json({ moveIndex: moveIndex ?? null });
		}


		if (difficulty === 'hard') {
			const moveIndex = hardAI(board, lastMove, boardSize);
			return res.status(200).json({ moveIndex: moveIndex ?? null });
		}
	} catch (error) {
		return res.status(500).json({ message: error?.message || 'Failed to compute AI move' });
	}
};

