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

// app.get("/messages/:userId", async (req, res) => {
//   const userId: string = req.params.userId;
//   console.log(
//     "Recieved request for messages from app for user with id ",
//     userId
//   );

//   const userJson = await readFile<{ users: User[] }>(goalFilePath);

//   const userFromData = findUserWithId(userJson.users, userId);
//   console.log(userFromData ? "User found" : "User not found");

//   if (!userFromData) {
//     res.send({
//       message: "User not found",
//     });
//     return;
//   }
//   for (const chat of userFromData.chats) {
//     for (const user of chat.users) {
//       if (user.userId !== userId) {
//         const otherUser = findUserWithId(userJson.users, user.userId);
//         console.log(otherUser.name, otherUser.lastName, "otherUser");
//         user.userName = otherUser.name;
//         user.userLastName = otherUser.lastName;
//         user.userAvatarFileName = otherUser.avatarFileName;
//       } else {
//         user.userName = userFromData.name;
//         user.userLastName = userFromData.lastName;
//         user.userAvatarFileName = userFromData.avatarFileName;
//       }
//     }
//   }

//   res.send({
//     messages: userFromData.chats,
//   });
//   console.log("Messages sent");
// });

// app.delete("/reaction", async (req, res) => {
//   const reaction: Reaction = req.body.reaction;
//   const userId: string = req.body.userId;
//   const origin: "sharedGoals" | "othersGoals" = req.body.origin;
//   console.log(
//     "Recieved reaction",
//     reaction,
//     " to delete, from app from user id " +
//       reaction.authorId +
//       " for post with id " +
//       reaction.postId
//   );

//   let userJson = await readFile<{ users: User[] }>(goalFilePath);

//   const updatedUsers = await removeReaction(userJson.users, reaction);

//   console.log("Reaction removed", userId);

//   res.send({
//     goals:
//       origin === "sharedGoals"
//         ? findUserWithId(updatedUsers, userId).goals
//         : getAllGoals(userId, updatedUsers),
//   });
// });

httpServer.listen(port, () => {
  return console.log(`Express is listening at http://localhost:${port}`);
});
