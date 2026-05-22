
import express from 'express';
import cors from 'cors';
import { connectDB } from './config/dbConnection.js'
import gameRouter from './modules/game/routes/gameRoute.js';
import authRouter from './modules/auth/routes/authRoute.js';
import playerRouter from './modules/player/routes/playerRoute.js';
import { registerSocketHandlers } from './config/socketHandlers.js';
import http from 'http';
import { Server } from 'socket.io';

// import adminRouter from './modules/admin/routes/adminRoute.js';

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());


app.use('/api/game', gameRouter);
app.use('/api/auth', authRouter);
app.use('/api/profile', playerRouter);
// app.use('/api/admin', adminRouter);
const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: '*',
        methods: ['GET', 'POST']
    }
});
// Register realtime handlers
registerSocketHandlers(io);
(async () => {
    await connectDB();
    server.listen(PORT, () => {
        console.log(`Backend listening on http://localhost:${PORT}`);
    });
})();