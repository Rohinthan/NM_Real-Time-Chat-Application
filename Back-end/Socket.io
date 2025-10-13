io.on("connection", (socket) => {
  console.log(" User Connected:", socket.id);

  // Load chat history
  Message.find().sort({ time: 1 }).then((messages) => {
    socket.emit("loadMessages", messages);
  });
