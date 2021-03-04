const Room = require("../database").Room;

const generateRoom = async (message, reciever, sender) => {
  try {
    const messageToAdd = await stringifyMessages({
      text: message,
      createdAt: new Date(),
      sender: sender,
    });

    const newRoom = await Room.create({
      roomName: `user${reciever}&user${sender}`,
      messages: [messageToAdd],
      users: [reciever, sender],
    });
    return newRoom;
  } catch (error) {
    console.log(error);
  }
};

const findRoom = async (reciever, sender) => {
  try {
    const room = await Room.findOne({
      where: { roomName: `user${reciever}&user${sender}` },
    });
    if (room) {
      return room;
    } else {
      return undefined;
    }
  } catch (error) {
    console.log(error);
  }
};

const addMessage = async (messageArray, message, receiver, sender) => {
  try {
    const messageToAdd = await stringifyMessages({
      text: message,
      createdAt: new Date(),
      sender: sender,
    });
    await messageArray.push(messageToAdd);
    const updatedRoom = await Room.update(
      { messages: messageArray },
      { where: { roomName: `user${receiver}&user${sender}` } }
    );
    return updatedRoom;
  } catch (error) {
    console.log(error);
  }
};

const getAllUserChats = async (userId) => {
  try {
    const allRooms = await Room.findAll();
    const userRooms = await allRooms.filter((room) =>
      room.roomName.split("&").indexOf(`user${userId}` > 0)
    );
    if (userRooms) {
      let allChats = [];
      await userRooms.forEach(async (room) => {
        const chat = {};
        let parsedMessages = await parseMessages(room.messages);
        room.roomName.split("&").forEach((user) => {
          if (user.split("user")[1] !== userId.toString()) {
            chat.withUserId = user.split("user")[1];
          }
        });
        chat.messageHistory = parsedMessages;
        allChats.push(chat);
        console.log(parsedMessages);
      });
      console.log(allChats);
      return allChats;
    } else {
      return undefined;
    }
  } catch (error) {
    console.log(error);
  }
};

const stringifyMessages = async (messages) => {
  const messageString = await JSON.stringify(messages);
  return messageString;
};

const parseMessages = async (messages) => {
  console.log(messages);
  const messageArray = [];
  messages.forEach(async (message) => {
    const messageObj = await JSON.parse(message);
    messageArray.push(messageObj);
  });
  console.log(messageArray);
  return messageArray;
};

module.exports = { generateRoom, findRoom, addMessage, getAllUserChats };
