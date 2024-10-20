import express from "express";
import { v4 as uuidv4 } from "uuid";
import { readFile } from "../models/readData";
import {
  commentFilePath,
  goalFilePath,
  usersFilePath,
} from "../constants/filePaths";
// import { User } from "../models/api.types";
import { writeData } from "../models/insertData";
import { io } from "..";
import { Goal, Goals, IGoal } from "../models/goals";
import { IUser, Users } from "../models/users";
import { Comments, IComment } from "../models/comments";

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

  const goalExists = goalsObject.findGoalById(goal.id);

  console.log(
    goalExists ? "Goal already exists replacing with incoming goal" : "New goal"
  );

  if (goalExists) {
    const commentsJson = await readFile<Record<string, IComment>>(
      commentFilePath
    );
    const commentsObject = new Comments(commentsJson);
    const goalComments = commentsObject.findCommentsByGoalId(goal.id);

    goalsObject.replaceGoal(
      new Goal({
        id: goal.id,
        authorId: goal.authorId,
        description: goal.description,
        createdAt: goal.createdAt,
        updatedAt: goal.updatedAt,
        categories: goal.categories,
        commentsIds: goalComments.map((comment) => comment.getId()),
        avatarFileName: goal.avatarFileName,
        reactions: goal.reactions,
      })
    );
    await writeData(goalFilePath, goalsObject.getGoals());

    io.to("goalWallScreen").emit(
      "goals",
      goalsObject.getGoalsArrayWithAvatar(usersObject)
    );

    for (const goal of goalsObject.getGoalsArray()) {
      goal.setCommentsObjects(
        commentsObject.findCommentsByGoalId(goal.getGoalId())
      );
    }
    userFromData.setGoalsObjects(
      goalsObject.findGoalsByAuthorId(userFromData.getUid())
    );

    res.send({ user: userFromData });
    return;
  } else {
    const goalObject = new Goal({
      id: uuidv4(),
      authorId: goal.authorId,
      description: goal.description,
      createdAt: goal.createdAt,
      updatedAt: goal.updatedAt,
      categories: goal.categories,
      commentsIds: [],
      avatarFileName: goal.avatarFileName,
      reactions: goal.reactions,
    });
    console.log("Adding new goal", goalObject);
    goalsObject.addGoal(goalObject);
    userFromData.addGoal(goalObject.getGoalId());
    await writeData(usersFilePath, usersObject.users);
  }

  await writeData(goalFilePath, goalsObject.getGoals());
  io.to("goalWallScreen").emit(
    "goals",
    goalsObject.getGoalsArrayWithAvatar(usersObject)
  );

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
  for (const user of usersObject.getUsersArray()) {
    user.removeActionsRelatedToPost(existingGoal.getGoalId());
  }

  if (existingGoal.getCommentsIds().length > 0) {
    console.log(
      "Removing comments for goal ",
      existingGoal.getGoalId(),
      existingGoal.getComments()
    );
    const commentsJson = await readFile<Record<string, IComment>>(
      commentFilePath
    );
    const commentsObject = new Comments(commentsJson);

    for (const comment of existingGoal.getCommentsIds()) {
      commentsObject.removeComment(comment);
      for (const user of usersObject.getUsersArray()) {
        user.removeActionsRelatedToPost(comment);
      }
    }

    await writeData(commentFilePath, commentsObject.getComments());
  }

  await writeData(goalFilePath, goalsObject.getGoals());
  await writeData(usersFilePath, usersObject.users);

  io.to("goalWallScreen").emit(
    "goals",
    goalsObject.getGoalsArrayWithAvatar(usersObject)
  );

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

export default goalRoutes;
