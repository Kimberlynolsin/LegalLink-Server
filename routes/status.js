const express = require("express");
const router = express.Router();
const fs = require("fs");
const users = require("../data/users.json");
const bcrypt = require("bcrypt");
require("dotenv").config();


