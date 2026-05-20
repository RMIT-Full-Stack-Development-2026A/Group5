import { http } from './httpService.js';
import { PROFILE_ENDPOINTS } from '../config/api/api.js';


export const profileService = {

    getMe: () =>
        http.get(PROFILE_ENDPOINTS.me),

    updateProfile: (update) =>
        http.patch(PROFILE_ENDPOINTS.me, update),

    changePassword: (payload) =>
        http.patch(PROFILE_ENDPOINTS.password, payload),
};
