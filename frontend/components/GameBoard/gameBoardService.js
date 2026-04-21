import { API_BASE_URL } from '../../config/api/api';

const AI_MOVE_ENDPOINT = `${API_BASE_URL}/game/ai/move`;

export const getAIMove = async ({ board, selectedMode, lastMove, boardSize }) => {
	const response = await fetch(AI_MOVE_ENDPOINT, {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
		},
		body: JSON.stringify({
			board,
			difficulty: selectedMode,
			lastMove,
			boardSize,
		}),
	});

	if (!response.ok) {
		const message = await response.text();
		throw new Error(message || `Failed to fetch AI move (HTTP ${response.status})`);
	}

	const data = await response.json();

	return {
		moveIndex: data.moveIndex,
	};
};

