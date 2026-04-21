import express from 'express';
import cors from 'cors';
import gameRouter from './modules/game/routes/gameRoute.js';

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

app.get('/api/health', (_req, res) => {
    res.status(200).json({ status: 'ok' });
});

app.use('/api/game', gameRouter);

app.listen(PORT, () => {
    console.log(`Backend listening on http://localhost:${PORT}`);
});
