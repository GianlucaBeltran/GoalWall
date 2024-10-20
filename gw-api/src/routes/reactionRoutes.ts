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
import { IReaction } from "../models/reaction";
import { IUser, Users } from "../models/users";
import { Goals, IGoal } from "../models/goals";
import { Comments, IComment } from "../models/comments";

const reactionRoutes = express.Router();

reactionRoutes.post("/", async (req, res) => {
  const reaction: IReaction = req.body.reaction;
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

  const userJson = await readFile<Record<string, IUser>>(usersFilePath);
  const goalsJson = await readFile<Record<string, IGoal>>(goalFilePath);
  const commentsJson = await readFile<Record<string, IComment>>(
    commentFilePath
  );

  const usersObject = new Users(userJson);
  const goalsObject = new Goals(goalsJson);
  const commentsObject = new Comments(commentsJson);

  const user = usersObject.findUserByUid(userId);
  reaction.reactionId = uuidv4();

  console.log(user ? "User found" : "User not found");

  if (!user) {
    res.send({
      message: "User not found",
    });
    return;
  }

  user.addReaction(reaction);

  const goal = goalsObject.findGoalById(reaction.postId);

  if (origin === "sharedGoals") {
    const comment = commentsObject.findCommentById(reaction.postId);
    comment.addReaction(reaction);
    await writeData(commentFilePath, commentsObject.getComments());
    await writeData(usersFilePath, usersObject.users);

    const userGoals = goalsObject.findGoalsByAuthorId(userId);

    for (const goal of userGoals) {
      goal.setCommentsObjects(
        commentsObject.findCommentsByGoalId(goal.getGoalId())
      );
    }

    res.send({
      goals: userGoals,
    });
  } else {
    if (goal) {
      goal.addReaction(reaction);
      await writeData(goalFilePath, goalsObject.getGoals());
      await writeData(usersFilePath, usersObject.users);

      io.to("goalWallScreen").emit(
        "goals",
        goalsObject.getGoalsArrayWithAvatar(usersObject)
      );

      const unownedGoals = goalsObject.getUnownedGoals(userId);
      for (const goal of Object.values(unownedGoals)) {
        const goalAuthor = usersObject.findUserByUid(goal.getAuthorId());
        const goalComments = commentsObject.findCommentsByGoalId(
          goal.getGoalId()
        );

        goal.setCommentsObjects(goalComments);
        goal.setAvatarFileName(goalAuthor.getAvatarFileName());
      }
      res.send({
        goals: unownedGoals,
      });
      return;
    } else {
      const comment = commentsObject.findCommentById(reaction.postId);
      comment.addReaction(reaction);
      await writeData(commentFilePath, commentsObject.getComments());
      await writeData(usersFilePath, usersObject.users);

      const unownedGoals = goalsObject.getUnownedGoals(userId);
      for (const goal of Object.values(unownedGoals)) {
        const goalAuthor = usersObject.findUserByUid(goal.getAuthorId());
        const goalComments = commentsObject.findCommentsByGoalId(
          goal.getGoalId()
        );

        goal.setCommentsObjects(goalComments);
        goal.setAvatarFileName(goalAuthor.getAvatarFileName());
      }
      res.send({
        goals: unownedGoals,
      });
    }
  }
});

reactionRoutes.delete("/", async (req, res) => {
  const reaction: IReaction = req.body.reaction;
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

  const userJson = await readFile<Record<string, IUser>>(usersFilePath);
  const goalsJson = await readFile<Record<string, IGoal>>(goalFilePath);
  const commentsJson = await readFile<Record<string, IComment>>(
    commentFilePath
  );

  const usersObject = new Users(userJson);
  const goalsObject = new Goals(goalsJson);
  const commentsObject = new Comments(commentsJson);

  const user = usersObject.findUserByUid(userId);
  console.log(user ? "User found" : "User not found");

  if (!user) {
    res.send({
      message: "User not found",
    });
    return;
  }
  console.log("Reaction to remove", reaction);
  console.log("User reactions", user.getReactions());
  user.removeReaction(reaction);

  const goal = goalsObject.findGoalById(reaction.postId);

  if (origin === "sharedGoals") {
    const comment = commentsObject.findCommentById(reaction.postId);
    comment.removeReaction(reaction);
    console.log("Comment reactions", comment.getReactions());
    await writeData(commentFilePath, commentsObject.getComments());
    await writeData(usersFilePath, usersObject.users);

    const userGoals = goalsObject.findGoalsByAuthorId(userId);

    for (const goal of userGoals) {
      goal.setCommentsObjects(
        commentsObject.findCommentsByGoalId(goal.getGoalId())
      );
    }

    res.send({
      goals: userGoals,
    });
  } else {
    if (goal) {
      goal.removeReaction(reaction);
      await writeData(goalFilePath, goalsObject.getGoals());
      await writeData(usersFilePath, usersObject.users);

      io.to("goalWallScreen").emit(
        "goals",
        goalsObject.getGoalsArrayWithAvatar(usersObject)
      );

      const unownedGoals = goalsObject.getUnownedGoals(userId);
      for (const goal of Object.values(unownedGoals)) {
        const goalAuthor = usersObject.findUserByUid(goal.getAuthorId());
        const goalComments = commentsObject.findCommentsByGoalId(
          goal.getGoalId()
        );

        goal.setCommentsObjects(goalComments);
        goal.setAvatarFileName(goalAuthor.getAvatarFileName());
      }
      res.send({
        goals: unownedGoals,
      });
      return;
    } else {
      const comment = commentsObject.findCommentById(reaction.postId);
      comment.removeReaction(reaction);
      await writeData(commentFilePath, commentsObject.getComments());
      await writeData(usersFilePath, usersObject.users);

      const unownedGoals = goalsObject.getUnownedGoals(userId);
      for (const goal of Object.values(unownedGoals)) {
        const goalAuthor = usersObject.findUserByUid(goal.getAuthorId());
        const goalComments = commentsObject.findCommentsByGoalId(
          goal.getGoalId()
        );

        goal.setCommentsObjects(goalComments);
        goal.setAvatarFileName(goalAuthor.getAvatarFileName());
      }
      res.send({
        goals: unownedGoals,
      });
    }
  }
});

export default reactionRoutes;
