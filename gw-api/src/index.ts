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

app.post("/user", async (req, res) => {
  const userFromRequest: { firstName: string; lastName: string } = req.body;
  console.log("Recieved user ", userFromRequest, " from app");

  const userJson = await readFile<{ users: User[] }>(goalFilePath);

  const userFromData = findUser(userJson.users, userFromRequest);
  console.log(userFromData ? "User already exists" : "New user");

  if (userFromData) {
    res.send({
      user: userFromData,
    });
    return;
  }

  const newUser: User = {
    uid: uuidv4(),
    userNumber: userJson.users.length + 1,
    name: userFromRequest.firstName,
    lastName: userFromRequest.lastName,
    avatarFileName: "",
    goals: [],
    reactions: [],
    chats: [],
  };

  userJson.users.push(newUser);

  await writeData(goalFilePath, userJson);

  res.send({
    user: newUser,
  });
});

app.get("/user/:id", async (req, res) => {
  const userIdFromRequest: string = req.params.id;
  console.log("Recieved user id ", userIdFromRequest, " from app");

  const userJson = await readFile<{ users: User[] }>(goalFilePath);

  const userFromData = findUserWithId(userJson.users, userIdFromRequest);
  console.log(userFromData ? "User found" : "User not found");

  if (userFromData) {
    res.send({
      user: userFromData,
    });
  } else {
    res.send({
      message: "User not found",
    });
  }
});

app.get("/messages/:userId", async (req, res) => {
  const userId: string = req.params.userId;
  console.log(
    "Recieved request for messages from app for user with id ",
    userId
  );

  const userJson = await readFile<{ users: User[] }>(goalFilePath);

  const userFromData = findUserWithId(userJson.users, userId);
  console.log(userFromData ? "User found" : "User not found");

  if (!userFromData) {
    res.send({
      message: "User not found",
    });
    return;
  }
  for (const chat of userFromData.chats) {
    for (const user of chat.users) {
      if (user.userId !== userId) {
        const otherUser = findUserWithId(userJson.users, user.userId);
        console.log(otherUser.name, otherUser.lastName, "otherUser");
        user.userName = otherUser.name;
        user.userLastName = otherUser.lastName;
        user.userAvatarFileName = otherUser.avatarFileName;
      } else {
        user.userName = userFromData.name;
        user.userLastName = userFromData.lastName;
        user.userAvatarFileName = userFromData.avatarFileName;
      }
    }
  }

  res.send({
    messages: userFromData.chats,
  });
  console.log("Messages sent");
});

app.post("/setAvatar/:userId", async (req, res) => {
  const userIdFromRequest: string = req.params.userId;
  const avatarFileName: string = req.body.avatarFileName;
  console.log(
    "Recieved avatar file name ",
    avatarFileName,
    " from app for user with id ",
    userIdFromRequest
  );

  const userJson = await readFile<{ users: User[] }>(goalFilePath);

  const userFromData = findUserWithId(userJson.users, userIdFromRequest);
  console.log(userFromData ? "User found" : "User not found");

  if (!userFromData) {
    res.send({
      message: "User not found",
    });
    return;
  }

  const userIndex = userJson.users.indexOf(userFromData);
  userFromData.avatarFileName = avatarFileName;
  userJson.users.splice(userIndex, 1, userFromData);

  await writeData(goalFilePath, userJson);

  res.send({
    user: userFromData,
  });
  console.log("Avatar set");
});

app.post("/goals", async (req, res) => {
  const userId: string = req.body.userId;
  console.log("Recieved request for goals from app for user with id ", userId);

  const userJson = await readFile<{ users: User[] }>(goalFilePath);

  const goals = getAllGoals(userId, userJson.users);
  console.log("Goals found ", goals);

  res.send({
    goals,
  });
  console.log("Goals sent");
});

