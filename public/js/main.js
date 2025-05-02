const Chatform = document.getElementById("chat-form");
const chatmessages = document.querySelector(".chat-messages");
const roomname = document.getElementById("room-name");
const userlist = document.getElementById("users");
const { username, room } = Qs.parse(location.search, {
  ignoreQueryPrefix: true,
});
const socket = io();

// join chatroom
socket.emit("joinRoom", { username, room });

// get room and users
socket.on("roomUser", ({ room, users }) => {
  outputRoomName(room);
  outputUsers(users);
});

socket.on("Message", (message) => {
  console.log(message);
  printmessage(message);
  // scroll to bottom
  chatmessages.scrollTop = chatmessages.scrollHeight;
});

Chatform.addEventListener("submit", (e) => {
  e.preventDefault();
  const msg = e.target.elements.msg.value;
  console.log(msg);
  // emit message to server
  socket.emit("chatMessage", msg);
  e.target.elements.msg.value = "";
  e.target.elements.msg.focus();
});

function printmessage(message) {
  const div = document.createElement("div");
  div.classList.add("message");
  div.innerHTML = `<p class="meta">${message.username}<span>${message.time}</span></p>
				   <p class="text">${message.text}</p>`;
  document.querySelector(".chat-messages").appendChild(div);
}

// room name and users
function outputRoomName(room) {
  roomname.innerText = room;
}

function outputUsers(users) {
  userlist.innerHTML = `${users.map((user) => `<li>${user.username}</li>`).join("")}`;
}
