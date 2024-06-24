import io from 'socket.io-client';

const SOCKET_URL = import.meta.env.VITE_SOCKET_URL;

export const socketIo = io(SOCKET_URL, {
    autoConnect: false,
    reconnection: true,
    reconnectionDelayMax: 5000,
    transports: ['websocket'],
    auth: {
        token: localStorage.getItem('token')
    },
});
