
import express from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import { connectDB } from './config/dbConnection.js';
import gameRouter from './modules/game/routes/gameRoute.js';
import authRouter from './modules/auth/routes/authRoute.js';
import playerRouter from './modules/player/routes/playerRoute.js';
import adminRouter from './modules/admin/routes/adminRoute.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

app.get('/api/health', (_req, res) => {
    res.status(200).json({ status: 'ok' });
});

app.use('/api/game', gameRouter);
app.use('/api/auth', authRouter);
app.use('/api/player', playerRouter);
app.use('/api/admin', adminRouter);

(async () => {
    await connectDB();
    app.listen(PORT, () => {
        console.log(`Backend listening on http://localhost:${PORT}`);
    });
})();