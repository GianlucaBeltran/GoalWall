import fs from "fs/promises";
import { Goal, User } from "./api.types";

export async function readFile<T>(fileName: string): Promise<T | null> {
  try {
    const data = await fs.readFile(fileName, "utf8");
    return JSON.parse(data);
  } catch (err) {
    console.log("Error reading data: ", err);
    return null;
  }
}

export function findUser(
  users: User[],
  user: { firstName: string; lastName: string }
): User | null {
  for (let i = 0; i < users.length; i++) {
    if (
      users[i].name === user.firstName &&
      users[i].lastName === user.lastName
    ) {
      return users[i];
    }
  }
  return null;
}

export function findUserWithId(users: User[], id: string): User | null {
  for (let i = 0; i < users.length; i++) {
    if (users[i].uid === id) {
      return users[i];
    }
  }
  return null;
}

export function checkIfGoalExists(user: User, goalId: string): Goal | null {
  for (let i = 0; i < user.goals.length; i++) {
    if (user.goals[i].id === goalId) {
      return user.goals[i];
    }
  }
  return null;
}

export function getAllGoals(userId: string, users: User[]): Goal[] {
  const goals: Goal[] = [];
  for (let i = 0; i < users.length; i++) {
    if (users[i].uid !== userId) {
      for (let j = 0; j < users[i].goals.length; j++) {
        const goal = users[i].goals[j];
        goal.avatarFileName = users[i].avatarFileName;
        goal.authorId = users[i].uid;
        goals.push(users[i].goals[j]);
      }
    }
  }
  return goals;
}

export function findPostById(authorId: string, postId: string, users: User[]) {
  const goals = getAllGoals(authorId, users);

  for (let i = 0; i < goals.length; i++) {
    if (goals[i].id === postId) {
      return goals[i];
    }
    for (let j = 0; j < goals[i].comments?.length; j++) {
      if (goals[i].comments[j].id === postId) {
        return goals[i].comments[j];
      }
    }
  }
  return null;
}
