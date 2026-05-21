import { http, setToken } from '../../services/httpService.js';
import { AUTH_ENDPOINTS } from '../../config/api/api.js';
import { storeAuthUser } from '../../services/authService.js';

export const loginUser = async ({ identifier, password }) => {
    const data = await http.post(AUTH_ENDPOINTS.login, { identifier, password });
    setToken(data.token);
    storeAuthUser(data.user);
    return data.user;
};