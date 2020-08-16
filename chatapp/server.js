const path = require("path");
const http = require("http");
const express = require("express");
const socketio = require("socket.io");
const formatMessage = require("./utils/messages");
const {
  userJoin,
  getCurrentUser,
  userLeave,
  getRoomUsers,
  getCurrentUserByName,
} = require("./utils/users");
const { User, ChattingLog, closeDatabase } = require("./db/chat");

// DB ORM Init
const logger = new ChattingLog();
const UserDB = new User();

const MenQueue = [];
const WomenQueue = [];

const app = express();
const server = http.createServer(app);
const io = socketio(server);

io.eio.pingTimeout = 120000; // 2 minutes
io.eio.pingInterval = 5000; // 5 seconds

// Set static folder
app.use(express.static(path.join(__dirname, "public")));

const botName = "ChatCord Bot";

// Run when client connects
//image도 같이 받아야함.
io.on("connection", (socket) => {
  socket.emit("getSocketID", { socket_id: socket.id }); // id기반으로 user 탐색하기 위해 id전달
  socket.on("joinRoom", async ({ username, gender, image }) => {
    const imageTest = {
      fieldname: "imgFile",
      originalname: "스크린샷 2020-08-03 오후 11.45.09.png",
      encoding: "7bit",
      mimetype: "image/png",
      destination: "image/",
      filename: "75c44557b9d3f0508d6f518806bf61ed",
      path: "image/75c44557b9d3f0508d6f518806bf61ed",
      size: 237275,
    };
    const user = userJoin(socket.id, username, gender, imageTest, "LOBY");
    animal_type = await UserDB.insert(gender, username, imageTest);
    user.animal_type = animal_type;
    console.log(user);
    socket.join(user.room);

    // Welcome current user
    socket.emit("message", formatMessage(botName, "Welcome to ChatCord!"));

    // Broadcast when a user connects
    socket.broadcast
      .to(user.room)
      .emit(
        "message",
        formatMessage(botName, `${user.username} has joined the chat`)
      );

    // Send users and room info
    io.to(user.room).emit("roomUsers", {
      room: user.room,
      users: getRoomUsers(user.room),
    });
  });

  idx = 2;
  socket.on("matchRoom", ({ username, pre_id }) => {
    const user = getCurrentUser(pre_id); ///////////////////ID로 찾아야되나??
    user.id = socket.id;

    if (user.gender === "man") {
      //여자큐가 비어있다면 남자큐에 자신을  넣고 빈 방 생성
      if (WomenQueue.length === 0) {
        user.room = user.username;
        MenQueue.push(user.room);
        socket.join(user.room);
      } else {
        //큐가 비어있지 않다면 여자큐 poll, 그 방으로 join
        console.log(WomenQueue);
        user.room = WomenQueue.shift();
        socket.join(user.room);
      }
    } else if (user.gender === "woman") {
      //남자큐가 비어있다면 여자큐에 자신을 넣고 빈 방 생성
      if (MenQueue.length == 0) {
        user.room = user.username;
        WomenQueue.push(user.room);
        socket.join(user.room);
      } else {
        //큐가 비어있지 않다면 남자큐 poll, 그 방으로 join
        console.log(MenQueue);
        user.room = MenQueue.shift();
        socket.join(user.room);
      }
    }

    /*
    if (user.gender === "man") {
      user.room = "1"
      console.log("room change!", user)
    }
    else user.room = "2"

    console.log(user)
    socket.join(user.room);
    */

    console.log(user, username);

    // Welcome current user
    socket.emit("message", formatMessage(botName, "Welcome to ChatCord!"));

    // Broadcast when a user connects
    socket.broadcast
      .to(user.room)
      .emit(
        "message",
        formatMessage(botName, `${user.username} has joined the chat`)
      );

    // Send users and room info
    io.to(user.room).emit("roomUsers", {
      room: user.room,
      users: getRoomUsers(user.room),
    });
  });

  // Listen for chatMessage
  socket.on("chatMessage", (msg) => {
    const user = getCurrentUser(socket.id);
    // console.log(user.username, msg);
    logger.insert(user.username, msg); //* DB로 저장하는 로직이 필요
    io.to(user.room).emit("message", formatMessage(user.username, msg));
  });

  // Runs when client disconnects
  socket.on("disconnect", () => {
    const user = userLeave(socket.id);
    console.log("Disconnected!", socket.id, user);

    if (user) {
      const current_room = user.room;
      user.room = null;
      console.log("user left", current_room, user.room);
      io.to(current_room).emit(
        "message",
        formatMessage(botName, `${user.username} has left the chat`)
      );

      // Send users and room info
      io.to(current_room).emit("roomUsers", {
        room: current_room,
        users: getRoomUsers(current_room),
      });
    }
  });
});

const PORT = process.env.PORT || 3000;

server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
