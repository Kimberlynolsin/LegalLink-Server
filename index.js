const express = require("express");
const app = express();
const jwt = require("jsonwebtoken");
require("dotenv").config();

const cors = require("cors");
const port = process.env.PORT || 8080;

app.use(express.json());
app.use(cors());

app.use((req, res, next) => {
  if (req.url === "/signup" || req.url === "/login") {
    next();
  } else {
    const token = getToken(req);

    if (token) {
      console.log("Auth Token:", token);
      if (jwt.verify(token, process.env.ACCESS_TOKEN_SECRET)) {
        req.decode = jwt.decode(token);
        next();
      } else {
        res.status(403).json({ error: "Not Authorized." });
      }
    } else {
      res.status(403).json({ error: "No token. Unauthorized." });
    }
  }
});

function getToken(req) {
  return req.headers.authorization.split(" ")[1];
}

const users = {};

app.post("/signup", (req, res) => {
  const { username, name, password } = req.body;
  users[username] = {
    name,
    password,
  };
  console.log("Users Object:", users);
  res.json({ success: "true" });
});

app.post("/login", (req, res) => {
  const { username, password } = req.body;
  const user = users[username];
  if (user && user.password === password) {
    console.log("Found user:", user);
    res.json({ token: jwt.sign({ name: user.name },  process.env.ACCESS_TOKEN_SECRET) });
  } else {
    res.status(403).json({
      token: "",
      error: {
        message: "Error logging in. Invalid username/password combination.",
      },
    });
  }
});

app.listen(port, () => {
  console.log(`Listening on port ${port}....`);
});