app.post("/goal", async (req, res) => {
  const goal: Goal = req.body.goal;
  const shouldAddComment = Math.random() < 0.5;

  const userId: string = req.body.userId;
  const avatarFileName: string | undefined = req.body.avatarFileName;
  console.log("Recieved goal ", goal, " from app for user with id ", userId);

  const userJson = await readFile<{ users: User[] }>(goalFilePath);

  const userFromData = findUserWithId(userJson.users, userId);
  console.log(userFromData ? "User found" : "User not found");

  if (!userFromData) {
    res.send({
      message: "User not found",
    });
    return;
  }

  // if (shouldAddComment) {
  //   goal.comments.push({
  //     id: uuidv4(),
  //     avatarFileName: userJson.users[userJson.users.length - 1].avatarFileName,
  //     authorId: userJson.users[userJson.users.length - 1].uid,
  //     description: "Great goal!",
  //     createdAt: new Date().toISOString(),
  //     goalId: goal.id,
  //     reactions: [],
  //   });
  // }

  if (avatarFileName) {
    userFromData.avatarFileName = avatarFileName;
  }

  const existingGoal = checkIfGoalExists(userFromData, goal.id);
  console.log(
    existingGoal
      ? "Goal already exists replacing with incoming goal"
      : "New goal"
  );

  if (existingGoal) {
    const goalIndex = userFromData.goals.indexOf(existingGoal);
    const userIndex = userJson.users.indexOf(userFromData);

    userFromData.goals.splice(goalIndex, 1, goal);
    userJson.users.splice(userIndex, 1, userFromData);
  } else {
    const userIndex = userJson.users.indexOf(userFromData);
    goal.id = uuidv4();
    goal.authorId = userId;
    userFromData.goals.push(goal);

    userJson.users.splice(userIndex, 1, userFromData);
  }

  await writeData(goalFilePath, userJson);

  res.send({
    user: userFromData,
  });
});

app.delete("/goal", async (req, res) => {
  const goalId: string = req.body.goalId;
  const userId: string = req.body.userId;
  console.log(
    "Recieved goal id ",
    goalId,
    " from app for user with id ",
    userId
  );

  const userJson = await readFile<{ users: User[] }>(goalFilePath);

  const userFromData = findUserWithId(userJson.users, userId);
  console.log(userFromData ? "User found" : "User not found");

  if (!userFromData) {
    res.send({
      message: "User not found",
    });
    return;
  }

  const existingGoal = checkIfGoalExists(userFromData, goalId);
  console.log(existingGoal ? "Goal found" : "Goal not found");

  if (!existingGoal) {
    res.send({
      message: "Goal not found",
    });
    return;
  }

  const goalIndex = userFromData.goals.indexOf(existingGoal);
  const userIndex = userJson.users.indexOf(userFromData);
  userFromData.goals.splice(goalIndex, 1);
  userJson.users.splice(userIndex, 1, userFromData);

  await writeData(goalFilePath, userJson);
  console.log("Goal deleted");

  res.send({
    user: userFromData,
  });
});

app.get("/allGoals", async (req, res) => {
  console.log("Recieved request for all goals from app");

  const userJson = await readFile<{ users: User[] }>(goalFilePath);

  const allGoals = userJson.users.reduce((acc, user) => {
    return acc.concat(user.goals);
  }, [] as Goal[]);

  for (const goal of allGoals) {
    const goalAuthor = findUserWithId(userJson.users, goal.authorId);
    if (!goalAuthor) {
      continue;
    }
    goal.avatarFileName = goalAuthor.avatarFileName;
  }

  res.send({
    goals: allGoals,
  });
  console.log("All goals sent");
});

