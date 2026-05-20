import { http } from './httpService.js';
import { SESSION_ENDPOINTS } from '../config/api/api.js';


export const gameSessionService = {

    start: (payload) =>
        http.post(SESSION_ENDPOINTS.start, payload),

    recordMove: (matchId, move) =>
        http.patch(SESSION_ENDPOINTS.move(matchId), move),

    finish: (matchId, { result, winLine }) =>
        http.patch(SESSION_ENDPOINTS.finish(matchId), { result, winLine }),

    abort: (matchId) =>
        http.patch(SESSION_ENDPOINTS.abort(matchId), {}),

    getHistory: (filters = {}) => {
        const qs = new URLSearchParams(
            Object.entries(filters).filter(([, v]) => v != null && v !== '')
        ).toString();
        const url = qs ? `${SESSION_ENDPOINTS.history}?${qs}` : SESSION_ENDPOINTS.history;
        return http.get(url);
    },

    getById: (matchId) =>
        http.get(SESSION_ENDPOINTS.byId(matchId)),
};
