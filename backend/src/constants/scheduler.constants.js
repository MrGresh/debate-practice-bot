const SCHEDULER_CONFIG = {
  CLEANUP_THRESHOLD_DAYS: parseInt(process.env.CLEANUP_THRESHOLD_DAYS, 10) || 1,
  CLEANUP_BATCH_SIZE: parseInt(process.env.CLEANUP_BATCH_SIZE, 10) || 10,
};

module.exports = {
  SCHEDULER_CONFIG,
};