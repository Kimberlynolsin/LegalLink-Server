const statusData = require("../data/status.json");
const fs = require("fs");

exports.getStatus = async (req, res) => {
  const showStatus = getStatus();
  res.json(showStatus);
};

function getStatus() {
  const statusFromFile = fs.readFileSync("./data/status.json");
  return JSON.parse(statusFromFile);
}
