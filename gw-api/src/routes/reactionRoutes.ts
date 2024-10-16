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
  Goals,
  IComment,
  IGoal,
  IReaction,
  IUser,
  Reaction,
  User,
  Users,
} from "../models/user";
import { writeData } from "../models/insertData";

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

  // const updatedUsers = await removeReaction(userJson.users, reaction);

  // console.log("Reaction removed", userId);

  // res.send({
  //   goals:
  //     origin === "sharedGoals"
  //       ? findUserWithId(updatedUsers, userId).goals
  //       : getAllGoals(userId, updatedUsers),
  // });
});

// userRoutes.post("/", async (req, res) => {
//   const userFromRequest: { firstName: string; lastName: string } = req.body;
//   console.log("Recieved user ", userFromRequest, " from app");

//   const userJson = await readFile<Record<string, IUser>>(usersFilePath);
//   console.log("Read users from file", userJson);

//   const usersObject = new Users(userJson);

//   console.log("Users object", usersObject);

//   // const userFromData = findUser(userJson.users, userFromRequest);

//   const user = usersObject.findUserByNames(
//     userFromRequest.firstName,
//     userFromRequest.lastName
//   );
//   console.log(user ? "User already exists" : "New user");

//   if (user) {
//     const goalsJson = await readFile<Record<string, IGoal>>(goalFilePath);
//     const commentsJson = await readFile<Record<string, IComment>>(
//       commentFilePath
//     );
//     const goalsObject = new Goals(goalsJson);
//     const commentsObject = new Comments(commentsJson);

//     const userGoals = goalsObject.findGoalsByAuthorId(user.getUid());
//     for (const goal of userGoals) {
//       goal.setCommentsObjects(
//         commentsObject.findCommentsByGoalId(goal.getGoalId())
//       );
//     }

//     user.setGoalsObjects(userGoals);

//     res.send({ user });
//     return;
//   }

//   const newUser = new User({
//     uid: uuidv4(),
//     userNumber: usersObject.getLength() + 1,
//     name: userFromRequest.firstName,
//     lastName: userFromRequest.lastName,
//     avatarFileName: "",
//     commentsIds: [],
//     goalsIds: [],
//     reactions: [],
//     chats: [],
//   });

//   usersObject.addUser(newUser);

//   await writeData(usersFilePath, usersObject.users);

//   res.send({ user: newUser });
// });

// userRoutes.get("/:id", async (req, res) => {
//   const userIdFromRequest: string = req.params.id;
//   console.log("Recieved user id ", userIdFromRequest, " from app");

//   const userJson = await readFile<Record<string, IUser>>(usersFilePath);

//   const usersObject = new Users(userJson);

//   const user = usersObject.findUserByUid(userIdFromRequest);
//   console.log(user ? "User found" : "User not found");

//   if (user) {
//     res.send({ user });
//   } else {
//     res.send({
//       message: "User not found",
//     });
//   }
// });

// userRoutes.post("/setAvatar/:userId", async (req, res) => {
//   const userIdFromRequest: string = req.params.userId;
//   const avatarFileName: string = req.body.avatarFileName;
//   console.log(
//     "Recieved avatar file name ",
//     avatarFileName,
//     " from app for user with id ",
//     userIdFromRequest
//   );

//   const userJson = await readFile<Record<string, IUser>>(usersFilePath);
//   console.log("Read users from file", userJson);
//   const goalsJson = await readFile<Record<string, IGoal>>(goalFilePath);
//   const goalsObject = new Goals(goalsJson);

//   const usersObject = new Users(userJson);
//   console.log("Users object", usersObject);

//   const userFromData = usersObject.findUserByUid(userIdFromRequest);
//   console.log(userFromData ? "User found" : "User not found");

//   if (!userFromData) {
//     res.send({
//       message: "User not found",
//     });
//     return;
//   }

//   userFromData.setAvatarFileName(avatarFileName);

//   await writeData(usersFilePath, usersObject.users);

//   userFromData.setGoalsObjects(
//     goalsObject.findGoalsByAuthorId(userFromData.getUid())
//   );

//   res.send({
//     user: userFromData,
//   });
//   console.log("Avatar set");
// });

export default reactionRoutes;
