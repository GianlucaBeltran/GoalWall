import express from "express";
import { User } from "./models/user.types";
import fs from "fs";
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
              userId: usersJsonData.users[i].uid,
            });
            return;
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
              res.send({
                message:
                  "User" + user.name + " " + user.lastName + " was created!",
                userId: user.uid,
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
  res.send({ message: req.body.message + "!!!!" });
});

app.listen(port, () => {
  return console.log(`Express is listening at http://localhost:${port}`);
});
