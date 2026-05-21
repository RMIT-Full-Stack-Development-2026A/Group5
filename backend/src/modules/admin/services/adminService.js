import * as adminRepo from '../repositories/adminRepo.js';
import { toAdminUserDTO } from '../../player/dto/dto.js';

export const AdminService = {
    async getAllUsers() {
        const users = await adminRepo.findAllUsers();
        return users.map(toAdminUserDTO);
    },

    async setActiveStatus(userId, isActive) {
        const user = await adminRepo.setUserStatus(userId, isActive);
        return toAdminUserDTO(user);
    },

    async listRooms(filters) {
        const rooms = await adminRepo.findActiveRooms(filters);
        const total = await adminRepo.countActiveRooms(filters);
        return { rooms, total, page: filters.page ?? 1, limit: filters.limit ?? 10, totalPages: Math.ceil(total / (filters.limit ?? 10)) };
    },

    async closeRoom(roomId) {
        return adminRepo.closeRoom(roomId);
    },
};
