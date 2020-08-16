const chatForm = document.getElementById("chat-form");
const chatMessages = document.querySelector(".chat-messages");
const roomName = document.getElementById("room-name");
const userList = document.getElementById("users");

// Get username and room from URL
const { username, gender, user_image_path, room, pre_id, animal_type } = Qs.parse(location.search, {
  // const { username, gender, room, pre_id } = Qs.parse(location.search, {
  ignoreQueryPrefix: true,
});

if (!username) {
  // redirect to login
}

const socket = io();

// Join chatroom
console.log(location.pathname);
console.log("match!");
if (location.pathname === "/Match.html") {
  console.log("match!");
  socket.emit("matchRoom", { username, pre_id });
} else {
  const userNameInput = document.getElementById("username");
  userNameInput.value = username;
  socket.on("getSocketID", ({ socket_id }) => {
    const userSocketID = document.getElementById("socket_id");
    userSocketID.value = socket_id;
  });
  socket.emit('joinRoom', { username, gender, user_image_path, animal_type, room });
  // socket.emit("joinRoom", { username, gender, room });
}

// Get room and users
socket.on("roomUsers", ({ room, users }) => {
  outputRoomName(room);
  outputUsers(users);
});

// Message from server
socket.on("message", (message) => {
  console.log(message);
  outputMessage(message);

  // Scroll down
  chatMessages.scrollTop = chatMessages.scrollHeight;
});

// Message submit
chatForm.addEventListener("submit", (e) => {
  e.preventDefault();

  // Get message text
  const msg = e.target.elements.msg.value;

  // Emit message to server
  socket.emit("chatMessage", msg);

  // Clear input
  e.target.elements.msg.value = "";
  e.target.elements.msg.focus();
});

// Output message to DOM
function outputMessage(message) {
  const div = document.createElement("div");
  div.classList.add("message");
  div.innerHTML = `<p class="meta">${message.username} <span>${message.time}</span></p>
  <p class="text">
    ${message.text}
  </p>`;
  document.querySelector(".chat-messages").appendChild(div);
}

// Add room name to DOM
function outputRoomName(room) {
  roomName.innerText = room;
}

// Add users to DOM  + 뱃지 추가(2020/08/16)
function outputUsers(users) {
  var badgeURL = "";
  userList.innerHTML =
    users.map((user) => {
      switch (user.animal_type) {
        case "곰상":
          badgeURL = `<img src="https://i.ibb.co/6bPt8gC/bear.png" alt="bear" height="20" width="20" border="0"></img>`;
          break;
        case "고양이상":
          badgeURL = `<img src="https://i.ibb.co/x1cPfWZ/cat.png" alt="cat" height="20" width="20" border="0"></img>`;
          break;
        case "메기상":
          badgeURL = `<img src="https://i.ibb.co/6vKYfdM/catfish.png" alt="catfish" height="20" width="20" border="0"></img>`;
          break;
        case "다람쥐상":
          badgeURL = `<img src="https://i.ibb.co/RQTNDkC/chipmunk.png" alt="chipmunk" height="20" width="20" border="0"></img>`;
          break;
        case "공룡상":
          badgeURL = `<img src="https://i.ibb.co/bHZtQs5/dinosaur.png" alt="dinosaur" height="20" width="20" border="0"></img>`;
          break;
        case "강아지상":
          badgeURL = `<img src="https://i.ibb.co/9hD0cFy/dog.png" alt="dog" height="20" width="20" border="0"></img>`;
          break;
        case "여우상":
          badgeURL = `<img src="https://i.ibb.co/m01JXsS/fox.png" alt="fox" height="20" width="20" border="0"></img>`;
          break;
        case "금붕어상":
          badgeURL = `<img src="https://i.ibb.co/GJ0DD1n/goldfish.png" alt="goldfish" height="20" width="20" border="0"></img>`;
          break;
        case "토끼상":
          badgeURL = `<img src="https://i.ibb.co/m487pXd/rabbit.png" alt="rabbit" height="20" width="20" border="0"></img>`;
          break;
        case "호랑이상":
          badgeURL = `<img src="https://i.ibb.co/dpYXtbW/tiger.png" alt="tiger" height="20" width="20" border="0"></img>`;
          break;
      }
      return `<li> ${badgeURL} ${user.username}</li>`;
    }).join('')
}
