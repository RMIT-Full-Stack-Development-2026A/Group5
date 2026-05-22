import jwt from 'jsonwebtoken';
import { sessionService } from '../modules/game/services/gameService.js';


// In-memory state — rooms exist only while a match is live.
// Match persistence (moves, results) goes through sessionService → MongoDB.
const rooms = new Map();   // code -> { matchId, boardSize, players: {player1, player2}, currentTurn, finished }


const generateCode = () => {
    // 6-char uppercase code, no confusing characters
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
    let code;
    do {
        code = '';
        for (let i = 0; i < 6; i++) code += chars[Math.floor(Math.random() * chars.length)];
    } while (rooms.has(code));
    return code;
};


const authenticateSocket = (socket, next) => {
    const token = socket.handshake.auth?.token;
    if (!token) return next(new Error('No auth token'));
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        socket.data.userId   = decoded.id;
        socket.data.username = decoded.username;
        next();
    } catch (err) {
        next(new Error('Invalid token'));
    }
};


export const setupOnlineSocket = (io) => {

    io.use(authenticateSocket);

    io.on('connection', (socket) => {

        // Player creates a new room and waits for opponent
        socket.on('createRoom', ({ boardSize = '10x10' } = {}, ack) => {
            const code = generateCode();
            rooms.set(code, {
                matchId:     null,
                boardSize,
                players: {
                    player1: { socketId: socket.id, userId: socket.data.userId, username: socket.data.username },
                    player2: null,
                },
                currentTurn: 'player1',
                finished:    false,
            });
            socket.join(code);
            socket.data.roomCode = code;
            ack?.({ ok: true, code, you: 'player1', boardSize });
        });

        // Second player joins an existing room
        socket.on('joinRoom', async ({ code } = {}, ack) => {
            const room = rooms.get(code);
            if (!room) return ack?.({ ok: false, error: 'Room not found' });
            if (room.players.player2) return ack?.({ ok: false, error: 'Room is full' });
            if (room.players.player1.userId === socket.data.userId) {
                return ack?.({ ok: false, error: "You can't join your own room" });
            }

            room.players.player2 = {
                socketId: socket.id,
                userId:   socket.data.userId,
                username: socket.data.username,
            };
            socket.join(code);
            socket.data.roomCode = code;

            // Create the persistent match record now that both players are present
            try {
                const session = await sessionService.startGame(room.players.player1.userId, {
                    gameType:    'online',
                    boardSize:   room.boardSize,
                    boardStyle:  'classic',
                    player2:     room.players.player2.userId,
                    player2Name: room.players.player2.username,
                });
                room.matchId = String(session._id);

                const payload = {
                    matchId:    room.matchId,
                    gameNumber: session.gameNumber,
                    boardSize:  room.boardSize,
                    player1:    { username: room.players.player1.username },
                    player2:    { username: room.players.player2.username },
                };
                io.to(code).emit('matchStarted', payload);
                ack?.({ ok: true, you: 'player2', ...payload });
            } catch (err) {
                console.error('[joinRoom] startGame failed:', err);
                ack?.({ ok: false, error: 'Failed to create match' });
            }
        });

        // A player made a move
        socket.on('move', async ({ position, notation } = {}, ack) => {
            const code = socket.data.roomCode;
            const room = rooms.get(code);
            if (!room || !room.matchId) return ack?.({ ok: false, error: 'No active match' });
            if (room.finished) return ack?.({ ok: false, error: 'Match already finished' });

            const slot = room.players.player1.socketId === socket.id ? 'player1' : 'player2';
            if (slot !== room.currentTurn) return ack?.({ ok: false, error: 'Not your turn' });

            try {
                await sessionService.recordMove(room.matchId, room.players.player1.userId, {
                    playerSlot: slot,
                    position,
                    notation,
                });
                room.currentTurn = slot === 'player1' ? 'player2' : 'player1';
                io.to(code).emit('moveApplied', { playerSlot: slot, position, notation });
                ack?.({ ok: true });
            } catch (err) {
                console.error('[move] recordMove failed:', err);
                ack?.({ ok: false, error: err.message || 'Move rejected' });
            }
        });

        // Win detected client-side; server persists the result
        socket.on('finish', async ({ result, winLine } = {}, ack) => {
            const code = socket.data.roomCode;
            const room = rooms.get(code);
            if (!room || !room.matchId || room.finished) return ack?.({ ok: false });

            room.finished = true;
            try {
                await sessionService.finishGame(room.matchId, room.players.player1.userId, { result, winLine });
                io.to(code).emit('gameOver', { result, winLine });
                ack?.({ ok: true });
            } catch (err) {
                console.error('[finish] failed:', err);
                ack?.({ ok: false, error: err.message });
            }
        });

        socket.on('abort', async (_payload, ack) => {
            const code = socket.data.roomCode;
            const room = rooms.get(code);
            if (!room || room.finished) return ack?.({ ok: false });

            room.finished = true;
            try {
                if (room.matchId) {
                    await sessionService.abortGame(room.matchId, room.players.player1.userId);
                }
                io.to(code).emit('gameAborted');
                ack?.({ ok: true });
            } catch (err) {
                console.error('[abort] failed:', err);
                ack?.({ ok: false });
            }
        });

        socket.on('disconnect', () => {
            const code = socket.data.roomCode;
            if (!code) return;
            const room = rooms.get(code);
            if (!room) return;

            io.to(code).emit('opponentDisconnected');

            if (room.matchId && !room.finished) {
                room.finished = true;
                sessionService.abortGame(room.matchId, room.players.player1.userId)
                    .catch((err) => console.error('[disconnect] abort failed:', err));
            }
            rooms.delete(code);
        });
    });
};
