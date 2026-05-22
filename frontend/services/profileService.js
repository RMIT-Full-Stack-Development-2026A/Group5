import { http } from './httpService.js';
import { PROFILE_ENDPOINTS } from '../config/api/api.js';


export const profileService = {

    getMe: () =>
        http.get(PROFILE_ENDPOINTS.me),

    updateProfile: (update) =>
        http.patch(PROFILE_ENDPOINTS.me, update),

    changePassword: (payload) =>
        http.patch(PROFILE_ENDPOINTS.password, payload),

    uploadAvatar: (file) => {
        const fd = new FormData();
        fd.append('avatar', file);
        return http.upload(PROFILE_ENDPOINTS.avatar, fd);
    },
};
