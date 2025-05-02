const users = [];

// join to user chatroom
export function userJoin(id, username, room) {
  const user = { id, username, room };
  users.push(user);
  return user;
}

export function getCurrentUser(id) {
  return users.find((user) => user.id === id);
}

// get room users names
export function userLeave(id) {
  const index = users.findIndex((user) => user.id === id);
  if (index !== -1) {
    return users.splice(index, 1)[0];
  }
}

export function getRoomUsers(room) {
  return users.filter((user) => user.room === room);
}
