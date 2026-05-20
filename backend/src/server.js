
import express from 'express';
import cors from 'cors';
import { connectDB } from './config/dbConnection.js'
import gameRouter from './modules/game/routes/gameRoute.js';
import authRouter from './modules/auth/routes/authRoute.js';

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

app.get('/api/health', (_req, res) => {
    res.status(200).json({ status: 'ok' });
});

app.use('/api/game', gameRouter);
app.use('/api/auth', authRouter);

(async () => {
    await connectDB();
    app.listen(PORT, () => {
        console.log(`Backend listening on http://localhost:${PORT}`);
    });
})();