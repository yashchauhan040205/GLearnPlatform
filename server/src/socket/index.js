const { Server } = require('socket.io');

let io;

const normalizeOrigin = (value) => (value || '').trim().replace(/\/+$/, '');
const allowedOrigins = (process.env.CLIENT_URL || 'http://localhost:3000')
  .split(',')
  .map(normalizeOrigin)
  .filter(Boolean);

const initSocket = (server) => {
  io = new Server(server, {
    cors: {
      origin: (origin, callback) => {
        if (!origin) return callback(null, true);
        const normalized = normalizeOrigin(origin);
        return callback(null, allowedOrigins.includes(normalized));
      },
      methods: ['GET', 'POST'],
      credentials: true,
    },
  });

  io.on('connection', (socket) => {
    console.log(`Socket connected: ${socket.id}`);

    socket.on('join:course', (courseId) => {
      socket.join(`course:${courseId}`);
    });

    socket.on('join:user', (userId) => {
      socket.join(`user:${userId}`);
      console.log(`User ${userId} joined their personal room`);
    });

    socket.on('join:leaderboard', () => {
      socket.join('leaderboard');
      console.log(`Socket ${socket.id} joined leaderboard room`);
    });

    socket.on('discussion:new', (data) => {
      io.to(`course:${data.courseId}`).emit('discussion:new', data);
    });

    socket.on('challenge:send', (data) => {
      io.to(`user:${data.targetUserId}`).emit('challenge:received', data);
    });

    socket.on('disconnect', () => {
      console.log(`Socket disconnected: ${socket.id}`);
    });
  });

  return io;
};

const getIO = () => {
  if (!io) throw new Error('Socket.io not initialized');
  return io;
};

module.exports = { initSocket, getIO };
