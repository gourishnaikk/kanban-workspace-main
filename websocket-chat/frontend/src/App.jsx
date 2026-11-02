import React, { useState, useEffect, useRef, useCallback } from 'react';
import { io } from 'socket.io-client';
import './App.css';

// ── Socket Server URL ─────────────────────────────────────────────────────────
const SOCKET_SERVER_URL = 'http://localhost:5001';

// ── Utility: format ISO timestamp to a readable time string ──────────────────
function formatTime(isoString) {
  const date = new Date(isoString);
  return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}

// ── Component: JoinScreen ─────────────────────────────────────────────────────
function JoinScreen({ onJoin }) {
  const [name, setName] = useState('');
  const [error, setError] = useState('');
  const inputRef = useRef(null);

  // Auto-focus the name input on mount
  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name.trim()) {
      setError('Please enter your name to join.');
      return;
    }
    onJoin(name.trim());
  };

  return (
    <div className="join-screen">
      <div className="join-card">
        {/* Icon */}
        <div className="join-icon">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            <path strokeLinecap="round" strokeLinejoin="round"
              d="M20.25 8.511c.884.284 1.5 1.128 1.5 2.097v4.286c0 1.136-.847 2.1-1.98 2.193-.34.027-.68.052-1.02.072v3.091l-3-3c-1.354 0-2.694-.055-4.02-.163a2.115 2.115 0 01-.825-.242m9.345-8.334a2.126 2.126 0 00-.476-.095 48.64 48.64 0 00-8.048 0c-1.131.094-1.976 1.057-1.976 2.192v4.286c0 .837.46 1.58 1.155 1.951m9.345-8.334V6.637c0-1.621-1.152-3.026-2.76-3.235A48.455 48.455 0 0011.25 3c-2.115 0-4.198.137-6.24.402-1.608.209-2.76 1.614-2.76 3.235v6.226c0 1.621 1.152 3.026 2.76 3.235.577.075 1.157.14 1.74.194V21l4.155-4.155" />
          </svg>
        </div>

        <h1 className="join-title">Real-Time Chat</h1>
        <p className="join-subtitle">Experiment 8 — WebSocket Communication with Socket.IO</p>

        <form onSubmit={handleSubmit} className="join-form">
          <label htmlFor="username-input" className="join-label">Your Name</label>
          <input
            id="username-input"
            ref={inputRef}
            type="text"
            className="join-input"
            placeholder="Enter your name..."
            value={name}
            onChange={(e) => {
              setName(e.target.value);
              setError('');
            }}
            maxLength={30}
          />
          {error && <p className="join-error">{error}</p>}
          <button type="submit" className="join-btn">
            Join Chat
          </button>
        </form>
      </div>
    </div>
  );
}

// ── Component: StatusBadge ────────────────────────────────────────────────────
function StatusBadge({ status }) {
  const config = {
    connected:    { dot: '#22c55e', label: 'Connected' },
    connecting:   { dot: '#f59e0b', label: 'Connecting…' },
    disconnected: { dot: '#ef4444', label: 'Disconnected' },
  };
  const { dot, label } = config[status] || config.disconnected;

  return (
    <span className="status-badge">
      <span className="status-dot" style={{ backgroundColor: dot }} />
      {label}
    </span>
  );
}

// ── Component: Message ────────────────────────────────────────────────────────
function Message({ msg, isOwn }) {
  return (
    <div className={`message-row ${isOwn ? 'message-row--own' : ''}`}>
      {/* Avatar (only for others) */}
      {!isOwn && (
        <div className="avatar" title={msg.username}>
          {msg.username.charAt(0).toUpperCase()}
        </div>
      )}

      <div className={`bubble-group ${isOwn ? 'bubble-group--own' : ''}`}>
        {!isOwn && (
          <span className="message-username">{msg.username}</span>
        )}
        <div className={`bubble ${isOwn ? 'bubble--own' : 'bubble--other'}`}>
          <p className="bubble-text">{msg.message}</p>
          <span className="bubble-time">{formatTime(msg.timestamp)}</span>
        </div>
      </div>
    </div>
  );
}

