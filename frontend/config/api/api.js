export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '/api';

export const AUTH_ENDPOINTS = {
    register: '/auth/register',
    login:    '/auth/login',
    logout:   '/auth/logout',
    aimove:  '/game/ai/move',
};

export const PROFILE_ENDPOINTS = {
    me:        '/profile/me',
    password:  '/profile/me/password',
};

export const SESSION_ENDPOINTS = {
    start:    '/game/start',
    history:  '/game/history',
    byId:     (id) => `/game/${id}`,
    move:     (id) => `/game/${id}/move`,
    finish:   (id) => `/game/${id}/finish`,
    abort:    (id) => `/game/${id}/abort`,
};