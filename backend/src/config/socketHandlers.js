import jwt from 'jsonwebtoken';

const rooms = new Map(); // roomCode -> { code, sockets: Set(socketId), userIds: Set(userId), status }

const ROOM_CODE_CHARS = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';

function generateRoomCode(length = 6) {
    let code = '';
    for (let i = 0; i < length; i++) {
        code += ROOM_CODE_CHARS[Math.floor(Math.random() * ROOM_CODE_CHARS.length)];
    }
    return code;
}

export const registerSocketHandlers = (io) => {
    io.on('connection', (socket) => {
        // Try to decode JWT if provided via socket.handshake.auth.token
        const token = socket.handshake?.auth?.token;
        if (token) {
            try {
                const decoded = jwt.verify(token, process.env.JWT_SECRET);
                socket.data.user = decoded;
            } catch (err) {
                // invalid token - leave unauthenticated but continue
                socket.data.user = null;
            }
        }

        socket.on('createRoom', (payload = {}, ack) => {
            try {
                let code = payload.roomCode ? String(payload.roomCode).toUpperCase().trim() : null;
                if (code && rooms.has(code)) {
                    const response = { ok: false, message: 'Room already exists' };
                    if (typeof ack === 'function') ack(response);
                    socket.emit('roomError', { message: response.message });
                    return;
                }

                // generate unique code if not provided
                if (!code) {
                    for (let attempt = 0; attempt < 6; attempt++) {
                        const candidate = generateRoomCode();
                        if (!rooms.has(candidate)) { code = candidate; break; }
                    }
                    if (!code) code = generateRoomCode();
                }

                const room = {
                    code,
                    sockets: new Set([socket.id]),
                    userIds: new Set([socket.data?.user?.id ?? socket.id]),
                    status: 'waiting',
                };

                rooms.set(code, room);
                socket.join(code);
                socket.data.roomCode = code;

                if (typeof ack === 'function') ack({ ok: true, roomCode: code });
                socket.emit('roomCreated', { roomCode: code });
            } catch (err) {
                if (typeof ack === 'function') ack({ ok: false, message: 'Failed to create room' });
                socket.emit('roomError', { message: 'Failed to create room' });
            }
        });

        socket.on('joinRoom', (payload = {}, ack) => {
            try {
                const code = String(payload.roomCode || '').toUpperCase().trim();
                if (!code || !rooms.has(code)) {
                    const response = { ok: false, message: 'Room not found' };
                    if (typeof ack === 'function') ack(response);
                    socket.emit('roomError', { message: response.message });
                    return;
                }

                const room = rooms.get(code);
                if (room.status !== 'waiting') {
                    const response = { ok: false, message: 'Room already started' };
                    if (typeof ack === 'function') ack(response);
                    socket.emit('roomError', { message: response.message });
                    return;
                }

                room.sockets.add(socket.id);
                room.userIds.add(socket.data?.user?.id ?? socket.id);
                room.status = 'in_progress';
                socket.join(code);
                socket.data.roomCode = code;

                if (typeof ack === 'function') ack({ ok: true, roomCode: code });
                io.to(code).emit('roomJoined', { roomCode: code });
            } catch (err) {
                if (typeof ack === 'function') ack({ ok: false, message: 'Failed to join room' });
                socket.emit('roomError', { message: 'Failed to join room' });
            }
        });

        socket.on('makeMove', (payload = {}) => {
            try {
                const code = String(payload.roomCode || socket.data.roomCode || '').toUpperCase().trim();
                const move = payload.move;
                if (!code || !rooms.has(code)) {
                    socket.emit('roomError', { message: 'Room not found' });
                    return;
                }
                // Broadcast move to all in room
                io.to(code).emit('moveMade', { move, by: socket.data?.user?.id ?? socket.id });
            } catch (err) {
                socket.emit('roomError', { message: 'Failed to make move' });
            }
        });

        socket.on('chatMessage', (payload = {}) => {
            try {
                const code = String(payload.roomCode || socket.data.roomCode || '').toUpperCase().trim();
                const message = payload.message;
                if (!code || !rooms.has(code)) {
                    socket.emit('roomError', { message: 'Room not found' });
                    return;
                }
                const sender = socket.data?.user?.username ?? socket.data?.user?.id ?? socket.id;
                io.to(code).emit('chatMessage', { message, from: sender, timestamp: Date.now() });
            } catch (err) {
                socket.emit('roomError', { message: 'Failed to send chat' });
            }
        });

        socket.on('leaveRoom', (payload = {}) => {
            const code = String(payload.roomCode || socket.data.roomCode || '').toUpperCase().trim();
            if (!code || !rooms.has(code)) return;
            const room = rooms.get(code);
            room.sockets.delete(socket.id);
            socket.leave(code);
            // If room empty, remove it
            if (room.sockets.size === 0) {
                rooms.delete(code);
                return;
            }
            // notify remaining
            io.to(code).emit('playerLeft', { by: socket.data?.user?.id ?? socket.id });
            // mark finished
            room.status = 'finished';
            io.to(code).emit('gameOver', { reason: 'player_left' });
            rooms.delete(code);
        });

        socket.on('disconnect', (reason) => {
            const code = socket.data?.roomCode;
            if (!code) return;
            const room = rooms.get(code);
            if (!room) return;

            room.sockets.delete(socket.id);
            // If room empty remove
            if (room.sockets.size === 0) {
                rooms.delete(code);
                return;
            }

            // Notify remaining players and mark forfeit
            const remaining = Array.from(room.sockets)[0];
            const winnerId = remaining || null;
            io.to(code).emit('playerLeft', { by: socket.data?.user?.id ?? socket.id });
            io.to(code).emit('gameOver', { reason: 'forfeit', winner: winnerId });
            rooms.delete(code);
        });
    });
};
