const setupSocket = (io) => {
  io.on('connection', (socket) => {
    console.log(`Socket connected: ${socket.id}`);

    socket.on('join:author', (authorId) => {
      if (authorId) {
        socket.join(`author:${authorId}`);
        socket.join(`user:${authorId}`);
      }
      console.log(`Socket ${socket.id} joined author:${authorId}`);
    });

    socket.on('join:admin', () => {
      socket.join('admin:room');
      console.log(`Socket ${socket.id} joined admin:room`);
    });

    socket.on('join:user', (userId) => {
      if (userId) {
        socket.join(`user:${userId}`);
      }
    });

    socket.on('leave:author', (authorId) => {
      if (authorId) socket.leave(`author:${authorId}`);
    });

    socket.on('leave:admin', () => {
      socket.leave('admin:room');
    });

    socket.on('disconnect', () => {
      console.log(`Socket disconnected: ${socket.id}`);
    });
  });
};

module.exports = setupSocket;
