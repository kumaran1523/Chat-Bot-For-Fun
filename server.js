import express from "express";
import path from "path";
import dotenv from "dotenv";
import { fileURLToPath } from "url";
import http from "http";
import { Server } from "socket.io";
import formatmessage from "./utilities/messages.js";
import { userJoin } from "./utilities/users.js";
import { getCurrentUser } from "./utilities/users.js";
import { userLeave } from "./utilities/users.js";
import { getRoomUsers } from "./utilities/users.js";
dotenv.config();
const app = express();
// socket.io server
const httpServer = http.createServer(app);
const io = new Server(httpServer);
// path
const PORT = process.env.PORT;
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(express.static(path.join(__dirname, "public")));
app.use(express.json());

const botname = "Sara";
// websocket connection
io.on("connection", (socket) => {
  socket.on("joinRoom", ({ username, room }) => {
    const user = userJoin(socket.id, username, room);
    socket.join(user.room);

    // welcome message

    socket.emit("Message", formatmessage(botname, "Welcome To The Chat Room❤️✌️"));

    // broadcast message when a user connects
    socket.broadcast
      .to(user.room)
      .emit(
        "Message",
        formatmessage(
          botname,
          `${user.username} A New User Has Joined The Chat ✅`
        )
      );

    // send users and room info
    io.to(user.room).emit("roomUser", {
      room: user.room,
      users: getRoomUsers(user.room),
    });
  });

  // user disconnect
  socket.on("disconnect", () => {
    const user = userLeave(socket.id);
    if (user) {
      console.log(`${user.username} has left the chat`);
      io.to(user.room).emit(
        "Message",
        formatmessage(botname, `${user.username} has left the chat ❌`)
      );
      // send users and room info
      io.to(user.room).emit("roomUser", {
        room: user.room,
        users: getRoomUsers(user.room),
      });
    }
  });

  // listen for chat message
  socket.on("chatMessage", (msg) => {
    const user = getCurrentUser(socket.id);
    console.log(msg);
    io.to(user.room).emit("Message", formatmessage(user.username, msg));
  });
});

// port
httpServer.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
