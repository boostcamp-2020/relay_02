const chatForm = document.getElementById("chat-form");
const chatMessages = document.querySelector(".chat-messages");
const roomName = document.getElementById("room-name");
const userList = document.getElementById("users");

// Get username and room from URL
// const { username, gender, user_image ,room } = Qs.parse(location.search, {
const { username, gender, room, pre_id } = Qs.parse(location.search, {
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
  // socket.emit('joinRoom', { username, gender, user_image, room });
  socket.emit("joinRoom", { username, gender, room });
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

// Add users to DOM
function outputUsers(users) {
  /*
  var badgeURL = "";
  switch (users.animal_tyle) {
    case "bear":
      badgeURL = `<img src="https://i.ibb.co/6bPt8gC/bear.png" alt="bear" border="0"></img>`;
      break;
    case "cat":
      badgeURL = `<img src="https://i.ibb.co/x1cPfWZ/cat.png" alt="cat" border="0"></img>`;
    break;
  case "catfish":
    badgeURL = `<img src="https://i.ibb.co/6vKYfdM/catfish.png" alt="catfish" border="0"></img>`;
    break;
  case "chipmunk":
    badgeURL = `<img src="https://i.ibb.co/RQTNDkC/chipmunk.png" alt="chipmunk" border="0"></img>`;
    break;
  case "dinosaur":
    badgeURL = `<img src="https://i.ibb.co/bHZtQs5/dinosaur.png" alt="dinosaur" border="0"></img>`;
    break;
  case "dog":
    badgeURL = `<img src="https://i.ibb.co/9hD0cFy/dog.png" alt="dog" border="0"></img>`;
    break;
  case "fox":
    badgeURL = `<img src="https://i.ibb.co/m01JXsS/fox.png" alt="fox" border="0"></img>`;
    break;
  case "goldfish":
    badgeURL = `<img src="https://i.ibb.co/GJ0DD1n/goldfish.png" alt="goldfish" border="0"></img>`;
    break;
  case "rabbit":
    badgeURL = `<img src="https://i.ibb.co/m487pXd/rabbit.png" alt="rabbit" border="0"></img>`;
    break;
  case "tiger":
    badgeURL = `<img src="https://i.ibb.co/dpYXtbW/tiger.png" alt="tiger" border="0"></img>`;
    break;
}
  */
  //userList.innerHTML = `
  // ${users.map(user => `<li><a href="#"><img src=${user.user_image} ${badgeURL} />${user.username}/a></li>`).join('')}
  //`;
  userList.innerHTML = `
    ${users.map((user) => `<li>${user.username}</li>`).join("")}
  `;
}
