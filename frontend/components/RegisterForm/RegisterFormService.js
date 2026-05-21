import { http, setToken } from '../../services/httpService.js';
import { AUTH_ENDPOINTS } from '../../config/api/api.js';

export const registerUser = async (formData) => {
    const data = await http.post(AUTH_ENDPOINTS.register, formData);
    setToken(data.token);
    return data.user
}