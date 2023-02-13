const express = require("express");
const router = express.Router();
const fs = require("fs");
const tickets = require("../data/ticket.json");
const { v4: uuidv4 } = require("uuid");

router.post("/", (req, res) => {
  const { title, description } = req.body;

  console.log(title, description);

  if (!title || !description) {
    return res.status(400).json({
      error: true,
      message: "You must provide a title, and description",
    });
  }

  const newTicket = {
    id: uuidv4(),
    title: title,
    description: description,
    timestamp: new Date()
  };

  tickets.push(newTicket);

  fs.writeFile("./data/ticket.json", JSON.stringify(tickets), (err) => {
    if (err) {
      return res.status(500).json({
        error: true,
        message: "There was an error saving the ticket, please try again",
      });
    }

    res.status(201).json(tickets);
  });
});

router.get("/", (req, res) => {
  const showTickets = getTicket();
  res.json(showTickets);
});

function getTicket() {
  const ticketFromFile = fs.readFileSync("./data/ticket.json");
  return JSON.parse(ticketFromFile);
}

module.exports = router;
