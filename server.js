import { createServer } from "http";
import next from "next";
import { Server } from "socket.io";

const dev = process.env.NODE_ENV !== "production";
const hostname = "localhost";
const port = 3000;

const app = next({ dev, hostname, port });
const handle = app.getRequestHandler();

app.prepare().then(() => {
  const server = createServer((req, res) => {
    handle(req, res);
  });

  const io = new Server(server);

  io.on("connection", (socket) => {
    console.log("a socket.id connected", socket.id);

    // Handle Joining Room
    socket.on("join_room", (roomId) => {
      socket.join(roomId);
      console.log(`User ${socket.id} joined room ${roomId}`);
    });

    // Handle Room Message
    socket.on("send_room_message", ({ roomId, message }) => {
      io.to(roomId).emit("room_message", message);
    });

    // Handle Messages
    socket.on("send_message", (message) => {
      console.log("Received message:", message);
      io.emit("message", message);
    });

    socket.on("disconnect", () => {
      console.log("socket.id disconnected");
    });
  });

  server.listen(port, () => {
    console.log(`> Ready on http://${hostname}:${port}`);
  });
});
