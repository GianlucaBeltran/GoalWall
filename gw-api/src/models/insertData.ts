import fs from "fs";
import { Reaction, User } from "./api.types";
import { goalFilePath } from "../constants/filePaths";
import { findUserWithId } from "./readData";

export async function writeData<T>(fileName: string, data: T) {
  const dataString = JSON.stringify(data);
  fs.writeFile(fileName, dataString, "utf8", (err) => {
    if (err) {
      console.log("Error writing data: ", err);
    } else {
      console.log("Data written successfully!");
    }
  });
}

async function insertReaction(
  users: User[],
  reaction: Reaction
): Promise<User[]> | null {
  const authorUser = findUserWithId(users, reaction.authorId);
  if (!authorUser) return null;
  const authorIndex = users.indexOf(authorUser);
  users[authorIndex].reactions.push(reaction);
  await writeData(goalFilePath, { users });
  return users;
}

export async function setReaction(
  users: User[],
  reaction: Reaction
): Promise<User[]> | null {
  for (let i = 0; i < users.length; i++) {
    for (let j = 0; j < users[i].goals.length; j++) {
      if (users[i].goals[j].id === reaction.postId) {
        users[i].goals[j].reactions.push(reaction);
        return insertReaction(users, reaction);
      }
      for (let k = 0; k < users[i].goals[j].comments.length; k++) {
        if (users[i].goals[j].comments[k].id === reaction.postId) {
          users[i].goals[j].comments[k].reactions.push(reaction);
          return insertReaction(users, reaction);
        }
      }
    }
  }
  return null;
}

export async function removeReaction(
  users: User[],
  reaction: Reaction
): Promise<User[]> | null {
  const authorUser = findUserWithId(users, reaction.authorId);
  if (!authorUser) return null;
  const authorIndex = users.indexOf(authorUser);
  const reactionIndex = users[authorIndex].reactions.findIndex(
    (r) =>
      r.authorId === reaction.authorId &&
      r.postId === reaction.postId &&
      r.type === reaction.type
  );

  console.log(
    "spliced reaction",
    users[authorIndex].reactions,
    "reaction",
    reaction,
    "reactionIndex",
    reactionIndex
  );

  const removedElement = users[authorIndex].reactions.splice(reactionIndex, 1);
  console.log("removedElement", removedElement);

  for (let i = 0; i < users.length; i++) {
    for (let j = 0; j < users[i].goals.length; j++) {
      if (users[i].goals[j].id === reaction.postId) {
        const reactionIndex = users[i].goals[j].reactions.findIndex(
          (r) =>
            r.authorId === reaction.authorId &&
            r.postId === reaction.postId &&
            r.type === reaction.type
        );
        users[i].goals[j].reactions.splice(reactionIndex, 1);
      }
      for (let k = 0; k < users[i].goals[j].comments.length; k++) {
        if (users[i].goals[j].comments[k].id === reaction.postId) {
          const reactionIndex = users[i].goals[j].comments[
            k
          ].reactions.findIndex(
            (r) =>
              r.authorId === reaction.authorId &&
              r.postId === reaction.postId &&
              r.type === reaction.type
          );
          users[i].goals[j].comments[k].reactions.splice(reactionIndex, 1);
        }
      }
    }
  }

  await writeData(goalFilePath, { users });
  return users;
}
