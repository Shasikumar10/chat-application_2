const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const cors = require('cors');

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST'],
  },
});

app.use(cors());
app.use(express.json());

io.on('connection', (socket) => {
  console.log('A user connected');

  socket.on('sendMessage', (message) => {
    console.log('Message received:', message);
    io.emit('receiveMessage', message); // Broadcast message to all connected clients
  });

  socket.on('disconnect', () => {
    console.log('A user disconnected');
  });
});

server.listen(5000, () => {
  console.log('Server is running on http://localhost:5000');
});
