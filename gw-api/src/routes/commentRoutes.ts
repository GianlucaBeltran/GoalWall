import express from "express";
import { v4 as uuidv4 } from "uuid";
import { readFile } from "../models/readData";
import {
  commentFilePath,
  goalFilePath,
  usersFilePath,
} from "../constants/filePaths";
import { writeData } from "../models/insertData";
import { Comments, Comment, IComment } from "../models/comments";
import { IUser, Users } from "../models/users";
import { Goals, IGoal } from "../models/goals";

const commentRoutes = express.Router();

commentRoutes.post("/", async (req, res) => {
  const comment: IComment = req.body.comment;
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

  const userJson = await readFile<Record<string, IUser>>(usersFilePath);
  const goalsJson = await readFile<Record<string, IGoal>>(goalFilePath);
  const commentsJson = await readFile<Record<string, IComment>>(
    commentFilePath
  );

  const usersObject = new Users(userJson);
  const goalsObject = new Goals(goalsJson);
  const commentsObject = new Comments(commentsJson);

  const goalAuthorUser = usersObject.findUserByUid(goalAuthorId);
  console.log(
    goalAuthorUser ? "Goal author user found" : "Goal author user not found"
  );

  const commentAuthorUser = usersObject.findUserByUid(comment.authorId);
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

  const existingGoal = goalsObject.findGoalById(comment.goalId);
  console.log(existingGoal ? "Goal found" : "Goal not found");

  if (!existingGoal) {
    res.send({
      message: "Goal not found",
    });
    return;
  }

  const newComment = new Comment(comment);

  newComment.setId(uuidv4());

  commentsObject.addComment(newComment);
  existingGoal.addComment(newComment.getId());
  commentAuthorUser.addComment(newComment.getId());

  await writeData(commentFilePath, commentsObject.getComments());
  await writeData(goalFilePath, goalsObject.getGoals());
  await writeData(usersFilePath, usersObject.users);

  const unownedGoals = goalsObject.getUnownedGoals(commentAuthorUser.getUid());

  for (const goal of Object.values(unownedGoals)) {
    const goalAuthor = usersObject.findUserByUid(goal.getAuthorId());
    const goalComments = commentsObject.findCommentsByGoalId(goal.getGoalId());
    goal.setCommentsObjects(goalComments);
    goal.setAvatarFileName(goalAuthor.getAvatarFileName());
    console.log("Goal found ", goal);
  }

  console.log("Comment added", unownedGoals[0].getComments());

  res.send({
    goals: unownedGoals,
  });
  console.log("Comment added");
});

commentRoutes.get("/:userId/:goalId", async (req, res) => {
  const userId: string = req.params.userId;
  const goalId: string = req.params.goalId;
  console.log(
    "Recieved request for comments for goal id ",
    goalId,
    " from app for user with id ",
    userId
  );

  const userJson = await readFile<Record<string, IUser>>(usersFilePath);
  const goalsJson = await readFile<Record<string, IGoal>>(goalFilePath);
  const commentsJson = await readFile<Record<string, IComment>>(
    commentFilePath
  );

  const usersObject = new Users(userJson);
  const goalsObject = new Goals(goalsJson);
  const commentsObject = new Comments(commentsJson);

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

  const goalComments = commentsObject.findCommentsByGoalId(goalId);

  for (const comment of Object.values(goalComments)) {
    const commentAuthor = usersObject.findUserByUid(comment.getAuthorId());
    comment.setAvatarFileName(commentAuthor.getAvatarFileName());
  }

  existingGoal.setCommentsObjects(goalComments);

  res.send({
    comments: existingGoal.getComments(),
  });
});

export default commentRoutes;
