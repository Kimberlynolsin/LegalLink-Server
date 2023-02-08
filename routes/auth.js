const express = require("express");
const router = express.Router();
const fs = require("fs");
const users = require("../data/users.json");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
require("dotenv").config();


router.get('/ticket',authenticateToken,(Req,res)=>{
const tickets = getTicket()
res.send(tickets)
})
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
      res.status(201).json(user);
    });

    res.status(201).send("");
  } catch {
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

  try {
    if (await bcrypt.compare(req.body.password, userSignedUp.password)) {
      const username = req.body.username;
      const userLoggedIn = { name: username };
      console.log(userLoggedIn);
      const accessToken = jwt.sign(
        userLoggedIn,
        process.env.ACCESS_TOKEN_SECRET
      );
      res.send("Login Success").json({ accessToken: accessToken });
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

function getTicket(){
  const ticketFromFile = fs.readFileSync("./data/ticket.json");
  return JSON.parse(ticketFromFile);
}

function authenticateToken(req, res, next) {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];
  if (token === null) return res.sendStatus(401);

  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, userLoggedIn) => {
    if (err) return res.sendStatus(403);
    req.user = userSignedUp;

    next();
  });
}

module.exports = router;
