import express from "express";
import { v4 as uuidv4 } from "uuid";
import { chatFilePath, usersFilePath } from "../constants/filePaths";
import { readFile } from "../models/readData";
import { writeData } from "../models/insertData";
import { IUser, Users } from "../models/users";
import { Chat, ChatData, Chats, IChat } from "../models/chats";

const messageRoutes = express.Router();

messageRoutes.get("/:userId", async (req, res) => {
  const userId: string = req.params.userId;
  console.log(
    "Recieved request for messages from app for user with id ",
    userId
  );

  const userJson = await readFile<Record<string, IUser>>(usersFilePath);
  const chatsJson = await readFile<Record<string, IChat>>(chatFilePath);

  const usersObject = new Users(userJson);
  const chatsObject = new Chats(chatsJson);

  console.log("userData");
  const userFromData = usersObject.findUserByUid(userId);

  console.log(userFromData ? "User found" : "User not found");

  if (!userFromData) {
    res.send({
      message: "User not found",
    });
    return;
  }
  console.log(chatsObject.getChats());
  const userChats = chatsObject.getChatsByUserId(userFromData.getUid());

  for (const chat of userChats) {
    for (const user of chat.getUsers()) {
      if (user.userId !== userId) {
        const otherUser = usersObject.findUserByUid(user.userId);
        user.userName = otherUser.getName();
        user.userLastName = otherUser.getLastName();
        user.userAvatarFileName = otherUser.getAvatarFileName();
      } else {
        user.userName = userFromData.getName();
        user.userLastName = userFromData.getLastName();
        user.userAvatarFileName = userFromData.getAvatarFileName();
      }
    }
  }

  res.send({
    messages: userChats,
  });
  console.log("Messages sent");
});

messageRoutes.get("/:userId/:recipientId", async (req, res) => {
  const userId: string = req.params.userId;
  const recipientId: string = req.params.recipientId;
  console.log(
    "Recieved request for messages from app for user with id ",
    userId
  );

  const userJson = await readFile<Record<string, IUser>>(usersFilePath);
  const chatsJson = await readFile<Record<string, IChat>>(chatFilePath);

  const usersObject = new Users(userJson);
  const chatsObject = new Chats(chatsJson);

  const userFromData = usersObject.findUserByUid(userId);
  const recipientFromData = usersObject.findUserByUid(recipientId);

  console.log(
    userFromData && recipientFromData ? "User found" : "User not found"
  );

  if (!userFromData || !recipientFromData) {
    res.send({
      message: "User not found",
    });
    return;
  }
  const userChat = chatsObject.getChatByUsersIds(userId, recipientId);

  if (!userChat) {
    const newChat = new Chat({
      id: uuidv4(),
      creatorId: userId,
      users: [
        {
          userId,
          userName: userFromData.getName(),
          userLastName: userFromData.getLastName(),
          userAvatarFileName: userFromData.getAvatarFileName(),
        },
        {
          userId: recipientId,
          userName: recipientFromData.getName(),
          userLastName: recipientFromData.getLastName(),
          userAvatarFileName: recipientFromData.getAvatarFileName(),
        },
      ],
      messages: [],
      status: "new",
      createdAt: new Date().toISOString(),
    });

    const chatData: ChatData = {
      chat: newChat,
      otherUserId: recipientId,
      otherUserName: recipientFromData.getName(),
      otherUserLastName: recipientFromData.getLastName(),
      otherUserAvatar: recipientFromData.getAvatarFileName(),
    };

    res.send({
      chat: chatData,
      newChat: true,
    });
  } else {
    for (const user of userChat.getUsers()) {
      if (user.userId !== userId) {
        const otherUser = usersObject.findUserByUid(user.userId);
        user.userName = otherUser.getName();
        user.userLastName = otherUser.getLastName();
        user.userAvatarFileName = otherUser.getAvatarFileName();
      } else {
        user.userName = userFromData.getName();
        user.userLastName = userFromData.getLastName();
        user.userAvatarFileName = userFromData.getAvatarFileName();
      }
    }

    const chatData: ChatData = {
      chat: userChat,
      otherUserId: recipientId,
      otherUserName: recipientFromData.getName(),
      otherUserLastName: recipientFromData.getLastName(),
      otherUserAvatar: recipientFromData.getAvatarFileName(),
    };

    res.send({
      chat: chatData,
      newChat: false,
    });
  }
  console.log("Messages sent");
});

messageRoutes.post("/createChat", async (req, res) => {
  const userId: string = req.body.userId;
  const recipientId: string = req.body.recipientId;

  const userJson = await readFile<Record<string, IUser>>(usersFilePath);
  const chatsJson = await readFile<Record<string, IChat>>(chatFilePath);

  const usersObject = new Users(userJson);
  const chatsObject = new Chats(chatsJson);

  const user = usersObject.findUserByUid(userId);
  const recipientUser = usersObject.findUserByUid(recipientId);

  const chatExists = chatsObject.getChatByUsersIds(
    user.getUid(),
    recipientUser.getUid()
  );

  if (chatExists) {
    res.send({
      chat: chatExists,
    });
    return;
  }
  const newChat = new Chat({
    id: uuidv4(),
    creatorId: userId,
    users: [
      {
        userId,
        userName: user.getName(),
        userLastName: user.getLastName(),
        userAvatarFileName: user.getAvatarFileName(),
      },
      {
        userId: recipientId,
        userName: recipientUser.getName(),
        userLastName: recipientUser.getLastName(),
        userAvatarFileName: recipientUser.getAvatarFileName(),
      },
    ],
    messages: [],
    status: "new",
    createdAt: new Date().toISOString(),
  });

  chatsObject.addChat(newChat);
  user.addChat(newChat.getId());
  recipientUser.addChat(newChat.getId());

  await writeData(chatFilePath, chatsObject.getChats());
  await writeData(usersFilePath, usersObject.users);

  const chatData: ChatData = {
    chat: newChat,
    otherUserId: recipientId,
    otherUserName: recipientUser.getName(),
    otherUserLastName: recipientUser.getLastName(),
    otherUserAvatar: recipientUser.getAvatarFileName(),
  };

  res.send({
    chat: chatData,
  });
});

export default messageRoutes;
