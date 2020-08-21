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
} = require("./utils/users");
const { User, ChattingLog, closeDatabase } = require("./db/chat");

// DB ORM Init
const logger = new ChattingLog();
const UserDB = new User();

const MenQueue = [];
const WomenQueue = [];

// 매칭할 사람들에 대한 obj
const MatcherArr = [];

const app = express();
const server = http.createServer(app);
const io = socketio(server);

io.eio.pingTimeout = 120000; // 2 minutes
io.eio.pingInterval = 5000; // 5 seconds

// Set static folder
app.use(express.static(path.join(__dirname, "public")));

const botName = "ChatCord Bot";

// ------ user 정보 넘겨주고, 이미지 저장하는 부분 ---------
app.use(express.json())
var multer = require('multer'); // express에 multer모듈 적용 (for 파일업로드)
var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'public/image/') // cb 콜백함수를 통해 전송된 파일 저장 디렉토리 설정
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname) // cb 콜백함수를 통해 전송된 파일 이름 설정
  }
})
var upload = multer({ storage: storage });
app.post('/joinRoom', upload.single('user_image_path'), (req, res) => {
  const user_image_path = req.file.path.substring(6);
  res.redirect(`/chat.html?username=${req.body.username}&gender=${req.body.gender}&user_image_path=${user_image_path}&animal_type=${req.body.animal_type}`)
})
// -----------------------------------

// Run when client connects
io.on("connection", (socket) => {

  // socketid기반으로 user 탐색하기 위해 id전달
  socket.emit("getSocketID", { socket_id: socket.id });


  // LOBY 입장
  socket.on("joinRoom", ({ username, gender, animal_type, user_image_path }) => {
    const user = userJoin(socket.id, username, gender, user_image_path, animal_type, "LOBY");
    // UserDB.insert(gender, username, user_image_path, animal_type);
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


  socket.on("matchRoom", async ({ username, pre_id }) => {
    //chat.html에서 생성된 socket.id를 이용해서 사용
    const user = getCurrentUser(pre_id);
    console.log(user)

    if (!user) return; //?
    user.id = socket.id;

    // 일단 큐에 있는 사람 중 같은 타입을 찾는다.
    // 1. 현재 User, Type - target user -> DB
    // 2. DB에서 username 같은 행을 select  -> type -> matchuser
    const row = await UserDB.findByUserNicknameAsync(user.username);
    console.log(`User ${user.username} Type`, row);
    const userType = row["type"]
    console.log(`User ${user.username} Type`, userType)

    
    const targetMatchers = 
      (await Promise.all(MatcherArr.map(value => UserDB.findByUserNicknameAsync(value.username))))
        .filter(value => value.type === userType);
    
    // const targetMatchers = await MatcherArr.filter(async (matcher) => {
    //   const new_row = await UserDB.findByUserNicknameAsync(matcher.username);
    //   console.log(`macther ${matcher.username}`, new_row);
    //   return userType === new_row.type
    // });

    console.log(targetMatchers);

    if (targetMatchers.length === 0) {
      // 없으면 새로운 방을 만든다.
      user.room = user.username;
      console.log("새로운 방 생성!", user.username)
      console.log(user.room, user)
      MatcherArr.push(user);
      socket.join(user.room); // user.room undefined
    } else {
      console.log("기존 방 매칭!", user.username)
      const randomUser = targetMatchers.splice(Math.floor(Math.random() * targetMatchers.length), 1)[0] // get Random match user
      for (const index in MatcherArr) {
        if (MatcherArr[index].username === randomUser.username){
          MatcherArr.splice(index, 1)
          break;
        }
      }
      console.log(randomUser);
      user.room = randomUser.nickname //undefined
      socket.join(user.room);
    } 
    
    console.log(user, username);

    // Welcome current user
    socket.emit("message", formatMessage(botName, "Welcome to ChatCord!"));

    // Broadcast when a user connects
    socket.broadcast.to(user.room).emit("message", formatMessage(botName, `${user.username} has joined the chat`));
    // Send users and room info

    io.to(user.room).emit("roomUsers", {
      room: user.room,
      users: getRoomUsers(user.room),
    });


  });



  // Listen for chatMessage
  socket.on("chatMessage", (msg) => {
    const user = getCurrentUser(socket.id);
    logger.insert(user.username, msg); //* DB로 저장하는 로직이 필요
    io.to(user.room).emit("message", formatMessage(user.username, msg, user.user_image_path));
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

