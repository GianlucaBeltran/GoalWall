import express from "express";
import { User } from "./models/user.types";
import fs from "fs";
import { Goal } from "./models/goal.types";
const app = express();
app.use(express.json());

const port = 3000;

app.get("/", (req, res) => {
  console.log("test");
  res.send({ message: "Hello World!" });
});

app.post("/user", (req, res) => {
  const user: User = req.body;
  console.log(user);

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
            res.send({
              status: "user already exists",
              message:
                "User " + user.name + " " + user.lastName + " already exists!",
              user: usersJsonData.users[i],
            });
            return;
          }
        }
        user.uid = usersJsonData.users.length + 1;
        user.goals = [];
        usersJsonData.users.push(user);

        var usersJson = JSON.stringify(usersJsonData);
        console.log(usersJson, "usersJson");

        fs.writeFile(
          "/Users/gianlucabeltran/KTH/1Sem/GoalWall/gw-api/src/data/users.json",
          usersJson,
          "utf8",
          (err) => {
            if (err) {
              console.log(err);
            } else {
              res.send({
                message:
                  "User" + user.name + " " + user.lastName + " was created!",
                user: usersJsonData.users[usersJsonData.users.length - 1],
              });
            }
          }
        ); // write it back
      }
    }
  );
});

app.get("/user/:id", (req, res) => {
  console.log(req.params, "params");
  fs.readFile(
    "/Users/gianlucabeltran/KTH/1Sem/GoalWall/gw-api/src/data/users.json",
    "utf8",
    function readFileCallback(err, data) {
      if (err) {
        console.log(err, "error");
      } else {
        var usersJsonData = JSON.parse(data);
        console.log(usersJsonData, "usersJsonData", req.params.id);
        for (let i = 0; i < usersJsonData.users.length; i++) {
          console.log(usersJsonData.users[i].uid, req.params.id);
          if (usersJsonData.users[i].uid == req.params.id) {
            console.log(usersJsonData.users[i]);
            res.send({
              status: "user found",
              user: usersJsonData.users[i],
            });
            console.log("User sent");
            return;
          }
        }
        res.send({
          status: "user not found",
          message: "User with id " + req.params.id + " was not found!",
        });
        console.log("User with id " + req.params.id + " was not found!");
      }
    }
  );
});

app.post("/goal", (req, res) => {
  console.log(req.body);
  const goal: Goal = req.body.goal;
  const userId = req.body.userId;

  fs.readFile(
    "/Users/gianlucabeltran/KTH/1Sem/GoalWall/gw-api/src/data/users.json",
    "utf8",
    function readFileCallback(err, data) {
      if (err) {
        console.log(err, "error");
      } else {
        var usersJsonData = JSON.parse(data);
        for (let i = 0; i < usersJsonData.users.length; i++) {
          if (usersJsonData.users[i].uid == userId) {
            usersJsonData.users[i].goals.push(goal);
            var usersJson = JSON.stringify(usersJsonData);
            fs.writeFile(
              "/Users/gianlucabeltran/KTH/1Sem/GoalWall/gw-api/src/data/users.json",
              usersJson,
              "utf8",
              (err) => {
                if (err) {
                  console.log(err);
                } else {
                  res.send({
                    message: "Goal was added to user with id " + userId,
                    user: usersJsonData.users[i],
                  });
                }
              }
            );
            return;
          }
        }
        res.send({
          status: "user not found",
          message: "User with id " + userId + " was not found!",
        });
      }
    }
  );
});

app.post("/goal/:userId/:goalId", (req, res) => {
  console.log(req.params, "params");
  fs.readFile(
    "/Users/gianlucabeltran/KTH/1Sem/GoalWall/gw-api/src/data/users.json",
    "utf8",
    function readFileCallback(err, data) {
      if (err) {
        console.log(err, "error");
      } else {
        var usersJsonData = JSON.parse(data);
        console.log(usersJsonData, "usersJsonData", req.params.userId);
        for (let i = 0; i < usersJsonData.users.length; i++) {
          console.log(usersJsonData.users[i].uid, req.params.userId);
          if (usersJsonData.users[i].uid == req.params.userId) {
            console.log(usersJsonData.users[i]);
            for (let j = 0; j < usersJsonData.users[i].goals.length; j++) {
              if (usersJsonData.users[i].goals[j].id == req.params.goalId) {
                usersJsonData.users[i].goals.splice(j, 1, req.body.goal);
                var usersJson = JSON.stringify(usersJsonData);
                fs.writeFile(
                  "/Users/gianlucabeltran/KTH/1Sem/GoalWall/gw-api/src/data/users.json",
                  usersJson,
                  "utf8",
                  (err) => {
                    if (err) {
                      console.log(err);
                    } else {
                      res.send({
                        message:
                          "Goal with id " +
                          req.params.goalId +
                          " was deleted from user with id " +
                          req.params.userId,
                        user: usersJsonData.users[i],
                      });
                    }
                  }
                );
                return;
              }
            }
            res.send({
              status: "goal not found",
              message:
                "Goal with id " +
                req.params.goalId +
                " was not found in user with id " +
                req.params.userId,
            });
            return;
          }
        }
        res.send({
          status: "user not found",
          message: "User with id " + req.params.userId + " was not found!",
        });
      }
    }
  );
});

app.listen(port, () => {
  return console.log(`Express is listening at http://localhost:${port}`);
});
