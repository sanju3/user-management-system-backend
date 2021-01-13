import express from "express";
import { UserModel, tempRandomData } from "./../models/UserModel";
import bcrypt from "bcrypt";
import randomstring from "randomstring";
import { SendMail } from "./../mail";
import mongoose, { CallbackError, Query } from "mongoose";
import jwt from "jsonwebtoken";

const UserRouter = express.Router();

interface Users {
  [index: number]: User;
}
interface User extends mongoose.Document {
  _id: string;
  username: string;
  firstname: string;
  lastname: string;
  status: boolean;
  password: string;
}

interface TempDataAll {
  [index: number]: TempData;
}
interface TempData extends mongoose.Document {
  _id: string;
  username: string;
  random: string;
}

UserRouter.post("/login", (req, res) => {
  UserModel.find(
    { username: req.body.username },
    async (err: CallbackError, users: Users) => {
      if (err) {
        res.status(500).json(`CallbackError : ${err}`);
      } else if (users[0]) {
        if (users[0].status) {
          await bcrypt.compare(
            req.body.password,
            users[0].password,
            (err, result) => {
              if (err) {
                res.status(401).json("Invalid password!");
              } else if (result) {
                const token = jwt.sign(
                  {
                    username: users[0].username,
                    firstname: users[0].firstname,
                    lastname: users[0].lastname,
                  },
                  "key",
                  { expiresIn: "1h" }
                );
                res.status(200).json({ token, user: users[0] });
              } else {
                res.status(401).json("Invalid password!");
              }
            }
          );
        } else {
          res.status(403).json(`User Not Activated`);
        }
      } else {
        res.status(404).json(`User Not Found`);
      }
    }
  );
});

UserRouter.get("/verify/:username/:random", (req, res) => {
  UserModel.find(
    { username: req.params.username },
    (err: CallbackError, users: Users) => {
      if (err) {
        res.json(`Error when finding ${req.params.username}: ${err}`);
      } else if (users[0]) {
        if (!users[0].status) {
          tempRandomData.find(
            { username: req.params.username },
            (err: CallbackError, temp: TempDataAll) => {
              if (err) {
                res.json(`Error when finding random data: ${err}`);
              } else if (temp) {
                if (temp[0].random === req.params.random) {
                  users[0].status = true;
                  users[0].save((err) => {
                    if (err) {
                      res.json("error occured!");
                    } else {
                      tempRandomData.deleteOne(
                        { username: temp[0].username },
                        undefined,
                        (err: mongoose.CallbackError) => {
                          if (!err) {
                            res.json("Successfuly activated!");
                          } else {
                            res.json("error occured!");
                          }
                        }
                      );
                    }
                  });
                } else {
                  res.json(`Code missmatch!`);
                }
              } else {
                res.json(`nothing found`);
              }
            }
          );
        } else {
          res.json(`User already activated`);
        }
      } else {
        res.json("cannot find user");
      }
    }
  );
});

UserRouter.post("/register", async (req, res) => {
  const username = req.body.username;
  const firstname = req.body.firstname;
  const lastname = req.body.lastname;
  const pwd = req.body.password;
  const status = false;
  const random = randomstring.generate();
  await bcrypt.hash(pwd, 10, function (err, password) {
    if (!err) {
      UserModel.findOne(
        { username: username },
        (err: mongoose.CallbackError, doc: mongoose.Document) => {
          if (doc) {
            res.status(403).json("Username already exists");
          } else {
            const newUser = new UserModel({
              username,
              firstname,
              lastname,
              password,
              status,
            });
            const randomData = new tempRandomData({ username, random });

            newUser.save((err) => {
              if (err) {
                res.status(403).json("Username already exists");
              } else {
                randomData.save((err) => {
                  if (err) {
                    res.status(500).json("Save Error");
                  } else {
                    const url =
                      "Click the confirmation url ===>  http://localhost:3000/confirm/" +
                      username +
                      "/" +
                      random;
                    const sm = SendMail(username, url);
                    if (sm) {
                      res
                        .status(200)
                        .json(`Verification Mail Sended to: ${username}`);
                    } else {
                      res.status(500).json("Email Error");
                    }
                  }
                });
              }
            });
          }
        }
      );
    } else {
      res.status(500).json("Server Error");
    }
  });
});

UserRouter.post("/getsingle", (req, res) => {
  UserModel.find(
    { username: req.body.username },
    (err: CallbackError, users: Users) => {
      if (err) {
        res.status(500).json(`CallbackError : ${err}`);
      } else if (users[0]) {
        if (users[0].status) {
          res.status(200).json(users[0]);
        } else {
          res.status(500).json(`User Not Activated`);
        }
      } else {
        res.status(500).json(`User Not Found`);
      }
    }
  );
});

UserRouter.post("/getrandom", (req, res) => {
  UserModel.find(
    { username: req.body.username },
    (err: CallbackError, users: Users) => {
      if (err) {
        res.status(500).json(`CallbackError : ${err}`);
      } else if (users[0]) {
        const random = randomstring.generate();
        if (users[0].status) {
          const url = "Confirmation string ===> " + random;
          const sm = SendMail(req.body.username, url);
          if (sm) {
            res.status(200).json({ random: random });
          } else {
            res.status(500).json("Email Error");
          }
        } else {
          res.status(500).json(`User Not Activated`);
        }
      } else {
        res.status(500).json(`User Not Found`);
      }
    }
  );
});

UserRouter.post("/setpassword", async (req, res) => {
  await bcrypt.hash(req.body.password, 10, function (err, password) {
    if (!err) {
      UserModel.find(
        { username: req.body.username },
        (err: CallbackError, doc: Users) => {
          if (err) {
            res.status(500).json("err");
          } else {
            doc[0].password = password;
            doc[0].save((err) => {
              if (err) {
                res.status(500).json("error occured");
              } else {
                res.status(200).json("success!");
              }
            });
          }
        }
      );
    } else {
      res.status(500).json("error occured");
    }
  });
});

export default UserRouter;
