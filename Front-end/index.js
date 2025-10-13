// ============================================
// IBM-NJ Realtime Chat Application (Combined)
// Single File Version - app.js
// ============================================

const express = require("express");
const http = require("http");
const socketIo = require("socket.io");
const mongoose = require("mongoose");
const cors = require("cors");
const path = require("path");

// App setup
const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  cors: { origin: "*", methods: ["GET", "POST"] },
});

app.use(express.json());
app.use(cors());

// ----------------------------
// MongoDB Connection
// ----------------------------
mongoose
  .connect("mongodb://127.0.0.1:27017/ibmnjchat", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("✅ MongoDB Connected"))
  .catch((err) => console.log("❌ DB Error:", err));

// ----------------------------
// Message Schema
// ----------------------------
const messageSchema = new mongoose.Schema({
  username: String,
  text: String,
  time: { type: Date, default: Date.now },
});
const Message = mongoose.model("Message", messageSchema);

// ----------------------------
// Serve Frontend HTML Directly
// ----------------------------
app.get("/", (req, res) => {
  res.send(`
  <!DOCTYPE html>
  <html lang="en">
  <head>
    <meta charset="UTF-8" />
    <title>IBM-NJ Realtime Chat Application</title>
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css">
    <style>
      body { background: #f5f6fa; font-family: Arial; }
      .chat-container { max-width: 600px; margin: 50px auto; background: white; border-radius: 10px; padding: 20px; box-shadow: 0 0 10px rgba(0,0,0,0.1); }
      .messages { height: 400px; overflow-y: auto; border: 1px solid #ddd; border-radius: 5px; padding: 10px; margin-bottom: 10px; background: #fdfdfd; }
      .msg { margin: 8px 0; }
      .msg span { font-weight: bold; color: #007bff; }
    </style>
  </head>
  <body>
    <div class="chat-container">
      <h3 class="text-center mb-3">💬 IBM-NJ Realtime Chat Application</h3>
      <div class="messages" id="messages"></div>
      <div class="input-group mt-2">
        <input id="username" type="text" class="form-control" placeholder="Enter your name">
        <input id="message" type="text" class="form-control" placeholder="Type your message">
        <button id="sendBtn" class="btn btn-primary">Send</button>
      </div>
    </div>

    <script src="https://cdn.socket.io/4.7.5/socket.io.min.js"></script>
    <script>
      const socket = io();

      const messagesDiv = document.getElementById("messages");
      const messageInput = document.getElementById("message");
      const usernameInput = document.getElementById("username");
      const sendBtn = document.getElementById("sendBtn");

      // Load previous messages
      socket.on("loadMessages", (messages) => {
        messages.forEach(addMessage);
      });

      // Listen for new messages
      socket.on("chatMessage", (msgData) => {
        addMessage(msgData);
      });

      // Send message
      sendBtn.addEventListener("click", () => {
        const username = usernameInput.value.trim();
        const text = messageInput.value.trim();

        if (username && text) {
          const msgData = { username, text, time: new Date() };
          socket.emit("chatMessage", msgData);
          messageInput.value = "";
        } else {
          alert("Please enter your name and message!");
        }
      });

      // Display message in chat box
      function addMessage({ username, text, time }) {
        const msgDiv = document.createElement("div");
        msgDiv.classList.add("msg");
        const formattedTime = new Date(time).toLocaleTimeString();
        msgDiv.innerHTML = \`<span>\${username}</span>: \${text} <small class="text-muted">(\${formattedTime})</small>\`;
        messagesDiv.appendChild(msgDiv);
        messagesDiv.scrollTop = messagesDiv.scrollHeight;
      }
    </script>
  </body>
  </html>
  `);
});

// ----------------------------
// Socket.io Real-time Logic
// ----------------------------
io.on("connection", (socket) => {
  console.log(" User Connected:", socket.id);

  // Load chat history
  Message.find().sort({ time: 1 }).then((messages) => {
    socket.emit("loadMessages", messages);
  });

  // When message received
  socket.on("chatMessage", async (msgData) => {
    const message = new Message(msgData);
    await message.save();
    io.emit("chatMessage", msgData); // broadcast to all users
  });

  // User disconnect
  socket.on("disconnect", () => {
    console.log(" User Disconnected:", socket.id);
  });
});

// ----------------------------
// Start Server
// ----------------------------
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(\`🚀 IBM-NJ Chat App running on http://localhost:\${PORT}\`);
});
