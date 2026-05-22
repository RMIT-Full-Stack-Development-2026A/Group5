import { io } from 'socket.io-client';

const SOCKET_URL =
    import.meta.env.VITE_SOCKET_URL ||
    import.meta.env.VITE_API_ORIGIN ||
    'http://localhost:5000';

const socket = io(SOCKET_URL, {
    autoConnect: false,
    transports: ['websocket'],
});

export const socketService = {
    connect: (token) => {
        if (token) {
            socket.auth = { token };
        }

        if (!socket.connected) {
            socket.connect();
        }

        return socket;
    },

    disconnect: () => {
        socket.disconnect();
    },

    on: (event, handler) => {
        socket.on(event, handler);
    },

    off: (event, handler) => {
        socket.off(event, handler);
    },

    emit: (event, payload) => {
        socket.emit(event, payload);
    },

    emitWithAck: (event, payload, timeout = 5000) =>
        new Promise((resolve, reject) => {
            socket.timeout(timeout).emit(event, payload, (err, response) => {
                if (err) {
                    reject(new Error('Socket request timed out'));
                    return;
                }
                resolve(response);
            });
        }),

    createRoom: (roomCode) => {
        const code = roomCode || Math.random().toString(36).substring(2, 7).toUpperCase();
        socket.emit('createRoom', { roomCode: code });
        return code;
    },

    joinRoom: (roomCode) => {
        socket.emit('joinRoom', { roomCode });
    },

    leaveRoom: (roomCode) => {
        socket.emit('leaveRoom', { roomCode });
    },

    sendMove: (roomCode, move) => {
        socket.emit('makeMove', { roomCode, move });
    },

    sendChat: (roomCode, message) => {
        socket.emit('chatMessage', { roomCode, message });
    },
};