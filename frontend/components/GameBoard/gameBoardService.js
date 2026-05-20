import { http } from '../../services/httpService.js';

export const getAIMove = async ({ board, selectedMode, lastMove, boardSize }) => {
    const data = await http.post('/game/ai/move', {
        board,
        difficulty: selectedMode,
        lastMove,
        boardSize,
    });

    return { moveIndex: data.moveIndex };
};
