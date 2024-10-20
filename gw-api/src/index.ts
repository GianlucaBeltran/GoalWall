import express from "express";
import { DirectMessage } from "./models/directMessage";
import { readFile } from "./models/readData";
import { writeData } from "./models/insertData";
import {
  chatFilePath,
  goalFilePath,
  usersFilePath,
} from "./constants/filePaths";
import { Server } from "socket.io";
import { createServer } from "http";
import userRoutes from "./routes/userRoutes";
import goalRoutes from "./routes/goalRoutes";
import commentRoutes from "./routes/commentRoutes";
import reactionRoutes from "./routes/reactionRoutes";
import messageRoutes from "./routes/messageRoutes";
import { IUser, Users } from "./models/users";
import { Goals, IGoal } from "./models/goals";
import { Chat, Chats, IChat } from "./models/chats";

const app = express();
app.use(express.json());

const httpServer = createServer(app);
export const io = new Server(httpServer, {
  cors: {
    origin: "*",
  },
});

const port = 3000;

io.on("connection", async (socket) => {
  console.log("a user connected");
  socket.data = { userId: socket.handshake.auth.userId };
  socket.join(socket.handshake.auth.userId);
  console.log("User joined room", socket.handshake.auth.userId);

  if (socket.data.userId === "goalWallScreen") {
    const userJson = await readFile<Record<string, IUser>>(usersFilePath);
    const goalsJson = await readFile<Record<string, IGoal>>(goalFilePath);
    const usersObject = new Users(userJson);
    const goalsObject = new Goals(goalsJson);

    socket.emit("goals", goalsObject.getGoalsArrayWithAvatar(usersObject));
  }

  socket.on(
    "messageRequest",
    async (chat: { chat: IChat; userId: string; recipientId: string }) => {
      const userJson = await readFile<Record<string, IUser>>(usersFilePath);
      const chatsJson = await readFile<Record<string, IChat>>(chatFilePath);

      const usersObject = new Users(userJson);
      const chatsObject = new Chats(chatsJson);

      const user = usersObject.findUserByUid(chat.userId);
      const recipientUser = usersObject.findUserByUid(chat.recipientId);

      const newChat = new Chat(chat.chat);

      chatsObject.addChat(newChat);
      user.addChat(newChat.getId());
      recipientUser.addChat(newChat.getId());

      await writeData(chatFilePath, chatsObject.getChats());
      await writeData(usersFilePath, usersObject.users);

      console.log("Emitting message request to ", recipientUser.getName());
      socket.emit("message", chat.chat);
      io.to(recipientUser.getUid()).emit("messageRequestRecieved", chat.chat);
      io.to([chat.userId, chat.recipientId]).emit("fetchChats");
    }
  );

  socket.on(
    "messageRequestAccepted",
    async ({
      chatId,
      message,
      userId,
      recipientId,
    }: {
      chatId: string;
      message: DirectMessage;
      userId: string;
      recipientId: string;
    }) => {
      const userJson = await readFile<Record<string, IUser>>(usersFilePath);
      const chatsJson = await readFile<Record<string, IChat>>(chatFilePath);

      const usersObject = new Users(userJson);
      const chatsObject = new Chats(chatsJson);

      const user = usersObject.findUserByUid(userId);
      const recipientUser = usersObject.findUserByUid(recipientId);

      const chat = chatsObject.findChatById(chatId);

      chat.setStatus("accepted");
      chat.addMessage(message);

      await writeData(chatFilePath, chatsObject.getChats());

      console.log("Emitting message request to ", recipientUser.getName());

      console.log("messageRequestAccepted", chatId, message);

      console.log("Emitting message request accepted to ", chat);
      socket.emit("message", chat);
      io.to(chat.getCreatorId()).emit("messageRequestAccepted", chat);
      io.to([userId, recipientId]).emit("fetchChats");
    }
  );

  socket.on(
    "message",
    async ({
      chatId,
      message,
      userId,
      recipientId,
    }: {
      chatId: string;
      message: DirectMessage;
      userId: string;
      recipientId: string;
    }) => {
      const chatsJson = await readFile<Record<string, IChat>>(chatFilePath);

      const chatsObject = new Chats(chatsJson);

      console.log("message", chatId, message);
      const chat = chatsObject.findChatById(chatId);

      chat.addMessage(message);

      await writeData(chatFilePath, chatsObject.getChats());

      console.log("Emitting message to ", recipientId, " and ", userId);
      io.to([userId, recipientId]).emit("message", chat);
      io.to([userId, recipientId]).emit("fetchChats");
    }
  );

  socket.on("disconnect", () => {
    console.log("user disconnected");
  });
});

app.use("/user", userRoutes);
app.use("/goal", goalRoutes);
app.use("/comment", commentRoutes);
app.use("/reaction", reactionRoutes);
app.use("/chat", messageRoutes);

httpServer.listen(port, () => {
  return console.log(`Express is listening at http://localhost:${port}`);
});
