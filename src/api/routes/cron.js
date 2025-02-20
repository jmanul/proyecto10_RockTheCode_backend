

const { runCronJob } = require("../controllers/cron");

const cronRouter = require('express').Router();

cronRouter.get('/cron', runCronJob);

module.exports = cronRouter;

