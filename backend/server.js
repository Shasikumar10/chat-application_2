// backend/server.js

const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const cors = require("cors");
const socketio = require("socket.io");
const http = require("http");
const userRoutes = require("./routes/userRoutes");

dotenv.config();

const app = express();

// HTTP server for socket.io
const server = http.createServer(app);

// Initialize socket.io
const io = socketio(server);

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use("/api/users", userRoutes);

// Socket.io logic
io.on("connection", (socket) => {
  console.log("New client connected");

  // Handle incoming messages
  socket.on("send_message", (data) => {
    io.emit("receive_message", data); // broadcast to all clients
  });

  // Handle disconnect
  socket.on("disconnect", () => {
    console.log("Client disconnected");
  });
});

// MongoDB connection
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("MongoDB connected successfully");
  })
  .catch((err) => {
    console.log("Error connecting to MongoDB:", err);
  });

// Start the server
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
