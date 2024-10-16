import express from "express";
import { v4 as uuidv4 } from "uuid";
import { findUser, readFile } from "../models/readData";
import {
  commentFilePath,
  goalFilePath,
  usersFilePath,
} from "../constants/filePaths";
// import { User } from "../models/api.types";
import {
  Comments,
  Goal,
  Goals,
  IComment,
  IGoal,
  IUser,
  User,
  Users,
} from "../models/user";
import { writeData } from "../models/insertData";

const goalRoutes = express.Router();

goalRoutes.post("/", async (req, res) => {
  const goal: IGoal = req.body.goal;

  const userId: string = req.body.userId;
  const avatarFileName: string | undefined = req.body.avatarFileName;
  console.log("Recieved goal ", goal, " from app for user with id ", userId);

  const userJson = await readFile<Record<string, IUser>>(usersFilePath);
  const goalJson = await readFile<Record<string, IGoal>>(goalFilePath);

  const usersObject = new Users(userJson);
  const goalsObject = new Goals(goalJson);
  const goalObject = new Goal(goal);

  const userFromData = usersObject.findUserByUid(userId);
  console.log(userFromData ? "User found" : "User not found");

  if (!userFromData) {
    res.send({
      message: "User not found",
    });
    return;
  }

  if (avatarFileName) {
    userFromData.setAvatarFileName(avatarFileName);
  }

  const goalExists = goalsObject.findGoalById(goalObject.getGoalId());

  console.log(
    goalExists ? "Goal already exists replacing with incoming goal" : "New goal"
  );

  if (goalExists) {
    goalsObject.replaceGoal(goalObject);
  } else {
    console.log("Adding new goal", goalObject);
    goalObject.setId(uuidv4());
    goalsObject.addGoal(goalObject);
    userFromData.addGoal(goalObject.getGoalId());
    await writeData(usersFilePath, usersObject.users);
  }

  await writeData(goalFilePath, goalsObject.getGoals());

  userFromData.setGoalsObjects(
    goalsObject.findGoalsByAuthorId(userFromData.getUid())
  );

  res.send({ user: userFromData });
});

goalRoutes.delete("/", async (req, res) => {
  const goalId: string = req.body.goalId;
  const userId: string = req.body.userId;
  console.log(
    "Recieved goal id ",
    goalId,
    " from app for user with id ",
    userId
  );

  const userJson = await readFile<Record<string, IUser>>(usersFilePath);
  const goalJson = await readFile<Record<string, IGoal>>(goalFilePath);

  const usersObject = new Users(userJson);
  const goalsObject = new Goals(goalJson);

  const userFromData = usersObject.findUserByUid(userId);
  console.log(userFromData ? "User found" : "User not found");

  if (!userFromData) {
    res.send({
      message: "User not found",
    });
    return;
  }

  const existingGoal = goalsObject.findGoalById(goalId);
  console.log(existingGoal ? "Goal found" : "Goal not found");

  if (!existingGoal) {
    res.send({
      message: "Goal not found",
    });
    return;
  }

  goalsObject.removeGoal(existingGoal);
  userFromData.removeGoal(existingGoal.getGoalId());

  await writeData(goalFilePath, goalsObject.getGoals());
  await writeData(usersFilePath, usersObject.users);

  userFromData.setGoalsObjects(
    goalsObject.findGoalsByAuthorId(userFromData.getUid())
  );

  res.send({
    user: userFromData,
  });
});

goalRoutes.get("/sharedGoals/:id", async (req, res) => {
  console.log("Recieved request for shared goals from app");
  const userId: string = req.params.id;

  const userJson = await readFile<Record<string, IUser>>(usersFilePath);
  const goalJson = await readFile<Record<string, IGoal>>(goalFilePath);
  const commentsJson = await readFile<Record<string, IComment>>(
    commentFilePath
  );

  const usersObject = new Users(userJson);
  const goalsObject = new Goals(goalJson);
  const commentsObject = new Comments(commentsJson);

  const unownedGoals = goalsObject.getUnownedGoals(userId);

  for (const goal of Object.values(unownedGoals)) {
    const goalAuthor = usersObject.findUserByUid(goal.getAuthorId());
    const goalComments = commentsObject.findCommentsByGoalId(goal.getGoalId());
    console.log("Goal comments found ", goalComments);
    goal.setCommentsObjects(goalComments);
    goal.setAvatarFileName(goalAuthor.getAvatarFileName());
  }

  console.log("Shared goals found ", unownedGoals);

  res.send({
    goals: unownedGoals,
  });
  console.log("Shared goals sent");
});

goalRoutes.get("/allGoals", async (req, res) => {
  console.log("Recieved request for all goals from app");

  const userJson = await readFile<Record<string, IUser>>(usersFilePath);
  const goalJson = await readFile<Record<string, IGoal>>(goalFilePath);

  const usersObject = new Users(userJson);
  const goalsObject = new Goals(goalJson);

  const allGoals = goalsObject.getGoals();

  for (const goal of Object.values(allGoals)) {
    const goalAuthor = usersObject.findUserByUid(goal.getAuthorId());
    goal.setAvatarFileName(goalAuthor.getAvatarFileName());
  }

  res.send({
    goals: goalsObject.getGoalsArray(),
  });
  console.log("All goals sent");
});

// goalRoutes.post("/myGoals", async (req, res) => {
//   const userId: string = req.body.userId;
//   console.log("Recieved request for goals from app for user with id ", userId);

//   const userJson = await readFile<Record<string, IUser>>(usersFilePath);
//   const goalsJson = await readFile<Record<string, IGoal>>(goalFilePath);

//   const usersObject = new Users(userJson);

//   const userFromData = usersObject.findUserByUid(userId);

//   const goals = userFromData ? userFromData.getGoals() : [];
//   console.log("Goals found ", goals);

//   res.send({
//     goals,
//   });
//   console.log("Goals sent");
// });

export default goalRoutes;
