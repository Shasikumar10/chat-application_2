const express = require('express');
const dotenv = require('dotenv');
const mongoose = require('mongoose');
const cors = require('cors');
const http = require('http');
const socketio = require('socket.io');

// Routes
const authRoutes = require('./routes/authRoutes');
const chatRoutes = require('./routes/chatRoutes');
const messageRoutes = require('./routes/messageRoutes');

dotenv.config();

const app = express();
app.use(express.json());
app.use(cors());

// MongoDB connection
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => {
  console.log('✅ MongoDB connected');
}).catch((err) => {
  console.error('❌ MongoDB connection error:', err);
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/chat', chatRoutes);
app.use('/api/message', messageRoutes);

// Root Route
app.get('/', (req, res) => {
  res.send('API is running...');
});

// HTTP + Socket.IO setup
const server = http.createServer(app);
const io = socketio(server, {
  pingInterval: 10000,
  pingTimeout: 5000,
});

// User connection map
let users = [];

const addUser = (userId, socketId) => {
  if (!users.some((user) => user.userId === userId)) {
    users.push({ userId, socketId });
  }
};

const removeUser = (socketId) => {
  users = users.filter((user) => user.socketId !== socketId);
};

const getUserSocketId = (userId) => {
  return users.find((user) => user.userId === userId)?.socketId;
};

// Socket.IO Events
io.on('connection', (socket) => {
  console.log('⚡ User connected:', socket.id);

  socket.on('addUser', (userId) => {
    addUser(userId, socket.id);
  });

  socket.on('sendMessage', (data) => {
    const { chatId, senderId, content } = data;
    const receiverSocketId = getUserSocketId(chatId);

    if (receiverSocketId) {
      io.to(receiverSocketId).emit('receiveMessage', {
        senderId,
        chatId,
        content,
      });
    }
  });

  socket.on('disconnect', () => {
    removeUser(socket.id);
    console.log('❌ User disconnected:', socket.id);
  });
});

// Server Start
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
