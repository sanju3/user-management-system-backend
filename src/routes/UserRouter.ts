import {
  createTempRandom,
  createToken,
  createUser,
  deleteTempData,
  getUserTemporyData,
  hashPassword,
  saveUser,
} from "./../services";
import express from "express";
import randomstring from "randomstring";
import { SendMail } from "./../mail";
import { compairPassword, getSingleUser } from "../services";

const UserRouter = express.Router();

UserRouter.post("/login", async (req, res) => {
  const user = await getSingleUser(req.body.username);
  if (!user) {
    res.status(404).json(`User Not Found`);
  } else {
    if (!user.status) {
      res.status(403).json(`User Not Activated`);
    } else {
      const isMatch = await compairPassword(req.body.password, user.password!);
      if (!isMatch) {
        res.status(401).json("Invalid password!");
      } else {
        const token = createToken(
          {
            username: user.username!,
            firstname: user.firstname!,
            lastname: user.lastname!,
          },
          "key",
          { expiresIn: "1h" }
        );
        res.status(200).json({ token, user });
      }
    }
  }
});

UserRouter.get("/verify/:username/:random", async (req, res) => {
  const user = await getSingleUser(req.params.username);
  if (!user) {
    res.status(400).send({ message: `User Not Found: ${req.params.username}` });
  } else {
    if (user.status) {
      res
        .status(400)
        .send({ message: `User Already Activated: ${req.params.username}` });
    } else {
      const userRandom = await getUserTemporyData(req.params.username);
      if (!userRandom) {
        res
          .status(400)
          .send({ message: `User Not Found: ${req.params.username}` });
      } else {
        if (userRandom.random === req.params.random) {
          user.status = true;
          const userStatus = await saveUser(user);
          if (!userStatus) {
            res.status(400).send({ message: `Server Error, Try Again!` });
          } else {
            await deleteTempData(user.username);
            res.status(200).send({
              message: `Successfully Activated: ${req.params.username}`,
            });
          }
        }
      }
    }
  }
});

UserRouter.post("/register", async (req, res) => {
  const username = req.body.username;
  const firstname = req.body.firstname;
  const lastname = req.body.lastname;
  const pwd = req.body.password;
  const status = false;
  const random = randomstring.generate();

  const user = await getSingleUser(username);
  if (user) {
    res.status(403).json("Username already exists");
  } else {
    const password = await hashPassword(pwd, 10);

    await createUser({
      username,
      firstname,
      lastname,
      password,
      status,
    });
    await createTempRandom({ username, random });
    const url =
      "Click the confirmation url ===>  http://localhost:3000/confirm/" +
      username +
      "/" +
      random;
    const sm = await SendMail(username, url);
    if (sm) {
      res.status(200).json(`Verification Mail Sended to: ${username}`);
    } else {
      res.status(500).json("Email Error");
    }
  }
});

UserRouter.post("/getsingle", async (req, res) => {
  const user = await getSingleUser(req.body.username);
  if (!user) {
    res.status(500).json(`User Not Found`);
  } else {
    if (!user.status) {
      res.status(500).json(`User Not Activated`);
    } else {
      res.status(200).json(user);
    }
  }
});

UserRouter.post("/getrandom", async (req, res) => {
  const user = await getSingleUser(req.body.username);
  if (!user) {
    res.status(500).json(`User Not Found`);
  } else {
    if (!user.status) {
      res.status(500).json(`User Not Activated`);
    } else {
      const random = randomstring.generate();
      const url = "Confirmation string ===> " + random;
      const sm = await SendMail(req.body.username, url);
      if (sm) {
        res.status(200).json({ random: random });
      } else {
        res.status(500).json("Email Error try again!");
      }
    }
  }
});

UserRouter.post("/setpassword", async (req, res) => {
  const user = await getSingleUser(req.body.username);
  if (!user) {
    res.status(500).json("User not found!");
  } else {
    const password = await hashPassword(req.body.password, 10);
    user.password = password;
    const success = saveUser(user);
    if (!success) {
      res.status(500).json("mongoose error occured!");
    } else {
      res.status(200).json("successfully changed the password!");
    }
  }
});

export default UserRouter;
