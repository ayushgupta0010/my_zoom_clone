const app = require("express")();
const server = require("http").createServer(app);
const cors = require("cors");
const io = require("socket.io")(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});

app.use(cors());

io.on("connection", (socket) => {
  socket.on("join room", (roomId) => {
    socket.join(roomId);
    socket.broadcast.to(roomId).emit("new user", socket.id);
  });

  socket.on("sending signal", (payload) => {
    socket.broadcast.to(payload.roomToSignal).emit("user joined", {
      signal: payload.signal,
      callerId: payload.callerId,
    });
  });

  socket.on("returning signal", (payload) => {
    io.to(payload.callerId).emit("receiving returned signal", {
      signal: payload.signal,
      id: socket.id,
    });
  });

  socket.on("create message", (payload) => {
    io.to(payload.roomId).emit("new message", payload);
  });

  socket.on("disconnecting", () => {
    let socketRooms = Array.from(socket.rooms);
    let userId = socketRooms[0];
    let roomId = socketRooms[1];
    socket.to(roomId).emit("user disconnected", userId);
  });
});

server.listen(process.env.PORT || 5000);
