import { io } from 'socket.io-client';

const SERVER_URL = import.meta.env.VITE_API_URL || '';

const socket = io(SERVER_URL, {
  autoConnect: false,
  transports: ['websocket', 'polling'],
});

export default socket;
