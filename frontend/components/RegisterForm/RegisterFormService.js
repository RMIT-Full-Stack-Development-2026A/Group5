import { http, setToken } from '../../services/httpService.js';
import { AUTH_ENDPOINTS } from '../../config/api/api.js';

const AUTH_USER_STORAGE_KEY = 'authUser';

export const registerUser = async (formData) => {
    const data = await http.post(AUTH_ENDPOINTS.register, formData);
    setToken(data.token);
    try {
        localStorage.setItem(AUTH_USER_STORAGE_KEY, JSON.stringify(data.user));
    } catch (e) {
        // ignore storage failures
    }
    return data.user
}