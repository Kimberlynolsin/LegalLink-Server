const express = require("express");
const router = express.Router();
const fs = require("fs");
const users = require("../data/users.json");
const bcrypt = require("bcrypt");
require("dotenv").config();



router.post("/signup", async (req, res) => {
  try {
    const hashedPassword = await bcrypt.hash(req.body.password, 10);

    const user = {
      name: req.body.name,
      username: req.body.username,
      password: hashedPassword,
    };
    users.push(user);

    fs.writeFile("./data/users.json", JSON.stringify(users), (err) => {
      if (err) {
        return res.status(500).json({
          error: true,
          message: "There was an error saving the user, please try again",
        });
      }
      res.status(201).json({ message: "Sign up successful" });
    });
  } catch (error) {
    console.log(error);
    res.status(500).send();
  }
});

router.post("/login", async (req, res) => {
  const userDetails = getUsers();
  const userSignedUp = userDetails.find((user) => {
    return user.username === req.body.username;
  });

  if (userSignedUp === null) {
    return res.status(400).send("Cannot find user");
  }

  const authUsername = await bcrypt.compare(
    req.body.password,
    userSignedUp.password
  );

  try {
    if (authUsername) {
      res.send('Login Sucessful');
    } else {
      res.send("Login Failed");
    }
  } catch {
    res.status(500).send();
  }

});

function getUsers() {
  const usersFromFile = fs.readFileSync("./data/users.json");
  return JSON.parse(usersFromFile);
}

module.exports = router;
