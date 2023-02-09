const express = require("express");
const app = express();
const cors = require("cors");
const authRoutes = require('./routes/auth')
const ticketRoutes = require('./routes/ticket')
require("dotenv").config();

const port = process.env.PORT || 8080;

app.use(cors());
app.use(express.json());

app.use((req, res, next) => {
  if (
    req.method === "POST" &&
    req.headers["content-type"] !== "application/json"
  ) {
    return res.status(400).json({
      error: true,
      message: "This API only accepts JSON data for a POST/PUT request body",
    });
  }

  next();
});

app.use('/',authRoutes)
app.use('/ticket', ticketRoutes)

app.listen(port, () => {
  console.log(`Listening on port ${port}....`);
});
