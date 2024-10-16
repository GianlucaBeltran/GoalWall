import express from "express";
import {
  User,
  Goal,
  Comment,
  Reaction,
  Chat,
  DirectMessage,
} from "./models/api.types";
import {
  checkIfGoalExists,
  findChatById,
  findPostById,
  findUser,
  findUserWithId,
  getAllGoals,
  readFile,
} from "./models/readData";
import {
  acceptChatRequest,
  insertMessage,
  insertNewChat,
  removeReaction,
  setReaction,
  writeData,
} from "./models/insertData";
import { goalFilePath } from "./constants/filePaths";
import { v4 as uuidv4 } from "uuid";
import { Server } from "socket.io";
import { createServer } from "http";
import userRoutes from "./routes/userRoutes";
import goalRoutes from "./routes/goalRoutes";
import commentRoutes from "./routes/commentRoutes";
import reactionRoutes from "./routes/reactionRoutes";
import messageRoutes from "./routes/messageRoutes";

const app = express();
app.use(express.json());

const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: "*",
  },
});

const port = 3000;

io.on("connection", (socket) => {
  console.log("a user connected");
  socket.data = { userId: socket.handshake.auth.userId };
  socket.join(socket.handshake.auth.userId);
  console.log("User joined room", socket.handshake.auth.userId);

  socket.on("messageRequest", async (chat: { chat: Chat }) => {
    const userJson = await readFile<{ users: User[] }>(goalFilePath);

    await insertNewChat(userJson.users, chat.chat);
    const otherUser =
      chat.chat.users[0].userId === chat.chat.creatorId
        ? chat.chat.users[1]
        : chat.chat.users[0];
    console.log("Emitting message request to ", otherUser);
    socket.emit("message", chat.chat);
    io.to(otherUser.userId).emit("messageRequestRecieved", chat.chat);
    io.emit("fetchChats");
  });

  socket.on(
    "messageRequestAccepted",
    async ({ chatId, message }: { chatId: string; message: DirectMessage }) => {
      const userJson = await readFile<{ users: User[] }>(goalFilePath);
      console.log("messageRequestAccepted", chatId, message);
      const chat = await acceptChatRequest(userJson.users, chatId, message);
      console.log("Emitting message request accepted to ", chat);
      io.to(chat.creatorId).emit("messageRequestAccepted", chat);
      io.emit("fetchChats");
    }
  );

  socket.on(
    "message",
    async ({ chatId, message }: { chatId: string; message: DirectMessage }) => {
      const userJson = await readFile<{ users: User[] }>(goalFilePath);
      console.log("message", chatId, message);
      const chat = await insertMessage(userJson.users, chatId, message);
      const otherUser = chat.users.find(
        (user) => user.userId !== chat.creatorId
      );
      console.log(
        "Emitting message to ",
        otherUser.userId,
        " and ",
        chat.creatorId
      );
      io.to([chat.creatorId, otherUser.userId]).emit("message", chat);
      io.emit("fetchChats");
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
app.use("/message", messageRoutes);

httpServer.listen(port, () => {
  return console.log(`Express is listening at http://localhost:${port}`);
});
