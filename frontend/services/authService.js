import { http } from './httpService.js';
import { PROFILE_ENDPOINTS } from '../config/api/api.js';

const AUTH_USER_STORAGE_KEY = 'authUser';

export const storeAuthUser = (user) => {
    if (user) {
        localStorage.setItem(AUTH_USER_STORAGE_KEY, JSON.stringify(user));
    }
};

export const getStoredAuthUser = () => {
    try {
        return JSON.parse(localStorage.getItem(AUTH_USER_STORAGE_KEY));
    } catch {
        return null;
    }
};

export const clearAuthUser = () => {
    localStorage.removeItem(AUTH_USER_STORAGE_KEY);
};

export const fetchCurrentUser = async () => {
    const user = await http.get(PROFILE_ENDPOINTS.me);
    storeAuthUser(user);
    return user;
};
