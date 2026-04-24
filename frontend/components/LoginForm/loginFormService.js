import { http, setToken } from '../../services/httpService.js';
import { AUTH_ENDPOINTS } from '../../config/api/api.js';

export const loginUser = async ({ identifier, password }) => {
    const data = await http.post(AUTH_ENDPOINTS.login, { identifier, password });
    setToken(data.token);
    return data.user;
};