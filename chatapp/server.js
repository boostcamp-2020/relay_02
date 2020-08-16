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

// ------- 김혜지 추가부분 --------------
/**
 *
 */
app.use(express.json())
var multer = require('multer'); // express에 multer모듈 적용 (for 파일업로드)
var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'image/') // cb 콜백함수를 통해 전송된 파일 저장 디렉토리 설정
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname) // cb 콜백함수를 통해 전송된 파일 이름 설정
  }
})
var upload = multer({ storage: storage });

app.post('/joinRoom', upload.single('img_upload'), (req, res) => {
  // console.log(req.body) // [Object: null prototype] { username: 's', gender: 'man' }
  // console.log(req.file)
  // console.log(req.file.path)
  const user_image = req.file.path
  res.redirect(`/chat.html?username=${req.body.username}&gender=${req.body.gender}&user_image=${user_image}&animal_type=${req.body.animal_type}`)
})

// Run when client connects
// image도 같이 받아야함.
idx = 0; //임시 사용 나중에);삭제
io.on("connection", (socket) => {
  socket.emit("getSocketID", { socket_id: socket.id }); // socketid기반으로 user 탐색하기 위해 id전달
  socket.on("joinRoom", ({ username, gender, animal_type, user_image_path }) => { ///user_image(이미지 경로)를 user 오브젝트에 저장해야함
    // const imageTest = {
    //   fieldname: "imgFile",
    //   originalname: "테스트용 임시 이미지파일.png",
    //   encoding: "7bit",
    //   mimetype: "image/png",
    //   destination: "image/",
    //   filename: "75c44557b9d3f0508d6f518806bf61ed",
    //   path: "image/75c44557b9d3f0508d6f518806bf61ed",
    //   size: 237275,
    // };
    console.log(user_image_path + " " + animal_type); // 제대로 들어왔는지 확인!
    const user = userJoin(socket.id, username, gender, user_image_path, animal_type, "LOBY");
    UserDB.insert(gender, username, user_image_path, animal_type);

    // animal_type test (테스트하고 지워야함)

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


  socket.on("matchRoom", ({ username, pre_id }) => {
    //chat.html에서 생성된 socket.id를 이용해서 사용
    const user = getCurrentUser(pre_id);
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

