const express = require("express");
const fs = require("fs");
const tickets = require("../data/ticket.json");
const { v4: uuidv4 } = require("uuid");

exports.writeTicket = async (req, res) => {
  const { title, description,type } = req.body;

  console.log(title, description);

  if (!title || !description || !type) {
    return res.status(400).json({
      error: true,
      message: "You must provide a title, and description",
    });
  }

  const newTicket = {
    id: uuidv4(),
    type:type,
    title: title,
    description: description,
    timestamp: new Date(),
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
};

exports.getTickets = async (req, res) => {
  const showTickets = getTicket();
  res.json(showTickets);
};

function getTicket() {
  const ticketFromFile = fs.readFileSync("./data/ticket.json");
  return JSON.parse(ticketFromFile);
}
