const users = new Map();

function addUser(user) {
  users.set(user.id, user);
}

function getUser(userId) {
  return users.get(userId);
}

function updateUser(userId, updates) {
  const user = users.get(userId);
  if (user) {
    Object.assign(user, updates);
    users.set(userId, user);
  }
  return user;
}

function getAllUsers() {
  return Array.from(users.values());
}

function getUserByEmail(email) {
  return Array.from(users.values()).find(user => user.email === email);
}

module.exports = {
  addUser,
  getUser,
  updateUser,
  getAllUsers,
  getUserByEmail
};
