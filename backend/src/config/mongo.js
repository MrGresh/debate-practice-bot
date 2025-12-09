const mongoose = require('mongoose');
const { SERVER_CONFIG } = require("../constants");
const { getLogger } = require('../utils');
const logger = getLogger(module);

async function connectMongo() {
  const uri = SERVER_CONFIG.MONGODB_URI;
  const dbName = SERVER_CONFIG.MONGODB_DB;
  logger.info(`Connecting to MongoDB... DB: ${dbName}`);
  if (!uri) {
    throw new Error('MONGODB_URI is not set');
  }
  if (!dbName) {
    throw new Error('MONGODB_DB is not set');
  }

  await mongoose.connect(uri, {
    dbName,
    maxPoolSize: 20
  });
  logger.info(`✅ MongoDB connected: ${dbName}`);
}

module.exports = { connectMongo };