const os = require("os");
const express = require("express");

const app = express();

const health = require("@cloudnative/health-connect");
const healthCheck = new health.HealthChecker();

const livePromise = () =>
  new Promise((resolve, _reject) => {
    const appFunctioning = true;
    if (appFunctioning) {
      resolve();
    } else {
      reject(new Error("App is not functioning correctly"));
    }
  });

const liveCheck = new health.LivenessCheck("LivenessCheck", livePromise);
healthCheck.registerLivenessCheck(liveCheck);

const readyCheck = new health.PingCheck("example.com");
healthCheck.registerReadinessCheck(readyCheck);

app.use("/live", health.LivenessEndpoint(healthCheck));
app.use("/ready", health.ReadinessEndpoint(healthCheck));
app.use("/health", health.HealthEndpoint(healthCheck));

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
