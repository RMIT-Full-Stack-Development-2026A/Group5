
import http from 'http';
import path from 'path';
import { fileURLToPath } from 'url';
import express from 'express';
import cors from 'cors';
import { Server as SocketIOServer } from 'socket.io';
import { connectDB } from './config/dbConnection.js'
import gameRouter from './modules/game/routes/gameRoute.js';
import authRouter from './modules/auth/routes/authRoute.js';
import playerRouter from './modules/player/routes/playerRoute.js';
import adminRouter from './modules/admin/routes/adminRoute.js';
import { setupOnlineSocket } from './socket/onlineSocket.js';

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Serve uploaded avatars
const __dirname = path.dirname(fileURLToPath(import.meta.url));
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

app.use('/api/game', gameRouter);
app.use('/api/auth', authRouter);
app.use('/api/profile', playerRouter);
app.use('/api/admin', adminRouter);


// Wrap Express in an HTTP server so Socket.IO can share the same port
const httpServer = http.createServer(app);
const io = new SocketIOServer(httpServer, {
    cors: { origin: '*' },
});
setupOnlineSocket(io);


(async () => {
    await connectDB();
    httpServer.listen(PORT, () => {
        console.log(`Backend listening on http://localhost:${PORT}`);
    });
})();
