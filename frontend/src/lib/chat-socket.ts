import { io, Socket } from 'socket.io-client';

const WS_BASE = (
  process.env.NEXT_PUBLIC_WS_URL || 'http://127.0.0.1:3001'
).replace(/\/$/, '');

let socket: Socket | null = null;

export function getChatSocket(token: string): Socket {
  if (socket?.connected) return socket;
  if (socket) socket.disconnect();

  socket = io(`${WS_BASE}/chat`, {
    auth: { token },
    transports: ['websocket', 'polling'],
  });

  return socket;
}

export function disconnectChatSocket() {
  if (socket) {
    socket.disconnect();
    socket = null;
  }
}
