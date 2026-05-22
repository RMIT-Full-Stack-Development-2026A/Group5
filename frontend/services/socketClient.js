import { io } from 'socket.io-client';
import { getToken } from './httpService.js';


// Socket connects to the API origin. In dev that's the vite proxy target;
// in prod it's the env-configured backend host.
const inferSocketUrl = () => {
    const base = import.meta.env.VITE_API_BASE_URL;
    if (!base) return undefined;   // same origin via vite proxy
    try {
        return new URL(base).origin;
    } catch (_e) {
        return undefined;
    }
};


let socket = null;


export const getSocket = () => {
    if (socket && socket.connected) return socket;

    socket = io(inferSocketUrl(), {
        auth:        { token: getToken() },
        autoConnect: true,
        transports:  ['websocket', 'polling'],
    });

    return socket;
};


export const disconnectSocket = () => {
    if (socket) {
        socket.disconnect();
        socket = null;
    }
};


// Promise wrapper around socket.emit with an ack callback.
export const emitAck = (event, payload) =>
    new Promise((resolve, reject) => {
        const s = getSocket();
        s.emit(event, payload, (ack) => {
            if (ack && ack.ok === false) return reject(new Error(ack.error || event + ' failed'));
            resolve(ack);
        });
    });
