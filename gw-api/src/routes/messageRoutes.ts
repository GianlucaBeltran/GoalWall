import express from "express";
import { v4 as uuidv4 } from "uuid";
import { chatFilePath, usersFilePath } from "../constants/filePaths";
import { Chats, IChat, IUser, Users } from "../models/user";
import { readFile } from "../models/readData";

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

  const userFromData = usersObject.findUserByUid(userId);

  console.log(userFromData ? "User found" : "User not found");

  if (!userFromData) {
    res.send({
      message: "User not found",
    });
    return;
  }

  for (const chat of userFromData.getChats()) {
    for (const user of chat.getUsers()) {
      if (user.userId !== userId) {
        const otherUser = usersObject.findUserByUid(user.userId);
        console.log(otherUser.getName(), otherUser.getLastName(), "otherUser");
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
    messages: userFromData.getChats(),
  });
  console.log("Messages sent");
});

export default messageRoutes;
