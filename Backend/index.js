import { app } from "./app.js";
import dotenv from "dotenv";
import connectDB from "./Config/ConnectDB.js";
import imagekit from "imagekit";
import { Server } from "socket.io";
import http from "http";

dotenv.config();
connectDB();

export const imagekitInstance = new imagekit({
  publicKey: process.env.IMAGEKIT_PUBLIC_KEY,
  privateKey: process.env.IMAGEKIT_PRIVATE_KEY,
  urlEndpoint: process.env.IMAGEKIT_URL_ENDPOINT,
});

// Create HTTP server
const httpServer = http.createServer(app);

// Initialize Socket.IO
export const io = new Server(httpServer, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
    credentials: true,
  },
});

// Middleware to attach io to every request
// Store the io instance in the app
app.set('io', io);

// Socket.IO connection handling
io.on('connection', (socket) => {
  console.log('User connected:', socket.id);

  socket.on('joinNegotiation', (negotiationId) => {
    socket.join(negotiationId);
    console.log(`Socket ${socket.id} joined negotiation ${negotiationId}`);
  });

  socket.on('leaveNegotiation', (negotiationId) => {
    socket.leave(negotiationId);
    console.log(`Socket ${socket.id} left negotiation ${negotiationId}`);
  });

  socket.on('typing', (data) => {
    socket.to(data.negotiationId).emit('typingStatus', {
      userId: data.userId,
      isTyping: data.isTyping
    });
  });

  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);
  });
});

// Start server
const PORT = process.env.PORT || 5000;
httpServer.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});

// Handle uncaught exceptions
process.on("uncaughtException", (err) => {
  console.log(`Error: ${err.message}`);
  console.log("Shutting down due to uncaught exception");
  process.exit(1);
});

// Handle unhandled promise rejections
process.on("unhandledRejection", (err) => {
  console.log(`Error: ${err.message}`);
  console.log("Shutting down due to unhandled promise rejection");
  httpServer.close(() => process.exit(1));
});

// Handle SIGTERM
process.on("SIGTERM", () => {
  console.log("Shutting down due to SIGTERM");
  httpServer.close(() => process.exit(0));
});
