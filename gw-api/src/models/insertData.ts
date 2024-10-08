import { Goal } from "./goal.types";
import { User } from "./user.types";
import fs from "fs";

export const createUser = (user: User) => {
  var uid = 0;
  fs.readFile(
    "/Users/gianlucabeltran/KTH/1Sem/GoalWall/gw-api/src/data/users.json",
    "utf8",
    function readFileCallback(err, data) {
      if (err) {
        console.log(err, "error");
      } else {
        var usersJsonData = JSON.parse(data);
        for (let i = 0; i < usersJsonData.users.length; i++) {
          if (
            usersJsonData.users[i].name === user.name &&
            usersJsonData.users[i].lastName === user.lastName
          ) {
            uid = usersJsonData.users[i].uid;
          }
        }
        user.uid = usersJsonData.users.length + 1;
        usersJsonData.users.push(user);

        var usersJson = JSON.stringify(usersJsonData);

        fs.writeFile(
          "/Users/gianlucabeltran/KTH/1Sem/GoalWall/gw-api/src/data/users.json",
          usersJson,
          "utf8",
          (err) => {
            if (err) {
              console.log(err);
            } else {
              uid = user.uid;
            }
          }
        ); // write it back
      }
    }
  );
  return uid;
};

export const updateUser = (id: number) => {
  console.log(id);
  return { message: "User with id " + id + " was updated!" };
};

export const createGoal = (goal: Goal) => {
  console.log(goal);
  return { message: goal.description + "!!!!" };
};

export const updateGoal = (id: number) => {
  console.log(id);
  return { message: "Goal with id " + id + " was updated!" };
};
