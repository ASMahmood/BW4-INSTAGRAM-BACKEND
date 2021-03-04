/** @format */

const io = require("./server.js");

const {
  VERIFY_USER,
  USER_CONNECTED,
  USER_DISCONNECTED,
  LOGOUT,
  COMMUNITY_CHAT,
  MESSAGE_RECIEVED,
  MESSAGE_SENT,
  TYPING,
  PRIVATE_MESSAGE,
  NOTIFICATION,
  LIST,
} = require("./socket/Events");

const { createMessage, createUser, createChat } = require("./socket/Factories");
const { generateRoom, findRoom, addMessage } = require("./socket/chatrooms");

let connectedUsers = [];

module.exports = function (socket) {
  console.log("Socket Id:" + socket.id);

  let sendMessageToChatFromUser;

  let sendTypingFromUser;

  //Verify Username
  socket.on(VERIFY_USER, (nickname, callback) => {
    if (isUser(connectedUsers, nickname)) {
      callback({ isUser: true, user: null });
    } else {
      callback({
        isUser: false,
        user: createUser({ userId: nickname, socketId: socket.id }),
      });
    }
  });

  socket.on(USER_CONNECTED, (user) => {
    user.socketId = socket.id;
    connectedUsers.push(user);
    socket.user = user;

    sendMessageToChatFromUser = sendMessageToChat(user.name);
    sendTypingFromUser = sendTypingToChat(user.name);

    io.emit(USER_CONNECTED, connectedUsers);
    console.log(connectedUsers);
  });

  //User logsout
  socket.on(LOGOUT, () => {
    connectedUsers = connectedUsers.filter(
      (user) => user.userId !== socket.userId
    );
    io.emit(USER_DISCONNECTED, connectedUsers);
    console.log("Disconnect", connectedUsers);
  });

  socket.on(MESSAGE_SENT, ({ chatId, message }) => {
    sendMessageToChatFromUser(chatId, message);
  });

  socket.on(TYPING, ({ chatId, isTyping }) => {
    sendTypingFromUser(chatId, isTyping);
  });

  socket.on(PRIVATE_MESSAGE, async (data) => {
    const Room = await findRoom(data.reciever, data.sender);
    if (Room !== undefined) {
      await addMessage(Room.messages, data.message, data.reciever, data.sender);
    } else {
      await generateRoom(data.message, data.reciever, data.sender);
    }
    if (connectedUsers.indexOf((user) => user.userId === data.reciever) < 0) {
      const recieverSocket = connectedUsers[data.reciever].socketId;
      socket.to(recieverSocket).emit(PRIVATE_MESSAGE, data);
    }
  });

  socket.on(NOTIFICATION, async (data) => {
    const user =
      connectedUsers[
        connectedUsers.indexOf((user) => user.userId === data.user)
      ];
    if (user) {
      socket.to(user).emit(NOTIFICATION, data);
    }
  });
};
/*
 * Returns a function that will take a chat id and a boolean isTyping
 * and then emit a broadcast to the chat id that the sender is typing
 * @param sender {string} username of sender
 * @return function(chatId, message)
 */
function sendTypingToChat(user) {
  return (chatId, isTyping) => {
    io.emit(`${TYPING}-${chatId}`, { user, isTyping });
  };
}

/*
 * Returns a function that will take a chat id and message
 * and then emit a broadcast to the chat id.
 * @param sender {string} username of sender
 * @return function(chatId, message)
 */
function sendMessageToChat(sender) {
  return (chatId, message) => {
    io.emit(
      `${MESSAGE_RECIEVED}-${chatId}`,
      createMessage({ message, sender })
    );
  };
}

/*
 * Checks if the user is in list passed in.
 * @param userList {Object} Object with key value pairs of Users
 * @param username {String}
 * @return userList {Object} Object with key value pairs of Users
 */
function isUser(userList, username) {
  return username in userList;
}
