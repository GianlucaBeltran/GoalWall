import fs from "fs/promises";
import { User } from "./user.types";
import { Goal } from "./goal.types";

export async function readFile<T>(fileName: string): Promise<T | null> {
  try {
    const data = await fs.readFile(fileName, "utf8");
    return JSON.parse(data);
  } catch (err) {
    console.log("Error reading data: ", err);
    return null;
  }
}

export function findUser(users: User[], user: User): User | null {
  for (let i = 0; i < users.length; i++) {
    if (users[i].name === user.name && users[i].lastName === user.lastName) {
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
