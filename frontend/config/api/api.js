export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '/api';

export const AUTH_ENDPOINTS = {
    register: '/auth/register',
    login:    '/auth/login',
    logout:   '/auth/logout',
    aimove:   '/game/ai/move',
};

export const PROFILE_ENDPOINTS = {
    me: '/player/me',
    update: '/player/me',
    changePassword: '/player/me/password',
    uploadAvatar: '/player/me/avatar',
    history: '/game/sessions',
};