const express = require('express');
const http = require('node:http');
const { Server } = require('socket.io');

const app = express();
const server = http.createServer(app);

// Socket.io server instance, always setup cors to avoid error
const io = new Server(server, {
  // Accepts socket connction from all domains '*'
  cors: {
    origin: '*',
  },
});

/**
 *  'io' is the server socker
 * The 'socket' argument in the callback function is the connecting clients
 *
 * Use 'socket' to listen for client event, to interact with clients
 * Use 'io' to interact with socket e.g emitting events
 */
io.on('connection', (socket) => {
  const query = socket.handshake.query;

  // console.log(query);
  console.log('Socket connected:', socket.id);

  socket.on('disconnect', () => {
    console.log('Socket ', socket.id, 'has disconnected');
  });

  socket.on('chat:sent', (chat) => {
    io.emit('chat:recieved', chat);
  });
});

// Test notifcation
app.post('/notify', (req, res, next) => {
  try {
    io.emit('account:update', {
      username: 'oxwware',
      description: 'This is a test notification',
    });

    res.status(200).send();
  } catch (error) {
    next(error);
  }
});

server.listen(8000, () => {
  console.log('Server running on port 8000');
});
