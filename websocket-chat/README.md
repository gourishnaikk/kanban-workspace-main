# Experiment 8 — Real-Time Communication Using WebSockets

## Objective

Build a real-time chat application where multiple users can connect through different browser tabs and exchange messages instantly using WebSockets (Socket.IO), without refreshing the browser.

---

## Technologies Used

| Layer     | Technology        | Purpose                                |
|-----------|-------------------|----------------------------------------|
| Frontend  | React 18 + Vite   | UI framework and dev server            |
| Backend   | Node.js + Express | HTTP + WebSocket server                |
| Protocol  | Socket.IO         | Real-time bidirectional communication  |
| Styling   | Vanilla CSS       | Responsive, polished UI                |

---

## Project Structure

```
websocket-chat/
├── backend/
│   ├── server.js        ← Express + Socket.IO server
│   ├── package.json
│   └── .env             ← PORT=5001
│
└── frontend/
    ├── src/
    │   ├── App.jsx      ← Root component (JoinScreen + ChatScreen)
    │   ├── App.css      ← Chat UI styles
    │   ├── index.css    ← Global reset
    │   └── main.jsx     ← React DOM entry
    ├── index.html
    ├── package.json
    └── vite.config.js
```

---

## Installation & Setup

### Step 1 — Backend

```bash
cd websocket-chat/backend
npm install
npm run dev
```

Server starts at: **http://localhost:5001**

### Step 2 — Frontend

Open a **new terminal**:

```bash
cd websocket-chat/frontend
npm install
npm run dev
```

App starts at: **http://localhost:5174**

---

## How Socket.IO Works in This Application

```
Browser Tab 1                     Server (port 5001)           Browser Tab 2
─────────────────────────────────────────────────────────────────────────────
1. io.connect()          ──────►  socket.on('connection')
2. socket.emit('chatMessage', …)  socket.on('chatMessage', …)
                                  io.emit('chatMessage', …)  ──────► socket.on('chatMessage', …)
                                                                     Update message list
```

- `socket.emit()` sends an event from **one** client to the server
- `io.emit()` broadcasts an event to **all** connected clients (including the sender)
- Each browser tab creates its own socket with a unique `socket.id`
- The frontend uses that `socket.id` to identify which messages are "own" vs received

---

## Events Implemented

| Event          | Direction            | Purpose                            |
|----------------|----------------------|------------------------------------|
| `connection`   | Server (auto)        | Logs new client socket ID          |
| `chatMessage`  | Client → Server      | Send a chat message                |
| `chatMessage`  | Server → All Clients | Broadcast message to everyone      |
| `disconnect`   | Server (auto)        | Logs when a client disconnects     |

---

## How to Test with Two Browser Tabs

1. Start the backend: `cd backend && npm run dev`
2. Start the frontend: `cd frontend && npm run dev`
3. Open **http://localhost:5174** in **Tab 1**
4. Enter a username (e.g. `Gourish`) and click **Join Chat**
5. Open **http://localhost:5174** in **Tab 2**
6. Enter a different username (e.g. `Nupur`) and click **Join Chat**
7. Send a message from Tab 1 — it should appear **instantly** in Tab 2
8. Reply from Tab 2 — it should appear **instantly** in Tab 1
9. Close Tab 2 — the backend logs `Client disconnected`

---

## Expected Output

**Backend terminal:**
```
🚀 WebSocket Chat Server running on http://localhost:5001
[Socket.IO] Client connected    → ID: abc123def456
[Socket.IO] Client connected    → ID: xyz789ghi012
[Socket.IO] Broadcasting from Gourish: "Hello!"
[Socket.IO] Client disconnected ← ID: xyz789ghi012 | Reason: transport close
```

**Frontend:**
- Tab 1 shows "Hello!" as a blue right-aligned bubble
- Tab 2 shows "Hello!" as a white left-aligned bubble with "Gourish" label
- Both tabs show a green "Connected" status indicator

---

## Port Reference

| Service          | Port |
|------------------|------|
| KanbanBoard API  | 5000 |
| Chat Backend     | 5001 |
| KanbanBoard UI   | 5173 |
| Chat Frontend    | 5174 |
