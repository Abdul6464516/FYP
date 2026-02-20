import { io } from 'socket.io-client';

const SOCKET_URL = 'http://localhost:5000';

let socket = null;
let registeredUserId = null;

export function getSocket() {
  if (!socket) {
    socket = io(SOCKET_URL, {
      autoConnect: false,
      transports: ['websocket', 'polling'],
    });

    // Single connect listener — auto re-registers on every reconnect
    socket.on('connect', () => {
      console.log('Socket connected:', socket.id);
      if (registeredUserId) {
        socket.emit('register', registeredUserId);
        console.log('Registered user', registeredUserId, 'on socket', socket.id);
      }
    });
  }
  return socket;
}

export function connectSocket(userId) {
  const s = getSocket();
  registeredUserId = userId;

  if (!s.connected) {
    s.connect();           // will trigger 'connect' listener above
  } else {
    s.emit('register', userId);  // already connected, just re-register
  }
  return s;
}

export function disconnectSocket() {
  if (socket) {
    socket.disconnect();
    registeredUserId = null;
  }
}
