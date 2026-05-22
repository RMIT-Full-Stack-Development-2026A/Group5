import { http, setToken } from '../../services/httpService.js';
import { AUTH_ENDPOINTS } from '../../config/api/api.js';

const AUTH_USER_STORAGE_KEY = 'authUser';

export const loginUser = async ({ identifier, password }) => {
    const data = await http.post(AUTH_ENDPOINTS.login, { identifier, password });
    setToken(data.token);
    try {
        localStorage.setItem(AUTH_USER_STORAGE_KEY, JSON.stringify(data.user));
    } catch (e) {
        // ignore storage failures
    }
    return data.user;
};