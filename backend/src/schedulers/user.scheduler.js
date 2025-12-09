const { User } = require("../models");
const { getLogger } = require("../utils");
const logger = getLogger(module);
const { SCHEDULER_CONFIG } = require("../constants");

exports.cleanupUserAuthData = async () => {
  logger.info(`Starting user authentication data cleanup task...`);

  try {
    const CLEANUP_THRESHOLD_DAYS = SCHEDULER_CONFIG.CLEANUP_THRESHOLD_DAYS;
    const BATCH_SIZE = SCHEDULER_CONFIG.CLEANUP_BATCH_SIZE;

    const CLEANUP_THRESHOLD = new Date(
      Date.now() - CLEANUP_THRESHOLD_DAYS * 24 * 60 * 60 * 1000
    );

    const unverifiedUsersToClean = await User.find({
      isVerified: false,
      otpExpiry: { $lt: CLEANUP_THRESHOLD },
    })
      .select("_id")
      .limit(BATCH_SIZE)
      .lean();

    const unverifiedIds = unverifiedUsersToClean.map((u) => u._id);
    let deletedCount = 0;

    if (unverifiedIds.length > 0) {
      const deleteResult = await User.deleteMany({
        _id: { $in: unverifiedIds },
      });
      deletedCount = deleteResult.deletedCount;
    }

    const verifiedUsersToClean = await User.find({
      isVerified: true,
      otpExpiry: { $lt: CLEANUP_THRESHOLD },
    })
      .select("_id")
      .limit(BATCH_SIZE)
      .lean();

    const verifiedIds = verifiedUsersToClean.map((u) => u._id);
    let modifiedCount = 0;

    if (verifiedIds.length > 0) {
      const updateResult = await User.updateMany(
        { _id: { $in: verifiedIds } },
        {
          $unset: {
            otp: "",
            otpExpiry: "",
            tempEmail: "",
          },
        }
      );
      modifiedCount = updateResult.modifiedCount;
    }

    logger.info(`Cleanup complete`);
    logger.info(`  - Deleted ${deletedCount} unverified users.`);
    logger.info(`  - Cleared fields for ${modifiedCount} verified users.`);
  } catch (error) {
    logger.error(`Error during user auth cleanup: ${error.message}`);
  }
};
