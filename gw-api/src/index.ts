import express from "express";
import { User } from "./models/user.types";
import { Goal } from "./models/goal.types";
import {
  checkIfGoalExists,
  findUser,
  findUserWithId,
  readFile,
} from "./models/readData";
import { writeData } from "./models/insertData";
import { goalFilePath } from "./constants/filePaths";

const app = express();
app.use(express.json());

const port = 3000;

app.post("/user", async (req, res) => {
  const userFromRequest: User = req.body;
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

  const newUser = {
    ...userFromRequest,
    uid: (userJson.users.length + 1).toString(),
    goals: [],
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
  }
});

app.post("/goal", async (req, res) => {
  const goal: Goal = req.body.goal;
  const userId: string = req.body.userId;
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

app.listen(port, () => {
  return console.log(`Express is listening at http://localhost:${port}`);
});
