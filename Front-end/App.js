import React, { useState, useEffect } from 'react';
import io from 'socket.io-client';

const socket = io('http://localhost:5000'); // Backend address

function App() {
  const [username, setUsername] = useState('');
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);
  const [loggedIn, setLoggedIn] = useState(false);

  const handleLogin = () => {
    if (username.trim()) {
      socket.emit('join', username);
      setLoggedIn(true);
    }
  };

  const sendMessage = () => {
    if (message.trim()) {
      const msg = { user: username, text: message };
      socket.emit('sendMessage', msg);
      setMessage('');
    }
  };

  useEffect(() => {
    socket.on('message', (msg) => {
      setMessages((prev) => [...prev, msg]);
    });
    return () => socket.off('message');
  }, []);

  if (!loggedIn) {
    return (
      <div style={{ textAlign: 'center', marginTop: '50px' }}>
        <h2>Real-Time Chat Login</h2>
        <input
          type="text"
          placeholder="Enter username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <button onClick={handleLogin}>Join Chat</button>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: 500, margin: 'auto', padding: 20 }}>
      <h3>Welcome, {username}</h3>
      <div
        style={{
          border: '1px solid #ccc',
          height: 300,
          overflowY: 'scroll',
          padding: 10,
          marginBottom: 10,
        }}
      >
        {messages.map((msg, i) => (
          <div key={i}>
            <strong>{msg.user}:</strong> {msg.text}
          </div>
        ))}
      </div>
      <input
        type="text"
        placeholder="Type message..."
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        style={{ width: '80%', padding: 5 }}
      />
      <button onClick={sendMessage} style={{ width: '18%' }}>
        Send
      </button>
    </div>
  );
}

export default App;
