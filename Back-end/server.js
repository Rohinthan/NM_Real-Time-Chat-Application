// server.js
const express = require('express');
const http = require('http');
const cors = require('cors');
const { Server } = require('socket.io');

const app = express();
app.use(cors());
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST'],
  },
});

app.get('/', (req, res) => {
  res.send('✅ Chat Server is running...');
});

io.on('connection', (socket) => {
  console.log('User connected:', socket.id);

  socket.on('join', (username) => {
    socket.username = username;
    io.emit('message', { user: 'System', text: `${username} joined the chat.` });
  });

  socket.on('sendMessage', (msg) => {
    io.emit('message', msg);
  });

  socket.on('disconnect', () => {
    if (socket.username) {
      io.emit('message', { user: 'System', text: `${socket.username} left the chat.` });
    }
  });
});

server.listen(5000, () => {
  console.log('🚀 Backend running on http://localhost:5000');
});