// ── Component: ChatScreen (main chat UI) ──────────────────────────────────────
function ChatScreen({ username }) {
  const [messages, setMessages]   = useState([]);
  const [inputText, setInputText] = useState('');
  const [status, setStatus]       = useState('connecting');

  // useRef keeps a single socket instance across renders without triggering re-renders
  const socketRef   = useRef(null);
  const messagesEndRef = useRef(null); // for auto-scroll
  const inputRef    = useRef(null);

  // ── Auto-scroll to bottom on new messages ──────────────────────────────────
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // ── Socket.IO Lifecycle ────────────────────────────────────────────────────
  useEffect(() => {
    // 1. Create the socket connection to the server
    const socket = io(SOCKET_SERVER_URL, {
      transports: ['websocket', 'polling'], // prefer WebSocket, fallback to polling
    });

    socketRef.current = socket;

    // 2. Listen for successful connection
    socket.on('connect', () => {
      console.log('[Socket.IO] Connected to server:', socket.id);
      setStatus('connected');
    });

    // 3. Listen for connection failure / disconnect
    socket.on('disconnect', (reason) => {
      console.log('[Socket.IO] Disconnected:', reason);
      setStatus('disconnected');
    });

    // 4. Handle connection errors
    socket.on('connect_error', (err) => {
      console.error('[Socket.IO] Connection error:', err.message);
      setStatus('disconnected');
    });

    // 5. Listen for incoming chat messages (broadcasted by the server)
    socket.on('chatMessage', (payload) => {
      setMessages((prev) => [...prev, payload]);
    });

    // 6. Cleanup: remove all listeners and disconnect when component unmounts
    //    This prevents duplicate listeners if the component re-renders
    return () => {
      socket.off('connect');
      socket.off('disconnect');
      socket.off('connect_error');
      socket.off('chatMessage');
      socket.disconnect();
      console.log('[Socket.IO] Cleaned up and disconnected');
    };
  }, []); // empty dep array → runs once on mount

  // ── Send Message Handler ───────────────────────────────────────────────────
  const sendMessage = useCallback(() => {
    const text = inputText.trim();
    if (!text || !socketRef.current?.connected) return;

    // Emit the chatMessage event to the server
    socketRef.current.emit('chatMessage', {
      username,
      message: text,
    });

    setInputText('');
    inputRef.current?.focus();
  }, [inputText, username]);

  // Allow sending via the Enter key (Shift+Enter for newline)
  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <div className="chat-layout">
      {/* ── Header ─────────────────────────────────────────────────────── */}
      <header className="chat-header">
        <div className="chat-header-left">
          <div className="chat-logo">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round"
                d="M8.625 12a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H8.25m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H12m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0h-.375M21 12c0 4.556-4.03 8.25-9 8.25a9.764 9.764 0 01-2.555-.337A5.972 5.972 0 015.41 20.97a5.969 5.969 0 01-.474-.065 4.48 4.48 0 00.978-2.025c.09-.457-.133-.901-.467-1.226C3.93 16.178 3 14.189 3 12c0-4.556 4.03-8.25 9-8.25s9 3.694 9 8.25z" />
            </svg>
          </div>
          <div>
            <h1 className="chat-title">Real-Time Chat</h1>
            <p className="chat-subtitle">Experiment 8 — Socket.IO</p>
          </div>
        </div>
        <div className="chat-header-right">
          <StatusBadge status={status} />
          <div className="chat-user-badge" title={`Chatting as ${username}`}>
            <span className="chat-user-avatar">{username.charAt(0).toUpperCase()}</span>
            <span className="chat-user-name">{username}</span>
          </div>
        </div>
      </header>

      {/* ── Message List ───────────────────────────────────────────────── */}
      <div className="messages-container">
        {messages.length === 0 ? (
          <div className="messages-empty">
            <div className="empty-icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path strokeLinecap="round" strokeLinejoin="round"
                  d="M20.25 8.511c.884.284 1.5 1.128 1.5 2.097v4.286c0 1.136-.847 2.1-1.98 2.193-.34.027-.68.052-1.02.072v3.091l-3-3c-1.354 0-2.694-.055-4.02-.163a2.115 2.115 0 01-.825-.242m9.345-8.334a2.126 2.126 0 00-.476-.095 48.64 48.64 0 00-8.048 0c-1.131.094-1.976 1.057-1.976 2.192v4.286c0 .837.46 1.58 1.155 1.951m9.345-8.334V6.637c0-1.621-1.152-3.026-2.76-3.235A48.455 48.455 0 0011.25 3c-2.115 0-4.198.137-6.24.402-1.608.209-2.76 1.614-2.76 3.235v6.226c0 1.621 1.152 3.026 2.76 3.235.577.075 1.157.14 1.74.194V21l4.155-4.155" />
              </svg>
            </div>
            <p className="empty-title">No messages yet</p>
            <p className="empty-hint">Open this page in another tab and start chatting!</p>
          </div>
        ) : (
          messages.map((msg) => (
            <Message
              key={msg.id}
              msg={msg}
              // A message is "own" if it originated from this socket session
              isOwn={msg.socketId === socketRef.current?.id}
            />
          ))
        )}
        {/* Invisible anchor for auto-scroll */}
        <div ref={messagesEndRef} />
      </div>

      {/* ── Input Area ─────────────────────────────────────────────────── */}
      <div className="input-area">
        <input
          ref={inputRef}
          type="text"
          className="message-input"
          placeholder={
            status === 'connected'
              ? 'Type a message… (Enter to send)'
              : 'Waiting for connection…'
          }
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          onKeyDown={handleKeyDown}
          disabled={status !== 'connected'}
          maxLength={500}
        />
        <button
          className="send-btn"
          onClick={sendMessage}
          disabled={status !== 'connected' || !inputText.trim()}
          title="Send message (Enter)"
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path strokeLinecap="round" strokeLinejoin="round"
              d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5" />
          </svg>
        </button>
      </div>
    </div>
  );
}

// ── Root Component ────────────────────────────────────────────────────────────
export default function App() {
  const [username, setUsername] = useState(null);

  // Show join screen until a username is chosen
  if (!username) {
    return <JoinScreen onJoin={setUsername} />;
  }

  return <ChatScreen username={username} />;
}
