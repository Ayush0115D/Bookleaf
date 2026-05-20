const setupSocket = (io) => {
  io.on('connection', (socket) => {
    console.log(`Socket connected: ${socket.id}`);

    socket.on('join:author', (authorId) => {
      socket.join(`author:${authorId}`);
      console.log(`Socket ${socket.id} joined author:${authorId}`);
    });

    socket.on('join:admin', () => {
      socket.join('admin:room');
      console.log(`Socket ${socket.id} joined admin:room`);
    });

    socket.on('leave:author', (authorId) => {
      socket.leave(`author:${authorId}`);
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
