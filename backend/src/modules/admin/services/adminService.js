import * as adminRepo from '../repositories/adminRepo.js';
import { toAdminUserDTO } from '../../player/dto/dto.js';
import { toGameDTO } from '../dto/dto.js';

const getTotalPages = (total, limit) => Math.max(1, Math.ceil(total / limit));

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
        const limit = filters.limit ?? 10;
        return { rooms, total, page: filters.page ?? 1, limit, totalPages: getTotalPages(total, limit) };
    },


    async listGames(filters) {
        const games = await adminRepo.findAllGames(filters);
        const total = await adminRepo.countAllGames(filters);
        const limit = filters.limit ?? 10;
        const gamesDTO = games.map(toGameDTO);

        return { games: gamesDTO, total, page: filters.page ?? 1, limit, totalPages: getTotalPages(total, limit) };
    },
};
