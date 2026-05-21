import { http } from './httpService.js';
import { GAME_ENDPOINTS } from '../config/api/api.js';


export const gameSessionService = {

    start: (payload) =>
        http.post(GAME_ENDPOINTS.start, payload),

    recordMove: (matchId, move) =>
        http.patch(GAME_ENDPOINTS.move(matchId), move),

    finish: (matchId, { result, winLine }) =>
        http.patch(GAME_ENDPOINTS.finish(matchId), { result, winLine }),

    abort: (matchId) =>
        http.patch(GAME_ENDPOINTS.abort(matchId), {}),

    getHistory: (filters = {}) => {
        const qs = new URLSearchParams(
            Object.entries(filters).filter(([, v]) => v != null && v !== '')
        ).toString();
        const url = qs ? `${GAME_ENDPOINTS.history}?${qs}` : GAME_ENDPOINTS.history;
        return http.get(url);
    },

    getById: (matchId) =>
        http.get(GAME_ENDPOINTS.byId(matchId)),
};
