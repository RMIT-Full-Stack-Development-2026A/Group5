import { http } from './httpService.js';

export const saveGameSession = async (payload) => {
    return http.post('/game/sessions', payload);
};

export const createGameRoom = async (payload) => {
    return http.post('/game/rooms', payload);
};

export const listActiveRooms = async () => {
    return http.get('/game/rooms');
};

export const closeAdminRoom = async (roomId) => {
    return http.patch(`/admin/rooms/${roomId}/close`, {});
};

export const fetchAdminUsers = async () => {
    return http.get('/admin/users');
};

export const setUserActiveStatus = async (userId, isActive) => {
    return http.patch(`/admin/users/${userId}/status`, { isActive });
};
