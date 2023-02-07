const express = require("express");
const router = express.Router();
const fs = require("fs");
const users = require("../data/users.json");
const bcrypt = require("bcrypt"); 


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
          message: "There was ana error saving the user, please try again",
        });
      }

      res.status(201).json(user);
    });

    res.status(201).send("");

  } catch {
    res.status(500).send();
  }

});

module.exports = router