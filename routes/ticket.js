const express = require("express");
const router = express.Router();

const ticketController = require("../controllers/ticketController");
router.route("/").post(ticketController.writeTicket);

router.route("/").get(ticketController.getTickets);

module.exports = router;
