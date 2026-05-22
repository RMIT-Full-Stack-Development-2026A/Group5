const getWinnerLabel = (game, player1, player2) => {
	if (game.status === 'in_progress') return null;
	if (game.result === 'draw') return 'Draw';
	if (game.result === 'aborted') return 'Aborted';
	if (game.result === 'player1') return player1?.username || 'Player 1';
	if (game.result === 'player2') return player2?.username || game.player2Name || 'Player 2';
	return null;
};

const toGameParticipant = (player) => {
	if (!player) return null;

	return {
		_id: player._id,
		username: player.username,
	};
};

export const toGameDTO = (game) => {
	const player1 = toGameParticipant(game.player1);
	const player2 = toGameParticipant(game.player2);

	return {
		_id: game._id,
		gameNumber: game.gameNumber,
		player1,
		player2,
		player2Name: game.player2Name || null,
		gameType: game.gameType,
		status: game.status,
		result: game.result,
		winner: getWinnerLabel(game, player1, player2),
		startTime: game.startTime,
		endTime: game.endTime,
	};
};