app.get("/comments/:userId/:goalId", async (req, res) => {
  const userId: string = req.params.userId;
  const goalId: string = req.params.goalId;
  console.log(
    "Recieved request for comments for goal id ",
    goalId,
    " from app for user with id ",
    userId
  );

  const userJson = await readFile<{ users: User[] }>(goalFilePath);

  const userFromData = findUserWithId(userJson.users, userId);
  console.log(userFromData ? "User found" : "User not found");

  if (!userFromData) {
    res.send({
      message: "User not found",
    });
    return;
  }

  const existingGoal = checkIfGoalExists(userFromData, goalId);
  console.log(existingGoal ? "Goal found" : "Goal not found");

  if (!existingGoal) {
    res.send({
      message: "Goal not found",
    });
    return;
  }

  const goalComments = existingGoal.comments;

  for (const comment of goalComments) {
    const commentAuthor = findUserWithId(userJson.users, comment.authorId);
    comment.avatarFileName = commentAuthor.avatarFileName;
  }
  console.log("Comments found ", goalComments);

  res.send({
    comments: existingGoal.comments,
  });
});

app.post("/comment", async (req, res) => {
  const comment: Comment = req.body.comment;
  const goalAuthorId: string = req.body.goalAuthorId;
  console.log("comment", req.body.comment);
  console.log(
    "Recieved comment ",
    comment,
    " from app for user with id ",
    goalAuthorId,
    " for goal id ",
    comment.goalId
  );

  const userJson = await readFile<{ users: User[] }>(goalFilePath);

  const goalAuthorUser = findUserWithId(userJson.users, goalAuthorId);
  console.log(
    goalAuthorUser ? "Goal author user found" : "Goal author user not found"
  );

  const commentAuthorUser = findUserWithId(userJson.users, comment.authorId);
  console.log(
    commentAuthorUser
      ? "Comment author user found"
      : "Comment author user not found"
  );

  if (!goalAuthorUser || !commentAuthorUser) {
    res.send({
      message: "User not found",
    });
    return;
  }

  const existingGoal = checkIfGoalExists(goalAuthorUser, comment.goalId);
  console.log(existingGoal ? "Goal found" : "Goal not found");

  if (!existingGoal) {
    res.send({
      message: "Goal not found",
    });
    return;
  }

  comment.id = uuidv4();
  comment.createdAt = new Date().toISOString();
  comment.avatarFileName = commentAuthorUser.avatarFileName;

  existingGoal.comments.push(comment);

  const goalIndex = goalAuthorUser.goals.indexOf(existingGoal);
  const userIndex = userJson.users.indexOf(goalAuthorUser);

  goalAuthorUser.goals.splice(goalIndex, 1, existingGoal);
  userJson.users.splice(userIndex, 1, goalAuthorUser);

  await writeData(goalFilePath, userJson);

  res.send({
    goals: getAllGoals(comment.authorId, userJson.users),
  });
  console.log("Comment added");
});

app.post("/reaction", async (req, res) => {
  const reaction: Reaction = req.body.reaction;
  const userId: string = req.body.userId;
  const origin: "sharedGoals" | "othersGoals" = req.body.origin;
  console.log(
    "Recieved reaction ",
    reaction,
    " from app from user id " +
      reaction.authorId +
      " for post with id " +
      reaction.postId
  );

  let userJson = await readFile<{ users: User[] }>(goalFilePath);

  const updatedUsers = await setReaction(userJson.users, reaction);

  console.log("Reaction added", userId);

  res.send({
    goals:
      origin === "sharedGoals"
        ? findUserWithId(updatedUsers, userId).goals
        : getAllGoals(userId, updatedUsers),
  });
});

app.delete("/reaction", async (req, res) => {
  const reaction: Reaction = req.body.reaction;
  const userId: string = req.body.userId;
  const origin: "sharedGoals" | "othersGoals" = req.body.origin;
  console.log(
    "Recieved reaction",
    reaction,
    " to delete, from app from user id " +
      reaction.authorId +
      " for post with id " +
      reaction.postId
  );

  let userJson = await readFile<{ users: User[] }>(goalFilePath);

  const updatedUsers = await removeReaction(userJson.users, reaction);

  console.log("Reaction removed", userId);

  res.send({
    goals:
      origin === "sharedGoals"
        ? findUserWithId(updatedUsers, userId).goals
        : getAllGoals(userId, updatedUsers),
  });
});

httpServer.listen(port, () => {
  return console.log(`Express is listening at http://localhost:${port}`);
});
