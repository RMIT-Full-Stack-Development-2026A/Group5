import { AdminService } from '../services/adminService.js';

const handle = (fn) => async (req, res) => {
    try {
        await fn(req, res);
    } catch (error) {
        res.status(error.status || 500).json({ message: error.message, errors: error.errors });
    }
};

export const AdminController = {
    getAllUsers: handle(async (req, res) => {
        const users = await AdminService.getAllUsers();
        res.json(users);
    }),

    setActiveStatus: handle(async (req, res) => {
        const { isActive } = req.body;
        const user = await AdminService.setActiveStatus(req.params.id, isActive);
        res.json(user);
    }),

    listRooms: handle(async (req, res) => {
        const filters = {
            search: req.query.search || '',
            page: Number(req.query.page) || 1,
            limit: Number(req.query.limit) || 10,
            sortOrder: req.query.sortOrder || 'desc',
        };
        res.json(await AdminService.listRooms(filters));
    }),

    closeRoom: handle(async (req, res) => {
        const room = await AdminService.closeRoom(req.params.id);
        res.json(room);
    }),
};
