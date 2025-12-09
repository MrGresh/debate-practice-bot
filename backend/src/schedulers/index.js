const cron = require("node-cron");
const { getLogger } = require("../utils");
const logger = getLogger(module);

const userSchedulers = require("./user.scheduler");

exports.initializeSchedulers = () => {
  cron.schedule("* * * * *", userSchedulers.cleanupUserAuthData, { // Every minute
    scheduled: true,
    timezone: "Asia/Kolkata",
  });

  logger.info("Schedulers initialized.");
};
