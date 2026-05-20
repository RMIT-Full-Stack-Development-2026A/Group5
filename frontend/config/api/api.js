export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '/api';

export const AUTH_ENDPOINTS = {
    register: '/auth/register',
    login:    '/auth/login',
    logout:   '/auth/logout',
    aimove:  '/game/ai/move',
};

export const SESSION_ENDPOINTS = {
    start:    '/game/session/start',
    history:  '/game/session/history',
    byId:     (id) => `/game/session/${id}`,
    move:     (id) => `/game/session/${id}/move`,
    finish:   (id) => `/game/session/${id}/finish`,
    abort:    (id) => `/game/session/${id}/abort`,
};