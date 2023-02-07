const express = require("express");
const app = express();
const jwt = require("jsonwebtoken");
const cors = require("cors");
const bcrypt = require("bcrypt");
const port = process.env.PORT || 8080;
require("dotenv").config();

app.use(express.json());
app.use(cors());

const users = [];

app.get("/users", (req, res) => {
  res.json(users);
});

app.post("/signup", async (req, res) => {
  try {
    const hashedPassword = await bcrypt.hash(req.body.password, 10);
    const user = {
      name: req.body.name,
      username: req.body.username,
      password: hashedPassword,
    };
    users.push(user);
    res.status(201).send("")
  } catch {
    res.status(500).send();
  }
});

app.post('/login', )

app.listen(port, () => {
  console.log(`Listening on port ${port}....`);
});
