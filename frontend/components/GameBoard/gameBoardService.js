import { http } from '../../services/httpService.js';
import { GAME_ENDPOINTS } from '../../config/api/api.js';


export const getAIMove = async ({ board, selectedMode, lastMove, boardSize }) => {
    const data = await http.post(GAME_ENDPOINTS.aimove, {
        board,
        difficulty: selectedMode,
        lastMove,
        boardSize,
    });

    return { moveIndex: data.moveIndex };
};
