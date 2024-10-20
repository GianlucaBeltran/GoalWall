import express from "express";
import { v4 as uuidv4 } from "uuid";
import fs from "fs";
import path from "path";
import { readFile } from "../models/readData";
import {
  commentFilePath,
  goalFilePath,
  usersFilePath,
} from "../constants/filePaths";

import { writeData } from "../models/insertData";
import { IUser, User, Users } from "../models/users";
import { Goals, IGoal } from "../models/goals";
import { Comments, IComment } from "../models/comments";

const userRoutes = express.Router();

userRoutes.post("/", async (req, res) => {
  const userFromRequest: { firstName: string; lastName: string } = req.body;
  console.log("Recieved user ", userFromRequest, " from app");

  const userJson = await readFile<Record<string, IUser>>(usersFilePath);

  const usersObject = new Users(userJson);

  const user = usersObject.findUserByNames(
    userFromRequest.firstName,
    userFromRequest.lastName
  );
  console.log(user ? "User already exists" : "New user");

  if (user) {
    const goalsJson = await readFile<Record<string, IGoal>>(goalFilePath);
    const commentsJson = await readFile<Record<string, IComment>>(
      commentFilePath
    );
    const goalsObject = new Goals(goalsJson);
    const commentsObject = new Comments(commentsJson);

    const userGoals = goalsObject.findGoalsByAuthorId(user.getUid());
    for (const goal of userGoals) {
      goal.setCommentsObjects(
        commentsObject.findCommentsByGoalId(goal.getGoalId())
      );
    }

    user.setGoalsObjects(userGoals);

    res.send({ user });
    return;
  }

  const newUser = new User({
    uid: uuidv4(),
    userNumber: usersObject.getLength() + 1,
    name: userFromRequest.firstName,
    lastName: userFromRequest.lastName,
    avatarFileName: "",
    commentsIds: [],
    goalsIds: [],
    reactions: [],
    chatsIds: [],
  });

  usersObject.addUser(newUser);

  await writeData(usersFilePath, usersObject.users);

  newUser.setGoalsObjects([]);

  res.send({ user: newUser });
});

userRoutes.get("/background/:fileName", (req, res) => {
  const fileName = req.params.fileName;

  console.log("Sending background to app");

  res.sendFile(path.resolve("src/assets/images/background/" + fileName));
});

userRoutes.get("/avatar/:fileName", (req, res) => {
  const fileName = req.params.fileName;

  console.log("Sending avatar to app");

  res.sendFile(path.resolve("src/assets/images/avatars/" + fileName));
});

userRoutes.get("/avatars", async (req, res) => {
  const userJson = await readFile<Record<string, IUser>>(usersFilePath);
  const usersObject = new Users(userJson);

  const usedAvatars = usersObject.getUsedAvatars();

  const files = fs.readdirSync(path.resolve("src/assets/images/avatars"));
  const filteredFiles = files.filter((file) => !usedAvatars.has(file));
  filteredFiles.sort(
    (a, b) =>
      Number(a.split(".")[0].split("avatar")[1]) -
      Number(b.split(".")[0].split("avatar")[1])
  );

  console.log("Sending avatars to app", filteredFiles.length);
  res.send({ images: filteredFiles });
});

userRoutes.get("/:id", async (req, res) => {
  const userIdFromRequest: string = req.params.id;
  console.log("Recieved user id ", userIdFromRequest, " from app");

  const userJson = await readFile<Record<string, IUser>>(usersFilePath);

  const usersObject = new Users(userJson);

  const user = usersObject.findUserByUid(userIdFromRequest);
  console.log(user ? "User found" : "User not found");

  if (user) {
    res.send({ user });
  } else {
    res.send({
      message: "User not found",
    });
  }
});

userRoutes.post("/setAvatar/:userId", async (req, res) => {
  const userIdFromRequest: string = req.params.userId;
  const avatarFileName: string = req.body.avatarFileName;
  console.log(
    "Recieved avatar file name ",
    avatarFileName,
    " from app for user with id ",
    userIdFromRequest
  );

  const userJson = await readFile<Record<string, IUser>>(usersFilePath);
  const goalsJson = await readFile<Record<string, IGoal>>(goalFilePath);
  const goalsObject = new Goals(goalsJson);

  const usersObject = new Users(userJson);

  const userFromData = usersObject.findUserByUid(userIdFromRequest);
  console.log(userFromData ? "User found" : "User not found");

  if (!userFromData) {
    res.send({
      message: "User not found",
    });
    return;
  }

  userFromData.setAvatarFileName(avatarFileName);

  await writeData(usersFilePath, usersObject.users);

  userFromData.setGoalsObjects(
    goalsObject.findGoalsByAuthorId(userFromData.getUid())
  );

  res.send({
    user: userFromData,
  });
  console.log("Avatar set");
});

export default userRoutes;
