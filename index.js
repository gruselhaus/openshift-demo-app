const os = require("os");
const express = require("express");

const app = express();

app.get("/", (req, res) => {
  res.send({
    timestamp: new Date(),
    uptime: process.uptime(),
    hostname: os.hostname(),
    platform: os.platform(),
    arch: os.arch(),
    cpus: os.cpus().length,
  });
});

app.listen(8080);
