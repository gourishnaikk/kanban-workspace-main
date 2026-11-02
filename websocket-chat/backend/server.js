require("dotenv").config();
const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const cors = require("cors");

// ── App & HTTP Server Setup ──────────────────────────────────────────────────
const app = express();
const httpServer = http.createServer(app);

// ── CORS Configuration ───────────────────────────────────────────────────────
// Allow the Vite dev server (port 5174 is default when 5173 is taken by KanbanBoard)
const FRONTEND_ORIGINS = [
  "http://localhost:5173",
  "http://localhost:5174",
  "http://localhost:5175",
  "http://localhost:3000",
];

app.use(cors({ origin: FRONTEND_ORIGINS }));
app.use(express.json());

// ── Socket.IO Setup ──────────────────────────────────────────────────────────
// Attach Socket.IO to the HTTP server with matching CORS policy
const io = new Server(httpServer, {
  cors: {
    origin: FRONTEND_ORIGINS,
    methods: ["GET", "POST"],
  },
});

// ── Health Check Route ───────────────────────────────────────────────────────
app.get("/", (req, res) => {
  res.json({
    status: "online",
    message: "Experiment 8 – WebSocket Chat Server is Running",
    connectedClients: io.engine.clientsCount,
  });
});

// ── Socket.IO Event Handlers ─────────────────────────────────────────────────
io.on("connection", (socket) => {
  console.log(`[Socket.IO] Client connected    → ID: ${socket.id}`);

  // ── Event: chatMessage ────────────────────────────────────────────────────
  // Receives a message from a client, validates it, then broadcasts to all
  socket.on("chatMessage", (payload) => {
    const { username, message } = payload || {};

    // Basic validation: reject empty or overly long content
    if (!username || typeof username !== "string" || username.trim() === "") {
      console.warn(`[Socket.IO] Invalid username from ${socket.id} – message dropped`);
      return;
    }

    if (!message || typeof message !== "string" || message.trim() === "") {
      console.warn(`[Socket.IO] Empty message from ${socket.id} – message dropped`);
      return;
    }

    const trimmedMessage = message.trim();
    if (trimmedMessage.length > 500) {
      console.warn(`[Socket.IO] Message too long from ${socket.id} – message dropped`);
      return;
    }

    // Build a clean broadcast payload
    const outgoingPayload = {
      id: `${socket.id}-${Date.now()}`,
      username: username.trim(),
      message: trimmedMessage,
      timestamp: new Date().toISOString(),
      socketId: socket.id,
    };

    console.log(`[Socket.IO] Broadcasting from ${username.trim()}: "${trimmedMessage}"`);

    // io.emit() broadcasts to ALL connected clients including the sender
    io.emit("chatMessage", outgoingPayload);
  });

  // ── Event: disconnect ─────────────────────────────────────────────────────
  socket.on("disconnect", (reason) => {
    console.log(`[Socket.IO] Client disconnected ← ID: ${socket.id} | Reason: ${reason}`);
  });
});

// ── Start Server ─────────────────────────────────────────────────────────────
const PORT = process.env.PORT || 5001;
httpServer.listen(PORT, () => {
  console.log(`\n🚀 WebSocket Chat Server running on http://localhost:${PORT}`);
  console.log(`   Socket.IO endpoint: ws://localhost:${PORT}\n`);
});
